/**
 * Local Inventory Ads (LIA) — передача наличия в Google / Yandex Maps.
 * Связи: Склад, маркетинг, BOPIS. Инфра под API.
 */

export type LiaChannel = 'google' | 'yandex';

export type LiaFeedStatus = 'active' | 'paused' | 'error';

export interface LiaStoreFeed {
  storeId: string;
  storeName: string;
  channel: LiaChannel;
  status: LiaFeedStatus;
  lastSyncAt?: string;
  itemCount: number;
}

export const LOCAL_INVENTORY_ADS_API = {
  listFeeds: '/api/v1/shop/lia/feeds',
  syncFeed: '/api/v1/shop/lia/feeds/:storeId/sync',
  getFeedUrl: '/api/v1/shop/lia/feeds/:storeId/url',
} as const;
