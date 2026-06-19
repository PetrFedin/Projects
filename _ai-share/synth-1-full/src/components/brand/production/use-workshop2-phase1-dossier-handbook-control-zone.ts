'use client';

import { useCallback, useMemo, type Dispatch, type SetStateAction } from 'react';
import {
  buildHandbookCheckSnapshot,
  type HandbookCheckSnapshot,
} from '@/components/brand/production/workshop2-phase1-dossier-panel-handbook-check-snapshot';
import {
  buildSectionControlPoints,
  type BuildControlPointsCtx,
} from '@/components/brand/production/workshop2-phase1-dossier-panel-section-control-points';
import { SECTION_LABEL_BY_ID } from '@/components/brand/production/workshop2-phase1-dossier-panel-dossier-constants';
import type { Workshop2SectionReadinessRow } from '@/components/brand/production/workshop2-phase1-dossier-panel-section-warnings';
import type { HandbookCategoryLeaf } from '@/lib/production/category-handbook-leaves';
import type { DossierSection } from '@/lib/production/dossier-readiness-engine';
import type { Workshop2DossierPhase1 } from '@/lib/production/workshop2-dossier-phase1.types';

export type UseWorkshop2Phase1DossierHandbookControlZoneInput = {
  dossier: Workshop2DossierPhase1;
  currentLeaf: HandbookCategoryLeaf;
  skuDraft: string;
  nameDraft: string;
  handbookWarnings: string[];
  sectionReadinessUi: Record<DossierSection, Workshop2SectionReadinessRow>;
  selectedAudienceLabel: string;
  activeSection: DossierSection;
  setHandbookCheckSnapshot: Dispatch<SetStateAction<HandbookCheckSnapshot | null>>;
};

/** Handbook control points + runHandbookCheck snapshot builder (sectionBodies). */
export function useWorkshop2Phase1DossierHandbookControlZone({
  dossier,
  currentLeaf,
  skuDraft,
  nameDraft,
  handbookWarnings,
  sectionReadinessUi,
  selectedAudienceLabel,
  activeSection,
  setHandbookCheckSnapshot,
}: UseWorkshop2Phase1DossierHandbookControlZoneInput) {
  const hasAssignmentValue = useCallback(
    (attributeId: string) =>
      dossier.assignments.some((a) => a.attributeId === attributeId && a.values.length > 0),
    [dossier.assignments]
  );

  const controlPointsCtx: BuildControlPointsCtx = useMemo(
    () => ({
      dossier,
      currentLeaf,
      skuDraft,
      nameDraft,
      handbookWarnings,
      sectionReadiness: sectionReadinessUi,
      selectedAudienceLabel,
      hasAssignmentValue,
    }),
    [
      dossier,
      currentLeaf,
      skuDraft,
      nameDraft,
      handbookWarnings,
      sectionReadinessUi,
      selectedAudienceLabel,
      hasAssignmentValue,
    ]
  );

  const runHandbookCheck = useCallback(() => {
    const aspects = buildSectionControlPoints(activeSection, controlPointsCtx).map(
      ({ label, done }) => ({
        label,
        ok: done,
      })
    );
    setHandbookCheckSnapshot(
      buildHandbookCheckSnapshot(
        dossier,
        currentLeaf,
        skuDraft,
        nameDraft,
        handbookWarnings,
        sectionReadinessUi,
        activeSection,
        aspects,
        SECTION_LABEL_BY_ID
      )
    );
  }, [
    dossier,
    currentLeaf,
    skuDraft,
    nameDraft,
    handbookWarnings,
    sectionReadinessUi,
    activeSection,
    controlPointsCtx,
    setHandbookCheckSnapshot,
  ]);

  return { controlPointsCtx, runHandbookCheck, hasAssignmentValue };
}
