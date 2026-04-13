'use client'
import { useWhaleEvents } from '@/hooks/useWhaleDetector'
import { formatUsd, formatTime, truncateAddress, getExplorerUrl } from '@/lib/utils'
import { ChainIcon } from '@/components/ui/ChainIcon'
import { WhaleBadge } from '@/components/ui/WhaleBadge'
import { cn } from '@/lib/utils'

export function WhalePanel() {
  const whaleAlerts = useWhaleEvents(30)

  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center justify-between border-b border-cyan-900/30 px-3 py-1.5">
        <span className="font-mono text-[9px] tracking-widest text-zinc-500">🐋 WHALE ALERTS</span>
        <span className="font-mono text-[9px] text-zinc-600">{whaleAlerts.length} detected</span>
      </div>

      <div className="flex-1 overflow-y-auto scrollbar-thin divide-y divide-zinc-900/50">
        {whaleAlerts.length === 0 ? (
          <div className="flex h-full items-center justify-center p-4 text-center">
            <div>
              <div className="text-2xl mb-2">🐋</div>
              <p className="font-mono text-[10px] text-zinc-600">Monitoring for whale activity...</p>
              <p className="font-mono text-[9px] text-zinc-700 mt-1">Threshold: $50K+</p>
            </div>
          </div>
        ) : (
          whaleAlerts.map(({ event }, i) => (
            <div
              key={event.id}
              className={cn(
                'px-3 py-2.5 hover:bg-cyan-900/10 transition-colors',
                i === 0 && 'animate-fade-in',
                'border-l-2',
                event.type === 'deposit' ? 'border-green-700/60' : 'border-red-700/60'
              )}
            >
              {/* Amount + type */}
              <div className="flex items-center justify-between mb-1">
                <div className="flex items-center gap-1.5">
                  <span className={cn(
                    'font-mono text-[10px] font-bold',
                    event.type === 'deposit' ? 'text-green-400' : 'text-red-400'
                  )}>
                    {event.type === 'deposit' ? '▲' : '▼'} {formatUsd(event.amountUsd, true)}
                  </span>
                  <WhaleBadge amountUsd={event.amountUsd} />
                </div>
                <span className="font-mono text-[9px] text-zinc-600">
                  {formatTime(event.timestamp)}
                </span>
              </div>

              {/* Vault + chain */}
              <div className="flex items-center gap-1.5 mb-1">
                <ChainIcon chainId={event.vault.chainId} size="xs" />
                <span className="font-mono text-[10px] text-zinc-300 truncate">
                  {event.vault.name}
                </span>
              </div>

              {/* Wallet */}
              <div className="flex items-center justify-between">
                <a
                  href={getExplorerUrl(event.vault.chainId, event.txHash)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-mono text-[9px] text-zinc-600 hover:text-cyan-400 transition-colors"
                  onClick={e => e.stopPropagation()}
                >
                  {truncateAddress(event.wallet)} ↗
                </a>
                <span className="font-mono text-[9px] text-zinc-700">
                  APY {event.vault.apy.toFixed(2)}%
                </span>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  )
}