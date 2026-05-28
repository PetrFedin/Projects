const buckets = new Map<string, number[]>();

/**
 * In-memory rate limiter for API routes (demo / single instance).
 * For serverless with many instances use Redis or edge rate limiting.
 */
export function rateLimitAllow(key: string, max: number, windowMs: number): boolean {
  const now = Date.now();
  const pruned = (buckets.get(key) ?? []).filter((t) => now - t < windowMs);
  if (pruned.length >= max) {
    buckets.set(key, pruned);
    return false;
  }
  pruned.push(now);
  buckets.set(key, pruned);
  return true;
}

export function requestClientKey(request: Request, prefix: string): string {
  const xff = request.headers.get('x-forwarded-for');
  const first = xff?.split(',')[0]?.trim();
  if (first) return `${prefix}:${first}`;
  const real = request.headers.get('x-real-ip')?.trim();
  if (real) return `${prefix}:${real}`;
  return `${prefix}:unknown`;
}
