'use client';

import { useEffect, useState } from 'react';
import type { DossierSection } from '@/lib/production/dossier-readiness-engine';
import type { Workshop2TzSignoffSectionKey } from '@/lib/production/workshop2-dossier-phase1.types';

type FlashDossier =
  | null
  | undefined
  | { mode: 'main' }
  | { mode: 'section'; section: DossierSection };

/** Подсветка основной колонки ТЗ по сигналу с обзора (`flashDossier`). */
export function useWorkshop2Phase1DossierMainColumnFlash(input: {
  flashDossier: FlashDossier;
  activeSection: Workshop2TzSignoffSectionKey;
}) {
  const { flashDossier, activeSection } = input;
  const [dossierMainColumnFlash, setDossierMainColumnFlash] = useState(false);

  useEffect(() => {
    if (!flashDossier) {
      setDossierMainColumnFlash(false);
      return;
    }
    const match =
      flashDossier.mode === 'main' ||
      (flashDossier.mode === 'section' && flashDossier.section === activeSection);
    setDossierMainColumnFlash(match);
  }, [flashDossier, activeSection]);

  return { dossierMainColumnFlash };
}
