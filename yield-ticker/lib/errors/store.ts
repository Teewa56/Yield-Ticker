import { create } from 'zustand'
import { AppError } from './types'
import type { ErrorSeverity } from './types'

export interface ErrorState {
  errors: AppError[]
  addError: (error: AppError) => void
  removeError: (id: string) => void
  clearErrors: () => void
  dismissError: (id: string) => void
  getLatestError: () => AppError | null
  getErrorsByCategory: (category: string) => AppError[]
}

// Simple ID generator for errors
let errorIdCounter = 0
const errorIds = new WeakMap<AppError, string>()

export function getErrorId(error: AppError): string {
  if (!errorIds.has(error)) {
    errorIds.set(error, `error-${errorIdCounter++}-${Date.now()}`)
  }
  return errorIds.get(error)!
}

export const useErrorStore = create<ErrorState>((set, get) => ({
  errors: [],

  addError: (error: AppError) => {
    set((state) => {
      // Prevent duplicate errors within 1 second
      const recentError = state.errors.find(
        (e) =>
          e.message === error.message &&
          e.category === error.category &&
          Date.now() - e.context.timestamp < 1000
      )

      if (recentError) return state

      return {
        errors: [error, ...state.errors].slice(0, 10), // Keep last 10 errors
      }
    })

    // Auto-remove non-critical errors after 5 seconds
    if (error.isDismissible && error.severity !== 'critical') {
      const timeout = setTimeout(() => {
        get().removeError(getErrorId(error))
      }, 5000)

      // Store timeout for cleanup if needed
      ;(error as any)._autoRemoveTimeout = timeout
    }
  },

  removeError: (id: string) => {
    set((state) => ({
      errors: state.errors.filter((e) => getErrorId(e) !== id),
    }))
  },

  dismissError: (id: string) => {
    set((state) => {
      const updated = state.errors.map((e) => {
        if (getErrorId(e) === id) {
          // Create a new error with updated context
          return new AppError(
            e.message,
            e.category,
            e.severity,
            { ...e.context, isDismissed: true },
            e.isDismissible
          )
        }
        return e
      })
      return { errors: updated }
    })
  },

  clearErrors: () => {
    set(() => ({
      errors: [],
    }))
  },

  getLatestError: () => {
    const { errors } = get()
    return errors.length > 0 ? errors[0] : null
  },

  getErrorsByCategory: (category: string) => {
    const { errors } = get()
    return errors.filter((e) => e.category === category)
  },
}))
