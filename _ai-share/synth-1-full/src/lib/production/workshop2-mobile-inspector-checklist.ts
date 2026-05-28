/**
 * Чек-лист мобильного инспектора ОТК (PWA) — привязка к заказу образца и intake.
 */
import type { Workshop2DossierPhase1 } from '@/lib/production/workshop2-dossier-phase1.types';
import { validateSampleIntakeForCollection } from '@/lib/production/workshop2-sample-intake-gate';
import { getAqlPlan, type AqlLevel } from '@/lib/production/aql-standards';

export type Workshop2InspectorChecklistItem = {
  id: string;
  labelRu: string;
  required: boolean;
  done: boolean;
  hint?: string;
};

export function buildWorkshop2MobileInspectorChecklist(input: {
  dossier: Workshop2DossierPhase1 | null;
  sampleOrderId: string;
  orderQty?: number;
  aqlLevel?: AqlLevel;
  checkedIds?: string[];
}): Workshop2InspectorChecklistItem[] {
  const checked = new Set(input.checkedIds ?? []);
  const intake = validateSampleIntakeForCollection(input.dossier);
  const qty = Math.max(1, input.orderQty ?? 1);
  const aql = getAqlPlan(qty, input.aqlLevel ?? '2.5');

  const items: Workshop2InspectorChecklistItem[] = [
    {
      id: 'order_linked',
      labelRu: `Заказ образца ${input.sampleOrderId.slice(0, 8)} привязан`,
      required: true,
      done: Boolean(input.sampleOrderId.trim()),
    },
    {
      id: 'visual_sketch',
      labelRu: 'Визуальный осмотр по скетчу / конструкции',
      required: true,
      done: checked.has('visual_sketch'),
      hint: 'Сверка с досье: вкладка ТЗ → визуал',
    },
    {
      id: 'aql_sample',
      labelRu: `AQL: выборка ${aql.sampleSize} ед. (партия ${qty})`,
      required: true,
      done: checked.has('aql_sample'),
      hint: `Допуск мажор: ≤${aql.acceptLimit}, брак: ≥${aql.rejectLimit}`,
    },
    {
      id: 'measurements',
      labelRu: 'Ключевые мерки (POM) в допуске',
      required: true,
      done: checked.has('measurements'),
    },
    {
      id: 'gold_or_pending',
      labelRu: 'Эталон (gold sample)',
      required: false,
      done: input.dossier?.goldSampleStatus?.status === 'approved',
      hint:
        input.dossier?.goldSampleStatus?.status === 'approved'
          ? 'Утверждён'
          : 'После ОТК — утвердить на вкладке «Примерка»',
    },
    {
      id: 'intake_compliance',
      labelRu: 'Sample Intake / комплаенс',
      required: true,
      done: intake.ok,
      hint: intake.ok ? undefined : intake.missing.slice(0, 2).join(' · '),
    },
  ];

  return items;
}

export function workshop2InspectorChecklistProgress(items: Workshop2InspectorChecklistItem[]): {
  done: number;
  required: number;
  requiredDone: number;
  pct: number;
} {
  const required = items.filter((i) => i.required);
  const requiredDone = required.filter((i) => i.done).length;
  const done = items.filter((i) => i.done).length;
  const pct = items.length ? Math.round((done / items.length) * 100) : 0;
  return { done, required: required.length, requiredDone, pct };
}

/** URL мобильного инспектора (PWA-friendly). */
export function workshop2MobileInspectorHref(input: {
  collectionId: string;
  articleId: string;
  orderId: string;
}): string {
  const q = new URLSearchParams({
    c: input.collectionId.trim(),
    a: input.articleId.trim(),
  });
  return `/brand/production/workshop2/inspector/${encodeURIComponent(input.orderId)}?${q.toString()}`;
}
