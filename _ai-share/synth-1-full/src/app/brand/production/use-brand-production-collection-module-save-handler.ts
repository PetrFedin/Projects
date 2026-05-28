'use client';

import { useCallback, useMemo, type Dispatch, type SetStateAction } from 'react';
import type { CollectionModuleSaveEvent } from '@/components/brand/production/CollectionStepModuleDialog';
import type { CollectionArticle } from '@/app/brand/production/production-page-types';
import { COLLECTION_FLOW_STEP_IDS } from '@/app/brand/production/production-page-collection-flow-step-ids';
import { BRAND_PRODUCTION_HUB_MODULE_KICKOFF_STEP_IDS } from '@/app/brand/production/brand-production-hub-module-kickoff-step-ids';
import { getProductionDataPort } from '@/lib/production-data';
import {
  ensureSkuStages,
  patchSkuStage,
  type CollectionSkuFlowDoc,
} from '@/lib/production/unified-sku-flow-store';

export function useBrandProductionCollectionModuleSaveHandler(args: {
  collectionArticles: readonly CollectionArticle[];
  collectionFlowKey: string;
  setUnifiedDoc: Dispatch<SetStateAction<CollectionSkuFlowDoc>>;
}) {
  const { collectionArticles, collectionFlowKey, setUnifiedDoc } = args;

  const skuIds = useMemo(() => collectionArticles.map((a) => a.id), [collectionArticles]);

  const handleCollectionModuleSaved = useCallback(
    (e: CollectionModuleSaveEvent) => {
      if (!e.firstSubstantiveSave || skuIds.length === 0) return;
      if (!BRAND_PRODUCTION_HUB_MODULE_KICKOFF_STEP_IDS.has(e.stepId)) return;
      const stepId = e.stepId;
      setUnifiedDoc((d) => {
        let next = d;
        for (const aid of skuIds) {
          const art = collectionArticles.find((a) => a.id === aid);
          const label = art?.sku ?? aid;
          next = ensureSkuStages(next, aid, label, COLLECTION_FLOW_STEP_IDS);
          const st = next.skus[aid]?.stages[stepId]?.status;
          if (st === 'not_started') {
            next = patchSkuStage(next, aid, stepId, { status: 'in_progress' });
          }
        }
        void getProductionDataPort().saveSkuFlow(collectionFlowKey, next);
        return next;
      });
    },
    [skuIds, collectionArticles, collectionFlowKey, setUnifiedDoc]
  );

  return { handleCollectionModuleSaved };
}
