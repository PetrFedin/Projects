/**
 * LCP-подобная метрика hero runway: время до первого кадра секции 0.
 * Без PII — только slug, latency, тип соединения; sample rate через env.
 */

export interface RunwayLcpHeroPayload {
  productSlug: string;
  msSinceNavigation: number;
  connectionType?: string;
  /** 'lcp' если PerformanceObserver, иначе 'navigation'. */
  source?: 'lcp' | 'navigation';
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

/** Buffered LCP entry (PerformanceObserver), если доступен. */
export function readBufferedLcpMs(): number | undefined {
  if (typeof performance === 'undefined') return undefined;
  try {
    const entries = performance.getEntriesByType('largest-contentful-paint');
    const last = entries[entries.length - 1] as PerformanceEntry | undefined;
    if (last && Number.isFinite(last.startTime)) {
      return Math.max(0, Math.round(last.startTime));
    }
  } catch {
    /* unsupported */
  }
  return undefined;
}

/** Подписка на LCP — возвращает cleanup; fallback через navigation timing в payload builder. */
export function observeRunwayHeroLcp(onLcp: (ms: number) => void): () => void {
  if (typeof window === 'undefined' || typeof PerformanceObserver === 'undefined') {
    return () => undefined;
  }

  let done = false;
  const finish = (ms: number) => {
    if (done) return;
    done = true;
    onLcp(ms);
  };

  try {
    const buffered = readBufferedLcpMs();
    if (buffered != null) {
      finish(buffered);
      return () => undefined;
    }

    const observer = new PerformanceObserver((list) => {
      const entries = list.getEntries();
      const last = entries[entries.length - 1];
      if (last) finish(Math.max(0, Math.round(last.startTime)));
    });
    observer.observe({ type: 'largest-contentful-paint', buffered: true });
    return () => observer.disconnect();
  } catch {
    return () => undefined;
  }
}

/** Demo / E2E / opt-out — не отправлять runway_lcp_hero. */
export function shouldEmitRunwayLcpHero(options: {
  isDemoMode?: boolean;
  isE2eMode?: boolean;
  analyticsOptOut?: boolean;
}): boolean {
  if (options.isDemoMode || options.isE2eMode || options.analyticsOptOut) return false;
  return true;
}

/** Проверка opt-out PostHog / localStorage без PII. */
export function resolveRunwayAnalyticsOptOut(): boolean {
  if (typeof window === 'undefined') return false;
  try {
    if (window.localStorage.getItem('runway-analytics-opt-out') === '1') return true;
    const posthog = (window as Window & { posthog?: { has_opted_out_capturing?: () => boolean } })
      .posthog;
    if (posthog?.has_opted_out_capturing?.()) return true;
  } catch {
    /* ignore */
  }
  return false;
}

export function buildRunwayLcpHeroPayload(
  productSlug: string,
  nowMs: number = performance.now()
): RunwayLcpHeroPayload {
  const lcpMs = readBufferedLcpMs();
  return {
    productSlug,
    msSinceNavigation: lcpMs ?? measureMsSinceNavigation(nowMs),
    connectionType: resolveConnectionType(),
    source: lcpMs != null ? 'lcp' : 'navigation',
  };
}
