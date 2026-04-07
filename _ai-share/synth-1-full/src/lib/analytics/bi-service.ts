/**
 * BI / Analytics layer — продвинутая B2B аналитика.
 * Сводка: Production, B2B, Finance, Warehouse, Platform, Marketplace, Outlet, Collections, Distributors.
 */

export interface BIMetric {
  id: string;
  label: string;
  value: string | number;
  change?: number;
  unit?: string;
  source: 'production' | 'b2b' | 'finance' | 'warehouse' | 'platform' | 'marketing';
}

export interface BIDashboardData {
  production: { poCount: number; shippedCount: number; collectionsCount: number; avgLeadTime: number; bottleneckOrders: number };
  b2b: { ordersCount: number; revenue: string; retailersCount: number; distributorsRevenue: string; collectionDrops: number };
  finance: { revenueMonth: string; pnl: string; cashFlow: string; escrowPending: string };
  warehouse: { skuCount: number; totalUnits: number; reservedUnits: number; turnoverRate: string; deadStock: number };
  platform: { marketroomRevenue: string; outletRevenue: string; preOrders: number; customerBase: number };
  byChannel: { b2b: string; b2c: string; marketroom: string; outlet: string };
  topRetailers: { name: string; revenue: string; orders: number }[];
  byCollection: { name: string; revenue: string; sellThrough: string }[];
}

export function buildBIDashboard(mock?: Partial<BIDashboardData>): BIDashboardData {
  const base: BIDashboardData = {
    production: { poCount: 4, shippedCount: 3, collectionsCount: 12, avgLeadTime: 28, bottleneckOrders: 2, ...mock?.production },
    b2b: { ordersCount: 7, revenue: '2.4M ₽', retailersCount: 24, distributorsRevenue: '1.8M ₽', collectionDrops: 5, ...mock?.b2b },
    finance: { revenueMonth: '2.4M ₽', pnl: '+12%', cashFlow: '18 дн.', escrowPending: '450K ₽', ...mock?.finance },
    warehouse: { skuCount: 3, totalUnits: 400, reservedUnits: 90, turnoverRate: '4.2x', deadStock: 12, ...mock?.warehouse },
    platform: { marketroomRevenue: '380K ₽', outletRevenue: '120K ₽', preOrders: 84, customerBase: 2847, ...mock?.platform },
    byChannel: { b2b: '68%', b2c: '14%', marketroom: '12%', outlet: '6%', ...mock?.byChannel },
    topRetailers: [
      { name: 'ЦУМ', revenue: '2.1M ₽', orders: 12 },
      { name: 'Podium', revenue: '1.8M ₽', orders: 8 },
      { name: 'Lamoda', revenue: '1.2M ₽', orders: 15 },
    ],
    byCollection: [
      { name: 'SS26 Main', revenue: '1.2M ₽', sellThrough: '78%' },
      { name: 'SS26 Pre', revenue: '680K ₽', sellThrough: '65%' },
      { name: 'Outlet', revenue: '120K ₽', sellThrough: '92%' },
    ],
  };
  return { ...base, ...mock };
}

export function exportBIDataToCSV(data: BIDashboardData): string {
  const rows: string[][] = [
    ['Раздел', 'Метрика', 'Значение'],
    ['Production', 'PO в работе', String(data.production.poCount)],
    ['Production', 'Отгружено', String(data.production.shippedCount)],
    ['Production', 'Коллекций', String(data.production.collectionsCount)],
    ['Production', 'Средний lead time (дн.)', String(data.production.avgLeadTime)],
    ['B2B', 'Заказов', String(data.b2b.ordersCount)],
    ['B2B', 'Выручка', data.b2b.revenue],
    ['B2B', 'Ритейлеров', String(data.b2b.retailersCount)],
    ['B2B', 'Выручка дистрибуторов', data.b2b.distributorsRevenue],
    ['Finance', 'Выручка за месяц', data.finance.revenueMonth],
    ['Finance', 'P&L', data.finance.pnl],
    ['Finance', 'Запас кэша', data.finance.cashFlow],
    ['Warehouse', 'SKU', String(data.warehouse.skuCount)],
    ['Warehouse', 'Единиц всего', String(data.warehouse.totalUnits)],
    ['Warehouse', 'Оборачиваемость', data.warehouse.turnoverRate],
    ['Platform', 'Marketroom', data.platform.marketroomRevenue],
    ['Platform', 'Outlet', data.platform.outletRevenue],
  ];
  return rows.map((r) => r.join(',')).join('\n');
}
