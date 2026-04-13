import { cn } from '@/lib/utils'
import { formatDelta } from '@/lib/signals/apyDelta'
import type { MomentumData } from '@/types/vault'

interface MomentumIndicatorProps {
  momentum: MomentumData
  window?: '1h' | '6h' | '24h'
  showArrow?: boolean
  className?: string
}

export function MomentumIndicator({
  momentum,
  window = '6h',
  showArrow = true,
  className,
}: MomentumIndicatorProps) {
  const delta = window === '1h' ? momentum.delta1h : window === '6h' ? momentum.delta6h : momentum.delta24h
  const isUp = delta > 0.01
  const isDown = delta < -0.01

  return (
    <span
      className={cn(
        'inline-flex items-center gap-0.5 font-mono text-[10px] tabular-nums',
        isUp && 'text-green-400',
        isDown && 'text-red-400',
        !isUp && !isDown && 'text-zinc-500',
        className
      )}
    >
      {showArrow && (
        <span className="text-[8px]">
          {isUp ? '▲' : isDown ? '▼' : '─'}
        </span>
      )}
      {formatDelta(delta)}
    </span>
  )
}

export function MomentumBars({ momentum }: { momentum: MomentumData }) {
  const windows: Array<{ label: string; delta: number }> = [
    { label: '1H', delta: momentum.delta1h },
    { label: '6H', delta: momentum.delta6h },
    { label: '24H', delta: momentum.delta24h },
  ]

  return (
    <div className="flex items-center gap-1.5">
      {windows.map(({ label, delta }) => {
        const isUp = delta > 0.01
        const isDown = delta < -0.01
        return (
          <div key={label} className="flex flex-col items-center gap-0.5">
            <span className={cn(
              'text-[9px] font-mono',
              isUp && 'text-green-400',
              isDown && 'text-red-400',
              !isUp && !isDown && 'text-zinc-600',
            )}>
              {delta > 0 ? '+' : ''}{delta.toFixed(1)}%
            </span>
            <span className="text-[8px] text-zinc-600 font-mono">{label}</span>
          </div>
        )
      })}
    </div>
  )
}