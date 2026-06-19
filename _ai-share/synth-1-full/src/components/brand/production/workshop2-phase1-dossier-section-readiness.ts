import type { DossierSection } from '@/lib/production/dossier-readiness-engine';
import type { Workshop2DossierPhase1 } from '@/lib/production/workshop2-dossier-phase1.types';
import type { ResolvedPhase1AttributeRow } from '@/lib/production/attribute-catalog';
import {
  calculateWorkshopTzSectionCompletion,
  getWorkshopTzSectionStatusLabel,
  type WorkshopTzReadinessPhase,
} from '@/lib/production/workshop2-tz-section-readiness';
import { TZ_READINESS_SECTION_KEYS } from '@/components/brand/production/workshop2-phase1-dossier-panel-dossier-constants';
import { getSectionWarnings } from '@/components/brand/production/workshop2-phase1-dossier-panel-section-warnings';
import type { HandbookCategoryLeaf } from '@/lib/production/category-handbook-leaves';

export type Workshop2Phase1DossierSectionReadinessEntry = {
  done: number;
  total: number;
  pct: number;
  status: string;
};

export type BuildWorkshop2Phase1DossierSectionReadinessInput = {
  dossier: Workshop2DossierPhase1;
  phaseRowsCurrent: readonly ResolvedPhase1AttributeRow[];
  currentPhase: WorkshopTzReadinessPhase;
  techPackSessionBlobById: Record<string, string>;
};

export function buildWorkshop2Phase1DossierSectionReadiness({
  dossier,
  phaseRowsCurrent,
  currentPhase,
  techPackSessionBlobById,
}: BuildWorkshop2Phase1DossierSectionReadinessInput): Record<
  DossierSection,
  Workshop2Phase1DossierSectionReadinessEntry
> {
  return Object.fromEntries(
    TZ_READINESS_SECTION_KEYS.map((sectionId) => {
      const completion = calculateWorkshopTzSectionCompletion(
        sectionId,
        dossier,
        [...phaseRowsCurrent],
        {
          tzPhase: currentPhase,
          techPackZipSessionBlobById: techPackSessionBlobById,
        }
      );
      const status = getWorkshopTzSectionStatusLabel(sectionId, dossier, [...phaseRowsCurrent], {
        tzPhase: currentPhase,
        techPackZipSessionBlobById: techPackSessionBlobById,
      });
      return [sectionId, { ...completion, status }];
    })
  ) as Record<DossierSection, Workshop2Phase1DossierSectionReadinessEntry>;
}

export type BuildWorkshop2Phase1DossierSectionReadinessUiInput = {
  sectionReadiness: Record<DossierSection, Workshop2Phase1DossierSectionReadinessEntry>;
  dossier: Workshop2DossierPhase1;
  skuDraft: string;
  nameDraft: string;
};

/** UI-выравнивание: паспортный % учитывает draft SKU/Название до сохранения. */
export function buildWorkshop2Phase1DossierSectionReadinessUi({
  sectionReadiness,
  dossier,
  skuDraft,
  nameDraft,
}: BuildWorkshop2Phase1DossierSectionReadinessUiInput): Record<
  DossierSection,
  Workshop2Phase1DossierSectionReadinessEntry
> {
  const next = {
    ...sectionReadiness,
    general: { ...sectionReadiness.general },
  };
  const skuAssigned = dossier.assignments.some(
    (a) => a.attributeId === 'sku' && a.values.length > 0
  );
  const nameAssigned = dossier.assignments.some(
    (a) => a.attributeId === 'name' && a.values.length > 0
  );
  const skuFilledUi = skuAssigned || skuDraft.trim().length > 0;
  const nameFilledUi = nameAssigned || nameDraft.trim().length > 0;
  const bonusDone = Number(skuFilledUi && !skuAssigned) + Number(nameFilledUi && !nameAssigned);
  if (bonusDone > 0) {
    const done = next.general.done + bonusDone;
    const total = Math.max(next.general.total, 1);
    next.general = {
      ...next.general,
      done,
      pct: Math.round((done / total) * 100),
    };
  }
  return next;
}

export type BuildWorkshop2Phase1DossierSectionWarningsInput = {
  dossier: Workshop2DossierPhase1;
  currentLeaf: HandbookCategoryLeaf;
  skuDraft: string;
  nameDraft: string;
  handbookWarnings: readonly string[];
  sectionReadinessUi: Record<DossierSection, Workshop2Phase1DossierSectionReadinessEntry>;
};

export function buildWorkshop2Phase1DossierSectionWarningsById({
  dossier,
  currentLeaf,
  skuDraft,
  nameDraft,
  handbookWarnings,
  sectionReadinessUi,
}: BuildWorkshop2Phase1DossierSectionWarningsInput): Record<DossierSection, string[]> {
  return Object.fromEntries(
    TZ_READINESS_SECTION_KEYS.map((sectionId) => [
      sectionId,
      getSectionWarnings(
        sectionId,
        dossier,
        currentLeaf,
        skuDraft,
        nameDraft,
        [...handbookWarnings],
        sectionReadinessUi
      ),
    ])
  ) as Record<DossierSection, string[]>;
}
