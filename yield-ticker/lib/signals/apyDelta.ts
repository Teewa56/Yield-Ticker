import type { APYSnapshot, MomentumData } from '@/types/vault'

export function computeAPYDelta(
  currentApy: number,
  history: APYSnapshot[]
): MomentumData {
  const now = Date.now()

  function getApyAt(msAgo: number): number | null {
    const target = now - msAgo
    const sorted = [...history].sort((a, b) => Math.abs(a.timestamp - target) - Math.abs(b.timestamp - target))
    if (!sorted.length) return null
    const closest = sorted[0]
    // Only use if within 2x the requested window
    if (Math.abs(closest.timestamp - target) > msAgo * 2) return null
    return closest.apy
  }

  const apy1hAgo = getApyAt(3600 * 1000)
  const apy6hAgo = getApyAt(6 * 3600 * 1000)
  const apy24hAgo = getApyAt(24 * 3600 * 1000)

  const delta1h = apy1hAgo !== null ? currentApy - apy1hAgo : 0
  const delta6h = apy6hAgo !== null ? currentApy - apy6hAgo : 0
  const delta24h = apy24hAgo !== null ? currentApy - apy24hAgo : 0

  const trend: MomentumData['trend'] =
    Math.abs(delta6h) < 0.05
      ? 'stable'
      : delta6h > 0
      ? 'up'
      : 'down'

  return { delta1h, delta6h, delta24h, trend }
}

export function generateMockHistory(baseApy: number, seed: number = 0): APYSnapshot[] {
  const now = Date.now()
  const snapshots: APYSnapshot[] = []
  const points = 48 // 48 x 30min = 24h

  for (let i = points; i >= 0; i--) {
    const timestamp = now - i * 30 * 60 * 1000
    const noise = (Math.sin(seed + i * 0.5) * 0.3) + (Math.cos(seed + i * 0.2) * 0.15)
    const apy = Math.max(0.1, baseApy + noise)
    snapshots.push({ timestamp, apy })
  }

  return snapshots
}

export function getMomentumScore(momentum: MomentumData): number {
  // Weighted score: recent changes matter more
  return (momentum.delta1h * 3) + (momentum.delta6h * 2) + (momentum.delta24h * 1)
}

export function formatDelta(delta: number): string {
  const sign = delta >= 0 ? '+' : ''
  return `${sign}${delta.toFixed(2)}%`
}