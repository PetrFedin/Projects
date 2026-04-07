import type { Product } from '@/lib/types';
import type { ProductHeritageV1 } from './types';

/** Извлекает сторителлинг и культурные коды из атрибутов (Heritage). */
export function getProductHeritage(product: Product): ProductHeritageV1 {
  const a = product.attributes ?? {};
  
  return {
    storyHeadline: typeof a.heritageHeadline === 'string' ? a.heritageHeadline : 'Crafted with purpose',
    artisanNote: typeof a.artisanNote === 'string' ? a.artisanNote : undefined,
    archiveReference: typeof a.archiveRef === 'string' ? a.archiveRef : undefined,
    sustainabilityHigh: product.sustainability.length > 2,
  };
}
