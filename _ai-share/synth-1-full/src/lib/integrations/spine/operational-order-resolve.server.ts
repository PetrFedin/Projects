/**
 * Resolve operational B2B order: INT-* → imported file (SoT), иначе snapshot merge list.
 */
import 'server-only';

import type { B2BOrder } from '@/lib/types';
import { getOperationalStatusRecord } from '@/lib/order/b2b-operational-status-persistence.file';
import { getImportedOrderRecord } from './imported-orders-persistence';
import { getImportedOrderRecordForOperationalUi } from './imported-orders-read.server';
import { isIntegrationImportedWholesaleOrderId } from './integration-ui-utils';

function applyStatusOverlay(order: B2BOrder): B2BOrder {
  const statusRec = getOperationalStatusRecord(order.order);
  if (!statusRec) return order;
  return { ...order, status: statusRec.status };
}

/** INT-* только из imported file; snapshot/W2 не используются как fallback. */
export function resolveSpineImportedOperationalOrder(orderId: string): B2BOrder | null {
  const id = orderId.trim();
  if (!isIntegrationImportedWholesaleOrderId(id)) return null;
  const rec = getImportedOrderRecord(id);
  if (!rec) return null;
  return applyStatusOverlay(rec.order);
}

/** PG-primary: INT-* из PG (file mirror пуст при SPINE_OPERATIONAL_PG_PRIMARY=1). */
export async function resolveSpineImportedOperationalOrderAsync(
  orderId: string
): Promise<B2BOrder | null> {
  const id = orderId.trim();
  if (!isIntegrationImportedWholesaleOrderId(id)) return null;
  const rec = await getImportedOrderRecordForOperationalUi(id);
  if (!rec) return null;
  return applyStatusOverlay(rec.order);
}
