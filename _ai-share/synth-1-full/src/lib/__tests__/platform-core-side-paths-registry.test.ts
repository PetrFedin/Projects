import {
  PLATFORM_CORE_BRAND_B2B_LEGACY_REDIRECTS,
  PLATFORM_CORE_SHOP_B2B_LEGACY_REDIRECTS,
  PLATFORM_CORE_SHOP_B2B_NAV_HIDDEN,
  allPlatformCoreLegacyRedirectTestIds,
  platformCoreShopB2bNavHiddenSet,
} from '@/lib/platform-core-side-paths-registry';

describe('platform-core-side-paths-registry', () => {
  it('re-exports shop + brand legacy redirects', () => {
    expect(PLATFORM_CORE_SHOP_B2B_LEGACY_REDIRECTS.length).toBeGreaterThanOrEqual(37);
    expect(PLATFORM_CORE_BRAND_B2B_LEGACY_REDIRECTS.length).toBeGreaterThanOrEqual(26);
  });

  it('allPlatformCoreLegacyRedirectTestIds — уникальные testId', () => {
    const ids = allPlatformCoreLegacyRedirectTestIds();
    expect(ids.length).toBe(
      PLATFORM_CORE_SHOP_B2B_LEGACY_REDIRECTS.length +
        PLATFORM_CORE_BRAND_B2B_LEGACY_REDIRECTS.length +
        1
    );
    expect(new Set(ids).size).toBe(ids.length);
  });

  it('nav hidden sets совпадают с константами', () => {
    const hidden = platformCoreShopB2bNavHiddenSet();
    for (const value of PLATFORM_CORE_SHOP_B2B_NAV_HIDDEN) {
      expect(hidden.has(value)).toBe(true);
    }
    expect(hidden.has('matrix')).toBe(false);
  });
});
