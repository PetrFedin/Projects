'use client';

import { useEffect, type Dispatch, type MutableRefObject, type SetStateAction } from 'react';
import {
  isWorkshop2DossierViewPrimarySection,
  type Workshop2DossierViewProfile,
} from '@/lib/production/workshop2-dossier-view-infrastructure';
import type { Workshop2TzSignoffSectionKey } from '@/lib/production/workshop2-dossier-phase1.types';

/** При сужении профиля просмотра досье — увести активную секцию ТЗ на первую доступную вкладку. */
export function useWorkshop2Phase1DossierViewProfileSectionSyncEffect(p: {
  w2ViewPrevForSectionSyncRef: MutableRefObject<Workshop2DossierViewProfile | null>;
  isPhase1: boolean;
  dossierViewProfile: Workshop2DossierViewProfile;
  activeSection: Workshop2TzSignoffSectionKey;
  dossierNavPrimarySections: readonly { id: Workshop2TzSignoffSectionKey }[];
  setActiveSection: Dispatch<SetStateAction<Workshop2TzSignoffSectionKey>>;
}) {
  const {
    w2ViewPrevForSectionSyncRef,
    isPhase1,
    dossierViewProfile,
    activeSection,
    dossierNavPrimarySections,
    setActiveSection,
  } = p;

  useEffect(() => {
    if (!isPhase1) return;
    const prev = w2ViewPrevForSectionSyncRef.current;
    w2ViewPrevForSectionSyncRef.current = dossierViewProfile;
    if (prev === null) return;
    if (prev === dossierViewProfile) return;
    if (dossierViewProfile === 'full') return;
    if (isWorkshop2DossierViewPrimarySection(dossierViewProfile, activeSection)) return;
    const nextSec = dossierNavPrimarySections[0]?.id;
    if (nextSec) setActiveSection(nextSec);
  }, [
    w2ViewPrevForSectionSyncRef,
    isPhase1,
    dossierViewProfile,
    activeSection,
    dossierNavPrimarySections,
    setActiveSection,
  ]);
}
