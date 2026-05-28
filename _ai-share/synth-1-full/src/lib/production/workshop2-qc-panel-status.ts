/**
 * Панель ОТК: партии, заказ образца, deep-link инспектора.
 */
export type Workshop2QcPanelStatus = {
  batchCount: number;
  pendingBatchCount: number;
  hasSampleOrder: boolean;
  hasInspectorLink: boolean;
  supplierResolved: boolean;
  state: 'empty' | 'partial' | 'ready';
  hintRu?: string;
};

export function summarizeWorkshop2QcPanelStatus(input: {
  batchCount: number;
  pendingBatchCount: number;
  hasSampleOrder: boolean;
  hasInspectorLink: boolean;
  supplierResolved: boolean;
}): Workshop2QcPanelStatus {
  let state: Workshop2QcPanelStatus['state'] = 'empty';
  if (input.batchCount > 0) {
    state =
      input.hasSampleOrder && input.hasInspectorLink && input.supplierResolved
        ? 'ready'
        : 'partial';
  } else if (input.hasSampleOrder) {
    state = 'partial';
  }

  let hintRu: string | undefined;
  if (input.batchCount === 0) {
    hintRu = 'Партий QC нет — создайте партию или дождитесь приёмки образца.';
  } else if (!input.hasSampleOrder) {
    hintRu = 'Нет активного sample-order — мобильный инспектор и AQL без привязки к заказу.';
  } else if (!input.hasInspectorLink) {
    hintRu = 'Ссылка на мобильный инспектор недоступна — проверьте sample-order API.';
  } else if (!input.supplierResolved) {
    hintRu = 'Поставщик для scorecard не определён — укажите supplierId в bundle PO.';
  } else if (input.pendingBatchCount > 0) {
    hintRu = `${input.pendingBatchCount} партий в статусе pending — завершите инспекцию.`;
  }

  return {
    batchCount: input.batchCount,
    pendingBatchCount: input.pendingBatchCount,
    hasSampleOrder: input.hasSampleOrder,
    hasInspectorLink: input.hasInspectorLink,
    supplierResolved: input.supplierResolved,
    state,
    hintRu,
  };
}
