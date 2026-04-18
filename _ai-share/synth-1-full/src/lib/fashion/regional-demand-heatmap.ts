import type { DemandHeatmapV1 } from './types';

/** Карта спроса по регионам РФ (Regional Demand Distribution). */
export function listRegionalDemandHeatmaps(): DemandHeatmapV1[] {
  return [
    {
      region: 'Central (Moscow)',
      demandIndex: 95,
      stockStatus: 'optimal',
      topCategory: 'Outerwear',
    },
    { region: 'Northwest (Saint-P)', demandIndex: 82, stockStatus: 'low', topCategory: 'Coats' },
    {
      region: 'Ural (Ekaterinburg)',
      demandIndex: 74,
      stockStatus: 'optimal',
      topCategory: 'Boots',
    },
    {
      region: 'South (Krasnodar)',
      demandIndex: 68,
      stockStatus: 'overstock',
      topCategory: 'Shirts',
    },
    {
      region: 'Siberia (Novosibirsk)',
      demandIndex: 61,
      stockStatus: 'low',
      topCategory: 'Pullovers',
    },
    {
      region: 'Far East (Vladivostok)',
      demandIndex: 55,
      stockStatus: 'optimal',
      topCategory: 'Accessories',
    },
  ];
}
