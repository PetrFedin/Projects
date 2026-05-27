import type { Product, ScrollExperienceConfig } from '@/lib/types';
import { productSupportsScrollVideo } from '@/lib/product-scroll-switcher';

/** Runway включён для бренда (default true, если ключ не задан). */
export function isBrandRunwayEnabled(
  brandName: string,
  config?: Pick<ScrollExperienceConfig, 'brandRunwayEnabled'>
): boolean {
  if (!brandName?.trim()) return true;
  const map = config?.brandRunwayEnabled;
  if (!map) return true;
  const value = map[brandName];
  return value !== false;
}

/** Товар доступен в runway UI: displayMode + валидные секции + флаг бренда. */
export function isProductRunwayAvailable(
  product: Product,
  config?: Pick<ScrollExperienceConfig, 'brandRunwayEnabled'>
): boolean {
  return productSupportsScrollVideo(product) && isBrandRunwayEnabled(product.brand, config);
}

/** Фильтр каталога с учётом brand gate (playlist, featured, hero strip). */
export function filterRunwayAvailableProducts(
  products: Product[],
  config?: Pick<ScrollExperienceConfig, 'brandRunwayEnabled'>
): Product[] {
  return products.filter((p) => isProductRunwayAvailable(p, config));
}
