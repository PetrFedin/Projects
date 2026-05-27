/**
 * Якоря DOM для блокеров pre-flight → переход из «чеклиста передачи».
 */
import type { DossierSection } from '@/lib/production/dossier-readiness-engine';
import type { W2ProductionPreflightIssue } from '@/lib/production/workshop2-production-preflight';

export type Workshop2PreflightJumpTarget = {
  dossierSection: DossierSection;
  anchorId: string;
};

const SECTION_DEFAULT_ANCHOR: Record<
  W2ProductionPreflightIssue['section'],
  Workshop2PreflightJumpTarget
> = {
  passport: { dossierSection: 'general', anchorId: 'w2-passport-identity' },
  visuals: { dossierSection: 'visuals', anchorId: 'w2-visuals-hub' },
  materials: { dossierSection: 'material', anchorId: 'w2-material-compliance' },
  construction: { dossierSection: 'construction', anchorId: 'w2-construction-contour' },
  sketch: { dossierSection: 'construction', anchorId: 'w2-construction-sketch-hub' },
  handoff: { dossierSection: 'assignment', anchorId: 'w2-tz-section-stage' },
};

const ISSUE_OVERRIDES: Partial<Record<string, Workshop2PreflightJumpTarget>> = {
  'passport.sku.missing': { dossierSection: 'general', anchorId: 'w2-passport-start' },
  'passport.name.missing': { dossierSection: 'general', anchorId: 'w2-passport-identity' },
  'passport.l3.missing': { dossierSection: 'general', anchorId: 'w2-passport-identity' },
  'passport.audience.missing': { dossierSection: 'general', anchorId: 'w2-passport-identity' },
  'visual.reference_or_sketch.missing': { dossierSection: 'visuals', anchorId: 'w2-visuals-refs' },
  'visual.color.missing': { dossierSection: 'visuals', anchorId: 'w2-passport-color-bundle' },
  'construction.measurements.missing': {
    dossierSection: 'construction',
    anchorId: 'w2-measurements-table',
  },
  'materials.main.missing': { dossierSection: 'material', anchorId: 'w2-material-bom-norms' },
  'materials.composition.missing': {
    dossierSection: 'material',
    anchorId: 'w2-material-compliance',
  },
  'sketch.image.missing': {
    dossierSection: 'construction',
    anchorId: 'w2-construction-sketch-hub',
  },
};

/** Wave 29: shareable deep link w2pane + w2sec для handoff checklist. */
export function buildWorkshop2W2secDeepLink(input: {
  collectionId: string;
  articleId: string;
  dossierSection: DossierSection;
  anchorId: string;
}): string {
  const paneMap: Partial<Record<DossierSection, string>> = {
    general: 'tz',
    visuals: 'tz',
    material: 'tz',
    construction: 'tz',
    assignment: 'fit',
  };
  const w2pane = paneMap[input.dossierSection] ?? 'tz';
  const params = new URLSearchParams({ w2pane, w2sec: input.anchorId });
  return `/brand/production/workshop2/${encodeURIComponent(input.collectionId)}/${encodeURIComponent(input.articleId)}?${params.toString()}`;
}

/** Целевой якорь для actionable-ссылки из чеклиста передачи. */
export function resolveWorkshop2PreflightJumpTarget(
  issue: Pick<W2ProductionPreflightIssue, 'id' | 'section' | 'anchor'>
): Workshop2PreflightJumpTarget {
  const override = ISSUE_OVERRIDES[issue.id];
  if (override) return override;
  const base = SECTION_DEFAULT_ANCHOR[issue.section];
  if (issue.anchor && issue.anchor.startsWith('w2-')) {
    return { dossierSection: base.dossierSection, anchorId: issue.anchor };
  }
  return base;
}
