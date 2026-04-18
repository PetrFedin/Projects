/**
 * Демо-платформа: только два бренда — Syntha Lab и Nordic Wool.
 * Все моки, товары и аналитика в UI должны опираться на этот контракт.
 */

export const DEMO_BRAND_SYNTHA_LAB = 'Syntha Lab' as const;
export const DEMO_BRAND_NORDIC_WOOL = 'Nordic Wool' as const;

export const DEMO_BRAND_NAMES = [DEMO_BRAND_SYNTHA_LAB, DEMO_BRAND_NORDIC_WOOL] as const;

export const DEMO_BRAND_IDS = ['brand_syntha_lab', 'brand_nordic_wool'] as const;

const ALIASES_SYNTHA = new Set(['syntha lab', 'syntha']);
const ALIASES_NORDIC = new Set(['nordic wool', 'nordic']);

/** Строка бренда относится к одному из двух демо-брендов (по имени или алиасу). */
export function isDemoBrandName(raw: string | undefined | null): boolean {
  if (raw == null || typeof raw !== 'string') return false;
  const n = raw.trim().toLowerCase();
  return ALIASES_SYNTHA.has(n) || ALIASES_NORDIC.has(n);
}

/** Приводит к каноническому отображаемому имени или `null`, если не демо-бренд. */
export function normalizeDemoBrandName(
  raw: string | undefined | null
): typeof DEMO_BRAND_SYNTHA_LAB | typeof DEMO_BRAND_NORDIC_WOOL | null {
  if (raw == null || typeof raw !== 'string') return null;
  const n = raw.trim().toLowerCase();
  if (ALIASES_SYNTHA.has(n)) return DEMO_BRAND_SYNTHA_LAB;
  if (ALIASES_NORDIC.has(n)) return DEMO_BRAND_NORDIC_WOOL;
  return null;
}

export function filterToDemoPlatformProducts<T extends { brand?: string }>(items: T[]): T[] {
  return items.filter((p) => isDemoBrandName(p.brand));
}
