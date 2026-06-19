import {
  mapOperationalItemsToForecastLines,
  resolveArticleIdFromProductId,
} from '../spine-production-forecast-lines';
import type { B2BOrderLineItem } from '@/lib/order/b2b-order-payload';

describe('spine-production-forecast-lines', () => {
  it('maps operational line items to article qty', () => {
    const items: B2BOrderLineItem[] = [
      { productId: 'ss27-m-coat-01', quantity: 4, unitPrice: 100 },
      { productId: 'ss27-m-coat-01', quantity: 2, unitPrice: 100 },
      { productId: 'demo-ss27-02', quantity: 1, unitPrice: 50 },
    ];
    const lines = mapOperationalItemsToForecastLines(items);
    expect(lines).toEqual(
      expect.arrayContaining([
        { articleId: 'm-coat-01', qty: 6 },
        { articleId: 'demo-ss27-02', qty: 1 },
      ])
    );
  });

  it('resolveArticleIdFromProductId strips collection prefix', () => {
    expect(resolveArticleIdFromProductId('SS27-M-COAT-01')).toBe('m-coat-01');
    expect(resolveArticleIdFromProductId('demo-ss27-02')).toBe('demo-ss27-02');
  });
});
