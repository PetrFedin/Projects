import type { ShopInventoryReconcileRow } from '@/lib/platform/shop-inventory-reconcile';
import type { ReplenishmentStockAtpSource } from '@/lib/platform/shop-replenishment-stock-atp';

export async function fetchShopInventoryLedgerFeed(input?: {
  collectionId?: string;
  shopId?: string;
  limit?: number;
}): Promise<{
  ok: boolean;
  rows: ShopInventoryReconcileRow[];
  ledgerSource: ReplenishmentStockAtpSource;
  storageMode?: string;
  messageRu?: string;
}> {
  const params = new URLSearchParams();
  params.set('shopId', input?.shopId?.trim() || 'shop1');
  if (input?.collectionId?.trim()) params.set('collection', input.collectionId.trim());
  if (input?.limit) params.set('limit', String(input.limit));

  const res = await fetch(`/api/shop/inventory/reconcile/rows?${params.toString()}`, {
    cache: 'no-store',
  });
  const json = (await res.json()) as {
    ok?: boolean;
    rows?: ShopInventoryReconcileRow[];
    ledgerSource?: ReplenishmentStockAtpSource;
    storageMode?: string;
    messageRu?: string;
  };
  if (!res.ok || !json.ok) {
    return { ok: false, rows: [], ledgerSource: 'demo' };
  }
  return {
    ok: true,
    rows: json.rows ?? [],
    ledgerSource: json.ledgerSource ?? 'demo',
    storageMode: json.storageMode,
    messageRu: json.messageRu,
  };
}
