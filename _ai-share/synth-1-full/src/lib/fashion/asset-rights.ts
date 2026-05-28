import type { Product } from '@/lib/types';
import type { AssetCreditsV1 } from './types';

/** Извлечение данных о талантах и правах из атрибутов медиа. */
export function getAssetCredits(product: Product): AssetCreditsV1 {
  const a = product.attributes ?? {};

  return {
    photographer: typeof a.photographer === 'string' ? a.photographer : undefined,
    modelName: typeof a.modelName === 'string' ? a.modelName : undefined,
    modelInstagram: typeof a.modelInstagram === 'string' ? a.modelInstagram : undefined,
    usageUntil: typeof a.rightsExpiry === 'string' ? a.rightsExpiry : undefined,
    location: typeof a.shootLocation === 'string' ? a.shootLocation : undefined,
  };
}

export function isAssetUsageValid(credits: AssetCreditsV1): boolean {
  if (!credits.usageUntil) return true;
  return new Date(credits.usageUntil) > new Date();
}
