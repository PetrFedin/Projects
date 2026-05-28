import { shouldMountBrandCenterProvider } from '@/lib/layout/brand-center-route';

describe('shouldMountBrandCenterProvider', () => {
  it('returns true only for brand cabinet', () => {
    expect(shouldMountBrandCenterProvider('/brand')).toBe(true);
    expect(shouldMountBrandCenterProvider('/brand/b2b/orders')).toBe(true);
  });

  it('returns false elsewhere', () => {
    expect(shouldMountBrandCenterProvider('/')).toBe(false);
    expect(shouldMountBrandCenterProvider('/shop')).toBe(false);
    expect(shouldMountBrandCenterProvider('/distributor')).toBe(false);
  });
});
