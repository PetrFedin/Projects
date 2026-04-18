/**
 * API-слой Endless Aisle POS по контракту ENDLESS_AISLE_POS_API.
 * Пока бэкенд не подключён — возвращаем моки.
 */

import { get } from './client';
import { ENDLESS_AISLE_POS_API } from '@/lib/shop/endless-aisle-pos';
import type { EndlessAisleRequest } from '@/lib/shop/endless-aisle-pos';

const MOCK_REQUESTS: EndlessAisleRequest[] = [
  {
    id: 'ea1',
    storeId: 'msk-1',
    requestedSku: 'DRS-BLK',
    sizeRequested: '44',
    sourceWarehouseId: 'wh-brand',
    status: 'at_store',
    orderId: 'ORD-EA-101',
    pickupPointId: 'msk-1',
    createdAt: '2026-03-10T14:00:00Z',
  },
  {
    id: 'ea2',
    storeId: 'msk-1',
    requestedSku: 'JKT-NAV',
    sizeRequested: '48',
    status: 'reserved',
    createdAt: '2026-03-11T09:00:00Z',
  },
];

export async function listRequests(): Promise<EndlessAisleRequest[]> {
  try {
    return await get<EndlessAisleRequest[]>(ENDLESS_AISLE_POS_API.listRequests);
  } catch {
    return MOCK_REQUESTS;
  }
}
