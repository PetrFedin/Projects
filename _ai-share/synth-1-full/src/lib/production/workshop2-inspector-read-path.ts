/**
 * Wave P — PG-first read path для inspector-report (снижение dual-write / stale LS).
 * Клиент читает localStorage только когда API явно разрешает fallback.
 */
import type { Workshop2InspectorReportDto } from '@/lib/production/workshop2-inspector-report-client';

export type Workshop2InspectorReadSource = 'postgres' | 'memory_dev' | 'none';

export type Workshop2InspectorReadPath = {
  report: Workshop2InspectorReportDto | null;
  readSource: Workshop2InspectorReadSource;
  /** true когда PG primary — LS read-on-miss запрещён. */
  pgPrimary: boolean;
  allowLocalStorageFallback: boolean;
  hintRu: string;
};

/** Серверный и клиентский контракт: PG primary → не подмешивать LS cache. */
export function resolveWorkshop2InspectorReadPath(input: {
  pgEnabled: boolean;
  report: Workshop2InspectorReportDto | null;
}): Workshop2InspectorReadPath {
  if (input.pgEnabled) {
    return {
      report: input.report,
      readSource: input.report ? 'postgres' : 'none',
      pgPrimary: true,
      allowLocalStorageFallback: false,
      hintRu: input.report
        ? 'Inspector report из PostgreSQL (PG primary).'
        : 'PG primary: отчёт не найден — localStorage read-on-miss отключён (без stale dual-write).',
    };
  }

  return {
    report: input.report,
    readSource: input.report ? 'memory_dev' : 'none',
    pgPrimary: false,
    allowLocalStorageFallback: true,
    hintRu: input.report
      ? 'Dev file-store / in-memory inspector (PG off).'
      : 'PG off — допустим offline localStorage до flush в PG.',
  };
}
