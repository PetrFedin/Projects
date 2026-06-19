import {
  assertShopB2bOrderStatusPatchAllowed,
  isShopB2bOrderBrandOnlyStatus,
} from '@/lib/server/shop-b2b-order-status-policy';

describe('shop-b2b-order-status-policy', () => {
  it('blocks brand-only statuses for shop PATCH', () => {
    expect(isShopB2bOrderBrandOnlyStatus('confirmed')).toBe(true);
    expect(isShopB2bOrderBrandOnlyStatus('allocated')).toBe(true);
    expect(isShopB2bOrderBrandOnlyStatus('shipped')).toBe(true);
    expect(isShopB2bOrderBrandOnlyStatus('submitted')).toBe(false);
    expect(isShopB2bOrderBrandOnlyStatus('cancelled')).toBe(false);
  });

  it('rejects confirmed via shop actor', () => {
    const r = assertShopB2bOrderStatusPatchAllowed({
      targetStatus: 'confirmed',
      orderBuyerId: 'shop1',
      sessionBuyerId: 'shop1',
    });
    expect(r.ok).toBe(false);
    if (!r.ok) expect(r.code).toBe('brand_only_status');
  });

  it('rejects buyer mismatch', () => {
    const r = assertShopB2bOrderStatusPatchAllowed({
      targetStatus: 'submitted',
      orderBuyerId: 'shop2',
      sessionBuyerId: 'shop1',
    });
    expect(r.ok).toBe(false);
    if (!r.ok) expect(r.code).toBe('buyer_mismatch');
  });

  it('allows shop submit and cancel', () => {
    expect(
      assertShopB2bOrderStatusPatchAllowed({
        targetStatus: 'submitted',
        orderBuyerId: 'shop1',
        sessionBuyerId: 'shop1',
      }).ok
    ).toBe(true);
    expect(
      assertShopB2bOrderStatusPatchAllowed({
        targetStatus: 'cancelled',
        sessionBuyerId: 'shop1',
      }).ok
    ).toBe(true);
  });
});
