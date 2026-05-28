import type { Product } from '@/lib/types';
import type { SizeAffinityV1 } from './types';

/** Маппинг размеров между брендами на основе фидбека (Size Affinity). */
export function calculateSizeAffinity(brand: string, userBaseSize: string): SizeAffinityV1[] {
  const brands = ['Syntha Lab', 'Nordic Wool', 'Urban Tech', 'Heritage Denim'];

  return brands
    .filter((b) => b !== brand)
    .map((b) => {
      // Демо-логика: Urban Tech маломерит, Nordic большемерит
      let rec = userBaseSize;
      if (b === 'Urban Tech' && userBaseSize === 'M') rec = 'L';
      if (b === 'Nordic Wool' && userBaseSize === 'M') rec = 'S';

      return {
        brand: b,
        affinityScore: 85 + (b.length % 10),
        recommendedSize: rec,
      };
    });
}
