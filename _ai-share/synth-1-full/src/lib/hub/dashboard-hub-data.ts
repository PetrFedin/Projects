import type { HubAlert } from '@/components/hub/hub-today-panel';

/**
 * Собирает алерты для хаба: при отсутствии источника (загрузка) — только демо-список;
 * при FastAPI можно добавить сигналы с бэка (пока заглушка).
 */
export function hubAlertsForSource(
  _useFastApi: boolean,
  source: string | undefined,
  demoAlerts: HubAlert[]
): HubAlert[] {
  if (source === undefined) return demoAlerts;
  if (_useFastApi && source !== 'demo') {
    return [...demoAlerts, { level: 'info' as const, text: `Данные: ${source}` }];
  }
  return demoAlerts;
}
