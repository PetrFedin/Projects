/**
 * Аналитика и отчёты для партнёра (FashioNexus / JOOR wholesale analytics).
 * Мок: продажи по брендам, топ SKU, sell-through по артикулам, план/факт закупок.
 */

export interface SalesByBrandRow {
  brand: string;
  revenue: number;
  cost: number;
  margin: number;
  units: number;
  season: string;
}

export interface TopSkuRow {
  sku: string;
  name: string;
  brand: string;
  category: string;
  unitsSold: number;
  revenue: number;
  sellThroughPct: number;
  season: string;
}

export interface SellThroughRow {
  sku: string;
  name: string;
  brand: string;
  purchased: number;
  sold: number;
  sellThroughPct: number;
  season: string;
}

export interface PlanFactRow {
  brand: string;
  season: string;
  planAmount: number;
  factAmount: number;
  planUnits: number;
  factUnits: number;
  fulfillmentPct: number;
}

/** Продажи по брендам (мок) — только демо-бренды платформы */
export const MOCK_SALES_BY_BRAND: SalesByBrandRow[] = [
<<<<<<< HEAD
  { brand: 'Syntha', revenue: 2_450_000, cost: 1_420_000, margin: 42, units: 1240, season: 'SS26' },
  { brand: 'A.P.C.', revenue: 1_800_000, cost: 1_080_000, margin: 40, units: 890, season: 'SS26' },
  {
    brand: 'Acne Studios',
    revenue: 920_000,
    cost: 552_000,
    margin: 40,
    units: 410,
=======
  {
    brand: 'Syntha Lab',
    revenue: 2_450_000,
    cost: 1_420_000,
    margin: 42,
    units: 1240,
    season: 'SS26',
  },
  {
    brand: 'Nordic Wool',
    revenue: 1_920_000,
    cost: 1_120_000,
    margin: 42,
    units: 980,
>>>>>>> recover/cabinet-wip-from-stash
    season: 'SS26',
  },
];

/** Топ SKU по продажам (мок) */
export const MOCK_TOP_SKU: TopSkuRow[] = [
  {
    sku: 'CTP-26-001',
    name: 'Graphene Parka',
<<<<<<< HEAD
    brand: 'Syntha',
=======
    brand: 'Syntha Lab',
>>>>>>> recover/cabinet-wip-from-stash
    category: 'Верхняя одежда',
    unitsSold: 420,
    revenue: 840_000,
    sellThroughPct: 88,
    season: 'SS26',
  },
  {
    sku: 'CTP-26-002',
    name: 'Merino Sweater',
<<<<<<< HEAD
    brand: 'Syntha',
=======
    brand: 'Syntha Lab',
>>>>>>> recover/cabinet-wip-from-stash
    category: 'Трикотаж',
    unitsSold: 380,
    revenue: 684_000,
    sellThroughPct: 82,
    season: 'SS26',
  },
  {
    sku: 'CTP-26-003',
    name: 'Tech Trousers',
<<<<<<< HEAD
    brand: 'Syntha',
=======
    brand: 'Syntha Lab',
>>>>>>> recover/cabinet-wip-from-stash
    category: 'Брюки',
    unitsSold: 290,
    revenue: 435_000,
    sellThroughPct: 71,
    season: 'SS26',
  },
  {
<<<<<<< HEAD
    sku: 'APC-DJ-01',
    name: 'Classic Denim',
    brand: 'A.P.C.',
    category: 'Деним',
    unitsSold: 210,
    revenue: 378_000,
    sellThroughPct: 75,
    season: 'SS26',
  },
  {
    sku: 'ACNE-BAG-1',
    name: 'Scarf Wool',
    brand: 'Acne Studios',
    category: 'Аксессуары',
    unitsSold: 180,
    revenue: 162_000,
=======
    sku: 'NW-K001-BLK',
    name: 'Кашемировый лонгслив',
    brand: 'Nordic Wool',
    category: 'Трикотаж',
    unitsSold: 310,
    revenue: 682_000,
    sellThroughPct: 86,
    season: 'SS26',
  },
  {
    sku: 'NW-SCF-02',
    name: 'Шерстяной платок',
    brand: 'Nordic Wool',
    category: 'Аксессуары',
    unitsSold: 180,
    revenue: 270_000,
>>>>>>> recover/cabinet-wip-from-stash
    sellThroughPct: 90,
    season: 'SS26',
  },
  {
    sku: 'SYN-K001-BLK',
    name: 'Кашемировый свитер',
<<<<<<< HEAD
    brand: 'Syntha',
=======
    brand: 'Syntha Lab',
>>>>>>> recover/cabinet-wip-from-stash
    category: 'Трикотаж',
    unitsSold: 165,
    revenue: 412_500,
    sellThroughPct: 85,
    season: 'FW25',
  },
];

/** Sell-through по артикулам: закуплено / продано / % (мок) */
export const MOCK_SELL_THROUGH: SellThroughRow[] = [
  {
    sku: 'CTP-26-001',
    name: 'Graphene Parka',
<<<<<<< HEAD
    brand: 'Syntha',
=======
    brand: 'Syntha Lab',
>>>>>>> recover/cabinet-wip-from-stash
    purchased: 480,
    sold: 420,
    sellThroughPct: 88,
    season: 'SS26',
  },
  {
    sku: 'CTP-26-002',
    name: 'Merino Sweater',
<<<<<<< HEAD
    brand: 'Syntha',
=======
    brand: 'Syntha Lab',
>>>>>>> recover/cabinet-wip-from-stash
    purchased: 464,
    sold: 380,
    sellThroughPct: 82,
    season: 'SS26',
  },
  {
    sku: 'CTP-26-003',
    name: 'Tech Trousers',
<<<<<<< HEAD
    brand: 'Syntha',
=======
    brand: 'Syntha Lab',
>>>>>>> recover/cabinet-wip-from-stash
    purchased: 408,
    sold: 290,
    sellThroughPct: 71,
    season: 'SS26',
  },
  {
<<<<<<< HEAD
    sku: 'APC-DJ-01',
    name: 'Classic Denim',
    brand: 'A.P.C.',
    purchased: 280,
    sold: 210,
    sellThroughPct: 75,
    season: 'SS26',
  },
  {
    sku: 'ACNE-BAG-1',
    name: 'Scarf Wool',
    brand: 'Acne Studios',
=======
    sku: 'NW-K001-BLK',
    name: 'Кашемировый лонгслив',
    brand: 'Nordic Wool',
    purchased: 360,
    sold: 310,
    sellThroughPct: 86,
    season: 'SS26',
  },
  {
    sku: 'NW-SCF-02',
    name: 'Шерстяной платок',
    brand: 'Nordic Wool',
>>>>>>> recover/cabinet-wip-from-stash
    purchased: 200,
    sold: 180,
    sellThroughPct: 90,
    season: 'SS26',
  },
];

/** План/факт закупок по брендам (мок) */
export const MOCK_PLAN_FACT: PlanFactRow[] = [
  {
<<<<<<< HEAD
    brand: 'Syntha',
=======
    brand: 'Syntha Lab',
>>>>>>> recover/cabinet-wip-from-stash
    season: 'SS26',
    planAmount: 2_800_000,
    factAmount: 2_650_000,
    planUnits: 1400,
    factUnits: 1320,
    fulfillmentPct: 94,
  },
  {
<<<<<<< HEAD
    brand: 'A.P.C.',
    season: 'SS26',
    planAmount: 2_000_000,
    factAmount: 1_800_000,
    planUnits: 1000,
    factUnits: 890,
    fulfillmentPct: 90,
  },
  {
    brand: 'Acne Studios',
    season: 'SS26',
    planAmount: 1_000_000,
    factAmount: 920_000,
    planUnits: 450,
    factUnits: 410,
    fulfillmentPct: 92,
=======
    brand: 'Nordic Wool',
    season: 'SS26',
    planAmount: 2_100_000,
    factAmount: 1_920_000,
    planUnits: 1050,
    factUnits: 980,
    fulfillmentPct: 93,
>>>>>>> recover/cabinet-wip-from-stash
  },
];

/** Экранирование поля CSV (RFC 4180): если есть delimiter или кавычки — оборачиваем в кавычки и дублируем кавычки */
function escapeCsvField(value: string, delimiter: string): string {
  const needsQuotes =
    value.includes(delimiter) ||
    value.includes('"') ||
    value.includes('\n') ||
    value.includes('\r');
  if (!needsQuotes) return value;
  return '"' + value.replace(/"/g, '""') + '"';
}

/** Экспорт таблицы в CSV (универсальный). Разделитель ; для Excel (ru). Экранирование по RFC 4180. */
export function exportToCsv<T extends object>(
  rows: T[],
  columns: { key: keyof T; header: string }[],
  filename: string,
  options?: { delimiter?: string }
): void {
  const delimiter = options?.delimiter ?? ';';
  const header = columns.map((c) => escapeCsvField(c.header, delimiter)).join(delimiter);
  const lines = rows.map((row) =>
    columns.map((c) => escapeCsvField(String(row[c.key] ?? ''), delimiter)).join(delimiter)
  );
  const csv = [header, ...lines].join('\n');
  const blob = new Blob(['\uFEFF' + csv], { type: 'text/csv;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}
