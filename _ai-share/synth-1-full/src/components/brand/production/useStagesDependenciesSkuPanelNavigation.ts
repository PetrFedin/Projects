'use client';

import { useCallback, useEffect } from 'react';
import {
  STAGES_MATRIX_PHASE_PARAM,
  STAGES_SKU_PARAM,
  STAGES_SKU_PANEL_STEP_PARAM,
  STAGES_SKU_PANEL_TAB_PARAM,
  STAGES_WORK_SKU_PARAM,
  type StagesSkuPanelTab,
} from '@/lib/production/stages-url';
import {
  finishStagesFilterMutation,
  normalizeStagesSub,
  subTabFromStagesParams,
  type StagesTabArticle,
} from '@/components/brand/production/stages-dependencies-tab-content-helpers';

export function useStagesDependenciesSkuPanelNavigation(args: {
  stagesMatrixSkuParam: string;
  poolArticles: StagesTabArticle[];
  replaceQuery: (mutate: (p: URLSearchParams) => void) => void;
}) {
  const { stagesMatrixSkuParam, poolArticles, replaceQuery } = args;

  useEffect(() => {
    if (!stagesMatrixSkuParam) return;
    const inPool = poolArticles.some((a) => a.id === stagesMatrixSkuParam);
    if (!inPool) {
      replaceQuery((params) => {
        params.delete('stagesMatrixSku');
        finishStagesFilterMutation(params, undefined);
      });
      return;
    }
    replaceQuery((params) => {
      params.set(STAGES_SKU_PARAM, stagesMatrixSkuParam);
      params.delete('stagesMatrixSku');
      params.delete('stagesPick');
      params.delete(STAGES_WORK_SKU_PARAM);
      if (normalizeStagesSub(params.get('stagesSub')) !== 'sku') {
        params.set('stagesSub', 'sku');
      }
      finishStagesFilterMutation(params, 'sku');
    });
  }, [stagesMatrixSkuParam, poolArticles, replaceQuery]);

  const openSkuPanelForStep = useCallback(
    (skuId: string, stepId: string, panelTab?: StagesSkuPanelTab) => {
      replaceQuery((params) => {
        if (skuId) params.set(STAGES_SKU_PARAM, skuId);
        params.set('stagesSub', 'sku');
        params.set(STAGES_SKU_PANEL_STEP_PARAM, stepId);
        if (panelTab && panelTab !== 'process') params.set(STAGES_SKU_PANEL_TAB_PARAM, panelTab);
        else params.delete(STAGES_SKU_PANEL_TAB_PARAM);
        params.set('floorTab', 'stages');
        params.delete('stagesPick');
        params.delete(STAGES_WORK_SKU_PARAM);
        finishStagesFilterMutation(params, 'sku');
      });
    },
    [replaceQuery]
  );

  const setMatrixPhaseFilter = useCallback(
    (phase: string | null) => {
      replaceQuery((params) => {
        if (phase?.trim()) params.set(STAGES_MATRIX_PHASE_PARAM, phase.trim());
        else params.delete(STAGES_MATRIX_PHASE_PARAM);
        finishStagesFilterMutation(params, subTabFromStagesParams(params));
      });
    },
    [replaceQuery]
  );

  const consumePendingSkuPanel = useCallback(() => {
    replaceQuery((params) => {
      params.delete(STAGES_SKU_PANEL_STEP_PARAM);
      params.delete(STAGES_SKU_PANEL_TAB_PARAM);
    });
  }, [replaceQuery]);

  return {
    openSkuPanelForStep,
    setMatrixPhaseFilter,
    consumePendingSkuPanel,
  };
}
