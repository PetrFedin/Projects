'use client';

import { useCallback } from 'react';
import { W2_VISUALS_SKETCH_ANCHOR_ID } from '@/lib/production/workshop2-material-bom-sketch-strip';
import { buildWorkshop2Phase1DossierMaterialMatHint } from '@/components/brand/production/workshop2-phase1-dossier-handbook-check-state';
import type { Workshop2TzSignoffSectionKey } from '@/lib/production/workshop2-dossier-phase1.types';

export type UseWorkshop2Phase1DossierMaterialSketchNavZoneInput = {
  currentLeafL2Name: string;
  setActiveSection: (section: Workshop2TzSignoffSectionKey) => void;
  tzScrollBehavior: ScrollBehavior;
  onRequestClosePulse?: () => void;
};

/** Jump from material hub / pulse into construction sketch anchor. */
export function useWorkshop2Phase1DossierMaterialSketchNavZone({
  currentLeafL2Name,
  setActiveSection,
  tzScrollBehavior,
  onRequestClosePulse,
}: UseWorkshop2Phase1DossierMaterialSketchNavZoneInput) {
  const materialMatHint = buildWorkshop2Phase1DossierMaterialMatHint(currentLeafL2Name);

  const openSketchFromMaterialHub = useCallback(() => {
    setActiveSection('construction');
    window.setTimeout(() => {
      document.getElementById(W2_VISUALS_SKETCH_ANCHOR_ID)?.scrollIntoView({
        behavior: tzScrollBehavior,
        block: 'start',
      });
    }, 120);
  }, [setActiveSection, tzScrollBehavior]);

  const openSketchFromMaterialHubForPulse = useCallback(() => {
    onRequestClosePulse?.();
    openSketchFromMaterialHub();
  }, [onRequestClosePulse, openSketchFromMaterialHub]);

  return {
    materialMatHint,
    openSketchFromMaterialHub,
    openSketchFromMaterialHubForPulse,
  };
}
