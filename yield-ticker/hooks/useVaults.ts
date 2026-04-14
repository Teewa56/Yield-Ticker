'use client'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import { useEffect } from 'react'
import { getVaults } from '@/lib/lifi/client'
import type { Vault } from '@/types/vault'
import type { LiFiVaultResponse } from '@/lib/lifi/types'
import { generateMockHistory } from '@/lib/signals/apyDelta'
import { computeAPYDelta } from '@/lib/signals/apyDelta'
import { useTerminalStore } from '@/store/terminalStore'
import { useFilterStore } from '@/store/terminalStore'
import { CHAIN_CONFIG } from '@/types/chain'
import { useErrorNotifier } from '@/lib/errors/hooks'

function mapVault(raw: LiFiVaultResponse, index: number): Vault {
  const chainEntry = Object.values(CHAIN_CONFIG).find(c => c.id === raw.chainId)
  const chainName = chainEntry?.name ?? 'ethereum'
  const tokenInfo = raw.underlyingTokens?.[0] ?? (typeof raw.token === 'object' ? raw.token : undefined)
  const apyBase = raw.analytics?.apy?.base ?? 0
  const apyReward = raw.analytics?.apy?.reward ?? 0
  const apyTotal = raw.analytics?.apy?.total ?? apyBase + apyReward
  const tvlUsd = Number(raw.analytics?.tvl?.usd ?? raw.tvlUsd ?? 0)
  const history = generateMockHistory(apyTotal, index)
  const momentum = computeAPYDelta(apyTotal, history)

  return {
    id: raw.slug ?? raw.id ?? raw.address,
    name: raw.name,
    protocol: typeof raw.protocol === 'string' ? raw.protocol : raw.protocol.name,
    chain: chainName,
    chainId: raw.chainId,
    token: tokenInfo?.symbol ?? 'UNKNOWN',
    tokenAddress: tokenInfo?.address ?? raw.address,
    apy: apyTotal,
    apyBase,
    apyReward,
    tvl: tvlUsd,
    tvlUsd,
    contractAddress: raw.address,
    logoUri: tokenInfo?.logoURI,
    protocolLogoUri: typeof raw.protocol === 'object' ? raw.protocol.logoURI : undefined,
    audited: raw.audited ?? false,
    auditUrl: raw.auditUrl,
    launchDate: raw.createdAt ?? raw.syncedAt,
    category: 'lending',
    riskLevel: tvlUsd > 100_000_000 ? 'low' : tvlUsd > 10_000_000 ? 'medium' : 'high',
    apyHistory: history,
    momentum,
  }
}

export function useVaults() {
  const setVaults = useTerminalStore(s => s.setVaults)
  const notifyError = useErrorNotifier()

  const query = useQuery({
    queryKey: ['vaults'],
    queryFn: async () => {
      const res = await getVaults({ limit: 100 })
      return (res.data ?? res.vaults ?? []).map(mapVault)
    },
    staleTime: 30_000,
    refetchInterval: 60_000,
  })

  // Handle query errors
  useEffect(() => {
    if (query.error) {
      notifyError(query.error)
    }
  }, [query.error, notifyError])

  useEffect(() => {
    if (query.data) setVaults(query.data)
  }, [query.data, setVaults])

  return query
}

export function useFilteredVaults() {
  const { data: vaults = [] } = useVaults()
  const { filter, sort } = useFilterStore()

  let result = vaults.filter(v => {
    if (filter.chains.length && !filter.chains.includes(v.chainId)) return false
    if (filter.protocols.length && !filter.protocols.includes(v.protocol)) return false
    if (filter.tokens.length && !filter.tokens.includes(v.token)) return false
    if (v.apy < filter.minApy || v.apy > filter.maxApy) return false
    if (v.tvlUsd < filter.minTvl) return false
    if (filter.riskLevels.length && !filter.riskLevels.includes(v.riskLevel)) return false
    if (filter.searchQuery) {
      const q = filter.searchQuery.toLowerCase()
      if (!v.name.toLowerCase().includes(q) && !v.protocol.toLowerCase().includes(q) && !v.token.toLowerCase().includes(q)) return false
    }
    return true
  })

  result = [...result].sort((a, b) => {
    const dir = sort.direction === 'asc' ? 1 : -1
    switch (sort.key) {
      case 'apy': return (a.apy - b.apy) * dir
      case 'tvl': return (a.tvlUsd - b.tvlUsd) * dir
      case 'momentum': return (a.momentum.delta6h - b.momentum.delta6h) * dir
      case 'name': return a.name.localeCompare(b.name) * dir
      case 'chain': return a.chain.localeCompare(b.chain) * dir
      default: return 0
    }
  })

  return result
}