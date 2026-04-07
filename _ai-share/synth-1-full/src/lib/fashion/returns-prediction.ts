import type { Product } from '@/lib/types';
import type { ReturnPredictionV1 } from './types';

/** Прогнозирование вероятности возврата (AI-heuristic). */
export function predictReturnRisk(product: Product): ReturnPredictionV1 {
  let risk = 10 + (product.id.length % 40); // Базовый риск
  let factor: ReturnPredictionV1['topRiskFactor'] = 'fit';
  let advice = 'Standard fit sizing applies.';

  if (product.category === 'Footwear') {
    risk += 20;
    factor = 'fit';
    advice = 'Higher return rate typical for footwear; suggest size-up for width.';
  } else if (product.category === 'Dress') {
    risk += 15;
    factor = 'style_preference';
    advice = 'Occasion-wear returns often linked to styling mismatch.';
  } else if (product.tags?.includes('newSeason')) {
    risk += 10;
    factor = 'color_mismatch';
    advice = 'Monitor monitor-to-fabric color accuracy.';
  }

  return {
    productId: product.id,
    riskScore: Math.min(risk, 100),
    topRiskFactor: factor,
    advice,
  };
}
