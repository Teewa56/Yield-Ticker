import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'
import { formatDistanceToNow } from 'date-fns'

export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs))
}

export function formatUsd(amount: number, compact = false): string {
  if (compact) {
    if (amount >= 1_000_000_000) return `$${(amount / 1_000_000_000).toFixed(2)}B`
    if (amount >= 1_000_000) return `$${(amount / 1_000_000).toFixed(2)}M`
    if (amount >= 1_000) return `$${(amount / 1_000).toFixed(1)}K`
  }
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 2,
  }).format(amount)
}

export function formatApy(apy: number): string {
  return `${apy.toFixed(2)}%`
}

export function truncateAddress(address: string, chars = 4): string {
  if (!address) return ''
  return `${address.slice(0, chars + 2)}...${address.slice(-chars)}`
}

export function formatTimeAgo(timestamp: number): string {
  // timestamp can be in seconds or ms
  const ms = timestamp < 1e12 ? timestamp * 1000 : timestamp
  return formatDistanceToNow(new Date(ms), { addSuffix: true })
}

export function formatTime(timestamp: number): string {
  const ms = timestamp < 1e12 ? timestamp * 1000 : timestamp
  return new Date(ms).toLocaleTimeString('en-US', {
    hour12: false,
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  })
}

export function getExplorerUrl(chainId: number, txHash: string): string {
  const explorers: Record<number, string> = {
    1: 'https://etherscan.io/tx/',
    42161: 'https://arbiscan.io/tx/',
    10: 'https://optimistic.etherscan.io/tx/',
    8453: 'https://basescan.org/tx/',
    137: 'https://polygonscan.com/tx/',
    43114: 'https://snowtrace.io/tx/',
    56: 'https://bscscan.com/tx/',
    534352: 'https://scrollscan.com/tx/',
    59144: 'https://lineascan.build/tx/',
    81457: 'https://blastscan.io/tx/',
  }
  const base = explorers[chainId] || 'https://etherscan.io/tx/'
  return `${base}${txHash}`
}

export function interpolateColor(value: number, min: number, max: number): string {
  // Returns a green-to-red color based on normalized value
  const normalized = (value - min) / (max - min || 1)
  if (normalized >= 0.5) {
    // green range
    const intensity = (normalized - 0.5) * 2
    return `rgba(74, 222, 128, ${0.2 + intensity * 0.6})`
  } else {
    // red range
    const intensity = (0.5 - normalized) * 2
    return `rgba(248, 113, 113, ${0.2 + intensity * 0.6})`
  }
}

export function sleep(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms))
}