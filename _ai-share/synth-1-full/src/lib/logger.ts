/**
 * Centralized error logging for frontend.
 * Use reportError for errors; sends to Sentry when @sentry/nextjs is initialized (DSN set).
 */

export interface LogContext {
  endpoint?: string;
  status?: number;
  [key: string]: unknown;
}

function sendToSentry(error: Error | string | unknown, context?: LogContext): void {
  try {
    // Dynamic import so logger stays usable when Sentry is not configured
    void import('@sentry/nextjs').then((Sentry) => {
      const err = error instanceof Error ? error : new Error(String(error ?? 'Unknown error'));
      Sentry.captureException(err, {
        extra: context && Object.fromEntries(Object.entries(context).filter(([, v]) => v != null)),
      });
    }).catch(() => { /* Sentry not available or not initialized */ });
  } catch {
    // no-op
  }
}

export function reportError(error: Error | string | unknown, context?: LogContext): void {
  const msg = typeof error === 'string'
    ? error
    : error instanceof Error
      ? error.message
      : error && typeof error === 'object' && 'message' in error
        ? String((error as { message?: unknown }).message)
        : error != null
          ? String(error)
          : 'Unknown error';
  const toLog: Record<string, unknown> = {
    message: msg || 'Unknown error',
    ...(error instanceof Error && error.stack && { stack: error.stack }),
    ...(context && Object.fromEntries(Object.entries(context).filter(([, v]) => v != null))),
  };
  if (process.env.NODE_ENV === 'development') {
    console.error('[reportError]', JSON.stringify(toLog, null, 2));
  }
  sendToSentry(error, context);
}

export function logApiError(endpoint: string, status: number, detail?: string): void {
  reportError(new Error(detail || `API ${endpoint} returned ${status}`), { endpoint, status });
}
