/**
 * Rate limit для runway API routes.
 * write: 100 req/min · read: 300 req/min per IP.
 * REDIS_URL → Redis (см. runway-rate-limit-redis.ts), иначе in-memory.
 */

export type RunwayRateLimitBackend = 'memory' | 'redis';

const WINDOW_MS = 60_000;

export type RunwayRateLimitTier = 'read' | 'write';

const MAX_REQUESTS: Record<RunwayRateLimitTier, number> = {
  read: 300,
  write: 100,
};

interface Bucket {
  count: number;
  resetAt: number;
}

const buckets = new Map<string, Bucket>();

function pruneExpired(now: number): void {
  for (const [key, bucket] of buckets) {
    if (bucket.resetAt <= now) buckets.delete(key);
  }
}

export interface RateLimitResult {
  allowed: boolean;
  remaining: number;
  resetAt: number;
}

/** E2E/CI: без лимита — serial Playwright шлёт десятки POST /analytics под одним IP. */
function isRunwayRateLimitDisabled(): boolean {
  return process.env.E2E === 'true' || process.env.NEXT_PUBLIC_E2E === 'true';
}

/** Проверяет лимит; при allow=true инкрементирует счётчик. */
export function checkRunwayRateLimit(
  clientKey: string,
  tier: RunwayRateLimitTier = 'write'
): RateLimitResult {
  if (isRunwayRateLimitDisabled()) {
    const resetAt = Date.now() + WINDOW_MS;
    return { allowed: true, remaining: MAX_REQUESTS[tier], resetAt };
  }
  const max = MAX_REQUESTS[tier];
  const now = Date.now();
  if (buckets.size > 10_000) pruneExpired(now);

  const bucket = buckets.get(clientKey);
  if (!bucket || bucket.resetAt <= now) {
    const resetAt = now + WINDOW_MS;
    buckets.set(clientKey, { count: 1, resetAt });
    return { allowed: true, remaining: max - 1, resetAt };
  }

  if (bucket.count >= max) {
    return { allowed: false, remaining: 0, resetAt: bucket.resetAt };
  }

  bucket.count += 1;
  return { allowed: true, remaining: max - bucket.count, resetAt: bucket.resetAt };
}

/** @deprecated Используйте checkRunwayRateLimit(key, 'write'). */
export function checkRunwayAnalyticsRateLimit(clientKey: string): RateLimitResult {
  return checkRunwayRateLimit(clientKey, 'write');
}

/** Сброс buckets — только для тестов. */
export function resetRunwayRateLimitStore(): void {
  buckets.clear();
}

/** Активный backend rate limit (для health/runbook). */
export function resolveRunwayRateLimitBackend(): RunwayRateLimitBackend {
  return process.env.REDIS_URL?.trim() ? 'redis' : 'memory';
}

export const RUNWAY_RATE_LIMIT_TIERS = MAX_REQUESTS;

/** IP из заголовков reverse proxy или fallback. */
export function resolveClientIp(request: Request): string {
  const forwarded = request.headers.get('x-forwarded-for');
  if (forwarded) return forwarded.split(',')[0]?.trim() || 'unknown';
  const realIp = request.headers.get('x-real-ip');
  if (realIp) return realIp.trim();
  return 'unknown';
}
