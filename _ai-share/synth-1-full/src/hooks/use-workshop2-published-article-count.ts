'use client';

import { useCallback, useEffect, useState } from 'react';
import { buildWorkshop2ApiRequestHeaders } from '@/lib/production/workshop2-api-client-headers';

export type Workshop2PublishedArticleCountState = {
  count: number | null;
  loading: boolean;
  error: boolean;
  refresh: () => void;
};

/** Единый live-count опубликованных артикулов (mini + full pages). */
export function useWorkshop2PublishedArticleCount(
  collectionId: string,
  reloadNonce = 0
): Workshop2PublishedArticleCountState {
  const [count, setCount] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [nonce, setNonce] = useState(0);

  const refresh = useCallback(() => setNonce((n) => n + 1), []);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError(false);
    void (async () => {
      try {
        const res = await fetch(
          `/api/workshop2/collections/${encodeURIComponent(collectionId)}/published-articles`,
          { headers: buildWorkshop2ApiRequestHeaders(), cache: 'no-store' }
        );
        const json = (await res.json()) as { ok?: boolean; articles?: unknown[] };
        if (cancelled) return;
        if (json.ok && Array.isArray(json.articles)) {
          setCount(json.articles.length);
        } else {
          setCount(0);
          setError(true);
        }
      } catch {
        if (!cancelled) {
          setCount(null);
          setError(true);
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [collectionId, reloadNonce, nonce]);

  return { count, loading, error, refresh };
}
