'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';

import {
  normalizeShopCoreBuyerId,
  persistShopCoreBuyerIdClient,
  readShopCoreBuyerIdFromDocumentCookie,
  readShopCoreBuyerIdFromLocalStorage,
  resolveShopCoreBuyerIdFromClient,
  SHOP_CORE_BUYER_PRESETS,
  SHOP_CORE_BUYER_QUERY,
  shopCoreBuyerLabelRu,
} from '@/lib/order/shop-core-buyer-context';
import { useAuth } from '@/providers/auth-provider';

export function useShopCoreBuyerId(): {
  buyerId: string;
  buyerLabelRu: string;
  presets: typeof SHOP_CORE_BUYER_PRESETS;
  setBuyerId: (nextId: string) => void;
  ready: boolean;
} {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const { user } = useAuth();
  const [ready, setReady] = useState(false);
  const [buyerId, setBuyerIdState] = useState(() =>
    resolveShopCoreBuyerIdFromClient({
      searchBuyer: searchParams.get(SHOP_CORE_BUYER_QUERY),
      sessionUid: user?.uid,
    })
  );

  useEffect(() => {
    const resolved = resolveShopCoreBuyerIdFromClient({
      searchBuyer: searchParams.get(SHOP_CORE_BUYER_QUERY),
      cookieBuyer: readShopCoreBuyerIdFromDocumentCookie(),
      storageBuyer: readShopCoreBuyerIdFromLocalStorage(),
      activeOrganizationId: user?.activeOrganizationId,
      sessionUid: user?.uid,
    });
    setBuyerIdState(resolved);
    persistShopCoreBuyerIdClient(resolved);
    setReady(true);
  }, [searchParams, user?.activeOrganizationId, user?.uid]);

  const setBuyerId = useCallback(
    (nextId: string) => {
      const resolved = normalizeShopCoreBuyerId(nextId);
      persistShopCoreBuyerIdClient(resolved);
      setBuyerIdState(resolved);

      const params = new URLSearchParams(searchParams.toString());
      if (resolved === 'shop1') {
        params.delete(SHOP_CORE_BUYER_QUERY);
      } else {
        params.set(SHOP_CORE_BUYER_QUERY, resolved);
      }
      const qs = params.toString();
      router.replace(qs ? `${pathname}?${qs}` : pathname, { scroll: false });
    },
    [pathname, router, searchParams]
  );

  return useMemo(
    () => ({
      buyerId,
      buyerLabelRu: shopCoreBuyerLabelRu(buyerId),
      presets: SHOP_CORE_BUYER_PRESETS,
      setBuyerId,
      ready,
    }),
    [buyerId, ready, setBuyerId]
  );
}
