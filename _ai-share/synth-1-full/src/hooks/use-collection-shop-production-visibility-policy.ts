'use client';

import { useCallback, useEffect, useState } from 'react';
import { buildWorkshop2ApiRequestHeaders } from '@/lib/production/workshop2-api-client-headers';
import {
  DEFAULT_SHOP_PRODUCTION_VISIBILITY,
  getShopProductionVisibilityPolicy,
  type ShopProductionVisibility,
  type ShopProductionVisibilityPolicy,
} from '@/lib/platform-core-shop-production-visibility';

type Result = {
  visibility: ShopProductionVisibility;
  source: 'pg' | 'env_default';
  policy: ShopProductionVisibilityPolicy;
  loading: boolean;
  reload: () => void;
};

export function useCollectionShopProductionVisibilityPolicy(
  collectionId: string,
  enabled = true
): Result {
  const cid = collectionId.trim();
  const [visibility, setVisibility] = useState<ShopProductionVisibility>(
    DEFAULT_SHOP_PRODUCTION_VISIBILITY
  );
  const [source, setSource] = useState<'pg' | 'env_default'>('env_default');
  const [loading, setLoading] = useState(true);
  const [reloadNonce, setReloadNonce] = useState(0);

  const reload = useCallback(() => setReloadNonce((n) => n + 1), []);

  useEffect(() => {
    if (!enabled || !cid) {
      setLoading(false);
      return;
    }
    let cancelled = false;
    setLoading(true);
    void (async () => {
      try {
        const res = await fetch(
          `/api/workshop2/collections/${encodeURIComponent(cid)}/shop-production-visibility`,
          { headers: buildWorkshop2ApiRequestHeaders(), cache: 'no-store' }
        );
        const json = (await res.json()) as {
          ok?: boolean;
          visibility?: ShopProductionVisibility;
          source?: 'pg' | 'env_default';
        };
        if (!cancelled && json.ok && json.visibility) {
          setVisibility(json.visibility);
          setSource(json.source ?? 'env_default');
        }
      } catch {
        if (!cancelled) {
          setVisibility(DEFAULT_SHOP_PRODUCTION_VISIBILITY);
          setSource('env_default');
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [cid, enabled, reloadNonce]);

  return {
    visibility,
    source,
    policy: getShopProductionVisibilityPolicy(visibility),
    loading,
    reload,
  };
}
