'use client';

import { useCallback, useEffect, useMemo } from 'react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import {
  loadStagesLastInnerSubTab,
  saveStagesLastInnerSubTab,
} from '@/lib/production/stages-panels-session';
import { parseStagesSkuPanelTab } from '@/lib/production/stages-url';
import {
  STAGES_FILTER_SUB_PARAM,
  decodeFacetList,
  finishStagesFilterMutation,
  normalizeStagesSub,
  type StagesFacetSetBundle,
  type StagesSubTab,
} from '@/components/brand/production/stages-dependencies-tab-content-helpers';
import { readStagesDependenciesUrlSearchSnapshot } from '@/components/brand/production/stages-dependencies-url-search-snapshot';
import { useStagesDependenciesUrlMutations } from '@/components/brand/production/useStagesDependenciesUrlMutations';

export type StagesDependenciesUrlState = {
  router: ReturnType<typeof useRouter>;
  legacyPickRaw: string;
  stagesSkuParam: string;
  rawAudience: string;
  rawSeason: string;
  rawL1: string;
  rawL2: string;
  rawL3: string;
  rawFab: string;
  chainFocusStepId: string;
  stagesMatrixSkuParam: string;
  stagesWorkSkuParam: string;
  stagesSkuPanelParam: string;
  stagesSkuPanelTabParsed: ReturnType<typeof parseStagesSkuPanelTab>;
  matrixPhaseParam: string;
  matrixTextQParam: string;
  facetBundle: StagesFacetSetBundle;
  legacyPickIds: string[];
  replaceQuery: (mutate: (p: URLSearchParams) => void) => void;
  setFocusSku: (id: string, opts?: { preserveChain?: boolean }) => void;
  toggleFacetValue: (
    param: 'stagesAudience' | 'stagesSeason' | 'stagesL1' | 'stagesL2' | 'stagesL3' | 'stagesFab',
    value: string
  ) => void;
  toggleChainFocus: (stepId: string) => void;
  clearAllFacets: () => void;
  subTab: StagesSubTab;
  setSubTab: (next: StagesSubTab) => void;
  contextFilterActive: boolean;
  stagesFilterSubParam: string;
  filterBadgeSub: StagesSubTab | null;
};

export function useStagesDependenciesUrlState(
  collectionFlowKey: string
): StagesDependenciesUrlState {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();
  const pathBase = pathname ?? '/';
  const sp = searchParams ?? new URLSearchParams();

  const snap = useMemo(() => readStagesDependenciesUrlSearchSnapshot(sp), [sp]);

  const {
    legacyPickRaw,
    stagesSkuParam,
    rawAudience,
    rawSeason,
    rawL1,
    rawL2,
    rawL3,
    rawFab,
    chainFocusStepId,
    stagesMatrixSkuParam,
    stagesWorkSkuParam,
    stagesSkuPanelParam,
    stagesSkuPanelTabParsed,
    matrixPhaseParam,
    matrixTextQParam,
  } = snap;

  const audienceFacetList = useMemo(() => decodeFacetList(rawAudience), [rawAudience]);
  const seasonFacetList = useMemo(() => decodeFacetList(rawSeason), [rawSeason]);
  const l1FacetList = useMemo(() => decodeFacetList(rawL1), [rawL1]);
  const l2FacetList = useMemo(() => decodeFacetList(rawL2), [rawL2]);
  const l3FacetList = useMemo(() => decodeFacetList(rawL3), [rawL3]);
  const fabFacetList = useMemo(() => decodeFacetList(rawFab), [rawFab]);

  const facetBundle: StagesFacetSetBundle = useMemo(
    () => ({
      audience: new Set(audienceFacetList),
      season: new Set(seasonFacetList),
      l1: new Set(l1FacetList),
      l2: new Set(l2FacetList),
      l3: new Set(l3FacetList),
      fab: new Set(fabFacetList),
    }),
    [audienceFacetList, seasonFacetList, l1FacetList, l2FacetList, l3FacetList, fabFacetList]
  );

  const legacyPickIds = useMemo(
    () =>
      legacyPickRaw
        .split(',')
        .map((x) => x.trim())
        .filter(Boolean),
    [legacyPickRaw]
  );

  const replaceQuery = useCallback(
    (mutate: (p: URLSearchParams) => void) => {
      const params = new URLSearchParams(sp.toString());
      params.delete('stagesProd');
      mutate(params);
      const q = params.toString();
      const href = q ? `${pathBase}?${q}` : pathBase;
      router.replace(href, { scroll: false });
    },
    [pathBase, router, sp]
  );

  const { setFocusSku, toggleFacetValue, toggleChainFocus, clearAllFacets } =
    useStagesDependenciesUrlMutations(replaceQuery);

  const subTab = useMemo(() => normalizeStagesSub(sp.get('stagesSub')), [sp]);

  const setSubTab = useCallback(
    (next: StagesSubTab) => {
      saveStagesLastInnerSubTab(collectionFlowKey, next);
      const params = new URLSearchParams(sp.toString());
      params.delete('stagesProd');
      if (next === 'ops') params.delete('stagesSub');
      else params.set('stagesSub', next);
      const q = params.toString();
      router.replace(q ? `${pathBase}?${q}` : pathBase, { scroll: false });
    },
    [collectionFlowKey, pathBase, router, sp]
  );

  useEffect(() => {
    if (sp.get('stagesSub')?.trim()) return;
    const saved = loadStagesLastInnerSubTab(collectionFlowKey);
    if (!saved || saved === 'ops') return;
    replaceQuery((params) => {
      params.set('stagesSub', saved);
      finishStagesFilterMutation(params, saved);
    });
  }, [collectionFlowKey, sp.toString(), replaceQuery]);

  const contextFilterActive = Boolean(
    rawAudience || rawSeason || rawL1 || rawL2 || rawL3 || rawFab || chainFocusStepId
  );

  const stagesFilterSubParam = sp.get(STAGES_FILTER_SUB_PARAM) || '';

  const filterBadgeSub: StagesSubTab | null = useMemo(() => {
    if (!contextFilterActive) return null;
    if (
      stagesFilterSubParam === 'process' ||
      stagesFilterSubParam === 'sku' ||
      stagesFilterSubParam === 'ops'
    ) {
      return stagesFilterSubParam;
    }
    if (chainFocusStepId) return 'process';
    return subTab;
  }, [contextFilterActive, stagesFilterSubParam, chainFocusStepId, subTab]);

  return {
    router,
    legacyPickRaw,
    stagesSkuParam,
    rawAudience,
    rawSeason,
    rawL1,
    rawL2,
    rawL3,
    rawFab,
    chainFocusStepId,
    stagesMatrixSkuParam,
    stagesWorkSkuParam,
    stagesSkuPanelParam,
    stagesSkuPanelTabParsed,
    matrixPhaseParam,
    matrixTextQParam,
    facetBundle,
    legacyPickIds,
    replaceQuery,
    setFocusSku,
    toggleFacetValue,
    toggleChainFocus,
    clearAllFacets,
    subTab,
    setSubTab,
    contextFilterActive,
    stagesFilterSubParam,
    filterBadgeSub,
  };
}
