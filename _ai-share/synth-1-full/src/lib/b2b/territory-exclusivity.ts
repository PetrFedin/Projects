/**
 * Colect / Zedonk: территория и эксклюзив по региону/каналу.
 * Проверка при заявке: «уже есть эксклюзивный партнёр в регионе».
 * Связь с Territory Protection и карточкой партнёра.
 */

export interface TerritoryConflictResult {
  conflict: boolean;
  /** Название партнёра, имеющего эксклюзив в регионе */
  existingPartnerName?: string;
  region?: string;
}

/** Мок: проверка конфликта эксклюзива по региону/городу. При API — вызов TERRITORY_PROTECTION_API.check или отдельный endpoint. */
export function checkExclusiveConflict(country: string, city?: string): TerritoryConflictResult {
  const regionKey = (city || country || '').toLowerCase();
  // Мок: в Москве и ЦФО уже эксклюзив
  if (regionKey.includes('москва') || regionKey.includes('мск') || regionKey.includes('цфо')) {
    return {
      conflict: true,
      existingPartnerName: 'Демо-магазин · Москва 1',
      region: 'Москва / ЦФО',
    };
  }
  if (regionKey.includes('спб') || regionKey.includes('петербург') || regionKey.includes('сзфо')) {
    return { conflict: true, existingPartnerName: 'Boutique No.7 (СПб)', region: 'СЗФО' };
  }
  return { conflict: false };
}
