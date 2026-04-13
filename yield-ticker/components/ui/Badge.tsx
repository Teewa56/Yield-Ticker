import { cn } from '@/lib/utils'

type BadgeVariant = 'default' | 'success' | 'danger' | 'warning' | 'info' | 'muted'
type BadgeSize = 'xs' | 'sm' | 'md'

interface BadgeProps {
  children: React.ReactNode
  variant?: BadgeVariant
  size?: BadgeSize
  className?: string
  dot?: boolean
}

const variantClasses: Record<BadgeVariant, string> = {
  default: 'bg-cyan-900/40 text-cyan-300 border-cyan-700/40',
  success: 'bg-green-900/40 text-green-400 border-green-700/40',
  danger: 'bg-red-900/40 text-red-400 border-red-700/40',
  warning: 'bg-amber-900/40 text-amber-400 border-amber-700/40',
  info: 'bg-blue-900/40 text-blue-300 border-blue-700/40',
  muted: 'bg-zinc-800/60 text-zinc-400 border-zinc-700/40',
}

const sizeClasses: Record<BadgeSize, string> = {
  xs: 'text-[9px] px-1 py-0 tracking-wider',
  sm: 'text-[10px] px-1.5 py-0.5 tracking-wider',
  md: 'text-xs px-2 py-0.5 tracking-wide',
}

const dotClasses: Record<BadgeVariant, string> = {
  default: 'bg-cyan-400',
  success: 'bg-green-400',
  danger: 'bg-red-400',
  warning: 'bg-amber-400',
  info: 'bg-blue-400',
  muted: 'bg-zinc-500',
}

export function Badge({ children, variant = 'default', size = 'sm', className, dot }: BadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1 rounded border font-mono uppercase',
        variantClasses[variant],
        sizeClasses[size],
        className
      )}
    >
      {dot && (
        <span className={cn('h-1.5 w-1.5 rounded-full', dotClasses[variant])} />
      )}
      {children}
    </span>
  )
}