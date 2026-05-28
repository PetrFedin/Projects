/**
 * @jest-environment node
 */
import {
  b2bOrderShopPartnerId,
  partnerRowsFromB2bOrderShops,
} from '@/lib/production/workshop2-sewing-plan-partners-from-b2b';

describe('workshop2-sewing-plan-partners-from-b2b', () => {
  it('dedupes shops and sorts labels', () => {
    const rows = partnerRowsFromB2bOrderShops([
      { shop: 'Демо-магазин · Москва 2' },
      { shop: 'Демо-магазин · Москва 1' },
      { shop: 'Демо-магазин · Москва 1' },
    ]);
    expect(rows.map((r) => r.label)).toEqual([
      'B2B · Демо-магазин · Москва 1',
      'B2B · Демо-магазин · Москва 2',
    ]);
    expect(new Set(rows.map((r) => r.id)).size).toBe(2);
  });

  it('builds stable id from shop label', () => {
    expect(b2bOrderShopPartnerId('Демо-магазин · Москва 1')).toBe(
      'b2b-order-shop:демо-магазин-москва-1'
    );
  });
});
