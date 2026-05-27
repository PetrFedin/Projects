/**
 * Сбор предупреждений по контенту scroll-video SKU бренда (brand dashboard).
 */
import {
  filterScrollVideoProducts,
  validateScrollVideoContent,
} from '@/lib/product-scroll-switcher';
import type { Product } from '@/lib/types';

export interface BrandRunwayContentIssue {
  slug: string;
  productName: string;
  issues: string[];
}

/** Проблемы контента runway для scroll-video товаров бренда. */
export function collectBrandRunwayContentIssues(
  products: Product[],
  brandName: string
): BrandRunwayContentIssue[] {
  return filterScrollVideoProducts(products)
    .filter((p) => p.brand === brandName)
    .map((product) => ({
      slug: product.slug,
      productName: product.name,
      issues: validateScrollVideoContent(product),
    }))
    .filter((row) => row.issues.length > 0);
}

export function brandHasRunwayContentIssues(products: Product[], brandName: string): boolean {
  return collectBrandRunwayContentIssues(products, brandName).length > 0;
}
