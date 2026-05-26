import type { Product } from '@/lib/types';
import {
  loadHomeProductsCatalog,
  prefetchHomeProductsCatalog,
  resetHomeProductsCatalogCache,
} from '@/components/home/lib/home-products-catalog';

const mockProducts = [{ id: 'p1', slug: 'test' }] as Product[];

describe('home-products-catalog', () => {
  const originalFetch = global.fetch;

  beforeEach(() => {
    resetHomeProductsCatalogCache();
    global.fetch = jest.fn().mockResolvedValue({
      ok: true,
      json: async () => mockProducts,
    }) as typeof fetch;
  });

  afterEach(() => {
    global.fetch = originalFetch;
    resetHomeProductsCatalogCache();
  });

  it('dedupes concurrent loadHomeProductsCatalog calls', async () => {
    const [a, b] = await Promise.all([loadHomeProductsCatalog(), loadHomeProductsCatalog()]);
    expect(a).toEqual(mockProducts);
    expect(b).toEqual(mockProducts);
    expect(global.fetch).toHaveBeenCalledTimes(1);
  });

  it('prefetchHomeProductsCatalog is idempotent', async () => {
    prefetchHomeProductsCatalog();
    prefetchHomeProductsCatalog();
    await loadHomeProductsCatalog();
    expect(global.fetch).toHaveBeenCalledTimes(1);
  });

  it('returns cached data without refetch', async () => {
    await loadHomeProductsCatalog();
    await loadHomeProductsCatalog();
    expect(global.fetch).toHaveBeenCalledTimes(1);
  });
});
