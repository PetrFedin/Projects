/**
 * Единая подпись на реестр оптовых заказов бренда (`/brand/b2b-orders`):
 * интеграции, MODULE_HUBS, смоки, бейджи — импортировать отсюда, не дублировать строку.
 */
export const B2B_ORDERS_REGISTRY_LABEL = 'Реестр B2B-заказов' as const;

/** Хаб оптовых заказов в кабинете shop/distributor (`ROUTES.shop.b2bOrders`) — не путать с реестром бренда. */
export const SHOP_B2B_ORDERS_HUB_LABEL = 'B2B Заказы' as const;
