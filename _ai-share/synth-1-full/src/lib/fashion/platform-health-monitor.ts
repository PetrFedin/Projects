import type { PlatformSystemHealthV1 } from './types';

/** Мониторинг здоровья инфраструктуры (Честный Знак, ЭДО, Логистика). */
export function getPlatformInfrastructureHealth(): PlatformSystemHealthV1[] {
  return [
    { module: 'CIS (Честный Знак)', status: 'online', latencyMs: 145, lastSuccessfulSync: new Date().toISOString() },
    { module: 'EDO (Diadoc)', status: 'online', latencyMs: 220, lastSuccessfulSync: new Date().toISOString() },
    { module: 'Marketplace Sync', status: 'warning', latencyMs: 1200, lastSuccessfulSync: new Date().toISOString() },
    { module: 'Internal ERP', status: 'online', latencyMs: 12, lastSuccessfulSync: new Date().toISOString() },
    { module: 'B2B Portal API', status: 'online', latencyMs: 45, lastSuccessfulSync: new Date().toISOString() },
  ];
}
