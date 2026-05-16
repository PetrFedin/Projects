'use client';

import { useMemo, useState } from 'react';
import type { DossierSection } from '@/lib/production/dossier-readiness-engine';
import type { Workshop2TzSignoffSectionKey } from '@/lib/production/workshop2-dossier-phase1.types';

/** Режим «минимум шага» по секциям ТЗ и производное: скрыть UI отложенных комментариев. */
export function useWorkshop2Phase1DossierTzMinimalMode(input: {
  isPhase1: boolean;
  activeSection: Workshop2TzSignoffSectionKey;
}) {
  const { isPhase1, activeSection } = input;

  const [tzMinimalModeBySection, setTzMinimalModeBySection] = useState<
    Record<DossierSection, boolean>
  >({
    general: false,
    visuals: false,
    material: false,
    measurements: false,
    construction: false,
    assignment: false,
    packaging: false,
    sample_intake: false,
    b2b_sales: false,
  });

  const tzMinimalHideDeferCommentUi = useMemo(() => {
    if (!isPhase1) return false;
    switch (activeSection) {
      case 'general':
      case 'visuals':
      case 'material':
      case 'construction':
        return tzMinimalModeBySection[activeSection];
      default:
        return false;
    }
  }, [isPhase1, activeSection, tzMinimalModeBySection]);

  return {
    tzMinimalModeBySection,
    setTzMinimalModeBySection,
    tzMinimalHideDeferCommentUi,
  };
}
