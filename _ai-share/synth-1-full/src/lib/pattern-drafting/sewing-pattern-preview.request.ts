import {
  buildSewingPattern,
  defaultSewingDraftOptions,
} from '@/lib/pattern-drafting/build-sewing-pattern';
import { parseSewingNum, SEWING_DEFAULT_MEASURES } from '@/lib/pattern-drafting/sewing-measure-parse';
import { applyInstructionalWatermarkToSvg } from '@/lib/pattern-drafting/sewing-svg-educational';
import type {
  SewingPatternDartToggles,
  SewingPatternDraftOptions,
  SewingPatternGarmentBlock,
  SewingPatternResult,
} from '@/lib/pattern-drafting/sewing-pattern.types';

const GARMENT_SET: ReadonlySet<string> = new Set([
  'bodice_front',
  'bodice_back',
  'skirt_front',
  'skirt_back',
  'sleeve',
]);

function readBool(x: unknown, def: boolean): boolean {
  if (typeof x === 'boolean') return x;
  return def;
}

/**
 * Парсит тело `POST` для server-side build (очередь, внутренние job’ы, A/B).
 * `watermark: false` — без учебного водяного знака (только доверенные внутренние вызовы).
 */
export function parseSewingPatternPreviewBody(
  body: unknown
):
  | { ok: true; options: SewingPatternDraftOptions; applyWatermark: boolean }
  | { ok: false; error: string } {
  if (!body || typeof body !== 'object') return { ok: false, error: 'bad_json' };
  const b = body as Record<string, unknown>;
  if (typeof b.garment !== 'string' || !GARMENT_SET.has(b.garment)) {
    return { ok: false, error: 'invalid_garment' };
  }
  const garment = b.garment as SewingPatternGarmentBlock;
  if (!b.measures || typeof b.measures !== 'object') return { ok: false, error: 'missing_measures' };
  const m = b.measures as Record<string, unknown>;
  const d = SEWING_DEFAULT_MEASURES;
  const measures = {
    unit: 'cm' as const,
    bust: parseSewingNum(m.bust, d.bust),
    waist: parseSewingNum(m.waist, d.waist),
    hip: parseSewingNum(m.hip, d.hip),
    shoulderWidth: parseSewingNum(
      m.shoulder !== undefined && m.shoulder !== null && m.shoulder !== '' ? m.shoulder : m.shoulderWidth,
      d.shoulder
    ),
    bodyHeight:
      m.height !== undefined && m.height !== null && m.height !== ''
        ? parseSewingNum(m.height, d.height)
        : undefined,
  };
  if (!b.darts || typeof b.darts !== 'object') return { ok: false, error: 'missing_darts' };
  const dr = b.darts as Record<string, unknown>;
  const darts: SewingPatternDartToggles = {
    shoulderDart: readBool(dr.shoulderDart, true),
    bustSideDart: readBool(dr.bustSideDart, true),
    waistDart: readBool(dr.waistDart, true),
  };
  const e = b.ease && typeof b.ease === 'object' ? (b.ease as Record<string, unknown>) : null;
  const ease = e
    ? {
        bust: parseSewingNum(e.bust, 4),
        waist: parseSewingNum(e.waist, 2),
        hip: parseSewingNum(e.hip, 3),
      }
    : undefined;
  const seam =
    typeof b.seamAllowanceMm === 'number' && Number.isFinite(b.seamAllowanceMm)
      ? b.seamAllowanceMm
      : parseSewingNum(b.seamAllowanceMm ?? b.seam, 10);
  const showSeamLine = readBool(b.showSeam, true);
  const showGrain = readBool(b.showGrain, true);
  const showDimensions = readBool(b.showDim, false);
  const frontNeckDropCm = parseSewingNum(b.neckDrop ?? b.frontNeckDropCm, 2.4);
  const shoulderSlant = parseSewingNum(b.shoulderSlant, 0.5);
  const waistToHemSkirtCm = parseSewingNum(b.skirtLen ?? b.waistToHemSkirtCm, 62);
  const applyWatermark = b.watermark === false ? false : true;

  const options: SewingPatternDraftOptions = defaultSewingDraftOptions({
    measures,
    garment,
    darts,
    ease,
    seamAllowanceMm: seam,
    showSeamLine,
    showGrain,
    showDimensions,
    frontNeckDropCm,
    shoulderSlant,
    waistToHemSkirtCm,
  });
  return { ok: true, options, applyWatermark };
}

export function runSewingPatternPreview(
  options: SewingPatternDraftOptions,
  applyWatermark: boolean
): SewingPatternResult {
  const raw = buildSewingPattern(options);
  if (!applyWatermark) return raw;
  return { ...raw, svg: applyInstructionalWatermarkToSvg(raw.svg) };
}
