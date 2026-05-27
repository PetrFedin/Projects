/**
 * Phase 17 — analytics webhook, brand gate completeness, checkout shortcut,
 * user favorites sync, API data source, production runbook wiring.
 */

import fs from 'node:fs';
import path from 'node:path';
import {
  filterRunwayAvailableProducts,
  isBrandRunwayEnabled,
  isProductRunwayAvailable,
} from '@/lib/runway/runway-brand-gate';
import {
  normalizeScrollExperienceConfig,
  resolveAnalyticsWebhookUrl,
} from '@/lib/runway/scroll-experience-schema';
import { fireRunwayAnalyticsWebhook } from '@/lib/server/runway-analytics-webhook';
import { runwaySectionFavoritesKeyForUser } from '@/lib/scroll-switcher-constants';
import { verifyRunwayI18nParity, t } from '@/lib/runway/runway-i18n';
import type { Product } from '@/lib/types';

const scrollProduct: Product = {
  id: 'sv-1',
  slug: 'silk-midi-dress',
  name: 'Silk Midi Dress',
  brand: 'Nordic Wool',
  price: 89000,
  description: 'Runway demo dress',
  images: [{ id: '1', url: '/images/demo/runway/silk-midi-dress-section-0.jpg', alt: 'dress' }],
  category: 'Dresses',
  sustainability: [],
  sku: 'SILK-001',
  color: 'Sand',
  season: 'SS26',
  displayMode: 'scroll-video',
  scrollSwitcherSections: [
    {
      id: 'sand',
      label: 'Песочный',
      color: '#C4A882',
      sectionImageUrl: '/images/demo/runway/silk-midi-dress-section-0.jpg',
    },
  ],
};

describe('runway phase17 analyticsWebhookUrl', () => {
  it('resolveAnalyticsWebhookUrl prefers analyticsWebhookUrl over webhookUrl', () => {
    expect(
      resolveAnalyticsWebhookUrl({
        analyticsWebhookUrl: 'https://brand.example/hook',
        webhookUrl: 'https://legacy.example/hook',
      })
    ).toBe('https://brand.example/hook');
  });

  it('resolveAnalyticsWebhookUrl falls back to webhookUrl', () => {
    expect(resolveAnalyticsWebhookUrl({ webhookUrl: 'https://legacy.example/hook' })).toBe(
      'https://legacy.example/hook'
    );
  });

  it('schema normalizes analyticsWebhookUrl from raw JSON', () => {
    const config = normalizeScrollExperienceConfig({
      analyticsWebhookUrl: 'https://analytics.example/runway',
    });
    expect(config.analyticsWebhookUrl).toBe('https://analytics.example/runway');
  });

  it('fireRunwayAnalyticsWebhook POSTs payload and retries with backoff', async () => {
    const fetchMock = jest
      .fn()
      .mockImplementationOnce(async () => ({ ok: false, status: 503 }))
      .mockImplementationOnce(async () => ({ ok: false, status: 503 }))
      .mockImplementationOnce(async () => ({ ok: true, status: 200 }));
    global.fetch = fetchMock as typeof fetch;

    await fireRunwayAnalyticsWebhook('https://mock.test/runway', [
      {
        event: 'scroll_experience_view',
        productSlug: 'silk-midi-dress',
        timestamp: Date.now(),
      },
    ]);

    expect(fetchMock).toHaveBeenCalledTimes(3);
    const body = JSON.parse(String(fetchMock.mock.calls[0]?.[1]?.body));
    expect(body.source).toBe('syntha-runway');
    expect(body.events).toHaveLength(1);
    expect(fetchMock.mock.calls[0]?.[1]?.headers?.['Idempotency-Key']).toBeTruthy();
  });

  it('fireRunwayAnalyticsWebhook skips empty url', async () => {
    const fetchMock = jest.fn();
    global.fetch = fetchMock as typeof fetch;
    await fireRunwayAnalyticsWebhook(undefined, [
      { event: 'scroll_experience_view', productSlug: 'x', timestamp: 1 },
    ]);
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it('analytics route uses resolveAnalyticsWebhookUrl', () => {
    const src = fs.readFileSync(
      path.join(process.cwd(), 'src/app/api/runway/analytics/route.ts'),
      'utf8'
    );
    expect(src).toContain('resolveAnalyticsWebhookUrl');
    expect(src).toContain('fireRunwayAnalyticsWebhook');
  });
});

describe('runway phase17 brand gate completeness', () => {
  const disabledConfig = { brandRunwayEnabled: { 'Nordic Wool': false } };

  it('filterRunwayAvailableProducts excludes gated brands', () => {
    expect(filterRunwayAvailableProducts([scrollProduct], disabledConfig)).toHaveLength(0);
    expect(filterRunwayAvailableProducts([scrollProduct])).toHaveLength(1);
  });

  it('CatalogRunwayBadge checks isProductRunwayAvailable', () => {
    const src = fs.readFileSync(
      path.join(process.cwd(), 'src/components/product/scroll-switcher/CatalogRunwayBadge.tsx'),
      'utf8'
    );
    expect(src).toContain('isProductRunwayAvailable');
  });

  it('playlist filters with filterRunwayAvailableProducts', () => {
    const src = fs.readFileSync(
      path.join(
        process.cwd(),
        'src/components/product/scroll-switcher/RunwayPlaylistExperience.tsx'
      ),
      'utf8'
    );
    expect(src).toContain('filterRunwayAvailableProducts');
  });

  it('homepage featured respects brand gate', () => {
    const src = fs.readFileSync(
      path.join(process.cwd(), 'src/components/product/ProductScrollSwitcherFeatured.tsx'),
      'utf8'
    );
    expect(src).toContain('isProductRunwayAvailable');
  });

  it('embed page checks brand gate', () => {
    const src = fs.readFileSync(
      path.join(process.cwd(), 'src/app/embed/runway/[slug]/page.tsx'),
      'utf8'
    );
    expect(src).toContain('isProductRunwayAvailable');
  });

  it('search hover preview uses brand gate', () => {
    const src = fs.readFileSync(
      path.join(
        process.cwd(),
        'src/components/product/scroll-switcher/RunwaySearchHoverPreview.tsx'
      ),
      'utf8'
    );
    expect(src).toContain('isProductRunwayAvailable');
  });

  it('isBrandRunwayEnabled default true when brand missing in map', () => {
    expect(isBrandRunwayEnabled('Unknown Brand', disabledConfig)).toBe(true);
    expect(isProductRunwayAvailable(scrollProduct, disabledConfig)).toBe(false);
  });
});

describe('runway phase17 checkout shortcut', () => {
  it('RunwayCartActions links to /checkout', () => {
    const src = fs.readFileSync(
      path.join(process.cwd(), 'src/components/product/scroll-switcher/RunwayCartActions.tsx'),
      'utf8'
    );
    expect(src).toContain('data-runway-checkout-shortcut');
    expect(src).toContain('href="/checkout"');
    expect(src).toContain('runway.checkoutShortcut');
  });

  it('RunwayRichInfoPanel has desktop checkout shortcut', () => {
    const src = fs.readFileSync(
      path.join(process.cwd(), 'src/components/product/scroll-switcher/RunwayRichInfoPanel.tsx'),
      'utf8'
    );
    expect(src).toContain('data-runway-checkout-shortcut');
    expect(src).toContain('/checkout');
  });

  it('orchestrator exposes showCheckoutShortcut after add-to-cart', () => {
    const src = fs.readFileSync(
      path.join(process.cwd(), 'src/hooks/useRunwayExperienceOrchestration.ts'),
      'utf8'
    );
    expect(src).toContain('showCheckoutShortcut');
    expect(src).toContain('setShowCheckoutShortcut(true)');
  });
});

describe('runway phase17 user favorites sync', () => {
  it('preferences API route exists', () => {
    expect(fs.existsSync(path.join(process.cwd(), 'src/app/api/runway/preferences/route.ts'))).toBe(
      true
    );
  });

  it('favorites hook syncs to profile API when userId present', () => {
    const src = fs.readFileSync(
      path.join(process.cwd(), 'src/hooks/useRunwaySectionFavorites.ts'),
      'utf8'
    );
    expect(src).toContain('/api/runway/preferences');
    expect(src).toContain('runwaySectionFavoritesKeyForUser');
    expect(src).toContain('useAuth');
  });

  it('runwaySectionFavoritesKeyForUser scopes localStorage by uid', () => {
    expect(runwaySectionFavoritesKeyForUser('uid-42')).toContain('uid-42');
  });
});

describe('runway phase17 CI script + docs', () => {
  it('package.json defines test:runway script', () => {
    const pkg = JSON.parse(fs.readFileSync(path.join(process.cwd(), 'package.json'), 'utf8'));
    expect(pkg.scripts['test:runway']).toContain('--testPathPattern=runway');
    expect(pkg.scripts['test:runway']).toContain('validate-runway-content.mjs');
    expect(pkg.scripts['test:runway']).toContain('test:e2e:runway');
  });

  it('production runbook exists in Russian', () => {
    const doc = fs.readFileSync(
      path.join(process.cwd(), 'docs/runway-production-runbook.md'),
      'utf8'
    );
    expect(doc).toContain('Переменные окружения');
    expect(doc).toContain('/api/runway/health');
    expect(doc).toContain('brandRunwayEnabled');
  });

  it('product-scroll-switcher documents API data source e2e', () => {
    const doc = fs.readFileSync(
      path.join(process.cwd(), 'docs/product-scroll-switcher.md'),
      'utf8'
    );
    expect(doc).toContain('NEXT_PUBLIC_RUNWAY_DATA_SOURCE=api');
    expect(doc).toContain('api data source');
  });

  it('playwright runway config uses api data source for e2e', () => {
    const cfg = fs.readFileSync(path.join(process.cwd(), 'playwright.runway.config.ts'), 'utf8');
    expect(cfg).toContain('NEXT_PUBLIC_RUNWAY_DATA_SOURCE=api');
  });

  it('i18n parity after checkoutShortcut key', () => {
    expect(verifyRunwayI18nParity().ok).toBe(true);
    expect(t('runway.checkoutShortcut')).toBe('Оформить заказ');
  });
});

describe('runway phase17 dead-end audit', () => {
  const scrollSwitcherDir = path.join(process.cwd(), 'src/components/product/scroll-switcher');

  it('no href="#" in scroll-switcher components', () => {
    const files = fs.readdirSync(scrollSwitcherDir).filter((f) => f.endsWith('.tsx'));
    for (const file of files) {
      const src = fs.readFileSync(path.join(scrollSwitcherDir, file), 'utf8');
      expect(src).not.toContain('href="#"');
    }
  });

  it('no console.log in runway hooks/components', () => {
    const targets = [
      'src/hooks/useRunwaySectionPreload.ts',
      'src/hooks/useRunwayExperienceOrchestration.ts',
      'src/lib/scroll-experience-analytics.ts',
    ];
    for (const rel of targets) {
      const src = fs.readFileSync(path.join(process.cwd(), rel), 'utf8');
      expect(src).not.toMatch(/\bconsole\.log\(/);
    }
  });

  it('preload uses metadata video element not link as=video', () => {
    const src = fs.readFileSync(
      path.join(process.cwd(), 'src/hooks/useRunwaySectionPreload.ts'),
      'utf8'
    );
    expect(src).not.toContain("link.as = 'video'");
    expect(src).toContain("video.preload = 'metadata'");
  });
});
