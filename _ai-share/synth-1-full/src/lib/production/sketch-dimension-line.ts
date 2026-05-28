import type { Workshop2Phase1CategorySketchAnnotation } from '@/lib/production/workshop2-dossier-phase1.types';

type SketchDimensionLineFields = Pick<
  Workshop2Phase1CategorySketchAnnotation,
  'lineEndXPct' | 'lineEndYPct' | 'dimensionLabel' | 'dimensionValueText'
>;

/** Линейный размер на скетче: две точки в процентах подложки + подпись и значение. */
export function isSketchDimensionLineAnnotation(a: SketchDimensionLineFields): boolean {
  return (
    typeof a.lineEndXPct === 'number' &&
    typeof a.lineEndYPct === 'number' &&
    Number.isFinite(a.lineEndXPct) &&
    Number.isFinite(a.lineEndYPct)
  );
}

export function sketchDimensionSummary(a: SketchDimensionLineFields): string {
  if (!isSketchDimensionLineAnnotation(a)) return '';
  const parts = [(a.dimensionLabel ?? '').trim(), (a.dimensionValueText ?? '').trim()].filter(
    Boolean
  );
  return parts.join(' · ');
}
