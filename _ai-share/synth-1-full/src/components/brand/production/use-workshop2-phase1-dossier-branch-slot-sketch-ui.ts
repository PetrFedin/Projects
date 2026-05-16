'use client';

import { useEffect, useRef, useState } from 'react';
import { WORKSHOP_BRANCH_LEVELS_DETAILS_LS_KEY } from '@/components/brand/production/workshop2-phase1-dossier-panel-attr-group-storage';

type BranchSlotLevel = 1 | 2 | 3;

/** Уровень ветки в подкатегорийном скетче + раскрытие блока деталей; синх с LS и сменой листа каталога. */
export function useWorkshop2Phase1DossierBranchSlotSketchUi(leafId: string) {
  const [subcategorySketchActiveLevel, setSubcategorySketchActiveLevel] = useState<BranchSlotLevel>(3);
  const [branchLevelsDetailsOpen, setBranchLevelsDetailsOpen] = useState(false);

  useEffect(() => {
    setSubcategorySketchActiveLevel(3);
  }, [leafId]);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    try {
      setBranchLevelsDetailsOpen(
        localStorage.getItem(WORKSHOP_BRANCH_LEVELS_DETAILS_LS_KEY) === '1'
      );
    } catch {
      /* ignore */
    }
  }, []);

  const prevBranchSlotLevelRef = useRef<BranchSlotLevel>(3);
  useEffect(() => {
    const prev = prevBranchSlotLevelRef.current;
    if (prev === 3 && subcategorySketchActiveLevel !== 3) {
      setBranchLevelsDetailsOpen(true);
    }
    prevBranchSlotLevelRef.current = subcategorySketchActiveLevel;
  }, [subcategorySketchActiveLevel]);

  return {
    subcategorySketchActiveLevel,
    setSubcategorySketchActiveLevel,
    branchLevelsDetailsOpen,
    setBranchLevelsDetailsOpen,
  };
}
