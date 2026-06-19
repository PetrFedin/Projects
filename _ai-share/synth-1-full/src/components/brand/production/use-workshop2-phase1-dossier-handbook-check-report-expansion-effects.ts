'use client';

import { useEffect, type Dispatch, type SetStateAction } from 'react';
import type { HandbookCheckSnapshot } from '@/components/brand/production/workshop2-phase1-dossier-panel-handbook-check-snapshot';

/** Разворот отчёта при новом снимке и авто-свёртка через 5 с, если замечаний нет. */
export function useWorkshop2Phase1DossierHandbookCheckReportExpansionEffects(p: {
  handbookCheckSnapshot: HandbookCheckSnapshot | null;
  handbookCheckClean: boolean;
  setHandbookCheckReportExpanded: Dispatch<SetStateAction<boolean>>;
}) {
  const { handbookCheckSnapshot, handbookCheckClean, setHandbookCheckReportExpanded } = p;

  useEffect(() => {
    if (!handbookCheckSnapshot) return;
    setHandbookCheckReportExpanded(true);
  }, [handbookCheckSnapshot?.checkedAtIso]);

  useEffect(() => {
    if (!handbookCheckSnapshot || !handbookCheckClean) return;
    const id = globalThis.setTimeout(() => setHandbookCheckReportExpanded(false), 5000);
    return () => globalThis.clearTimeout(id);
  }, [handbookCheckSnapshot?.checkedAtIso, handbookCheckClean]);
}
