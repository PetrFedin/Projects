/**
 * API-слой Ship-from-Store по контракту SHIP_FROM_STORE_API.
 * Пока бэкенд не подключён — возвращаем моки.
 */

import { get } from './client';
import { SHIP_FROM_STORE_API } from '@/lib/shop/ship-from-store';
import type { ShipFromStoreAssignment } from '@/lib/shop/ship-from-store';

const MOCK_ASSIGNMENTS: ShipFromStoreAssignment[] = [
  {
    id: 'sfs1',
    orderId: 'ORD-9010',
    storeId: 'msk-1',
    storeName: 'Москва, Тверская',
    status: 'shipped',
    assignedAt: '2026-03-11T08:00:00Z',
    shippedAt: '2026-03-11T12:00:00Z',
    trackingNumber: 'TRK-001',
  },
  {
    id: 'sfs2',
    orderId: 'ORD-9011',
    storeId: 'spb-1',
    storeName: 'СПб, Невский',
    status: 'picking',
    assignedAt: '2026-03-11T10:00:00Z',
  },
];

export async function listAssignments(): Promise<ShipFromStoreAssignment[]> {
  try {
    return await get<ShipFromStoreAssignment[]>(SHIP_FROM_STORE_API.listAssignments);
  } catch {
    return MOCK_ASSIGNMENTS;
  }
}
