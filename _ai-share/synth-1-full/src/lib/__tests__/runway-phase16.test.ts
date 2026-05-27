/**
 * Phase 16 — onboarding UX, preload, look cart, brand gate, CSV export, JSON-LD, webhook.
 */

import fs from 'node:fs';
import path from 'node:path';
import {
  dismissAllRunwayOnboardingHints,
  isRunwayOnboardingDismissed,
  isRunwayCompareHintDismissed,
} from '@/hooks/useRunwaySectionPersistence';
import { RUNWAY_ONBOARDING_AUTO_DISMISS_MS } from '@/lib/scroll-switcher-constants';
import {
  formatRunwayAnalyticsDashboardCsv,
  formatRunwayAnalyticsEventsCsv,
} from '@/lib/runway/runway-analytics-export';
import { isBrandRunwayEnabled, isProductRunwayAvailable } from '@/lib/runway/runway-brand-gate';
import {
  lookProductRequiresSize,
  resolveDefaultLookSize,
  resolveLookProductSizes,
} from '@/lib/runway/runway-look-cart';
import { buildRunwayProductJsonLd } from '@/lib/runway/runway-product-jsonld';
import { normalizeScrollExperienceConfig } from '@/lib/runway/scroll-experience-schema';
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

describe('runway phase16 onboarding persistence', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('dismissAllRunwayOnboardingHints sets all storage keys', () => {
    dismissAllRunwayOnboardingHints();
    expect(isRunwayCompareHintDismissed()).toBe(true);
    expect(isRunwayOnboardingDismissed()).toBe(true);
    expect(localStorage.getItem('runway-guided-tour-done')).toBe('1');
  });

  it('auto dismiss timeout is 8 seconds', () => {
    expect(RUNWAY_ONBOARDING_AUTO_DISMISS_MS).toBe(8000);
  });

  it('onboarding hint uses pointer-events-none on wrapper', () => {
    const src = fs.readFileSync(
      path.join(process.cwd(), 'src/components/product/scroll-switcher/RunwayOnboardingHint.tsx'),
      'utf8'
    );
    expect(src).toContain('pointer-events-none');
    expect(src).toContain('pointer-events-auto');
  });

  it('guided tour overlay does not block pointer events', () => {
    const src = fs.readFileSync(
      path.join(process.cwd(), 'src/components/product/scroll-switcher/RunwayGuidedTour.tsx'),
      'utf8'
    );
    expect(src).toContain('pointer-events-none fixed inset-0');
    expect(src).toContain('pointer-events-auto absolute z-10');
    expect(src).toContain('RUNWAY_ONBOARDING_AUTO_DISMISS_MS');
    expect(src).toContain("addEventListener('wheel'");
  });
});

describe('runway phase16 preload', () => {
  it('uses video element metadata preload instead of link as=video', () => {
    const src = fs.readFileSync(
      path.join(process.cwd(), 'src/hooks/useRunwaySectionPreload.ts'),
      'utf8'
    );
    expect(src).toContain("link.as = 'image'");
    expect(src).not.toContain("link.as = 'video'");
    expect(src).toContain("video.preload = 'metadata'");
  });
});

describe('runway phase16 brand gate', () => {
  it('brand disabled when explicitly false in config', () => {
    expect(
      isBrandRunwayEnabled('Demo Brand', { brandRunwayEnabled: { 'Demo Brand': false } })
    ).toBe(false);
  });

  it('isProductRunwayAvailable respects brand gate', () => {
    expect(
      isProductRunwayAvailable(scrollProduct, {
        brandRunwayEnabled: { 'Nordic Wool': false },
      })
    ).toBe(false);
    expect(isProductRunwayAvailable(scrollProduct)).toBe(true);
  });
});

describe('runway phase16 look cart helpers', () => {
  const sizedProduct: Product = {
    ...scrollProduct,
    slug: 'cashmere-crewneck-sweater',
    sizes: [{ name: 'S' }, { name: 'M' }],
  };

  it('resolveDefaultLookSize picks first size', () => {
    expect(resolveDefaultLookSize(sizedProduct)).toBe('S');
  });

  it('lookProductRequiresSize when sizes exist', () => {
    expect(lookProductRequiresSize(sizedProduct)).toBe(true);
    expect(lookProductRequiresSize({ ...scrollProduct, sizes: undefined })).toBe(false);
  });

  it('resolveLookProductSizes returns unique list', () => {
    expect(resolveLookProductSizes(sizedProduct)).toEqual(['S', 'M']);
  });
});

describe('runway phase16 JSON-LD', () => {
  it('buildRunwayProductJsonLd includes color variant', () => {
    const jsonLd = buildRunwayProductJsonLd(scrollProduct, { view: 'runway', section: '0' });
    expect(jsonLd).toBeTruthy();
    expect(jsonLd?.['@type']).toBe('Product');
    expect(jsonLd?.color).toBe('Песочный');
    expect(jsonLd?.offers).toMatchObject({ priceCurrency: 'RUB' });
  });

  it('returns null for standard PDP view', () => {
    expect(buildRunwayProductJsonLd(scrollProduct, {})).toBeNull();
  });
});

describe('runway phase16 analytics CSV export', () => {
  it('formats events CSV with header row', () => {
    const csv = formatRunwayAnalyticsEventsCsv([
      {
        event: 'scroll_experience_view',
        productSlug: 'silk-midi-dress',
        timestamp: 1,
      },
    ]);
    expect(csv.split('\n')[0]).toContain('timestamp,event,productSlug');
    expect(csv).toContain('silk-midi-dress');
  });

  it('formats dashboard CSV with KPI section', () => {
    const csv = formatRunwayAnalyticsDashboardCsv({
      metrics: {
        scroll_experience_view: 3,
        scroll_experience_section_change: 2,
        scroll_experience_add_to_cart: 1,
        scroll_experience_share: 0,
        scroll_experience_wishlist_toggle: 0,
        updatedAt: new Date().toISOString(),
      },
      sectionPopularity: [],
      funnel: [],
      eventCount: 0,
    });
    expect(csv).toContain('# KPI');
    expect(csv).toContain('views,3');
  });

  it('export API route exists', () => {
    expect(
      fs.existsSync(path.join(process.cwd(), 'src/app/api/runway/analytics/export/route.ts'))
    ).toBe(true);
  });
});

describe('runway phase16 config + i18n', () => {
  it('scroll-experience schema accepts brandRunwayEnabled', () => {
    const raw = JSON.parse(
      fs.readFileSync(path.join(process.cwd(), 'public/data/scroll-experience.json'), 'utf8')
    );
    const config = normalizeScrollExperienceConfig(raw);
    expect(config.brandRunwayEnabled).toBeTruthy();
  });

  it('sitemap includes runway playlist', () => {
    const src = fs.readFileSync(path.join(process.cwd(), 'src/app/sitemap.ts'), 'utf8');
    expect(src).toContain('view=runway');
    expect(src).toContain('/runway/playlist');
  });

  it('complete look add button is wired in component', () => {
    const src = fs.readFileSync(
      path.join(process.cwd(), 'src/components/product/scroll-switcher/RunwayCompleteLook.tsx'),
      'utf8'
    );
    expect(src).toContain('data-runway-look-add');
    expect(src).toContain('useRunwayLookCart');
  });

  it('orchestrator destructures lookCatalogProducts for complete look cart', () => {
    const src = fs.readFileSync(
      path.join(
        process.cwd(),
        'src/components/product/scroll-switcher/RunwayExperienceOrchestrator.tsx'
      ),
      'utf8'
    );
    expect(src).toContain('lookCatalogProducts');
    expect(src).toMatch(/lookCatalogProducts,\s*\n\s*adjacentBrandProducts/);
  });

  it('i18n parity after phase16 keys', () => {
    expect(verifyRunwayI18nParity().ok).toBe(true);
    expect(t('runway.analyticsExportCsv')).toBe('Экспорт CSV');
    expect(t('runway.completeLook.add')).toBe('Добавить');
  });
});

describe('runway phase16 webhook wiring', () => {
  it('analytics POST triggers webhook helper', () => {
    const src = fs.readFileSync(
      path.join(process.cwd(), 'src/app/api/runway/analytics/route.ts'),
      'utf8'
    );
    expect(src).toContain('fireRunwayAnalyticsWebhook');
  });
});
