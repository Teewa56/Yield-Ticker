import { create } from 'zustand'
import { persist } from 'zustand/middleware'

interface SettingsState {
  whaleThreshold: number
  pollInterval: number
  soundAlerts: boolean
  compactMode: boolean
  showWhaleOnly: boolean
  defaultChainFilter: number[]

  setWhaleThreshold: (value: number) => void
  setPollInterval: (value: number) => void
  setSoundAlerts: (value: boolean) => void
  setCompactMode: (value: boolean) => void
  setShowWhaleOnly: (value: boolean) => void
  setDefaultChainFilter: (chains: number[]) => void
  reset: () => void
}

const DEFAULTS = {
  whaleThreshold: Number(process.env.NEXT_PUBLIC_WHALE_THRESHOLD) || 50000,
  pollInterval: Number(process.env.NEXT_PUBLIC_POLL_INTERVAL) || 15000,
  soundAlerts: false,
  compactMode: false,
  showWhaleOnly: false,
  defaultChainFilter: [],
}

export const useSettingsStore = create<SettingsState>()(
  persist(
    (set) => ({
      ...DEFAULTS,
      setWhaleThreshold: (whaleThreshold) => set({ whaleThreshold }),
      setPollInterval: (pollInterval) => set({ pollInterval }),
      setSoundAlerts: (soundAlerts) => set({ soundAlerts }),
      setCompactMode: (compactMode) => set({ compactMode }),
      setShowWhaleOnly: (showWhaleOnly) => set({ showWhaleOnly }),
      setDefaultChainFilter: (defaultChainFilter) => set({ defaultChainFilter }),
      reset: () => set(DEFAULTS),
    }),
    { name: 'yield-ticker-settings' }
  )
)