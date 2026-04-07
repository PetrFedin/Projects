/**
 * API-слой аналитики: План vs Факт, Phase 2 (fact/snapshot, buying).
 * Сейчас — мок. При подключении бэкенда заменить на fetch(API_BASE + endpoint).
 */

import {
  getBudgetActualSnapshotsMock,
  type BudgetActualSnapshot,
} from '@/lib/analytics/budget-actual';
import {
  getFactTablesMock,
  getBuyingSummaryMock,
  type FactTableMeta,
  type BuyingAnalyticsSummary,
} from '@/lib/analytics/phase2-types';

/** Снимки план/факт по периоду. При API: GET /analytics/budget-actual/snapshots?period=SS26 */
export async function listBudgetActualSnapshots(
  periodKey: string = 'SS26'
): Promise<BudgetActualSnapshot[]> {
  await Promise.resolve(); // simulate async
  return getBudgetActualSnapshotsMock(periodKey);
}

/** Метаданные fact-таблиц (ETL). При API: GET /analytics/phase2/fact-tables */
export async function getFactTables(): Promise<FactTableMeta[]> {
  await Promise.resolve();
  return getFactTablesMock();
}

/** Сводка закупок за период. При API: GET /analytics/phase2/buying-summary?period=SS26 */
export async function getBuyingSummary(
  periodKey: string = 'SS26'
): Promise<BuyingAnalyticsSummary> {
  await Promise.resolve();
  return getBuyingSummaryMock(periodKey);
}
