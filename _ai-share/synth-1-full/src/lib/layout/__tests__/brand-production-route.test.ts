import { isBrandProductionPathname } from '@/lib/layout/brand-production-route';

describe('isBrandProductionPathname', () => {
  it('matches production subtree only', () => {
    expect(isBrandProductionPathname('/brand/production')).toBe(true);
    expect(isBrandProductionPathname('/brand/production/workshop2/')).toBe(true);
  });

  it('skips other brand sections', () => {
    expect(isBrandProductionPathname('/brand/profile')).toBe(false);
    expect(isBrandProductionPathname('/brand/analytics-360')).toBe(false);
    expect(isBrandProductionPathname('/brand')).toBe(false);
  });
});
