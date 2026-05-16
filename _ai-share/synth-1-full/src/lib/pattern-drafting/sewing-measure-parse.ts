/** Общие дефолты и парсинг чисел для мерок кроя (клиент + server preview API). */
export const SEWING_DEFAULT_MEASURES = { bust: 92, waist: 74, hip: 100, shoulder: 42, height: 172 } as const;

export function parseSewingNum(s: unknown, fallback: number): number {
  if (typeof s === 'number' && Number.isFinite(s) && s > 0) return s;
  if (s === undefined || s === null) return fallback;
  const n = parseFloat(String(s).replace(',', '.'));
  return Number.isFinite(n) && n > 0 ? n : fallback;
}
