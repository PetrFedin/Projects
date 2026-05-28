/**
 * Источник правды для статуса обмена с учётом (1С, УТ, МойСклад и т.д.).
 * GET `/api/shop/erp-sync-status` и клиентский баннер используют одну и ту же форму.
 * Базовое время успеха сливается с `lastSync` коннектора `platform` из B2B-интеграций (если новее).
 * Дополнительно подмешивается реальный бэклог доменного outbox (ожидание публикации событий).
 */

import 'server-only';

import { getB2BIntegrationStatus } from '@/lib/b2b/integrations/b2b-integration-service';
import { getDomainEventOutboxStats } from '@/lib/order/domain-event-outbox';

export type ErpAccountingSyncHealth = 'ok' | 'degraded' | 'error';

export type ErpAccountingSyncStatus = {
  lastSuccessAt: string;
  systemLabel: string;
  pendingInQueue: number;
  lastError?: string | null;
  health?: ErpAccountingSyncHealth;
  /** Идентификатор коннектора учёта / очереди */
  connectorId?: string;
  /** Длительность последнего успешного цикла (мс), если известна */
  syncDurationMs?: number;
  /** ISO: последний завершённый job синка (env `ERP_SYNC_LAST_JOB_COMPLETED_AT` или ops). */
  lastSyncJobCompletedAt?: string | null;
  /** Реальный бэклог доменного outbox (pending до publish в шину). */
  domainOutboxPending?: number;
  /** Записи pending с lastError (для алертов). */
  domainOutboxFailed?: number;
};

function parsePending(): number {
  const raw = process.env.ERP_SYNC_PENDING_QUEUE;
  if (raw === undefined || raw === '') return 0;
  const n = parseInt(raw, 10);
  return Number.isFinite(n) ? Math.max(0, n) : 0;
}

function parseDurationMs(): number | undefined {
  const raw = process.env.ERP_SYNC_DURATION_MS;
  if (raw === undefined || raw === '') return undefined;
  const n = parseInt(raw, 10);
  return Number.isFinite(n) && n > 0 ? n : undefined;
}

function maxIso(a: string, b: string): string {
  return Date.parse(a) >= Date.parse(b) ? a : b;
}

/** ISO последнего job из ops (`ERP_SYNC_LAST_JOB_COMPLETED_AT`). */
function parseLastJobCompletedAt(): string | null | undefined {
  const raw = process.env.ERP_SYNC_LAST_JOB_COMPLETED_AT?.trim();
  if (!raw) return undefined;
  const t = Date.parse(raw);
  return Number.isFinite(t) ? new Date(t).toISOString() : undefined;
}

function buildFromEnv(): Omit<ErpAccountingSyncStatus, 'health'> {
  const minutesAgo = process.env.ERP_SYNC_LAST_SUCCESS_MINUTES_AGO;
  const offsetMs =
    minutesAgo !== undefined && minutesAgo !== ''
      ? parseInt(minutesAgo, 10) * 60 * 1000
      : 12 * 60 * 1000;

  const jobAt = parseLastJobCompletedAt();

  return {
    lastSuccessAt: new Date(
      Date.now() - (Number.isFinite(offsetMs) ? offsetMs : 12 * 60 * 1000)
    ).toISOString(),
    systemLabel: process.env.ERP_ACCOUNTING_SYSTEM_LABEL ?? '1С / УТ',
    pendingInQueue: parsePending(),
    lastError: process.env.ERP_SYNC_LAST_ERROR?.trim() || null,
    connectorId: process.env.ERP_SYNC_CONNECTOR_ID ?? 'b2b-platform',
    syncDurationMs: parseDurationMs(),
    lastSyncJobCompletedAt: jobAt === undefined ? null : jobAt,
  };
}

/** Сервер и API: env + сигнал из матрицы B2B-интеграций + доменный outbox. */
export async function getErpAccountingSyncStatus(): Promise<ErpAccountingSyncStatus> {
  const base = buildFromEnv();
  const integrations = getB2BIntegrationStatus();
  const platform = integrations.find((i) => i.id === 'platform');
  const platformSync = platform?.lastSync;

  const lastSuccessAt =
    platformSync && !Number.isNaN(Date.parse(platformSync))
      ? maxIso(base.lastSuccessAt, platformSync)
      : base.lastSuccessAt;

  let domainOutboxPending: number | undefined;
  let domainOutboxFailed: number | undefined;
  try {
    const outbox = await getDomainEventOutboxStats();
    domainOutboxPending = outbox.pending;
    domainOutboxFailed = outbox.failed;
  } catch {
    domainOutboxPending = undefined;
    domainOutboxFailed = undefined;
  }

  let health: ErpAccountingSyncHealth = 'ok';
  if (base.lastError) health = 'degraded';
  if (platform?.health === 'degraded') health = 'degraded';
  if (platform?.health === 'error') health = 'error';
  if ((domainOutboxFailed ?? 0) > 0 && health !== 'error') health = 'degraded';
  if ((domainOutboxPending ?? 0) >= 100 && health !== 'error') health = 'degraded';

  return {
    ...base,
    lastSuccessAt,
    health,
    domainOutboxPending,
    domainOutboxFailed,
  };
}
