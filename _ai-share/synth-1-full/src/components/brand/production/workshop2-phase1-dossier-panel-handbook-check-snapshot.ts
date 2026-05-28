import {
  getSectionWarnings,
  type Workshop2SectionReadinessRow,
} from '@/components/brand/production/workshop2-phase1-dossier-panel-section-warnings';
import type { HandbookCategoryLeaf } from '@/lib/production/category-handbook-leaves';
import type { DossierSection } from '@/lib/production/dossier-readiness-engine';
import type {
  Workshop2DossierPhase1,
  Workshop2TzSignoffSectionKey,
} from '@/lib/production/workshop2-dossier-phase1.types';

export const HANDBOOK_SNAPSHOT_SECTION_KEYS: readonly Workshop2TzSignoffSectionKey[] = [
  'general',
  'visuals',
  'material',
  'construction',
  'assignment',
];

export type HandbookCheckSnapshot = {
  checkedAtIso: string;
  scopeSection: DossierSection;
  checkAspects: { label: string; ok: boolean }[];
  lines: string[];
  bySection: Record<DossierSection, string[]>;
  globalHandbookWarnings: string[];
};

export function buildHandbookCheckSnapshot(
  dossier: Workshop2DossierPhase1,
  currentLeaf: HandbookCategoryLeaf,
  skuDraft: string,
  nameDraft: string,
  handbookWarnings: string[],
  sectionReadiness: Record<DossierSection, Workshop2SectionReadinessRow>,
  scopeSection: DossierSection,
  checkAspects: { label: string; ok: boolean }[],
  sectionLabelById: Record<DossierSection, string>
): HandbookCheckSnapshot {
  const bySection = {} as Record<DossierSection, string[]>;
  for (const s of HANDBOOK_SNAPSHOT_SECTION_KEYS) {
    bySection[s] =
      s === scopeSection
        ? getSectionWarnings(
            s,
            dossier,
            currentLeaf,
            skuDraft,
            nameDraft,
            handbookWarnings,
            sectionReadiness
          )
        : [];
  }
  const lineSet = new Set<string>();
  const label = sectionLabelById[scopeSection];
  for (const w of bySection[scopeSection]) {
    lineSet.add(`${label}: ${w}`);
  }
  return {
    checkedAtIso: new Date().toISOString(),
    scopeSection,
    checkAspects,
    lines: [...lineSet],
    bySection,
    globalHandbookWarnings: [],
  };
}
