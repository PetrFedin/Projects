import { draftBodiceBackMetric } from '@/lib/pattern-drafting/draft-bodice-back-metric';
import { draftBodiceFrontMetric } from '@/lib/pattern-drafting/draft-bodice-front-metric';
import { draftSkirtBackMetric, draftSkirtFrontMetric } from '@/lib/pattern-drafting/draft-skirt-metric';
import { draftSleeveMetric } from '@/lib/pattern-drafting/draft-sleeve-metric';
import { renderSewingPatternSvg } from '@/lib/pattern-drafting/render-sewing-pattern-svg';
import { sewingPatternsMessages } from '@/lib/pattern-drafting/sewing-patterns-messages';
import type { SewingPatternDraftOptions, SewingPatternResult } from '@/lib/pattern-drafting/sewing-pattern.types';
import { defaultEaseCm } from '@/lib/pattern-drafting/metric-formulas';

/** Один и тот же объект для «не-одежда» — стабильная ссылка в React (без лишнего re-parse SVG). */
function escapeXmlForSvg(s: string): string {
  return s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

const _m = sewingPatternsMessages;
const NON_APPAREL_SVG = (() => {
  const t1 = escapeXmlForSvg(_m.nonApparelSvgLine1);
  const t2 = escapeXmlForSvg(_m.nonApparelSvgLine2);
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 420 96" width="420" height="96"><text x="16" y="44" font-size="13" fill="#64748b" font-family="system-ui,sans-serif">${t1}</text><text x="16" y="64" font-size="12" fill="#94a3b8" font-family="system-ui,sans-serif">${t2}</text></svg>`;
})();

export const NON_APPAREL_SEWING_PATTERN_RESULT: SewingPatternResult = {
  svg: NON_APPAREL_SVG,
  viewBox: '0 0 420 96',
  widthMm: 420,
  heightMm: 96,
  notes: [_m.nonApparelNote],
  buildLog: [],
  downloadFileName: 'synth-sewing-patterns-n-a.svg',
};

/** Плейсхолдер, когда лист не «Одежда» (сумки, обувь и т.д.) — крой-лекала к объекту не строим. */
export function nonApparelSewingPatternResult(): SewingPatternResult {
  return NON_APPAREL_SEWING_PATTERN_RESULT;
}

export function defaultSewingDraftOptions(
  partial: Pick<SewingPatternDraftOptions, 'measures' | 'garment' | 'darts'> &
    Partial<Omit<SewingPatternDraftOptions, 'measures' | 'garment' | 'darts'>>
): SewingPatternDraftOptions {
  const e = defaultEaseCm();
  return {
    measures: partial.measures,
    garment: partial.garment,
    darts: partial.darts,
    ease: partial.ease ?? e,
    seamAllowanceMm: partial.seamAllowanceMm ?? 10,
    showSeamLine: partial.showSeamLine ?? true,
    showGrain: partial.showGrain ?? true,
    showDimensions: partial.showDimensions ?? false,
    frontNeckDropCm: partial.frontNeckDropCm ?? 2.4,
    shoulderSlant: partial.shoulderSlant ?? 0.5,
    waistToHemSkirtCm: partial.waistToHemSkirtCm ?? 62,
  };
}

export function buildSewingPattern(options: SewingPatternDraftOptions): SewingPatternResult {
  const notes: string[] = [];
  let buildLog: { key: string; value: string; unit?: string }[] = [];

  switch (options.garment) {
    case 'bodice_front': {
      const r = draftBodiceFrontMetric(options);
      buildLog = r.log;
      return renderSewingPatternSvg([r.piece], options, buildLog, notes);
    }
    case 'bodice_back': {
      const r = draftBodiceBackMetric(options);
      buildLog = r.log;
      return renderSewingPatternSvg([r.piece], options, buildLog, notes);
    }
    case 'skirt_front': {
      const r = draftSkirtFrontMetric(options);
      buildLog = r.log;
      return renderSewingPatternSvg([r.piece], options, buildLog, notes);
    }
    case 'skirt_back': {
      const r = draftSkirtBackMetric(options);
      buildLog = r.log;
      return renderSewingPatternSvg([r.piece], options, buildLog, notes);
    }
    case 'sleeve': {
      const r = draftSleeveMetric(options);
      buildLog = r.log;
      notes.push('Совместите окат с фактически снятой длиной проймы (мерка по лекалу лифа).');
      return renderSewingPatternSvg([r.piece], options, buildLog, notes);
    }
  }
}
