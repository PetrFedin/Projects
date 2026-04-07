import type { Product } from '@/lib/types';
import type { OccasionTag } from './types';

const OCCASION_KEYWORDS: Record<OccasionTag, string[]> = {
  office: ['офис', 'деловой', 'classic', 'business', 'work', 'blazer', 'suit', 'рубашка', 'брюки'],
  evening: ['вечер', 'party', 'dressy', 'night', 'коктейль', 'праздник'],
  casual: ['повседневный', 'street', 'everyday', 'casual', 'jeans', 't-shirt', 'relaxed'],
  vacation: ['отпуск', 'пляж', 'beach', 'summer', 'linen', 'travel', 'курорт'],
  sport: ['спорт', 'active', 'gym', 'training', 'yoga', 'hoodie', 'sneakers', 'бег'],
  wedding: ['свадьба', 'wedding', 'guest', 'formal', 'black tie'],
  home: ['дом', 'loungewear', 'home', 'уют', 'пижама', 'soft'],
};

export function getProductOccasions(product: Product): OccasionTag[] {
  const text = `${product.name} ${product.category} ${product.description} ${product.tags?.join(' ')}`.toLowerCase();
  const found = new Set<OccasionTag>();

  // From explicit attribute if exists
  if (Array.isArray(product.attributes?.occasions)) {
    product.attributes.occasions.forEach((o: string) => {
      if (o in OCCASION_KEYWORDS) found.add(o as OccasionTag);
    });
  }

  // Keyword heuristic
  Object.entries(OCCASION_KEYWORDS).forEach(([occ, keywords]) => {
    if (keywords.some(k => text.includes(k.toLowerCase()))) {
      found.add(occ as OccasionTag);
    }
  });

  return Array.from(found);
}

export function filterProductsByOccasion(products: Product[] = [], occasion: OccasionTag): Product[] {
  return (products || []).filter(p => getProductOccasions(p).includes(occasion));
}

export const OCCASION_LABELS: Record<OccasionTag, string> = {
  office: 'Офис и бизнес',
  evening: 'Вечерний выход',
  casual: 'Повседневный',
  vacation: 'Отпуск и отдых',
  sport: 'Спорт и активность',
  wedding: 'Свадьба и торжество',
  home: 'Дом и уют',
};
