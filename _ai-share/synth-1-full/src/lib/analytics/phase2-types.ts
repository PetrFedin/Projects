/**
 * Analytics Phase 2 — ETL в fact_* / snapshot_*, buying analytics API, дашборды закупок.
 * Типы под модель app/db (dimension, fact, snapshot). При API — pipeline в fact_* и snapshot_*.
 */

export type FactTableKind = 'sales' | 'purchases' | 'inventory' | 'production' | 'returns';

export interface FactTableMeta {
  name: string;
  kind: FactTableKind;
  rowCount: number;
  lastLoadedAt?: string;
}

export interface BuyingAnalyticsSummary {
  periodKey: string;
  totalOrderedRub: number;
  totalReceivedRub: number;
  orderCount: number;
  partnerCount?: number;
}

/** Мок: список fact-таблиц (ETL). При API — из метаданных БД. */
export function getFactTablesMock(): FactTableMeta[] {
  const now = new Date().toISOString().slice(0, 19).replace('T', ' ');
  return [
    { name: 'fact_sales', kind: 'sales', rowCount: 12450, lastLoadedAt: now },
    { name: 'fact_purchases', kind: 'purchases', rowCount: 3200, lastLoadedAt: now },
    { name: 'fact_inventory_snapshot', kind: 'inventory', rowCount: 890, lastLoadedAt: now },
    { name: 'fact_production_events', kind: 'production', rowCount: 2100, lastLoadedAt: now },
    { name: 'fact_returns', kind: 'returns', rowCount: 340, lastLoadedAt: now },
  ];
}

/** Мок: сводка закупок. При API — из buying analytics API. */
export function getBuyingSummaryMock(periodKey: string = 'SS26'): BuyingAnalyticsSummary {
  return {
    periodKey,
    totalOrderedRub: 5_200_000,
    totalReceivedRub: 4_800_000,
    orderCount: 28,
    partnerCount: 12,
  };
}
