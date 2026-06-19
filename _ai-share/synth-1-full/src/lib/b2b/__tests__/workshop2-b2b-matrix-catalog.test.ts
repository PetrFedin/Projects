import {
  WORKSHOP2_B2B_MATRIX_FALLBACK_IMAGE,
  mapWorkshop2ArticlesToMatrixProducts,
} from '@/lib/b2b/workshop2-b2b-matrix-catalog';
import { resolveWorkshop2CartArticleId } from '@/lib/b2b/workshop2-cart-bridge';
import type { CartItem } from '@/lib/types';

describe('workshop2-b2b-matrix-catalog', () => {
  it('maps published articles to matrix products with articleId as id', () => {
    const rows = mapWorkshop2ArticlesToMatrixProducts(
      [
        {
          collectionId: 'SS27',
          articleId: 'demo-ss27-01',
          name: 'Cyber Parka',
          wholesalePriceRub: 18_000,
          msrpRub: 42_000,
          moq: 6,
        },
      ],
      'SS27'
    );
    expect(rows).toHaveLength(1);
    expect(rows[0]?.id).toBe('demo-ss27-01');
    expect(rows[0]?.price).toBe(18_000);
    expect(rows[0]?.sku).toBe('demo-ss27-01');
    expect(rows[0]?.images?.[0]?.url).toBe(WORKSHOP2_B2B_MATRIX_FALLBACK_IMAGE);
  });

  it('maps heroImageUrl from W2 published article', () => {
    const hero = 'data:image/png;base64,abc';
    const rows = mapWorkshop2ArticlesToMatrixProducts(
      [
        {
          collectionId: 'SS27',
          articleId: 'demo-ss27-01',
          name: 'Cyber Parka',
          wholesalePriceRub: 18_000,
          heroImageUrl: hero,
        },
      ],
      'SS27'
    );
    expect(rows[0]?.images?.[0]?.url).toBe(hero);
  });

  it('resolveWorkshop2CartArticleId uses matrix product id', () => {
    const item = { id: 'demo-ss27-02', quantity: 2, price: 100 } as CartItem;
    expect(resolveWorkshop2CartArticleId(item, 'SS27')).toBe('demo-ss27-02');
  });
});
