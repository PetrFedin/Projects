'use client';

import { useCallback } from 'react';
import {
  STAGES_MATRIX_PHASE_PARAM,
  STAGES_MATRIX_Q_PARAM,
  STAGES_SKU_PARAM,
  STAGES_WORK_SKU_PARAM,
} from '@/lib/production/stages-url';
import {
  STAGES_FILTER_SUB_PARAM,
  decodeFacetList,
  encodeFacetList,
  finishStagesFilterMutation,
  subTabFromStagesParams,
} from '@/components/brand/production/stages-dependencies-tab-content-helpers';

export type StagesUrlReplaceQuery = (mutate: (p: URLSearchParams) => void) => void;

export type StagesDependenciesUrlMutations = {
  setFocusSku: (id: string, opts?: { preserveChain?: boolean }) => void;
  toggleFacetValue: (
    param: 'stagesAudience' | 'stagesSeason' | 'stagesL1' | 'stagesL2' | 'stagesL3' | 'stagesFab',
    value: string
  ) => void;
  toggleChainFocus: (stepId: string) => void;
  clearAllFacets: () => void;
};

/** Колбэки, мутирующие query через общий `replaceQuery`. */
export function useStagesDependenciesUrlMutations(
  replaceQuery: StagesUrlReplaceQuery
): StagesDependenciesUrlMutations {
  const setFocusSku = useCallback(
    (id: string, opts?: { preserveChain?: boolean }) => {
      replaceQuery((params) => {
        if (id) params.set(STAGES_SKU_PARAM, id);
        else params.delete(STAGES_SKU_PARAM);
        params.delete('stagesPick');
        params.delete(STAGES_WORK_SKU_PARAM);
        if (!opts?.preserveChain) params.delete('stagesChainFocus');
        finishStagesFilterMutation(params, subTabFromStagesParams(params));
      });
    },
    [replaceQuery]
  );

  const toggleFacetValue = useCallback(
    (
      param: 'stagesAudience' | 'stagesSeason' | 'stagesL1' | 'stagesL2' | 'stagesL3' | 'stagesFab',
      value: string
    ) => {
      replaceQuery((params) => {
        const cur = decodeFacetList(params.get(param));
        const next = new Set(cur);
        if (next.has(value)) next.delete(value);
        else next.add(value);
        const enc = encodeFacetList(next);
        if (!enc) params.delete(param);
        else params.set(param, enc);
        finishStagesFilterMutation(params, subTabFromStagesParams(params));
      });
    },
    [replaceQuery]
  );

  const toggleChainFocus = useCallback(
    (stepId: string) => {
      replaceQuery((params) => {
        const cur = params.get('stagesChainFocus');
        if (cur === stepId) {
          params.delete('stagesChainFocus');
          finishStagesFilterMutation(params, undefined);
        } else {
          params.set('stagesChainFocus', stepId);
          params.delete('stagesMatrixSku');
          finishStagesFilterMutation(params, 'process');
        }
      });
    },
    [replaceQuery]
  );

  const clearAllFacets = useCallback(() => {
    replaceQuery((params) => {
      params.delete('stagesSeason');
      params.delete('stagesAudience');
      params.delete('stagesL1');
      params.delete('stagesL2');
      params.delete('stagesL3');
      params.delete('stagesFab');
      params.delete('stagesChainFocus');
      params.delete(STAGES_MATRIX_PHASE_PARAM);
      params.delete(STAGES_MATRIX_Q_PARAM);
      params.delete(STAGES_FILTER_SUB_PARAM);
      finishStagesFilterMutation(params, undefined);
    });
  }, [replaceQuery]);

  return { setFocusSku, toggleFacetValue, toggleChainFocus, clearAllFacets };
}
