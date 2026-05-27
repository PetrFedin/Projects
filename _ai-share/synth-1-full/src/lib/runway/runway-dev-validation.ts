/**
 * Dev-only валидация scroll-video каталога при старте runway.
 */
import {
  filterScrollVideoProducts,
  validateScrollVideoContent,
  resolveScrollSwitcherSections,
} from '@/lib/product-scroll-switcher';
import type { Product } from '@/lib/types';

export interface RunwayDevValidationRow {
  slug: string;
  brand: string;
  sections: number;
  errors: number;
  status: 'OK' | 'WARN';
}

let validatedOnce = false;

export function validateRunwayProductsForDev(
  products: Product[],
  options?: { force?: boolean }
): RunwayDevValidationRow[] {
  if (typeof process !== 'undefined' && process.env.NODE_ENV !== 'development' && !options?.force) {
    return [];
  }
  if (validatedOnce && !options?.force) return [];

  const scroll = filterScrollVideoProducts(products);
  const rows: RunwayDevValidationRow[] = scroll.map((p) => {
    const errors = validateScrollVideoContent(p);
    return {
      slug: p.slug,
      brand: p.brand,
      sections: resolveScrollSwitcherSections(p).length,
      errors: errors.length,
      status: errors.length === 0 ? 'OK' : 'WARN',
    };
  });

  if (rows.length > 0) {
    console.table(rows);
    const warnCount = rows.filter((r) => r.status === 'WARN').length;
    if (warnCount > 0) {
      console.warn(
        `[runway] ${warnCount}/${rows.length} scroll-video товаров с предупреждениями контента`
      );
    } else {
      console.info(`[runway] Validation passed: ${rows.length} scroll-video products`);
    }
  }

  validatedOnce = true;
  return rows;
}

export function resetRunwayDevValidationFlag(): void {
  validatedOnce = false;
}
