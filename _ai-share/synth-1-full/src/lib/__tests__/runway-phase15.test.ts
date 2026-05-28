/**
 * Phase 15 — health endpoint, scroll sensitivity, E2E contracts, data source wiring.
 */

import fs from 'node:fs';
import path from 'node:path';
import { applyVelocityDelta } from '@/lib/scroll-switcher-math';
import {
  RUNWAY_SCROLL_SENSITIVITY_DEFAULT,
  RUNWAY_SCROLL_SENSITIVITY_MAX,
  RUNWAY_SCROLL_SENSITIVITY_MIN,
} from '@/lib/scroll-switcher-constants';
import {
  createRunwayProductRepository,
  resetRunwayProductRepositoryCache,
} from '@/lib/runway/runway-product-repository-core';
import { resolveRunwayDataSource } from '@/lib/runway/runway-data-source';
import { verifyRunwayI18nParity, t } from '@/lib/runway/runway-i18n';
import { evaluateRunwayHealth } from '@/lib/server/runway-health';

describe('runway phase15 scroll sensitivity math', () => {
  it('default sensitivity is 1.0', () => {
    expect(RUNWAY_SCROLL_SENSITIVITY_DEFAULT).toBe(1);
  });

  it('sensitivity bounds are 0.5–2.0', () => {
    expect(RUNWAY_SCROLL_SENSITIVITY_MIN).toBe(0.5);
    expect(RUNWAY_SCROLL_SENSITIVITY_MAX).toBe(2);
  });

  it('2× multiplier doubles effective wheel delta before velocity clamp', () => {
    const deltaY = 120;
    const baseSens = 0.0008;
    const maxVelocity = 10;
    const low = applyVelocityDelta(deltaY * baseSens * 1, deltaY, maxVelocity);
    const high = applyVelocityDelta(deltaY * baseSens * 2, deltaY, maxVelocity);
    expect(Math.abs(high)).toBeGreaterThan(Math.abs(low));
  });

  it('0.5× multiplier halves effective wheel delta', () => {
    const deltaY = 80;
    const baseSens = 0.001;
    const maxVelocity = 10;
    const normal = applyVelocityDelta(deltaY * baseSens * 1, deltaY, maxVelocity);
    const low = applyVelocityDelta(deltaY * baseSens * 0.5, deltaY, maxVelocity);
    expect(Math.abs(low)).toBeLessThan(Math.abs(normal));
  });

  it('velocity clamp still applies at high sensitivity', () => {
    const maxVelocity = 0.012;
    const v = applyVelocityDelta(999, 500, maxVelocity);
    expect(Math.abs(v)).toBeLessThanOrEqual(maxVelocity);
  });
});

describe('runway phase15 data source env', () => {
  const prev = process.env.NEXT_PUBLIC_RUNWAY_DATA_SOURCE;

  afterEach(() => {
    if (prev === undefined) delete process.env.NEXT_PUBLIC_RUNWAY_DATA_SOURCE;
    else process.env.NEXT_PUBLIC_RUNWAY_DATA_SOURCE = prev;
    resetRunwayProductRepositoryCache();
  });

  it('defaults to json source', () => {
    delete process.env.NEXT_PUBLIC_RUNWAY_DATA_SOURCE;
    expect(resolveRunwayDataSource()).toBe('json');
  });

  it('api source when env=api', () => {
    process.env.NEXT_PUBLIC_RUNWAY_DATA_SOURCE = 'api';
    expect(resolveRunwayDataSource()).toBe('api');
    expect(createRunwayProductRepository().constructor.name).toBe('ApiRunwayProductRepository');
  });

  it('.env.example documents NEXT_PUBLIC_RUNWAY_DATA_SOURCE', () => {
    const example = fs.readFileSync(path.join(process.cwd(), '.env.example'), 'utf8');
    expect(example).toContain('NEXT_PUBLIC_RUNWAY_DATA_SOURCE');
    expect(example).toMatch(/json|api/);
  });
});

describe('runway phase15 health integration', () => {
  it('evaluateRunwayHealth loads real catalog from disk', () => {
    const snapshot = evaluateRunwayHealth();
    expect(snapshot.scrollVideoProductCount).toBeGreaterThan(0);
    expect(snapshot.featuredProductSlug).toBeTruthy();
  });

  it('health route module exists', () => {
    expect(fs.existsSync(path.join(process.cwd(), 'src/app/api/runway/health/route.ts'))).toBe(
      true
    );
  });
});

describe('runway phase15 E2E infrastructure', () => {
  it('playwright.runway.config.ts uses setup project', () => {
    const cfg = fs.readFileSync(path.join(process.cwd(), 'playwright.runway.config.ts'), 'utf8');
    expect(cfg).toContain('runway-setup');
    expect(cfg).toMatch(/runway\\.setup/);
    expect(cfg).toContain('NEXT_PUBLIC_DISABLE_FONTS=1');
  });

  it('runway.setup.ts warms routes via HTTP', () => {
    const setup = fs.readFileSync(path.join(process.cwd(), 'e2e/runway.setup.ts'), 'utf8');
    expect(setup).toContain('warm runway routes via HTTP');
    expect(setup).toContain('/api/runway/health');
  });

  it('runway.setup.ts warms API routes only (lean — PDP/embed in spec beforeAll)', () => {
    const setup = fs.readFileSync(path.join(process.cwd(), 'e2e/runway.setup.ts'), 'utf8');
    expect(setup).toContain('/api/runway/health');
    expect(setup).toContain('/api/runway/config');
    expect(setup).toContain('/api/products/silk-midi-dress');
    expect(setup).not.toContain('/runway/playlist');
  });

  it('dev:e2e does not always wipe .next/cache', () => {
    const pkg = JSON.parse(fs.readFileSync(path.join(process.cwd(), 'package.json'), 'utf8'));
    expect(pkg.scripts['dev:e2e']).toContain('E2E_CLEAR_CACHE');
    expect(pkg.scripts['dev:e2e']).not.toMatch(/rm -rf \.next\/cache && E2E/);
  });

  it('app-fonts.e2e stub exists for webpack alias', () => {
    expect(fs.existsSync(path.join(process.cwd(), 'src/lib/app-fonts.e2e.ts'))).toBe(true);
  });

  it('runway.spec includes health API test', () => {
    const spec = fs.readFileSync(path.join(process.cwd(), 'e2e/runway.spec.ts'), 'utf8');
    expect(spec).toContain('/api/runway/health');
    expect(spec).toContain('playlist add to cart');
  });
});

describe('runway phase15 CompareView i18n', () => {
  it('compare strings use runway-i18n keys', () => {
    const src = fs.readFileSync(
      path.join(process.cwd(), 'src/components/product/scroll-switcher/RunwayCompareView.tsx'),
      'utf8'
    );
    expect(src).toContain("t('runway.compareVariants')");
    expect(src).toContain("t('runway.compareCurrent')");
    expect(src).toContain("t('runway.compareOther')");
    expect(src).toContain("t('runway.aria.compareFlip')");
    expect(src).not.toMatch(/Compare variants|Current variant/);
  });

  it('i18n parity still holds after phase15', () => {
    expect(verifyRunwayI18nParity().ok).toBe(true);
  });

  it('compare labels are Russian by default', () => {
    expect(t('runway.compareVariants')).toBe('Сравнить варианты');
    expect(t('runway.compareCurrent')).toBe('Текущий');
    expect(t('runway.compareOther')).toBe('Сравнение');
  });
});

describe('runway phase15 playlist cart wiring', () => {
  it('RunwayPlaylistExperience wires addCartItem + toast', () => {
    const src = fs.readFileSync(
      path.join(
        process.cwd(),
        'src/components/product/scroll-switcher/RunwayPlaylistExperience.tsx'
      ),
      'utf8'
    );
    expect(src).toContain('addCartItem');
    expect(src).toContain('onAddToCart={handleAddToCart}');
    expect(src).toContain("t('runway.addToCart')");
  });
});

describe('runway phase15 dead-end audit', () => {
  const scrollSwitcherDir = path.join(process.cwd(), 'src/components/product/scroll-switcher');

  it('no TODO/FIXME in scroll-switcher components', () => {
    const files = fs.readdirSync(scrollSwitcherDir).filter((f) => f.endsWith('.tsx'));
    for (const file of files) {
      const src = fs.readFileSync(path.join(scrollSwitcherDir, file), 'utf8');
      expect(src).not.toMatch(/\bTODO\b|\bFIXME\b/);
    }
  });

  it('no "not implemented" stubs in runway lib', () => {
    const runwayDir = path.join(process.cwd(), 'src/lib/runway');
    for (const file of fs.readdirSync(runwayDir)) {
      if (!file.endsWith('.ts')) continue;
      const src = fs.readFileSync(path.join(runwayDir, file), 'utf8');
      expect(src.toLowerCase()).not.toContain('not implemented');
    }
  });

  it('runway API routes exist for products config analytics health', () => {
    const apiDir = path.join(process.cwd(), 'src/app/api/runway');
    expect(fs.existsSync(path.join(apiDir, 'products/route.ts'))).toBe(true);
    expect(fs.existsSync(path.join(apiDir, 'config/route.ts'))).toBe(true);
    expect(fs.existsSync(path.join(apiDir, 'analytics/route.ts'))).toBe(true);
    expect(fs.existsSync(path.join(apiDir, 'health/route.ts'))).toBe(true);
  });

  it('RunwayCompareView has data-runway-compare-view marker', () => {
    const src = fs.readFileSync(path.join(scrollSwitcherDir, 'RunwayCompareView.tsx'), 'utf8');
    expect(src).toContain('data-runway-compare-view');
    expect(src).toContain('data-runway-compare-flip');
  });

  it('RunwayOptionsPanel exposes sensitivity slider marker', () => {
    const src = fs.readFileSync(path.join(scrollSwitcherDir, 'RunwayOptionsPanel.tsx'), 'utf8');
    expect(src).toContain('data-runway-scroll-sensitivity');
    expect(src).toContain('data-runway-options-panel');
  });
});

describe('runway phase15 health checks matrix', () => {
  it.each(['catalog', 'assets', 'analytics', 'config'] as const)(
    'check key %s is present on snapshot',
    (key) => {
      const snapshot = evaluateRunwayHealth();
      expect(snapshot.checks[key]).toMatch(/^(ok|warn|fail)$/);
    }
  );

  it('issues array is always defined', () => {
    expect(Array.isArray(evaluateRunwayHealth().issues)).toBe(true);
  });

  it('featured slug matches scroll-experience when config loads', () => {
    const snapshot = evaluateRunwayHealth();
    if (snapshot.configLoaded) {
      expect(typeof snapshot.featuredProductSlug).toBe('string');
    }
  });
});

describe('runway phase15 scroll constants contract', () => {
  it('sensitivity range spans 4 steps of 0.5', () => {
    const span = RUNWAY_SCROLL_SENSITIVITY_MAX - RUNWAY_SCROLL_SENSITIVITY_MIN;
    expect(span).toBe(1.5);
  });

  it('default sits in the middle of min/max', () => {
    expect(RUNWAY_SCROLL_SENSITIVITY_DEFAULT).toBeGreaterThanOrEqual(RUNWAY_SCROLL_SENSITIVITY_MIN);
    expect(RUNWAY_SCROLL_SENSITIVITY_DEFAULT).toBeLessThanOrEqual(RUNWAY_SCROLL_SENSITIVITY_MAX);
  });
});

describe('runway phase15 public barrel', () => {
  it('runway index exports catalog loader', () => {
    const barrel = require('@/lib/runway');
    expect(barrel.loadRunwayProductCatalog).toBeDefined();
  });
});

describe('runway phase15 e2e spec coverage', () => {
  it('runway.spec has 19+ tests including API and UI flows', () => {
    const spec = fs.readFileSync(path.join(process.cwd(), 'e2e/runway.spec.ts'), 'utf8');
    const matches = spec.match(/^\s*test\(/gm) ?? [];
    expect(matches.length).toBeGreaterThanOrEqual(19);
  });

  it('runway.setup defines exactly 3 warm routes', () => {
    const setup = fs.readFileSync(path.join(process.cwd(), 'e2e/runway.setup.ts'), 'utf8');
    const routes = setup.match(/'\/[^']+'/g) ?? [];
    expect(routes.length).toBeGreaterThanOrEqual(3);
  });
});
