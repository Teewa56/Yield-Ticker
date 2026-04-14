import {
  AppError,
  NetworkError,
  RateLimitError,
  ParseError,
  ValidationError,
  classifyError,
  type ErrorCategory,
} from './types'

/**
 * Handle API fetch errors with proper classification
 */
export async function handleFetchError(response: Response): Promise<never> {
  const statusCode = response.status
  const statusText = response.statusText

  let error: AppError

  switch (statusCode) {
    case 400:
      error = new ValidationError(`Bad Request: ${statusText}`, { statusCode })
      break
    case 401:
      error = new AppError(`Authentication failed: ${statusText}`, 'authentication', 'error', {
        statusCode,
      })
      break
    case 403:
      error = new AppError(`Access denied: ${statusText}`, 'authorization', 'error', {
        statusCode,
      })
      break
    case 404:
      error = new AppError(`Resource not found`, 'not-found', 'warning', { statusCode })
      break
    case 409:
      error = new AppError(`Conflict: ${statusText}`, 'conflict', 'warning', {
        statusCode,
      })
      break
    case 429:
      const retryAfter = parseInt(response.headers.get('retry-after') || '60', 10)
      error = new RateLimitError(
        `Rate limited. Please try again in ${retryAfter} seconds`,
        retryAfter,
        { statusCode }
      )
      break
    case 500:
    case 502:
    case 503:
    case 504:
      error = new NetworkError(
        `Server error (${statusCode}): ${statusText}. Please try again later.`,
        { statusCode }
      )
      break
    default:
      error = new NetworkError(`HTTP ${statusCode}: ${statusText}`, { statusCode })
  }

  throw error
}

/**
 * Safe JSON parsing with proper error handling
 */
export function safeJsonParse<T>(json: string, errorContext?: any): T {
  try {
    return JSON.parse(json) as T
  } catch (err) {
    const error = classifyError(err)
    if (error instanceof ParseError) {
      throw error
    }
    throw new ParseError(`Failed to parse JSON response`, errorContext)
  }
}

/**
 * Wrapper for fetch that adds error handling
 */
export async function safeFetch<T>(
  input: RequestInfo | URL,
  init?: RequestInit,
  errorContext?: { endpoint?: string; method?: string }
): Promise<T> {
  try {
    const response = await fetch(input, init)

    if (!response.ok) {
      await handleFetchError(response)
    }

    const data = await response.json()
    return data as T
  } catch (err) {
    let error = classifyError(err)

    if (error instanceof AppError && errorContext) {
      // Create new error with updated context
      error = new AppError(
        error.message,
        error.category,
        error.severity,
        { ...error.context, ...errorContext },
        error.isDismissible
      )
    }

    throw error
  }
}

/**
 * Retry logic for failed operations
 */
export async function retryWithBackoff<T>(
  fn: () => Promise<T>,
  maxRetries: number = 3,
  initialDelayMs: number = 1000,
): Promise<T> {
  let lastError: Error | null = null

  for (let i = 0; i < maxRetries; i++) {
    try {
      return await fn()
    } catch (err) {
      lastError = err as Error

      // Don't retry rate limit errors unless retry-after expired
      if (err instanceof RateLimitError) {
        throw err
      }

      // Don't retry validation errors
      if (err instanceof ValidationError) {
        throw err
      }

      // Only retry on network-like errors
      if (!(err instanceof NetworkError || (err instanceof AppError && err.category === 'network'))) {
        throw err
      }

      // Don't retry on last attempt
      if (i === maxRetries - 1) break

      // Exponential backoff
      const delayMs = initialDelayMs * Math.pow(2, i)
      await new Promise((resolve) => setTimeout(resolve, delayMs))
    }
  }

  throw lastError || new NetworkError('Operation failed after retries')
}

/**
 * Get user-friendly error message
 */
export function getErrorMessage(error: unknown): string {
  const appError = error instanceof AppError ? error : classifyError(error)

  const messages: Record<ErrorCategory, (err: AppError) => string> = {
    network: () => 'Network connection failed. Please check your internet and try again.',
    validation: (err) => `Invalid input: ${err.message}`,
    authentication: () => 'You need to sign in to continue.',
    authorization: () => 'You do not have permission to perform this action.',
    'not-found': () => 'The requested resource was not found.',
    conflict: () => 'The operation could not be completed due to a conflict.',
    'rate-limit': () =>
      `Too many requests. Please wait a moment before trying again.`,
    parse: () => 'Failed to process the response. Please try again.',
    unknown: (err) => err.message,
  }

  return messages[appError.category]?.(appError) ?? appError.message
}

/**
 * Log error for debugging (could be sent to error tracking service)
 */
export function logError(error: unknown, context?: Record<string, any>): void {
  const appError = error instanceof AppError ? error : classifyError(error)

  const logData = {
    ...appError.toJSON(),
    ...context,
  }

  if (process.env.NODE_ENV === 'development') {
    console.error('[Error]', logData)
  }

  // TODO: Send to error tracking service (Sentry, DataDog, etc.)
  // if (process.env.NEXT_PUBLIC_ERROR_TRACKING_ENABLED === 'true') {
  //   errorTrackingService.captureException(appError, { extra: context })
  // }
}
