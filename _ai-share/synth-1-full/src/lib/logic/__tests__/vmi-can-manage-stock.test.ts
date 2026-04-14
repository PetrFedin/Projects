import { canManageStock, StockSyncAgreement } from '../stock-integration';

describe('canManageStock VMI logic', () => {
  const brandId = 'brand-1';
  const shopId = 'shop-1';
  
  const activeVmi: StockSyncAgreement = {
    id: 'vmi-1',
    brandId,
    retailerId: shopId,
    status: 'active',
    type: 'vmi',
    terms: {
      fulfillmentResponsibility: 'brand',
      autoRebalanceEnabled: true,
      syncFrequency: 'realtime'
    },
    metadata: { createdAt: '', updatedAt: '', version: 1 }
  };

  const inactiveVmi: StockSyncAgreement = {
    ...activeVmi,
    status: 'expired'
  };

  it('Brand can manage its own stock on brand warehouse without VMI', () => {
    const res = canManageStock({
      actorId: brandId,
      actorType: 'brand',
      source: {
        type: 'brand_warehouse',
        locationId: 'wh-1',
        locationName: 'WH 1',
        available: 100,
        reserved: 0,
        ownerId: brandId
      },
      targetProductId: 'p1'
    });
    expect(res.allowed).toBe(true);
  });

  it('Brand cannot manage shop stock on brand warehouse without active VMI', () => {
    const res = canManageStock({
      actorId: brandId,
      actorType: 'brand',
      source: {
        type: 'brand_warehouse',
        locationId: 'wh-1',
        locationName: 'WH 1',
        available: 100,
        reserved: 0,
        ownerId: shopId // Shop owns it
      },
      targetProductId: 'p1'
    });
    expect(res.allowed).toBe(false);
    expect(res.reason).toContain('Brand does not own this grain');
  });

  it('Brand can manage shop stock on brand warehouse with active VMI (brand responsibility)', () => {
    const res = canManageStock({
      actorId: brandId,
      actorType: 'brand',
      source: {
        type: 'brand_warehouse',
        locationId: 'wh-1',
        locationName: 'WH 1',
        available: 100,
        reserved: 0,
        ownerId: shopId
      },
      targetProductId: 'p1',
      agreement: activeVmi
    });
    expect(res.allowed).toBe(true);
  });

  it('Brand cannot manage shop stock on brand warehouse with expired VMI', () => {
    const res = canManageStock({
      actorId: brandId,
      actorType: 'brand',
      source: {
        type: 'brand_warehouse',
        locationId: 'wh-1',
        locationName: 'WH 1',
        available: 100,
        reserved: 0,
        ownerId: shopId
      },
      targetProductId: 'p1',
      agreement: inactiveVmi
    });
    expect(res.allowed).toBe(false);
    expect(res.reason).toContain('no active VMI');
  });
});
