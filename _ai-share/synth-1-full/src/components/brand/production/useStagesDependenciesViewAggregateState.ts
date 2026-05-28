'use client';

import { useCallback, useMemo, type Dispatch, type SetStateAction } from 'react';
import { type CollectionStep } from '@/lib/production/collection-steps-catalog';
import {
  getEffectiveDependsOn,
  type ProductionFlowProfileId,
} from '@/lib/production/collection-production-profiles';
import {
  aggregateDepSatisfied,
  aggregateSkuProgressLine,
  appendSkuStageAuditLine,
  buildAggregateStatusMap,
  patchSkuStage,
  setStageStatusForAllSkus,
  type CollectionSkuFlowDoc,
  type MatrixStepStatus,
  type SkuStageDetail,
} from '@/lib/production/unified-sku-flow-store';
import type { StagesTabArticle } from '@/components/brand/production/stages-dependencies-tab-content-helpers';

export function useStagesDependenciesViewAggregateState(args: {
  flowDoc: CollectionSkuFlowDoc;
  steps: CollectionStep[];
  focusArticle: StagesTabArticle | null;
  chainFocusStepId: string;
  productionProfileId: ProductionFlowProfileId;
  setUnifiedDoc: Dispatch<SetStateAction<CollectionSkuFlowDoc>>;
}) {
  const { flowDoc, steps, focusArticle, chainFocusStepId, productionProfileId, setUnifiedDoc } =
    args;

  const viewArticles = useMemo(() => {
    if (!focusArticle) return [];
    if (chainFocusStepId && focusArticle.currentStageId !== chainFocusStepId) return [];
    return [focusArticle];
  }, [focusArticle, chainFocusStepId]);

  const effectiveSkuIds = useMemo(() => viewArticles.map((a) => a.id), [viewArticles]);

  const aggregateStatus = useMemo(
    () => buildAggregateStatusMap(flowDoc, effectiveSkuIds, steps),
    [flowDoc, effectiveSkuIds, steps]
  );

  const depSatisfied = useCallback(
    (depId: string): boolean => {
      const depStep = steps.find((x) => x.id === depId);
      return aggregateDepSatisfied(flowDoc, effectiveSkuIds, depId, depStep);
    },
    [flowDoc, effectiveSkuIds, steps]
  );

  const isBlocked = useCallback(
    (step: CollectionStep) =>
      getEffectiveDependsOn(step, productionProfileId).some((depId) => !depSatisfied(depId)),
    [depSatisfied, productionProfileId]
  );

  const markStatus = (id: string, next: MatrixStepStatus) => {
    if (effectiveSkuIds.length === 0) return;
    setUnifiedDoc((d) => setStageStatusForAllSkus(d, effectiveSkuIds, id, next));
  };

  const patchSkuStageLocal = useCallback(
    (skuId: string, stepId: string, patch: Partial<SkuStageDetail>) => {
      setUnifiedDoc((d) => patchSkuStage(d, skuId, stepId, patch));
    },
    [setUnifiedDoc]
  );

  const appendSkuAuditLineLocal = useCallback(
    (skuId: string, stepId: string, line: { summary: string; by?: string }) => {
      setUnifiedDoc((d) => appendSkuStageAuditLine(d, skuId, stepId, line));
    },
    [setUnifiedDoc]
  );

  const columnStats = useMemo(() => {
    return steps.map((step) => {
      const here = viewArticles.filter((a) => a.currentStageId === step.id);
      let done = 0;
      let prog = 0;
      let block = 0;
      for (const a of here) {
        const st = flowDoc.skus[a.id]?.stages[step.id]?.status ?? 'not_started';
        if (st === 'done' || st === 'skipped') done += 1;
        else if (st === 'blocked') block += 1;
        else if (st === 'in_progress') prog += 1;
      }
      return {
        step,
        here,
        done,
        prog,
        block,
        line: aggregateSkuProgressLine(flowDoc, effectiveSkuIds, step.id),
      };
    });
  }, [steps, viewArticles, flowDoc, effectiveSkuIds]);

  return {
    viewArticles,
    effectiveSkuIds,
    aggregateStatus,
    depSatisfied,
    isBlocked,
    markStatus,
    patchSkuStageLocal,
    appendSkuAuditLineLocal,
    columnStats,
  };
}
