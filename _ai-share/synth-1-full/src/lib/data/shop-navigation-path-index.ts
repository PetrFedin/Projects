/**
 * Лёгкий индекс href→value/label для shop layout (breadcrumbs, active tab).
 * Без lucide — не тянет shop-navigation-data в initial chunk layout.
 * Синхронизация: npm run shop-nav:sync-path-index.
 */

export type ShopNavPathCandidate = {
  href: string;
  value: string;
  label: string;
};

export const shopNavPathCandidates: readonly ShopNavPathCandidate[] = [
  {
    href: '/shop/staff',
    value: 'staff',
    label: 'Команда',
  },
  {
    href: '/shop/messages',
    value: 'messages',
    label: 'Сообщения',
  },
  {
    href: '/shop/calendar?layers=orders,logistics',
    value: 'calendar',
    label: 'Календарь',
  },
  {
    href: '/shop',
    value: 'dashboard',
    label: 'Сводка',
  },
  {
    href: '/shop/orders',
    value: 'orders',
    label: 'Заказы клиентов',
  },
  {
    href: '/shop/orders',
    value: 'orders',
    label: 'Заказы клиентов',
  },
  {
    href: '/shop/orders?status=pending',
    value: 'orders',
    label: 'Заказы клиентов',
  },
  {
    href: '/shop/orders?status=shipped',
    value: 'orders',
    label: 'Заказы клиентов',
  },
  {
    href: '/shop/orders?status=completed',
    value: 'orders',
    label: 'Заказы клиентов',
  },
  {
    href: '/shop/bopis',
    value: 'omni-customer-fulfillment',
    label: 'Выдача и отгрузка',
  },
  {
    href: '/shop/bopis',
    value: 'omni-customer-fulfillment',
    label: 'Выдача и отгрузка',
  },
  {
    href: '/shop/endless-aisle',
    value: 'omni-customer-fulfillment',
    label: 'Выдача и отгрузка',
  },
  {
    href: '/shop/ship-from-store',
    value: 'omni-customer-fulfillment',
    label: 'Выдача и отгрузка',
  },
  {
    href: '/shop/promotions',
    value: 'promotions',
    label: 'Акции и скидки',
  },
  {
    href: '/shop/clienteling',
    value: 'clienteling',
    label: 'Клиенты и лояльность',
  },
  {
    href: '/shop/stylist-tablet',
    value: 'stylist-tablet',
    label: 'Планшет стилиста',
  },
  {
    href: '/shop/bnpl',
    value: 'bnpl',
    label: 'Рассрочка на кассе',
  },
  {
    href: '/shop/b2b/partners',
    value: 'partner-funnel',
    label: 'Партнёры',
  },
  {
    href: '/shop/b2b/discover',
    value: 'partner-funnel',
    label: 'Партнёры',
  },
  {
    href: '/shop/b2b/apply',
    value: 'partner-funnel',
    label: 'Партнёры',
  },
  {
    href: '/shop/b2b/partners',
    value: 'partner-funnel',
    label: 'Партнёры',
  },
  {
    href: '/shop/b2b/contracts',
    value: 'partner-funnel',
    label: 'Партнёры',
  },
  {
    href: '/shop/b2b/documents',
    value: 'partner-funnel',
    label: 'Партнёры',
  },
  {
    href: '/shop/b2b/rating',
    value: 'partner-funnel',
    label: 'Партнёры',
  },
  {
    href: '/shop/b2b/catalog',
    value: 'b2b-catalog',
    label: 'Каталог опта',
  },
  {
    href: '/shop/b2b/matrix',
    value: 'b2b-catalog',
    label: 'Каталог опта',
  },
  {
    href: '/shop/b2b/collection-terms',
    value: 'collection-planning',
    label: 'Коллекции и план',
  },
  {
    href: '/shop/b2b/collection-terms',
    value: 'collection-planning',
    label: 'Коллекции и план',
  },
  {
    href: '/shop/b2b/assortment-planning',
    value: 'collection-planning',
    label: 'Коллекции и план',
  },
  {
    href: '/shop/b2b/selection-builder',
    value: 'collection-planning',
    label: 'Коллекции и план',
  },
  {
    href: '/shop/b2b/showroom',
    value: 'showroom-suite',
    label: 'Шоурум и презентации',
  },
  {
    href: '/shop/b2b/showroom',
    value: 'showroom-suite',
    label: 'Шоурум и презентации',
  },
  {
    href: '/shop/b2b/video-consultation',
    value: 'showroom-suite',
    label: 'Шоурум и презентации',
  },
  {
    href: '/shop/b2b/orders',
    value: 'b2b-orders',
    label: 'Заказы B2B',
  },
  {
    href: '/shop/b2b/orders',
    value: 'b2b-orders',
    label: 'Заказы B2B',
  },
  {
    href: '/shop/b2b/orders?status=draft',
    value: 'b2b-orders',
    label: 'Заказы B2B',
  },
  {
    href: '/shop/b2b/orders?status=pending',
    value: 'b2b-orders',
    label: 'Заказы B2B',
  },
  {
    href: '/shop/b2b/orders?status=confirmed',
    value: 'b2b-orders',
    label: 'Заказы B2B',
  },
  {
    href: '/shop/b2b/orders?status=shipped',
    value: 'b2b-orders',
    label: 'Заказы B2B',
  },
  {
    href: '/shop/b2b/order-mode',
    value: 'b2b-orders',
    label: 'Заказы B2B',
  },
  {
    href: '/shop/b2b/create-order',
    value: 'b2b-orders',
    label: 'Заказы B2B',
  },
  {
    href: '/shop/b2b/quick-order',
    value: 'b2b-orders',
    label: 'Заказы B2B',
  },
  {
    href: '/shop/b2b/order-drafts',
    value: 'b2b-orders',
    label: 'Заказы B2B',
  },
  {
    href: '/shop/b2b/order-templates',
    value: 'b2b-orders',
    label: 'Заказы B2B',
  },
  {
    href: '/shop/b2b/reorder',
    value: 'b2b-orders',
    label: 'Заказы B2B',
  },
  {
    href: '/shop/inventory',
    value: 'inventory',
    label: 'Склад и поставки B2B',
  },
  {
    href: '/shop/inventory',
    value: 'inventory',
    label: 'Склад и поставки B2B',
  },
  {
    href: '/shop/inventory/archive',
    value: 'inventory',
    label: 'Склад и поставки B2B',
  },
  {
    href: '/shop/b2b/fulfillment-dashboard',
    value: 'inventory',
    label: 'Склад и поставки B2B',
  },
  {
    href: '/shop/b2b/delivery-calendar',
    value: 'inventory',
    label: 'Склад и поставки B2B',
  },
  {
    href: '/shop/b2b/replenishment',
    value: 'inventory',
    label: 'Склад и поставки B2B',
  },
  {
    href: '/shop/b2b/tracking',
    value: 'inventory',
    label: 'Склад и поставки B2B',
  },
  {
    href: '/shop/b2b/stock-map',
    value: 'inventory',
    label: 'Склад и поставки B2B',
  },
  {
    href: '/shop/b2b/trade-shows',
    value: 'trade-events',
    label: 'Выставки и события',
  },
  {
    href: '/shop/b2b/whiteboard',
    value: 'whiteboard',
    label: 'Визуальная доска',
  },
  {
    href: '/shop/b2b/payment',
    value: 'payment',
    label: 'Оплата заказов',
  },
  {
    href: '/shop/b2b/multi-currency',
    value: 'multi-currency',
    label: 'Валюты и курсы',
  },
  {
    href: '/shop/b2b/landed-cost',
    value: 'landed-cost',
    label: 'Полная себестоимость',
  },
  {
    href: '/shop/b2b/claims',
    value: 'claims',
    label: 'Претензии и возвраты',
  },
  {
    href: '/shop/b2b/size-mapping',
    value: 'size-mapping',
    label: 'Соответствие размеров',
  },
  {
    href: '/shop/b2b/tenders',
    value: 'indirect-procurement',
    label: 'Тендеры и RFQ',
  },
  {
    href: '/shop/b2b/tenders',
    value: 'indirect-procurement',
    label: 'Тендеры и RFQ',
  },
  {
    href: '/shop/b2b/rfq',
    value: 'indirect-procurement',
    label: 'Тендеры и RFQ',
  },
  {
    href: '/shop/b2b/supplier-discovery',
    value: 'indirect-procurement',
    label: 'Тендеры и RFQ',
  },
  {
    href: '/shop/b2b/ai-search',
    value: 'ai-suite',
    label: 'Умный поиск и заказ',
  },
  {
    href: '/shop/b2b/ai-search',
    value: 'ai-suite',
    label: 'Умный поиск и заказ',
  },
  {
    href: '/shop/b2b/ai-smart-order',
    value: 'ai-suite',
    label: 'Умный поиск и заказ',
  },
  {
    href: '/shop/b2b/scanner',
    value: 'scanner',
    label: 'Сканер',
  },
  {
    href: '/shop/b2b/social-feed',
    value: 'social-feed',
    label: 'Лента брендов',
  },
  {
    href: '/shop/b2b/vip-room-booking',
    value: 'vip-room-booking',
    label: 'Зал для встреч',
  },
  {
    href: '/shop/inventory/cycle-counting',
    value: 'cycle-counting',
    label: 'Инвентаризация по зонам',
  },
  {
    href: '/shop/local-inventory-ads',
    value: 'lia',
    label: 'Наличие на картах',
  },
  {
    href: '/shop/b2b/shopify-sync',
    value: 'shopify-sync',
    label: 'Учёт и каналы',
  },
  {
    href: '/shop/analytics',
    value: 'retail-analytics',
    label: 'Розница',
  },
  {
    href: '/shop/analytics',
    value: 'retail-analytics',
    label: 'Розница',
  },
  {
    href: '/shop/analytics/footfall',
    value: 'retail-analytics',
    label: 'Розница',
  },
  {
    href: '/shop/b2b/analytics',
    value: 'b2b-analytics',
    label: 'Опт',
  },
  {
    href: '/shop/b2b/analytics',
    value: 'b2b-analytics',
    label: 'Опт',
  },
  {
    href: '/shop/b2b/order-analytics',
    value: 'b2b-analytics',
    label: 'Опт',
  },
  {
    href: '/shop/b2b/reports',
    value: 'b2b-analytics',
    label: 'Опт',
  },
  {
    href: '/shop/b2b/finance',
    value: 'b2b-analytics',
    label: 'Опт',
  },
  {
    href: '/shop/b2b/payment',
    value: 'b2b-analytics',
    label: 'Опт',
  },
  {
    href: '/shop/b2b/margin-analysis',
    value: 'margin-suite',
    label: 'Маржа и рентабельность',
  },
  {
    href: '/shop/b2b/margin-analysis',
    value: 'margin-suite',
    label: 'Маржа и рентабельность',
  },
  {
    href: '/shop/b2b/margin-report',
    value: 'margin-suite',
    label: 'Маржа и рентабельность',
  },
  {
    href: '/shop/b2b/margin-calculator',
    value: 'margin-suite',
    label: 'Маржа и рентабельность',
  },
  {
    href: '/shop/b2b/landed-cost',
    value: 'margin-suite',
    label: 'Маржа и рентабельность',
  },
  {
    href: '/shop/b2b/workspace-map',
    value: 'b2b-workspace-map',
    label: 'Схема процессов опта',
  },
  {
    href: '/shop/b2b/budget',
    value: 'budget',
    label: 'Бюджет закупок',
  },
  {
    href: '/shop/b2b/budget',
    value: 'budget',
    label: 'Бюджет закупок',
  },
  {
    href: '/shop/b2b/budget/FW26',
    value: 'budget',
    label: 'Бюджет закупок',
  },
  {
    href: '/shop/b2b/budget/SS27',
    value: 'budget',
    label: 'Бюджет закупок',
  },
  {
    href: '/shop/b2b/partner-onboarding',
    value: 'partner-onboarding',
    label: 'Подключение партнёра',
  },
  {
    href: '/shop/b2b/dealer-cabinet',
    value: 'dealer-cabinet',
    label: 'Кабинет дилера',
  },
  {
    href: '/store-locator',
    value: 'store-locator',
    label: 'Карта магазинов сети',
  },
  {
    href: '/shop/b2b/gamification',
    value: 'gamification',
    label: 'Соревнования и награды',
  },
  {
    href: '/brand/b2b-orders',
    value: 'related-cabinets',
    label: 'Связанные кабинеты',
  },
  {
    href: '/brand/b2b-orders',
    value: 'related-cabinets',
    label: 'Связанные кабинеты',
  },
  {
    href: '/brand/b2b/trade-shows',
    value: 'related-cabinets',
    label: 'Связанные кабинеты',
  },
  {
    href: '/distributor',
    value: 'related-cabinets',
    label: 'Связанные кабинеты',
  },
  {
    href: '/admin',
    value: 'related-cabinets',
    label: 'Связанные кабинеты',
  },
  {
    href: '/shop/b2b/settings',
    value: 'settings',
    label: 'Настройки',
  },
] as const;

export const shopMainNavLabelByValue: Readonly<Record<string, string>> = {
  staff: 'Команда',
  messages: 'Сообщения',
  calendar: 'Календарь',
  dashboard: 'Сводка',
  orders: 'Заказы клиентов',
  'omni-customer-fulfillment': 'Выдача и отгрузка',
  promotions: 'Акции и скидки',
  clienteling: 'Клиенты и лояльность',
  'stylist-tablet': 'Планшет стилиста',
  bnpl: 'Рассрочка на кассе',
  'partner-funnel': 'Партнёры',
  'b2b-catalog': 'Каталог опта',
  'collection-planning': 'Коллекции и план',
  'showroom-suite': 'Шоурум и презентации',
  'b2b-orders': 'Заказы B2B',
  inventory: 'Склад и поставки B2B',
  'trade-events': 'Выставки и события',
  whiteboard: 'Визуальная доска',
  payment: 'Оплата заказов',
  'multi-currency': 'Валюты и курсы',
  'landed-cost': 'Полная себестоимость',
  claims: 'Претензии и возвраты',
  'size-mapping': 'Соответствие размеров',
  'indirect-procurement': 'Тендеры и RFQ',
  'ai-suite': 'Умный поиск и заказ',
  scanner: 'Сканер',
  'social-feed': 'Лента брендов',
  'vip-room-booking': 'Зал для встреч',
  'cycle-counting': 'Инвентаризация по зонам',
  lia: 'Наличие на картах',
  'shopify-sync': 'Учёт и каналы',
  'retail-analytics': 'Розница',
  'b2b-analytics': 'Опт',
  'margin-suite': 'Маржа и рентабельность',
  'b2b-workspace-map': 'Схема процессов опта',
  budget: 'Бюджет закупок',
  'partner-onboarding': 'Подключение партнёра',
  'dealer-cabinet': 'Кабинет дилера',
  'store-locator': 'Карта магазинов сети',
  gamification: 'Соревнования и награды',
  'related-cabinets': 'Связанные кабинеты',
  settings: 'Настройки',
};
