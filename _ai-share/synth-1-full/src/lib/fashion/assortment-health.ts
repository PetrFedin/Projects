import type { Product } from '@/lib/types';
import type { AssortmentHealthV1 } from './types';

/** Анализ здоровья ассортимента (Merchandising Health). */
export function analyzeAssortmentHealth(products: Product[] = [], category: string): AssortmentHealthV1 {
  const catProducts = (products || []).filter(p => p.category === category);
  const colors = new Set(catProducts.map(p => p.attributes?.mainColor));
  
  const colorScore = Math.min(100, colors.size * 20);
  const marginScore = 85 + (catProducts.length % 10);
  
  const recommendations = [];
  if (colors.size < 3) recommendations.push('Add more color variance to the core mix.');
  if (catProducts.length < 5) recommendations.push('Category under-represented. Add 2-3 more depth options.');

  return {
    category,
    colorBalance: colorScore,
    sizeAvailability: 92, // Mock score
    marginHealth: marginScore,
    recommendations,
  };
}
