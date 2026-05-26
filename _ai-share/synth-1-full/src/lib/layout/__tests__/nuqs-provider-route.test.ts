import { shouldMountNuqsProvider } from '@/lib/layout/nuqs-provider-route';

describe('shouldMountNuqsProvider', () => {
  it('mounts on public routes', () => {
    expect(shouldMountNuqsProvider('/')).toBe(true);
    expect(shouldMountNuqsProvider('/catalog')).toBe(true);
    expect(shouldMountNuqsProvider('/search')).toBe(true);
  });

  it('skips cabinets and embed runway', () => {
    expect(shouldMountNuqsProvider('/brand')).toBe(false);
    expect(shouldMountNuqsProvider('/shop/b2b/margin-analysis')).toBe(false);
    expect(shouldMountNuqsProvider('/client/me')).toBe(false);
    expect(shouldMountNuqsProvider('/embed/runway/demo')).toBe(false);
  });
});
