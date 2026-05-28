import { isPublicShellPathname } from '@/lib/layout/public-shell-route';

describe('isPublicShellPathname', () => {
  it('returns true for public routes', () => {
    expect(isPublicShellPathname('/')).toBe(true);
    expect(isPublicShellPathname('/catalog')).toBe(true);
    expect(isPublicShellPathname('/search')).toBe(true);
  });

  it('returns false for cabinets and embed runway', () => {
    expect(isPublicShellPathname('/brand')).toBe(false);
    expect(isPublicShellPathname('/shop/b2b/margin-analysis')).toBe(false);
    expect(isPublicShellPathname('/client/me')).toBe(false);
    expect(isPublicShellPathname('/embed/runway/demo')).toBe(false);
  });
});
