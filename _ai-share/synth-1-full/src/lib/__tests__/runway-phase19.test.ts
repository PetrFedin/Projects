/**
 * Phase 19 — SSE analytics, bulk look cart, session auth preferences,
 * sitemap-runway, rate limit tiers, memo, CLI enable-product.
 */

import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import {
  formatRunwayAnalyticsSseEvent,
  buildRunwayAnalyticsDashboardSnapshot,
} from '@/lib/server/runway-analytics-sse';
import {
  resolveRunwayPreferencesUserId,
  resolveRunwaySessionUserId,
} from '@/lib/server/runway-preferences-auth';
import { checkRunwayRateLimit, resetRunwayRateLimitStore } from '@/lib/server/runway-rate-limit';
import { uniqueLookItemSlugs, resolveDefaultLookSize } from '@/lib/runway/runway-look-cart';
import { buildRunwayPreferencesRequestHeaders } from '@/lib/runway/runway-preferences-client';
import type { Product } from '@/lib/types';

describe('runway phase19 SSE analytics', () => {
  it('formatRunwayAnalyticsSseEvent wraps dashboard as data: JSON', () => {
    const payload = formatRunwayAnalyticsSseEvent({
      metrics: {
        scroll_experience_view: 1,
        scroll_experience_section_change: 0,
        scroll_experience_add_to_cart: 0,
        scroll_experience_share: 0,
        scroll_experience_wishlist_toggle: 0,
        updatedAt: new Date().toISOString(),
      },
      sectionPopularity: [],
      funnel: [],
      eventCount: 1,
    });
    expect(payload.startsWith('data: ')).toBe(true);
    expect(payload.endsWith('\n\n')).toBe(true);
    const json = JSON.parse(payload.slice(6).trim());
    expect(json.eventCount).toBe(1);
  });

  it('analytics stream route exists and uses SSE helpers', () => {
    const src = fs.readFileSync(
      path.join(process.cwd(), 'src/app/api/runway/analytics/stream/route.ts'),
      'utf8'
    );
    expect(src).toContain('text/event-stream');
    expect(src).toContain('buildRunwayAnalyticsDashboardSnapshot');
    expect(src).toContain('SSE_INTERVAL_MS');
  });

  it('buildRunwayAnalyticsDashboardSnapshot reads file store', async () => {
    const dash = await buildRunwayAnalyticsDashboardSnapshot();
    expect(dash.metrics).toBeTruthy();
    expect(typeof dash.eventCount).toBe('number');
  });

  it('BrandRunwayAnalyticsTab subscribes SSE when streamActive', () => {
    const src = fs.readFileSync(
      path.join(process.cwd(), 'src/components/brand/BrandRunwayAnalyticsTab.tsx'),
      'utf8'
    );
    expect(src).toContain('EventSource');
    expect(src).toContain('/api/runway/analytics/stream');
    expect(src).toContain('streamActive');
    expect(src).toContain('POLL_INTERVAL_MS');
  });
});

describe('runway phase19 bulk look cart', () => {
  it('uniqueLookItemSlugs deduplicates slugs', () => {
    expect(uniqueLookItemSlugs(['a', 'b', 'a', ''])).toEqual(['a', 'b']);
  });

  it('RunwayCompleteLook exposes add-all button', () => {
    const src = fs.readFileSync(
      path.join(process.cwd(), 'src/components/product/scroll-switcher/RunwayCompleteLook.tsx'),
      'utf8'
    );
    expect(src).toContain('data-runway-look-add-all');
    expect(src).toContain('addAllLookItems');
    expect(src).toContain('completeLook.addAll');
  });

  it('useRunwayLookCart implements addAllLookItems with partial failure', () => {
    const src = fs.readFileSync(path.join(process.cwd(), 'src/hooks/useRunwayLookCart.ts'), 'utf8');
    expect(src).toContain('addAllLookItems');
    expect(src).toContain('failed.push');
    expect(src).toContain('resolveDefaultLookSize');
  });

  it('resolveDefaultLookSize picks first size or One Size', () => {
    const withSizes = { sizes: [{ name: 'M' }, { name: 'L' }] } as Product;
    const noSizes = {} as Product;
    expect(resolveDefaultLookSize(withSizes)).toBe('M');
    expect(resolveDefaultLookSize(noSizes)).toBe('One Size');
  });

  it('i18n has Russian bulk cart toast', () => {
    const src = fs.readFileSync(path.join(process.cwd(), 'src/lib/runway/runway-i18n.ts'), 'utf8');
    expect(src).toContain("'runway.completeLook.addAll': 'Добавить образ'");
    expect(src).toContain("'runway.completeLook.addAllDone': '{count} товаров в корзине'");
  });
});

describe('runway phase19 session auth preferences', () => {
  function mockRequest(url: string, headers: Record<string, string> = {}): Request {
    const normalized = Object.fromEntries(
      Object.entries(headers).map(([k, v]) => [k.toLowerCase(), v])
    );
    return {
      url,
      headers: {
        get: (name: string) => normalized[name.toLowerCase()] ?? null,
      },
    } as unknown as Request;
  }

  it('resolveRunwaySessionUserId returns null without bearer', async () => {
    const req = mockRequest('http://localhost/api/runway/preferences');
    await expect(resolveRunwaySessionUserId(req)).resolves.toBeNull();
  });

  it('preferences route uses session-aware resolver', () => {
    const src = fs.readFileSync(
      path.join(process.cwd(), 'src/app/api/runway/preferences/route.ts'),
      'utf8'
    );
    expect(src).toContain('resolveRunwayPreferencesUserIdWithSession');
    expect(src).toContain('applyRunwayRouteRateLimit');
  });

  it('client headers prefer Authorization over dev header', () => {
    const original = global.localStorage;
    const store: Record<string, string> = { syntha_access_token: 'jwt-token' };
    Object.defineProperty(global, 'localStorage', {
      value: {
        getItem: (k: string) => store[k] ?? null,
      },
      configurable: true,
    });

    const headers = buildRunwayPreferencesRequestHeaders('dev-user');
    expect(headers.Authorization).toBe('Bearer jwt-token');
    expect(headers['X-Runway-User-Id']).toBeUndefined();

    Object.defineProperty(global, 'localStorage', { value: original, configurable: true });
  });

  it('dev fallback sends X-Runway-User-Id when no JWT', () => {
    const original = global.localStorage;
    Object.defineProperty(global, 'localStorage', {
      value: { getItem: () => null },
      configurable: true,
    });
    const headers = buildRunwayPreferencesRequestHeaders('mock-uid');
    expect(headers['X-Runway-User-Id']).toBe('mock-uid');
    Object.defineProperty(global, 'localStorage', { value: original, configurable: true });
  });

  it('legacy header resolver still works for dev', () => {
    const req = mockRequest('http://localhost/api/runway/preferences', {
      'X-Runway-User-Id': 'header-id',
    });
    expect(resolveRunwayPreferencesUserId(req)).toBe('header-id');
  });
});

describe('runway phase19 sitemap runway URLs', () => {
  it('sitemap.ts includes ?view=runway product URLs', () => {
    const src = fs.readFileSync(path.join(process.cwd(), 'src/app/sitemap.ts'), 'utf8');
    expect(src).toContain('view=runway');
    expect(src).toContain('productSupportsScrollVideo');
  });

  it('sitemap-runway.xml route lists scroll-video PDP URLs', () => {
    const src = fs.readFileSync(
      path.join(process.cwd(), 'src/app/sitemap-runway.xml/route.ts'),
      'utf8'
    );
    expect(src).toContain('view=runway');
    expect(src).toContain('application/xml');
  });
});

describe('runway phase19 performance memo + bundle', () => {
  it('SwitcherStage wrapped in React.memo', () => {
    const src = fs.readFileSync(
      path.join(process.cwd(), 'src/components/product/scroll-switcher/SwitcherStage.tsx'),
      'utf8'
    );
    expect(src).toContain('memo(SwitcherStageInner)');
  });

  it('SwitcherBar wrapped in React.memo', () => {
    const src = fs.readFileSync(
      path.join(process.cwd(), 'src/components/product/scroll-switcher/SwitcherBar.tsx'),
      'utf8'
    );
    expect(src).toContain('memo(SwitcherBarInner)');
  });

  it('production runbook documents bundle audit', () => {
    const doc = fs.readFileSync(
      path.join(process.cwd(), 'docs/runway-production-runbook.md'),
      'utf8'
    );
    expect(doc).toMatch(/bundle/i);
  });
});

describe('runway phase19 rate limit all routes', () => {
  beforeEach(() => resetRunwayRateLimitStore());

  it('read tier allows more requests than write tier', () => {
    let readBlocked = false;
    let writeBlocked = false;

    for (let i = 0; i < 150; i++) {
      if (!checkRunwayRateLimit('read:test-ip', 'read').allowed) readBlocked = true;
    }
    for (let i = 0; i < 150; i++) {
      if (!checkRunwayRateLimit('write:test-ip', 'write').allowed) writeBlocked = true;
    }

    expect(readBlocked).toBe(false);
    expect(writeBlocked).toBe(true);
  });

  it('config route applies read rate limit', () => {
    const src = fs.readFileSync(
      path.join(process.cwd(), 'src/app/api/runway/config/route.ts'),
      'utf8'
    );
    expect(src).toContain("applyRunwayRouteRateLimit(request, 'read')");
  });

  it('health route applies read rate limit', () => {
    const src = fs.readFileSync(
      path.join(process.cwd(), 'src/app/api/runway/health/route.ts'),
      'utf8'
    );
    expect(src).toContain("applyRunwayRouteRateLimit(request, 'read')");
  });

  it('preferences GET applies read rate limit', () => {
    const src = fs.readFileSync(
      path.join(process.cwd(), 'src/app/api/runway/preferences/route.ts'),
      'utf8'
    );
    expect(src).toMatch(/GET[\s\S]*applyRunwayRouteRateLimit\(request, 'read'\)/);
  });
});

describe('runway phase19 CLI enable product', () => {
  it('runway-enable-product.mjs script exists', () => {
    expect(fs.existsSync(path.join(process.cwd(), 'scripts/runway-enable-product.mjs'))).toBe(true);
  });

  it('CLI validates slug and outputs JSON patch', () => {
    const src = fs.readFileSync(
      path.join(process.cwd(), 'scripts/runway-enable-product.mjs'),
      'utf8'
    );
    expect(src).toContain('displayMode');
    expect(src).toContain('scroll-video');
    expect(src).toContain('--apply');
  });
});

describe('runway phase19 e2e coverage hooks', () => {
  it('e2e spec tests analytics SSE smoke', () => {
    const spec = fs.readFileSync(path.join(process.cwd(), 'e2e/runway.spec.ts'), 'utf8');
    expect(spec).toContain('/api/runway/analytics/stream');
  });

  it('e2e spec tests add-all look to cart', () => {
    const spec = fs.readFileSync(path.join(process.cwd(), 'e2e/runway.spec.ts'), 'utf8');
    expect(spec).toContain('data-runway-look-add-all');
  });
});

describe('runway phase19 preferences file store isolation', () => {
  const tmpFile = path.join(os.tmpdir(), `runway-prefs-p19-${process.pid}.json`);

  beforeAll(() => {
    process.env.RUNWAY_USER_PREFERENCES_FILE = tmpFile;
  });

  afterAll(async () => {
    const { resetRunwayUserPreferencesStore } =
      await import('@/lib/server/runway-user-preferences-store');
    await resetRunwayUserPreferencesStore();
    delete process.env.RUNWAY_USER_PREFERENCES_FILE;
    try {
      fs.unlinkSync(tmpFile);
    } catch {
      /* ignore */
    }
  });

  it('session user id path writes to distinct file key', async () => {
    const { writeRunwayUserPreferences, readRunwayUserPreferences } =
      await import('@/lib/server/runway-user-preferences-store');
    await writeRunwayUserPreferences('session-user-99', { 'silk-midi-dress': 0 });
    const prefs = await readRunwayUserPreferences('session-user-99');
    expect(prefs['silk-midi-dress']).toBe(0);
  });
});
