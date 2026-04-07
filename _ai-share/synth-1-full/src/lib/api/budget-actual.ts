/**
 * API-слой Budget-Actual по контракту BUDGET_ACTUAL_API.
 * Пока бэкенд не подключён — возвращаем моки.
 */

import { get } from './client';
import { BUDGET_ACTUAL_API } from '@/lib/budget-actual';
import type { BudgetActualSnapshot } from '@/lib/budget-actual';

const MOCK_SNAPSHOTS: BudgetActualSnapshot[] = [
  { id: '1', periodKey: 'SS26', periodLabel: 'SS26', category: 'procurement', categoryLabel: 'Закупки', plannedAmountRub: 2_500_000, actualAmountRub: 2_100_000, updatedAt: '2026-03-10T12:00:00Z' },
  { id: '2', periodKey: 'SS26', periodLabel: 'SS26', category: 'production', categoryLabel: 'Производство', plannedAmountRub: 4_000_000, actualAmountRub: 3_800_000, updatedAt: '2026-03-10T12:00:00Z' },
  { id: '3', periodKey: 'SS26', periodLabel: 'SS26', category: 'marketing', categoryLabel: 'Маркетинг', plannedAmountRub: 800_000, actualAmountRub: 750_000, updatedAt: '2026-03-10T12:00:00Z' },
  { id: '4', periodKey: 'SS26', periodLabel: 'SS26', category: 'logistics', categoryLabel: 'Логистика', plannedAmountRub: 600_000, actualAmountRub: 620_000, updatedAt: '2026-03-10T12:00:00Z' },
];

export async function listSnapshots(): Promise<BudgetActualSnapshot[]> {
  try {
    return await get<BudgetActualSnapshot[]>(BUDGET_ACTUAL_API.listSnapshots);
  } catch {
    return MOCK_SNAPSHOTS;
  }
}
