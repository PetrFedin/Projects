import {
  workshop2RetailerIdFromOrder,
  workshop2RetailerTierLabelRu,
} from '@/lib/server/workshop2-retailer-tier-label';

describe('workshop2-retailer-tier-label', () => {
  it('maps order tier and volume to RU label', () => {
    expect(workshop2RetailerTierLabelRu('vip', 1)).toBe('VIP');
    expect(workshop2RetailerTierLabelRu('prebook', 2)).toBe('Пребук');
    expect(workshop2RetailerTierLabelRu('standard', 1)).toBe('Оптовый');
    expect(workshop2RetailerTierLabelRu('standard', 3)).toBe('Ключевой');
    expect(workshop2RetailerTierLabelRu(undefined, 0)).toBe('Новый');
  });

  it('normalizes buyer-demo to shop1 retailer id', () => {
    expect(
      workshop2RetailerIdFromOrder({
        id: 'B2B-1',
        status: 'submitted',
        tier: 'standard',
        totalRub: 1,
        lines: [],
        buyerId: 'buyer-demo',
      })
    ).toBe('shop1');
  });
});
