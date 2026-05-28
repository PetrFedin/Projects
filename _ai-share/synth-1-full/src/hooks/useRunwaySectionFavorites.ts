'use client';

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useAuth } from '@/providers/auth-provider';
import { buildRunwayPreferencesRequestHeaders } from '@/lib/runway/runway-preferences-client';
import {
  RUNWAY_SECTION_FAVORITES_STORAGE_KEY,
  runwaySectionFavoritesKeyForUser,
} from '@/lib/scroll-switcher-constants';

type FavoritesMap = Record<string, number>;

function readFavorites(storageKey: string): FavoritesMap {
  if (typeof localStorage === 'undefined') return {};
  try {
    const raw = localStorage.getItem(storageKey);
    if (!raw) return {};
    return JSON.parse(raw) as FavoritesMap;
  } catch {
    return {};
  }
}

function writeFavorites(storageKey: string, map: FavoritesMap): void {
  if (typeof localStorage === 'undefined') return;
  try {
    localStorage.setItem(storageKey, JSON.stringify(map));
  } catch {
    /* ignore */
  }
}

async function fetchUserRunwayFavorites(userId: string): Promise<FavoritesMap | null> {
  try {
    const res = await fetch(`/api/runway/preferences?userId=${encodeURIComponent(userId)}`, {
      cache: 'no-store',
      credentials: 'include',
      headers: buildRunwayPreferencesRequestHeaders(userId),
    });
    if (!res.ok) return null;
    const body = (await res.json()) as { sectionFavorites?: FavoritesMap };
    return body.sectionFavorites ?? null;
  } catch {
    return null;
  }
}

async function persistUserRunwayFavorites(userId: string, map: FavoritesMap): Promise<void> {
  try {
    await fetch('/api/runway/preferences', {
      method: 'PUT',
      credentials: 'include',
      headers: buildRunwayPreferencesRequestHeaders(userId),
      body: JSON.stringify({ userId, sectionFavorites: map }),
      keepalive: true,
    });
  } catch {
    /* best-effort sync */
  }
}

/** Избранный вариант секции per product (localStorage; sync с profile API при auth). */
export function useRunwaySectionFavorites(productSlug: string) {
  const { user } = useAuth();
  const userId = user?.uid;
  const storageKey = useMemo(
    () =>
      userId ? runwaySectionFavoritesKeyForUser(userId) : RUNWAY_SECTION_FAVORITES_STORAGE_KEY,
    [userId]
  );
  const [favoriteIndex, setFavoriteIndexState] = useState<number | null>(null);
  const hydratedRef = useRef(false);

  useEffect(() => {
    hydratedRef.current = false;
    const map = readFavorites(storageKey);
    const stored = map[productSlug];
    setFavoriteIndexState(stored != null && Number.isFinite(stored) ? stored : null);

    if (!userId) {
      hydratedRef.current = true;
      return;
    }

    let cancelled = false;
    void fetchUserRunwayFavorites(userId).then((remote) => {
      if (cancelled || !remote) {
        hydratedRef.current = true;
        return;
      }
      writeFavorites(storageKey, { ...readFavorites(storageKey), ...remote });
      const merged = remote[productSlug];
      if (merged != null && Number.isFinite(merged)) {
        setFavoriteIndexState(merged);
      }
      hydratedRef.current = true;
    });

    return () => {
      cancelled = true;
    };
  }, [productSlug, storageKey, userId]);

  const setFavorite = useCallback(
    (sectionIndex: number | null) => {
      const map = readFavorites(storageKey);
      if (sectionIndex == null) {
        delete map[productSlug];
        setFavoriteIndexState(null);
      } else {
        map[productSlug] = sectionIndex;
        setFavoriteIndexState(sectionIndex);
      }
      writeFavorites(storageKey, map);
      if (userId && hydratedRef.current) {
        void persistUserRunwayFavorites(userId, map);
      }
    },
    [productSlug, storageKey, userId]
  );

  const toggleFavorite = useCallback(
    (sectionIndex: number) => {
      setFavorite(favoriteIndex === sectionIndex ? null : sectionIndex);
    },
    [favoriteIndex, setFavorite]
  );

  const isFavorite = useCallback(
    (sectionIndex: number) => favoriteIndex === sectionIndex,
    [favoriteIndex]
  );

  return { favoriteIndex, setFavorite, toggleFavorite, isFavorite };
}

/** Синхронное чтение favorite (для URL sync / initial jump). */
export function getRunwayFavoriteSection(
  productSlug: string,
  userId?: string | null
): number | null {
  const key = userId
    ? runwaySectionFavoritesKeyForUser(userId)
    : RUNWAY_SECTION_FAVORITES_STORAGE_KEY;
  const stored = readFavorites(key)[productSlug];
  return stored != null && Number.isFinite(stored) ? stored : null;
}
