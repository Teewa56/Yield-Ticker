import { create } from 'zustand'
import { persist } from 'zustand/middleware'

interface WatchlistState {
  watchedVaultIds: string[]
  addToWatchlist: (vaultId: string) => void
  removeFromWatchlist: (vaultId: string) => void
  isWatched: (vaultId: string) => boolean
  toggleWatchlist: (vaultId: string) => void
}

export const useWatchlistStore = create<WatchlistState>()(
  persist(
    (set, get) => ({
      watchedVaultIds: [],

      addToWatchlist: (vaultId) =>
        set(state => ({
          watchedVaultIds: state.watchedVaultIds.includes(vaultId)
            ? state.watchedVaultIds
            : [...state.watchedVaultIds, vaultId],
        })),

      removeFromWatchlist: (vaultId) =>
        set(state => ({
          watchedVaultIds: state.watchedVaultIds.filter(id => id !== vaultId),
        })),

      isWatched: (vaultId) => get().watchedVaultIds.includes(vaultId),

      toggleWatchlist: (vaultId) => {
        if (get().isWatched(vaultId)) {
          get().removeFromWatchlist(vaultId)
        } else {
          get().addToWatchlist(vaultId)
        }
      },
    }),
    { name: 'yield-ticker-watchlist' }
  )
)