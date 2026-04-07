/** Ключ localStorage для статусов матрицы этапов (синхрон с /brand/production) */
export const PRODUCTION_COLLECTION_FLOW_STORAGE_PREFIX = 'brand_production_collection_flow_v1';

export function productionCollectionFlowStorageKey(collectionId: string): string {
  const id = collectionId?.trim() || 'default';
  return `${PRODUCTION_COLLECTION_FLOW_STORAGE_PREFIX}__${id}`;
}

export type CollectionFlowStepStatus = 'not_started' | 'in_progress' | 'done';

export type CollectionFlowStepForPosition = {
  id: string;
  title: string;
  dependsOn: readonly string[];
  relaxesWhenNotStarted?: boolean;
};

export type CollectionMatrixPosition =
  | { kind: 'all_done'; total: number }
  | { kind: 'in_progress'; stepId: string; title: string }
  | { kind: 'next'; stepId: string; title: string }
  | { kind: 'blocked'; stepId: string; title: string; blockerSummary: string };

function depSatisfied(
  depId: string,
  status: Record<string, CollectionFlowStepStatus | undefined>,
  steps: readonly CollectionFlowStepForPosition[]
): boolean {
  const st = status[depId] ?? 'not_started';
  if (st === 'done') return true;
  const depStep = steps.find((s) => s.id === depId);
  if (depStep?.relaxesWhenNotStarted && st === 'not_started') return true;
  return false;
}

function isStepBlocked(
  step: CollectionFlowStepForPosition,
  status: Record<string, CollectionFlowStepStatus | undefined>,
  steps: readonly CollectionFlowStepForPosition[]
): boolean {
  return step.dependsOn.some((depId) => !depSatisfied(depId, status, steps));
}

function blockerSummary(
  step: CollectionFlowStepForPosition,
  status: Record<string, CollectionFlowStepStatus | undefined>,
  steps: readonly CollectionFlowStepForPosition[]
): string {
  const labels = step.dependsOn
    .filter((depId) => !depSatisfied(depId, status, steps))
    .map((depId) => steps.find((s) => s.id === depId)?.title)
    .filter(Boolean) as string[];
  return labels.join(', ');
}

/**
 * Логическая позиция в матрице COLLECTION_STEPS: что в работе, что следующее или что блокирует цепочку.
 */
export function computeMatrixFlowPosition(
  steps: readonly CollectionFlowStepForPosition[],
  status: Record<string, CollectionFlowStepStatus | undefined>
): CollectionMatrixPosition {
  const total = steps.length;
  const allDone = steps.every((s) => (status[s.id] ?? 'not_started') === 'done');
  if (allDone) return { kind: 'all_done', total };

  const inProgress = steps.find((s) => (status[s.id] ?? 'not_started') === 'in_progress');
  if (inProgress) {
    return { kind: 'in_progress', stepId: inProgress.id, title: inProgress.title };
  }

  const nextOpen = steps.find((s) => {
    const st = status[s.id] ?? 'not_started';
    return st !== 'done' && !isStepBlocked(s, status, steps);
  });
  if (nextOpen) {
    return { kind: 'next', stepId: nextOpen.id, title: nextOpen.title };
  }

  const firstIncomplete = steps.find((s) => (status[s.id] ?? 'not_started') !== 'done');
  if (firstIncomplete) {
    return {
      kind: 'blocked',
      stepId: firstIncomplete.id,
      title: firstIncomplete.title,
      blockerSummary: blockerSummary(firstIncomplete, status, steps),
    };
  }

  return { kind: 'all_done', total };
}
