'use client';

import { useMemo } from 'react';
import { type CollectionStep } from '@/lib/production/collection-steps-catalog';
import {
  BOARD_STAGES_PER_ROW,
  DEPS_SCHEMA_CHUNK,
  chunkStepsForDepsSchema,
  type StagesFacetSetBundle,
  type StagesTabArticle,
} from '@/components/brand/production/stages-dependencies-tab-content-helpers';
import { computeStagesFacetPickerChoices } from '@/components/brand/production/stages-dependencies-tab-facet-picker-choices';

export function useStagesDependenciesTabMemos(args: {
  steps: CollectionStep[];
  collectionArticles: StagesTabArticle[];
  facetBundle: StagesFacetSetBundle;
}) {
  const { steps, collectionArticles, facetBundle } = args;

  const matrixPhaseOptions = useMemo(() => {
    const u = new Set<string>();
    for (const s of steps) {
      const p = s.phase?.trim();
      if (p) u.add(p);
    }
    return [...u];
  }, [steps]);

  const {
    audienceFacetChoices,
    seasonFacetChoices,
    l1FacetChoices,
    l2FacetChoices,
    l3FacetChoices,
    fabFacetChoices,
  } = useMemo(
    () => computeStagesFacetPickerChoices(collectionArticles, facetBundle),
    [collectionArticles, facetBundle]
  );

  const depsSchemaChunks = useMemo(
    () => chunkStepsForDepsSchema(steps, DEPS_SCHEMA_CHUNK),
    [steps]
  );

  const boardStepRows = useMemo(
    () => chunkStepsForDepsSchema(steps, BOARD_STAGES_PER_ROW),
    [steps]
  );

  return {
    matrixPhaseOptions,
    audienceFacetChoices,
    seasonFacetChoices,
    l1FacetChoices,
    l2FacetChoices,
    l3FacetChoices,
    fabFacetChoices,
    depsSchemaChunks,
    boardStepRows,
  };
}
