import type { FactoryCapacityV1 } from './types';

/** Мониторинг производственных мощностей (Factory Capacity Planning). */
export function getFactoryCapacityStatus(sku: string): FactoryCapacityV1 {
  const seedRaw = sku.split('-')[1] || '100';
  let seed = parseInt(seedRaw, 10);
  if (isNaN(seed)) seed = sku.length * 19;

  const total = 10000 + (seed % 5000);
  const booked = 7500 + (seed % 2000);

  return {
    factoryId: seed % 2 === 0 ? 'FACTORY-IVANOVO-01' : 'FACTORY-URAL-02',
    sku,
    totalMonthlyCapacity: total,
    currentBookedQty: booked,
    utilizationPercent: Math.round((booked / total) * 100),
    earliestAvailableSlot: new Date(Date.now() + 86400000 * 45).toISOString().split('T')[0],
  };
}
