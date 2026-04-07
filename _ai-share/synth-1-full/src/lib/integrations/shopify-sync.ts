/**
 * Shopify Sync — типы и константы для MVP.
 * При подключении API: заменить mock на вызовы API, структуры уже готовы.
 */

export type ShopifyConnectionStatus = 'disconnected' | 'pending' | 'connected' | 'error';

export interface ShopifySyncConfig {
  status: ShopifyConnectionStatus;
  storeUrl?: string;
  storeName?: string;
  lastSyncOrders?: string; // ISO date
  lastSyncCatalog?: string;
  /** Для API: accessToken хранить только на бэкенде */
  _apiReady?: boolean;
}

export interface ShopifySyncResult {
  success: boolean;
  syncedOrders?: number;
  syncedProducts?: number;
  error?: string;
}

/** При API: вызов POST /api/v1/integrations/shopify/sync-orders и т.д. */
export const SHOPIFY_SYNC_API = {
  connect: '/api/v1/integrations/shopify/connect',
  disconnect: '/api/v1/integrations/shopify/disconnect',
  syncOrders: '/api/v1/integrations/shopify/sync-orders',
  syncCatalog: '/api/v1/integrations/shopify/sync-catalog',
  status: '/api/v1/integrations/shopify/status',
} as const;
