import type { ReplenishmentStockSlice } from '@/lib/platform/shop-replenishment-stock-slices';

export async function fetchShopReplenishmentStockSlice(
  buyerId = 'shop1'
): Promise<{ slice: ReplenishmentStockSlice | null; storageMode?: string }> {
  const res = await fetch(
    `/api/shop/b2b/replenishment/stock-slice?buyerId=${encodeURIComponent(buyerId)}`,
    { cache: 'no-store' }
  );
  const json = (await res.json()) as {
    ok?: boolean;
    slice?: ReplenishmentStockSlice & { buyerId?: string; updatedAt?: string };
    storageMode?: string;
  };
  if (!res.ok || !json.ok || !json.slice) return { slice: null, storageMode: json.storageMode };
  return {
    slice: {
      orgId: json.slice.orgId,
      seasonId: json.slice.seasonId,
      collectionId: json.slice.collectionId,
      labelRu: json.slice.labelRu,
    },
    storageMode: json.storageMode,
  };
}

export async function saveShopReplenishmentStockSlice(
  slice: ReplenishmentStockSlice,
  buyerId = 'shop1'
): Promise<{ ok: boolean; storageMode?: string; messageRu?: string }> {
  const res = await fetch('/api/shop/b2b/replenishment/stock-slice', {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ buyerId, ...slice }),
  });
  const json = (await res.json()) as { ok?: boolean; storageMode?: string; messageRu?: string };
  return {
    ok: res.ok && json.ok === true,
    storageMode: json.storageMode,
    messageRu: json.messageRu,
  };
}
