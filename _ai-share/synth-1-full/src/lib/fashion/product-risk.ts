import type { Product } from '@/lib/types';
import type { ProductRiskScoreV1 } from './types';

/** Анализ рисков для SKU (Мерчандайзинг). */
export function calculateProductRisk(product: Product): ProductRiskScoreV1 {
  const alerts: string[] = [];
  let dRisk = 10 + (product.sku.length % 30);
  let qRisk = 15 + (product.name.length % 20);
  let pRisk = 20;

  if (product.tags?.includes('newSeason')) {
    pRisk += 30; // Риск новинки - неизвестный спрос
    alerts.push('New Season: Demand uncertain');
  }

  if (product.productionCost && product.productionCost > product.price * 0.4) {
    alerts.push('Low Margin Risk');
  }

  if (product.category === 'Outerwear') {
    dRisk += 15; // Сложная логистика
    alerts.push('Complex Delivery Logistics');
  }

  const overall = Math.round((dRisk + qRisk + pRisk) / 3);

  return {
    overallRisk: overall,
    deliveryRisk: dRisk,
    qualityRisk: qRisk,
    popularityRisk: pRisk,
    alerts,
  };
}
