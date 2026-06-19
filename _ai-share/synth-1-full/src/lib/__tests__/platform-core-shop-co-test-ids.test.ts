import {
  legacyShopOpOrderStatusTestId,
  legacyShopOpTrackingTestId,
  shopCoChainTestId,
  shopCoDetailTestId,
  shopCoTrackingTestId,
} from '@/lib/platform-core-shop-co-test-ids';

describe('platform-core-shop-co-test-ids', () => {
  it('shop-co-tracking canonical prefix', () => {
    expect(shopCoTrackingTestId('list')).toBe('shop-co-tracking-list');
    expect(shopCoTrackingTestId('row-B2B-1')).toBe('shop-co-tracking-row-B2B-1');
  });

  it('shop-co-detail and chain prefixes', () => {
    expect(shopCoDetailTestId('panel')).toBe('shop-co-detail-panel');
    expect(shopCoChainTestId('card')).toBe('shop-co-chain-card');
  });

  it('legacy shop-op for audit only', () => {
    expect(legacyShopOpTrackingTestId('list')).toBe('shop-op-tracking-list');
    expect(legacyShopOpOrderStatusTestId('panel')).toBe('shop-op-order-status-panel');
  });
});
