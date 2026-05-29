import { shouldMountRouteGuard } from '@/lib/auth/route-guard-route';

describe('shouldMountRouteGuard', () => {
  it('skips public retail shell', () => {
    expect(shouldMountRouteGuard('/')).toBe(false);
    expect(shouldMountRouteGuard('/catalog')).toBe(false);
    expect(shouldMountRouteGuard('/products/demo')).toBe(false);
    expect(shouldMountRouteGuard('/login')).toBe(false);
  });

  it('mounts on cabinet prefixes', () => {
    expect(shouldMountRouteGuard('/brand/profile')).toBe(true);
    expect(shouldMountRouteGuard('/shop/inventory')).toBe(true);
    expect(shouldMountRouteGuard('/factory/production')).toBe(true);
    expect(shouldMountRouteGuard('/client/me')).toBe(true);
  });

  it('skips embed runway (not cabinet, guard unused)', () => {
    expect(shouldMountRouteGuard('/embed/runway/demo')).toBe(false);
  });
});
