/**
 * Константы эндпоинтов B2B API. Инфраструктура под будущую интеграцию.
 * Базовый URL брать из process.env.NEXT_PUBLIC_API_URL или fastapi-service.
 */

const B2B_PREFIX = '/b2b';

export const B2B_ENDPOINTS = {
  /** Трекинг отгрузки по заказу (JOOR ASN / FashioNexus) */
  orderShipment: (orderId: string) => `${B2B_PREFIX}/orders/${encodeURIComponent(orderId)}/shipment`,
  /** Отчёты партнёра: продажи по брендам (query: season?, brand?) */
  partnerReportsSalesByBrand: `${B2B_PREFIX}/partner/reports/sales-by-brand`,
  /** Отчёты: топ SKU (query: season?, brand?, limit?) */
  partnerReportsTopSku: `${B2B_PREFIX}/partner/reports/top-sku`,
  /** Отчёты: sell-through по артикулам (query: season?, brand?) */
  partnerReportsSellThrough: `${B2B_PREFIX}/partner/reports/sell-through`,
  /** Отчёты: план/факт закупок (query: season?) */
  partnerReportsPlanFact: `${B2B_PREFIX}/partner/reports/plan-fact`,
} as const;
