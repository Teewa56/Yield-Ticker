'use client'
import { useTerminalStore } from '@/store/terminalStore'
import { formatUsd, formatTimeAgo, truncateAddress } from '@/lib/utils'
import { ChainIcon } from '@/components/ui/ChainIcon'
import { WhaleBadge } from '@/components/ui/WhaleBadge'
import { cn } from '@/lib/utils'

export function LiveFeed() {
  const events = useTerminalStore(s => s.feedEvents)

  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center justify-between border-b border-cyan-900/30 px-3 py-1.5">
        <span className="font-mono text-[9px] tracking-widest text-zinc-500">LIVE EVENT FEED</span>
        <span className="font-mono text-[9px] text-zinc-600">{events.length} events</span>
      </div>

      <div className="flex-1 overflow-y-auto scrollbar-thin">
        {events.length === 0 ? (
          <div className="flex h-full items-center justify-center">
            <span className="font-mono text-[10px] text-zinc-600">Waiting for events...</span>
          </div>
        ) : (
          <div className="divide-y divide-zinc-900/50">
            {events.map((event, i) => (
              <div
                key={event.id}
                className={cn(
                  'flex flex-col gap-0.5 px-3 py-2 transition-colors hover:bg-cyan-900/10',
                  i === 0 && 'animate-fade-in',
                  event.isWhale && 'bg-cyan-900/5 border-l-2 border-cyan-700/50'
                )}
              >
                {/* Top row */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5">
                    <span
                      className={cn(
                        'font-mono text-[9px] font-bold tracking-wider',
                        event.type === 'deposit' ? 'text-green-400' : 'text-red-400'
                      )}
                    >
                      {event.type === 'deposit' ? '▲ DEP' : '▼ WDR'}
                    </span>
                    <ChainIcon chainId={event.vault.chainId} size="xs" />
                    <span className="font-mono text-[10px] text-zinc-300 truncate max-w-[100px]">
                      {event.vault.name}
                    </span>
                  </div>
                  <span
                    className={cn(
                      'font-mono text-[10px] font-bold tabular-nums',
                      event.type === 'deposit' ? 'text-green-400' : 'text-red-400'
                    )}
                  >
                    {event.type === 'withdrawal' ? '-' : '+'}{formatUsd(event.amountUsd, true)}
                  </span>
                </div>

                {/* Bottom row */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5">
                    <span className="font-mono text-[9px] text-zinc-600">
                      {truncateAddress(event.wallet, 4)}
                    </span>
                    {event.isWhale && <WhaleBadge amountUsd={event.amountUsd} />}
                  </div>
                  <span className="font-mono text-[9px] text-zinc-600">
                    {formatTimeAgo(event.timestamp)}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}