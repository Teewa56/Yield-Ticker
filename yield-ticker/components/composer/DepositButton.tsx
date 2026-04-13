'use client'
import { useTerminalStore } from '@/store/terminalStore'
import type { Vault } from '@/types/vault'
import { cn } from '@/lib/utils'

interface DepositButtonProps {
  vault: Vault
  size?: 'xs' | 'sm' | 'md'
  className?: string
}

export function DepositButton({ vault, size = 'sm', className }: DepositButtonProps) {
  const selectVault = useTerminalStore(s => s.selectVault)

  const sizeClasses = {
    xs: 'px-2 py-0.5 text-[9px]',
    sm: 'px-3 py-1 text-[10px]',
    md: 'px-4 py-1.5 text-xs',
  }

  return (
    <button
      onClick={() => selectVault(vault)}
      className={cn(
        'rounded border border-cyan-800/50 bg-cyan-900/20 font-mono font-bold tracking-wider text-cyan-400',
        'transition-all hover:bg-cyan-900/50 hover:border-cyan-600/70 hover:text-cyan-300',
        'active:scale-95',
        sizeClasses[size],
        className
      )}
    >
      DEPOSIT
    </button>
  )
}