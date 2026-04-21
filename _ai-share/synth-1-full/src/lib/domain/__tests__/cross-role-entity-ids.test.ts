import {
  B2B_WHOLESALE_ORDER_CONTEXT_QUERY,
  SHOP_B2B_COLLECTION_QUERY_PARAM,
  getWholesaleOrderIdFromB2BOrder,
} from '@/lib/domain/cross-role-entity-ids';
import type { B2BOrder } from '@/lib/types';

describe('cross-role-entity-ids', () => {
  it('maps B2BOrder.order to wholesale id for cross-role hrefs', () => {
    const o = {
      order: 'B2B-0001',
      shop: 'Демо-магазин · Москва 1',
      brand: 'Demo Brand',
      amount: '1 ₽',
      date: '2026-01-01',
      deliveryDate: '2026-02-01',
      status: 'Черновик',
    } satisfies B2BOrder;
    expect(getWholesaleOrderIdFromB2BOrder(o)).toBe('B2B-0001');
  });

  it('documents stable query keys for wholesale order context and shop collection deep links', () => {
    expect(B2B_WHOLESALE_ORDER_CONTEXT_QUERY.order).toBe('order');
    expect(B2B_WHOLESALE_ORDER_CONTEXT_QUERY.orderId).toBe('orderId');
    expect(SHOP_B2B_COLLECTION_QUERY_PARAM).toBe('collection');
  });
});
