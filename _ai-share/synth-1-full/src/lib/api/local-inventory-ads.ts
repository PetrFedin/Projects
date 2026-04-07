/**
 * API-слой Local Inventory Ads по контракту LOCAL_INVENTORY_ADS_API.
 * Пока бэкенд не подключён — возвращаем моки.
 */

import { get } from './client';
import { LOCAL_INVENTORY_ADS_API } from '@/lib/shop/local-inventory-ads';
import type { LiaStoreFeed } from '@/lib/shop/local-inventory-ads';

const MOCK_FEEDS: LiaStoreFeed[] = [
  { storeId: 'current', storeName: 'Текущий магазин', channel: 'google', status: 'active', lastSyncAt: '2026-03-11T08:00:00Z', itemCount: 312 },
  { storeId: 'current', storeName: 'Текущий магазин', channel: 'yandex', status: 'active', lastSyncAt: '2026-03-11T07:30:00Z', itemCount: 312 },
];

export async function listFeeds(): Promise<LiaStoreFeed[]> {
  try {
    return await get<LiaStoreFeed[]>(LOCAL_INVENTORY_ADS_API.listFeeds);
  } catch {
    return MOCK_FEEDS;
  }
}
