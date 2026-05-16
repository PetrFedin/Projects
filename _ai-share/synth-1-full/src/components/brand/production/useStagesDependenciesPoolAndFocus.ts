'use client';

import { useEffect, useMemo } from 'react';
import { STAGES_SKU_PARAM, STAGES_WORK_SKU_PARAM } from '@/lib/production/stages-url';
import {
  articleMatchesFacetBundle,
  finishStagesFilterMutation,
  type StagesFacetSetBundle,
  type StagesTabArticle,
} from '@/components/brand/production/stages-dependencies-tab-content-helpers';

export function useStagesDependenciesPoolAndFocus(args: {
  collectionArticles: StagesTabArticle[];
  facetBundle: StagesFacetSetBundle;
  stagesSkuParam: string;
  legacyPickIds: string[];
  stagesWorkSkuParam: string;
  legacyPickRaw: string;
  replaceQuery: (mutate: (p: URLSearchParams) => void) => void;
}) {
  const {
    collectionArticles,
    facetBundle,
    stagesSkuParam,
    legacyPickIds,
    stagesWorkSkuParam,
    legacyPickRaw,
    replaceQuery,
  } = args;

  const poolArticles = useMemo(() => {
    return collectionArticles.filter((a) => articleMatchesFacetBundle(a, facetBundle));
  }, [collectionArticles, facetBundle]);

  const focusArticle = useMemo(() => {
    if (poolArticles.length === 0) return null;
    const tryIds = [stagesSkuParam, ...legacyPickIds, stagesWorkSkuParam].filter(Boolean);
    for (const id of tryIds) {
      const a = poolArticles.find((x) => x.id === id);
      if (a) return a;
    }
    return poolArticles[0];
  }, [poolArticles, stagesSkuParam, legacyPickIds, stagesWorkSkuParam]);

  const resolvedFocusId = focusArticle?.id ?? '';

  useEffect(() => {
    if (poolArticles.length === 0) return;
    const legacy = legacyPickRaw.trim().length > 0 || stagesWorkSkuParam.length > 0;
    const mismatch = stagesSkuParam !== resolvedFocusId;
    if (!legacy && !mismatch) return;
    replaceQuery((params) => {
      if (resolvedFocusId) params.set(STAGES_SKU_PARAM, resolvedFocusId);
      params.delete('stagesPick');
      params.delete(STAGES_WORK_SKU_PARAM);
      finishStagesFilterMutation(params, undefined);
    });
  }, [
    poolArticles.length,
    resolvedFocusId,
    stagesSkuParam,
    legacyPickRaw,
    stagesWorkSkuParam,
    replaceQuery,
  ]);

  return { poolArticles, focusArticle, resolvedFocusId };
}
