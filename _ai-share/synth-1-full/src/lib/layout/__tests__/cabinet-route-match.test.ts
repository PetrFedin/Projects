import { isCabinetPathname } from '@/lib/layout/cabinet-route-match';

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
