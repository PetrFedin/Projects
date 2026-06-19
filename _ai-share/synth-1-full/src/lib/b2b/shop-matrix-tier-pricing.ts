import type { BrandPricelistTierSyncRow } from '@/lib/b2b/brand-pricelist-tier-sync';
import { shopTierMultiplierFromSync } from '@/lib/b2b/brand-pricelist-tier-sync';
import { getPriceForTier, type PriceTierId } from '@/lib/b2b/price-tiers';

export function resolveShopMatrixUnitPrice(
  basePrice: number,
  tier: PriceTierId,
  syncedRows?: readonly BrandPricelistTierSyncRow[]
): { unitPrice: number; source: 'pg-tier-sync' | 'default-tier' } {
  const syncedMultiplier = syncedRows?.length
    ? shopTierMultiplierFromSync(syncedRows, tier)
    : undefined;
  if (syncedMultiplier != null) {
    return { unitPrice: Math.round(basePrice * syncedMultiplier), source: 'pg-tier-sync' };
  }
  return { unitPrice: getPriceForTier(basePrice, tier), source: 'default-tier' };
}
