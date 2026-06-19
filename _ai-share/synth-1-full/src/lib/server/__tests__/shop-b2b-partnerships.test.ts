import {
  buildShopB2bPartnershipsFallback,
  catalogBrandToShopB2bPartnership,
} from '@/lib/shop/shop-b2b-partnerships';
import {
  getPlatformCorePartnerBrands,
  PLATFORM_CORE_CONNECTED_BRAND_ID,
  PLATFORM_CORE_CONNECTED_BRAND_SLUG,
} from '@/lib/data/catalog-brands';

describe('shop-b2b-partnerships', () => {
  it('fallback returns Syntha connected + Nordic profile for invite CTA', () => {
    const items = buildShopB2bPartnershipsFallback('SS27');
    expect(items.length).toBeGreaterThanOrEqual(2);
    const syntha = items.find((p) => p.brandId === PLATFORM_CORE_CONNECTED_BRAND_ID);
    expect(syntha?.showroomHref).toContain('/shop/b2b/showroom');
    expect(syntha?.showroomHref).toContain('collection=SS27');
    expect(syntha?.source).toBe('fallback');
    expect(syntha?.status).toBe('connected');
    const profile = items.find((p) => p.status === 'profile');
    expect(profile).toBeTruthy();
  });

  it('catalogBrandToShopB2bPartnership maps PG row shape', () => {
    const brand = getPlatformCorePartnerBrands()[0];
    expect(brand).toBeTruthy();
    const row = catalogBrandToShopB2bPartnership(brand!, {
      status: 'connected',
      source: 'pg',
      buyerId: 'shop1',
      collectionIds: ['SS27', 'FW27'],
      orderCount: 2,
      collectionId: 'FW27',
    });
    expect(row.buyerId).toBe('shop1');
    expect(row.orderCount).toBe(2);
    expect(row.collectionIds).toEqual(['SS27', 'FW27']);
    expect(row.matrixHref).toContain('collection=FW27');
    expect(row.source).toBe('pg');
  });
});
