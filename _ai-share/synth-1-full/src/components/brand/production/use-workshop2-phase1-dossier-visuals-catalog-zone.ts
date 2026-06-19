'use client';

import { useMemo } from 'react';
import {
  buildWorkshop2Phase1DossierVisualsCatalog,
  type BuildWorkshop2Phase1DossierVisualsCatalogInput,
  type Workshop2Phase1DossierVisualsCatalog,
} from '@/components/brand/production/workshop2-phase1-dossier-visuals-catalog';

/** Visuals catalog + sketch pin link bundles (sectionBodies). */
export function useWorkshop2Phase1DossierVisualsCatalogZone(
  input: BuildWorkshop2Phase1DossierVisualsCatalogInput
): Workshop2Phase1DossierVisualsCatalog {
  return useMemo(
    () => buildWorkshop2Phase1DossierVisualsCatalog(input),
    [
      input.isPhase1,
      input.isPhase2,
      input.isPhase3,
      input.rowsToShow,
      input.rowsToShowPhase2,
      input.rowsToShowPhase3,
      input.extraRows,
    ]
  );
}
