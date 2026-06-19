'use client';

import { useMemo, type Dispatch, type SetStateAction } from 'react';
import { useWorkshop2Phase1DossierHandbookCheckReportExpansionEffects } from '@/components/brand/production/use-workshop2-phase1-dossier-handbook-check-report-expansion-effects';
import { isWorkshop2Phase1DossierHandbookCheckClean } from '@/components/brand/production/workshop2-phase1-dossier-handbook-check-state';
import type { HandbookCheckSnapshot } from '@/components/brand/production/workshop2-phase1-dossier-panel-handbook-check-snapshot';
import type { Workshop2TzSignoffSectionKey } from '@/lib/production/workshop2-dossier-phase1.types';

export type UseWorkshop2Phase1DossierHandbookCheckReportZoneInput = {
  handbookCheckSnapshot: HandbookCheckSnapshot | null;
  activeSection: Workshop2TzSignoffSectionKey;
  setHandbookCheckReportExpanded: Dispatch<SetStateAction<boolean>>;
};

/** Handbook check snapshot UI: clean flag, stage warnings, report expand/collapse (sectionBodies). */
export function useWorkshop2Phase1DossierHandbookCheckReportZone({
  handbookCheckSnapshot,
  activeSection,
  setHandbookCheckReportExpanded,
}: UseWorkshop2Phase1DossierHandbookCheckReportZoneInput) {
  const handbookCheckClean = useMemo(
    () => isWorkshop2Phase1DossierHandbookCheckClean(handbookCheckSnapshot),
    [handbookCheckSnapshot]
  );

  const stageBoardHandbookWarnings = useMemo(
    () => handbookCheckSnapshot?.bySection[activeSection] ?? [],
    [handbookCheckSnapshot, activeSection]
  );

  useWorkshop2Phase1DossierHandbookCheckReportExpansionEffects({
    handbookCheckSnapshot,
    handbookCheckClean,
    setHandbookCheckReportExpanded,
  });

  return { handbookCheckClean, stageBoardHandbookWarnings };
}
