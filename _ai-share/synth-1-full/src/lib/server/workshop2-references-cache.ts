import 'server-only';

/** Короткий TTL in-memory cache для GET справочников (colors и др.). */
const DEFAULT_TTL_MS = 15_000;

type CacheEntry = {
  expiresAt: number;
  value: unknown;
};

const store = new Map<string, CacheEntry>();

export function getWorkshop2ReferencesCached<T>(key: string): T | null {
  const hit = store.get(key);
  if (!hit) return null;
  if (Date.now() >= hit.expiresAt) {
    store.delete(key);
    return null;
  }
  return hit.value as T;
}

export function setWorkshop2ReferencesCached(
  key: string,
  value: unknown,
  ttlMs = DEFAULT_TTL_MS
): void {
  store.set(key, { value, expiresAt: Date.now() + ttlMs });
}

/** Сброс кэша после PUT/import (prefix `colors:` или весь workshop2-refs). */
export function bustWorkshop2ReferencesCache(prefix?: string): void {
  if (!prefix) {
    store.clear();
    return;
  }
  for (const key of store.keys()) {
    if (key.startsWith(prefix)) store.delete(key);
  }
}
