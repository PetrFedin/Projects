import type { RegionalPriceLadderV1 } from './types';

/** Анализ ценовой лестницы по регионам РФ для оптимизации розницы. */
export function getRegionalPriceLadder(sku: string): RegionalPriceLadderV1[] {
  return [
    {
      region: 'Moscow & MO',
      avgRetailPrice: 15900,
      localCompetitorAvg: 16500,
      marginHealth: 55,
      priceIndex: 110,
    },
    {
      region: 'Saint Petersburg',
      avgRetailPrice: 14900,
      localCompetitorAvg: 15200,
      marginHealth: 52,
      priceIndex: 105,
    },
    {
      region: 'Urals (Ekaterinburg)',
      avgRetailPrice: 12900,
      localCompetitorAvg: 13100,
      marginHealth: 48,
      priceIndex: 95,
    },
    {
      region: 'Siberia (Novosibirsk)',
      avgRetailPrice: 12500,
      localCompetitorAvg: 12200,
      marginHealth: 45,
      priceIndex: 90,
    },
  ];
}
