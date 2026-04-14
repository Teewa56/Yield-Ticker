'use client'

import { useEffect } from 'react'
import { useErrorStore, getErrorId } from '@/lib/errors/store'
import { AlertCircle, AlertTriangle, Info, XCircle, X } from 'lucide-react'
import type { ErrorSeverity } from '@/lib/errors/types'

const severityConfig: Record<
  ErrorSeverity,
  {
    icon: typeof AlertCircle
    bg: string
    border: string
    text: string
    iconColor: string
  }
> = {
  info: {
    icon: Info,
    bg: 'bg-blue-950/40',
    border: 'border-blue-500/40',
    text: 'text-blue-300',
    iconColor: 'text-blue-400',
  },
  warning: {
    icon: AlertTriangle,
    bg: 'bg-yellow-950/40',
    border: 'border-yellow-500/40',
    text: 'text-yellow-300',
    iconColor: 'text-yellow-400',
  },
  error: {
    icon: AlertCircle,
    bg: 'bg-red-950/40',
    border: 'border-red-500/40',
    text: 'text-red-300',
    iconColor: 'text-red-400',
  },
  critical: {
    icon: XCircle,
    bg: 'bg-red-950/60',
    border: 'border-red-500/60',
    text: 'text-red-300',
    iconColor: 'text-red-400',
  },
}

export function ErrorNotification() {
  const errors = useErrorStore((s) => s.errors)
  const removeError = useErrorStore((s) => s.removeError)
  const dismissError = useErrorStore((s) => s.dismissError)

  if (errors.length === 0) return null

  // Group errors by category, show the most recent one
  const latestError = errors[0]
  const errorId = getErrorId(latestError)
  const config = severityConfig[latestError.severity]
  const Icon = config.icon

  return (
    <div className="fixed bottom-4 right-4 z-50 animate-in fade-in slide-in-from-bottom-2 duration-300">
      <div
        className={`flex items-start gap-3 rounded-md border backdrop-blur-sm p-3 max-w-sm ${config.bg} ${config.border}`}
      >
        <Icon className={`h-5 w-5 flex-shrink-0 ${config.iconColor} mt-0.5`} />
        <div className="flex-1">
          <p className={`text-sm font-medium ${config.text}`}>{latestError.message}</p>
          {latestError.category !== 'unknown' && (
            <p className={`text-xs ${config.text}/70 mt-1 capitalize`}>
              {latestError.category.replace('-', ' ')}
            </p>
          )}
        </div>
        {latestError.isDismissible && (
          <button
            onClick={() => (latestError.context.isDismissed ? removeError(errorId) : dismissError(errorId))}
            className={`flex-shrink-0 ${config.iconColor} hover:${config.iconColor}/80 transition-opacity`}
            aria-label="Dismiss error"
          >
            <X className="h-4 w-4" />
          </button>
        )}
      </div>
    </div>
  )
}

export function ErrorList() {
  const errors = useErrorStore((s) => s.errors)
  const removeError = useErrorStore((s) => s.removeError)

  if (errors.length === 0) return null

  return (
    <div className="fixed bottom-4 right-4 z-50 max-h-[500px] overflow-y-auto space-y-2">
      {errors.slice(0, 5).map((error) => {
        const errorId = getErrorId(error)
        const config = severityConfig[error.severity]
        const Icon = config.icon

        return (
          <div
            key={errorId}
            className={`flex items-start gap-2 rounded-md border backdrop-blur-sm p-2 max-w-xs ${config.bg} ${config.border}`}
          >
            <Icon className={`h-4 w-4 flex-shrink-0 ${config.iconColor}`} />
            <p className={`text-xs ${config.text} flex-1`}>{error.message}</p>
            <button
              onClick={() => removeError(errorId)}
              className={`flex-shrink-0 ${config.iconColor} hover:${config.iconColor}/80`}
            >
              <X className="h-3 w-3" />
            </button>
          </div>
        )
      })}
    </div>
  )
}
