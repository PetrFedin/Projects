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
    void import('@sentry/nextjs')
      .then((Sentry) => {
        const err = error instanceof Error ? error : new Error(String(error ?? 'Unknown error'));
        Sentry.captureException(err, {
          extra:
            context && Object.fromEntries(Object.entries(context).filter(([, v]) => v != null)),
        });
      })
      .catch(() => {
        /* Sentry not available or not initialized */
      });
  } catch {
    // no-op
  }
}

export function reportError(error: Error | string | unknown, context?: LogContext): void {
  const msg =
    typeof error === 'string'
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

function sanitizeContext(context?: LogContext): Record<string, unknown> | undefined {
  if (!context) return undefined;
  return Object.fromEntries(
    Object.entries(context).filter(([, v]) => v != null && v !== '')
  ) as Record<string, unknown>;
}

function observabilityEnabled(): boolean {
  return (
    process.env.NODE_ENV === 'development' ||
    process.env.NODE_ENV === 'test' ||
    process.env.OBSERVABILITY_LOGS === '1' ||
    process.env.NEXT_PUBLIC_OBSERVABILITY_LOGS === '1'
  );
}

export function logWarn(message: string, context?: LogContext): void {
  if (process.env.NODE_ENV !== 'development') return;
  const payload = { message, ...(sanitizeContext(context) ?? {}) };
  console.warn('[warn]', JSON.stringify(payload));
}

export function logInfo(message: string, context?: LogContext): void {
  if (process.env.NODE_ENV !== 'development') return;
  const payload = { message, ...(sanitizeContext(context) ?? {}) };
  console.info('[info]', JSON.stringify(payload));
}

/** Структурированные события (dev/test или при OBSERVABILITY_LOGS). См. `observeApiRoute`, domain-events bus. */
export function logObservability(event: string, fields: Record<string, unknown> = {}): void {
  if (!observabilityEnabled()) return;
  const line = JSON.stringify({ event, ts: new Date().toISOString(), ...fields });
  console.info('[obs]', line);
}
