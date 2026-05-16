'use client';

import { useMemo } from 'react';
import type { CollectionArticle } from '@/app/brand/production/production-page-types';
import type { ProductionFloorTabId } from '@/lib/production/floor-flow';
import { buildCollectionChecklist } from '@/app/brand/production/production-page-collection-articles-helpers';

export function useBrandProductionCollectionChecklist(args: {
  collectionArticles: readonly CollectionArticle[];
  collectionQuery: string;
  floorHref: (floorTab: ProductionFloorTabId) => string;
}) {
  const { collectionArticles, collectionQuery, floorHref } = args;

  return useMemo(
    () => buildCollectionChecklist(collectionArticles, collectionQuery, floorHref),
    [collectionArticles, collectionQuery, floorHref]
  );
}
