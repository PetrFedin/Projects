'use client';

import { useMemo } from 'react';
import type { CollectionArticle } from '@/app/brand/production/production-page-types';
import {
  buildAggregateStatusMap,
  type CollectionSkuFlowDoc,
} from '@/lib/production/unified-sku-flow-store';
import { COLLECTION_STEPS } from '@/lib/production/collection-steps-catalog';

export function useBrandProductionCollectionArticlesAggregates(args: {
  collectionArticles: readonly CollectionArticle[];
  flowDocReady: CollectionSkuFlowDoc;
}) {
  const { collectionArticles, flowDocReady } = args;

  const skuIds = useMemo(() => collectionArticles.map((a) => a.id), [collectionArticles]);

  const aggregateStatus = useMemo(
    () => buildAggregateStatusMap(flowDocReady, skuIds, COLLECTION_STEPS),
    [flowDocReady, skuIds]
  );

  const completedCount = COLLECTION_STEPS.filter((s) => aggregateStatus[s.id] === 'done').length;
  const progressPct = Math.round((completedCount / COLLECTION_STEPS.length) * 100);

  const articlesByStage = useMemo(() => {
    const acc: Record<string, number> = {};
    collectionArticles.forEach((a) => {
      acc[a.currentStageId] = (acc[a.currentStageId] ?? 0) + 1;
    });
    return acc;
  }, [collectionArticles]);

  const totalForecastRevenue = useMemo(
    () => collectionArticles.reduce((sum, a) => sum + a.forecastRevenue, 0),
    [collectionArticles]
  );
  const totalForecastQty = useMemo(
    () => collectionArticles.reduce((sum, a) => sum + a.forecastQty, 0),
    [collectionArticles]
  );

  const articlesProgressSummary = useMemo(() => {
    const withTechPack = collectionArticles.filter((a) => a.techPackDone).length;
    const withSamples = collectionArticles.filter((a) => a.samplesDone).length;
    const withPo = collectionArticles.filter((a) => a.poDone).length;
    const ready = collectionArticles.filter((a) => a.ready).length;
    const total = collectionArticles.length;
    return { withTechPack, withSamples, withPo, ready, total };
  }, [collectionArticles]);

  return {
    aggregateStatus,
    completedCount,
    progressPct,
    articlesByStage,
    totalForecastRevenue,
    totalForecastQty,
    articlesProgressSummary,
  };
}
