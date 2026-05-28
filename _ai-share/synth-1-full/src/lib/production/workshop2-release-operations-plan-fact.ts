/**
 * M5: plan-fact по операциям release — planned vs actual SASH, прогресс X/Y ops.
 */
import type { ProductionOperation } from '@/lib/production/article-workspace/types';

export type Workshop2ReleaseOperationPlanFactRow = {
  id: string;
  name: string;
  status: ProductionOperation['status'];
  plannedSash: number;
  actualSash: number;
  deltaSash: number;
};

export type Workshop2ReleaseOperationsPlanFactSummary = {
  rows: Workshop2ReleaseOperationPlanFactRow[];
  completedCount: number;
  inProgressCount: number;
  totalCount: number;
  progressPct: number;
  totalPlannedSash: number;
  totalActualSash: number;
  progressLabelRu: string;
};

/** Actual SASH: completed → actualSash field или full sash; in_progress = 50%; pending = 0. */
export function resolveWorkshop2ReleaseOperationActualSash(
  op: Pick<ProductionOperation, 'sash' | 'status' | 'actualSash'>
): number {
  const planned = Number.isFinite(op.sash) ? op.sash : 0;
  if (op.status === 'completed') {
    if (Number.isFinite(op.actualSash)) return op.actualSash as number;
    return planned;
  }
  if (op.status === 'in_progress') return Math.round(planned * 50) / 100;
  return 0;
}

export function summarizeWorkshop2ReleaseOperationsPlanFact(
  operations: ProductionOperation[] | undefined | null
): Workshop2ReleaseOperationsPlanFactSummary {
  const ops = operations ?? [];
  const rows: Workshop2ReleaseOperationPlanFactRow[] = ops.map((op) => {
    const plannedSash = Number.isFinite(op.sash) ? op.sash : 0;
    const actualSash = resolveWorkshop2ReleaseOperationActualSash(op);
    return {
      id: op.id,
      name: op.name,
      status: op.status,
      plannedSash,
      actualSash,
      deltaSash: Math.round((actualSash - plannedSash) * 100) / 100,
    };
  });

  const completedCount = ops.filter((o) => o.status === 'completed').length;
  const inProgressCount = ops.filter((o) => o.status === 'in_progress').length;
  const totalCount = ops.length;
  const progressPct = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;
  const totalPlannedSash = rows.reduce((acc, r) => acc + r.plannedSash, 0);
  const totalActualSash = rows.reduce((acc, r) => acc + r.actualSash, 0);

  const progressLabelRu =
    totalCount === 0
      ? 'Операции не заданы — добавьте строки или загрузите из умной маршрутизации.'
      : `Прогресс ${completedCount}/${totalCount} ops · SASH факт ${totalActualSash.toFixed(1)} / план ${totalPlannedSash.toFixed(1)} мин`;

  return {
    rows,
    completedCount,
    inProgressCount,
    totalCount,
    progressPct,
    totalPlannedSash,
    totalActualSash,
    progressLabelRu,
  };
}
