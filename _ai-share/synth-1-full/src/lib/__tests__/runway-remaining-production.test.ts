/**
 * Remaining production items — product-config API, adapters, CDN, A/B, analytics store.
 */
import fs from 'node:fs';
import path from 'node:path';
import { applyVideoCdnBaseUrl } from '@/lib/runway/runway-video-cdn';
import {
  resolveDefaultPdpMediaView,
  resolveRunwayAbCohort,
  resolveAbTestEnabledForProduct,
} from '@/lib/runway/runway-ab-cohort';
import {
  mirrorScrollAnalyticsToGa4,
  mirrorScrollAnalyticsToPosthog,
  resolveRunwayAnalyticsAdapterStatus,
} from '@/lib/runway/runway-analytics-adapters';
import {
  applyRunwayProductPatch,
  mergeProductsWithRunwayLayers,
} from '@/lib/runway/runway-product-merge';
import { normalizeScrollExperienceConfig } from '@/lib/runway/scroll-experience-schema';
import { resolveScrollVideoSources, resolveSectionVideoUrl } from '@/lib/product-scroll-switcher';
import type { Product } from '@/lib/types';
import {
  PostgresRunwayAnalyticsStore,
  FileRunwayAnalyticsStore,
} from '@/lib/server/runway-analytics-store-impl';
import {
  createRunwayAnalyticsStore,
  resetRunwayAnalyticsStoreSingleton,
} from '@/lib/server/runway-analytics-store-interface';
import { runwayProductConfigPostBodySchema } from '@/lib/server/runway-api-schemas';

const baseProduct: Product = {
  id: '1',
  slug: 'runway-tee',
  name: 'Runway Tee',
  brand: 'Test',
  price: 1000,
  description: 'test',
  images: [{ id: '1', url: '/x.jpg', alt: 'x', hint: '' }],
  category: 'Tops',
  sustainability: [],
  sku: 'SKU',
  color: 'Black',
  season: 'SS',
  displayMode: 'scroll-video',
  scrollVideoUrl: '/videos/hero.mp4',
};

describe('runway remaining production — video CDN', () => {
  it('applyVideoCdnBaseUrl prefixes relative video paths', () => {
    expect(applyVideoCdnBaseUrl('/videos/a.mp4', 'https://cdn.example.com')).toBe(
      'https://cdn.example.com/videos/a.mp4'
    );
    expect(applyVideoCdnBaseUrl('https://other.cdn/a.mp4', 'https://cdn.example.com')).toBe(
      'https://other.cdn/a.mp4'
    );
  });

  it('resolveScrollVideoSources applies videoCdnBaseUrl from config', () => {
    const config = normalizeScrollExperienceConfig({ videoCdnBaseUrl: 'https://media.test' });
    const sources = resolveScrollVideoSources(baseProduct, config);
    expect(sources.mp4).toBe('https://media.test/videos/hero.mp4');
    expect(sources.webm).toBe('https://media.test/videos/hero.webm');
  });

  it('resolveSectionVideoUrl applies CDN to sectionVideoUrl', () => {
    const config = normalizeScrollExperienceConfig({ videoCdnBaseUrl: 'https://media.test' });
    const url = resolveSectionVideoUrl(
      baseProduct,
      { id: 'a', label: 'A', color: '#000', sectionVideoUrl: '/videos/clip.mp4' },
      0,
      config
    );
    expect(url).toBe('https://media.test/videos/clip.mp4');
  });
});

describe('runway remaining production — A/B cohort', () => {
  it('resolveRunwayAbCohort is deterministic for same visitor key', () => {
    expect(resolveRunwayAbCohort('visitor-fixed-key')).toBe(
      resolveRunwayAbCohort('visitor-fixed-key')
    );
  });

  it('resolveDefaultPdpMediaView respects abTestRunwayDefault', () => {
    expect(
      resolveDefaultPdpMediaView({
        hasScrollVideoMode: true,
        abTestRunwayDefault: false,
        urlView: null,
      })
    ).toBe('runway');

    expect(
      resolveDefaultPdpMediaView({
        hasScrollVideoMode: true,
        abTestRunwayDefault: true,
        urlView: null,
        visitorKey: 'ab-test-visitor-a',
      })
    ).toMatch(/runway|standard/);
  });

  it('resolveAbTestEnabledForProduct scopes A/B to flagship slugs', () => {
    expect(
      resolveAbTestEnabledForProduct({
        abTestRunwayDefault: false,
        abTestFlagshipSlugs: ['silk-midi-dress'],
        productSlug: 'silk-midi-dress',
      })
    ).toBe(true);
    expect(
      resolveAbTestEnabledForProduct({
        abTestRunwayDefault: false,
        abTestFlagshipSlugs: ['silk-midi-dress'],
        productSlug: 'other-sku',
      })
    ).toBe(false);
  });

  it('resolveDefaultPdpMediaView uses flagship slugs without global ab flag', () => {
    expect(
      resolveDefaultPdpMediaView({
        hasScrollVideoMode: true,
        abTestRunwayDefault: false,
        abTestFlagshipSlugs: ['silk-midi-dress'],
        productSlug: 'other-sku',
        urlView: null,
      })
    ).toBe('runway');
  });
});

describe('runway remaining production — analytics adapters', () => {
  const prevGa4 = process.env.NEXT_PUBLIC_GA4_MEASUREMENT_ID;
  const prevPh = process.env.NEXT_PUBLIC_POSTHOG_KEY;

  afterEach(() => {
    process.env.NEXT_PUBLIC_GA4_MEASUREMENT_ID = prevGa4;
    process.env.NEXT_PUBLIC_POSTHOG_KEY = prevPh;
  });

  it('resolveRunwayAnalyticsAdapterStatus reflects env', () => {
    process.env.NEXT_PUBLIC_GA4_MEASUREMENT_ID = 'G-TEST';
    process.env.NEXT_PUBLIC_POSTHOG_KEY = '';
    expect(resolveRunwayAnalyticsAdapterStatus()).toEqual({ ga4: true, posthog: false });
  });

  it('mirrorScrollAnalyticsToGa4 calls gtag when enabled', () => {
    process.env.NEXT_PUBLIC_GA4_MEASUREMENT_ID = 'G-TEST';
    const gtag = jest.fn();
    window.gtag = gtag;
    mirrorScrollAnalyticsToGa4('scroll_experience_view', { productSlug: 'a' });
    expect(gtag).toHaveBeenCalledWith(
      'event',
      'runway_view',
      expect.objectContaining({ product_slug: 'a' })
    );
    delete window.gtag;
  });

  it('mirrorScrollAnalyticsToPosthog calls capture when enabled', () => {
    process.env.NEXT_PUBLIC_POSTHOG_KEY = 'phc_test';
    const capture = jest.fn();
    window.posthog = { capture };
    mirrorScrollAnalyticsToPosthog('scroll_experience_section_change', {
      productSlug: 'b',
      sectionIndex: 1,
    });
    expect(capture).toHaveBeenCalledWith(
      'runway_section_change',
      expect.objectContaining({ product_slug: 'b', section_index: 1 })
    );
    delete window.posthog;
  });
});

describe('runway remaining production — product merge + API schema', () => {
  it('mergeProductsWithRunwayLayers applies patch by slug', () => {
    const merged = mergeProductsWithRunwayLayers(
      [baseProduct],
      {},
      {
        'runway-tee': {
          scrollVideoUrl: '/videos/patched.mp4',
        },
      }
    );
    expect(merged[0].scrollVideoUrl).toBe('/videos/patched.mp4');
  });

  it('applyRunwayProductPatch merges sections', () => {
    const patched = applyRunwayProductPatch(baseProduct, {
      scrollSwitcherSections: [{ id: 'x', label: 'X', color: '#111' }],
    });
    expect(patched.scrollSwitcherSections?.[0].label).toBe('X');
  });

  it('runwayProductConfigPostBodySchema validates POST body', () => {
    const parsed = runwayProductConfigPostBodySchema.safeParse({
      brandName: 'Nordic Wool',
      slug: 'silk-midi-dress',
      config: {
        displayMode: 'scroll-video',
        scrollVideoUrl: '/videos/a.mp4',
        scrollSwitcherSections: [{ id: '1', label: 'A', color: '#000' }],
      },
    });
    expect(parsed.success).toBe(true);
  });
});

describe('runway remaining production — analytics store', () => {
  it('FileRunwayAnalyticsStore appends events', async () => {
    const dir = fs.mkdtempSync(path.join(require('os').tmpdir(), 'runway-analytics-'));
    const storePath = path.join(dir, 'events.json');
    process.env.RUNWAY_ANALYTICS_STORE_FILE = storePath;

    const store = new FileRunwayAnalyticsStore();
    await store.appendEvents([
      {
        event: 'scroll_experience_view',
        productSlug: 'a',
        timestamp: Date.now(),
      },
    ]);
    const events = await store.readEvents();
    expect(events).toHaveLength(1);

    delete process.env.RUNWAY_ANALYTICS_STORE_FILE;
  });

  it('PostgresRunwayAnalyticsStore throws without DATABASE_URL', () => {
    const prev = process.env.DATABASE_URL;
    delete process.env.DATABASE_URL;
    expect(() => new PostgresRunwayAnalyticsStore()).toThrow(/DATABASE_URL/);
    process.env.DATABASE_URL = prev;
  });

  it('createRunwayAnalyticsStore postgres requires DATABASE_URL', () => {
    resetRunwayAnalyticsStoreSingleton();
    process.env.RUNWAY_ANALYTICS_STORE = 'postgres';
    delete process.env.DATABASE_URL;
    expect(() => createRunwayAnalyticsStore()).toThrow(/DATABASE_URL/);
    delete process.env.RUNWAY_ANALYTICS_STORE;
    resetRunwayAnalyticsStoreSingleton();
  });
});

describe('runway remaining production — SDK + smoke artifacts', () => {
  it('RunwayAnalyticsGate mounted in ClientLayout (lazy RunwayAnalyticsProvider)', () => {
    const src = fs.readFileSync(
      path.join(process.cwd(), 'src/components/layout/client-layout.tsx'),
      'utf8'
    );
    expect(src).toContain('RunwayAnalyticsGate');
  });

  it('scroll-experience.production.example.json documents production fields', () => {
    const examplePath = path.join(
      process.cwd(),
      'public/data/scroll-experience.production.example.json'
    );
    expect(fs.existsSync(examplePath)).toBe(true);
    const raw = JSON.parse(fs.readFileSync(examplePath, 'utf8'));
    expect(raw.videoCdnBaseUrl).toBeDefined();
    expect(raw.layout).toBe('minimal');
    expect(Array.isArray(raw.heroProductSlugs)).toBe(true);
    expect(Array.isArray(raw.abTestFlagshipSlugs)).toBe(true);
    expect(raw.runwayBadgeHeroOnly).toBe(true);
    expect(raw).toHaveProperty('analyticsWebhookUrl');
    expect(raw.features?.socialProof).toBe(false);
    expect(raw.enableUserOptions).toBe(false);
  });

  it('runway-analytics migration SQL exists', () => {
    expect(fs.existsSync(path.join(process.cwd(), 'docs/runway-analytics-migration.sql'))).toBe(
      true
    );
  });

  it('runway-smoke-live.mjs script exists', () => {
    expect(fs.existsSync(path.join(process.cwd(), 'scripts/runway-smoke-live.mjs'))).toBe(true);
  });
});

describe('runway remaining production — routes exist', () => {
  it('product-config route file exists', () => {
    expect(
      fs.existsSync(path.join(process.cwd(), 'src/app/api/runway/product-config/route.ts'))
    ).toBe(true);
  });

  it('BrandRunwayPreviewTab uses product-config API', () => {
    const src = fs.readFileSync(
      path.join(process.cwd(), 'src/components/brand/BrandRunwayPreviewTab.tsx'),
      'utf8'
    );
    expect(src).toContain('/api/runway/product-config');
    expect(src).toContain('sectionVideoUrl');
    expect(src).toContain('Export products.json');
  });
});
