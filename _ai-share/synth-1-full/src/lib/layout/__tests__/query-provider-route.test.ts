import { shouldMountQueryProvider } from '@/lib/layout/query-provider-route';

describe('shouldMountQueryProvider', () => {
  it('mounts on brand cabinet routes', () => {
    expect(shouldMountQueryProvider('/brand')).toBe(true);
    expect(shouldMountQueryProvider('/brand/profile')).toBe(true);
    expect(shouldMountQueryProvider('/brand/b2b-orders')).toBe(true);
  });

  it('skips public and other cabinets', () => {
    expect(shouldMountQueryProvider('/')).toBe(false);
    expect(shouldMountQueryProvider('/shop')).toBe(false);
    expect(shouldMountQueryProvider('/client/me')).toBe(false);
    expect(shouldMountQueryProvider('/factory/production')).toBe(false);
    expect(shouldMountQueryProvider('/catalog')).toBe(false);
  });
});
