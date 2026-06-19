import type { PriceTierId } from '@/lib/b2b/price-tiers';

export type BrandPricelistTierSyncRow = {
  tierId: PriceTierId;
  priceListId: string;
  priceListName: string;
  multiplier: number;
  shopSynced: boolean;
  syncedAt?: string;
  collectionId: string;
};

export type BrandPricelistTierSyncStorageMode = 'pg' | 'file' | 'memory' | 'demo';

export function summarizeBrandPricelistTierSync(rows: readonly BrandPricelistTierSyncRow[]): {
  total: number;
  synced: number;
  pending: number;
} {
  const synced = rows.filter((row) => row.shopSynced).length;
  return { total: rows.length, synced, pending: rows.length - synced };
}

export function shopTierMultiplierFromSync(
  rows: readonly BrandPricelistTierSyncRow[],
  tierId: PriceTierId
): number | undefined {
  const row = rows.find((r) => r.tierId === tierId && r.shopSynced);
  return row?.multiplier;
}
