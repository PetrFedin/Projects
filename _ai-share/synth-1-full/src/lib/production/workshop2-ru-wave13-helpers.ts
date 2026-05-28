/**
 * Wave 13 RU: TN VED format helper + GOST size mapping (lean constants).
 */

/** Публичный поиск ТН ВЭД на сайте ФТС (внешняя ссылка, без API). */
export const WORKSHOP2_TNVED_FTS_LOOKUP_BASE_URL = 'https://www.customs.ru/tnved/search' as const;

/** 10 цифр без точек — формат кода ТН ВЭД EAEC. */
export function normalizeWorkshop2TnvedDigits(raw: string | null | undefined): string {
  return String(raw ?? '')
    .replace(/\D/g, '')
    .slice(0, 10);
}

export function isWorkshop2TnvedFormatValid(raw: string | null | undefined): boolean {
  const digits = normalizeWorkshop2TnvedDigits(raw);
  return digits.length === 10;
}

export function buildWorkshop2TnvedFtsLookupUrl(code: string | null | undefined): string | null {
  const digits = normalizeWorkshop2TnvedDigits(code);
  if (digits.length !== 10) return null;
  return `${WORKSHOP2_TNVED_FTS_LOOKUP_BASE_URL}?q=${encodeURIComponent(digits)}`;
}

/** GOST 31399-2009 (жен.) / типовой ряд 42–54 для подсказки рядом с grading. */
export const WORKSHOP2_GOST_WOMENS_SIZE_RUN: readonly { label: string; gost: string }[] = [
  { label: 'XS', gost: '42' },
  { label: 'S', gost: '44' },
  { label: 'M', gost: '46' },
  { label: 'L', gost: '48' },
  { label: 'XL', gost: '50' },
  { label: 'XXL', gost: '52' },
  { label: '3XL', gost: '54' },
] as const;

export function summarizeWorkshop2GostSizeMappingHintRu(
  sizes: string[] | null | undefined
): string {
  const run = WORKSHOP2_GOST_WOMENS_SIZE_RUN.map((r) => `${r.label}→${r.gost}`).join(' · ');
  const active = (sizes ?? []).slice(0, 7).join(', ');
  return active ? `GOST 42–54: ${run}. Ваш ряд: ${active}.` : `GOST 42–54: ${run}.`;
}
