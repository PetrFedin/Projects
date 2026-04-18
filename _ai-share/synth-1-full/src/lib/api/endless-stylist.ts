/**
 * API-слой Endless Stylist по контракту ENDLESS_STYLIST_API.
 * Пока бэкенд не подключён — возвращаем моки. Список образов — условный эндпоинт при наличии бэкенда.
 */

import { get } from './client';
import type { StylistLook } from '@/lib/shop/endless-stylist';

const LIST_LOOKS_PATH = '/api/v1/shop/stylist/looks';

const MOCK_LOOKS: StylistLook[] = [
  {
    id: 'l1',
    items: [
      { productId: 'p1', sku: 'DRS-BLK-M', name: 'Платье чёрное' },
      { productId: 'p2', sku: 'BAG-001', name: 'Сумка' },
    ],
    createdAt: '2026-03-11T10:00:00Z',
  },
  {
    id: 'l2',
    items: [
      { productId: 'p3', sku: 'JKT-NAV', name: 'Пиджак' },
      { productId: 'p4', name: 'Рубашка' },
    ],
    customerId: 'cust-1',
    createdAt: '2026-03-11T09:30:00Z',
  },
];

export async function listLooks(): Promise<StylistLook[]> {
  try {
    return await get<StylistLook[]>(LIST_LOOKS_PATH);
  } catch {
    return MOCK_LOOKS;
  }
}
