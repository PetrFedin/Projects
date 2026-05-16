'use client';

import { useEffect, type MutableRefObject } from 'react';
import type { ReadonlyURLSearchParams } from 'next/navigation';
import type { CollectionArticle } from '@/app/brand/production/production-page-types';

export function useBrandProductionPendingStagesSkuFocusEffect(args: {
  collectionArticles: readonly CollectionArticle[];
  pathname: string;
  router: { replace: (href: string, options?: { scroll?: boolean }) => void };
  searchParams: ReadonlyURLSearchParams;
  pendingFocusLocalSkuRef: MutableRefObject<string | null>;
}) {
  const { collectionArticles, pathname, router, searchParams, pendingFocusLocalSkuRef } = args;

  useEffect(() => {
    const id = pendingFocusLocalSkuRef.current;
    if (!id) return;
    if (!collectionArticles.some((a) => a.id === id)) return;
    pendingFocusLocalSkuRef.current = null;
    const params = new URLSearchParams(searchParams.toString());
    params.set('stagesSku', id);
    params.set('floorTab', 'stages');
    params.set('stagesSub', 'sku');
    router.replace(`${pathname}?${params.toString()}`, { scroll: false });
  }, [collectionArticles, pathname, pendingFocusLocalSkuRef, router, searchParams]);
}
