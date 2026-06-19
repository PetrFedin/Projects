import type { CartItem } from '@/lib/types';

import type { PriceTierId } from '@/lib/b2b/price-tiers';
import { resolveShopMatrixUnitPrice } from '@/lib/b2b/shop-matrix-tier-pricing';
import type { BrandPricelistTierSyncRow } from '@/lib/b2b/brand-pricelist-tier-sync';

export type Workshop2CartTier = 'standard' | 'vip' | 'prebook';

/** Метаданные сессии W2-корзины (partner tier), не путать с PriceTierId. */
export function mapPriceTierToWorkshop2CartTier(tier: PriceTierId): Workshop2CartTier {
  if (tier === 'outlet') return 'vip';
  return 'standard';
}

export function applyShopMatrixTierToCartItem(
  item: CartItem,
  tier: PriceTierId,
  syncedRows?: readonly BrandPricelistTierSyncRow[]
): CartItem {
  const base = item.price ?? 0;
  const { unitPrice } = resolveShopMatrixUnitPrice(base, tier, syncedRows);
  const ext = item as CartItem & { wholesalePriceRub?: number };
  return {
    ...item,
    price: unitPrice,
    wholesalePriceRub: unitPrice,
    ...(ext.originalPrice == null && base > 0 ? { originalPrice: base } : {}),
  } as CartItem;
}
