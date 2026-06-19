import 'server-only';

import type { CycleCountSession } from '@/lib/shop/cycle-counting';
import {
  buildShopInventoryReconcileRows,
  buildShopInventoryReconcileRowsFromAtp,
  type ShopInventoryReconcileRow,
} from '@/lib/platform/shop-inventory-reconcile';
import type { ReplenishmentStockAtpSource } from '@/lib/platform/shop-replenishment-stock-atp';
import { getShopReplenishmentStockAtpRows } from '@/lib/server/shop-replenishment-stock-atp-server';
import { shopInventoryLedgerAdjustStorageMode } from '@/lib/server/shop-inventory-ledger-adjust-repository';

export type ShopInventoryReconcileServerResult = {
  rows: ShopInventoryReconcileRow[];
  ledgerSource: ReplenishmentStockAtpSource;
  storageMode: ReturnType<typeof shopInventoryLedgerAdjustStorageMode>;
  messageRu: string;
};

/** PG-backed ledger ATP + cycle-count physical model for reconcile tab (P1). */
export async function getShopInventoryReconcileRows(input: {
  shopId?: string;
  collectionId?: string;
  cycleSessions?: CycleCountSession[];
  limit?: number;
}): Promise<ShopInventoryReconcileServerResult> {
  const shopId = input.shopId?.trim() || 'shop1';
  const limit = input.limit ?? 12;

  try {
    const atp = await getShopReplenishmentStockAtpRows({
      shopId,
      collectionId: input.collectionId,
      limit,
    });
    const rows = buildShopInventoryReconcileRowsFromAtp({
      atpRows: atp.rows,
      cycleSessions: input.cycleSessions,
    });
    return {
      rows,
      ledgerSource: atp.source,
      storageMode: shopInventoryLedgerAdjustStorageMode(),
      messageRu:
        atp.source === 'pg'
          ? `Reconcile: ledger ATP из PostgreSQL · ${rows.length} SKU.`
          : `Reconcile: ledger ${atp.source} · ${rows.length} SKU.`,
    };
  } catch {
    const rows = buildShopInventoryReconcileRows({
      cycleSessions: input.cycleSessions,
      limit,
    });
    return {
      rows,
      ledgerSource: 'demo',
      storageMode: shopInventoryLedgerAdjustStorageMode(),
      messageRu: 'Reconcile demo fallback — PG недоступен.',
    };
  }
}
