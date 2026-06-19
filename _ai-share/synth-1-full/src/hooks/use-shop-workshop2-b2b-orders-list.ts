'use client';

import { useEffect, useMemo, useState } from 'react';
import { usePlatformCoreB2bRegistryPoll } from '@/hooks/use-platform-core-b2b-registry-poll';
import { buildWorkshop2ApiRequestHeaders } from '@/lib/production/workshop2-api-client-headers';
import type { Workshop2B2bOrderRecord } from '@/lib/production/workshop2-b2b-order-lifecycle';
import {
  SHOP_CORE_W2_COLLECTION_IDS,
  type ShopB2bOrderListRow,
  workshop2B2bOrderToShopListRow,
} from '@/lib/order/shop-workshop2-b2b-order-ui';
import { useShopCoreBuyerId } from '@/hooks/use-shop-core-buyer-id';

type LoadState = 'idle' | 'loading' | 'ready' | 'error';

export function useShopWorkshop2B2bOrdersList(enabled: boolean): {
  rows: ShopB2bOrderListRow[] | null;
  loadState: LoadState;
  reload: () => void;
} {
  const [rows, setRows] = useState<ShopB2bOrderListRow[] | null>(null);
  const [loadState, setLoadState] = useState<LoadState>('idle');
  const [reloadNonce, setReloadNonce] = useState(0);
  const { buyerId, ready: buyerReady } = useShopCoreBuyerId();
  const { tick: registryTick } = usePlatformCoreB2bRegistryPoll(enabled && buyerReady);

  useEffect(() => {
    if (!enabled || !buyerReady) {
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
          SHOP_CORE_W2_COLLECTION_IDS.map(async (collectionId) => {
            const res = await fetch(
              `/api/shop/b2b/orders?buyerId=${encodeURIComponent(buyerId)}&collectionId=${encodeURIComponent(collectionId)}`,
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
          .map(workshop2B2bOrderToShopListRow);
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
  }, [enabled, buyerId, buyerReady, registryTick, reloadNonce]);

  return useMemo(
    () => ({ rows, loadState, reload: () => setReloadNonce((n) => n + 1) }),
    [rows, loadState]
  );
}
