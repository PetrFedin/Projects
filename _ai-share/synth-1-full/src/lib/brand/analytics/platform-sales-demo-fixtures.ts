/**
 * Демо-статистика Маркетрум / Аутлет для `platform-sales/page.tsx` до подключения API.
 */

export const PLATFORM_SALES_DEMO_MARKETROOM = {
  revenue: '380 000 ₽',
  revenueChange: 12.4,
  orders: 156,
  ordersChange: 8,
  units: 412,
  avgCheck: '2 436 ₽',
  topProducts: [
    { name: 'Куртка CTP-26-001', revenue: '48 200 ₽', units: 18 },
    { name: 'Брюки CTP-26-012', revenue: '42 100 ₽', units: 22 },
    { name: 'Свитшот CTP-26-005', revenue: '38 900 ₽', units: 28 },
  ],
} as const;

export const PLATFORM_SALES_DEMO_OUTLET = {
  revenue: '120 000 ₽',
  revenueChange: -5.2,
  orders: 89,
  ordersChange: 2,
  units: 198,
  avgCheck: '1 348 ₽',
  topProducts: [
    { name: 'SS25 Остатки — Свитшот', revenue: '22 400 ₽', units: 32 },
    { name: 'SS25 Остатки — Брюки', revenue: '18 900 ₽', units: 21 },
    { name: 'Аксессуары уценка', revenue: '15 200 ₽', units: 44 },
  ],
} as const;
