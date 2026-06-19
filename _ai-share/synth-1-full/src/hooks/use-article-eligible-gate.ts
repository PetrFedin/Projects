'use client';

import { useEffect, useState } from 'react';

export type ArticleEligibleGate = {
  eligibleForCollection: boolean;
  sources: string[];
  reasons: string[];
};

/** Столп 2 · F-ELIGIBLE — Centric Approved / signoff / lifecycle. */
export function useArticleEligibleGate(
  collectionId: string,
  articleId: string,
  enabled = true,
  reloadNonce = 0
) {
  const [gate, setGate] = useState<ArticleEligibleGate | null>(null);
  const [loadState, setLoadState] = useState<'idle' | 'loading' | 'ready' | 'error'>('idle');

  useEffect(() => {
    if (!enabled || !collectionId?.trim() || !articleId?.trim()) {
      setGate(null);
      setLoadState('idle');
      return;
    }
    let cancelled = false;
    setLoadState('loading');
    void (async () => {
      try {
        const res = await fetch(
          `/api/integrations/v1/articles/${encodeURIComponent(collectionId)}/${encodeURIComponent(articleId)}/eligible`,
          { cache: 'no-store' }
        );
        if (!res.ok) throw new Error('eligible failed');
        const json = (await res.json()) as {
          data?: ArticleEligibleGate;
        };
        if (!cancelled) {
          setGate(json.data ?? null);
          setLoadState('ready');
        }
      } catch {
        if (!cancelled) {
          setGate(null);
          setLoadState('error');
        }
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [collectionId, articleId, enabled, reloadNonce]);

  return { gate, loadState };
}
