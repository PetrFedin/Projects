/**
 * План vs Факт (Budget vs Actual) — единый паттерн снимков для бюджетов и аналитики.
 * Связь с /brand/analytics-bi и /brand/analytics/budget-actual.
 * При API: ETL в snapshot_* (модель в app/db), импорт 1С/Мой Склад.
 */

export interface BudgetActualSnapshot {
  id: string;
  periodKey: string;
  categoryKey: string;
  categoryLabel: string;
  plannedAmountRub: number;
  actualAmountRub: number;
  snapshotAt?: string;
}

/** Категории бюджета (закупки, производство, маркетинг, логистика и т.д.) */
export const BUDGET_CATEGORIES = [
  { key: 'procurement', label: 'Закупки' },
  { key: 'production', label: 'Производство' },
  { key: 'marketing', label: 'Маркетинг' },
  { key: 'logistics', label: 'Логистика' },
  { key: 'overhead', label: 'Накладные' },
] as const;

/** Мок: снимки план/факт по периоду (SS26). При API — из snapshot_* или импорта. */
export function getBudgetActualSnapshotsMock(periodKey: string = 'SS26'): BudgetActualSnapshot[] {
  const base = [
    { planned: 4_200_000, actual: 3_980_000 },
    { planned: 2_800_000, actual: 2_650_000 },
    { planned: 600_000, actual: 720_000 },
    { planned: 450_000, actual: 410_000 },
    { planned: 350_000, actual: 340_000 },
  ];
  return BUDGET_CATEGORIES.map((cat, i) => ({
    id: `${periodKey}-${cat.key}`,
    periodKey,
    categoryKey: cat.key,
    categoryLabel: cat.label,
    plannedAmountRub: base[i].planned,
    actualAmountRub: base[i].actual,
    snapshotAt: new Date().toISOString(),
  }));
}
