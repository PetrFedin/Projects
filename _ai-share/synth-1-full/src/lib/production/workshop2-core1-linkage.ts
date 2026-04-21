/**
 * Ядро №1: сквозная связка данных «артикул × этап каталога × выходы матрицы × PO в карточке».
 * Канонические значения `SkuStageDetail.outputs[].kind` для согласования с матрицей и полом цеха.
 */

import { COLLECTION_STEPS } from '@/lib/production/collection-steps-catalog';
import {
  getSeriesHandoffMissingSteps,
  isSeriesHandoffReadyForSku,
} from '@/lib/production/workshop2-core1-stage-routing';
import type { ArticleWorkspaceBundle } from '@/lib/production/article-workspace/types';
import {
  ensureSkuStages,
  patchSkuStage,
  type CollectionSkuFlowDoc,
} from '@/lib/production/unified-sku-flow-store';

/** Ссылка на PO / номер заказа в матрице этапов (unified flow). */
export const CORE1_FLOW_OUTPUT_KIND_PO = 'po';

/** Партия / смена на полу — этап `floor-execution`. */
export const CORE1_FLOW_OUTPUT_KIND_FLOOR_BATCH = 'floor_batch';

/** Контрольная точка ОТК — этап `qc`. */
export const CORE1_FLOW_OUTPUT_KIND_QC_INSPECTION = 'qc_inspection';

const COLLECTION_TITLE_BY_ID = new Map(COLLECTION_STEPS.map((s) => [s.id, s.title] as const));

const COLLECTION_STEP_IDS = COLLECTION_STEPS.map((s) => s.id);

/**
 * Уникальные ref для матрицы: id PO в бандле, иначе подпись (если id пустой).
 */
export function collectBundlePoRefsForMatrix(bundle: ArticleWorkspaceBundle | null | undefined): string[] {
  const pos = bundle?.planPo?.purchaseOrders ?? [];
  const out: string[] = [];
  for (const p of pos) {
    const r = (p.id?.trim() || p.label?.trim()) ?? '';
    if (r) out.push(r);
  }
  return [...new Set(out)];
}

export type ApplyBundlePoRefsResult = {
  doc: CollectionSkuFlowDoc;
  /** Ref, добавленные на этап `po` (не было в outputs.kind=po). */
  addedRefs: string[];
};

/**
 * Добавляет в unified flow на этап каталога `po` выходы `outputs[].kind=po` по строкам из бандла «План · PO».
 * Не удаляет и не перезаписывает уже введённые ref; идемпотентно по строке ref.
 */
export function applyBundlePoRefsToUnifiedFlowPoStep(
  doc: CollectionSkuFlowDoc,
  skuId: string,
  bundle: ArticleWorkspaceBundle | null | undefined
): ApplyBundlePoRefsResult {
  const want = collectBundlePoRefsForMatrix(bundle);
  if (want.length === 0) return { doc, addedRefs: [] };

  let d = ensureSkuStages(doc, skuId, doc.skus[skuId]?.label ?? skuId, COLLECTION_STEP_IDS);
  const prev = d.skus[skuId]?.stages.po?.outputs ?? [];
  const existing = new Set(
    prev
      .filter((o) => o.kind === CORE1_FLOW_OUTPUT_KIND_PO)
      .map((o) => o.ref.trim())
      .filter(Boolean)
  );
  const addedRefs = want.filter((r) => !existing.has(r));
  if (addedRefs.length === 0) return { doc: d, addedRefs: [] };

  const outputs = [...prev, ...addedRefs.map((ref) => ({ kind: CORE1_FLOW_OUTPUT_KIND_PO, ref }))];
  d = patchSkuStage(d, skuId, 'po', {
    outputs,
    updatedBy: 'core1: bundle→matrix',
  });
  return { doc: d, addedRefs };
}

export function getSkuStageOutputRefsForKind(
  doc: CollectionSkuFlowDoc,
  skuId: string,
  stepId: string,
  kind: string
): string[] {
  const outs = doc.skus[skuId]?.stages[stepId]?.outputs ?? [];
  return outs.filter((o) => o.kind === kind).map((o) => o.ref.trim()).filter(Boolean);
}

/** Грубое сопоставление ref из матрицы с id/подписью PO в бандле артикула. */
export function matrixPoOutputsAlignWithBundlePos(
  matrixPoRefs: readonly string[],
  bundle: ArticleWorkspaceBundle | null | undefined
): boolean {
  const pos = bundle?.planPo?.purchaseOrders ?? [];
  if (pos.length === 0 || matrixPoRefs.length === 0) return false;
  return matrixPoRefs.some((ref) =>
    pos.some(
      (p) =>
        ref === p.id ||
        ref === p.label ||
        p.label.includes(ref) ||
        ref.includes(p.id) ||
        ref.includes(p.label)
    )
  );
}

export type Core1PlanTabBridgeState = {
  /** Все предпосылки `production-window` закрыты в матрице. */
  seriesHandoffReady: boolean;
  missingPrerequisiteStepIds: string[];
  missingPrerequisiteTitles: string[];
  /** Выходы `outputs.kind=po` на этапе каталога `po`. */
  matrixPoOutputRefs: string[];
  bundlePurchaseOrderCount: number;
  /** Есть и PO в бандле, и ref в матрице, и они сопоставимы по строке. */
  poBundleAlignedWithMatrix: boolean;
};

/**
 * Сводка для вкладки «План» карточки артикула: матрица коллекции ↔ локальные PO.
 * `bundle` — снимок `ArticleWorkspaceBundle` (черновики PO в разработке коллекции).
 */
export function buildCore1PlanTabBridgeState(
  doc: CollectionSkuFlowDoc,
  skuId: string,
  bundle: ArticleWorkspaceBundle | null | undefined
): Core1PlanTabBridgeState {
  const missingIds = getSeriesHandoffMissingSteps(doc, skuId);
  const matrixPoRefs = getSkuStageOutputRefsForKind(doc, skuId, 'po', CORE1_FLOW_OUTPUT_KIND_PO);
  const bundleCount = bundle?.planPo?.purchaseOrders?.length ?? 0;
  const aligned = matrixPoOutputsAlignWithBundlePos(matrixPoRefs, bundle);

  return {
    seriesHandoffReady: isSeriesHandoffReadyForSku(doc, skuId),
    missingPrerequisiteStepIds: [...missingIds],
    missingPrerequisiteTitles: missingIds.map((id) => COLLECTION_TITLE_BY_ID.get(id) ?? id),
    matrixPoOutputRefs: [...matrixPoRefs],
    bundlePurchaseOrderCount: bundleCount,
    poBundleAlignedWithMatrix: aligned,
  };
}
