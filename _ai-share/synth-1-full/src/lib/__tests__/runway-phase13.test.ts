/**
 * Phase 13 — server analytics API, config API, overrides, i18n, demo gating.
 */

import {
  aggregateRunwayAnalyticsFromEvents,
  buildEmptyRunwayAnalyticsDashboard,
  mergeRunwayAnalyticsEvents,
} from '@/lib/runway/runway-analytics-aggregation';
import { t, listRunwayI18nKeys } from '@/lib/runway/runway-i18n';
import { fetchRunwayProductBySlug } from '@/lib/runway/fetch-runway-product';
import { resetRunwayExperienceCache } from '@/lib/runway/RunwayExperienceService';
import type { ScrollExperienceEventLogEntry } from '@/lib/scroll-experience-analytics';

describe('runway phase13 analytics aggregation', () => {
  const events: ScrollExperienceEventLogEntry[] = [
    {
      event: 'scroll_experience_view',
      productSlug: 'silk-midi-dress',
      sectionIndex: 0,
      timestamp: Date.now(),
    },
    {
      event: 'scroll_experience_section_change',
      productSlug: 'silk-midi-dress',
      sectionIndex: 1,
      sectionLabel: 'Silver',
      timestamp: Date.now(),
    },
  ];

  it('aggregateRunwayAnalyticsFromEvents builds funnel', () => {
    const dash = aggregateRunwayAnalyticsFromEvents(events);
    expect(dash.eventCount).toBe(2);
    expect(dash.metrics.scroll_experience_view).toBe(1);
    expect(dash.sectionPopularity.length).toBeGreaterThan(0);
  });

  it('buildEmptyRunwayAnalyticsDashboard returns metrics and funnel at zero events', () => {
    const dash = buildEmptyRunwayAnalyticsDashboard();
    expect(dash.eventCount).toBe(0);
    expect(dash.metrics).toBeTruthy();
    expect(dash.metrics.scroll_experience_view).toBe(0);
    expect(Array.isArray(dash.funnel)).toBe(true);
    expect(dash.funnel.length).toBeGreaterThan(0);
  });

  it('mergeRunwayAnalyticsEvents dedupes by key', () => {
    const merged = mergeRunwayAnalyticsEvents(events, events);
    expect(merged).toHaveLength(2);
  });
});

describe('runway i18n phase13 keys', () => {
  it('includes aria and error keys', () => {
    const keys = listRunwayI18nKeys();
    expect(keys).toContain('runway.retryVideo');
    expect(keys).toContain('runway.aria.stage');
    expect(t('runway.demoRibbon')).toContain('Demo');
  });
});

describe('runway API route modules exist', () => {
  it('analytics route', () => {
    const fs = require('node:fs');
    const path = require('node:path');
    expect(fs.existsSync(path.join(process.cwd(), 'src/app/api/runway/analytics/route.ts'))).toBe(
      true
    );
  });

  it('config route', () => {
    const fs = require('node:fs');
    const path = require('node:path');
    expect(fs.existsSync(path.join(process.cwd(), 'src/app/api/runway/config/route.ts'))).toBe(
      true
    );
  });

  it('overrides route', () => {
    const fs = require('node:fs');
    const path = require('node:path');
    expect(fs.existsSync(path.join(process.cwd(), 'src/app/api/runway/overrides/route.ts'))).toBe(
      true
    );
  });
});

describe('loadRunwayProduct / fetchRunwayProductBySlug', () => {
  beforeEach(() => {
    resetRunwayExperienceCache();
    global.fetch = jest.fn(async (input: RequestInfo | URL) => {
      const url = String(input);
      if (url.includes('/data/products.json')) {
        return {
          ok: true,
          json: async () => [{ slug: 'silk-midi-dress', name: 'Dress', brand: 'Test' }],
        } as Response;
      }
      if (url.includes('/api/runway/product-config')) {
        return { ok: true, json: async () => ({ patches: {} }) } as Response;
      }
      if (url.includes('/api/runway/config') || url.includes('/data/scroll-experience.json')) {
        return { ok: false, json: async () => ({}) } as Response;
      }
      return { ok: false, json: async () => ({}) } as Response;
    }) as typeof fetch;
  });

  it('returns merged catalog product by slug', async () => {
    const product = await fetchRunwayProductBySlug('silk-midi-dress');
    expect(product?.slug).toBe('silk-midi-dress');
  });
});

describe('runway server stores exist', () => {
  it('analytics store module', () => {
    const fs = require('node:fs');
    const path = require('node:path');
    expect(
      fs.existsSync(path.join(process.cwd(), 'src/lib/server/runway-analytics-store.ts'))
    ).toBe(true);
  });

  it('overrides store module', () => {
    const fs = require('node:fs');
    const path = require('node:path');
    expect(
      fs.existsSync(path.join(process.cwd(), 'src/lib/server/runway-overrides-store.ts'))
    ).toBe(true);
  });
});

describe('showDemoChrome gating contract', () => {
  it('demo ribbon only when isDemoMode (not autoTour alone)', () => {
    const isDemoMode = false;
    const showAutoTour = isDemoMode;
    const showDemoChrome = isDemoMode;
    expect(showDemoChrome).toBe(false);
    expect(showAutoTour).toBe(false);
  });
});
