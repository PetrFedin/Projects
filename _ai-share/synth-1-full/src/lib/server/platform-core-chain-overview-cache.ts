import 'server-only';

import type { PlatformCoreChainOverview } from '@/lib/server/platform-core-chain-overview';

/** Свежий кеш — без повторного PG на каждый hub mount. */
const TTL_MS = 120_000;
/** Отдаём устаревший снимок, пока идёт фоновое обновление. */
const STALE_SERVE_MS = 600_000;

type CacheEntry = {
  at: number;
  value: PlatformCoreChainOverview;
  refresh?: Promise<PlatformCoreChainOverview>;
};

const cache = new Map<string, CacheEntry>();

export function getCachedPlatformCoreChainOverview(
  collectionId: string
): PlatformCoreChainOverview | null {
  const hit = cache.get(collectionId);
  if (!hit) return null;
  if (Date.now() - hit.at > STALE_SERVE_MS) {
    cache.delete(collectionId);
    return null;
  }
  return hit.value;
}

export function isPlatformCoreChainOverviewCacheFresh(collectionId: string): boolean {
  const hit = cache.get(collectionId);
  if (!hit) return false;
  return Date.now() - hit.at <= TTL_MS;
}

export function setCachedPlatformCoreChainOverview(
  collectionId: string,
  value: PlatformCoreChainOverview
): void {
  cache.set(collectionId, { at: Date.now(), value });
}

export function invalidatePlatformCoreChainOverviewCache(collectionId?: string): void {
  if (collectionId?.trim()) {
    cache.delete(collectionId.trim());
    return;
  }
  cache.clear();
}

/** Stale-while-revalidate: один in-flight refresh на collectionId. */
export function schedulePlatformCoreChainOverviewRefresh(
  collectionId: string,
  loader: () => Promise<PlatformCoreChainOverview>
): void {
  const cid = collectionId.trim();
  const hit = cache.get(cid);
  if (!hit?.value || hit.refresh) return;
  hit.refresh = loader()
    .then((value) => {
      setCachedPlatformCoreChainOverview(cid, value);
      const entry = cache.get(cid);
      if (entry) entry.refresh = undefined;
      return value;
    })
    .catch(() => {
      const entry = cache.get(cid);
      if (entry) entry.refresh = undefined;
      return hit.value;
    });
}
