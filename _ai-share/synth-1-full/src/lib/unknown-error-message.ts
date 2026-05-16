/**
 * Safe user-facing message from catch (unknown) without using `any`.
 */
export function getUnknownErrorMessage(err: unknown, fallback: string): string {
  if (err instanceof Error && err.message) return err.message;
  if (err && typeof err === 'object' && 'message' in err) {
    const m = (err as { message?: unknown }).message;
    if (typeof m === 'string' && m) return m;
  }
  return fallback;
}

/** For `AbortError`, `TypeError`, etc. without `any` in catch blocks. */
export function getUnknownErrorName(err: unknown): string {
  if (err instanceof Error && err.name) return err.name;
  if (err && typeof err === 'object' && 'name' in err) {
    const n = (err as { name?: unknown }).name;
    if (typeof n === 'string' && n) return n;
  }
  return '';
}

/** Stack string when value is an `Error` with stack; otherwise `undefined`. */
export function getUnknownErrorStack(err: unknown): string | undefined {
  if (err instanceof Error && err.stack) return err.stack;
  return undefined;
}

/**
 * One line for logs / dev (e.g. `unhandledrejection`, `ErrorEvent.error`): `TypeError: …` when `name` exists, else message only.
 * For `window` `error` events: `formatUnknownErrorForLog(e.error) || (e.message ?? '')` then append `filename` if needed.
 */
export function formatUnknownErrorForLog(err: unknown): string {
  if (err == null) return '';
  if (typeof err === 'string') return err;
  if (typeof err === 'object') {
    const name = getUnknownErrorName(err);
    const msg = getUnknownErrorMessage(err, '');
    return name ? `${name}: ${msg}` : msg;
  }
  return '';
}

/**
 * Like `err instanceof Error ? err.message : String(err)` — for logs and API error strings
 * when non-Error throws (numbers, strings) should still stringify sensibly.
 */
export function getUnknownErrorDetail(err: unknown): string {
  const msg = getUnknownErrorMessage(err, '');
  if (msg) return msg;
  if (typeof err === 'string') return err;
  return String(err);
}

/** Keep `Error` as-is; otherwise wrap with a fixed message (non-Error payloads are not stringified into the message). */
export function ensureErrorFromUnknown(value: unknown, fallbackMessage: string): Error {
  return value instanceof Error ? value : new Error(fallbackMessage);
}

/** Keep `Error` as-is; otherwise `new Error(...)` from thrown value; null/undefined → `'Unknown error'`. */
export function coerceUnknownToError(value: unknown): Error {
  if (value instanceof Error) return value;
  if (value == null) return new Error('Unknown error');
  return new Error(getUnknownErrorDetail(value));
}
