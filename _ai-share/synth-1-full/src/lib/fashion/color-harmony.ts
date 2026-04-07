import type { Product } from '@/lib/types';
import type { ColorHarmonySuggestion } from './types';

const NEUTRAL = new Set([
  'чёрн',
  'черный',
  'бел',
  'белый',
  'сер',
  'серый',
  'беж',
  'молочн',
  'крем',
  'navy',
  'black',
  'white',
  'grey',
  'gray',
  'cream',
  'camel',
]);

const WARM = new Set(['коричн', 'терракот', 'ржав', 'охра', 'camel', 'песоч', 'золот', 'оранж', 'brown', 'rust', 'tan']);

const COOL = new Set(['син', 'голуб', 'бирюз', 'изумруд', 'фиолет', 'лаванд', 'blue', 'teal', 'green', 'indigo']);

function norm(s: string) {
  return s.toLowerCase();
}

function colorFamily(colorName: string): 'neutral' | 'warm' | 'cool' | 'mixed' {
  const n = norm(colorName);
  let w = 0;
  let c = 0;
  let neu = 0;
  for (const x of NEUTRAL) if (n.includes(x)) neu++;
  for (const x of WARM) if (n.includes(x)) w++;
  for (const x of COOL) if (n.includes(x)) c++;
  if (neu && !w && !c) return 'neutral';
  if (w > c) return 'warm';
  if (c > w) return 'cool';
  return 'mixed';
}

function categoryDistance(a: string, b: string): number {
  if (a === b) return 0;
  if (!a || !b) return 2;
  if (a.includes(b) || b.includes(a)) return 0.5;
  return 1.5;
}

/** Эвристика «с чем сочетается» без CV: семья цвета + близость категории + не тот же SKU. */
export function suggestColorHarmony(anchor: Product, catalog: Product[], limit = 8): ColorHarmonySuggestion[] {
  const fam = colorFamily(anchor.color || '');
  const scored = catalog
    .filter((p) => p.id !== anchor.id && p.images?.length)
    .map((p) => {
      const pf = colorFamily(p.color || '');
      let score = 0.5;
      let reason = 'Каталог и палитра';
      if (fam === 'neutral' || pf === 'neutral') {
        score += 0.35;
        reason = 'Нейтральная палитра — универсальный микс';
      } else if (fam === pf && fam !== 'mixed') {
        score += 0.25;
        reason = 'Та же цветовая семья';
      } else if ((fam === 'warm' && pf === 'cool') || (fam === 'cool' && pf === 'warm')) {
        score += 0.2;
        reason = 'Контраст тёплого и холодного';
      }
      score -= categoryDistance(anchor.category || '', p.category || '') * 0.08;
      if (p.brand === anchor.brand) {
        score += 0.1;
        reason = 'Тот же бренд — единая эстетика';
      }
      return {
        productId: String(p.id),
        slug: p.slug,
        name: p.name,
        imageUrl: p.images[0]?.url || '/placeholder.jpg',
        reason,
        score,
      };
    });
  scored.sort((a, b) => b.score - a.score);
  return scored.slice(0, limit);
}
