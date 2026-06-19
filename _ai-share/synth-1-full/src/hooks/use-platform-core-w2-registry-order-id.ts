'use client';

import { useEffect, useState } from 'react';
import { buildWorkshop2ApiRequestHeaders } from '@/lib/production/workshop2-api-client-headers';
import { useShopCoreBuyerId } from '@/hooks/use-shop-core-buyer-id';

type Role = 'brand' | 'shop';

/** Последний B2B-заказ коллекции из PG (workshop2_b2b_orders), не seed file. */
export function usePlatformCoreW2RegistryOrderId(
  role: Role,
  collectionId: string,
  enabled = true
): { orderId: string; loading: boolean } {
  const { buyerId, ready: buyerReady } = useShopCoreBuyerId();
  const [orderId, setOrderId] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!enabled || !collectionId.trim()) {
      setOrderId('');
      setLoading(false);
      return;
    }
    if (role === 'shop' && !buyerReady) {
      setLoading(true);
      return;
    }

    let cancelled = false;
    setLoading(true);
    void (async () => {
      try {
        const headers = buildWorkshop2ApiRequestHeaders();
        const url =
          role === 'shop'
            ? `/api/shop/b2b/orders?buyerId=${encodeURIComponent(buyerId)}&collectionId=${encodeURIComponent(collectionId)}`
            : `/api/brand/b2b/orders?collectionId=${encodeURIComponent(collectionId)}`;
        const res = await fetch(url, { headers, cache: 'no-store' });
        if (!res.ok) {
          if (!cancelled) setOrderId('');
          return;
        }
        const json = (await res.json()) as { ok?: boolean; orders?: Array<{ id?: string }> };
        const latest = json.ok && Array.isArray(json.orders) ? json.orders[0]?.id?.trim() : '';
        if (!cancelled) setOrderId(latest ?? '');
      } catch {
        if (!cancelled) setOrderId('');
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [role, collectionId, enabled, buyerId, buyerReady]);

  return { orderId, loading };
}
