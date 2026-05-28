/**
 * Склад и остатки: движения bundle + связь с sample intake.
 */
import type { StockSnapshot } from '@/lib/production/article-workspace/types';
import type { Workshop2DossierPhase1 } from '@/lib/production/workshop2-dossier-phase1.types';

export type Workshop2StockBundleStatus = {
  movementCount: number;
  qtyOnHand: number;
  negativeBalance: boolean;
  hasOnHandNote: boolean;
  state: 'empty' | 'partial' | 'ready';
  hintRu?: string;
};

export function summarizeWorkshop2StockBundleStatus(input: {
  stock?: StockSnapshot | null;
  dossier?: Workshop2DossierPhase1 | null;
}): Workshop2StockBundleStatus {
  const movements = input.stock?.movements ?? [];
  let qtyOnHand = 0;
  for (const m of movements) {
    if (m.kind === 'in') qtyOnHand += Number(m.qty) || 0;
    else if (m.kind === 'out') qtyOnHand -= Number(m.qty) || 0;
  }

  const movementCount = movements.length;
  const negativeBalance = qtyOnHand < 0;
  const hasOnHandNote = Boolean(input.stock?.onHandNote?.trim());

  let state: Workshop2StockBundleStatus['state'] = 'empty';
  if (movementCount > 0 && qtyOnHand >= 0) state = 'ready';
  else if (movementCount > 0) state = 'partial';

  let hintRu: string | undefined;
  if (movementCount === 0) {
    hintRu = 'Нет складских движений — зафиксируйте приёмку образца или движение товара.';
  } else if (negativeBalance) {
    hintRu = `Отрицательный остаток (${qtyOnHand}) — проверьте списания и единицы измерения.`;
  } else if (qtyOnHand === 0) {
    hintRu = 'Движения есть, остаток 0 — уточните приход/расход или примечание к остатку.';
  } else if (!hasOnHandNote && movementCount < 2) {
    hintRu = 'Один движение — добавьте примечание к остатку для аудита WMS.';
  }

  return {
    movementCount,
    qtyOnHand,
    negativeBalance,
    hasOnHandNote,
    state,
    hintRu,
  };
}
