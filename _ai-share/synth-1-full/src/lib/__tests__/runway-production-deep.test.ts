/**
 * Production deep phase — CDN signed query, A/B env gate, GA4 naming, Postgres store, onboarding scripts.
 */
import fs from 'node:fs';
import path from 'node:path';
import {
  appendVideoCdnSignedQuery,
  assertHttpsVideoUrlWhenCdnConfigured,
  resolveVideoCdnOptions,
  resolveVideoCdnUrl,
} from '@/lib/runway/runway-video-cdn';
import {
  applyRunwayProductionEnvOverrides,
  normalizeScrollExperienceConfig,
} from '@/lib/runway/scroll-experience-schema';
import {
  assignRunwayAbCohortWithTracking,
  resolveRunwayAbCohort,
} from '@/lib/runway/runway-ab-cohort';
import {
  mirrorScrollAnalyticsToGa4,
  resolveRunwayExternalEventName,
} from '@/lib/runway/runway-analytics-adapters';
import { aggregateAbCohortSplit } from '@/lib/runway/runway-analytics-aggregation';
import {
  createRunwayAnalyticsStore,
  resetRunwayAnalyticsStoreSingleton,
} from '@/lib/server/runway-analytics-store-interface';
import {
  FileRunwayAnalyticsStore,
  PostgresRunwayAnalyticsStore,
} from '@/lib/server/runway-analytics-store-impl';
import { resolveScrollVideoSources } from '@/lib/product-scroll-switcher';
import type { Product } from '@/lib/types';

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

describe('runway production deep — CDN pipeline', () => {
  const prevSigned = process.env.RUNWAY_VIDEO_CDN_SIGNED_QUERY;

  afterEach(() => {
    if (prevSigned === undefined) delete process.env.RUNWAY_VIDEO_CDN_SIGNED_QUERY;
    else process.env.RUNWAY_VIDEO_CDN_SIGNED_QUERY = prevSigned;
  });

  it('resolveVideoCdnUrl appends signed query from env', () => {
    process.env.RUNWAY_VIDEO_CDN_SIGNED_QUERY = 'v=prod123';
    const url = resolveVideoCdnUrl('/videos/a.mp4', {
      baseUrl: 'https://cdn.test',
    });
    expect(url).toBe('https://cdn.test/videos/a.mp4?v=prod123');
  });

  it('local dev paths stay relative without CDN base', () => {
    expect(resolveVideoCdnUrl('/videos/a.mp4', {})).toBe('/videos/a.mp4');
  });

  it('assertHttpsVideoUrlWhenCdnConfigured rejects non-https when CDN configured', () => {
    expect(() => assertHttpsVideoUrlWhenCdnConfigured('/videos/a.mp4', true)).toThrow(
      /absolute https/
    );
  });

  it('resolveScrollVideoSources uses signed query via config', () => {
    const config = normalizeScrollExperienceConfig({
      videoCdnBaseUrl: 'https://media.test',
      videoCdnSignedQuery: 'token=abc',
    });
    const sources = resolveScrollVideoSources(baseProduct, config);
    expect(sources.mp4).toBe('https://media.test/videos/hero.mp4?token=abc');
  });

  it('appendVideoCdnSignedQuery merges with existing query', () => {
    expect(appendVideoCdnSignedQuery('https://x/a.mp4?a=1', 'b=2')).toBe('https://x/a.mp4?a=1&b=2');
  });

  it('resolveVideoCdnOptions prefers brandVideoCdnBaseUrl over global', () => {
    const opts = resolveVideoCdnOptions(
      {
        videoCdnBaseUrl: 'https://global.cdn',
        brandVideoCdnBaseUrl: { 'Nordic Wool': 'https://nordic.cdn' },
      },
      'Nordic Wool'
    );
    expect(opts.baseUrl).toBe('https://nordic.cdn');
  });
});

describe('runway production deep — A/B env gate', () => {
  const prevAb = process.env.RUNWAY_AB_TEST_ENABLED;

  afterEach(() => {
    if (prevAb === undefined) delete process.env.RUNWAY_AB_TEST_ENABLED;
    else process.env.RUNWAY_AB_TEST_ENABLED = prevAb;
  });

  it('applyRunwayProductionEnvOverrides enables global A/B only with RUNWAY_AB_TEST_ENABLED=1', () => {
    process.env.RUNWAY_AB_TEST_ENABLED = '1';
    const config = applyRunwayProductionEnvOverrides(
      normalizeScrollExperienceConfig({ abTestRunwayDefault: false })
    );
    expect(config.abTestRunwayDefault).toBe(true);

    delete process.env.RUNWAY_AB_TEST_ENABLED;
    const off = applyRunwayProductionEnvOverrides(
      normalizeScrollExperienceConfig({ abTestRunwayDefault: true })
    );
    expect(off.abTestRunwayDefault).toBe(false);
  });

  it('resolveRunwayAbCohort is deterministic across calls', () => {
    const key = 'visitor-deterministic-prod-99';
    expect(resolveRunwayAbCohort(key)).toBe(resolveRunwayAbCohort(key));
  });

  it('assignRunwayAbCohortWithTracking fires runway_ab_cohort_assigned once', () => {
    const {
      resetScrollExperienceMetrics,
      readScrollExperienceEventLog,
    } = require('@/lib/scroll-experience-analytics');
    resetScrollExperienceMetrics();
    localStorage.clear();
    assignRunwayAbCohortWithTracking({ productSlug: 'silk-midi-dress', brand: 'Nordic Wool' });
    assignRunwayAbCohortWithTracking({ productSlug: 'silk-midi-dress', brand: 'Nordic Wool' });
    const abCalls = readScrollExperienceEventLog().filter(
      (e: { event: string }) => e.event === 'runway_ab_cohort_assigned'
    );
    expect(abCalls).toHaveLength(1);
  });

  it('aggregateAbCohortSplit counts runway-first vs standard-first', () => {
    const split = aggregateAbCohortSplit([
      {
        event: 'runway_ab_cohort_assigned',
        productSlug: 'a',
        timestamp: 1,
        abCohort: 'runway-first',
      },
      {
        event: 'runway_ab_cohort_assigned',
        productSlug: 'b',
        timestamp: 2,
        abCohort: 'standard-first',
      },
      {
        event: 'runway_ab_cohort_assigned',
        productSlug: 'c',
        timestamp: 3,
        abCohort: 'runway-first',
      },
    ]);
    expect(split.runwayFirst).toBe(2);
    expect(split.standardFirst).toBe(1);
    expect(split.total).toBe(3);
    expect(split.runwayFirstPct).toBeCloseTo(66.7, 0);
  });
});

describe('runway production deep — GA4 external event names', () => {
  it('maps scroll events to runway_* names', () => {
    expect(resolveRunwayExternalEventName('scroll_experience_view')).toBe('runway_view');
    expect(resolveRunwayExternalEventName('scroll_experience_section_change')).toBe(
      'runway_section_change'
    );
    expect(resolveRunwayExternalEventName('scroll_experience_add_to_cart')).toBe(
      'runway_add_to_cart'
    );
  });

  it('mirrorScrollAnalyticsToGa4 uses runway_view', () => {
    process.env.NEXT_PUBLIC_GA4_MEASUREMENT_ID = 'G-TEST';
    const gtag = jest.fn();
    window.gtag = gtag;
    mirrorScrollAnalyticsToGa4('scroll_experience_view', { productSlug: 'a' });
    expect(gtag).toHaveBeenCalledWith('event', 'runway_view', expect.any(Object));
    delete window.gtag;
  });
});

describe('runway production deep — Postgres analytics store', () => {
  afterEach(() => {
    resetRunwayAnalyticsStoreSingleton();
    delete process.env.RUNWAY_ANALYTICS_STORE;
    delete process.env.DATABASE_URL;
    delete process.env.RUNWAY_ANALYTICS_STORE_FILE;
  });

  it('createRunwayAnalyticsStore throws clear error for postgres without DATABASE_URL', () => {
    process.env.RUNWAY_ANALYTICS_STORE = 'postgres';
    delete process.env.DATABASE_URL;
    expect(() => createRunwayAnalyticsStore()).toThrow(/DATABASE_URL/);
  });

  it('FileRunwayAnalyticsStore queryDashboard + exportCsv', async () => {
    const dir = fs.mkdtempSync(path.join(require('os').tmpdir(), 'runway-pg-deep-'));
    process.env.RUNWAY_ANALYTICS_STORE_FILE = path.join(dir, 'events.json');
    const store = new FileRunwayAnalyticsStore();
    await store.appendEvents([
      { event: 'scroll_experience_view', productSlug: 'a', timestamp: Date.now() },
    ]);
    const dash = await store.queryDashboard({ page: 1, pageSize: 10 });
    expect(dash.metrics.scroll_experience_view).toBe(1);
    const csv = await store.exportCsv('dashboard');
    expect(csv).toContain('views,1');
  });
});

describe('runway production deep — onboarding scripts', () => {
  it('runway-onboard-brand.mjs exists', () => {
    expect(fs.existsSync(path.join(process.cwd(), 'scripts/runway-onboard-brand.mjs'))).toBe(true);
  });

  it('.env.production.example exists with runway keys', () => {
    const envPath = path.join(process.cwd(), '.env.production.example');
    expect(fs.existsSync(envPath)).toBe(true);
    const raw = fs.readFileSync(envPath, 'utf8');
    expect(raw).toContain('RUNWAY_VIDEO_CDN_SIGNED_QUERY');
    expect(raw).toContain('RUNWAY_AB_TEST_ENABLED');
    expect(raw).toContain('RUNWAY_ANALYTICS_STORE');
    expect(raw).toContain('DATABASE_URL');
    expect(raw).toContain('NEXT_PUBLIC_GA4_MEASUREMENT_ID');
    expect(raw).toContain('NEXT_PUBLIC_POSTHOG_KEY');
  });

  it('runway-doctor checks env template', () => {
    const src = fs.readFileSync(path.join(process.cwd(), 'scripts/runway-doctor.mjs'), 'utf8');
    expect(src).toContain('checkProductionEnvTemplate');
    expect(src).toContain('.env.production.example');
  });

  it('runway-cdn-verify.mjs exists', () => {
    expect(fs.existsSync(path.join(process.cwd(), 'scripts/runway-cdn-verify.mjs'))).toBe(true);
  });

  it('config route exposes analyticsEnabled shape', () => {
    const src = fs.readFileSync(
      path.join(process.cwd(), 'src/app/api/runway/config/route.ts'),
      'utf8'
    );
    expect(src).toContain('analyticsEnabled');
    expect(src).toContain('applyRunwayProductionEnvOverrides');
  });

  it('BrandRunwayAnalyticsTab has A/B cohort section', () => {
    const src = fs.readFileSync(
      path.join(process.cwd(), 'src/components/brand/BrandRunwayAnalyticsTab.tsx'),
      'utf8'
    );
    expect(src).toContain('data-runway-ab-cohort-split');
  });
});
