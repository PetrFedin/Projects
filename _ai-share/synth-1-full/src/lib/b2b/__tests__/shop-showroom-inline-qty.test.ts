import {
  parseShopShowroomInlineQty,
  parseShopShowroomInlineSize,
  shopShowroomInlineQtyMin,
} from '@/lib/b2b/shop-showroom-inline-qty';

describe('shop-showroom-inline-qty', () => {
  it('respects MOQ minimum', () => {
    expect(shopShowroomInlineQtyMin(6)).toBe(6);
    expect(parseShopShowroomInlineQty('5', 6)).toBeNull();
    expect(parseShopShowroomInlineQty('6', 6)).toBe(6);
  });

  it('defaults min to 1', () => {
    expect(shopShowroomInlineQtyMin()).toBe(1);
    expect(parseShopShowroomInlineQty('0', 1)).toBeNull();
    expect(parseShopShowroomInlineQty('3', 1)).toBe(3);
  });

  it('parses inline size with M default', () => {
    expect(parseShopShowroomInlineSize('l')).toBe('L');
    expect(parseShopShowroomInlineSize('')).toBe('M');
    expect(parseShopShowroomInlineSize('xxl')).toBe('M');
  });
});
