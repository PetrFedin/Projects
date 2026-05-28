'use client';

import { useEffect, type Dispatch, type SetStateAction } from 'react';
import type { HandbookCheckSnapshot } from '@/components/brand/production/workshop2-phase1-dossier-panel-handbook-check-snapshot';
import type { Workshop2TzSignoffSectionKey } from '@/lib/production/workshop2-dossier-phase1.types';

/** Сброс снимка проверки справочника при смене активной вкладки ТЗ. */
export function useWorkshop2Phase1DossierHandbookCheckSnapshotResetOnActiveSection(
  activeSection: Workshop2TzSignoffSectionKey,
  setHandbookCheckSnapshot: Dispatch<SetStateAction<HandbookCheckSnapshot | null>>
) {
  useEffect(() => {
    setHandbookCheckSnapshot(null);
  }, [activeSection, setHandbookCheckSnapshot]);
}
