import type { Workshop2TzSignoffSectionKey } from '@/lib/production/workshop2-dossier-phase1.types';

/** Минимальная заполненность вкладки ТЗ перед парой подписей «бренд + технолог» (как у дуги на вкладке). */
export const W2_SECTION_SIGNOFF_PCT_THRESHOLD: Record<Workshop2TzSignoffSectionKey, number> = {
  general: 60,
  visuals: 50,
  /** BOM, состав, бирка — порог как у «общего», чтобы не подписывать при «полупустых» материалах. */
  material: 60,
  construction: 100,
  assignment: 100,
  b2b_sales: 80,
};

/**
 * Среднее по четырём вкладкам ТЗ (general…construction) для агрегированного гейта цифровой подписи.
 */
export const W2_TZ_FOUR_TABS_AVG_FILL_PCT_MIN_FOR_DIGITAL_SIGNOFF = 60;
