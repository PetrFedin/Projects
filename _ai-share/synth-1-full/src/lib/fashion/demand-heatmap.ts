import type { RegionalDemandHeatmapV1 } from './types';

/** Тепловая карта спроса для регионов РФ. */
export function getRegionalDemandHeatmap(sku: string): RegionalDemandHeatmapV1[] {
  return [
    {
      region: 'Central',
      demandIndex: 85,
      trend: 'rising',
      topCategories: ['Knitwear', 'Trousers'],
    },
    {
      region: 'Siberia',
      demandIndex: 65,
      trend: 'stable',
      topCategories: ['Outerwear', 'Denim'],
    },
    {
      region: 'South',
      demandIndex: 92,
      trend: 'rising',
      topCategories: ['Linen', 'Dresses'],
    }
  ];
}
