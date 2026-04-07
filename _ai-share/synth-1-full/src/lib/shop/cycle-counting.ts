/**
 * Inventory Cycle Counting — инвентаризация склада через камеру смартфона (~15 мин).
 * Связи: Склад, Russian Layer (маркировка). Инфра под API.
 */

export type CycleCountStatus = 'in_progress' | 'completed' | 'discrepancy';

export interface CycleCountSession {
  id: string;
  warehouseId: string;
  zone?: string;
  status: CycleCountStatus;
  scannedCount: number;
  expectedCount: number;
  discrepancyCount?: number;
  /** КИЗ/маркировка: сверка с Честный ЗНАК */
  markingVerified: boolean;
  startedAt: string;
  completedAt?: string;
}

export const CYCLE_COUNTING_API = {
  startSession: '/api/v1/shop/inventory/cycle-count/start',
  scanItem: '/api/v1/shop/inventory/cycle-count/scan',
  completeSession: '/api/v1/shop/inventory/cycle-count/complete',
} as const;
