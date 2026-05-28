/**
 * Phase 21 — landing /runway, upload API, brand alerts, analytics summary, haptic, mobile touch.
 */

import fs from 'node:fs';
import path from 'node:path';
import {
  buildRunwayAnalyticsSummary,
  resolveRunwayAnalyticsSummaryPeriod,
} from '@/lib/runway/runway-analytics-summary';
import {
  collectBrandRunwayContentIssues,
  brandHasRunwayContentIssues,
} from '@/lib/runway/runway-brand-content-alerts';
import { triggerRunwaySectionHaptic } from '@/lib/runway/runway-haptic';
import {
  RUNWAY_UPLOAD_MAX_BYTES,
  sanitizeRunwayBrandSlug,
  sanitizeRunwayUploadFilename,
  isRunwayUploadAllowedInRuntime,
} from '@/lib/server/runway-upload';
import type { Product } from '@/lib/types';
import type { ScrollExperienceEventLogEntry } from '@/lib/scroll-experience-analytics';

const scrollProduct: Product = {
  id: '1',
  slug: 'runway-test',
  name: 'Runway Test',
  brand: 'Syntha-1',
  price: 1000,
  description: 'Test',
  displayMode: 'scroll-video',
  images: [{ url: '/images/a.jpg', alt: 'a' }],
  scrollSwitcherSections: [
    {
      id: 's0',
      label: 'A',
      color: '#000',
      sectionStory: 'Story A',
      sectionTitle: 'Title A',
      sectionDescription: 'Description A',
      sectionImageUrl: '/images/a.jpg',
      sectionLookItems: [
        { name: 'L1', slug: 'l1', price: 100, imageUrl: '/images/l1.jpg' },
        { name: 'L2', slug: 'l2', price: 200, imageUrl: '/images/l2.jpg' },
      ],
    },
    {
      id: 's1',
      label: 'B',
      color: '#111',
      sectionStory: 'Story B',
      sectionTitle: 'Title B',
      sectionDescription: 'Description B',
      sectionImageUrl: '/images/b.jpg',
      sectionLookItems: [
        { name: 'L3', slug: 'l3', price: 100, imageUrl: '/images/l3.jpg' },
        { name: 'L4', slug: 'l4', price: 200, imageUrl: '/images/l4.jpg' },
      ],
    },
    {
      id: 's2',
      label: 'C',
      color: '#222',
      sectionStory: 'Story C',
      sectionTitle: 'Title C',
      sectionDescription: 'Description C',
      sectionImageUrl: '/images/c.jpg',
      sectionLookItems: [
        { name: 'L5', slug: 'l5', price: 100, imageUrl: '/images/l5.jpg' },
        { name: 'L6', slug: 'l6', price: 200, imageUrl: '/images/l6.jpg' },
      ],
    },
  ],
};

describe('runway phase21 landing page', () => {
  it('/runway page exists with metadata and grid component', () => {
    const pageSrc = fs.readFileSync(path.join(process.cwd(), 'src/app/runway/page.tsx'), 'utf8');
    expect(pageSrc).toContain('Product Scroll Switcher');
    expect(pageSrc).toContain('RunwayLandingGrid');
    expect(pageSrc).toContain('metadata');
    expect(pageSrc).toContain('silk-midi-dress');
  });

  it('RunwayLandingGrid links to flagship demo and playlist', () => {
    const gridSrc = fs.readFileSync(
      path.join(process.cwd(), 'src/components/runway/RunwayLandingGrid.tsx'),
      'utf8'
    );
    expect(gridSrc).toContain('/products/silk-midi-dress?view=runway');
    expect(gridSrc).toContain('/runway/playlist');
    expect(gridSrc).toContain('data-runway-landing-grid');
    expect(gridSrc).toContain('RunwayBadge');
  });

  it('sitemap includes /runway landing', () => {
    const sitemapSrc = fs.readFileSync(path.join(process.cwd(), 'src/app/sitemap.ts'), 'utf8');
    expect(sitemapSrc).toContain('/runway');
  });
});

describe('runway phase21 upload API', () => {
  it('upload route validates multipart and uses runway-upload helper', () => {
    const routeSrc = fs.readFileSync(
      path.join(process.cwd(), 'src/app/api/runway/upload/route.ts'),
      'utf8'
    );
    expect(routeSrc).toContain('saveRunwayBrandVideoUpload');
    expect(routeSrc).toContain('brandSlug');
    expect(routeSrc).toContain('file');
  });

  it('sanitizeRunwayBrandSlug rejects unsafe slugs', () => {
    expect(sanitizeRunwayBrandSlug('syntha-1')).toBe('syntha-1');
    expect(sanitizeRunwayBrandSlug('../evil')).toBeNull();
    expect(sanitizeRunwayBrandSlug('')).toBeNull();
  });

  it('sanitizeRunwayUploadFilename produces .mp4 name', () => {
    expect(sanitizeRunwayUploadFilename('hero clip.mp4')).toMatch(/\.mp4$/);
  });

  it('RUNWAY_UPLOAD_MAX_BYTES is 50MB', () => {
    expect(RUNWAY_UPLOAD_MAX_BYTES).toBe(50 * 1024 * 1024);
  });

  it('BrandRunwayPreviewTab exposes file upload inputs', () => {
    const tabSrc = fs.readFileSync(
      path.join(process.cwd(), 'src/components/brand/BrandRunwayPreviewTab.tsx'),
      'utf8'
    );
    expect(tabSrc).toContain('/api/runway/upload');
    expect(tabSrc).toContain('/api/runway/upload/presign');
    expect(tabSrc).toContain('accept="video/mp4"');
    expect(tabSrc).toContain('data-runway-video-upload');
  });

  it('runbook documents local upload and S3 migration', () => {
    const runbook = fs.readFileSync(
      path.join(process.cwd(), 'docs/runway-production-runbook.md'),
      'utf8'
    );
    expect(runbook).toContain('/api/runway/upload');
    expect(runbook).toMatch(/S3|CDN/i);
  });
});

describe('runway phase21 brand content alerts', () => {
  it('collectBrandRunwayContentIssues uses validateScrollVideoContent', () => {
    const incomplete: Product = {
      ...scrollProduct,
      slug: 'incomplete-runway',
      scrollSwitcherSections: scrollProduct.scrollSwitcherSections?.slice(0, 1),
    };
    const issues = collectBrandRunwayContentIssues([scrollProduct, incomplete], 'Syntha-1');
    expect(issues.some((row) => row.slug === 'incomplete-runway')).toBe(true);
    expect(issues.find((row) => row.slug === 'runway-test')).toBeUndefined();
  });

  it('brandHasRunwayContentIssues is false for valid catalog', () => {
    expect(brandHasRunwayContentIssues([scrollProduct], 'Syntha-1')).toBe(false);
  });

  it('BrandRunwayContentBanner links to runway preview tab', () => {
    const bannerSrc = fs.readFileSync(
      path.join(process.cwd(), 'src/components/brand/BrandRunwayContentBanner.tsx'),
      'utf8'
    );
    expect(bannerSrc).toContain('collectBrandRunwayContentIssues');
    expect(bannerSrc).toContain('runway-preview');
    expect(bannerSrc).toContain('data-runway-content-banner');
  });
});

describe('runway phase21 analytics summary', () => {
  const events: ScrollExperienceEventLogEntry[] = [
    {
      event: 'scroll_experience_view',
      productSlug: 'a',
      timestamp: Date.now(),
    },
    {
      event: 'scroll_experience_section_change',
      productSlug: 'a',
      sectionIndex: 1,
      timestamp: Date.now(),
    },
    {
      event: 'scroll_experience_view',
      productSlug: 'b',
      timestamp: Date.now(),
    },
  ];

  it('resolveRunwayAnalyticsSummaryPeriod defaults to week', () => {
    expect(resolveRunwayAnalyticsSummaryPeriod(null)).toBe('week');
    expect(resolveRunwayAnalyticsSummaryPeriod('month')).toBe('month');
  });

  it('buildRunwayAnalyticsSummary aggregates KPIs and top products', () => {
    const summary = buildRunwayAnalyticsSummary(events, 'week');
    expect(summary.period).toBe('week');
    expect(summary.dashboard.metrics.scroll_experience_view).toBe(2);
    expect(summary.topProducts[0]?.productSlug).toBe('a');
    expect(summary.uniqueProductSlugs).toBe(2);
  });

  it('GET /api/runway/analytics/summary route exists', () => {
    const routeSrc = fs.readFileSync(
      path.join(process.cwd(), 'src/app/api/runway/analytics/summary/route.ts'),
      'utf8'
    );
    expect(routeSrc).toContain('buildRunwayAnalyticsSummary');
    expect(routeSrc).toContain('period');
  });

  it('BrandRunwayAnalyticsTab renders weekly summary card', () => {
    const tabSrc = fs.readFileSync(
      path.join(process.cwd(), 'src/components/brand/BrandRunwayAnalyticsTab.tsx'),
      'utf8'
    );
    expect(tabSrc).toContain('data-runway-weekly-summary');
    expect(tabSrc).toContain('/api/runway/analytics/summary?period=week');
  });
});

describe('runway phase21 mobile touch haptic', () => {
  it('useScrollVideoProgress triggers haptic on touch section change', () => {
    const hookSrc = fs.readFileSync(
      path.join(process.cwd(), 'src/hooks/useScrollVideoProgress.ts'),
      'utf8'
    );
    expect(hookSrc).toContain('triggerRunwaySectionHaptic');
    expect(hookSrc).toContain('touchActiveRef.current');
    expect(hookSrc).toContain("'touch'");
  });

  it('triggerRunwaySectionHaptic calls navigator.vibrate(10)', () => {
    const vibrate = jest.fn();
    Object.defineProperty(global, 'navigator', {
      value: { vibrate },
      configurable: true,
    });
    triggerRunwaySectionHaptic();
    expect(vibrate).toHaveBeenCalledWith(10);
  });

  it('RunwayExperienceOrchestrator wires vertical touch handlers on stage', () => {
    const orchSrc = fs.readFileSync(
      path.join(
        process.cwd(),
        'src/components/product/scroll-switcher/RunwayExperienceOrchestrator.tsx'
      ),
      'utf8'
    );
    expect(orchSrc).toContain('onTouchStart');
    expect(orchSrc).toContain('onTouchMove');
    expect(orchSrc).toContain('onTouchEnd');
    expect(orchSrc).toContain('data-runway-stage');
  });
});

describe('runway phase21 upload runtime guard', () => {
  it('isRunwayUploadAllowedInRuntime allows dev by default', () => {
    const prev = process.env.NODE_ENV;
    process.env.NODE_ENV = 'development';
    expect(isRunwayUploadAllowedInRuntime()).toBe(true);
    process.env.NODE_ENV = prev;
  });
});
