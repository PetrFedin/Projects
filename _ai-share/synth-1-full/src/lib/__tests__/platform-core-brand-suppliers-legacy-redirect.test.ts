import { resolveBrandSuppliersLegacyRedirect } from '@/lib/platform-core-brand-suppliers-legacy-redirect';

describe('platform-core-brand-suppliers-legacy-redirect', () => {
  it('resolves suppliers hub → factory materials BOM', () => {
    const hit = resolveBrandSuppliersLegacyRedirect('SS27');
    expect(hit.testId).toBe('platform-core-brand-suppliers-legacy-redirect');
    expect(hit.href).toContain('/factory/production/materials');
    expect(hit.href).toContain('collection=SS27');
    expect(hit.href).toContain('view=development');
  });
});
