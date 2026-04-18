/**
 * Проверка для GET /api/cron/domain-event-outbox-drain (Vercel Cron / ручной вызов).
 * Секрет: DOMAIN_EVENT_OUTBOX_CRON_SECRET или общий CRON_SECRET.
 */

function parseBearerToken(request: Request): string | null {
  const raw = request.headers.get('authorization');
  if (!raw) return null;
  const m = raw.match(/^\s*Bearer\s+(\S+)\s*$/i);
  return m ? m[1] : null;
}

function verifyBySecret(request: Request, want: string): boolean {
  const token = parseBearerToken(request);
  if (token === want) return true;
  const q = new URL(request.url).searchParams.get('key');
  return q === want;
}

export function verifyDomainEventOutboxCronRequest(request: Request): boolean {
  const want =
    process.env.DOMAIN_EVENT_OUTBOX_CRON_SECRET?.trim() || process.env.CRON_SECRET?.trim() || '';
  if (!want) return false;
  return verifyBySecret(request, want);
}

/**
 * Проверка для GET /api/ops/domain-events/health (ops/readiness).
 * Приоритет секрета: DOMAIN_EVENT_HEALTH_SECRET -> DOMAIN_EVENT_OUTBOX_CRON_SECRET -> CRON_SECRET.
 */
export function verifyDomainEventOpsHealthRequest(request: Request): boolean {
  const want =
    process.env.DOMAIN_EVENT_HEALTH_SECRET?.trim() ||
    process.env.DOMAIN_EVENT_OUTBOX_CRON_SECRET?.trim() ||
    process.env.CRON_SECRET?.trim() ||
    '';
  if (!want) return false;
  return verifyBySecret(request, want);
}
