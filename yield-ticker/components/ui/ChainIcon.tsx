import { CHAIN_CONFIG } from '@/types/chain'
import { cn } from '@/lib/utils'

interface ChainIconProps {
  chainId: number
  size?: 'xs' | 'sm' | 'md'
  showName?: boolean
  className?: string
}

const sizeMap = { xs: 'h-3 w-3', sm: 'h-4 w-4', md: 'h-5 w-5' }
const textMap = { xs: 'text-[9px]', sm: 'text-[10px]', md: 'text-xs' }

export function ChainIcon({ chainId, size = 'sm', showName, className }: ChainIconProps) {
  const chain = Object.values(CHAIN_CONFIG).find(c => c.id === chainId)
  if (!chain) return null

  return (
    <span className={cn('inline-flex items-center gap-1', className)}>
      <img
        src={chain.logoUri}
        alt={chain.displayName}
        className={cn(sizeMap[size], 'rounded-full object-cover')}
        onError={(e) => {
          const el = e.currentTarget
          el.style.display = 'none'
          const next = el.nextElementSibling as HTMLElement | null
          if (next) next.style.display = 'flex'
        }}
      />
      {/* Fallback dot */}
      <span
        className={cn(sizeMap[size], 'hidden rounded-full flex-shrink-0')}
        style={{ backgroundColor: chain.color }}
      />
      {showName && (
        <span className={cn('font-mono', textMap[size], 'text-zinc-400')}>
          {chain.displayName}
        </span>
      )}
    </span>
  )
}