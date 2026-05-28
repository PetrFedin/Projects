/**
 * Centralized error logging for frontend.
 * Use reportError for errors; sends to Sentry when @sentry/nextjs is initialized (DSN set).
 */

import {
  coerceUnknownToError,
  getUnknownErrorDetail,
  getUnknownErrorMessage,
  getUnknownErrorStack,
} from '@/lib/unknown-error-message';

export interface LogContext {
  endpoint?: string;
  status?: number;
  [key: string]: unknown;
}

function sendToSentry(error: Error | string | unknown, context?: LogContext): void {
  if (process.env.NODE_ENV !== 'production') return;
  if (typeof window === 'undefined') return;
  try {
    // Dynamic import so logger stays usable when Sentry is not configured
    void import('@sentry/nextjs')
      .then((Sentry) => {
        const err = coerceUnknownToError(error);
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
      : getUnknownErrorMessage(
          error,
          error == null ? 'Unknown error' : getUnknownErrorDetail(error)
        );
  const stack = getUnknownErrorStack(error);
  const toLog: Record<string, unknown> = {
    message: msg || 'Unknown error',
    ...(stack ? { stack } : {}),
    ...(context && Object.fromEntries(Object.entries(context).filter(([, v]) => v != null))),
  };
  if (process.env.NODE_ENV === 'development') {
    const isChunkLoad = msg.includes('Loading chunk') || msg.includes('ChunkLoadError');
    if (isChunkLoad) {
      // Chunk errors are usually recoverable in dev after HMR/cache cleanup.
      console.warn('[reportError][chunk]', msg);
    } else {
      console.error('[reportError]', JSON.stringify(toLog, null, 2));
    }
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
