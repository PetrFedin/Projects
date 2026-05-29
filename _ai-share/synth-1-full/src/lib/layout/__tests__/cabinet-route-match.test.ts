import { ROUTES } from '@/lib/routes';
import { CABINET_PATH_PREFIXES, isCabinetPathname } from '@/lib/layout/cabinet-route-match';

describe('CABINET_PATH_PREFIXES', () => {
  it('stays aligned with ROUTES cabinet homes (no routes.ts import in gate module)', () => {
    expect(CABINET_PATH_PREFIXES).toEqual([
      '/brand',
      ROUTES.admin.home,
      ROUTES.shop.home,
      ROUTES.factory.home,
      ROUTES.distributor.home,
      ROUTES.client.home,
      ROUTES.client.orders,
      ROUTES.academyPlatform,
      '/wallet',
    ]);
  });
});

describe('isCabinetPathname', () => {
  it('matches hub cabinet roots and nested paths', () => {
    expect(isCabinetPathname('/brand')).toBe(true);
    expect(isCabinetPathname('/brand/production/workshop2')).toBe(true);
    expect(isCabinetPathname('/shop/b2b/matrix')).toBe(true);
    expect(isCabinetPathname('/admin/users')).toBe(true);
    expect(isCabinetPathname('/factory/production')).toBe(true);
    expect(isCabinetPathname('/distributor')).toBe(true);
    expect(isCabinetPathname('/client/profile')).toBe(true);
  });

  it('matches client satellite cabinets', () => {
    expect(isCabinetPathname('/orders')).toBe(true);
    expect(isCabinetPathname('/academy/course/foo')).toBe(true);
    expect(isCabinetPathname('/wallet')).toBe(true);
  });

  it('does not match public storefront routes', () => {
    expect(isCabinetPathname('/')).toBe(false);
    expect(isCabinetPathname('/search')).toBe(false);
    expect(isCabinetPathname('/product/abc')).toBe(false);
  });
});
