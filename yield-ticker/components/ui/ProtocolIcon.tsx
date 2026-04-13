import { cn } from '@/lib/utils'

interface ProtocolIconProps {
  protocol: string
  logoUri?: string
  size?: 'xs' | 'sm' | 'md'
  showName?: boolean
  className?: string
}

const PROTOCOL_COLORS: Record<string, string> = {
  morpho: '#4A90E2',
  aave: '#B6509E',
  euler: '#E8B84B',
  pendle: '#3B82F6',
  ethena: '#34D399',
  etherfi: '#6366F1',
  compound: '#00D395',
  yearn: '#006AE3',
  convex: '#3A3A3A',
  curve: '#F5A623',
}

const sizeMap = { xs: 'h-3 w-3 text-[8px]', sm: 'h-4 w-4 text-[9px]', md: 'h-5 w-5 text-[10px]' }

export function ProtocolIcon({ protocol, logoUri, size = 'sm', showName, className }: ProtocolIconProps) {
  const key = protocol.toLowerCase().split(' ')[0]
  const color = PROTOCOL_COLORS[key] ?? '#64748b'
  const initials = protocol.slice(0, 2).toUpperCase()

  return (
    <span className={cn('inline-flex items-center gap-1', className)}>
      {logoUri ? (
        <img
          src={logoUri}
          alt={protocol}
          className={cn(sizeMap[size].split(' ').slice(0, 2).join(' '), 'rounded-sm object-contain')}
          onError={(e) => {
            const el = e.currentTarget
            el.style.display = 'none'
            const next = el.nextElementSibling as HTMLElement | null
            if (next) next.style.display = 'flex'
          }}
        />
      ) : null}
      <span
        className={cn(
          sizeMap[size],
          logoUri ? 'hidden' : 'flex',
          'items-center justify-center rounded-sm font-mono font-bold text-white flex-shrink-0'
        )}
        style={{ backgroundColor: color }}
      >
        {initials}
      </span>
      {showName && (
        <span className="text-[10px] font-mono text-zinc-400">{protocol}</span>
      )}
    </span>
  )
}