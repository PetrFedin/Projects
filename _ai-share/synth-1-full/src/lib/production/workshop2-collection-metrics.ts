import { COLLECTION_STEPS } from '@/lib/production/collection-steps-catalog';
import type { Workshop2TzSignoffStageId } from '@/lib/production/workshop2-dossier-phase1.types';
import { isSkuStepDone, type CollectionSkuFlowDoc } from '@/lib/production/unified-sku-flow-store';

/**
 * Соответствие «матрица коллекции ↔ карточка SKU в разработке коллекции» (обзорно):
 * - Этапы каталога до `supply-path` (в т.ч. `tech-pack`, `gate-all-stakeholders`) на мини-шкале — левая часть;
 *   в досье это закрывается вкладками «Обзор» и «ТЗ» (подписи и готовность = согласование сторон без отдельной вкладки).
 * - С этапа `supply-path` и далее (в каталоге — `samples`, производство…) — правая часть шкалы;
 *   в карточке — «Снабжение» и следующие вкладки. Этап каталога `samples` (отшив образца) распределён между этими
 *   вкладками и инструментами пола (fit, gold, sample), см. `COLLECTION_STEPS` и `workshop2-development-scope.ts`.
 * Полная таблица «этап → вкладка» и handoff в серию — `workshop2-core1-stage-routing.ts`.
 */
/** Идентификаторы этапов каталога — единая шкала завершённости артикула. */
export const WORKSHOP2_PIPELINE_STEP_IDS = COLLECTION_STEPS.map((s) => s.id);

/**
 * Индекс первого этапа контура «сэмплы и дальше» (с `supply-path`) в шкале каталога.
 * Этапы с меньшим индексом относят к разработке и ТЗ; при отсутствии id — вся шкала без разделителя.
 */
export const WORKSHOP2_PIPELINE_SAMPLES_LANE_START_INDEX = (() => {
  const i = WORKSHOP2_PIPELINE_STEP_IDS.indexOf('supply-path');
  return i === -1 ? WORKSHOP2_PIPELINE_STEP_IDS.length : i;
})();

/** Контур на шкале каталога артикула в разработке коллекции: ТЗ и разработка vs сэмплы и выпуск. */
export type Workshop2PipelineLane = 'development' | 'samples';

/** Краткая подпись контура для бейджей, `aria-label` и подсказок. */
export function workshop2PipelineLaneLabelRu(lane: Workshop2PipelineLane): string {
  return lane === 'development' ? 'Разработка' : 'Сэмплы';
}

/**
 * Определяет контур для id этапа: индексы до {@link WORKSHOP2_PIPELINE_SAMPLES_LANE_START_INDEX} —
 * разработка и ТЗ; с этапа `supply-path` и далее — сэмплы и выпуск.
 */
export function workshop2PipelineLaneForStepId(stepId: string): Workshop2PipelineLane {
  if (!stepId) return 'development';
  const i = WORKSHOP2_PIPELINE_STEP_IDS.indexOf(stepId);
  if (i === -1) return 'development';
  return i < WORKSHOP2_PIPELINE_SAMPLES_LANE_START_INDEX ? 'development' : 'samples';
}

/**
 * Вкладки воркспейса артикула в разработке коллекции (обзор, ТЗ и операционные этапы).
 * Совпадает с `MainTab` в `Workshop2ArticleWorkspace`.
 */
export type Workshop2ArticleMainTab =
  | 'overview'
  | 'tz'
  | 'supply'
  | 'fit'
  | 'plan'
  | 'release'
  | 'qc'
  | 'stock';

/**
 * Контур вкладки или плитки маршрута в карточке SKU: обзор и ТЗ — разработка;
 * снабжение и далее — сэмплы. Согласовано с разделителем мини-шкалы в списке коллекции
 * (якорь каталога `supply-path`).
 */
export function workshop2PipelineLaneForArticleMainTab(
  tab: Workshop2ArticleMainTab
): Workshop2PipelineLane {
  return tab === 'overview' || tab === 'tz' ? 'development' : 'samples';
}

/**
 * Контур этапа для цифровой подписи в паспорте SKU: `tz` и `sample` (обзор) — разработка;
 * снабжение, посадка, план, выпуск, ОТК — сэмплы (согласовано с группой «Сэмплы и выпуск» в маршруте).
 */
export function workshop2PipelineLaneForTzSignoffStage(
  stage: Workshop2TzSignoffStageId
): Workshop2PipelineLane {
  return stage === 'tz' || stage === 'sample' ? 'development' : 'samples';
}

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
