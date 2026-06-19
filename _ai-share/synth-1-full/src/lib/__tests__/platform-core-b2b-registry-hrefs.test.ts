import {
  brandB2bOrdersProductionRegistryHref,
  shopB2bOrdersProductionRegistryHref,
} from '@/lib/routes';

describe('b2b registry hrefs (collection_order canonical)', () => {
  it('shop production filter without order_production pillar', () => {
    expect(shopB2bOrdersProductionRegistryHref('B2B-1')).toBe(
      '/shop/b2b/orders?filter=in_production&order=B2B-1'
    );
    expect(shopB2bOrdersProductionRegistryHref()).not.toContain('pillar=order_production');
  });

  it('brand production filter without order_production pillar', () => {
    expect(brandB2bOrdersProductionRegistryHref()).toBe('/brand/b2b-orders?filter=in_production');
    expect(brandB2bOrdersProductionRegistryHref('B2B-1')).not.toContain('pillar=order_production');
  });
});
