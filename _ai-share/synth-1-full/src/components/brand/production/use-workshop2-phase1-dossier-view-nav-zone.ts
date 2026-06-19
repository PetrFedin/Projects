'use client';

import { useRef } from 'react';
import type { Dispatch, SetStateAction } from 'react';
import { useWorkshop2Phase1DossierNavSectionsZone } from '@/components/brand/production/use-workshop2-phase1-dossier-nav-sections-zone';
import { useWorkshop2Phase1DossierViewProfileSectionSyncEffect } from '@/components/brand/production/use-workshop2-phase1-dossier-view-profile-section-sync-effect';
import type { Workshop2DossierViewProfile } from '@/lib/production/workshop2-dossier-view-infrastructure';
import type { Workshop2TzSignoffSectionKey } from '@/lib/production/workshop2-dossier-phase1.types';

export type UseWorkshop2Phase1DossierViewNavZoneInput = {
  dossierViewProfile: Workshop2DossierViewProfile;
  isPhase1: boolean;
  activeSection: Workshop2TzSignoffSectionKey;
  setActiveSection: Dispatch<SetStateAction<Workshop2TzSignoffSectionKey>>;
};

/** Nav sections for view profile + sync active section when profile narrows. */
export function useWorkshop2Phase1DossierViewNavZone({
  dossierViewProfile,
  isPhase1,
  activeSection,
  setActiveSection,
}: UseWorkshop2Phase1DossierViewNavZoneInput) {
  const w2ViewPrevForSectionSyncRef = useRef<Workshop2DossierViewProfile | null>(null);

  const { dossierNavPrimarySections, dossierNavSecondarySections } =
    useWorkshop2Phase1DossierNavSectionsZone(dossierViewProfile);

  useWorkshop2Phase1DossierViewProfileSectionSyncEffect({
    w2ViewPrevForSectionSyncRef,
    isPhase1,
    dossierViewProfile,
    activeSection,
    dossierNavPrimarySections,
    setActiveSection,
  });

  return {
    dossierNavPrimarySections,
    dossierNavSecondarySections,
  };
}
