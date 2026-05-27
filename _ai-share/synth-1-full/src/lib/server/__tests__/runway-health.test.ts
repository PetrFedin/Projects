import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import type { Product } from '@/lib/types';
import {
  checkRunwayAnalyticsStoreWritable,
  evaluateRunwayHealth,
  validateRunwayAssetsOnDisk,
} from '@/lib/server/runway-health';

function mockScrollVideoProduct(slug: string): Product {
  return {
    id: slug,
    slug,
    name: slug,
    brand: 'Syntha',
    price: 1000,
    sku: slug,
    color: 'Test',
    displayMode: 'scroll-video',
    scrollVideoUrl: '/video.mp4',
    description: 'Test description',
    scrollSwitcherSections: [
      {
        label: 'A',
        price: 1000,
        sectionImageUrl: '/images/demo/runway/test-a.jpg',
        sectionStory: 'Story A',
        sectionTitle: 'Title A',
        sectionDescription: 'Description A',
        sectionLookItems: [
          { slug: 'a1', name: 'Look 1', imageUrl: '/img1.jpg', price: 100 },
          { slug: 'a2', name: 'Look 2', imageUrl: '/img2.jpg', price: 200 },
        ],
      },
      {
        label: 'B',
        price: 2000,
        sectionImageUrl: '/images/demo/runway/test-b.jpg',
        sectionStory: 'Story B',
        sectionTitle: 'Title B',
        sectionDescription: 'Description B',
        sectionLookItems: [
          { slug: 'b1', name: 'Look 1', imageUrl: '/img3.jpg', price: 100 },
          { slug: 'b2', name: 'Look 2', imageUrl: '/img4.jpg', price: 200 },
        ],
      },
      {
        label: 'C',
        price: 3000,
        sectionImageUrl: '/images/demo/runway/test-c.jpg',
        sectionStory: 'Story C',
        sectionTitle: 'Title C',
        sectionDescription: 'Description C',
        sectionLookItems: [
          { slug: 'c1', name: 'Look 1', imageUrl: '/img5.jpg', price: 100 },
          { slug: 'c2', name: 'Look 2', imageUrl: '/img6.jpg', price: 200 },
        ],
      },
    ],
  } as Product;
}

describe('runway health evaluation', () => {
  it('returns healthy snapshot for valid catalog', () => {
    const products = [mockScrollVideoProduct('silk-midi-dress')];
    const snapshot = evaluateRunwayHealth({
      products,
      analyticsStoreWritable: true,
      config: { featuredProductSlug: 'silk-midi-dress' } as never,
    });
    expect(snapshot.healthy).toBe(true);
    expect(snapshot.scrollVideoProductCount).toBe(1);
    expect(snapshot.assetsValid).toBe(true);
    expect(snapshot.checks.catalog).toBe('ok');
    expect(snapshot.checks.config).toBe('ok');
    expect(snapshot.checks.analytics).toBe('ok');
  });

  it('marks unhealthy when catalog empty', () => {
    const snapshot = evaluateRunwayHealth({
      products: [],
      analyticsStoreWritable: true,
      config: { featuredProductSlug: 'x' } as never,
    });
    expect(snapshot.healthy).toBe(false);
    expect(snapshot.scrollVideoProductCount).toBe(0);
    expect(snapshot.checks.catalog).toBe('fail');
  });

  it('marks analytics check fail when store not writable', () => {
    const snapshot = evaluateRunwayHealth({
      products: [mockScrollVideoProduct('x')],
      analyticsStoreWritable: false,
      config: { featuredProductSlug: 'x' } as never,
    });
    expect(snapshot.healthy).toBe(false);
    expect(snapshot.checks.analytics).toBe('fail');
  });

  it('marks config check fail when config missing', () => {
    const snapshot = evaluateRunwayHealth({
      products: [mockScrollVideoProduct('x')],
      analyticsStoreWritable: true,
      config: null,
    });
    expect(snapshot.configLoaded).toBe(false);
    expect(snapshot.checks.config).toBe('fail');
  });

  it('validateRunwayAssetsOnDisk reports content errors', () => {
    const bad = mockScrollVideoProduct('bad');
    bad.scrollSwitcherSections = bad.scrollSwitcherSections?.slice(0, 1);
    const report = validateRunwayAssetsOnDisk([bad]);
    expect(report.assetsValid).toBe(false);
    expect(report.assetIssueCount).toBeGreaterThan(0);
  });

  it('checkRunwayAnalyticsStoreWritable succeeds in temp dir', () => {
    const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'runway-health-'));
    const storePath = path.join(dir, 'nested', 'events.json');
    expect(checkRunwayAnalyticsStoreWritable(storePath)).toBe(true);
    fs.rmSync(dir, { recursive: true, force: true });
  });

  it('checkRunwayAnalyticsStoreWritable fails for invalid path', () => {
    expect(checkRunwayAnalyticsStoreWritable('/nonexistent-root/runway/events.json')).toBe(false);
  });

  it('includes dataSource in snapshot', () => {
    const snapshot = evaluateRunwayHealth({
      products: [mockScrollVideoProduct('x')],
      analyticsStoreWritable: true,
      config: { featuredProductSlug: 'x' } as never,
    });
    expect(['json', 'api']).toContain(snapshot.dataSource);
  });

  it('caps issues list at 20 entries', () => {
    const products = Array.from({ length: 25 }, (_, i) => {
      const p = mockScrollVideoProduct(`p-${i}`);
      p.scrollSwitcherSections = p.scrollSwitcherSections?.slice(0, 1);
      return p;
    });
    const snapshot = evaluateRunwayHealth({
      products,
      analyticsStoreWritable: true,
      config: { featuredProductSlug: 'x' } as never,
    });
    expect(snapshot.issues.length).toBeLessThanOrEqual(20);
  });
});

describe('GET /api/runway/health route contract', () => {
  it('exports required snapshot keys', () => {
    const snapshot = evaluateRunwayHealth({
      products: [mockScrollVideoProduct('silk-midi-dress')],
      analyticsStoreWritable: true,
      config: { featuredProductSlug: 'silk-midi-dress' } as never,
    });
    expect(snapshot).toEqual(
      expect.objectContaining({
        healthy: expect.any(Boolean),
        scrollVideoProductCount: expect.any(Number),
        assetsValid: expect.any(Boolean),
        assetIssueCount: expect.any(Number),
        analyticsStoreWritable: expect.any(Boolean),
        configLoaded: expect.any(Boolean),
        featuredProductSlug: expect.anything(),
        dataSource: expect.any(String),
        checks: expect.objectContaining({
          catalog: expect.any(String),
          assets: expect.any(String),
          analytics: expect.any(String),
          config: expect.any(String),
        }),
        issues: expect.any(Array),
        rateLimitBackend: expect.any(String),
      })
    );
  });
});
