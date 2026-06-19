/**
 * Разбор gate-checks из ответов Workshop2 API (409 handoff_not_ready, export blocked, …).
 */
import { localizeWorkshop2GateChecks } from '@/lib/production/workshop2-gate-messages-ru';

export type Workshop2ApiGateCheck = {
  id?: string;
  severity?: 'blocker' | 'warning';
  messageRu: string;
};

export function parseWorkshop2ApiGateChecksFromJson(json: unknown): Workshop2ApiGateCheck[] {
  if (!json || typeof json !== 'object') return [];
  const checks = (json as { checks?: unknown }).checks;
  if (!Array.isArray(checks)) return [];
  const parsed: Workshop2ApiGateCheck[] = checks.flatMap((c) => {
    if (!c || typeof c !== 'object') return [];
    const row = c as { id?: string; severity?: string; messageRu?: string };
    const messageRu = row.messageRu?.trim();
    if (!messageRu) return [];
    const severity =
      row.severity === 'warning' || row.severity === 'blocker' ? row.severity : undefined;
    return [{ id: row.id, severity, messageRu }];
  });
  return localizeWorkshop2GateChecks(parsed);
}

export type Workshop2GateChecksPartition = {
  blockers: Workshop2ApiGateCheck[];
  warnings: Workshop2ApiGateCheck[];
  ordered: Workshop2ApiGateCheck[];
};

/** Полный список checks для inline UI (blockers первыми). */
export function partitionWorkshop2GateChecksForUi(
  checks: Workshop2ApiGateCheck[] | undefined
): Workshop2GateChecksPartition {
  const list = checks ?? [];
  const blockers = list.filter((c) => c.severity === 'blocker');
  const warnings = list.filter((c) => c.severity === 'warning');
  const other = list.filter((c) => c.severity !== 'blocker' && c.severity !== 'warning');
  return {
    blockers,
    warnings,
    ordered: [...blockers, ...warnings, ...other],
  };
}

/** Текст для toast / inline: приоритет blockers, до 4 пунктов. */
export function formatWorkshop2GateChecksForUi(
  checks: Workshop2ApiGateCheck[] | undefined,
  fallback?: string
): string {
  const { ordered } = partitionWorkshop2GateChecksForUi(checks);
  const blockers = ordered.filter((c) => c.severity === 'blocker');
  const source = blockers.length > 0 ? blockers : ordered;
  const lines = source.map((c) => c.messageRu).filter(Boolean);
  if (lines.length > 0) {
    return lines.slice(0, 4).join(' · ');
  }
  return fallback?.trim() || 'Запрос отклонён — проверьте готовность ТЗ и связанные разделы.';
}
