import type { Product } from '@/lib/types';
import { resolveRunwayDataSource } from './runway-data-source';

const PRODUCTS_JSON_PATH = '/data/products.json';

export interface RunwayProductRepository {
  loadCatalog(force?: boolean): Promise<Product[]>;
  resetCache?(): void;
}

/** Текущий demo-путь: public/data/products.json с singleton promise cache. */
export class JsonRunwayProductRepository implements RunwayProductRepository {
  private cache: Product[] | null = null;
  private promise: Promise<Product[]> | null = null;

  resetCache(): void {
    this.cache = null;
    this.promise = null;
  }

  async loadCatalog(force = false): Promise<Product[]> {
    if (!force && this.cache) return this.cache;
    if (!force && this.promise) return this.promise;

    this.promise = (async () => {
      try {
        const res = await fetch(PRODUCTS_JSON_PATH);
        if (!res.ok) return [];
        const data = (await res.json()) as Product[];
        this.cache = data;
        return data;
      } catch {
        return [];
      } finally {
        this.promise = null;
      }
    })();

    return this.promise;
  }
}

/**
 * Production API repository — каталог из /api/runway/products (читает products.json).
 * Базовый URL: NEXT_PUBLIC_RUNWAY_API_BASE (default /api/runway/products).
 */
export class ApiRunwayProductRepository implements RunwayProductRepository {
  private cache: Product[] | null = null;

  resetCache(): void {
    this.cache = null;
  }

  async loadCatalog(force = false): Promise<Product[]> {
    if (!force && this.cache) return this.cache;

    const base =
      (typeof process !== 'undefined' && process.env.NEXT_PUBLIC_RUNWAY_API_BASE) ||
      '/api/runway/products';

    try {
      const res = await fetch(base, {
        headers: { Accept: 'application/json' },
        cache: force ? 'no-store' : 'default',
      });
      if (!res.ok) {
        throw new Error(
          `[RunwayProductRepository] API каталога недоступен (${res.status}): ${base}`
        );
      }
      const data = (await res.json()) as Product[];
      this.cache = data;
      return data;
    } catch (err) {
      if (err instanceof Error && err.message.startsWith('[RunwayProductRepository]')) {
        throw err;
      }
      const msg = err instanceof Error ? err.message : String(err);
      throw new Error(`[RunwayProductRepository] Ошибка загрузки каталога: ${msg}`);
    }
  }
}

let defaultRepo: RunwayProductRepository | null = null;

export function createRunwayProductRepository(): RunwayProductRepository {
  return resolveRunwayDataSource() === 'api'
    ? new ApiRunwayProductRepository()
    : new JsonRunwayProductRepository();
}

export function getRunwayProductRepository(): RunwayProductRepository {
  if (!defaultRepo) defaultRepo = createRunwayProductRepository();
  return defaultRepo;
}

export function resetRunwayProductRepositoryCache(): void {
  defaultRepo?.resetCache?.();
  defaultRepo = null;
}
