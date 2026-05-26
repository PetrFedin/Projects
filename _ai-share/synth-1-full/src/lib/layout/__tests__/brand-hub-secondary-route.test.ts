import { shouldMountBrandSectionHeader } from '@/lib/layout/brand-hub-secondary-route';

describe('shouldMountBrandSectionHeader', () => {
  it('skips brand home and academy', () => {
    expect(shouldMountBrandSectionHeader('/brand')).toBe(false);
    expect(shouldMountBrandSectionHeader('/brand/profile')).toBe(false);
    expect(shouldMountBrandSectionHeader('/brand/academy/knowledge')).toBe(false);
  });

  it('allows other brand sections', () => {
    expect(shouldMountBrandSectionHeader('/brand/analytics-360')).toBe(true);
    expect(shouldMountBrandSectionHeader('/brand/production/workshop2')).toBe(true);
  });
});
