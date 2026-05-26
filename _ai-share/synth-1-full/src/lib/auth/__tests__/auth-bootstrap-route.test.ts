import { shouldEagerAuthBootstrap } from '@/lib/auth/auth-bootstrap-route';

describe('shouldEagerAuthBootstrap', () => {
  it('defers on public retail shell', () => {
    expect(shouldEagerAuthBootstrap('/')).toBe(false);
    expect(shouldEagerAuthBootstrap('/catalog')).toBe(false);
    expect(shouldEagerAuthBootstrap('/search')).toBe(false);
  });

  it('eager on cabinets and login', () => {
    expect(shouldEagerAuthBootstrap('/brand')).toBe(true);
    expect(shouldEagerAuthBootstrap('/shop')).toBe(true);
    expect(shouldEagerAuthBootstrap('/login')).toBe(true);
    expect(shouldEagerAuthBootstrap('/auth/callback')).toBe(true);
  });
});
