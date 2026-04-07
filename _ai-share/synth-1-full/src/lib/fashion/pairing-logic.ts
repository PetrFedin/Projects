import type { Product } from '@/lib/types';
import type { StylePairingRuleV1 } from './types';
import { extractDesignDna } from './design-dna';

const PAIRING_RULES: StylePairingRuleV1[] = [
  { id: 'r1', sourceCategory: 'Top', targetCategories: ['Bottom', 'Accessory'], styleMatch: ['minimalist', 'classicist'], boostFactor: 1.5 },
  { id: 'r2', sourceCategory: 'Outerwear', targetCategories: ['Accessory', 'Footwear'], styleMatch: ['streetwear', 'avant-garde'], boostFactor: 1.2 },
  { id: 'r3', sourceCategory: 'Dress', targetCategories: ['Footwear', 'Accessory'], styleMatch: ['bohemian'], boostFactor: 1.8 },
];

/** Подбор комплементарных товаров на основе правил мерчандайзинга. */
export function getStylePairings(product: Product, catalog: Product[]): Product[] {
  const rule = PAIRING_RULES.find(r => r.sourceCategory === product.category);
  if (!rule) return catalog.slice(0, 4);

  return catalog
    .filter(p => p.sku !== product.sku && rule.targetCategories.includes(p.category))
    .map(p => {
      let score = 0;
      if (p.color === product.color) score += 10;
      if (p.brand === product.brand) score += 5;
      
      const dna = extractDesignDna(p);
      const sourceDna = extractDesignDna(product);
      if (dna.fit === sourceDna.fit) score += 15;

      return { p, score };
    })
    .sort((a, b) => b.score - a.score)
    .slice(0, 4)
    .map(item => item.p);
}
