/**
 * Phase 2.5: Smart Merge audit — diff TZ operations ↔ release.operations перед слиянием.
 */
import type { Workshop2ProductionOperation } from '@/lib/production/workshop2-dossier-phase1.types';

export type Workshop2ReleaseOperationRow = {
  id: string;
  name: string;
  sash: number;
  status: string;
};

export type Workshop2ReleaseOperationsSyncAuditLine = {
  kind: 'add' | 'keep' | 'replace' | 'skip';
  name: string;
  detailRu: string;
};

export type Workshop2ReleaseOperationsSyncAudit = {
  mode: 'merge' | 'overwrite';
  tzCount: number;
  releaseCount: number;
  lines: Workshop2ReleaseOperationsSyncAuditLine[];
  summaryRu: string;
  /** Строки для tzActionLog.summaries */
  logSummaries: string[];
};

function normName(op: { name?: string; operationType?: string }): string {
  return (op.name ?? op.operationType ?? 'Операция').trim();
}

export function buildWorkshop2ReleaseOperationsSyncAudit(input: {
  tzOperations: Workshop2ProductionOperation[];
  releaseOperations: Workshop2ReleaseOperationRow[];
  mode: 'merge' | 'overwrite';
}): Workshop2ReleaseOperationsSyncAudit {
  const tzRows = input.tzOperations.map((op) => ({
    name: normName(op),
    sash: op.sash ?? 0,
  }));
  const activeRelease = input.releaseOperations.filter((o) => o.status !== 'pending');
  const lines: Workshop2ReleaseOperationsSyncAuditLine[] = [];
  const logSummaries: string[] = [];

  if (input.mode === 'overwrite') {
    for (const r of activeRelease) {
      lines.push({
        kind: 'replace',
        name: r.name,
        detailRu: `Удалится из партии (${r.status})`,
      });
    }
    for (const t of tzRows) {
      lines.push({
        kind: 'add',
        name: t.name,
        detailRu: `Загрузится из ТЗ · SASH ${t.sash} мин`,
      });
    }
    logSummaries.push(
      `Smart Merge overwrite: ${activeRelease.length} → 0 активных, +${tzRows.length} из ТЗ`
    );
    return {
      mode: input.mode,
      tzCount: tzRows.length,
      releaseCount: input.releaseOperations.length,
      lines,
      summaryRu: `Жёсткая перезапись: ${input.releaseOperations.length} операций партии заменятся на ${tzRows.length} из ТЗ.`,
      logSummaries,
    };
  }

  let addCount = 0;
  let keepCount = 0;
  for (const r of activeRelease) {
    keepCount += 1;
    lines.push({
      kind: 'keep',
      name: r.name,
      detailRu: `Остаётся (${r.status})`,
    });
  }
  const keptNames = new Set(activeRelease.map((r) => r.name.trim().toLowerCase()));
  for (const t of tzRows) {
    if (keptNames.has(t.name.toLowerCase())) {
      lines.push({
        kind: 'skip',
        name: t.name,
        detailRu: 'Уже есть в партии (не дублируем)',
      });
      continue;
    }
    addCount += 1;
    lines.push({
      kind: 'add',
      name: t.name,
      detailRu: `Добавится pending · SASH ${t.sash} мин`,
    });
  }
  logSummaries.push(
    `Smart Merge: сохранить ${keepCount} активных, +${addCount} pending из ТЗ (${tzRows.length} в модели)`
  );

  return {
    mode: input.mode,
    tzCount: tzRows.length,
    releaseCount: input.releaseOperations.length,
    lines,
    summaryRu: `Мягкое слияние: ${keepCount} активных остаются, +${addCount} новых из ТЗ.`,
    logSummaries,
  };
}
