import { resolveWorkshop2RetailerBuyerIds } from '@/lib/b2b/workshop2-retailer-buyer-bridge';

describe('workshop2-retailer-buyer-bridge', () => {
  it('resolves shop1 with buyer-demo alias', () => {
    expect(resolveWorkshop2RetailerBuyerIds('shop1')).toEqual(['shop1', 'buyer-demo']);
  });

  it('returns single id for unknown retailer', () => {
    expect(resolveWorkshop2RetailerBuyerIds('shop2')).toEqual(['shop2']);
  });
});
