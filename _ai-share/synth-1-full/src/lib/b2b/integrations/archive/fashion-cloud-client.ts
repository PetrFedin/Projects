/**
 * Fashion Cloud API client (TypeScript).
 * Aligned with GitHub onetoweb/fashion-cloud (PHP):
 * - Token in query, GET/POST, BASE_URL + version + endpoint
 * - Apiary: https://fashioncloudv2.docs.apiary.io/
 * Use when NEXT_PUBLIC_FASHION_CLOUD_TOKEN is set; otherwise mock.
 */

export interface FashionCloudConfig {
  token: string;
  baseUrl?: string;
  version?: number;
}

const DEFAULT_BASE = 'https://api.fashion.cloud';
const DEFAULT_VERSION = 2;

export interface FashionCloudProduct {
  id: string;
  gtin?: string;
  name?: string;
  brandId?: string;
  /** Расширение каталога: опции (размер, цвет и т.д.). */
  options?: FashionCloudProductOption[];
  /** Медиа: фото, видео, 3D. */
  media?: FashionCloudProductMedia[];
  [key: string]: unknown;
}

export interface FashionCloudProductOption {
  name: string;
  value: string;
  sort?: number;
  [key: string]: unknown;
}

export interface FashionCloudProductMedia {
  type: 'image' | 'video' | '3d';
  url: string;
  alt?: string;
  sort?: number;
  [key: string]: unknown;
}

export interface FashionCloudStockItem {
  gtin: string;
  quantity: number;
  locationId?: string;
  [key: string]: unknown;
}

/** Элемент для массовой выгрузки остатков (bulk upsert). */
export interface FashionCloudStockBulkItem {
  gtin: string;
  quantity: number;
  locationId?: string;
  [key: string]: unknown;
}

/** Заказ / черновик из Fashion Cloud (импорт). */
export interface FashionCloudOrder {
  id: string;
  orderNumber?: string;
  status?: string;
  brandId?: string;
  createdAt?: string;
  updatedAt?: string;
  lines?: Array<{ gtin?: string; sku?: string; quantity?: number; [key: string]: unknown }>;
  [key: string]: unknown;
}

export interface FashionCloudDraftOrder {
  id: string;
  orderNumber?: string;
  brandId?: string;
  createdAt?: string;
  lines?: Array<{ gtin?: string; sku?: string; quantity?: number; [key: string]: unknown }>;
  [key: string]: unknown;
}

/** Проверка: настроена ли интеграция Fashion Cloud. */
export function isFashionCloudConfigured(): boolean {
  if (typeof process === 'undefined') return false;
  return !!(process.env.NEXT_PUBLIC_FASHION_CLOUD_TOKEN || process.env.FASHION_CLOUD_TOKEN);
}

function getUrl(config: FashionCloudConfig, endpoint: string): string {
  const base = config.baseUrl || DEFAULT_BASE;
  const version = config.version ?? DEFAULT_VERSION;
  return `${base}/v${version}/${endpoint.replace(/^\//, '')}`;
}

/** GET запрос (Fashion Cloud: token в query). */
export async function fashionCloudGet<T = unknown>(
  endpoint: string,
  query: Record<string, string> = {},
  config?: FashionCloudConfig | null
): Promise<T> {
  const token = config?.token || process.env.NEXT_PUBLIC_FASHION_CLOUD_TOKEN || process.env.FASHION_CLOUD_TOKEN;
  if (!token) {
    return [] as T;
  }
  const url = getUrl({ token, ...config }, endpoint);
  const params = new URLSearchParams({ ...query, token });
  const res = await fetch(`${url}?${params.toString()}`, {
    method: 'GET',
    headers: { Accept: 'application/json' },
  });
  if (!res.ok) throw new Error(`Fashion Cloud GET ${endpoint}: ${res.status}`);
  return res.json() as Promise<T>;
}

/** POST запрос (orders, stock push). */
export async function fashionCloudPost<T = unknown>(
  endpoint: string,
  data: Record<string, unknown>,
  config?: FashionCloudConfig | null
): Promise<T> {
  const token = config?.token || process.env.NEXT_PUBLIC_FASHION_CLOUD_TOKEN || process.env.FASHION_CLOUD_TOKEN;
  if (!token) {
    return { success: false } as T;
  }
  const url = getUrl({ token, ...config }, endpoint);
  const params = new URLSearchParams({ token });
  const res = await fetch(`${url}?${params.toString()}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error(`Fashion Cloud POST ${endpoint}: ${res.status}`);
  return res.json() as Promise<T>;
}

/** Продукты по бренду (мок при отсутствии токена). */
export async function fashionCloudGetProducts(brandId?: string, config?: FashionCloudConfig | null): Promise<FashionCloudProduct[]> {
  if (!isFashionCloudConfigured() && !config?.token) return [];
  try {
    const q: Record<string, string> = {};
    if (brandId) q.brandId = brandId;
    return fashionCloudGet<FashionCloudProduct[]>('products', q, config);
  } catch {
    return [];
  }
}

/** Остатки по GTIN (мок при отсутствии токена). */
export async function fashionCloudGetStock(gtin?: string, config?: FashionCloudConfig | null): Promise<FashionCloudStockItem[]> {
  if (!isFashionCloudConfigured() && !config?.token) return [];
  try {
    const q: Record<string, string> = {};
    if (gtin) q.gtin = gtin;
    return fashionCloudGet<FashionCloudStockItem[]>('stock', q, config);
  } catch {
    return [];
  }
}

/** Статус синдикации каталога (Fashion Cloud Showroom API style). Для страницы «Синдикация контента». */
export interface FashionCloudCatalogStatus {
  lastSync?: string;
  productCount: number;
  brandId?: string;
  errors?: string[];
}

export async function fashionCloudGetCatalogStatus(
  brandId?: string,
  config?: FashionCloudConfig | null
): Promise<FashionCloudCatalogStatus> {
  if (!isFashionCloudConfigured() && !config?.token) {
    return { productCount: 0, lastSync: undefined };
  }
  try {
    const products = await fashionCloudGetProducts(brandId, config);
    return {
      productCount: products?.length ?? 0,
      brandId,
      lastSync: new Date().toISOString(),
    };
  } catch (e) {
    return {
      productCount: 0,
      errors: [e instanceof Error ? e.message : 'Fashion Cloud sync error'],
    };
  }
}

/** Отправить/обновить продукты в Fashion Cloud (синдикация). Поддерживает options и media в продуктах. */
export async function fashionCloudSyncProducts(
  products: Array<{ id: string; gtin?: string; name?: string; brandId?: string; options?: FashionCloudProductOption[]; media?: FashionCloudProductMedia[]; [key: string]: unknown }>,
  config?: FashionCloudConfig | null
): Promise<{ success: boolean; synced: number; errors?: string[] }> {
  if (!isFashionCloudConfigured() && !config?.token) {
    return { success: false, synced: 0, errors: ['Fashion Cloud not configured'] };
  }
  try {
    const res = await fashionCloudPost<{ success?: boolean; count?: number }>(
      'products/sync',
      { products },
      config
    );
    const synced = (res as { count?: number })?.count ?? products.length;
    return { success: true, synced };
  } catch (e) {
    return {
      success: false,
      synced: 0,
      errors: [e instanceof Error ? e.message : 'Sync failed'],
    };
  }
}

/** Импорт заказов из Fashion Cloud (GET orders). */
export async function fashionCloudGetOrders(
  options?: { brandId?: string; status?: string; since?: string; limit?: number },
  config?: FashionCloudConfig | null
): Promise<FashionCloudOrder[]> {
  if (!isFashionCloudConfigured() && !config?.token) return [];
  try {
    const q: Record<string, string> = {};
    if (options?.brandId) q.brandId = options.brandId;
    if (options?.status) q.status = options.status;
    if (options?.since) q.since = options.since;
    if (options?.limit != null) q.limit = String(options.limit);
    const data = await fashionCloudGet<FashionCloudOrder[] | { data?: FashionCloudOrder[]; orders?: FashionCloudOrder[] }>('orders', q, config);
    if (Array.isArray(data)) return data;
    return (data as { data?: FashionCloudOrder[] }).data ?? (data as { orders?: FashionCloudOrder[] }).orders ?? [];
  } catch {
    return [];
  }
}

/** Импорт черновиков заказов (draft orders). */
export async function fashionCloudGetDraftOrders(
  brandId?: string,
  config?: FashionCloudConfig | null
): Promise<FashionCloudDraftOrder[]> {
  if (!isFashionCloudConfigured() && !config?.token) return [];
  try {
    const q: Record<string, string> = {};
    if (brandId) q.brandId = brandId;
    const data = await fashionCloudGet<FashionCloudDraftOrder[] | { data?: FashionCloudDraftOrder[]; drafts?: FashionCloudDraftOrder[] }>('draft_orders', q, config);
    if (Array.isArray(data)) return data;
    return (data as { data?: FashionCloudDraftOrder[] }).data ?? (data as { drafts?: FashionCloudDraftOrder[] }).drafts ?? [];
  } catch {
    return [];
  }
}

/** Массовая выгрузка остатков (stock bulk upsert). */
export async function fashionCloudBulkUpsertStock(
  items: FashionCloudStockBulkItem[],
  config?: FashionCloudConfig | null
): Promise<{ success: boolean; processed?: number; errors?: string[] }> {
  if (!isFashionCloudConfigured() && !config?.token) {
    return { success: false, processed: 0, errors: ['Fashion Cloud not configured'] };
  }
  try {
    const res = await fashionCloudPost<{ success?: boolean; count?: number; processed?: number }>(
      'stock/bulk_upsert',
      { stock: items },
      config
    );
    const processed = (res as { processed?: number }).processed ?? (res as { count?: number }).count ?? items.length;
    return { success: true, processed };
  } catch (e) {
    return {
      success: false,
      processed: 0,
      errors: [e instanceof Error ? e.message : 'Stock bulk upsert failed'],
    };
  }
}
