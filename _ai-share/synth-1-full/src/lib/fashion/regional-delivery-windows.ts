import type { RegionalDeliveryWindowV1 } from './types';

/** Окна доставки дистрибьютора по регионам (Logistics Windows). */
export function getRegionalDeliveryWindows(
  region: string = 'South-RU'
): RegionalDeliveryWindowV1[] {
  return [
    {
      region,
      earliestDeparture: '2026-04-10',
      latestArrival: '2026-04-12',
      availableCapacityUnits: 2500,
      truckType: 'standard',
      distributorId: 'DIST-SOUTH-PRO',
    },
    {
      region,
      earliestDeparture: '2026-04-15',
      latestArrival: '2026-04-16',
      availableCapacityUnits: 500,
      truckType: 'express',
      distributorId: 'DIST-SOUTH-PRO',
    },
  ];
}
