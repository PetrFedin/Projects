'use client';

import { useMemo, type Dispatch, type MutableRefObject, type SetStateAction } from 'react';
import type { ReadonlyURLSearchParams } from 'next/navigation';
import type { ProductionPageOrderLike } from '@/app/brand/production/production-page-build-items-for-collection';
import { buildCollectionArticlesFromFlowDoc } from '@/app/brand/production/build-collection-articles-from-flow-doc';
import { useBrandProductionStagesSkuContext } from '@/app/brand/production/use-brand-production-stages-sku-context';
import { useBrandProductionPendingStagesSkuFocusEffect } from '@/app/brand/production/use-brand-production-pending-stages-sku-focus-effect';
import { useBrandProductionCollectionModuleSaveHandler } from '@/app/brand/production/use-brand-production-collection-module-save-handler';
import { useBrandProductionCollectionArticlesAggregates } from '@/app/brand/production/use-brand-production-collection-articles-aggregates';
import type { CollectionSkuFlowDoc } from '@/lib/production/unified-sku-flow-store';
import type { ProductionFloorTabId } from '@/lib/production/floor-flow';

type ToastLike = (opts: { title: string; description?: string; duration?: number }) => void;

export function useBrandProductionCollectionArticlesModel(args: {
  searchParams: ReadonlyURLSearchParams;
  pathname: string;
  router: { replace: (href: string, options?: { scroll?: boolean }) => void };
  toast: ToastLike;
  tab: ProductionFloorTabId;
  localInventoryHydrated: boolean;
  collectionFlowKey: string;
  itemsForCollection: readonly ProductionPageOrderLike[];
  flowDocReady: CollectionSkuFlowDoc;
  pendingFocusLocalSkuRef: MutableRefObject<string | null>;
  setUnifiedDoc: Dispatch<SetStateAction<CollectionSkuFlowDoc>>;
}) {
  const {
    searchParams,
    pathname,
    router,
    toast,
    tab,
    localInventoryHydrated,
    collectionFlowKey,
    itemsForCollection,
    flowDocReady,
    pendingFocusLocalSkuRef,
    setUnifiedDoc,
  } = args;

  const collectionArticles = useMemo(
    () => buildCollectionArticlesFromFlowDoc(itemsForCollection, flowDocReady),
    [itemsForCollection, flowDocReady]
  );

  useBrandProductionPendingStagesSkuFocusEffect({
    collectionArticles,
    pathname,
    router,
    searchParams,
    pendingFocusLocalSkuRef,
  });

  const {
    stagesSkuContextId,
    stagesSkuContextLine,
    stagesStepContextId,
    stagesStepContextTitle,
    stagesSkuCatalogContext,
    articleContextValid,
  } = useBrandProductionStagesSkuContext({
    searchParams,
    collectionArticles,
    localInventoryHydrated,
    collectionFlowKey,
    pathname,
    router,
    toast,
    tab,
  });

  const { handleCollectionModuleSaved } = useBrandProductionCollectionModuleSaveHandler({
    collectionArticles,
    collectionFlowKey,
    setUnifiedDoc,
  });

  const {
    aggregateStatus,
    completedCount,
    progressPct,
    articlesByStage,
    totalForecastRevenue,
    totalForecastQty,
    articlesProgressSummary,
  } = useBrandProductionCollectionArticlesAggregates({
    collectionArticles,
    flowDocReady,
  });

  return {
    collectionArticles,
    stagesSkuContextId,
    stagesSkuContextLine,
    stagesStepContextId,
    stagesStepContextTitle,
    stagesSkuCatalogContext,
    articleContextValid,
    handleCollectionModuleSaved,
    aggregateStatus,
    completedCount,
    progressPct,
    articlesByStage,
    totalForecastRevenue,
    totalForecastQty,
    articlesProgressSummary,
  };
}
