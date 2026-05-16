'use client';

import { useMemo, useState } from 'react';
import { stagesArticleDisplayLabel } from '@/lib/production/stages-tab-facets';
import { type CollectionStep } from '@/lib/production/collection-steps-catalog';
import type { ProductionFlowProfileId } from '@/lib/production/collection-production-profiles';
import type { CollectionSkuFlowDoc } from '@/lib/production/unified-sku-flow-store';
import {
  getSkuContourNavigationDetail,
  hintTextForArticleNextCatalogStep,
  type StagesLocalInventoryTools,
  type StagesLocalInventoryToolsInput,
  type StagesTabArticle,
} from '@/components/brand/production/stages-dependencies-tab-content-helpers';

export function useStagesDependenciesPreTabsDerived(args: {
  flowDoc: CollectionSkuFlowDoc;
  steps: CollectionStep[];
  focusArticle: StagesTabArticle | null;
  productionProfileId: ProductionFlowProfileId;
  localInventoryTools?: StagesLocalInventoryToolsInput;
  poolArticleCount: number;
  contextFilterActive: boolean;
  clearAllFacets: () => void;
}) {
  const {
    flowDoc,
    steps,
    focusArticle,
    productionProfileId,
    localInventoryTools,
    poolArticleCount,
    contextFilterActive,
    clearAllFacets,
  } = args;

  const focusSkuContourGuidance = useMemo(() => {
    if (!focusArticle) return null;
    const label = stagesArticleDisplayLabel(focusArticle.sku, focusArticle.season);
    const narrative = hintTextForArticleNextCatalogStep(
      flowDoc,
      steps,
      focusArticle,
      label,
      productionProfileId
    );
    const detail = getSkuContourNavigationDetail(flowDoc, steps, focusArticle, productionProfileId);
    return { ...detail, narrative, label };
  }, [flowDoc, steps, focusArticle, productionProfileId]);

  const focusSkuMatrixPhase = useMemo(() => {
    if (!focusArticle) return '';
    const st = steps.find((s) => s.id === focusArticle.currentStageId);
    return st?.phase?.trim() ?? '';
  }, [focusArticle, steps]);

  const mergedLocalInventoryTools: StagesLocalInventoryTools | null = localInventoryTools
    ? {
        ...localInventoryTools,
        poolArticleCount,
        contextFilterActive,
        onResetFacets: clearAllFacets,
      }
    : null;

  const sliceEmptyButCollectionHasArticles =
    Boolean(mergedLocalInventoryTools) &&
    mergedLocalInventoryTools!.totalArticlesInCollection > 0 &&
    mergedLocalInventoryTools!.poolArticleCount === 0 &&
    mergedLocalInventoryTools!.contextFilterActive;

  /** Импорт/экспорт и добавление SKU — по кнопке, без тяжёлого блока по умолчанию. */
  const [localInventoryOpen, setLocalInventoryOpen] = useState(false);

  return {
    focusSkuContourGuidance,
    focusSkuMatrixPhase,
    mergedLocalInventoryTools,
    sliceEmptyButCollectionHasArticles,
    localInventoryOpen,
    setLocalInventoryOpen,
  };
}
