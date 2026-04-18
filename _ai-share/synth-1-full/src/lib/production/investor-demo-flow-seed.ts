/**
 * Демо-пайплайн для инвесторов: 2 артикула на брифе, 1 — на 5-м шаге цепочки (материалы / BOM).
 * Сид применяется только если по всем этапам у этих SKU ещё «не начато».
 */

import { COLLECTION_STEPS } from '@/lib/production/collection-steps-catalog';
import {
  patchSkuStage,
  type CollectionSkuFlowDoc,
  type SkuStageDetail,
} from '@/lib/production/unified-sku-flow-store';

/** Минимальные поля под чеклист обязательных данных, чтобы демо не «перепрыгивало» этапы без заполнения. */
const INVESTOR_DEMO_MINIMAL_PRE_MATERIALS: Partial<Record<string, Partial<SkuStageDetail>>> = {
  brief: {
    assignee: 'Демо · коллекция',
    notes: 'Демо: бриф и цели сезона зафиксированы для показа контура.',
  },
  'assortment-map': {
    assignee: 'Демо · PIM',
    outputs: [{ kind: 'Карта SKU', ref: 'demo-assortment-map' }],
  },
  'collection-hub': {
    assignee: 'Демо · цех',
    notes: 'Демо: хаб коллекции, артикул в перечне.',
  },
  costing: {
    assignee: 'Демо · финансы',
    costLines: [{ label: 'Landed cost (оценка)', amountRub: 2400, paid: false }],
    approvals: [{ role: 'Финансы', name: 'Демо-согласование', at: '2025-03-01T10:00' }],
  },
};

export const INVESTOR_DEMO_ARTICLE_IDS = ['demo-ss27-01', 'demo-ss27-02', 'demo-ss27-03'] as const;

const ORDERED_STEP_IDS = COLLECTION_STEPS.map((s) => s.id);

function indexOfStep(stepId: string): number {
  const i = ORDERED_STEP_IDS.indexOf(stepId);
  return i >= 0 ? i : 0;
}

/** Все переданные SKU есть в doc и каждый этап — strictly not_started */
export function investorDemoFlowIsPristine(
  doc: CollectionSkuFlowDoc,
  skuIds: readonly string[],
  stepIds: readonly string[]
): boolean {
  if (skuIds.length !== INVESTOR_DEMO_ARTICLE_IDS.length) return false;
  const want = new Set(INVESTOR_DEMO_ARTICLE_IDS);
  if (!skuIds.every((id) => want.has(id as (typeof INVESTOR_DEMO_ARTICLE_IDS)[number])))
    return false;
  for (const skuId of skuIds) {
    const entry = doc.skus[skuId];
    if (!entry) return false;
    for (const sid of stepIds) {
      const st = entry.stages[sid]?.status ?? 'not_started';
      if (st !== 'not_started') return false;
    }
  }
  return true;
}

function markDoneThroughIndex(
  doc: CollectionSkuFlowDoc,
  skuId: string,
  endExclusiveIndex: number
): CollectionSkuFlowDoc {
  let d = doc;
  for (let i = 0; i < endExclusiveIndex; i++) {
    const sid = ORDERED_STEP_IDS[i];
    d = patchSkuStage(d, skuId, sid, { status: 'done' });
  }
  return d;
}

/**
 * 1 и 2 — бриф коллекции в работе.
 * 3 — шаги до «Материалы» закрыты (бриф → карта SKU → хаб → себестоимость), текущий этап «Материалы» (индекс из COLLECTION_STEPS).
 */
/** Вызывать после ensureSkuStages по каждому SKU. */
export function buildInvestorDemoFlowDoc(base: CollectionSkuFlowDoc): CollectionSkuFlowDoc {
  let d = base;

  const [sku1, sku2, sku3] = INVESTOR_DEMO_ARTICLE_IDS;

  d = patchSkuStage(d, sku1, 'brief', {
    status: 'in_progress',
    assignee: 'Е. Волкова',
    notes: 'Сбор целей сезона SS27 и ограничений по марже',
  });
  d = patchSkuStage(d, sku2, 'brief', {
    status: 'in_progress',
    assignee: 'Д. Никитин',
    notes: 'Черновик брифа: аудитория и настроение коллекции',
  });

  const materialsIdx = indexOfStep('materials');
  d = markDoneThroughIndex(d, sku3, materialsIdx);
  for (let i = 0; i < materialsIdx; i++) {
    const sid = ORDERED_STEP_IDS[i];
    const minimal = INVESTOR_DEMO_MINIMAL_PRE_MATERIALS[sid];
    if (minimal) {
      d = patchSkuStage(d, sku3, sid, minimal);
    }
  }
  d = patchSkuStage(d, sku3, 'materials', {
    status: 'in_progress',
    assignee: 'Закупка · материалы',
    notes: 'RFQ по основной ткани, сравнение 2 поставщиков + сток бренда',
  });

  return d;
}
