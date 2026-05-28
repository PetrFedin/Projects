/**
 * LEAN runway — связность каталога, hero SKU и eligibility бейджа.
 */
import fs from 'node:fs';
import path from 'node:path';
import {
  loadRunwayProducts,
  loadAllScrollVideoProducts,
  resetRunwayExperienceCache,
} from '@/lib/runway/RunwayExperienceService';
import {
  filterScrollVideoProducts,
  isHeroRunwayProduct,
  productSupportsScrollVideo,
  resolveHeroProductSlugs,
} from '@/lib/product-scroll-switcher';
import { normalizeScrollExperienceConfig } from '@/lib/runway/scroll-experience-schema';
import { isProductRunwayAvailable } from '@/lib/runway/runway-brand-gate';
import type { Product, ScrollExperienceConfig } from '@/lib/types';

const catalogPath = path.join(process.cwd(), 'public/data/products.json');
const scrollConfigPath = path.join(process.cwd(), 'public/data/scroll-experience.json');

const HERO_SLUGS = ['silk-midi-dress', 'cashmere-crewneck-sweater'] as const;
const DEMOTED_SLUG = 'oversized-hoodie-women';

function mockRunwayFetch(catalog: Product[], scrollConfig: ScrollExperienceConfig) {
  global.fetch = jest.fn(async (input: RequestInfo | URL) => {
    const url = String(input);
    if (url.includes('/data/products.json')) {
      return { ok: true, json: async () => catalog } as Response;
    }
    if (url.includes('/api/runway/product-config')) {
      return { ok: true, json: async () => ({ patches: {} }) } as Response;
    }
    if (url.includes('/api/runway/config') || url.includes('/data/scroll-experience.json')) {
      return { ok: true, json: async () => scrollConfig } as Response;
    }
    return { ok: false, json: async () => ({}) } as Response;
  }) as typeof fetch;
}

describe('runway connection integrity (lean 2 SKU)', () => {
  let catalog: Product[];
  let scrollConfig: ScrollExperienceConfig;

  beforeEach(() => {
    resetRunwayExperienceCache();
    catalog = JSON.parse(fs.readFileSync(catalogPath, 'utf8')) as Product[];
    scrollConfig = normalizeScrollExperienceConfig(
      JSON.parse(fs.readFileSync(scrollConfigPath, 'utf8'))
    );
    mockRunwayFetch(catalog, scrollConfig);
  });

  it('loadAllScrollVideoProducts() count === 2', async () => {
    const products = await loadAllScrollVideoProducts();
    expect(products).toHaveLength(2);
    expect(products.map((p) => p.slug).sort()).toEqual([...HERO_SLUGS].sort());
  });

  it('loadRunwayProducts() merged catalog содержит ровно 2 scroll-video SKU', async () => {
    const products = await loadRunwayProducts();
    const scrollVideo = filterScrollVideoProducts(products);
    expect(scrollVideo).toHaveLength(2);
    expect(scrollVideo.map((p) => p.slug).sort()).toEqual([...HERO_SLUGS].sort());
  });

  it('heroProductSlugs — подмножество scroll-video slugs', () => {
    const scrollSlugs = new Set(filterScrollVideoProducts(catalog).map((p) => p.slug));
    const heroSlugs = resolveHeroProductSlugs(scrollConfig);

    expect(heroSlugs).toHaveLength(2);
    for (const slug of heroSlugs) {
      expect(scrollSlugs.has(slug)).toBe(true);
    }
  });

  it('non-hero standard product — без eligibility Runway badge', () => {
    const demoted = catalog.find((p) => p.slug === DEMOTED_SLUG);
    expect(demoted).toBeDefined();
    expect(productSupportsScrollVideo(demoted!)).toBe(false);
    expect(isHeroRunwayProduct(demoted!, scrollConfig)).toBe(false);

    const badgeEligible =
      scrollConfig.enableCatalogBadge !== false &&
      isProductRunwayAvailable(demoted!, scrollConfig) &&
      (!scrollConfig.runwayBadgeHeroOnly || isHeroRunwayProduct(demoted!, scrollConfig));

    expect(badgeEligible).toBe(false);
  });
});
