/**
 * LEAN runway — связность каталога, 3 hero SKU и eligibility бейджа.
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

const HERO_SLUGS = ['silk-midi-dress', 'cashmere-crewneck-sweater', 'tech-anorak-men'] as const;
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

describe('runway connection integrity (lean 3 SKU)', () => {
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

  it('loadAllScrollVideoProducts() count === 3', async () => {
    const products = await loadAllScrollVideoProducts();
    expect(products).toHaveLength(3);
    expect(products.map((p) => p.slug).sort()).toEqual([...HERO_SLUGS].sort());
  });

  it('loadRunwayProducts() merged catalog содержит ровно 3 scroll-video SKU', async () => {
    const products = await loadRunwayProducts();
    const scrollVideo = filterScrollVideoProducts(products);
    expect(scrollVideo).toHaveLength(3);
    expect(scrollVideo.map((p) => p.slug).sort()).toEqual([...HERO_SLUGS].sort());
  });

  it('heroProductSlugs — подмножество scroll-video slugs', () => {
    const scrollSlugs = new Set(filterScrollVideoProducts(catalog).map((p) => p.slug));
    const heroSlugs = resolveHeroProductSlugs(scrollConfig);

    expect(heroSlugs).toHaveLength(3);
    for (const slug of heroSlugs) {
      expect(scrollSlugs.has(slug)).toBe(true);
    }
  });

  it('PDP page-content wired to ProductRunwayPdpMediaColumn (regression guard)', () => {
    const pageContentSrc = fs.readFileSync(
      path.join(process.cwd(), 'src/app/products/[slug]/page-content.tsx'),
      'utf8'
    );
    expect(pageContentSrc).toContain('ProductRunwayPdpMediaColumn');
    expect(pageContentSrc).toContain("from '@/components/product/ProductRunwayPdpMediaColumn'");
    expect(pageContentSrc).toContain('<ProductRunwayPdpMediaColumn');
  });

  it('tech-anorak-men sectionVideoUrl использует anorak-* пути, не silk-*', () => {
    const anorak = catalog.find((p) => p.slug === 'tech-anorak-men');
    expect(anorak).toBeDefined();

    const urls = (anorak!.scrollSwitcherSections ?? [])
      .map((s) => s.sectionVideoUrl)
      .filter(Boolean);

    expect(urls).toHaveLength(3);
    for (const url of urls) {
      expect(url).toMatch(/\/videos\/sections\/anorak-\d+\.mp4$/);
      expect(url).not.toMatch(/\/videos\/sections\/silk-\d+\./);
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
