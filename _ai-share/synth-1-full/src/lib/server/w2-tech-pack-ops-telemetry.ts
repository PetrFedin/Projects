/**
 * Наблюдаемость tech pack: JSON в stdout, опционально ротация через файл (W2_TECHPACK_OPS_LOG_PATH),
 * в production — Sentry (warning) на ошибки/4xx-операции.
 */
type W2TechPackOpsPayload = Record<string, string | number | boolean | undefined>;

function shouldSentryW2TechpackOps(event: string): boolean {
  if (process.env.NODE_ENV !== 'production') return false;
  return (
    /_err$|_mismatch|_miss|_unauthorized|_not_found|index_upsert_err/.test(event) || event === 'complete_not_found'
  );
}

export function logW2TechPackOps(event: string, payload?: W2TechPackOpsPayload): void {
  const line = JSON.stringify({
    source: 'w2_techpack_ops',
    event,
    at: new Date().toISOString(),
    ...payload,
  });
  console.log(line);
  const logPath = process.env.W2_TECHPACK_OPS_LOG_PATH?.trim();
  if (logPath && typeof process !== 'undefined' && (process as NodeJS.Process & { versions?: { node?: string } }).versions?.node) {
    void import('node:fs/promises')
      .then((fs) => fs.appendFile(logPath, `${line}\n`, 'utf8'))
      .catch(() => {
        /* ignore I/O / missing path */
      });
  }
  if (shouldSentryW2TechpackOps(event)) {
    void import('@sentry/nextjs')
      .then((Sentry) => {
        Sentry.captureMessage(`w2_techpack_ops:${event}`, {
          level: 'warning',
          extra: (payload ?? {}) as Record<string, unknown>,
        });
      })
      .catch(() => {
        /* Sentry optional */
      });
  }
}
