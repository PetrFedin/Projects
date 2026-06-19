/**
 * Плановая экономика образца и сроки — отдельный объект в досье (не атрибут паспорта ТЗ).
 * Incoterms / таможенная стоимость для производственного ТЗ остаются в `assignments.customsValueIncotermsNote`
 * и не дублируются здесь; при необходимости укажите связку в `tzCommerceLinkNote`.
 */

export type Workshop2SampleEconomicsLineCategory =
  | 'material'
  | 'labor'
  | 'service'
  | 'logistics'
  | 'overhead'
  | 'other';

export type Workshop2SampleEconomicsLineItem = {
  id: string;
  label: string;
  category: Workshop2SampleEconomicsLineCategory;
  /** Количество (м, ч, шт — по смыслу `unitLabel`). */
  qty: number;
  unitLabel: string;
  /** Оценка за единицу в `currencyCode` черновика. */
  unitCost?: number;
  /** Трудозатраты, ч (опционально). */
  laborHours?: number;
  /** Срок позиции, дн. */
  leadTimeDays?: number;
  notes?: string;
  /** Откуда взята строка (v1 не тянет BOM из ТЗ автоматически). */
  sourceHint?: 'manual' | 'tz_bom_reference';
};

export type Workshop2SampleEconomicsTimeline = {
  /** Ориентир по образцу (может совпадать с паспортом — не источник правды). */
  targetSampleOrPilotIso?: string;
  /** Срок ответа по КП / договору. */
  quoteDeadlineIso?: string;
  /** Сырьё на площадке. */
  materialsOnSiteIso?: string;
  timelineNotes?: string;
};

export type Workshop2SampleEconomicsDraft = {
  schemaVersion: 1;
  /** Валюта оценок (по умолчанию RUB в UI). */
  currencyCode?: string;
  lines: Workshop2SampleEconomicsLineItem[];
  timeline?: Workshop2SampleEconomicsTimeline;
  /** Как связано с КП / паспортом; не храните дубликат текста Incoterms из ТЗ. */
  tzCommerceLinkNote?: string;
  internalNotes?: string;

  /** Снимок BOM rollup при синхронизации из costing. */
  bomRollup?: {
    syncedAt: string;
    estimatedFob: number;
    targetFob?: number;
    targetMarginPct?: number;
    deltaBand?: string;
    deltaPct?: number;
    currency?: string;
  };

  // Comprehensive calculation controls
  logisticsCost?: number;
  customsCost?: number;
  reworkCost?: number;
  marginTracking?: number;
};

export const WORKSHOP2_SAMPLE_ECONOMICS_LINE_CATEGORY_LABELS: Record<
  Workshop2SampleEconomicsLineCategory,
  string
> = {
  material: 'Сырьё / материал',
  labor: 'Труд / пошив',
  service: 'Услуги (раскрой, печать…)',
  logistics: 'Логистика',
  overhead: 'Накладные',
  other: 'Прочее',
};
