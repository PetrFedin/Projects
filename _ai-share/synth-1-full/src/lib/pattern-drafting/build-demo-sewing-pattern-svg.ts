import {
  buildSewingPattern,
  defaultSewingDraftOptions,
} from '@/lib/pattern-drafting/build-sewing-pattern';
import type {
  SewingPatternDartToggles,
  SewingPatternDemoResult,
  SewingPatternGarmentBlock,
  SewingPatternMeasureInput,
} from '@/lib/pattern-drafting/sewing-pattern.types';

/**
 * Совместимость: ранний API. Обертка над buildSewingPattern.
 */
export function buildDemoSewingPatternSvg(
  m: SewingPatternMeasureInput,
  garment: SewingPatternGarmentBlock,
  darts: SewingPatternDartToggles
): SewingPatternDemoResult {
  const r = buildSewingPattern(
    defaultSewingDraftOptions({
      measures: m,
      garment,
      darts,
    })
  );
  return {
    svg: r.svg,
    viewBox: r.viewBox,
    widthMmApprox: r.widthMm,
    heightMmApprox: r.heightMm,
    notes: r.notes,
  };
}
