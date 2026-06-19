'use client';

import { useMemo } from 'react';
import {
  buildWorkshop2Phase1DossierTzDigitalApprovalState,
  buildWorkshop2Phase1DossierTzReadyForSample,
  type BuildWorkshop2Phase1DossierTzReadyForSampleInput,
  type Workshop2Phase1DossierTzDigitalApprovalState,
} from '@/components/brand/production/workshop2-phase1-dossier-tz-sample-readiness';

export type UseWorkshop2Phase1DossierTzSampleReadinessZoneInput = Omit<
  BuildWorkshop2Phase1DossierTzReadyForSampleInput,
  'approval'
>;

/** TZ digital approval counters + sample-readiness gate (sectionBodies). */
export function useWorkshop2Phase1DossierTzSampleReadinessZone(
  input: UseWorkshop2Phase1DossierTzSampleReadinessZoneInput
): Workshop2Phase1DossierTzDigitalApprovalState & { tzReadyForSample: boolean } {
  const approval = useMemo(
    () => buildWorkshop2Phase1DossierTzDigitalApprovalState(input.dossier),
    [input.dossier]
  );
  const tzReadyForSample = useMemo(
    () => buildWorkshop2Phase1DossierTzReadyForSample({ ...input, approval }),
    [
      input.sectionReadiness,
      input.isPhase1,
      input.allSectionSignoffPairsDone,
      input.dossier,
      input.handbookWarnings,
      approval,
    ]
  );
  return { ...approval, tzReadyForSample };
}
