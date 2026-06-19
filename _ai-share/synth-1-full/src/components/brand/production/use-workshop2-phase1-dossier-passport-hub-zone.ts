'use client';

import { useMemo } from 'react';
import { buildPassportHubModel } from '@/lib/production/workshop2-passport-check';
import type { ResolvedPhase1AttributeRow } from '@/lib/production/attribute-catalog';
import type { HandbookCategoryLeaf } from '@/lib/production/category-handbook-leaves';
import type { Workshop2DossierPhase1 } from '@/lib/production/workshop2-dossier-phase1.types';

export type UseWorkshop2Phase1DossierPassportHubZoneInput = {
  dossier: Workshop2DossierPhase1;
  skuDraft: string;
  nameDraft: string;
  selectedAudienceId: string;
  currentLeaf: HandbookCategoryLeaf;
  generalPassportStartRows: ResolvedPhase1AttributeRow[];
  generalPassportPreSampleRows: ResolvedPhase1AttributeRow[];
  currentPhase: '1' | '2' | '3';
};

/** Passport hub model for W2 session metrics + section body (sectionBodies). */
export function useWorkshop2Phase1DossierPassportHubZone({
  dossier,
  skuDraft,
  nameDraft,
  selectedAudienceId,
  currentLeaf,
  generalPassportStartRows,
  generalPassportPreSampleRows,
  currentPhase,
}: UseWorkshop2Phase1DossierPassportHubZoneInput) {
  const passportHubModel = useMemo(
    () =>
      buildPassportHubModel(
        dossier,
        skuDraft,
        nameDraft,
        selectedAudienceId,
        currentLeaf,
        generalPassportStartRows,
        generalPassportPreSampleRows,
        currentPhase
      ),
    [
      dossier,
      skuDraft,
      nameDraft,
      selectedAudienceId,
      currentLeaf,
      generalPassportStartRows,
      generalPassportPreSampleRows,
      currentPhase,
    ]
  );

  return { passportHubModel };
}
