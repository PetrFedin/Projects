'use client';

import { useMemo } from 'react';
import {
  buildWorkshop2Phase1DossierSectionReadiness,
  buildWorkshop2Phase1DossierSectionReadinessUi,
  buildWorkshop2Phase1DossierSectionWarningsById,
  type BuildWorkshop2Phase1DossierSectionReadinessInput,
  type Workshop2Phase1DossierSectionReadinessEntry,
} from '@/components/brand/production/workshop2-phase1-dossier-section-readiness';
import type { DossierSection } from '@/lib/production/dossier-readiness-engine';
import type { HandbookCategoryLeaf } from '@/lib/production/category-handbook-leaves';

export type UseWorkshop2Phase1DossierSectionReadinessZoneInput =
  BuildWorkshop2Phase1DossierSectionReadinessInput & {
    currentLeaf: HandbookCategoryLeaf;
    skuDraft: string;
    nameDraft: string;
    handbookWarnings: readonly string[];
  };

/** Section readiness + UI alignment + per-section warnings (sectionBodies). */
export function useWorkshop2Phase1DossierSectionReadinessZone(
  input: UseWorkshop2Phase1DossierSectionReadinessZoneInput
): {
  sectionReadiness: Record<DossierSection, Workshop2Phase1DossierSectionReadinessEntry>;
  sectionReadinessUi: Record<DossierSection, Workshop2Phase1DossierSectionReadinessEntry>;
  sectionWarningsById: Record<DossierSection, string[]>;
} {
  const sectionReadiness = useMemo(
    () =>
      buildWorkshop2Phase1DossierSectionReadiness({
        dossier: input.dossier,
        phaseRowsCurrent: input.phaseRowsCurrent,
        currentPhase: input.currentPhase,
        techPackSessionBlobById: input.techPackSessionBlobById,
      }),
    [input.dossier, input.phaseRowsCurrent, input.currentPhase, input.techPackSessionBlobById]
  );

  const sectionReadinessUi = useMemo(
    () =>
      buildWorkshop2Phase1DossierSectionReadinessUi({
        sectionReadiness,
        dossier: input.dossier,
        skuDraft: input.skuDraft,
        nameDraft: input.nameDraft,
      }),
    [sectionReadiness, input.dossier, input.skuDraft, input.nameDraft]
  );

  const sectionWarningsById = useMemo(
    () =>
      buildWorkshop2Phase1DossierSectionWarningsById({
        dossier: input.dossier,
        currentLeaf: input.currentLeaf,
        skuDraft: input.skuDraft,
        nameDraft: input.nameDraft,
        handbookWarnings: input.handbookWarnings,
        sectionReadinessUi,
      }),
    [
      input.dossier,
      input.currentLeaf,
      input.skuDraft,
      input.nameDraft,
      input.handbookWarnings,
      sectionReadinessUi,
    ]
  );

  return { sectionReadiness, sectionReadinessUi, sectionWarningsById };
}
