import {
  mapWorkshop2CartLinesToCartItems,
  type Workshop2CartSessionLine,
} from '@/lib/b2b/workshop2-cart-bridge';
import type { Product } from '@/lib/types';

describe('workshop2-cart-bridge', () => {
  it('mapWorkshop2CartLinesToCartItems filters by collection and maps qty/size', () => {
    const products: Product[] = [
      {
        id: 'demo-ss27-01',
        name: 'Dress',
        sku: 'demo-ss27-01',
        price: 12000,
        images: [],
        category: 'apparel',
      },
    ];
    const lines: Workshop2CartSessionLine[] = [
      {
        collectionId: 'SS27',
        articleId: 'demo-ss27-01',
        colorCode: 'default',
        size: 'M',
        qty: 3,
        wholesalePriceRub: 12000,
      },
      {
        collectionId: 'FW27',
        articleId: 'demo-ss27-01',
        colorCode: 'default',
        size: 'S',
        qty: 1,
      },
    ];
    const items = mapWorkshop2CartLinesToCartItems(lines, products, 'SS27');
    expect(items).toHaveLength(1);
    expect(items[0]?.quantity).toBe(3);
    expect(items[0]?.selectedSize).toBe('M');
  });
});
