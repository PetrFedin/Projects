import {
  PLATFORM_CORE_B2B_HUB_HREF,
  PLATFORM_CORE_B2B_MARKETROOM_HREF,
  PLATFORM_CORE_B2B_PARTNERS_HREF,
  PLATFORM_CORE_B2C_HUB_HREF,
  isPlatformCoreB2bHubPath,
  isPlatformCoreB2cHubPath,
  resolvePlatformCoreB2bNavView,
  resolvePlatformCoreSurfaceMode,
} from '@/lib/platform-core-mode-surfaces';

describe('platform-core-mode-surfaces', () => {
  it('detects B2B hub paths', () => {
    expect(isPlatformCoreB2bHubPath('/platform/b2b')).toBe(true);
    expect(isPlatformCoreB2bHubPath('/platform/b2b/marketroom')).toBe(true);
    expect(isPlatformCoreB2bHubPath('/platform/b2b/partners')).toBe(true);
    expect(isPlatformCoreB2bHubPath('/marketroom')).toBe(false);
    expect(isPlatformCoreB2bHubPath('/brands')).toBe(false);
    expect(isPlatformCoreB2bHubPath('/platform')).toBe(false);
  });

  it('detects B2C hub path', () => {
    expect(isPlatformCoreB2cHubPath('/platform')).toBe(true);
    expect(isPlatformCoreB2cHubPath('/platform/b2b/marketroom')).toBe(false);
  });

  it('resolves surface mode and B2B nav view', () => {
    expect(resolvePlatformCoreSurfaceMode('/platform')).toBe('b2c');
    expect(resolvePlatformCoreSurfaceMode('/platform/b2b/partners')).toBe('b2b');
    expect(resolvePlatformCoreB2bNavView('/platform/b2b/marketroom')).toBe('marketroom');
    expect(resolvePlatformCoreB2bNavView('/platform/b2b/partners')).toBe('partners');
    expect(resolvePlatformCoreB2bNavView('/platform/b2b')).toBe('hub');
    expect(resolvePlatformCoreB2bNavView('/platform/b2b?pcf=hub')).toBe('hub');
  });

  it('exports stable hrefs', () => {
    expect(PLATFORM_CORE_B2C_HUB_HREF).toBe('/platform');
    expect(PLATFORM_CORE_B2B_HUB_HREF).toBe('/platform/b2b');
    expect(PLATFORM_CORE_B2B_MARKETROOM_HREF).toBe('/platform/b2b/marketroom');
    expect(PLATFORM_CORE_B2B_PARTNERS_HREF).toBe('/platform/b2b/partners');
  });
});
