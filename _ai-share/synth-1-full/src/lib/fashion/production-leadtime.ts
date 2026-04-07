import type { ProductionLeadTimeV1 } from './types';

/** Оценка сроков производства и поставки (Lead Time Estimator). */
export function getProductionLeadTime(sku: string): ProductionLeadTimeV1 {
  const seedRaw = sku.split('-')[1] || '100';
  let seed = parseInt(seedRaw, 10);
  if (isNaN(seed)) seed = sku.length * 9;

  const sampling = 7 + (seed % 5);
  const rawMat = 14 + (seed % 10);
  const prod = 21 + (seed % 15);
  const log = 10 + (seed % 7);
  const total = sampling + rawMat + prod + log;

  const deliveryDate = new Date();
  deliveryDate.setDate(deliveryDate.getDate() + total);

  return {
    sku,
    samplingDays: sampling,
    rawMaterialLeadDays: rawMat,
    productionDays: prod,
    logisticsDays: log,
    totalLeadDays: total,
    estimatedDeliveryDate: deliveryDate.toISOString().split('T')[0],
  };
}
