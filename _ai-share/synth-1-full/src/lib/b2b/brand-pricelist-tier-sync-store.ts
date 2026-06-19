import type { PriceTierId } from '@/lib/b2b/price-tiers';
import type { BrandPricelistTierSyncRow } from '@/lib/b2b/brand-pricelist-tier-sync';

export type BrandPricelistTierSyncResponse = {
  ok: boolean;
  collectionId?: string;
  rows?: BrandPricelistTierSyncRow[];
  summary?: { total: number; synced: number; pending: number };
  storageMode?: 'pg' | 'file' | 'memory' | 'demo';
};

export async function fetchBrandPricelistTierSync(
  collectionId?: string
): Promise<BrandPricelistTierSyncResponse> {
  const params = new URLSearchParams();
  if (collectionId?.trim()) params.set('collectionId', collectionId.trim());
  const res = await fetch(`/api/brand/b2b/pricelist/tier-sync?${params.toString()}`, {
    cache: 'no-store',
  });
  const json = (await res.json()) as BrandPricelistTierSyncResponse;
  if (!res.ok || !json.ok) return { ok: false, rows: [] };
  return json;
}

export async function fetchShopPricelistTierSync(
  collectionId?: string
): Promise<BrandPricelistTierSyncResponse> {
  const params = new URLSearchParams();
  if (collectionId?.trim()) params.set('collectionId', collectionId.trim());
  const res = await fetch(`/api/shop/b2b/pricelist/tier-sync?${params.toString()}`, {
    cache: 'no-store',
  });
  const json = (await res.json()) as BrandPricelistTierSyncResponse;
  if (!res.ok || !json.ok) return { ok: false, rows: [] };
  return json;
}

export async function pushBrandPricelistTierSync(input: {
  collectionId: string;
  tierId: PriceTierId;
}): Promise<BrandPricelistTierSyncResponse> {
  const res = await fetch('/api/brand/b2b/pricelist/tier-sync', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(input),
  });
  const json = (await res.json()) as BrandPricelistTierSyncResponse;
  if (!res.ok || !json.ok) return { ok: false };
  return json;
}
