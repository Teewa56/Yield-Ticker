'use client'

/**
 * Example component showing error handling best practices
 * Reference this when implementing error handling in other components
 */

import { useAsync } from '@/lib/errors/hooks'
import { useErrorStore, AppError } from '@/lib/errors'

interface ExampleComponentProps {
  onSuccess?: () => void
}

export function ErrorHandlingExample({ onSuccess }: ExampleComponentProps) {
  const addError = useErrorStore((s) => s.addError)
  const errors = useErrorStore((s) => s.errors)
  const clearErrors = useErrorStore((s) => s.clearErrors)

  // Pattern 1: useAsync hook for automatic error handling
  const handleAsyncOperation = useAsync(
    async (data: any) => {
      // Simulate API call
      const response = await fetch('/api/data', {
        method: 'POST',
        body: JSON.stringify(data),
      })

      if (!response.ok) {
        throw new Error(`Request failed: ${response.status}`)
      }

      return response.json()
    },
    {
      onSuccess: () => {
        console.log('Operation succeeded')
        onSuccess?.()
      },
      onError: (error) => {
        console.error('Custom error handler:', error.message)
      },
      showNotification: true,
      retries: 2,
    }
  )

  // Pattern 2: Manual error handling with try-catch
  const handleManualErrorHandling = async () => {
    try {
      await riskyOperation()
    } catch (error) {
      // Classify any unknown error and add to store
      const appError = error instanceof AppError 
        ? error 
        : new AppError(
            `Operation failed: ${error instanceof Error ? error.message : 'Unknown error'}`,
            'unknown',
            'error'
          )
      addError(appError)
    }
  }

  // Pattern 3: Creating specific error types
  const handleValidationError = () => {
    const error = new AppError(
      'Please fill in all required fields',
      'validation',
      'warning'
    )
    addError(error)
  }

  const handleNetworkError = () => {
    const error = new AppError(
      'Unable to connect to server. Please check your internet connection.',
      'network',
      'error'
    )
    addError(error)
  }

  const handleRateLimitError = () => {
    const error = new AppError(
      'Too many requests. Please wait before trying again.',
      'rate-limit',
      'warning'
    )
    addError(error)
  }

  return (
    <div className="p-6 space-y-4">
      <div>
        <h2 className="text-xl font-bold mb-4">Error Handling Examples</h2>

        {/* Display errors */}
        <div className="mb-6 p-3 bg-blue-900/20 rounded border border-blue-500/40">
          <p className="text-sm text-blue-300 mb-2">
            Active Errors: {errors.length}
          </p>
          {errors.length > 0 && (
            <button
              onClick={clearErrors}
              className="text-xs px-2 py-1 bg-blue-600/20 hover:bg-blue-600/40 rounded"
            >
              Clear All
            </button>
          )}
        </div>

        {/* Examples */}
        <div className="space-y-2">
          <button
            onClick={() => handleAsyncOperation({ test: 'data' })}
            className="block w-full px-3 py-2 bg-cyan-600/20 hover:bg-cyan-600/40 rounded text-sm text-cyan-300 text-left"
          >
            1. Async Operation (with retry)
          </button>

          <button
            onClick={handleManualErrorHandling}
            className="block w-full px-3 py-2 bg-cyan-600/20 hover:bg-cyan-600/40 rounded text-sm text-cyan-300 text-left"
          >
            2. Manual Error Handling
          </button>

          <button
            onClick={handleValidationError}
            className="block w-full px-3 py-2 bg-yellow-600/20 hover:bg-yellow-600/40 rounded text-sm text-yellow-300 text-left"
          >
            3. Validation Error (Warning)
          </button>

          <button
            onClick={handleNetworkError}
            className="block w-full px-3 py-2 bg-red-600/20 hover:bg-red-600/40 rounded text-sm text-red-300 text-left"
          >
            4. Network Error
          </button>

          <button
            onClick={handleRateLimitError}
            className="block w-full px-3 py-2 bg-orange-600/20 hover:bg-orange-600/40 rounded text-sm text-orange-300 text-left"
          >
            5. Rate Limit Error
          </button>
        </div>
      </div>

      {/* Info box */}
      <div className="p-3 bg-slate-900/40 rounded border border-slate-700/40 text-xs text-slate-400 space-y-2">
        <p>
          <strong>Errors shown:</strong> Look for toast notifications in the bottom-right corner
        </p>
        <p>
          <strong>Auto-dismiss:</strong> Warning/error notifications auto-dismiss after 5 seconds
        </p>
        <p>
          <strong>Patterns:</strong> See source code comments for best practices
        </p>
      </div>
    </div>
  )
}

// Simulated risky operation
async function riskyOperation(): Promise<void> {
  // Randomly fail to demonstrate error handling
  if (Math.random() > 0.5) {
    throw new Error('Random operation failure for demo purposes')
  }
  return Promise.resolve()
}
