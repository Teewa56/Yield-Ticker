/**
 * Error types and severity levels for the application
 */

export type ErrorSeverity = 'info' | 'warning' | 'error' | 'critical'

export type ErrorCategory =
  | 'network'
  | 'validation'
  | 'authentication'
  | 'authorization'
  | 'not-found'
  | 'conflict'
  | 'rate-limit'
  | 'parse'
  | 'unknown'

export interface ErrorContext {
  endpoint?: string
  method?: string
  statusCode?: number
  originalError?: Error | unknown
  timestamp: number
  isDismissed?: boolean
}

export class AppError extends Error {
  public readonly severity: ErrorSeverity
  public readonly category: ErrorCategory
  public readonly context: ErrorContext
  public readonly isDismissible: boolean

  constructor(
    message: string,
    category: ErrorCategory = 'unknown',
    severity: ErrorSeverity = 'error',
    context?: Partial<ErrorContext>,
    isDismissible: boolean = true
  ) {
    super(message)
    this.name = 'AppError'
    this.category = category
    this.severity = severity
    this.isDismissible = isDismissible
    this.context = {
      timestamp: Date.now(),
      ...context,
    }

    // Maintain proper prototype chain
    Object.setPrototypeOf(this, AppError.prototype)
  }

  toJSON() {
    return {
      name: this.name,
      message: this.message,
      category: this.category,
      severity: this.severity,
      context: this.context,
      isDismissible: this.isDismissible,
    }
  }
}

export class NetworkError extends AppError {
  constructor(message: string, context?: Partial<ErrorContext>) {
    super(message, 'network', 'error', context)
    this.name = 'NetworkError'
    Object.setPrototypeOf(this, NetworkError.prototype)
  }
}

export class ValidationError extends AppError {
  constructor(message: string, context?: Partial<ErrorContext>) {
    super(message, 'validation', 'warning', context)
    this.name = 'ValidationError'
    Object.setPrototypeOf(this, ValidationError.prototype)
  }
}

export class RateLimitError extends AppError {
  public readonly retryAfter: number

  constructor(message: string, retryAfter: number = 60, context?: Partial<ErrorContext>) {
    super(message, 'rate-limit', 'warning', context, false)
    this.name = 'RateLimitError'
    this.retryAfter = retryAfter
    Object.setPrototypeOf(this, RateLimitError.prototype)
  }
}

export class ParseError extends AppError {
  constructor(message: string, context?: Partial<ErrorContext>) {
    super(message, 'parse', 'error', context)
    this.name = 'ParseError'
    Object.setPrototypeOf(this, ParseError.prototype)
  }
}

export class AuthenticationError extends AppError {
  constructor(message: string, context?: Partial<ErrorContext>) {
    super(message, 'authentication', 'error', context)
    this.name = 'AuthenticationError'
    Object.setPrototypeOf(this, AuthenticationError.prototype)
  }
}

/**
 * Classify an error and convert to AppError if needed
 */
export function classifyError(error: unknown): AppError {
  if (error instanceof AppError) {
    return error
  }

  if (error instanceof Error) {
    // Check for common error patterns
    if (error.message.includes('fetch')) {
      return new NetworkError(
        `Network request failed: ${error.message}`,
        { originalError: error }
      )
    }

    if (error.message.includes('JSON')) {
      return new ParseError(
        `Failed to parse response: ${error.message}`,
        { originalError: error }
      )
    }

    return new AppError(
      error.message,
      'unknown',
      'error',
      { originalError: error }
    )
  }

  // Handle string errors
  if (typeof error === 'string') {
    return new AppError(error)
  }

  return new AppError(
    `An unexpected error occurred: ${JSON.stringify(error)}`,
    'unknown',
    'critical'
  )
}
