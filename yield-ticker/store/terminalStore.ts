import { create } from 'zustand'
import type { Vault, VaultEvent, VaultFilter, VaultSort } from '@/types/vault'

const MAX_FEED_EVENTS = 200

interface TerminalState {
  vaults: Vault[]
  feedEvents: VaultEvent[]
  selectedVault: Vault | null
  drawerOpen: boolean
  totalTvl: number
  activeChains: number
  eventCount: number
  isConnected: boolean

  // Actions
  setVaults: (vaults: Vault[]) => void
  pushEvent: (event: VaultEvent) => void
  pushEvents: (events: VaultEvent[]) => void
  selectVault: (vault: Vault | null) => void
  setDrawerOpen: (open: boolean) => void
  setConnected: (connected: boolean) => void
  incrementEventCount: () => void
}

export const useTerminalStore = create<TerminalState>((set) => ({
  vaults: [],
  feedEvents: [],
  selectedVault: null,
  drawerOpen: false,
  totalTvl: 0,
  activeChains: 0,
  eventCount: 0,
  isConnected: false,

  setVaults: (vaults) => {
    const totalTvl = vaults.reduce((sum, v) => sum + v.tvlUsd, 0)
    const activeChains = new Set(vaults.map(v => v.chainId)).size
    set({ vaults, totalTvl, activeChains })
  },

  pushEvent: (event) =>
    set(state => ({
      feedEvents: [event, ...state.feedEvents].slice(0, MAX_FEED_EVENTS),
      eventCount: state.eventCount + 1,
    })),

  pushEvents: (events) =>
    set(state => ({
      feedEvents: [...events, ...state.feedEvents].slice(0, MAX_FEED_EVENTS),
      eventCount: state.eventCount + events.length,
    })),

  selectVault: (vault) =>
    set({ selectedVault: vault, drawerOpen: vault !== null }),

  setDrawerOpen: (open) =>
    set(state => ({ drawerOpen: open, selectedVault: open ? state.selectedVault : null })),

  setConnected: (connected) => set({ isConnected: connected }),

  incrementEventCount: () =>
    set(state => ({ eventCount: state.eventCount + 1 })),
}))

// Filter & sort state — separate store to avoid re-renders on vault list
interface FilterState {
  filter: VaultFilter
  sort: VaultSort
  setFilter: (filter: Partial<VaultFilter>) => void
  setSort: (sort: VaultSort) => void
  resetFilter: () => void
}

const DEFAULT_FILTER: VaultFilter = {
  chains: [],
  protocols: [],
  tokens: [],
  minApy: 0,
  maxApy: 100,
  minTvl: 0,
  riskLevels: [],
  searchQuery: '',
}

export const useFilterStore = create<FilterState>((set) => ({
  filter: DEFAULT_FILTER,
  sort: { key: 'momentum', direction: 'desc' },

  setFilter: (partial) =>
    set(state => ({ filter: { ...state.filter, ...partial } })),

  setSort: (sort) => set({ sort }),

  resetFilter: () => set({ filter: DEFAULT_FILTER }),
}))