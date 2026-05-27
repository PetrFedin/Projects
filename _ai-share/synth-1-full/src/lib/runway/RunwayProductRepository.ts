import type { Product } from '@/lib/types';
import {
  createRunwayProductRepository,
  getRunwayProductRepository,
  resetRunwayProductRepositoryCache,
  type RunwayProductRepository,
} from './runway-product-repository-core';

export type { RunwayProductRepository };
export {
  JsonRunwayProductRepository,
  ApiRunwayProductRepository,
} from './runway-product-repository-core';

export { createRunwayProductRepository, getRunwayProductRepository };

/** Загрузка каталога через активный repository (json | api). */
export async function loadRunwayProductCatalog(force = false): Promise<Product[]> {
  return getRunwayProductRepository().loadCatalog(force);
}

/** Сброс singleton + кэша (тесты / hot reload). */
export function resetRunwayProductRepository(): void {
  resetRunwayProductRepositoryCache();
}
