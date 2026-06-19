'use client';

import { useMemo } from 'react';
import {
  buildWorkshop2Phase1DossierPassportPartitions,
  type BuildWorkshop2Phase1DossierPassportPartitionsInput,
  type Workshop2Phase1DossierPassportPartitions,
} from '@/components/brand/production/workshop2-phase1-dossier-passport-partitions';

/** Passport partition bundles for general section + article card (sectionBodies). */
export function useWorkshop2Phase1DossierPassportPartitionsZone(
  input: BuildWorkshop2Phase1DossierPassportPartitionsInput
): Workshop2Phase1DossierPassportPartitions {
  return useMemo(
    () => buildWorkshop2Phase1DossierPassportPartitions(input),
    [input.phaseRowsCurrent, input.extraRows, input.isPhase1]
  );
}
