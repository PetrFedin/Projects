/**
 * M7.4: AQL orderQty из активного sample order.
 */
const TERMINAL = new Set(['cancelled', 'approved']);

export type Workshop2QcSampleOrderQtyInput = {
  id: string;
  status: string;
  quantity: number;
};

export function resolveWorkshop2QcAqlOrderQtyFromSampleOrder(
  order: Workshop2QcSampleOrderQtyInput | null | undefined
): { orderQty: number; qtySource: 'sample_order' | 'fallback'; hintRu?: string } {
  if (!order) {
    return {
      orderQty: 1,
      qtySource: 'fallback',
      hintRu: 'Нет активного заказа образца — AQL qty = 1 (fallback).',
    };
  }
  if (TERMINAL.has(order.status)) {
    return {
      orderQty: Math.max(1, order.quantity),
      qtySource: 'fallback',
      hintRu: `Заказ ${order.status} — qty из quantity без привязки AQL.`,
    };
  }
  const qty = Math.max(1, Math.round(order.quantity));
  return {
    orderQty: qty,
    qtySource: 'sample_order',
    hintRu: `AQL qty = ${qty} из заказа образца ${order.id.slice(0, 8)}…`,
  };
}
