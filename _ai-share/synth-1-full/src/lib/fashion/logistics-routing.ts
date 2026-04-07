import type { RegionalLogisticsRoutingV1 } from './types';

/** Маршрутизация региональной логистики (Routing & Middle-Mile). */
export function getLogisticsRouting(sku: string, targetRegion: string = 'South-RU'): RegionalLogisticsRoutingV1 {
  const seedRaw = sku.split('-')[1] || '100';
  let seed = parseInt(seedRaw, 10);
  if (isNaN(seed)) seed = sku.length * 13;

  return {
    sku,
    warehouseId: 'WH-CENTRAL-01',
    targetRegion,
    routeType: seed % 3 === 0 ? 'milk-run' : (seed % 2 === 0 ? 'cross-dock' : 'direct'),
    transitDays: 3 + (seed % 4),
    costPerUnit: 15 + (seed % 20),
    co2Impact: 2.5 + (seed % 2),
  };
}
