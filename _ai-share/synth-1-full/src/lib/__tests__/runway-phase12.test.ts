/**
 * Phase 12 — production hardening: analytics, social proof, API, state recovery, overrides.
 */

import {
  applyBrandOverridesToProduct,
  mergeProductsWithRunwayOverrides,
} from '@/lib/brand-runway-overrides';
import {
  countSectionViewsToday,
  readScrollExperienceEventLog,
  RUNWAY_ANALYTICS_EVENTS_KEY,
  trackScrollExperienceEvent,
  resetScrollExperienceEventLog,
} from '@/lib/scroll-experience-analytics';
import { aggregateRunwayAnalytics } from '@/lib/runway/runway-analytics-aggregation';
import {
  productHasValidRunwaySections,
  resolveAnalyticsSocialProof,
} from '@/lib/product-scroll-switcher';
import { getRunwayFavoriteSection } from '@/hooks/useRunwaySectionFavorites';
import { getRunwayStoredSection } from '@/hooks/useRunwaySectionPersistence';
import type { Product } from '@/lib/types';

const baseProduct: Product = {
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
  scrollSwitcherSections: [
    {
      id: 's0',
      label: 'Black',
      color: '#000',
      thumbImageUrl: '/a.jpg',
      sectionImageUrl: '/a.jpg',
      price: 5000,
      sectionStory: 'Story',
      sectionTitle: 'Title Black',
      sectionDescription: 'Description Black',
      sectionLookItems: [
        { slug: 'x', name: 'X', price: 100, imageUrl: '/x.jpg' },
        { slug: 'y', name: 'Y', price: 200, imageUrl: '/y.jpg' },
      ],
    },
    {
      id: 's1',
      label: 'White',
      color: '#fff',
      thumbImageUrl: '/b.jpg',
      sectionImageUrl: '/b.jpg',
      price: 5100,
      sectionStory: 'Story 2',
      sectionTitle: 'Title White',
      sectionDescription: 'Description White',
      sectionLookItems: [
        { slug: 'x', name: 'X', price: 100, imageUrl: '/x.jpg' },
        { slug: 'y', name: 'Y', price: 200, imageUrl: '/y.jpg' },
      ],
    },
    {
      id: 's2',
      label: 'Grey',
      color: '#888',
      thumbImageUrl: '/c.jpg',
      sectionImageUrl: '/c.jpg',
      price: 5200,
      sectionStory: 'Story 3',
      sectionTitle: 'Title Grey',
      sectionDescription: 'Description Grey',
      sectionLookItems: [
        { slug: 'x', name: 'X', price: 100, imageUrl: '/x.jpg' },
        { slug: 'y', name: 'Y', price: 200, imageUrl: '/y.jpg' },
      ],
    },
  ],
};

describe('scroll-experience analytics persistence', () => {
  beforeEach(() => {
    resetScrollExperienceEventLog();
    localStorage.clear();
  });

  it('persists events to syntha-runway-analytics-events', () => {
    trackScrollExperienceEvent('scroll_experience_view', {
      productSlug: 'silk-midi-dress',
      sectionIndex: 0,
    });
    expect(localStorage.getItem(RUNWAY_ANALYTICS_EVENTS_KEY)).toBeTruthy();
    const log = readScrollExperienceEventLog();
    expect(log).toHaveLength(1);
    expect(log[0]?.productSlug).toBe('silk-midi-dress');
  });

  it('countSectionViewsToday counts only today events', () => {
    const now = Date.now();
    const events = [
      {
        event: 'scroll_experience_view' as const,
        productSlug: 'silk-midi-dress',
        sectionIndex: 1,
        timestamp: now,
      },
      {
        event: 'scroll_experience_section_change' as const,
        productSlug: 'silk-midi-dress',
        sectionIndex: 1,
        timestamp: now - 86400000 * 2,
      },
    ];
    expect(countSectionViewsToday('silk-midi-dress', 1, events)).toBe(1);
  });
});

describe('resolveAnalyticsSocialProof', () => {
  it('returns null when no views today', () => {
    expect(resolveAnalyticsSocialProof('silk-midi-dress', 0, [])).toBeNull();
  });

  it('returns label when views exist', () => {
    const now = Date.now();
    const proof = resolveAnalyticsSocialProof('silk-midi-dress', 0, [
      {
        event: 'scroll_experience_view',
        productSlug: 'silk-midi-dress',
        sectionIndex: 0,
        timestamp: now,
      },
    ]);
    expect(proof?.viewsToday).toBe(1);
    expect(proof?.label).toContain('1');
  });
});

describe('runway-analytics-aggregation production', () => {
  it('returns dashboard without isDemo flag', () => {
    const dash = aggregateRunwayAnalytics();
    expect(dash).not.toHaveProperty('isDemo');
    expect(dash.eventCount).toBeGreaterThanOrEqual(0);
    expect(dash.funnel.length).toBe(4);
  });
});

describe('applyBrandOverridesToProduct', () => {
  it('merges override fields onto single product', () => {
    const overrides = {
      'Nordic Wool': {
        'runway-tee': {
          scrollVideoUrl: '/videos/custom.mp4',
          scrollSwitcherSections: baseProduct.scrollSwitcherSections,
        },
      },
    };
    const merged = applyBrandOverridesToProduct(baseProduct, overrides);
    expect(merged.scrollVideoUrl).toBe('/videos/custom.mp4');
  });

  it('mergeProductsWithRunwayOverrides matches apply for one SKU', () => {
    const overrides = {
      'Nordic Wool': { 'runway-tee': { featuredScrollExperience: true } },
    };
    const [fromArray] = mergeProductsWithRunwayOverrides([baseProduct], overrides);
    const fromApply = applyBrandOverridesToProduct(baseProduct, overrides);
    expect(fromApply.featuredScrollExperience).toBe(true);
    expect(fromArray?.featuredScrollExperience).toBe(true);
  });
});

describe('productHasValidRunwaySections', () => {
  it('true for complete scroll-video product', () => {
    expect(productHasValidRunwaySections(baseProduct)).toBe(true);
  });

  it('false when displayMode is not scroll-video', () => {
    expect(
      productHasValidRunwaySections({
        ...baseProduct,
        displayMode: 'standard',
      })
    ).toBe(false);
  });
});

describe('runway state recovery helpers', () => {
  beforeEach(() => {
    sessionStorage.clear();
    localStorage.clear();
  });

  it('getRunwayStoredSection reads sessionStorage', () => {
    sessionStorage.setItem('runway-section:silk-midi-dress', '2');
    expect(getRunwayStoredSection('silk-midi-dress')).toBe(2);
  });

  it('getRunwayFavoriteSection reads localStorage favorites map', () => {
    localStorage.setItem('runway-section-favorites', JSON.stringify({ 'silk-midi-dress': 1 }));
    expect(getRunwayFavoriteSection('silk-midi-dress')).toBe(1);
  });
});

describe('API route modules', () => {
  it('runway products route file exists', () => {
    const fs = require('node:fs');
    const path = require('node:path');
    expect(fs.existsSync(path.join(process.cwd(), 'src/app/api/runway/products/route.ts'))).toBe(
      true
    );
  });

  it('product slug route file exists', () => {
    const fs = require('node:fs');
    const path = require('node:path');
    expect(fs.existsSync(path.join(process.cwd(), 'src/app/api/products/[slug]/route.ts'))).toBe(
      true
    );
  });
});

describe('runway dev validation', () => {
  it('validateRunwayProductsForDev returns rows in development', async () => {
    const { validateRunwayProductsForDev, resetRunwayDevValidationFlag } =
      await import('@/lib/runway/runway-dev-validation');
    resetRunwayDevValidationFlag();
    const rows = validateRunwayProductsForDev([baseProduct], { force: true });
    expect(rows[0]?.slug).toBe('runway-tee');
    expect(rows[0]?.status).toBe('OK');
  });
});
