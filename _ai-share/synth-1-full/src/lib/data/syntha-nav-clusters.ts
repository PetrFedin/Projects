/**
 * Кластеры левой панели: **основной контур** (`syntha-cores`) и **архив** (`archive`).
 *
 * Политика по профилям: в основном контуре остаётся только то, что относится к ежедневной
 * работе этого актора (бренд / магазин / дистрибутор / производство / поставщик). Остальное
 * (обзоры, аналитика, зеркала байера, LIVE-сценарии, маркетинг, финансы, инструменты,
 * расширенные настройки) — в **архиве того же профиля**, без смешения в один «глобальный» архив.
 *
 * Технически: у каждой группы в данных навигации задан `clusterId`; порядок внутри кластера —
 * константы `*_CORE_GROUP_ORDER` и `*_ARCHIVE_GROUP_ORDER` ниже. Сайдбары: `BrandSidebar`,
 * `ShopSidebar`, `HubSidebar` (дистрибутор, manufacturer, supplier).
 *
 * Продуктовая модель взаимодействия акторов и состав контура: `CABINET-INTERACTION-ARCHITECTURE.md`,
 * межролевые цепочки и чеклисты: `CROSS_ROLE_FLOWS.md`. Проверки навигации: `npm run validate:cabinet-nav`
 * (матрица ролей, `comms`, **ядра `*_CORE_GROUP_ORDER` ↔ `syntha-cores`**, **href навигации кабинетов**).
 *
 * Смысл «ядер» Syntha: №1 — продукт и производство; №2 — опт и сеть; №3 — связь и координация.
 */
export const SYNTHA_SIDEBAR_CLUSTERS = [
  { id: 'syntha-cores', label: 'Основной контур · ядра 1–3', order: 1 },
  { id: 'archive', label: 'Архив', order: 2 },
] as const;

export type SynthaSidebarClusterId = (typeof SYNTHA_SIDEBAR_CLUSTERS)[number]['id'];

/**
 * Кабинет **бренда**: основной контур — команда → связь → партнёры → разработка → товар (pim) →
 * заказы B2B → производство → логистика. Прочие группы (`brand-admin`, маркетинг, аналитика, …)
 * задаются в данных навигации как `clusterId: 'archive'` и перечислены в `BRAND_ARCHIVE_GROUP_ORDER`.
 */
export const BRAND_CORE_GROUP_ORDER: readonly string[] = [
  'team',
  'comms',
  'partners',
  'development',
  'pim',
  'b2b',
  'production',
  'logistics',
];

/** Порядок групп в архиве бренда. */
export const BRAND_ARCHIVE_GROUP_ORDER: readonly string[] = [
  'production-live',
  'b2b-showcase',
  'buyer-retail-mirror',
  'brand-admin',
  'marketing',
  'analytics',
  'finance',
  'tools',
];

/**
 * Магазин: те же столпы, что у бренда (`BRAND_CORE_GROUP_ORDER`), кроме `development` и `production`.
 * `partners` — бренды и договоры; `pim` — каталог/матрица/шоурум байера; `b2b` — заказы опта; `logistics` — склад сети и поставки.
 */
export const SHOP_CORE_GROUP_ORDER: readonly string[] = [
  'team',
  'comms',
  'partners',
  'pim',
  'b2b',
  'logistics',
];

export const SHOP_ARCHIVE_GROUP_ORDER: readonly string[] = [
  'overview',
  'retail-ops',
  'shop-b2b-extended',
  'analytics',
  'management',
];

/** Дистрибутор: как у бренда по порядку столбов — команда, связь, партнёры, заказы B2B, логистика (без разработки, товара бренда, производства). */
export const DISTRIBUTOR_CORE_GROUP_ORDER: readonly string[] = [
  'team',
  'comms',
  'partners',
  'b2b',
  'logistics',
];

export const DISTRIBUTOR_ARCHIVE_GROUP_ORDER: readonly string[] = [
  'overview',
  'finance',
  'logistics',
  'analytics',
  'management-rest',
];

/**
 * Производство: столпы бренда — команда, связь, партнёры (фабрики/субподряд), производство, логистика;
 * без `pim`/`b2b`/`development`. QC — в архиве (детализация цеха). В данных навигации ядро уплотнено: см. `factory-navigation.ts`.
 */
export const FACTORY_MFR_CORE_GROUP_ORDER: readonly string[] = [
  'team',
  'comms',
  'partners',
  'production',
  'logistics',
];

export const FACTORY_MFR_ARCHIVE_GROUP_ORDER: readonly string[] = [
  'overview',
  'materials',
  'qc',
  'analytics',
];

/**
 * Поставщик: команда, связь, партнёры (сеть), товар (`pim` — материалы/RFQ), логистика — как у бренда по смыслу столбов.
 * Детали уплотнения `pim`/`logistics`: `factory-navigation.ts` (`supplierNavGroups`).
 */
export const FACTORY_SUP_CORE_GROUP_ORDER: readonly string[] = [
  'team',
  'comms',
  'partners',
  'pim',
  'logistics',
];

export const FACTORY_SUP_ARCHIVE_GROUP_ORDER: readonly string[] = [
  'overview',
  'compliance',
  'analytics',
];

export function sortNavGroupsByOrder<T extends { id: string }>(
  groups: T[],
  order: readonly string[]
): T[] {
  const idx = (id: string) => {
    const i = order.indexOf(id);
    return i === -1 ? 1000 + groups.findIndex((g) => g.id === id) : i;
  };
  return [...groups].sort((a, b) => idx(a.id) - idx(b.id));
}
