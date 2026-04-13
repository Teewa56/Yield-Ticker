'use client'
import { useEffect, useRef, useCallback } from 'react'
import { useTerminalStore } from '@/store/terminalStore'
import { useSettingsStore } from '@/store/settingsStore'
import type { VaultEvent, Vault } from '@/types/vault'
import { isWhale } from '@/lib/signals/whaleFilter'

const WALLETS = [
  '0x3f5CE5FBFe3E9af3971dD833D26BA9b5C936f0bE',
  '0x28C6c06298d514Db089934071355E5743bf21d60',
  '0xE592427A0AEce92De3Edee1F18E0157C05861564',
  '0x7a250d5630B4cF539739dF2C5dAcb4c659F2488D',
  '0x1F98431c8aD98523631AE4a59f267346ea31F984',
  '0xC36442b4a4522E871399CD717aBDD847Ab11FE88',
  '0x68b3465833fb72A70ecDF485E0e4C7bD8665Fc45',
]

let eventCounter = 0

function generateEvent(vaults: Vault[], threshold: number): VaultEvent | null {
  if (!vaults.length) return null
  const vault = vaults[Math.floor(Math.random() * vaults.length)]
  const isDeposit = Math.random() > 0.35
  const isLarge = Math.random() < 0.08
  const baseAmount = isLarge
    ? Math.random() * 2_000_000 + 100_000
    : Math.random() * 50_000 + 100

  const amountUsd = Number(baseAmount.toFixed(2))
  const wallet = WALLETS[Math.floor(Math.random() * WALLETS.length)]

  eventCounter++
  return {
    id: `evt-${Date.now()}-${eventCounter}`,
    type: isDeposit ? 'deposit' : 'withdrawal',
    vault,
    amount: amountUsd / (vault.apy || 1),
    amountUsd,
    txHash: `0x${Math.random().toString(16).slice(2).padEnd(64, '0')}`,
    wallet,
    timestamp: Math.floor(Date.now() / 1000),
    isWhale: isWhale(amountUsd, threshold),
    blockNumber: 19_000_000 + Math.floor(Math.random() * 100_000),
  }
}

export function useLiveFeed() {
  const vaults = useTerminalStore(s => s.vaults)
  const pushEvent = useTerminalStore(s => s.pushEvent)
  const pollInterval = useSettingsStore(s => s.pollInterval)
  const whaleThreshold = useSettingsStore(s => s.whaleThreshold)
  const vaultsRef = useRef(vaults)
  const thresholdRef = useRef(whaleThreshold)

  useEffect(() => { vaultsRef.current = vaults }, [vaults])
  useEffect(() => { thresholdRef.current = whaleThreshold }, [whaleThreshold])

  const tick = useCallback(() => {
    const currentVaults = vaultsRef.current
    if (!currentVaults.length) return

    // Generate 1-3 events per tick
    const count = Math.floor(Math.random() * 3) + 1
    for (let i = 0; i < count; i++) {
      const event = generateEvent(currentVaults, thresholdRef.current)
      if (event) {
        setTimeout(() => pushEvent(event), i * 600)
      }
    }
  }, [pushEvent])

  useEffect(() => {
    if (!vaults.length) return
    // Initial burst
    tick()
    const id = setInterval(tick, pollInterval)
    return () => clearInterval(id)
  }, [vaults.length, pollInterval, tick])
}