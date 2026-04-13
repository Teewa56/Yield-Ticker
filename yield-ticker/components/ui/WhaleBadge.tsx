import { cn } from '@/lib/utils'
import { getWhaleLevel, getWhaleEmoji } from '@/lib/signals/whaleFilter'

interface WhaleBadgeProps {
  amountUsd: number
  className?: string
}

const levelStyles = {
  mega: 'bg-purple-900/60 text-purple-300 border-purple-600/40',
  large: 'bg-cyan-900/60 text-cyan-300 border-cyan-600/40',
  medium: 'bg-blue-900/40 text-blue-300 border-blue-700/40',
  normal: '',
}

export function WhaleBadge({ amountUsd, className }: WhaleBadgeProps) {
  const level = getWhaleLevel(amountUsd)
  if (level === 'normal') return null

  return (
    <span
      className={cn(
        'inline-flex items-center gap-0.5 rounded border px-1 py-0 font-mono text-[9px] uppercase tracking-wider',
        levelStyles[level],
        className
      )}
    >
      {getWhaleEmoji(level)} WHALE
    </span>
  )
}