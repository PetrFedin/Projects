import {
  applyBrandCorePillarsClusterOverrides,
  applyShopCorePillarsClusterOverrides,
  applyShopNavPipeline,
  isPlatformCoreMode,
  shouldHideNavArchiveCluster,
  shouldShowFloatingRolePanel,
} from '@/lib/cabinet-core-mode';

describe('cabinet-core-mode', () => {
  const prev = process.env.NEXT_PUBLIC_PLATFORM_CORE_MODE;

  afterEach(() => {
    if (prev === undefined) delete process.env.NEXT_PUBLIC_PLATFORM_CORE_MODE;
    else process.env.NEXT_PUBLIC_PLATFORM_CORE_MODE = prev;
  });

  it('is off by default', () => {
    delete process.env.NEXT_PUBLIC_PLATFORM_CORE_MODE;
    expect(isPlatformCoreMode()).toBe(false);
    expect(shouldHideNavArchiveCluster()).toBe(false);
    expect(shouldShowFloatingRolePanel()).toBe(true);
  });

  it('archives non-pillar brand groups when core on', () => {
    process.env.NEXT_PUBLIC_PLATFORM_CORE_MODE = '1';
    const base = [
      { id: 'development', clusterId: 'syntha-cores' },
      { id: 'team', clusterId: 'syntha-cores' },
      { id: 'b2b', clusterId: 'syntha-cores' },
    ] as const;
    const out = applyBrandCorePillarsClusterOverrides(base);
    expect(out.find((g) => g.id === 'development')?.clusterId).toBe('syntha-cores');
    expect(out.find((g) => g.id === 'team')?.clusterId).toBe('archive');
    expect(out.find((g) => g.id === 'b2b')?.clusterId).toBe('syntha-cores');
    expect(shouldHideNavArchiveCluster()).toBe(true);
    expect(shouldShowFloatingRolePanel()).toBe(false);
  });

  it('forces syntha-cores on allowed shop pillars even if previously archived', () => {
    process.env.NEXT_PUBLIC_PLATFORM_CORE_MODE = '1';
    const base = [
      { id: 'partners', clusterId: 'archive' },
      { id: 'logistics', clusterId: 'syntha-cores' },
    ] as const;
    const out = applyShopCorePillarsClusterOverrides(base);
    expect(out.find((g) => g.id === 'partners')?.clusterId).toBe('syntha-cores');
    expect(out.find((g) => g.id === 'logistics')?.clusterId).toBe('archive');
  });

  it('shop nav pipeline restores partners after investor spine', () => {
    process.env.NEXT_PUBLIC_PLATFORM_CORE_MODE = '1';
    const out = applyShopNavPipeline([
      { id: 'partners', clusterId: 'archive' },
      { id: 'logistics', clusterId: 'syntha-cores' },
    ] as const);
    expect(out.find((g) => g.id === 'partners')?.clusterId).toBe('syntha-cores');
    expect(out.find((g) => g.id === 'logistics')?.clusterId).toBe('archive');
  });
});
