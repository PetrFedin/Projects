'use client';

import { useEffect, type Dispatch, type SetStateAction } from 'react';
import type { Workshop2DossierPhase1 } from '@/lib/production/workshop2-dossier-phase1.types';

/** Подхват чеклиста материалов из sessionStorage (после редиректа / другого шага). */
export function useWorkshop2Phase1DossierMaterialComplianceSessionHydrate(p: {
  isPhase1: boolean;
  collectionId: string;
  articleId: string;
  dossierHydrateKey: number;
  setDossierInternal: Dispatch<SetStateAction<Workshop2DossierPhase1>>;
}) {
  const { isPhase1, collectionId, articleId, dossierHydrateKey, setDossierInternal } = p;

  useEffect(() => {
    if (!isPhase1 || typeof window === 'undefined') return;
    const scoped = `${collectionId}:${articleId}`;
    try {
      const raw = sessionStorage.getItem(`w2-mat-comp:${scoped}`);
      if (!raw) return;
      const parsed = JSON.parse(raw) as Record<string, boolean>;
      if (!parsed || typeof parsed !== 'object') return;
      setDossierInternal((prev) => {
        const cur = prev.materialComplianceChecklist;
        if (cur && Object.keys(cur).length > 0) return prev;
        return { ...prev, materialComplianceChecklist: parsed };
      });
      sessionStorage.removeItem(`w2-mat-comp:${scoped}`);
    } catch {
      /* ignore */
    }
  }, [isPhase1, collectionId, articleId, dossierHydrateKey]);
}
