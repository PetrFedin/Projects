/**
 * API-слой Digital Wardrobe по контракту DIGITAL_WARDROBE_API.
 * Пока бэкенд не подключён — возвращаем моки.
 */

import { get } from './client';
import { DIGITAL_WARDROBE_API } from '@/lib/client/digital-wardrobe';
import type { WardrobeItem, WardrobeLook } from '@/lib/client/digital-wardrobe';

const MOCK_ITEMS: WardrobeItem[] = [
  {
    id: 'w1',
    productId: 'p1',
    sku: 'DRS-BLK-M',
    name: 'Платье чёрное',
    orderId: 'ORD-7001',
    purchasedAt: '2026-02-15T10:00:00Z',
    category: 'Платья',
  },
  {
    id: 'w2',
    productId: 'p2',
    sku: 'JKT-NAV-48',
    name: 'Пиджак синий',
    orderId: 'ORD-7002',
    purchasedAt: '2026-03-01T14:00:00Z',
    category: 'Верх',
  },
];

const MOCK_LOOKS: WardrobeLook[] = [
  { id: 'l1', name: 'Офис', itemIds: ['w1', 'w2'], createdAt: '2026-03-10T12:00:00Z' },
];

export async function listItems(): Promise<WardrobeItem[]> {
  try {
    return await get<WardrobeItem[]>(DIGITAL_WARDROBE_API.listItems);
  } catch {
    return MOCK_ITEMS;
  }
}

export async function listLooks(): Promise<WardrobeLook[]> {
  try {
    return await get<WardrobeLook[]>(DIGITAL_WARDROBE_API.listLooks);
  } catch {
    return MOCK_LOOKS;
  }
}
