/**
 * Опциональный Redis backend для runway rate limit (REDIS_URL).
 * Dynamic import — in-memory fallback если Redis недоступен.
 */
import type { RateLimitResult, RunwayRateLimitTier } from '@/lib/server/runway-rate-limit';

const WINDOW_MS = 60_000;
const MAX_REQUESTS: Record<RunwayRateLimitTier, number> = {
  read: 300,
  write: 100,
};

type RedisClient = {
  incr: (key: string) => Promise<number>;
  pExpire: (key: string, ms: number) => Promise<boolean>;
  pTTL: (key: string) => Promise<number>;
};

let redisClient: RedisClient | null | undefined;
let redisInitFailed = false;

async function getRedisClient(): Promise<RedisClient | null> {
  const url = process.env.REDIS_URL?.trim();
  if (!url) return null;
  if (redisInitFailed) return null;
  if (redisClient) return redisClient;

  try {
    const mod = await import('redis');
    const client = mod.createClient({ url });
    client.on('error', () => {
      /* logged once on connect failure */
    });
    if (!client.isOpen) await client.connect();
    redisClient = client as unknown as RedisClient;
    return redisClient;
  } catch {
    redisInitFailed = true;
    redisClient = null;
    return null;
  }
}

export async function checkRunwayRateLimitRedis(
  clientKey: string,
  tier: RunwayRateLimitTier
): Promise<RateLimitResult | null> {
  const client = await getRedisClient();
  if (!client) return null;

  const max = MAX_REQUESTS[tier];
  const key = `runway:rl:${clientKey}`;

  try {
    const count = await client.incr(key);
    if (count === 1) await client.pExpire(key, WINDOW_MS);

    const ttlMs = await client.pTTL(key);
    const resetAt = Date.now() + (ttlMs > 0 ? ttlMs : WINDOW_MS);

    if (count > max) {
      return { allowed: false, remaining: 0, resetAt };
    }

    return { allowed: true, remaining: max - count, resetAt };
  } catch {
    return null;
  }
}

/** Сброс Redis client — только для тестов. */
export function resetRunwayRedisRateLimitClient(): void {
  redisClient = undefined;
  redisInitFailed = false;
}
