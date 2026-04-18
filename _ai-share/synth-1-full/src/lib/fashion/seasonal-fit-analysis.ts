import type { Product } from '@/lib/types';
import type { SeasonalMaterialFitV1 } from './types';

/** Анализ сезонности материала в зависимости от плотности (GSM) и климата РФ. */
export function analyzeSeasonalFit(product: Product): SeasonalMaterialFitV1 {
  const isNatural =
    product.composition?.toLowerCase().includes('cotton') ||
    product.composition?.toLowerCase().includes('wool');
  const gsm = product.category === 'Outerwear' ? 450 : product.category === 'Top' ? 180 : 250;

  let range = '+10°C to +25°C';
  let score = 85;
  let advice = 'Optimal for current Central region weather.';

  if (gsm > 300) {
    range = '-15°C to +5°C';
    if (new Date().getMonth() > 3 && new Date().getMonth() < 9) {
      score = 40;
      advice = 'Material too heavy for summer season. Expect high returns or overstock.';
    }
  } else if (gsm < 200) {
    range = '+15°C to +30°C';
  }

  return {
    sku: product.sku,
    materialGsm: gsm,
    recommendedTempRange: range,
    fitScore: score,
    advice,
  };
}
