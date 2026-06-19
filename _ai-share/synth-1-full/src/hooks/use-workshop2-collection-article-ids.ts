'use client';

import { useCallback, useEffect, useState } from 'react';

/** PG article ids for collection (development-status API, до 200). */
export function useWorkshop2CollectionArticleIds(collectionId: string): {
  articleIds: string[];
  loading: boolean;
  reload: () => void;
} {
  const [articleIds, setArticleIds] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  const reload = useCallback(() => {
    const cid = collectionId.trim();
    if (!cid) {
      setArticleIds([]);
      setLoading(false);
      return;
    }
    setLoading(true);
    void (async () => {
      try {
        const res = await fetch(
          `/api/workshop2/collections/${encodeURIComponent(cid)}/development-status`,
          { cache: 'no-store' }
        );
        const json = (await res.json()) as { articleIds?: string[]; demoArticleId?: string };
        const ids = Array.isArray(json.articleIds)
          ? json.articleIds.map((id) => id.trim()).filter(Boolean)
          : json.demoArticleId?.trim()
            ? [json.demoArticleId.trim()]
            : [];
        setArticleIds(ids);
      } catch {
        setArticleIds([]);
      } finally {
        setLoading(false);
      }
    })();
  }, [collectionId]);

  useEffect(() => {
    reload();
  }, [reload]);

  return { articleIds, loading, reload };
}
