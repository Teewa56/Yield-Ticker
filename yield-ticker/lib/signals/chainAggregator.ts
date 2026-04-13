import type { VaultEvent } from '@/types/vault'
import type { ChainFlow, Chain } from '@/types/chain'
import { CHAIN_CONFIG } from '@/types/chain'

export function aggregateChainFlows(
  events: VaultEvent[],
  windowMs: number = 24 * 3600 * 1000
): ChainFlow[] {
  const cutoff = Date.now() - windowMs
  const recent = events.filter(e => e.timestamp * 1000 >= cutoff)

  const flowMap = new Map<number, {
    chain: Chain
    inflow: number
    outflow: number
    txCount: number
    protocols: Record<string, number>
  }>()

  // Initialize all known chains
  Object.values(CHAIN_CONFIG).forEach(chain => {
    flowMap.set(chain.id, {
      chain: chain.name,
      inflow: 0,
      outflow: 0,
      txCount: 0,
      protocols: {},
    })
  })

  recent.forEach(event => {
    const entry = flowMap.get(event.vault.chainId)
    if (!entry) return

    if (event.type === 'deposit') {
      entry.inflow += event.amountUsd
    } else {
      entry.outflow += event.amountUsd
    }
    entry.txCount++
    entry.protocols[event.vault.protocol] = (entry.protocols[event.vault.protocol] || 0) + event.amountUsd
  })

  return Array.from(flowMap.entries())
    .map(([chainId, data]) => ({
      chain: data.chain,
      chainId,
      netFlowUsd: data.inflow - data.outflow,
      inflowUsd: data.inflow,
      outflowUsd: data.outflow,
      txCount: data.txCount,
      dominantProtocol: getDominantProtocol(data.protocols),
    }))
    .filter(f => f.txCount > 0 || f.inflowUsd > 0)
    .sort((a, b) => Math.abs(b.netFlowUsd) - Math.abs(a.netFlowUsd))
}

function getDominantProtocol(protocols: Record<string, number>): string {
  if (!Object.keys(protocols).length) return '—'
  return Object.entries(protocols).sort((a, b) => b[1] - a[1])[0][0]
}

export function getFlowIntensity(netFlowUsd: number, maxAbsFlow: number): number {
  if (maxAbsFlow === 0) return 0
  return Math.abs(netFlowUsd) / maxAbsFlow
}