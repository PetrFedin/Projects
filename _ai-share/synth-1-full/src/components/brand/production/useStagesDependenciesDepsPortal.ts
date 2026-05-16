'use client';

import { useMemo, useState } from 'react';
import { type CollectionStep } from '@/lib/production/collection-steps-catalog';
import type { ProductionFlowProfileId } from '@/lib/production/collection-production-profiles';
import type { ProductionFloorTabId } from '@/lib/production/floor-flow';
import type { CollectionSkuFlowDoc } from '@/lib/production/unified-sku-flow-store';
import type { Workshop2StagesDependenciesDepsNodeInfoPortalProps } from '@/components/brand/production/Workshop2StagesDependenciesDepsNodeInfoPortal';
import type { StagesSkuPanelTab } from '@/lib/production/stages-url';
import type { StagesTabArticle } from '@/components/brand/production/stages-dependencies-tab-content-helpers';

export function useStagesDependenciesDepsPortal(args: {
  steps: CollectionStep[];
  focusArticle: StagesTabArticle | null;
  flowDoc: CollectionSkuFlowDoc;
  productionProfileId: ProductionFlowProfileId;
  jumpToMatrixRow: (stepId: string) => void;
  mergeCollectionQuery: (href: string, collectionQuery: string) => string;
  collectionQuery: string;
  floorHref: (tab: ProductionFloorTabId) => string;
  navigateToStageModule: (step: CollectionStep, targetHref: string) => void;
  openSkuPanelForStep: (skuId: string, stepId: string, panelTab?: StagesSkuPanelTab) => void;
}) {
  const {
    steps,
    focusArticle,
    flowDoc,
    productionProfileId,
    jumpToMatrixRow,
    mergeCollectionQuery,
    collectionQuery,
    floorHref,
    navigateToStageModule,
    openSkuPanelForStep,
  } = args;

  const [depsNodeInfoStepId, setDepsNodeInfoStepId] = useState<string | null>(null);

  const depsInfoStep = useMemo(
    () => (depsNodeInfoStepId ? (steps.find((s) => s.id === depsNodeInfoStepId) ?? null) : null),
    [depsNodeInfoStepId, steps]
  );

  const depsInfoArticles = useMemo(
    () =>
      depsNodeInfoStepId && focusArticle && focusArticle.currentStageId === depsNodeInfoStepId
        ? [focusArticle]
        : [],
    [focusArticle, depsNodeInfoStepId]
  );

  const depsPortal: Workshop2StagesDependenciesDepsNodeInfoPortalProps | null = useMemo(() => {
    if (!depsInfoStep) return null;
    return {
      step: depsInfoStep,
      articles: depsInfoArticles,
      onClose: () => setDepsNodeInfoStepId(null),
      flowDoc,
      steps,
      productionProfileId,
      focusArticle,
      onJumpToMatrixRow: jumpToMatrixRow,
      mergeCollectionQuery,
      collectionQuery,
      floorHref,
      onNavigateToStageModule: navigateToStageModule,
      onOpenSkuPanelForStep: openSkuPanelForStep,
    };
  }, [
    depsInfoStep,
    depsInfoArticles,
    flowDoc,
    steps,
    productionProfileId,
    focusArticle,
    jumpToMatrixRow,
    mergeCollectionQuery,
    collectionQuery,
    floorHref,
    navigateToStageModule,
    openSkuPanelForStep,
  ]);

  return { setDepsNodeInfoStepId, depsPortal };
}
