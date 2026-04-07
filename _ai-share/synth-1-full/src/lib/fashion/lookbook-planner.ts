import type { Product } from '@/lib/types';
import type { LookbookProjectV1 } from './types';

/** Планирование съемок (Creative Lookbook Planning). */
export function createLookbookProject(product: Product): LookbookProjectV1 {
  const date = new Date();
  date.setDate(date.getDate() + 30);

  return {
    id: `LB-${product.id.slice(0, 4)}`,
    name: `Season ${product.season || 'SS26'} Main Campaign`,
    shootingDate: date.toISOString().split('T')[0],
    skus: [product.sku],
    location: product.attributes?.originCountry === 'Italy' ? 'Milan Studio' : 'Global Hub Studio',
    status: 'draft',
  };
}
