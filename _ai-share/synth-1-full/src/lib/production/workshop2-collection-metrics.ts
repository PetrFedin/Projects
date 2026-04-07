import { COLLECTION_STEPS } from '@/lib/production/collection-steps-catalog';
import { isSkuStepDone, type CollectionSkuFlowDoc } from '@/lib/production/unified-sku-flow-store';

/** Идентификаторы этапов каталога — единая шкала завершённости артикула. */
export const WORKSHOP2_PIPELINE_STEP_IDS = COLLECTION_STEPS.map((s) => s.id);

export type Workshop2RunStatus = 'draft' | 'in_progress' | 'completed';

/** Число закрытых этапов, всего этапов и % по одному артикулу. */
export function skuPipelineStepProgress(
  doc: CollectionSkuFlowDoc,
  skuId: string,
  stepIds: readonly string[] = WORKSHOP2_PIPELINE_STEP_IDS
): { done: number; total: number; pct: number } {
  if (stepIds.length === 0) return { done: 0, total: 0, pct: 0 };
  let done = 0;
  for (const sid of stepIds) {
    if (isSkuStepDone(doc, skuId, sid)) done += 1;
  }
  const total = stepIds.length;
  return { done, total, pct: Math.round((done / total) * 100) };
}

/** Доля закрытых этапов (done/skipped) по каталогу, 0–100. */
export function skuPipelineCompletionPercent(
  doc: CollectionSkuFlowDoc,
  skuId: string,
  stepIds: readonly string[] = WORKSHOP2_PIPELINE_STEP_IDS
): number {
  return skuPipelineStepProgress(doc, skuId, stepIds).pct;
}

/**
 * Статус подборки и общий % (0–100): суммарная доля закрытых этапов по всем артикулам —
 * число пар (артикул × этап) в done/skipped, делённое на (число артикулов × число этапов).
 * Черновик — нет артикулов; завершена — закрыты все ячейки; иначе в работе.
 */
export function workshop2CollectionMetrics(
  doc: CollectionSkuFlowDoc,
  articleIds: readonly string[]
): { status: Workshop2RunStatus; progressPct: number; articleCount: number } {
  const n = articleIds.length;
  if (n === 0) {
    return { status: 'draft', progressPct: 0, articleCount: 0 };
  }
  const stepIds = WORKSHOP2_PIPELINE_STEP_IDS;
  const totalSlots = n * stepIds.length;
  let doneSlots = 0;
  for (const id of articleIds) {
    for (const sid of stepIds) {
      if (isSkuStepDone(doc, id, sid)) doneSlots += 1;
    }
  }
  const progressPct = totalSlots === 0 ? 0 : Math.round((doneSlots / totalSlots) * 100);
  const allComplete = progressPct === 100;
  return {
    status: allComplete ? 'completed' : 'in_progress',
    progressPct,
    articleCount: n,
  };
}
