/**
 * NuOrder Wholesale API client (TypeScript). Клиентская часть: моки и типы.
 * Реальные вызовы (OAuth 1.0) — в nuorder-server.ts, только для API routes.
 * API surface aligned with GitHub jacobsvante/nuorder (Python).
 * Docs: https://nuorderapi1.docs.apiary.io/
 */

export interface NuOrderConfig {
  hostname: string;
  consumerKey: string;
  consumerSecret: string;
  oauthToken: string;
  oauthTokenSecret: string;
  sandbox?: boolean;
}

export interface NuOrderCompanyCode {
  code: string;
  name?: string;
  [key: string]: unknown;
}

export interface NuOrderOrderPayload {
  company_code?: string;
  buyer?: string;
  lines?: Array<{ style?: string; sku?: string; color?: string; size?: string; qty?: number; price?: number }>;
  [key: string]: unknown;
}

/** Остаток по SKU: pre-book (предзаказ) и ATS (available to ship). */
export interface NuOrderInventoryItem {
  style?: string;
  sku?: string;
  color?: string;
  size?: string;
  /** Доступно к отгрузке (on hand). */
  qty?: number;
  /** Pre-book: доступно по предзаказу. */
  pre_book_qty?: number;
  /** Available to ship. */
  ats_qty?: number;
  [key: string]: unknown;
}

export interface NuOrderInventoryPayload {
  inventory: NuOrderInventoryItem[];
  /** Полная замена (overwrite) или только изменения. */
  overwrite?: boolean;
}

/** Отгрузка: статус и трекинг для заказа. */
export interface NuOrderShipmentLine {
  line_id?: string;
  sku?: string;
  qty_shipped?: number;
  [key: string]: unknown;
}

export interface NuOrderShipmentPayload {
  order_id: string;
  tracking_number?: string;
  carrier?: string;
  status?: string;
  shipped_at?: string;
  lines?: NuOrderShipmentLine[];
  [key: string]: unknown;
}

/** Изменение заказа (amendments): правка строк, отмена. */
export interface NuOrderOrderEditLine {
  line_id?: string;
  sku?: string;
  qty?: number;
  cancel?: boolean;
  [key: string]: unknown;
}

export interface NuOrderOrderEditPayload {
  order_id: string;
  lines?: NuOrderOrderEditLine[];
  /** Причина/комментарий. */
  note?: string;
  [key: string]: unknown;
}

/** Replenishment: рекомендуемые к дозаказу позиции. */
export interface NuOrderReplenishmentItem {
  style?: string;
  sku?: string;
  qty_suggested?: number;
  min_qty?: number;
  [key: string]: unknown;
}

export interface NuOrderReplenishmentPayload {
  items: NuOrderReplenishmentItem[];
  [key: string]: unknown;
}

const MOCK_COMPANIES: NuOrderCompanyCode[] = [
  { code: 'MAIN', name: 'Main Store' },
  { code: 'OUTLET', name: 'Outlet' },
];

/** Проверка: настроена ли интеграция NuOrder. */
export function isNuOrderConfigured(): boolean {
  if (typeof process === 'undefined') return false;
  const env = process.env;
  return !!(env.NEXT_PUBLIC_NUORDER_HOSTNAME || env.NUORDER_HOSTNAME);
}

/** Конфиг из env (только сервер: секреты не в NEXT_PUBLIC_). Для реальных вызовов используйте nuorder-server. */
export function getNuOrderConfigFromEnv(): NuOrderConfig | null {
  if (typeof process === 'undefined') return null;
  const env = process.env;
  const hostname = env.NUORDER_HOSTNAME || env.NEXT_PUBLIC_NUORDER_HOSTNAME;
  const consumerKey = env.NUORDER_CONSUMER_KEY;
  const consumerSecret = env.NUORDER_CONSUMER_SECRET;
  const oauthToken = env.NUORDER_OAUTH_TOKEN;
  const oauthTokenSecret = env.NUORDER_OAUTH_TOKEN_SECRET;
  if (!hostname || !consumerKey || !consumerSecret || !oauthToken || !oauthTokenSecret) return null;
  return {
    hostname: hostname.replace(/^https?:\/\//, ''),
    consumerKey,
    consumerSecret,
    oauthToken,
    oauthTokenSecret,
    sandbox: hostname.includes('sandbox'),
  };
}

/** Список кодов компаний. На клиенте — мок; на сервере с конфигом вызывайте nuorderServerGetCompanyCodes. */
export async function nuorderGetCompanyCodes(_config?: NuOrderConfig | null): Promise<NuOrderCompanyCode[]> {
  return MOCK_COMPANIES;
}

/** Создание заказа. На клиенте — мок; на сервере с конфигом вызывайте nuorderServerCreateOrder из nuorder-server. */
export async function nuorderCreateOrder(
  payload: NuOrderOrderPayload,
  _config?: NuOrderConfig | null
): Promise<{ success: boolean; orderId?: string; error?: string }> {
  return { success: true, orderId: `nu-mock-${Date.now()}` };
}

/** Синхрон остатков (pre-book, ATS). На сервере — nuorderServerPushInventory. */
export async function nuorderPushInventory(
  _payload: NuOrderInventoryPayload,
  _config?: NuOrderConfig | null
): Promise<{ success: boolean; processed?: number; error?: string }> {
  return { success: true, processed: 0 };
}

/** Отправка статуса отгрузки в NuOrder. На сервере — nuorderServerSendShipment. */
export async function nuorderSendShipment(
  _payload: NuOrderShipmentPayload,
  _config?: NuOrderConfig | null
): Promise<{ success: boolean; error?: string }> {
  return { success: true };
}

/** Обновление заказа (amendments). На сервере — nuorderServerUpdateOrder. */
export async function nuorderUpdateOrder(
  _payload: NuOrderOrderEditPayload,
  _config?: NuOrderConfig | null
): Promise<{ success: boolean; error?: string }> {
  return { success: true };
}

/** Replenishment feed. На сервере — nuorderServerPushReplenishment. */
export async function nuorderPushReplenishment(
  _payload: NuOrderReplenishmentPayload,
  _config?: NuOrderConfig | null
): Promise<{ success: boolean; processed?: number; error?: string }> {
  return { success: true, processed: 0 };
}
