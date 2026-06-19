/**
 * Единое правило merge для operational list: INT-* imported wholesale
 * перекрывает строку snapshot с тем же wholesaleOrderId (Wave C1 · SoT).
 */
import type { B2BOrder } from '@/lib/types';
import { isIntegrationImportedWholesaleOrderId } from './integration-ui-utils';

export function mergeOperationalOrderLists(
  snapshotOrders: B2BOrder[],
  importedOrders: B2BOrder[]
): B2BOrder[] {
  if (!importedOrders.length) return snapshotOrders;
  const byId = new Map(snapshotOrders.map((o) => [o.order, o]));
  for (const imported of importedOrders) {
    byId.set(imported.order, imported);
  }
  return [...byId.values()].sort((a, b) => b.date.localeCompare(a.date));
}

/** Snapshot не является SoT для INT-* — убираем перед merge с imported file. */
export function stripSpineImportedFromSnapshot(snapshotOrders: B2BOrder[]): B2BOrder[] {
  return snapshotOrders.filter((o) => !isIntegrationImportedWholesaleOrderId(o.order));
}

export function partitionOperationalOrders(orders: B2BOrder[]): {
  spineImported: B2BOrder[];
  workshopNative: B2BOrder[];
} {
  const spineImported: B2BOrder[] = [];
  const workshopNative: B2BOrder[] = [];
  for (const o of orders) {
    if (isIntegrationImportedWholesaleOrderId(o.order)) spineImported.push(o);
    else workshopNative.push(o);
  }
  return { spineImported, workshopNative };
}
