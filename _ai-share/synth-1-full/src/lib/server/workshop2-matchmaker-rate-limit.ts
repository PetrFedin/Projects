/**
 * Wave 8 P1: in-memory rate limit stub для POST match-contractors (per-IP / per-window).
 */
type Bucket = { count: number; windowStartMs: number };

const buckets = new Map<string, Bucket>();

export type Workshop2MatchmakerRateLimitResult = {
  allowed: boolean;
  limit: number;
  remaining: number;
  retryAfterSec: number;
};

export function checkWorkshop2MatchmakerRateLimit(input: {
  key: string;
  limitPerMinute?: number;
  nowMs?: number;
}): Workshop2MatchmakerRateLimitResult {
  const limit = Math.max(1, input.limitPerMinute ?? 12);
  const now = input.nowMs ?? Date.now();
  const windowMs = 60_000;
  const key = input.key.trim() || 'anonymous';

  let bucket = buckets.get(key);
  if (!bucket || now - bucket.windowStartMs >= windowMs) {
    bucket = { count: 0, windowStartMs: now };
    buckets.set(key, bucket);
  }

  if (bucket.count >= limit) {
    const retryAfterSec = Math.max(1, Math.ceil((bucket.windowStartMs + windowMs - now) / 1000));
    return { allowed: false, limit, remaining: 0, retryAfterSec };
  }

  bucket.count += 1;
  return {
    allowed: true,
    limit,
    remaining: Math.max(0, limit - bucket.count),
    retryAfterSec: 0,
  };
}

/** Сброс buckets — только для unit-тестов. */
export function resetWorkshop2MatchmakerRateLimitForTests(): void {
  buckets.clear();
}

export function buildWorkshop2MatchmakerRateLimitBody(result: Workshop2MatchmakerRateLimitResult): {
  body: {
    error: string;
    messageRu: string;
    retryAfterSec: number;
  };
  status: number;
  headers: Record<string, string>;
} {
  return {
    body: {
      error: 'rate_limit_exceeded',
      messageRu: `Matchmaker: лимит ${result.limit} запросов/мин — повторите через ${result.retryAfterSec} с.`,
      retryAfterSec: result.retryAfterSec,
    },
    status: 429,
    headers: {
      'Retry-After': String(result.retryAfterSec),
      'X-RateLimit-Limit': String(result.limit),
      'X-RateLimit-Remaining': String(result.remaining),
    },
  };
}
