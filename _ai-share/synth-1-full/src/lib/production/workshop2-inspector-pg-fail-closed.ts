/**
 * Wave E (#68): fail-closed сохранения инспектора — LS только offline/503 queue.
 * HTTP 4xx/5xx без queue → данные не кэшируются как «успех».
 */
import { shouldEnqueueWorkshop2InspectorOffline } from '@/lib/production/workshop2-inspector-offline-queue';
import type { Workshop2InspectorSaveState } from '@/lib/production/workshop2-inspector-report-status';

export type Workshop2InspectorSaveOutcomeKind = 'pg_saved' | 'queued_offline' | 'pg_failed';

export type Workshop2InspectorSaveOutcome = {
  kind: Workshop2InspectorSaveOutcomeKind;
  saveState: Workshop2InspectorSaveState;
  /** Разрешён ли localStorage read-on-miss (только offline queue path). */
  cacheLocally: boolean;
  hintRu: string;
};

/** Разрешить LS cache только при offline/503 queue — не при произвольном HTTP fail. */
export function shouldCacheWorkshop2InspectorChecksLocally(input: {
  saveOk: boolean;
  status?: number;
  online?: boolean;
}): boolean {
  if (input.saveOk) return false;
  return shouldEnqueueWorkshop2InspectorOffline({
    online: input.online,
    saveOk: input.saveOk,
    status: input.status,
  });
}

export function resolveWorkshop2InspectorSaveOutcome(input: {
  saveOk: boolean;
  status?: number;
  online?: boolean;
  pendingQueueDepth?: number;
}): Workshop2InspectorSaveOutcome {
  if (input.saveOk) {
    return {
      kind: 'pg_saved',
      saveState: 'saved',
      cacheLocally: false,
      hintRu: 'Отчёт инспектора сохранён в PG (workshop2_inspector_reports).',
    };
  }

  const cacheLocally = shouldCacheWorkshop2InspectorChecksLocally(input);
  if (cacheLocally) {
    const depth = (input.pendingQueueDepth ?? 0) + 1;
    return {
      kind: 'queued_offline',
      saveState: 'error',
      cacheLocally: true,
      hintRu:
        input.online === false
          ? `Offline — PUT в очереди (${depth}). Данные в offline-кэше до flush в PG.`
          : `PG недоступен (${input.status ?? 503}) — PUT в очереди (${depth}). Дождитесь сети для flush.`,
    };
  }

  if (input.status === 409) {
    return {
      kind: 'pg_failed',
      saveState: 'error',
      cacheLocally: false,
      hintRu: 'Конфликт версии досье (409) — обновите workspace и повторите сохранение инспектора.',
    };
  }

  return {
    kind: 'pg_failed',
    saveState: 'error',
    cacheLocally: false,
    hintRu: `PUT inspector-report отклонён (HTTP ${input.status ?? 'error'}) — данные не сохранены в PG.`,
  };
}
