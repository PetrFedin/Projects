'use client';

import { useEffect, useRef } from 'react';
import type { Dispatch, SetStateAction } from 'react';
import type { Workshop2DossierPhase1 } from '@/lib/production/workshop2-dossier-phase1.types';
import { applyWorkshop2PomTemplateIfMeasurementsEmpty } from '@/lib/production/workshop2-pom-template-apply';
import { useWorkshop2RefPomTemplates } from '@/components/brand/production/use-workshop2-references';

/** При смене leafId подставляет строки POM из справочника, если табель пуст. */
export function useWorkshop2Phase1DossierPomTemplateSyncEffect(
  categoryLeafId: string | undefined,
  setDossier: Dispatch<SetStateAction<Workshop2DossierPhase1>>,
  tzWriteDisabled: boolean
): void {
  const { items: pomTemplates, state } = useWorkshop2RefPomTemplates(
    categoryLeafId,
    !tzWriteDisabled
  );
  const appliedForLeaf = useRef<string | null>(null);

  useEffect(() => {
    appliedForLeaf.current = null;
  }, [categoryLeafId]);

  useEffect(() => {
    if (tzWriteDisabled || state !== 'ready' || !categoryLeafId?.trim() || !pomTemplates.length)
      return;
    const lid = categoryLeafId.trim();
    if (appliedForLeaf.current === lid) return;
    setDossier((prev) => {
      const next = applyWorkshop2PomTemplateIfMeasurementsEmpty(prev, pomTemplates);
      if (next) appliedForLeaf.current = lid;
      return next ?? prev;
    });
  }, [categoryLeafId, pomTemplates, state, setDossier, tzWriteDisabled]);
}
