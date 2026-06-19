import type { DossierSection } from '@/lib/production/dossier-readiness-engine';
import type { Workshop2DossierPhase1 } from '@/lib/production/workshop2-dossier-phase1.types';
import {
  buildWorkshop2TzGateSnapshot,
  type Workshop2TzGateCommentLike,
} from '@/lib/production/workshop2-tz-gates';
import { resolveWorkshop2TechPackHandoffChecklistRow } from '@/lib/production/workshop2-tz-section-readiness';
import { W2_TZ_FOUR_TABS_AVG_FILL_PCT_MIN_FOR_DIGITAL_SIGNOFF } from '@/components/brand/production/Workshop2TzSectionTabIndicator';
import type { Workshop2Phase1DossierSectionReadinessEntry } from '@/components/brand/production/workshop2-phase1-dossier-section-readiness';

const TZ_CORE_FILL_SECTION_KEYS = ['general', 'material', 'construction'] as const;
export type Workshop2Phase1DossierTzCoreFillSectionKey = (typeof TZ_CORE_FILL_SECTION_KEYS)[number];

export type Workshop2Phase1DossierTzCoreFieldsFillPctGate = {
  perSectionPct: Record<Workshop2Phase1DossierTzCoreFillSectionKey, number>;
  pct: number;
  meets: boolean;
};

export function buildWorkshop2Phase1DossierTzCoreFieldsFillPctGate(
  sectionReadinessUi: Record<DossierSection, Workshop2Phase1DossierSectionReadinessEntry>
): Workshop2Phase1DossierTzCoreFieldsFillPctGate {
  const perSectionPct = Object.fromEntries(
    TZ_CORE_FILL_SECTION_KEYS.map((k) => [k, sectionReadinessUi[k].pct])
  ) as Record<Workshop2Phase1DossierTzCoreFillSectionKey, number>;
  const pct = Math.round(
    TZ_CORE_FILL_SECTION_KEYS.reduce((sum, k) => sum + perSectionPct[k], 0) /
      Math.max(TZ_CORE_FILL_SECTION_KEYS.length, 1)
  );
  return {
    perSectionPct,
    pct,
    meets: pct >= W2_TZ_FOUR_TABS_AVG_FILL_PCT_MIN_FOR_DIGITAL_SIGNOFF,
  };
}

export type BuildWorkshop2Phase1DossierTzGateSnapshotInput = {
  dossier: Workshop2DossierPhase1;
  techPackSessionBlobById: Record<string, string>;
  attrCommentsById: Record<string, Workshop2TzGateCommentLike[]>;
  sectionReadinessUi: Record<DossierSection, Workshop2Phase1DossierSectionReadinessEntry>;
  activeCategoryLeafId: string;
};

export function buildWorkshop2Phase1DossierTzGateSnapshot(
  input: BuildWorkshop2Phase1DossierTzGateSnapshotInput
) {
  return buildWorkshop2TzGateSnapshot(input.dossier, {
    sessionBlobById: input.techPackSessionBlobById,
    commentsById: input.attrCommentsById,
    sectionFillPct: {
      general: input.sectionReadinessUi.general.pct,
      material: input.sectionReadinessUi.material.pct,
      construction: input.sectionReadinessUi.construction.pct,
    },
    activeCategoryLeafId: input.activeCategoryLeafId,
  });
}

export function buildWorkshop2Phase1DossierSectionGateErrorsById(
  sectionWarningsById: Record<DossierSection, string[]>,
  tzGateSnapshot: ReturnType<typeof buildWorkshop2TzGateSnapshot>
): Record<DossierSection, string[]> {
  const core = Object.fromEntries(
    TZ_CORE_FILL_SECTION_KEYS.map((k) => [
      k,
      [...(sectionWarningsById[k] ?? []), ...(tzGateSnapshot.sectionMinimumErrors[k] ?? [])],
    ])
  ) as Record<Workshop2Phase1DossierTzCoreFillSectionKey, string[]>;
  return {
    general: core.general,
    material: core.material,
    construction: core.construction,
    measurements: [],
    assignment: [],
    packaging: [],
    sample_intake: [],
    visuals: [],
    b2b_sales: [],
  };
}

export function buildWorkshop2Phase1DossierFactorySendHubPreview(
  dossier: Workshop2DossierPhase1,
  tzGateSnapshot: ReturnType<typeof buildWorkshop2TzGateSnapshot>
) {
  return {
    techPackCount: tzGateSnapshot.techPackCount,
    techPackWithBytes: tzGateSnapshot.techPackWithBytes,
    sectionSignoffsFull: tzGateSnapshot.sectionSignoffsFull,
    lastHandoff: resolveWorkshop2TechPackHandoffChecklistRow(dossier.techPackFactoryHandoffs),
    sketchReady: tzGateSnapshot.sketchReady,
    openCriticalCommentsCount: tzGateSnapshot.openCriticalCommentsCount,
    lifecycleState: tzGateSnapshot.state,
    blockers: tzGateSnapshot.blockers,
    firstUnmet: tzGateSnapshot.firstUnmet,
  };
}
