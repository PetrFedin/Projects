import type { FulfillmentRiskV1 } from './types';

/** Расчет рисков выполнения предзаказа (Логистика и Производство). */
export function getFulfillmentRisk(sku: string): FulfillmentRiskV1 {
  const seed = sku.split('-')[1] || '100';
  const numSeed = parseInt(seed, 10);

  const logisticRisk = (numSeed % 10) * 5 + 10;
  const productionRisk = (numSeed % 5) * 10 + 5;
  const overallScore = (logisticRisk + productionRisk) / 2;

  const factors = [];
  if (logisticRisk > 40) factors.push('Border transit delay risk (CN-RU)');
  if (productionRisk > 30) factors.push('Fabric mill capacity at peak season');
  if (numSeed % 7 === 0) factors.push('Raw material price volatility (Silk/Cashmere)');

  return {
    sku,
    logisticRisk,
    productionRisk,
    overallScore,
    factors: factors.length > 0 ? factors : ['✅ Supply chain stability confirmed'],
  };
}
