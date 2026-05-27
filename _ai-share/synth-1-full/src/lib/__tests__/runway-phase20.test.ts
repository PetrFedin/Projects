/**
 * Phase 20 — OpenAPI, CLI doctor, analytics pagination, Redis rate limit,
 * bundle check, enable wizard, production maturity.
 */

import fs from 'node:fs';
import path from 'node:path';
import {
  filterRunwayAnalyticsEventsByDateRange,
  paginateRunwayAnalyticsEvents,
  parseRunwayAnalyticsDateParam,
  resolveRunwayAnalyticsQueryFromUrl,
  runwayAnalyticsPresetRange,
} from '@/lib/runway/runway-analytics-query';
import {
  resolveRunwayRateLimitBackend,
  checkRunwayRateLimit,
  resetRunwayRateLimitStore,
  RUNWAY_RATE_LIMIT_TIERS,
} from '@/lib/server/runway-rate-limit';
import { evaluateRunwayHealth } from '@/lib/server/runway-health';
import type { ScrollExperienceEventLogEntry } from '@/lib/scroll-experience-analytics';

describe('runway phase20 OpenAPI', () => {
  it('docs/runway-api.openapi.yaml exists with paths', () => {
    const yaml = fs.readFileSync(path.join(process.cwd(), 'docs/runway-api.openapi.yaml'), 'utf8');
    expect(yaml).toContain('openapi: 3.1.0');
    expect(yaml).toContain('/analytics:');
    expect(yaml).toContain('/health:');
  });

  it('docs/runway-api.openapi.json exists for format=json route', () => {
    const json = fs.readFileSync(path.join(process.cwd(), 'docs/runway-api.openapi.json'), 'utf8');
    const doc = JSON.parse(json);
    expect(doc.openapi).toBe('3.1.0');
    expect(doc.paths['/analytics']).toBeTruthy();
  });

  it('GET /api/runway/openapi route serves yaml or json', () => {
    const src = fs.readFileSync(
      path.join(process.cwd(), 'src/app/api/runway/openapi/route.ts'),
      'utf8'
    );
    expect(src).toContain('runway-api.openapi.yaml');
    expect(src).toContain('format');
  });
});

describe('runway phase20 analytics query', () => {
  const events: ScrollExperienceEventLogEntry[] = [
    {
      event: 'scroll_experience_view',
      productSlug: 'a',
      timestamp: Date.UTC(2026, 4, 1),
    },
    {
      event: 'scroll_experience_view',
      productSlug: 'b',
      timestamp: Date.UTC(2026, 4, 10),
    },
    {
      event: 'scroll_experience_view',
      productSlug: 'c',
      timestamp: Date.UTC(2026, 4, 20),
    },
  ];

  it('parseRunwayAnalyticsDateParam parses YYYY-MM-DD', () => {
    expect(parseRunwayAnalyticsDateParam('2026-05-01')).toBe(Date.UTC(2026, 4, 1));
    expect(parseRunwayAnalyticsDateParam('bad')).toBeNull();
  });

  it('filterRunwayAnalyticsEventsByDateRange filters inclusive range', () => {
    const filtered = filterRunwayAnalyticsEventsByDateRange(events, '2026-05-01', '2026-05-15');
    expect(filtered.map((e) => e.productSlug)).toEqual(['a', 'b']);
  });

  it('paginateRunwayAnalyticsEvents returns page metadata', () => {
    const page = paginateRunwayAnalyticsEvents(events, 2, 2);
    expect(page.page).toBe(2);
    expect(page.items).toHaveLength(1);
    expect(page.totalPages).toBe(2);
  });

  it('resolveRunwayAnalyticsQueryFromUrl reads search params', () => {
    const url = new URL('http://x/api/runway/analytics?from=2026-05-01&page=2&pageSize=10');
    const q = resolveRunwayAnalyticsQueryFromUrl(url);
    expect(q.from).toBe('2026-05-01');
    expect(q.page).toBe(2);
    expect(q.pageSize).toBe(10);
  });

  it('runwayAnalyticsPresetRange returns last N days', () => {
    const range = runwayAnalyticsPresetRange(7);
    expect(range.from).toMatch(/^\d{4}-\d{2}-\d{2}$/);
    expect(range.to).toMatch(/^\d{4}-\d{2}-\d{2}$/);
  });

  it('analytics GET route applies date filter and eventsPage', () => {
    const src = fs.readFileSync(
      path.join(process.cwd(), 'src/app/api/runway/analytics/route.ts'),
      'utf8'
    );
    expect(src).toContain('filterRunwayAnalyticsEventsByDateRange');
    expect(src).toContain('paginateRunwayAnalyticsEvents');
    expect(src).toContain('eventsPage');
  });
});

describe('runway phase20 rate limit Redis optional', () => {
  beforeEach(() => resetRunwayRateLimitStore());

  it('resolveRunwayRateLimitBackend is memory without REDIS_URL', () => {
    const prev = process.env.REDIS_URL;
    delete process.env.REDIS_URL;
    expect(resolveRunwayRateLimitBackend()).toBe('memory');
    if (prev) process.env.REDIS_URL = prev;
  });

  it('resolveRunwayRateLimitBackend is redis when REDIS_URL set', () => {
    const prev = process.env.REDIS_URL;
    process.env.REDIS_URL = 'redis://localhost:6379';
    expect(resolveRunwayRateLimitBackend()).toBe('redis');
    if (prev) process.env.REDIS_URL = prev;
    else delete process.env.REDIS_URL;
  });

  it('checkRunwayRateLimit enforces write tier 100/min', () => {
    const tier = RUNWAY_RATE_LIMIT_TIERS.write;
    for (let i = 0; i < tier; i++) {
      expect(checkRunwayRateLimit('test-write', 'write').allowed).toBe(true);
    }
    expect(checkRunwayRateLimit('test-write', 'write').allowed).toBe(false);
  });

  it('applyRunwayRouteRateLimit is async', () => {
    const src = fs.readFileSync(
      path.join(process.cwd(), 'src/lib/server/runway-route-rate-limit.ts'),
      'utf8'
    );
    expect(src).toContain('async function applyRunwayRouteRateLimit');
    expect(src).toContain('checkRunwayRateLimitRedis');
  });

  it('health snapshot exposes rateLimitBackend', () => {
    const snap = evaluateRunwayHealth({ products: [], analyticsStoreWritable: true, config: null });
    expect(snap.rateLimitBackend).toBe('memory');
  });
});

describe('runway phase20 CLI scripts', () => {
  it('runway-enable-product.mjs validates and generates sections', () => {
    const src = fs.readFileSync(
      path.join(process.cwd(), 'scripts/runway-enable-product.mjs'),
      'utf8'
    );
    expect(src).toContain('buildSectionsFromColors');
    expect(src).toContain('validateSections');
    expect(src).toContain('postSteps');
    expect(src).toContain('runway-doctor.mjs');
  });

  it('runway-doctor.mjs runs validate + assets + health', () => {
    const src = fs.readFileSync(path.join(process.cwd(), 'scripts/runway-doctor.mjs'), 'utf8');
    expect(src).toContain('validate-runway-content.mjs');
    expect(src).toContain('brokenAssets');
    expect(src).toContain('/api/runway/health');
    expect(src).toContain('--skip-health');
  });

  it('runway-bundle-check.mjs warns and fails thresholds', () => {
    const src = fs.readFileSync(
      path.join(process.cwd(), 'scripts/runway-bundle-check.mjs'),
      'utf8'
    );
    expect(src).toContain('--warn-kb=');
    expect(src).toContain('--fail-kb=');
    expect(src).toContain('runway|scroll-switcher');
  });

  it('test:runway includes runway-doctor', () => {
    const pkg = JSON.parse(fs.readFileSync(path.join(process.cwd(), 'package.json'), 'utf8'));
    expect(pkg.scripts['test:runway']).toContain('runway-doctor.mjs');
  });
});

describe('runway phase20 brand admin wizard', () => {
  it('BrandRunwayPreviewTab has enable wizard', () => {
    const src = fs.readFileSync(
      path.join(process.cwd(), 'src/components/brand/BrandRunwayPreviewTab.tsx'),
      'utf8'
    );
    expect(src).toContain('data-runway-enable-wizard');
    expect(src).toContain('enableRunwayForWizard');
    expect(src).toContain('/api/runway/overrides');
    expect(src).toContain('brandCatalogProducts');
  });

  it('BrandRunwayAnalyticsTab has date presets and event table', () => {
    const src = fs.readFileSync(
      path.join(process.cwd(), 'src/components/brand/BrandRunwayAnalyticsTab.tsx'),
      'utf8'
    );
    expect(src).toContain('data-runway-analytics-preset');
    expect(src).toContain('data-runway-analytics-events');
    expect(src).toContain('runwayAnalyticsPresetRange');
    expect(src).toContain('eventsPage');
  });

  it('runway-i18n has wizard and analytics date keys', () => {
    const src = fs.readFileSync(path.join(process.cwd(), 'src/lib/runway/runway-i18n.ts'), 'utf8');
    expect(src).toContain('runway.enableWizard.title');
    expect(src).toContain('runway.analyticsLast7Days');
    expect(src).toContain('runway.analyticsEventsLog');
  });
});

describe('runway phase20 exports barrel', () => {
  it('index exports analytics query helpers', () => {
    const src = fs.readFileSync(path.join(process.cwd(), 'src/lib/runway/index.ts'), 'utf8');
    expect(src).toContain('runway-analytics-query');
    expect(src).toContain('filterRunwayAnalyticsEventsByDateRange');
  });
});
