import type { CollectionStep } from '@/lib/production/collection-steps-catalog';
import type { ProductionFloorTabId } from '@/lib/production/floor-flow';
import {
  type StageFillEditTab,
  type StageFillEvaluationItem,
} from '@/lib/production/stage-data-fill-spec';
import { STAGES_SKU_PANEL_TAB_VALUES } from '@/lib/production/stages-url';
import type { MatrixStepStatus, SkuStageDetail } from '@/lib/production/unified-sku-flow-store';

export const STAGE_FILL_TAB_ORDER = [...STAGES_SKU_PANEL_TAB_VALUES] as StageFillEditTab[];

export function catalogStepIndex(steps: readonly { id: string }[], stepId: string): number {
  return steps.findIndex((s) => s.id === stepId);
}

/** Необязательные / с отложенной фиксацией / «не начато не блокирует» — можно вести контекст параллельно основному контуру. */
export function stepAllowsParallelContext(step: CollectionStep): boolean {
  if (!step.mandatory) return true;
  if (step.canSkipForNow) return true;
  if (step.relaxesWhenNotStarted) return true;
  return false;
}

export function skuStepExpandable(
  step: CollectionStep,
  row: SkuStageDetail,
  stepIdx: number,
  curIdx: number
): boolean {
  const s = row.status;
  const isFuture = stepIdx > curIdx;
  const isPast = stepIdx < curIdx;
  const isCurrent = stepIdx === curIdx;

  if (s === 'done' || s === 'skipped') return true;
  if (s === 'in_progress' || s === 'blocked') return true;
  if (isPast) return true;
  if (isCurrent) return true;
  if (isFuture && stepAllowsParallelContext(step)) return true;
  return false;
}

/** Ссылка в модуль этапа: пройдено, в работе / блок, текущий или прошлый узел каталога, либо параллельный допустимый этап. */
export function skuStepShowWorkLink(
  step: CollectionStep,
  row: SkuStageDetail,
  stepIdx: number,
  curIdx: number
): boolean {
  const s = row.status;
  const isPast = stepIdx < curIdx;
  const isCurrent = stepIdx === curIdx;
  const isFuture = stepIdx > curIdx;

  if (s === 'done' || s === 'skipped' || s === 'in_progress' || s === 'blocked') return true;
  if (isPast || isCurrent) return true;
  if (isFuture && stepAllowsParallelContext(step)) return true;
  return false;
}

/** Как buildTransitionUrl в матрице/доске; для collectionScoped — только контекст коллекции (без stagesSku). */
export function workTabHrefForStep(
  step: CollectionStep,
  mergeModuleHref: (href: string, stepId: string, articleId?: string) => string,
  floorHref: (tab: ProductionFloorTabId) => string,
  mergeCollectionQuery?: (href: string, collectionQuery: string) => string,
  collectionQuery?: string
): string | null {
  const collectionScoped =
    Boolean(step.collectionScopedModuleNav) &&
    mergeCollectionQuery &&
    collectionQuery !== undefined;
  if (collectionScoped) {
    if (step.productionFloorTab)
      return mergeCollectionQuery(floorHref(step.productionFloorTab), collectionQuery);
    if (step.href) return mergeCollectionQuery(step.href, collectionQuery);
    return null;
  }
  if (step.productionFloorTab) return mergeModuleHref(floorHref(step.productionFloorTab), step.id);
  if (step.href) return mergeModuleHref(step.href, step.id);
  return null;
}

export function crossLinkHrefForStep(
  step: CollectionStep,
  href: string,
  mergeModuleHref: (href: string, stepId: string, articleId?: string) => string,
  mergeCollectionQuery?: (href: string, collectionQuery: string) => string,
  collectionQuery?: string
): string {
  const collectionScoped =
    Boolean(step.collectionScopedModuleNav) &&
    mergeCollectionQuery &&
    collectionQuery !== undefined;
  if (collectionScoped) return mergeCollectionQuery(href, collectionQuery);
  return mergeModuleHref(href, step.id);
}

export const STATUS_OPTS: { v: MatrixStepStatus | 'blocked' | 'skipped'; l: string }[] = [
  { v: 'not_started', l: 'Не начато' },
  { v: 'in_progress', l: 'В работе' },
  { v: 'done', l: 'Готово' },
  { v: 'blocked', l: 'Заблокировано' },
  { v: 'skipped', l: 'Пропуск' },
];

/** Как на «Доске этапов» (оперативка): 4 колонки в ряд. */
export const SKU_BOARD_STAGES_PER_ROW = 4;

/** Совпадает с шапкой колонки доски в StagesDependenciesTabContent */
export const SKU_BOARD_COL_HEADER = 'min-h-[92px]';

export function chunkSkuBoardRows<T>(arr: readonly T[], size: number): T[][] {
  const out: T[][] = [];
  for (let i = 0; i < arr.length; i += size) out.push(arr.slice(i, i + size) as T[]);
  return out;
}

export function sortStageFillEvaluationItems(
  items: readonly StageFillEvaluationItem[]
): StageFillEvaluationItem[] {
  const rank = (it: StageFillEvaluationItem) => {
    if (it.required && !it.filled) return 0;
    if (it.required && it.filled) return 1;
    if (!it.required && !it.filled) return 2;
    return 3;
  };
  return [...items].sort((a, b) => rank(a) - rank(b));
}
