/**
 * Phase 11 — kiosk, compare, i18n, analytics aggregation, embed metadata.
 */

import {
  clampCompareIndices,
  parseCompareParam,
  parseKioskAutoadvanceMs,
  parseKioskFromUrl,
  resolveKioskMode,
} from '@/lib/runway/runway-mode-utils';
import { t, listRunwayI18nKeys, setRunwayLocale } from '@/lib/runway/runway-i18n';
import { aggregateRunwayAnalytics } from '@/lib/runway/runway-analytics-aggregation';

describe('runway-mode-utils', () => {
  it('parseKioskFromUrl accepts 1 and true', () => {
    expect(parseKioskFromUrl('1')).toBe(true);
    expect(parseKioskFromUrl('true')).toBe(true);
    expect(parseKioskFromUrl('0')).toBe(false);
    expect(parseKioskFromUrl(null)).toBe(false);
  });

  it('resolveKioskMode from URL or config', () => {
    expect(resolveKioskMode({ kioskParam: '1' })).toBe(true);
    expect(resolveKioskMode({ enableKioskMode: true })).toBe(true);
    expect(resolveKioskMode({ kioskParam: null, enableKioskMode: false })).toBe(false);
  });

  it('parseKioskAutoadvanceMs converts ?autoadvance seconds to ms', () => {
    expect(parseKioskAutoadvanceMs('30', 12000)).toBe(30000);
    expect(parseKioskAutoadvanceMs(null, 12000)).toBe(12000);
    expect(parseKioskAutoadvanceMs('bad', 12000)).toBe(12000);
  });

  it('parseCompareParam parses valid pairs', () => {
    expect(parseCompareParam('0,2')).toEqual([0, 2]);
    expect(parseCompareParam('1, 0')).toEqual([1, 0]);
  });

  it('parseCompareParam rejects invalid input', () => {
    expect(parseCompareParam('0')).toBeNull();
    expect(parseCompareParam('0,0')).toBeNull();
    expect(parseCompareParam('a,b')).toBeNull();
    expect(parseCompareParam(undefined)).toBeNull();
  });

  it('clampCompareIndices respects section count', () => {
    expect(clampCompareIndices([0, 2], 3)).toEqual([0, 2]);
    expect(clampCompareIndices([0, 9], 3)).toEqual([0, 2]);
    expect(clampCompareIndices([0, 1], 1)).toBeNull();
  });
});

describe('runway-i18n', () => {
  it('exposes all RU keys via t()', () => {
    const keys = listRunwayI18nKeys();
    expect(keys.length).toBeGreaterThanOrEqual(10);
    for (const key of keys) {
      expect(t(key).length).toBeGreaterThan(0);
    }
  });

  it('supports EN locale switch', () => {
    setRunwayLocale('en');
    expect(t('runway.addToCart')).toBe('Add to cart');
    setRunwayLocale('ru');
    expect(t('runway.addToCart')).toBe('Добавить в корзину');
  });

  it('interpolates placeholders', () => {
    expect(t('runway.mobileVariant', { current: 2, total: 3 })).toContain('2');
    expect(t('runway.mobileVariant', { current: 2, total: 3 })).toContain('3');
  });
});

describe('runway-analytics-aggregation', () => {
  it('returns production dashboard shape', () => {
    const dash = aggregateRunwayAnalytics();
    expect(dash).not.toHaveProperty('isDemo');
    expect(dash.funnel.length).toBe(4);
    expect(dash.funnel[0]?.step).toBe('view');
    expect(dash.metrics).toHaveProperty('scroll_experience_view');
    expect(typeof dash.eventCount).toBe('number');
  });

  it('builds funnel conversion rates', () => {
    const dash = aggregateRunwayAnalytics();
    expect(dash.funnel[0]?.rateFromPrevious).toBeNull();
    expect(typeof dash.funnel[1]?.count).toBe('number');
  });
});

describe('embed route metadata', () => {
  it('layout exports iframe-friendly metadata flags', async () => {
    const mod = await import('@/app/embed/runway/[slug]/layout');
    expect(mod.metadata?.title).toMatch(/Runway Embed/i);
    expect(mod.metadata?.robots).toEqual({ index: false, follow: false });
  });
});

describe('scroll-experience event log', () => {
  it('readScrollExperienceEventLog returns array when empty', async () => {
    const { readScrollExperienceEventLog } = await import('@/lib/scroll-experience-analytics');
    expect(Array.isArray(readScrollExperienceEventLog())).toBe(true);
  });
});

describe('runway phase11 constants', () => {
  it('exports kiosk interval and guided tour key', async () => {
    const c = await import('@/lib/scroll-switcher-constants');
    expect(c.RUNWAY_KIOSK_TOUR_INTERVAL_MS).toBe(12000);
    expect(c.RUNWAY_GUIDED_TOUR_STORAGE_KEY).toBe('runway-guided-tour-done');
    expect(c.RUNWAY_MOBILE_TOUCH_MIN_PX).toBeGreaterThanOrEqual(44);
  });
});

describe('scroll-experience schema kiosk', () => {
  it('normalizes enableKioskMode from features.kioskMode', async () => {
    const { normalizeScrollExperienceConfig } =
      await import('@/lib/runway/scroll-experience-schema');
    const cfg = normalizeScrollExperienceConfig({ features: { kioskMode: true } });
    expect(cfg.enableKioskMode).toBe(true);
  });
});
