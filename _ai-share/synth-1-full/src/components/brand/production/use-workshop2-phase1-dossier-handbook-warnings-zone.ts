'use client';

import { useMemo } from 'react';
import {
  buildWorkshop2Phase1DossierHandbookWarnings,
  type BuildWorkshop2Phase1DossierHandbookWarningsInput,
} from '@/components/brand/production/workshop2-phase1-dossier-handbook-warnings';

/** Handbook warnings zone for dossier panel (sectionBodies). */
export function useWorkshop2Phase1DossierHandbookWarningsZone(
  input: BuildWorkshop2Phase1DossierHandbookWarningsInput
): { handbookWarnings: string[] } {
  const handbookWarnings = useMemo(
    () => buildWorkshop2Phase1DossierHandbookWarnings(input),
    [
      input.dossier,
      input.currentLeaf,
      input.expectedScaleId,
      input.dimensionLabels,
      input.leafPhase1Ids,
    ]
  );
  return { handbookWarnings };
}
