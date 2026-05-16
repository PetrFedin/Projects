import type { Workshop2CompositionLabelSpec } from '@/lib/production/workshop2-dossier-phase1.types';

/** Межстрочный и межбуквенный интервал для черновика / превью (CSS). */
export function compositionLabelDraftTypographyStyle(spec: Workshop2CompositionLabelSpec | undefined): {
  lineHeight: string;
  letterSpacing?: string;
} {
  const s = spec ?? {};
  const lhRaw = Number.parseFloat(String(s.typographyLineHeightPct ?? '').replace(',', '.'));
  const lineHeight =
    Number.isFinite(lhRaw) && lhRaw >= 80 && lhRaw <= 220 ? `${lhRaw}%` : '130%';
  const lsRaw = Number.parseFloat(String(s.typographyLetterSpacingEm ?? '').replace(',', '.'));
  const letterSpacing =
    Number.isFinite(lsRaw) && lsRaw >= -0.15 && lsRaw <= 0.6 ? `${lsRaw}em` : undefined;
  return { lineHeight, letterSpacing };
}

/** Множитель шага строки в PDF (pt) от межстрочного %. */
export function compositionLabelPdfLineStepMm(spec: Workshop2CompositionLabelSpec | undefined): number {
  const { lineHeight } = compositionLabelDraftTypographyStyle(spec);
  const pct = Number.parseFloat(lineHeight.replace('%', ''));
  const factor = Number.isFinite(pct) ? pct / 100 : 1.3;
  return 2.45 * factor;
}

/** Класс Tailwind для шага знаков ухода на черновике. */
export function compositionLabelCareSymbolGapClass(
  spec: Workshop2CompositionLabelSpec | undefined
): string {
  const d = spec?.careSymbolsLayoutDensity ?? 'normal';
  if (d === 'tight') return 'gap-0.5';
  if (d === 'loose') return 'gap-1.5';
  return 'gap-1';
}
