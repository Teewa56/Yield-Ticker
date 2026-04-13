import type { VaultEvent, WhaleAlert } from '@/types/vault'

const DEFAULT_THRESHOLD = Number(process.env.NEXT_PUBLIC_WHALE_THRESHOLD) || 50000

export function isWhale(amountUsd: number, threshold: number = DEFAULT_THRESHOLD): boolean {
  return amountUsd >= threshold
}

export function filterWhaleEvents(
  events: VaultEvent[],
  threshold: number = DEFAULT_THRESHOLD
): WhaleAlert[] {
  return events
    .filter(e => isWhale(e.amountUsd, threshold))
    .map(e => ({ event: e, alertedAt: Date.now() }))
}

export function getWhaleLevel(amountUsd: number): 'mega' | 'large' | 'medium' | 'normal' {
  if (amountUsd >= 1_000_000) return 'mega'
  if (amountUsd >= 500_000) return 'large'
  if (amountUsd >= 50_000) return 'medium'
  return 'normal'
}

export function getWhaleEmoji(level: ReturnType<typeof getWhaleLevel>): string {
  switch (level) {
    case 'mega': return '🐳'
    case 'large': return '🐋'
    case 'medium': return '🐬'
    default: return ''
  }
}