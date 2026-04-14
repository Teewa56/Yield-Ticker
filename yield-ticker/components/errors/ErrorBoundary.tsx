'use client'

import { Component, ReactNode } from 'react'
import { useErrorStore } from '@/lib/errors/store'
import { AppError } from '@/lib/errors/types'

interface ErrorBoundaryProps {
  children: ReactNode
  fallback?: (error: Error, reset: () => void) => ReactNode
  onError?: (error: Error, info: { componentStack: string }) => void
}

interface ErrorBoundaryState {
  hasError: boolean
  error: Error | null
}

/**
 * React Error Boundary - catches errors in child components
 * Can be used as a class component or wrapped with useErrorStore hook
 */
export class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props)
    this.state = { hasError: false, error: null }
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error }
  }

  componentDidCatch(error: Error, info: { componentStack: string }) {
    // Log to error store
    const appError = new AppError(
      `React Component Error: ${error.message}`,
      'unknown',
      'error',
      {
        originalError: error,
      }
    )
    useErrorStore.getState().addError(appError)

    // Call user's error handler if provided
    this.props.onError?.(error, info)

    // Log to console in development
    if (process.env.NODE_ENV === 'development') {
      console.error('Error caught by boundary:', error, info)
    }
  }

  reset = () => {
    this.setState({ hasError: false, error: null })
  }

  render() {
    if (this.state.hasError && this.state.error) {
      return this.props.fallback?.(this.state.error, this.reset) ?? <DefaultErrorFallback error={this.state.error} reset={this.reset} />
    }

    return this.props.children
  }
}

/**
 * Default error fallback UI
 */
function DefaultErrorFallback({
  error,
  reset,
}: {
  error: Error
  reset: () => void
}) {
  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-950 p-4">
      <div className="max-w-md rounded-lg border border-red-500/50 bg-red-950/30 p-6 backdrop-blur-sm">
        <h2 className="mb-2 text-lg font-bold text-red-400">Something went wrong</h2>
        <p className="mb-4 text-sm text-red-300/80">{error.message}</p>
        <button
          onClick={reset}
          className="inline-flex items-center gap-2 rounded-md bg-red-600/20 px-4 py-2 text-sm font-medium text-red-300 transition-colors hover:bg-red-600/40"
        >
          Try again
        </button>
      </div>
    </div>
  )
}
