/**
 * Operational read-model for INT-* orders: PG-primary → PG SoT, else file mirror.
 */
import 'server-only';

import type { B2BOrderLineItem } from '@/lib/order/b2b-order-payload';
import type { B2BOrder } from '@/lib/types';
import {
  getImportedLineItems,
  getImportedOrderRecord,
  listImportedOrdersAsB2B,
} from './imported-orders-persistence.file';
import type { ImportedOperationalOrderRecord } from './imported-orders-persistence.file';
import {
  getSpineImportedOrderRecordFromPg,
  listSpineImportedOrdersFromPg,
} from './imported-orders-persistence.pg';
import {
  ensureSpineOperationalStoreReady,
  isSpineOperationalPgEnabled,
} from './spine-operational-store';
import { isSpineOperationalPgPrimary } from './spine-pg-hydrate-guards';

async function shouldReadImportedOrdersFromPg(): Promise<boolean> {
  return isSpineOperationalPgPrimary() && isSpineOperationalPgEnabled();
}

export async function listImportedOrdersForOperationalUi(): Promise<B2BOrder[]> {
  if (!(await shouldReadImportedOrdersFromPg())) {
    return listImportedOrdersAsB2B();
  }
  await ensureSpineOperationalStoreReady(['imported_orders']);
  const rows = await listSpineImportedOrdersFromPg();
  return rows.map((r) => r.record.order);
}

export async function getImportedOrderRecordForOperationalUi(
  wholesaleOrderId: string
): Promise<ImportedOperationalOrderRecord | undefined> {
  const id = wholesaleOrderId.trim();
  if (!id) return undefined;
  if (await shouldReadImportedOrdersFromPg()) {
    await ensureSpineOperationalStoreReady(['imported_orders']);
    return getSpineImportedOrderRecordFromPg(id);
  }
  return getImportedOrderRecord(id);
}

export async function getImportedLineItemsForOperationalUi(
  wholesaleOrderId: string
): Promise<B2BOrderLineItem[] | undefined> {
  const rec = await getImportedOrderRecordForOperationalUi(wholesaleOrderId);
  if (rec?.lineItems?.length) return rec.lineItems;
  return getImportedLineItems(wholesaleOrderId);
}
