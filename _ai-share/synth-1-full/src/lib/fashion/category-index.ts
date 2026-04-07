import type { Product } from '@/lib/types';
import type { CategoryIndexBucket } from './types';

/** Иерархия категорий для навигации и SEO (без отдельного taxonomy API). */
export function buildCategoryIndex(products: Product[]): CategoryIndexBucket[] {
  const map = new Map<string, { count: number; exampleSlug: string }>();
  for (const p of products) {
    const parts = [p.category_group, p.category, p.subcategory, p.subcategory2].filter(
      (x): x is string => typeof x === 'string' && x.trim().length > 0,
    );
    const path = parts.length ? parts.join(' › ') : 'Без категории';
    const prev = map.get(path);
    if (prev) {
      prev.count += 1;
    } else {
      map.set(path, { count: 1, exampleSlug: p.slug });
    }
  }
  return [...map.entries()]
    .map(([path, v]) => ({ path, count: v.count, exampleSlug: v.exampleSlug }))
    .sort((a, b) => b.count - a.count || a.path.localeCompare(b.path, 'ru'));
}
