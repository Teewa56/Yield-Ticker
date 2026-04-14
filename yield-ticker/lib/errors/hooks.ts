'use client'

import { useCallback, useRef, useEffect } from 'react'
import { useErrorStore } from './store'
import { AppError, classifyError } from './types'
import { logError } from './handlers'

interface UseAsyncOptions {
  onError?: (error: AppError) => void
  onSuccess?: () => void
  showNotification?: boolean
  retries?: number
}

/**
 * Hook for handling async operations with automatic error management
 */
export function useAsync<T, Args extends any[]>(
  fn: (...args: Args) => Promise<T>,
  options: UseAsyncOptions = {}
) {
  const { onError, onSuccess, showNotification = true, retries = 0 } = options
  const addError = useErrorStore((s) => s.addError)
  const isMountedRef = useRef(true)
  const retriesRef = useRef(retries)

  useEffect(() => {
    return () => {
      isMountedRef.current = false
    }
  }, [])

  const execute = useCallback(
    async (...args: Args) => {
      retriesRef.current = retries

      while (retriesRef.current >= 0) {
        try {
          const result = await fn(...args)

          if (isMountedRef.current) {
            onSuccess?.()
          }

          return result
        } catch (err) {
          const error =
            err instanceof AppError ? err : classifyError(err)

          if (retriesRef.current > 0) {
            retriesRef.current--
            // Exponential backoff
            await new Promise((resolve) =>
              setTimeout(resolve, 1000 * Math.pow(2, retries - retriesRef.current - 1))
            )
            continue
          }

          if (isMountedRef.current) {
            logError(error)

            if (showNotification) {
              addError(error)
            }

            onError?.(error)
          }

          throw error
        }
      }

      throw new Error('Unexpected: retries exhausted without result')
    },
    [fn, onError, onSuccess, showNotification, retries, addError]
  )

  return execute
}

/**
 * Hook for handling React Query errors
 */
export function useErrorNotifier() {
  const addError = useErrorStore((s) => s.addError)

  return useCallback(
    (error: unknown) => {
      const appError = error instanceof AppError ? error : classifyError(error)
      addError(appError)
      logError(appError)
    },
    [addError]
  )
}
