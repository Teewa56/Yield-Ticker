'use client'
import { useMemo } from 'react'
import { useTerminalStore } from '@/store/terminalStore'
import { computeAPYDelta, getMomentumScore } from '@/lib/signals/apyDelta'
import type { Vault } from '@/types/vault'

export function useAPYMomentum(vault: Vault) {
  return useMemo(() => {
    return computeAPYDelta(vault.apy, vault.apyHistory)
  }, [vault.apy, vault.apyHistory])
}

export function useTopMomentumVaults(limit = 5) {
  const vaults = useTerminalStore(s => s.vaults)

  return useMemo(() => {
    return [...vaults]
      .map(v => ({ vault: v, score: getMomentumScore(v.momentum) }))
      .sort((a, b) => b.score - a.score)
      .slice(0, limit)
      .map(x => x.vault)
  }, [vaults, limit])
}