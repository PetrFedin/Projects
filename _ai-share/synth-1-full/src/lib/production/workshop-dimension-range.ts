/** Строка целиком — только «число–число» (см). */
const NUM_RANGE_LINE_RE = /^(\d+(?:[.,]\d+)?)\s*[–\-]\s*(\d+(?:[.,]\d+)?)\s*$/;

/** Первое вхождение «число–число» внутри текста (Ø 45–65, 30–40 (цепь) и т.п.). */
const EMBEDDED_RANGE_RE = /(\d+(?:[.,]\d+)?)\s*[–\-]\s*(\d+(?:[.,]\d+)?)/;

export type WorkshopDimensionRangeParsed = { min: string; max: string };

export function extractEmbeddedNumericRange(raw: string): WorkshopDimensionRangeParsed | null {
  const m = raw.trim().match(EMBEDDED_RANGE_RE);
  if (!m) return null;
  return { min: m[1]!.replace(',', '.'), max: m[2]!.replace(',', '.') };
}

export function parseDimensionValueToRange(raw: string): WorkshopDimensionRangeParsed {
  const t = raw.trim();
  if (!t) return { min: '', max: '' };
  const emb = extractEmbeddedNumericRange(t);
  if (emb) return emb;
  const m = t.match(NUM_RANGE_LINE_RE);
  if (m) {
    return { min: m[1]!.replace(',', '.'), max: m[2]!.replace(',', '.') };
  }
  const single = /^(\d+(?:[.,]\d+)?)\s*$/.test(t);
  if (single) return { min: t.replace(',', '.'), max: t.replace(',', '.') };
  return { min: t, max: t };
}

export function formatRangeToDimensionCell(min: string, max: string): string {
  const a = min.trim();
  const b = max.trim();
  if (!a && !b) return '';
  if (!b || a === b) return a;
  if (!a) return b;
  return `${a}–${b}`;
}

export function cellLooksLikeNumericRange(value: string): boolean {
  return extractEmbeddedNumericRange(value) !== null;
}

/** Подсказка номинала как середина числового мин–макс (пустая строка, если не выходит). */
export function midpointNominalSuggestion(min: string, max: string): string {
  const a = parseFloat(min.replace(',', '.'));
  const b = parseFloat(max.replace(',', '.'));
  if (!Number.isFinite(a) || !Number.isFinite(b)) return '';
  const mid = (a + b) / 2;
  if (!Number.isFinite(mid)) return '';
  const rounded = Math.round(mid * 10) / 10;
  if (Number.isInteger(rounded)) return String(rounded);
  return String(rounded);
}
