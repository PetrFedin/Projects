/**
 * API-слой Analytics Phase 2 по контракту ANALYTICS_PHASE2_API.
 * Пока бэкенд не подключён — возвращаем моки.
 */

import { get } from './client';
import { ANALYTICS_PHASE2_API } from '@/lib/analytics/phase2';
import type { FactTableMeta, BuyingAnalyticsSummary } from '@/lib/analytics/phase2';

const MOCK_FACT: FactTableMeta[] = [
  { name: 'fact_sales', kind: 'sales', lastLoadedAt: '2026-03-11T06:00:00Z', rowCount: 124_000 },
  { name: 'fact_purchases', kind: 'purchases', lastLoadedAt: '2026-03-11T05:30:00Z', rowCount: 38_000 },
  { name: 'snapshot_plan_fact', kind: 'inventory', lastLoadedAt: '2026-03-10T23:00:00Z', rowCount: 12 },
];

const MOCK_BUYING: BuyingAnalyticsSummary = {
  periodKey: 'SS26',
  totalOrderedRub: 8_500_000,
  totalReceivedRub: 6_200_000,
  orderCount: 142,
  topPartners: [
    { partnerId: 'P01', name: 'Ритейлер А', amountRub: 2_100_000 },
    { partnerId: 'P02', name: 'Ритейлер Б', amountRub: 1_800_000 },
  ],
};

export async function getFactTables(): Promise<FactTableMeta[]> {
  try {
    return await get<FactTableMeta[]>(ANALYTICS_PHASE2_API.factTables);
  } catch {
    return MOCK_FACT;
  }
}

export async function getBuyingSummary(): Promise<BuyingAnalyticsSummary> {
  try {
    return await get<BuyingAnalyticsSummary>(ANALYTICS_PHASE2_API.buyingSummary);
  } catch {
    return MOCK_BUYING;
  }
}
