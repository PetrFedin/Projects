/**
 * API-слой Try Before You Buy (B2C) по контракту TRY_BEFORE_YOU_BUY_B2C_API.
 * Пока бэкенд не подключён — возвращаем моки.
 */

import { get } from './client';
import { TRY_BEFORE_YOU_BUY_B2C_API } from '@/lib/client/try-before-you-buy-b2c';
import type { TBYBOrder } from '@/lib/client/try-before-you-buy-b2c';

const MOCK_ORDERS: TBYBOrder[] = [
  {
    id: 'tbyb1',
    orderId: 'TBYB-001',
    customerId: 'me',
    status: 'delivered',
    holdAmountRub: 15000,
    items: [{ sku: 'DRS-BLK-M', name: 'Платье', qty: 1 }],
    shippedAt: '2026-03-09T10:00:00Z',
    returnByDate: '2026-03-16',
    createdAt: '2026-03-08T12:00:00Z',
  },
  {
    id: 'tbyb2',
    orderId: 'TBYB-002',
    customerId: 'me',
    status: 'hold_placed',
    holdAmountRub: 22000,
    items: [
      { sku: 'JKT-NAV', name: 'Пиджак', qty: 1 },
      { sku: 'SHIRT-WHT', name: 'Рубашка', qty: 1 },
    ],
    createdAt: '2026-03-11T09:00:00Z',
  },
];

export async function listOrders(): Promise<TBYBOrder[]> {
  try {
    return await get<TBYBOrder[]>(TRY_BEFORE_YOU_BUY_B2C_API.list);
  } catch {
    return MOCK_ORDERS;
  }
}
