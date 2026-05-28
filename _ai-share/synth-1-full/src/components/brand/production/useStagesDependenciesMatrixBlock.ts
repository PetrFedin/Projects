'use client';

import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  type Dispatch,
  type SetStateAction,
} from 'react';
import { type CollectionStep } from '@/lib/production/collection-steps-catalog';
import { saveStagesLastInnerSubTab } from '@/lib/production/stages-panels-session';
import { STAGES_MATRIX_PHASE_PARAM, STAGES_MATRIX_Q_PARAM } from '@/lib/production/stages-url';
import type { CollectionSkuFlowDoc } from '@/lib/production/unified-sku-flow-store';
import {
  finishStagesFilterMutation,
  subTabFromStagesParams,
  type StagesSubTab,
  type StagesTabArticle,
} from '@/components/brand/production/stages-dependencies-tab-content-helpers';

export type UseStagesDependenciesMatrixBlockArgs = {
  collectionFlowKey: string;
  replaceQuery: (mutate: (p: URLSearchParams) => void) => void;
  matrixTextQParam: string;
  steps: CollectionStep[];
  matrixPhaseParam: string;
  subTab: StagesSubTab;
  matrixExpanded: boolean;
  setMatrixOpen: Dispatch<SetStateAction<boolean>>;
  flowDoc: CollectionSkuFlowDoc;
  focusArticle: StagesTabArticle | null;
};

export type UseStagesDependenciesMatrixBlockResult = {
  matrixStageFilterQ: string;
  onMatrixSearchChange: (v: string) => void;
  clearMatrixFilters: () => void;
  jumpToMatrixRow: (stepId: string) => void;
  matrixStepsFiltered: CollectionStep[];
  scrollToCurrentMatrixStage: () => void;
};

export function useStagesDependenciesMatrixBlock(
  args: UseStagesDependenciesMatrixBlockArgs
): UseStagesDependenciesMatrixBlockResult {
  const {
    collectionFlowKey,
    replaceQuery,
    matrixTextQParam,
    steps,
    matrixPhaseParam,
    subTab,
    matrixExpanded,
    setMatrixOpen,
    flowDoc,
    focusArticle,
  } = args;

  const [matrixStageFilterQ, setMatrixStageFilterQ] = useState('');
  const pendingMatrixScrollRef = useRef<string | null>(null);
  const matrixSearchDebounceRef = useRef<number | null>(null);

  useEffect(() => {
    setMatrixStageFilterQ(matrixTextQParam);
  }, [matrixTextQParam]);

  useEffect(() => {
    return () => {
      if (matrixSearchDebounceRef.current) window.clearTimeout(matrixSearchDebounceRef.current);
    };
  }, []);

  const flushMatrixSearchToUrl = useCallback(
    (raw: string) => {
      replaceQuery((params) => {
        const t = raw.trim();
        if (t) params.set(STAGES_MATRIX_Q_PARAM, t);
        else params.delete(STAGES_MATRIX_Q_PARAM);
        finishStagesFilterMutation(params, subTabFromStagesParams(params));
      });
    },
    [replaceQuery]
  );

  const onMatrixSearchChange = useCallback(
    (v: string) => {
      setMatrixStageFilterQ(v);
      if (matrixSearchDebounceRef.current) window.clearTimeout(matrixSearchDebounceRef.current);
      matrixSearchDebounceRef.current = window.setTimeout(() => flushMatrixSearchToUrl(v), 420);
    },
    [flushMatrixSearchToUrl]
  );

  const clearMatrixFilters = useCallback(() => {
    if (matrixSearchDebounceRef.current) window.clearTimeout(matrixSearchDebounceRef.current);
    setMatrixStageFilterQ('');
    replaceQuery((params) => {
      params.delete(STAGES_MATRIX_PHASE_PARAM);
      params.delete(STAGES_MATRIX_Q_PARAM);
      finishStagesFilterMutation(params, subTabFromStagesParams(params));
    });
  }, [replaceQuery]);

  const matrixStepsFiltered = useMemo(() => {
    let list = steps;
    if (matrixPhaseParam) {
      list = list.filter((s) => s.phase === matrixPhaseParam);
    }
    const q = matrixStageFilterQ.trim().toLowerCase();
    if (!q) return list;
    return list.filter(
      (s) =>
        s.title.toLowerCase().includes(q) ||
        (s.phase?.toLowerCase().includes(q) ?? false) ||
        s.id.toLowerCase().includes(q) ||
        s.area.toLowerCase().includes(q)
    );
  }, [steps, matrixStageFilterQ, matrixPhaseParam]);

  const jumpToMatrixRow = useCallback(
    (stepId: string) => {
      if (typeof window === 'undefined' || !stepId.trim()) return;
      pendingMatrixScrollRef.current = stepId.trim();
      if (matrixSearchDebounceRef.current) window.clearTimeout(matrixSearchDebounceRef.current);
      setMatrixStageFilterQ('');
      setMatrixOpen(true);
      saveStagesLastInnerSubTab(collectionFlowKey, 'process');
      replaceQuery((params) => {
        params.delete(STAGES_MATRIX_PHASE_PARAM);
        params.delete(STAGES_MATRIX_Q_PARAM);
        params.set('stagesSub', 'process');
        finishStagesFilterMutation(params, 'process');
      });
    },
    [collectionFlowKey, replaceQuery, setMatrixOpen]
  );

  const scrollToCurrentMatrixStage = useCallback(() => {
    const sid = focusArticle?.currentStageId;
    if (!sid) return;
    jumpToMatrixRow(sid);
  }, [focusArticle?.currentStageId, jumpToMatrixRow]);

  useEffect(() => {
    const id = pendingMatrixScrollRef.current;
    if (!id || subTab !== 'process' || !matrixExpanded) return;
    const t = window.setTimeout(() => {
      document
        .getElementById(`stages-matrix-row-${id}`)
        ?.scrollIntoView({ block: 'center', behavior: 'smooth' });
      pendingMatrixScrollRef.current = null;
    }, 120);
    return () => window.clearTimeout(t);
  }, [subTab, matrixExpanded, flowDoc, matrixStepsFiltered.length]);

  return {
    matrixStageFilterQ,
    onMatrixSearchChange,
    clearMatrixFilters,
    jumpToMatrixRow,
    matrixStepsFiltered,
    scrollToCurrentMatrixStage,
  };
}
