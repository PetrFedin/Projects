import type { Product } from '@/lib/types';
import type { ResaleEstimateV1 } from './types';

/** Оценивает стоимость перепродажи и эко-эффект (Circular Economy). */
export function estimateResaleValue(product: Product): ResaleEstimateV1 {
  const basePrice = product.price;
  const isPremium = product.brand.toLowerCase().includes('nordic') || product.brand.toLowerCase().includes('lab');
  
  // Эвристика: 40-60% от ритейла для идеального состояния
  const multiplier = isPremium ? 0.6 : 0.45;
  const val = Math.round(basePrice * multiplier);

  return {
    estimatedValue: val,
    conditionGrades: {
      'Like New': val,
      'Excellent': Math.round(val * 0.8),
      'Good': Math.round(val * 0.6),
    },
    carbonSavedKg: isPremium ? 12.5 : 8.2, // Демо-константы
    demandLevel: isPremium ? 'high' : 'medium',
  };
}
