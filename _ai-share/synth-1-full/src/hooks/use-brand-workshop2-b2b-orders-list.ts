'use client';

import { useEffect, useMemo, useState } from 'react';
import { usePlatformCoreB2bRegistryPoll } from '@/hooks/use-platform-core-b2b-registry-poll';
import { buildWorkshop2ApiRequestHeaders } from '@/lib/production/workshop2-api-client-headers';
import type { Workshop2B2bOrderRecord } from '@/lib/production/workshop2-b2b-order-lifecycle';
import {
  BRAND_CORE_W2_COLLECTION_IDS,
  type BrandB2bOrderListRow,
  workshop2B2bOrderToBrandListRow,
} from '@/lib/order/brand-workshop2-b2b-order-ui';

type LoadState = 'idle' | 'loading' | 'ready' | 'error';

export function useBrandWorkshop2B2bOrdersList(
  enabled: boolean,
  reloadNonce = 0
): {
  rows: BrandB2bOrderListRow[] | null;
  loadState: LoadState;
} {
  const [rows, setRows] = useState<BrandB2bOrderListRow[] | null>(null);
  const [loadState, setLoadState] = useState<LoadState>('idle');
  const { tick: registryTick } = usePlatformCoreB2bRegistryPoll(enabled);

  useEffect(() => {
    if (!enabled) {
      setRows(null);
      setLoadState('idle');
      return;
    }

    let cancelled = false;
    setLoadState('loading');

    (async () => {
      try {
        const headers = buildWorkshop2ApiRequestHeaders();
        const responses = await Promise.all(
          BRAND_CORE_W2_COLLECTION_IDS.map(async (collectionId) => {
            const res = await fetch(
              `/api/brand/b2b/orders?collectionId=${encodeURIComponent(collectionId)}`,
              { headers, cache: 'no-store' }
            );
            if (!res.ok) return [] as Workshop2B2bOrderRecord[];
            const json = (await res.json()) as {
              ok?: boolean;
              orders?: Workshop2B2bOrderRecord[];
            };
            return json.ok && Array.isArray(json.orders) ? json.orders : [];
          })
        );
        const merged = responses
          .flat()
          .sort((a, b) => b.updatedAt.localeCompare(a.updatedAt))
          .map(workshop2B2bOrderToBrandListRow);
        if (!cancelled) {
          setRows(merged);
          setLoadState('ready');
        }
      } catch {
        if (!cancelled) {
          setRows([]);
          setLoadState('error');
        }
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [enabled, reloadNonce, registryTick]);

  return useMemo(() => ({ rows, loadState }), [rows, loadState]);
}
