'use client'
import { useChainFlows } from '@/hooks/useChainFlows'
import { formatUsd } from '@/lib/utils'
import { ChainIcon } from '@/components/ui/ChainIcon'
import { getFlowIntensity } from '@/lib/signals/chainAggregator'
import { cn } from '@/lib/utils'

export function RotationMap() {
  const flows = useChainFlows(24)
  const maxAbs = flows.reduce((m, f) => Math.max(m, Math.abs(f.netFlowUsd)), 0)

  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center justify-between border-b border-cyan-900/30 px-3 py-1.5">
        <span className="font-mono text-[9px] tracking-widest text-zinc-500">24H CAPITAL ROTATION</span>
        <div className="flex items-center gap-2">
          <span className="font-mono text-[9px] text-green-600">▲ INFLOW</span>
          <span className="font-mono text-[9px] text-red-600">▼ OUTFLOW</span>
        </div>
      </div>

      {flows.length === 0 ? (
        <div className="flex flex-1 items-center justify-center">
          <span className="font-mono text-[10px] text-zinc-600">Aggregating chain flows...</span>
        </div>
      ) : (
        <div className="flex-1 overflow-y-auto scrollbar-thin p-2 grid grid-cols-2 gap-1.5 auto-rows-min">
          {flows.slice(0, 12).map((flow) => {
            const intensity = getFlowIntensity(flow.netFlowUsd, maxAbs)
            const isPositive = flow.netFlowUsd >= 0
            const opacity = 0.1 + intensity * 0.5

            return (
              <div
                key={flow.chainId}
                className="relative rounded border border-zinc-800/60 p-2 overflow-hidden"
                style={{
                  backgroundColor: isPositive
                    ? `rgba(74, 222, 128, ${opacity * 0.3})`
                    : `rgba(248, 113, 113, ${opacity * 0.3})`,
                  borderColor: isPositive
                    ? `rgba(74, 222, 128, ${opacity})`
                    : `rgba(248, 113, 113, ${opacity})`,
                }}
              >
                <div className="flex items-center justify-between mb-1">
                  <ChainIcon chainId={flow.chainId} size="xs" showName />
                  <span className={cn(
                    'font-mono text-[9px] font-bold',
                    isPositive ? 'text-green-400' : 'text-red-400'
                  )}>
                    {isPositive ? '▲' : '▼'} {formatUsd(Math.abs(flow.netFlowUsd), true)}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="font-mono text-[8px] text-zinc-600">
                    {flow.txCount} txs
                  </span>
                  <span className="font-mono text-[8px] text-zinc-600 truncate max-w-[60px]">
                    {flow.dominantProtocol}
                  </span>
                </div>
                {/* Intensity bar */}
                <div className="absolute bottom-0 left-0 h-0.5 transition-all duration-500"
                  style={{
                    width: `${intensity * 100}%`,
                    backgroundColor: isPositive ? '#4ade80' : '#f87171',
                  }}
                />
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}