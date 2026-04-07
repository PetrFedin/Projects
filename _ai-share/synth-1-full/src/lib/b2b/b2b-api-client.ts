/**
 * B2B API client: трекинг отгрузки и отчёты партнёра.
 * Сейчас все методы возвращают мок-данные. При появлении бэкенда —
 * заменить реализацию на fetch(API_BASE + endpoint) с теми же контрактами.
 */

import { B2B_ENDPOINTS } from './api-endpoints';
import type { OrderShipmentTracking } from './order-shipment-tracking';
import { getOrderShipmentTracking } from './order-shipment-tracking';
import {
  MOCK_SALES_BY_BRAND,
  MOCK_TOP_SKU,
  MOCK_SELL_THROUGH,
  MOCK_PLAN_FACT,
  type SalesByBrandRow,
  type TopSkuRow,
  type SellThroughRow,
  type PlanFactRow,
} from './partner-reports-data';

export type PartnerReportsFilters = {
  season?: string;
  brand?: string;
};

function filterBySeasonBrand<T extends { season: string; brand?: string }>(
  rows: T[],
  filters: PartnerReportsFilters
): T[] {
  let out = rows;
  if (filters.season) out = out.filter((r) => r.season === filters.season);
  if (filters.brand) out = out.filter((r) => r.brand === filters.brand);
  return out;
}

/** Имитация задержки сети (для проверки loading UI). При подключении API убрать. */
const MOCK_DELAY_MS = 0;

function delay(ms: number): Promise<void> {
  return ms <= 0 ? Promise.resolve() : new Promise((r) => setTimeout(r, ms));
}

/** Трекинг отгрузки заказа. Сейчас: мок. Потом: GET B2B_ENDPOINTS.orderShipment(orderId) */
export async function fetchOrderShipment(orderId: string): Promise<OrderShipmentTracking> {
  await delay(MOCK_DELAY_MS);
  // Когда будет API:
  // const res = await fetch(API_BASE + B2B_ENDPOINTS.orderShipment(orderId), { headers: { Authorization: `Bearer ${token}` } });
  // if (!res.ok) throw new Error(await res.text());
  // return res.json();
  return getOrderShipmentTracking(orderId);
}

/** Продажи по брендам с фильтрами. Сейчас: мок. Потом: GET partnerReportsSalesByBrand?season=&brand= */
export async function fetchPartnerReportsSalesByBrand(
  filters: PartnerReportsFilters
): Promise<SalesByBrandRow[]> {
  await delay(MOCK_DELAY_MS);
  return filterBySeasonBrand(MOCK_SALES_BY_BRAND, filters);
}

/** Топ SKU с фильтрами. */
export async function fetchPartnerReportsTopSku(
  filters: PartnerReportsFilters
): Promise<TopSkuRow[]> {
  await delay(MOCK_DELAY_MS);
  return filterBySeasonBrand(MOCK_TOP_SKU, filters);
}

/** Sell-through с фильтрами. */
export async function fetchPartnerReportsSellThrough(
  filters: PartnerReportsFilters
): Promise<SellThroughRow[]> {
  await delay(MOCK_DELAY_MS);
  return filterBySeasonBrand(MOCK_SELL_THROUGH, filters);
}

/** План/факт с фильтрами. */
export async function fetchPartnerReportsPlanFact(
  filters: PartnerReportsFilters
): Promise<PlanFactRow[]> {
  await delay(MOCK_DELAY_MS);
  return filterBySeasonBrand(MOCK_PLAN_FACT, filters);
}
