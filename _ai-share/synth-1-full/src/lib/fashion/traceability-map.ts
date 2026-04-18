import type { Product } from '@/lib/types';
import type { SupplyChainTierV1 } from './types';

/** Извлечение полной цепочки прослеживаемости (Tier 1-3). */
export function getSupplyChainTiers(product: Product): SupplyChainTierV1[] {
  const a = product.attributes ?? {};

  const tiers: SupplyChainTierV1[] = [
    {
      tier: 1,
      name: 'Main Assembly Factory',
      location: a.originCountry || 'China',
      role: 'assembly',
    },
  ];

  // Демо-данные для прослеживаемости
  if (product.category === 'Top' || product.category === 'Dress') {
    tiers.push({
      tier: 2,
      name: 'Jiangsu Textile Mill',
      location: 'China',
      role: 'fabric',
      certification: 'OEKO-TEX',
    });
    tiers.push({
      tier: 3,
      name: 'Sichuan Raw Cotton Co.',
      location: 'China',
      role: 'raw_material',
      certification: 'BCI Cotton',
    });
  } else {
    tiers.push({
      tier: 2,
      name: 'European Fabric Lab',
      location: 'Italy',
      role: 'fabric',
      certification: 'GOTS',
    });
    tiers.push({ tier: 3, name: 'Global Yarn Hub', location: 'Turkey', role: 'yarn' });
  }

  return tiers;
}
