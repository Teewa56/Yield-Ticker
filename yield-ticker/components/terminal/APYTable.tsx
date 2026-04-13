'use client'
import { useFilteredVaults } from '@/hooks/useVaults'
import { useTerminalStore, useFilterStore } from '@/store/terminalStore'
import { formatUsd, formatApy } from '@/lib/utils'
import { ChainIcon } from '@/components/ui/ChainIcon'
import { ProtocolIcon } from '@/components/ui/ProtocolIcon'
import { MomentumIndicator } from '@/components/ui/MomentumIndicator'
import { Badge } from '@/components/ui/Badge'
import { DepositButton } from '@/components/composer/DepositButton'
import { cn } from '@/lib/utils'
import type { SortKey } from '@/types/vault'

const COLS = [
  { label: 'VAULT', key: null, width: 'flex-1 min-w-0' },
  { label: 'CHAIN', key: null, width: 'w-20' },
  { label: 'APY', key: 'apy' as SortKey, width: 'w-20 text-right' },
  { label: '1H', key: null, width: 'w-16 text-right' },
  { label: '6H', key: null, width: 'w-16 text-right' },
  { label: '24H', key: null, width: 'w-16 text-right' },
  { label: 'TVL', key: 'tvl' as SortKey, width: 'w-24 text-right' },
  { label: '', key: null, width: 'w-20' },
]

export function APYTable() {
  const vaults = useFilteredVaults()
  const selectVault = useTerminalStore(s => s.selectVault)
  const { sort, setSort } = useFilterStore()

  const handleSort = (key: SortKey | null) => {
    if (!key) return
    if (sort.key === key) {
      setSort({ key, direction: sort.direction === 'desc' ? 'asc' : 'desc' })
    } else {
      setSort({ key, direction: 'desc' })
    }
  }

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="flex items-center border-b border-cyan-900/30 px-3 py-1.5 bg-terminal-surface/40">
        {COLS.map(({ label, key, width }) => (
          <div
            key={label || 'action'}
            className={cn(
              'font-mono text-[9px] tracking-widest text-zinc-600',
              width,
              key && 'cursor-pointer hover:text-cyan-500 select-none',
              sort.key === key && 'text-cyan-500'
            )}
            onClick={() => handleSort(key)}
          >
            {label}
            {sort.key === key && (
              <span className="ml-0.5">{sort.direction === 'desc' ? '▼' : '▲'}</span>
            )}
          </div>
        ))}
      </div>

      {/* Rows */}
      <div className="flex-1 overflow-y-auto scrollbar-thin divide-y divide-zinc-900/40">
        {vaults.length === 0 ? (
          <div className="flex h-40 items-center justify-center">
            <span className="font-mono text-[10px] text-zinc-600">Loading vaults...</span>
          </div>
        ) : (
          vaults.map((vault) => (
            <div
              key={vault.id}
              className="flex items-center gap-0 px-3 py-2 hover:bg-cyan-900/10 cursor-pointer transition-colors group"
              onClick={() => selectVault(vault)}
            >
              {/* Name */}
              <div className="flex-1 min-w-0 flex items-center gap-2">
                <ProtocolIcon protocol={vault.protocol} logoUri={vault.protocolLogoUri} size="sm" />
                <div className="min-w-0">
                  <div className="font-mono text-[11px] text-zinc-200 truncate group-hover:text-cyan-300 transition-colors">
                    {vault.name}
                  </div>
                  <div className="font-mono text-[9px] text-zinc-600">{vault.protocol}</div>
                </div>
              </div>

              {/* Chain */}
              <div className="w-20">
                <ChainIcon chainId={vault.chainId} size="sm" showName />
              </div>

              {/* APY */}
              <div className="w-20 text-right">
                <span className={cn(
                  'font-mono text-xs font-bold tabular-nums',
                  vault.apy >= 10 ? 'text-green-400' : vault.apy >= 5 ? 'text-cyan-300' : 'text-zinc-400'
                )}>
                  {formatApy(vault.apy)}
                </span>
              </div>

              {/* Deltas */}
              <div className="w-16 text-right">
                <MomentumIndicator momentum={vault.momentum} window="1h" />
              </div>
              <div className="w-16 text-right">
                <MomentumIndicator momentum={vault.momentum} window="6h" />
              </div>
              <div className="w-16 text-right">
                <MomentumIndicator momentum={vault.momentum} window="24h" />
              </div>

              {/* TVL */}
              <div className="w-24 text-right font-mono text-[10px] tabular-nums text-zinc-400">
                {formatUsd(vault.tvlUsd, true)}
              </div>

              {/* Action */}
              <div className="w-20 flex justify-end" onClick={e => e.stopPropagation()}>
                <DepositButton vault={vault} size="xs" />
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  )
}