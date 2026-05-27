import {
  ApiRunwayProductRepository,
  JsonRunwayProductRepository,
  createRunwayProductRepository,
  getRunwayProductRepository,
  resetRunwayProductRepositoryCache,
} from '../runway/runway-product-repository-core';
import {
  loadRunwayProductCatalog,
  resetRunwayProductRepository,
} from '../runway/RunwayProductRepository';
import { resolveRunwayDataSource, isRunwayApiDataSource } from '../runway/runway-data-source';
import type { Product } from '../types';

const mockProduct: Product = {
  id: '1',
  slug: 'runway-tee',
  name: 'Runway Tee',
  brand: 'Nordic Wool',
  price: 5000,
  description: 'test',
  images: [{ id: 'i', url: '/x.jpg', alt: 'x', hint: '' }],
  category: 'Tops',
  sustainability: [],
  sku: 'RW-1',
  color: 'Black',
  season: 'SS',
  displayMode: 'scroll-video',
};

describe('runway-data-source', () => {
  const orig = process.env.NEXT_PUBLIC_RUNWAY_DATA_SOURCE;

  afterEach(() => {
    process.env.NEXT_PUBLIC_RUNWAY_DATA_SOURCE = orig;
  });

  it('resolveRunwayDataSource — default json', () => {
    delete process.env.NEXT_PUBLIC_RUNWAY_DATA_SOURCE;
    expect(resolveRunwayDataSource()).toBe('json');
    expect(isRunwayApiDataSource()).toBe(false);
  });

  it('resolveRunwayDataSource — api when env set', () => {
    process.env.NEXT_PUBLIC_RUNWAY_DATA_SOURCE = 'api';
    expect(resolveRunwayDataSource()).toBe('api');
    expect(isRunwayApiDataSource()).toBe(true);
  });
});

describe('RunwayProductRepository', () => {
  const originalFetch = globalThis.fetch;

  beforeEach(() => {
    resetRunwayProductRepositoryCache();
    resetRunwayProductRepository();
  });

  afterEach(() => {
    globalThis.fetch = originalFetch;
  });

  it('JsonRunwayProductRepository — singleton promise cache', async () => {
    const repo = new JsonRunwayProductRepository();
    const fetchSpy = jest.fn().mockResolvedValue({
      ok: true,
      json: async () => [mockProduct],
    });
    globalThis.fetch = fetchSpy as typeof fetch;

    const [a, b] = await Promise.all([repo.loadCatalog(), repo.loadCatalog()]);
    expect(a).toEqual([mockProduct]);
    expect(b).toEqual([mockProduct]);
    expect(fetchSpy).toHaveBeenCalledTimes(1);
  });

  it('JsonRunwayProductRepository — force bypasses cache', async () => {
    const repo = new JsonRunwayProductRepository();
    const fetchSpy = jest.fn().mockResolvedValue({
      ok: true,
      json: async () => [mockProduct],
    });
    globalThis.fetch = fetchSpy as typeof fetch;

    await repo.loadCatalog();
    await repo.loadCatalog(true);
    expect(fetchSpy).toHaveBeenCalledTimes(2);
  });

  it('JsonRunwayProductRepository — returns [] on fetch error', async () => {
    const repo = new JsonRunwayProductRepository();
    globalThis.fetch = jest.fn().mockRejectedValue(new Error('network')) as typeof fetch;
    await expect(repo.loadCatalog()).resolves.toEqual([]);
  });

  it('ApiRunwayProductRepository — throws when API fails', async () => {
    const repo = new ApiRunwayProductRepository();
    globalThis.fetch = jest.fn().mockResolvedValue({ ok: false, status: 503 }) as typeof fetch;
    await expect(repo.loadCatalog()).rejects.toThrow(/API каталога недоступен/);
  });

  it('ApiRunwayProductRepository — parses JSON catalog', async () => {
    const repo = new ApiRunwayProductRepository();
    globalThis.fetch = jest.fn().mockResolvedValue({
      ok: true,
      json: async () => [mockProduct],
    }) as typeof fetch;
    await expect(repo.loadCatalog()).resolves.toEqual([mockProduct]);
  });

  it('createRunwayProductRepository — json by default', () => {
    delete process.env.NEXT_PUBLIC_RUNWAY_DATA_SOURCE;
    resetRunwayProductRepositoryCache();
    expect(createRunwayProductRepository()).toBeInstanceOf(JsonRunwayProductRepository);
  });

  it('createRunwayProductRepository — api when env set', () => {
    process.env.NEXT_PUBLIC_RUNWAY_DATA_SOURCE = 'api';
    resetRunwayProductRepositoryCache();
    expect(createRunwayProductRepository()).toBeInstanceOf(ApiRunwayProductRepository);
  });

  it('getRunwayProductRepository — returns same singleton', () => {
    resetRunwayProductRepositoryCache();
    expect(getRunwayProductRepository()).toBe(getRunwayProductRepository());
  });

  it('loadRunwayProductCatalog — delegates to active repo', async () => {
    globalThis.fetch = jest.fn().mockResolvedValue({
      ok: true,
      json: async () => [mockProduct],
    }) as typeof fetch;
    resetRunwayProductRepository();
    await expect(loadRunwayProductCatalog()).resolves.toEqual([mockProduct]);
  });
});
