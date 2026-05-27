import { NextResponse } from 'next/server';
import {
  checkRunwayRateLimit,
  resolveClientIp,
  resolveRunwayRateLimitBackend,
  type RateLimitResult,
  type RunwayRateLimitTier,
} from '@/lib/server/runway-rate-limit';
import { checkRunwayRateLimitRedis } from '@/lib/server/runway-rate-limit-redis';

/** Единая точка rate limit для всех runway API routes. */
export async function applyRunwayRouteRateLimit(
  request: Request,
  tier: RunwayRateLimitTier = 'write'
): Promise<RateLimitResult> {
  if (process.env.E2E === 'true' || process.env.NEXT_PUBLIC_E2E === 'true') {
    return { allowed: true, remaining: 999, resetAt: Date.now() + 60_000 };
  }

  const clientIp = resolveClientIp(request);
  const key = `${tier}:${clientIp}`;

  if (resolveRunwayRateLimitBackend() === 'redis') {
    const redisResult = await checkRunwayRateLimitRedis(key, tier);
    if (redisResult) return redisResult;
  }

  return checkRunwayRateLimit(key, tier);
}

export function runwayRateLimitJsonResponse(rate: RateLimitResult): NextResponse {
  const retryAfterSec = Math.ceil(Math.max(0, rate.resetAt - Date.now()) / 1000);
  return NextResponse.json(
    {
      error: 'Rate limit exceeded',
      retryAfterMs: Math.max(0, rate.resetAt - Date.now()),
    },
    {
      status: 429,
      headers: {
        'Retry-After': String(retryAfterSec),
        'X-RateLimit-Remaining': String(rate.remaining),
      },
    }
  );
}
