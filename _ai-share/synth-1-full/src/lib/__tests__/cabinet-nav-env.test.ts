import {
  applyBrandInvestorSpineClusterOverrides,
  applyDistributorInvestorSpineClusterOverrides,
  applyFactoryManufacturerInvestorSpineClusterOverrides,
  applyFactorySupplierInvestorSpineClusterOverrides,
  applyShopInvestorSpineClusterOverrides,
  isBrandNavInvestorSpineEnabled,
  isDistributorNavInvestorSpineEnabled,
  isFactoryNavInvestorSpineEnabled,
  isShopNavInvestorSpineEnabled,
} from '@/lib/cabinet-nav-env';

describe('cabinet-nav-env', () => {
  const prevBrand = process.env.NEXT_PUBLIC_BRAND_NAV_INVESTOR_SPINE;
  const prevShop = process.env.NEXT_PUBLIC_SHOP_NAV_INVESTOR_SPINE;
  const prevFactory = process.env.NEXT_PUBLIC_FACTORY_NAV_INVESTOR_SPINE;
  const prevDistributor = process.env.NEXT_PUBLIC_DISTRIBUTOR_NAV_INVESTOR_SPINE;

  afterEach(() => {
    if (prevBrand === undefined) delete process.env.NEXT_PUBLIC_BRAND_NAV_INVESTOR_SPINE;
    else process.env.NEXT_PUBLIC_BRAND_NAV_INVESTOR_SPINE = prevBrand;
    if (prevShop === undefined) delete process.env.NEXT_PUBLIC_SHOP_NAV_INVESTOR_SPINE;
    else process.env.NEXT_PUBLIC_SHOP_NAV_INVESTOR_SPINE = prevShop;
    if (prevFactory === undefined) delete process.env.NEXT_PUBLIC_FACTORY_NAV_INVESTOR_SPINE;
    else process.env.NEXT_PUBLIC_FACTORY_NAV_INVESTOR_SPINE = prevFactory;
    if (prevDistributor === undefined) delete process.env.NEXT_PUBLIC_DISTRIBUTOR_NAV_INVESTOR_SPINE;
    else process.env.NEXT_PUBLIC_DISTRIBUTOR_NAV_INVESTOR_SPINE = prevDistributor;
  });

  it('isBrandNavInvestorSpineEnabled respects 1 / true', () => {
    delete process.env.NEXT_PUBLIC_BRAND_NAV_INVESTOR_SPINE;
    expect(isBrandNavInvestorSpineEnabled()).toBe(false);
    process.env.NEXT_PUBLIC_BRAND_NAV_INVESTOR_SPINE = '1';
    expect(isBrandNavInvestorSpineEnabled()).toBe(true);
    process.env.NEXT_PUBLIC_BRAND_NAV_INVESTOR_SPINE = 'true';
    expect(isBrandNavInvestorSpineEnabled()).toBe(true);
  });

  it('applyBrandInvestorSpineClusterOverrides moves secondary groups to archive and promotes brand-admin', () => {
    process.env.NEXT_PUBLIC_BRAND_NAV_INVESTOR_SPINE = '1';
    const base = [
      { id: 'team', clusterId: 'syntha-cores' },
      { id: 'brand-admin', clusterId: 'archive' },
      { id: 'development', clusterId: 'syntha-cores' },
    ] as const;
    const out = applyBrandInvestorSpineClusterOverrides(base);
    expect(out.find((g) => g.id === 'team')?.clusterId).toBe('archive');
    expect(out.find((g) => g.id === 'brand-admin')?.clusterId).toBe('syntha-cores');
    expect(out.find((g) => g.id === 'development')?.clusterId).toBe('syntha-cores');
  });

  it('applyBrandInvestorSpineClusterOverrides is noop when flag off', () => {
    delete process.env.NEXT_PUBLIC_BRAND_NAV_INVESTOR_SPINE;
    const base = [{ id: 'team', clusterId: 'syntha-cores' }] as const;
    const out = applyBrandInvestorSpineClusterOverrides(base);
    expect(out[0]).toEqual(base[0]);
  });

  it('applyShopInvestorSpineClusterOverrides demotes partners and logistics when shop flag on', () => {
    process.env.NEXT_PUBLIC_SHOP_NAV_INVESTOR_SPINE = '1';
    expect(isShopNavInvestorSpineEnabled()).toBe(true);
    const base = [
      { id: 'partners', clusterId: 'syntha-cores' },
      { id: 'b2b', clusterId: 'syntha-cores' },
    ] as const;
    const out = applyShopInvestorSpineClusterOverrides(base);
    expect(out.find((g) => g.id === 'partners')?.clusterId).toBe('archive');
    expect(out.find((g) => g.id === 'b2b')?.clusterId).toBe('syntha-cores');
  });

  it('applyFactoryManufacturerInvestorSpineClusterOverrides demotes team and partners when factory flag on', () => {
    process.env.NEXT_PUBLIC_FACTORY_NAV_INVESTOR_SPINE = '1';
    expect(isFactoryNavInvestorSpineEnabled()).toBe(true);
    const base = [
      { id: 'team', clusterId: 'syntha-cores' },
      { id: 'production', clusterId: 'syntha-cores' },
    ] as const;
    const out = applyFactoryManufacturerInvestorSpineClusterOverrides(base);
    expect(out.find((g) => g.id === 'team')?.clusterId).toBe('archive');
    expect(out.find((g) => g.id === 'production')?.clusterId).toBe('syntha-cores');
  });

  it('applyFactorySupplierInvestorSpineClusterOverrides demotes partners when factory flag on', () => {
    process.env.NEXT_PUBLIC_FACTORY_NAV_INVESTOR_SPINE = '1';
    const base = [
      { id: 'partners', clusterId: 'syntha-cores' },
      { id: 'pim', clusterId: 'syntha-cores' },
    ] as const;
    const out = applyFactorySupplierInvestorSpineClusterOverrides(base);
    expect(out.find((g) => g.id === 'partners')?.clusterId).toBe('archive');
    expect(out.find((g) => g.id === 'pim')?.clusterId).toBe('syntha-cores');
  });

  it('applyDistributorInvestorSpineClusterOverrides demotes team and partners when distributor flag on', () => {
    process.env.NEXT_PUBLIC_DISTRIBUTOR_NAV_INVESTOR_SPINE = '1';
    expect(isDistributorNavInvestorSpineEnabled()).toBe(true);
    const base = [
      { id: 'team', clusterId: 'syntha-cores' },
      { id: 'b2b', clusterId: 'syntha-cores' },
    ] as const;
    const out = applyDistributorInvestorSpineClusterOverrides(base);
    expect(out.find((g) => g.id === 'team')?.clusterId).toBe('archive');
    expect(out.find((g) => g.id === 'b2b')?.clusterId).toBe('syntha-cores');
  });
});
