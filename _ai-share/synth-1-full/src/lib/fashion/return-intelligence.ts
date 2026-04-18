import type { Product } from '@/lib/types';
import type { FitSentimentV1 } from './types';

/** Генерирует "мнение покупателей" о посадке (демо-NLP данных возвратов). */
export function getFitSentiment(product: Product): FitSentimentV1 {
  const skuHash = product.sku.split('').reduce((a, b) => a + b.charCodeAt(0), 0);

  // Deterministic mock based on SKU
  const overall: FitSentimentV1['overall'] =
    skuHash % 5 === 0 ? 'small' : skuHash % 7 === 0 ? 'large' : 'true';

  const returnRate = (skuHash % 15) + 5; // 5-20%
  const confidence = 75 + (skuHash % 20); // 75-95%

  const complaints: string[] = [];
  if (overall === 'small') complaints.push('Маломерит в плечах', 'Узкие рукава');
  if (overall === 'large') complaints.push('Слишком длинный', 'Свободно в талии');
  if (returnRate > 15) complaints.push('Ткань мнется', 'Цвет бледнее, чем на фото');

  return {
    overall,
    confidence,
    returnRate,
    topComplaints: complaints.slice(0, 2),
  };
}
