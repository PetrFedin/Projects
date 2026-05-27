/**
 * LCP-подобная метрика hero runway: время до первого кадра секции 0.
 * Без PII — только slug, latency, тип соединения; sample rate через env.
 */

export interface RunwayLcpHeroPayload {
  productSlug: string;
  msSinceNavigation: number;
  connectionType?: string;
}

/** Sample rate 0–1 из NEXT_PUBLIC_RUNWAY_LCP_SAMPLE_RATE или dev default 1 / prod 0.1. */
export function resolveRunwayLcpSampleRate(): number {
  const raw =
    (typeof process !== 'undefined' &&
      (process.env.NEXT_PUBLIC_RUNWAY_LCP_SAMPLE_RATE?.trim() ||
        process.env.RUNWAY_LCP_SAMPLE_RATE?.trim())) ||
    (process.env.NODE_ENV === 'development' ? '1' : '0.1');
  const parsed = Number.parseFloat(raw);
  if (!Number.isFinite(parsed)) return 0.1;
  return Math.min(1, Math.max(0, parsed));
}

/** Сэмплирование — детерминированное по slug+session для стабильных dev-тестов. */
export function shouldSampleRunwayLcp(productSlug: string, sampleRate: number): boolean {
  if (sampleRate >= 1) return true;
  if (sampleRate <= 0) return false;
  if (typeof window === 'undefined') return false;
  try {
    const key = `runway-lcp-sample:${productSlug}`;
    let bucket = sessionStorage.getItem(key);
    if (bucket == null) {
      bucket = String(Math.random());
      sessionStorage.setItem(key, bucket);
    }
    return Number.parseFloat(bucket) < sampleRate;
  } catch {
    return Math.random() < sampleRate;
  }
}

/** Navigation start → now (Performance API), fallback 0. */
export function measureMsSinceNavigation(nowMs: number = performance.now()): number {
  if (typeof performance === 'undefined') return 0;
  const nav = performance.getEntriesByType('navigation')[0] as
    | PerformanceNavigationTiming
    | undefined;
  const start = nav?.startTime ?? 0;
  return Math.max(0, Math.round(nowMs - start));
}

/** NetworkInformation.effectiveType без PII. */
export function resolveConnectionType(): string | undefined {
  if (typeof navigator === 'undefined') return undefined;
  const conn = (navigator as Navigator & { connection?: { effectiveType?: string } }).connection;
  return conn?.effectiveType?.trim() || undefined;
}

export function buildRunwayLcpHeroPayload(
  productSlug: string,
  nowMs: number = performance.now()
): RunwayLcpHeroPayload {
  return {
    productSlug,
    msSinceNavigation: measureMsSinceNavigation(nowMs),
    connectionType: resolveConnectionType(),
  };
}
