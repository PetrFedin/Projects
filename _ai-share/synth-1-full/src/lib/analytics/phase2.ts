/**
 * Analytics Phase 2 — ETL в fact_* / snapshot_*, buying analytics API, дашборды план/факт и закупки.
 * Связи: Финансы, Production, B2B заказы, 1С/Мой Склад. Инфра под API.
 */

export type FactTableKind = 'sales' | 'purchases' | 'inventory' | 'production' | 'returns';

export interface FactTableMeta {
  name: string;
  kind: FactTableKind;
  lastLoadedAt?: string;
  rowCount: number;
}

export interface SnapshotMeta {
  id: string;
  periodKey: string;
  periodLabel: string;
  /** plan | actual */
  type: 'plan' | 'actual';
  category: string;
  updatedAt: string;
}

export interface BuyingAnalyticsSummary {
  periodKey: string;
  totalOrderedRub: number;
  totalReceivedRub: number;
  orderCount: number;
  topPartners: { partnerId: string; name: string; amountRub: number }[];
}

export const ANALYTICS_PHASE2_API = {
  factTables: '/api/v1/analytics/etl/fact-tables',
  snapshots: '/api/v1/analytics/snapshots',
  buyingSummary: '/api/v1/analytics/buying/summary',
  dashboardPlanFact: '/api/v1/analytics/dashboards/plan-fact',
  import1C: '/api/v1/analytics/import/1c',
  importMoySklad: '/api/v1/analytics/import/moy-sklad',
} as const;
