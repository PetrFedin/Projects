'use client';

import { useEffect, useState } from 'react';
import { buildWorkshop2ApiRequestHeaders } from '@/lib/production/workshop2-api-client-headers';

export type Workshop2PgCollectionOption = {
  id: string;
  displayName: string;
};

/** PG collection ids для dynamic registry filter (волна 28). */
export function useWorkshop2PgCollections(enabled = true) {
  const [collections, setCollections] = useState<Workshop2PgCollectionOption[]>([]);
  const [loadState, setLoadState] = useState<'idle' | 'loading' | 'ready' | 'error'>('idle');

  useEffect(() => {
    if (!enabled) return;
    let cancelled = false;
    setLoadState('loading');
    void (async () => {
      try {
        const res = await fetch('/api/workshop2/collections', {
          headers: buildWorkshop2ApiRequestHeaders(),
          cache: 'no-store',
        });
        const json = (await res.json()) as {
          ok?: boolean;
          collections?: Workshop2PgCollectionOption[];
        };
        if (cancelled) return;
        if (json.ok && Array.isArray(json.collections)) {
          setCollections(json.collections);
          setLoadState('ready');
        } else {
          setCollections([]);
          setLoadState('error');
        }
      } catch {
        if (!cancelled) {
          setCollections([]);
          setLoadState('error');
        }
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [enabled]);

  return { collections, loadState, collectionIds: collections.map((c) => c.id) };
}
