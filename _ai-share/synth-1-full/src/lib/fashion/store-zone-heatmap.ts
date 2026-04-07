import type { StoreZoneHeatmapV1 } from './types';

/** Тепловая карта проходимости зон в магазине. */
export function getStoreZoneHeatmap(locationId: string): StoreZoneHeatmapV1[] {
  return [
    { zoneName: 'Entrance / Window', footfallCount: 4500, dwellTimeAvgSec: 15, conversionRate: 5 },
    { zoneName: 'Main Runway', footfallCount: 3200, dwellTimeAvgSec: 45, conversionRate: 12 },
    { zoneName: 'New Arrivals Wall', footfallCount: 1800, dwellTimeAvgSec: 120, conversionRate: 25 },
    { zoneName: 'Fitting Room Zone', footfallCount: 800, dwellTimeAvgSec: 600, conversionRate: 65 },
  ];
}
