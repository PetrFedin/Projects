/**
 * Phase 14 — i18n parity, API validation, rate limit, barrel exports.
 */

import {
  runwayAnalyticsPostBodySchema,
  runwayOverridesPostBodySchema,
} from '@/lib/server/runway-api-schemas';
import {
  checkRunwayAnalyticsRateLimit,
  checkRunwayRateLimit,
  resetRunwayRateLimitStore,
} from '@/lib/server/runway-rate-limit';
import {
  listRunwayI18nKeys,
  verifyRunwayI18nParity,
  t,
  setRunwayLocale,
} from '@/lib/runway/runway-i18n';

describe('runway phase14 i18n parity', () => {
  it('all RU keys exist in EN', () => {
    const { ok, missingInEn } = verifyRunwayI18nParity();
    expect(ok).toBe(true);
    expect(missingInEn).toEqual([]);
  });

  it('has 150+ i18n keys', () => {
    expect(listRunwayI18nKeys().length).toBeGreaterThanOrEqual(150);
  });

  it('EN locale returns translated strings', () => {
    setRunwayLocale('en');
    expect(t('runway.addToCart')).toBe('Add to cart');
    setRunwayLocale('ru');
    expect(t('runway.addToCart')).toBe('Добавить в корзину');
  });
});

describe('runway analytics POST schema', () => {
  it('rejects empty body', () => {
    const result = runwayAnalyticsPostBodySchema.safeParse({});
    expect(result.success).toBe(false);
  });

  it('rejects invalid event name', () => {
    const result = runwayAnalyticsPostBodySchema.safeParse({
      events: [{ event: 'invalid', productSlug: 'x', timestamp: Date.now() }],
    });
    expect(result.success).toBe(false);
  });

  it('accepts valid batch', () => {
    const result = runwayAnalyticsPostBodySchema.safeParse({
      events: [
        {
          event: 'scroll_experience_view',
          productSlug: 'silk-midi-dress',
          timestamp: Date.now(),
        },
      ],
    });
    expect(result.success).toBe(true);
  });

  it('rejects more than 100 events', () => {
    const events = Array.from({ length: 101 }, (_, i) => ({
      event: 'scroll_experience_view' as const,
      productSlug: `slug-${i}`,
      timestamp: Date.now(),
    }));
    const result = runwayAnalyticsPostBodySchema.safeParse({ events });
    expect(result.success).toBe(false);
  });
});

describe('runway overrides POST schema', () => {
  it('requires brandName, slug, patch for patch mode', () => {
    const result = runwayOverridesPostBodySchema.safeParse({ brandName: 'Brand' });
    expect(result.success).toBe(false);
  });

  it('accepts patch body', () => {
    const result = runwayOverridesPostBodySchema.safeParse({
      brandName: 'Syntha',
      slug: 'silk-midi-dress',
      patch: { displayMode: 'scroll-video' },
    });
    expect(result.success).toBe(true);
  });

  it('accepts replace body', () => {
    const result = runwayOverridesPostBodySchema.safeParse({
      replace: { Syntha: { 'silk-midi-dress': {} } },
    });
    expect(result.success).toBe(true);
  });
});

describe('runway analytics rate limit', () => {
  beforeEach(() => {
    resetRunwayRateLimitStore();
  });

  it('allows up to 100 requests per IP per minute', () => {
    const key = 'test-ip';
    for (let i = 0; i < 100; i++) {
      const r = checkRunwayAnalyticsRateLimit(key);
      expect(r.allowed).toBe(true);
    }
    const blocked = checkRunwayAnalyticsRateLimit(key);
    expect(blocked.allowed).toBe(false);
    expect(blocked.remaining).toBe(0);
  });

  it('tracks separate IPs independently', () => {
    expect(checkRunwayAnalyticsRateLimit('ip-a').allowed).toBe(true);
    expect(checkRunwayAnalyticsRateLimit('ip-b').allowed).toBe(true);
  });

  it('disables limits when E2E=true (Playwright serial API suite)', () => {
    const prevE2e = process.env.E2E;
    const prevPublic = process.env.NEXT_PUBLIC_E2E;
    process.env.E2E = 'true';
    resetRunwayRateLimitStore();
    const key = 'e2e-unknown';
    for (let i = 0; i < 150; i++) {
      expect(checkRunwayRateLimit(key, 'write').allowed).toBe(true);
    }
    process.env.E2E = prevE2e;
    process.env.NEXT_PUBLIC_E2E = prevPublic;
    resetRunwayRateLimitStore();
  });
});

describe('runway public barrel', () => {
  it('exports index module', () => {
    const barrel = require('@/lib/runway');
    expect(barrel.t).toBeDefined();
    expect(barrel.verifyRunwayI18nParity).toBeDefined();
    expect(barrel.aggregateRunwayAnalyticsFromEvents).toBeDefined();
  });
});

describe('runway architecture extractions', () => {
  it('RunwayCartActions module exists', () => {
    const fs = require('node:fs');
    const path = require('node:path');
    expect(
      fs.existsSync(
        path.join(process.cwd(), 'src/components/product/scroll-switcher/RunwayCartActions.tsx')
      )
    ).toBe(true);
  });

  it('RunwayMediaController module exists', () => {
    const fs = require('node:fs');
    const path = require('node:path');
    expect(
      fs.existsSync(
        path.join(process.cwd(), 'src/components/product/scroll-switcher/RunwayMediaController.tsx')
      )
    ).toBe(true);
  });

  it('ProductScrollSwitcher stays thin wrapper', () => {
    const fs = require('node:fs');
    const path = require('node:path');
    const src = fs.readFileSync(
      path.join(process.cwd(), 'src/components/product/ProductScrollSwitcher.tsx'),
      'utf8'
    );
    expect(src.split('\n').length).toBeLessThan(50);
  });
});

describe('runway e2e warmup contract', () => {
  it('runway uses setup project for post-server warmup', () => {
    const fs = require('node:fs');
    const path = require('node:path');
    const cfg = fs.readFileSync(path.join(process.cwd(), 'playwright.runway.config.ts'), 'utf8');
    expect(cfg).toContain('runway-setup');
    expect(cfg).toMatch(/runway\\.setup/);
  });

  it('runway.setup.ts warms API routes (lean — PDP warm in spec beforeAll)', () => {
    const fs = require('node:fs');
    const path = require('node:path');
    const setup = fs.readFileSync(path.join(process.cwd(), 'e2e/runway.setup.ts'), 'utf8');
    expect(setup).toContain('/api/runway/health');
    expect(setup).toContain('/api/runway/config');
    expect(setup).toContain('/api/products/silk-midi-dress');
  });

  it('runway.spec uses gotoRunwayProduct helper', () => {
    const fs = require('node:fs');
    const path = require('node:path');
    const spec = fs.readFileSync(path.join(process.cwd(), 'e2e/runway.spec.ts'), 'utf8');
    expect(spec).toContain('gotoRunwayProduct');
  });
});
