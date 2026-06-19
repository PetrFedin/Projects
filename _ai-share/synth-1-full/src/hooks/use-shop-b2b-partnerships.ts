'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';

import {
  buildShopB2bPartnershipsFallback,
  type ShopB2bPartnership,
} from '@/lib/shop/shop-b2b-partnerships';
import { SHOP_CORE_DEMO_BUYER_ID } from '@/lib/order/shop-workshop2-b2b-order-ui';

type LoadState = 'idle' | 'loading' | 'ready' | 'error';

export function useShopB2bPartnerships(input: {
  enabled: boolean;
  collectionId: string;
  buyerId?: string;
  reloadNonce?: number;
}): {
  partnerships: ShopB2bPartnership[];
  source: 'pg' | 'fallback' | null;
  loadState: LoadState;
  refresh: () => void;
} {
  const [partnerships, setPartnerships] = useState<ShopB2bPartnership[]>([]);
  const [source, setSource] = useState<'pg' | 'fallback' | null>(null);
  const [loadState, setLoadState] = useState<LoadState>('idle');
  const [reloadTick, setReloadTick] = useState(0);
  const refresh = useCallback(() => setReloadTick((n) => n + 1), []);
  const buyerId = input.buyerId ?? SHOP_CORE_DEMO_BUYER_ID;
  const reloadNonce = (input.reloadNonce ?? 0) + reloadTick;

  useEffect(() => {
    if (!input.enabled) {
      setPartnerships([]);
      setSource(null);
      setLoadState('idle');
      return;
    }

    let cancelled = false;
    setLoadState('loading');

    void (async () => {
      try {
        const params = new URLSearchParams({
          buyerId,
          collectionId: input.collectionId,
        });
        const res = await fetch(`/api/shop/b2b/partnerships?${params}`, { cache: 'no-store' });
        const json = (await res.json()) as {
          ok?: boolean;
          partnerships?: ShopB2bPartnership[];
          source?: 'pg' | 'fallback';
        };
        if (cancelled) return;
        if (json.ok && Array.isArray(json.partnerships) && json.partnerships.length) {
          setPartnerships(json.partnerships);
          setSource(json.source ?? 'pg');
          setLoadState('ready');
          return;
        }
        const fallback = buildShopB2bPartnershipsFallback(input.collectionId);
        setPartnerships(fallback);
        setSource('fallback');
        setLoadState('ready');
      } catch {
        if (!cancelled) {
          setPartnerships(buildShopB2bPartnershipsFallback(input.collectionId));
          setSource('fallback');
          setLoadState('error');
        }
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [input.enabled, input.collectionId, buyerId, reloadNonce]);

  return useMemo(
    () => ({ partnerships, source, loadState, refresh }),
    [partnerships, source, loadState, refresh]
  );
}
