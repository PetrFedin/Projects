/**
 * План vs Факт (Budget vs Actual) — РФ: бюджеты закупок, производство, маркетинг.
 * Инфраструктура под API: типы и эндпоинты. При подключении API — ETL в fact_* / snapshot_* (см. backend).
 * Связи: аналитика, финансы, производство, B2B заказы.
 */

export type BudgetCategory =
  | 'procurement'   // закупки
  | 'production'    // производство
  | 'marketing'     // маркетинг
  | 'logistics'     // логистика
  | 'other';

/** Срез план/факт по категории и периоду (РФ: рубли) */
export interface BudgetActualSnapshot {
  id: string;
  brandId?: string;
  /** Год, сезон или месяц */
  periodKey: string;
  periodLabel: string;        // например "SS26", "2026 Q1"
  category: BudgetCategory;
  categoryLabel: string;      // "Закупки", "Производство"
  plannedAmountRub: number;
  actualAmountRub: number;
  /** Контрагент (для детализации) */
  counterpartyId?: string;
  /** Статья бюджета (для детализации) */
  budgetLineId?: string;
  updatedAt: string;         // ISO
}

/** Эндпоинты для будущего API (без вызовов) */
export const BUDGET_ACTUAL_API = {
  listSnapshots: '/api/v1/analytics/budget-actual/snapshots',
  getSnapshot: '/api/v1/analytics/budget-actual/snapshots/:id',
  /** Импорт из 1С/Мой Склад для плана и факта */
  importActual: '/api/v1/analytics/budget-actual/import',
  exportReport: '/api/v1/analytics/budget-actual/export',
} as const;
