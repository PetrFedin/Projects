/** Normalize upstream row for spine batch import (unwrap `.raw`). */
export function toSpineImportOrderPayload(order: Record<string, unknown>): Record<string, unknown> {
  const nested = order.raw;
  if (nested && typeof nested === 'object' && !Array.isArray(nested)) {
    return { ...order, ...(nested as Record<string, unknown>) };
  }
  return order;
}

export function toSpineImportOrderPayloadList(
  orders: Array<Record<string, unknown>>
): Record<string, unknown>[] {
  return orders.map(toSpineImportOrderPayload);
}
