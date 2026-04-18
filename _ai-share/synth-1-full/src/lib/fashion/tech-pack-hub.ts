import type { B2BTechPackV1 } from './types';

/** Хаб технических спецификаций для байеров и ритейлеров. */
export function getB2BTechPack(sku: string): B2BTechPackV1 {
  return {
    sku,
    fabricComposition: '100% Organic Cotton, Heavy Jersey 320g/m2',
    trims: [
      { name: 'Eco-Nylon Zipper', source: 'YKK Italy', quantity: 1 },
      { name: 'Branded Metal Rivets', source: 'Local RU Supplier', quantity: 4 },
    ],
    careSymbols: ['wash-30', 'no-bleach', 'iron-low'],
    constructionType: 'Oversized Fit, Flatlock Seams',
    sizeSpecsCm: {
      'Chest Width': 58,
      'Total Length': 74,
      'Sleeve Length': 62,
    },
  };
}
