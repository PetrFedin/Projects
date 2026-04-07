/**
 * API-слой Cycle Counting по контракту CYCLE_COUNTING_API.
 * Пока бэкенд не подключён — возвращаем моки. Список сессий — условный эндпоинт при наличии бэкенда.
 */

import { get } from './client';
import type { CycleCountSession } from '@/lib/shop/cycle-counting';

const LIST_SESSIONS_PATH = '/api/v1/shop/inventory/cycle-count/sessions';

const MOCK_SESSIONS: CycleCountSession[] = [
  { id: 's1', warehouseId: 'wh-1', zone: 'A', status: 'completed', scannedCount: 120, expectedCount: 118, discrepancyCount: 2, markingVerified: true, startedAt: '2026-03-11T08:00:00Z', completedAt: '2026-03-11T08:18:00Z' },
  { id: 's2', warehouseId: 'wh-1', zone: 'B', status: 'in_progress', scannedCount: 45, expectedCount: 52, markingVerified: true, startedAt: '2026-03-11T10:00:00Z' },
];

export async function listSessions(): Promise<CycleCountSession[]> {
  try {
    return await get<CycleCountSession[]>(LIST_SESSIONS_PATH);
  } catch {
    return MOCK_SESSIONS;
  }
}
