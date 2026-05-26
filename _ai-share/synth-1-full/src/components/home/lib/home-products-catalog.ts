import type { Product } from '@/lib/types';

const PRODUCTS_JSON_PATH = '/data/products.json';

let cachedProducts: Product[] | undefined;
let inflight: Promise<Product[]> | null = null;

/** RSC baseline / tests — пропуск client fetch на first paint. */
export function seedHomeProductsCatalog(products: Product[]): void {
  cachedProducts = Array.isArray(products) ? products : [];
  inflight = null;
}

/** Проверка, что каталог уже прогрет (RSC seed или prefetch). */
export function readHomeProductsCatalogCache(): Product[] | undefined {
  return cachedProducts;
}

/** Singleton load — dedupe fetch между prefetch и useHomeProducts. */
export async function loadHomeProductsCatalog(): Promise<Product[]> {
  if (cachedProducts !== undefined) return cachedProducts;
  if (inflight) return inflight;

  inflight = (async () => {
    try {
      const response = await fetch(PRODUCTS_JSON_PATH);
      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
      const data = (await response.json()) as Product[];
      cachedProducts = Array.isArray(data) ? data : [];
      return cachedProducts;
    } catch (error) {
      console.warn('Failed to fetch home products catalog:', error);
      cachedProducts = [];
      return cachedProducts;
    } finally {
      inflight = null;
    }
  })();

  return inflight;
}

/** Warmup после first paint — без await, безопасно вызывать из shell. */
export function prefetchHomeProductsCatalog(): void {
  if (typeof window === 'undefined') return;
  if (cachedProducts !== undefined || inflight) return;
  void loadHomeProductsCatalog();
}

/** Только для тестов / dev reset. */
export function resetHomeProductsCatalogCache(): void {
  cachedProducts = undefined;
  inflight = null;
}