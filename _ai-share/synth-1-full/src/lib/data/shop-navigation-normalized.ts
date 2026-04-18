'use client';

import { ROUTES } from '@/lib/routes';
import {
  Handshake,
  BarChart2,
  MessageSquare,
  Users,
  Briefcase,
  Edit,
  FileText,
  Percent,
  RefreshCcw,
  Calendar,
  Sigma,
  Star,
  DollarSign,
  BookText,
  Store,
  TrendingUp,
  Target,
  Building2,
  CreditCard,
  ShoppingBag,
  Archive,
  PlusCircle,
  Zap,
  LayoutGrid,
  Calculator,
  Map,
  Search,
  ShieldAlert,
  Camera,
  LayoutDashboard,
  ShoppingCart,
  Package,
  ListOrdered,
  Settings,
  Truck,
  UserPlus,
  CalendarDays,
  Ruler,
  Layers,
  UserCircle,
  Gavel,
  Sparkles,
  Network,
} from 'lucide-react';

/**
 * Навигация кабинета ритейлера: блоки без дублирования ссылок.
 * — Обзор → розница → склад сети → закупка у брендов → исполнение опта → сервис закупки → аналитика → сеть и доступы.
 * — Отслеживание поставок — в блоке исполнения (рядом с поставками и сроками), не в «Сети».
 * — Тендеры и котировки — отдельно от опта у бренда; учёт в складе; бюджет закупок — в сети.
 * — `/shop/b2b` → редирект на `/shop`.
 * — У пунктов меню опционально `navTier: 'phase2'` — скрываются при `NEXT_PUBLIC_SHOP_NAV_MVP=1`.
 */

export const shopNavGroups = [
  {
    id: 'overview',
    label: 'Обзор',
    icon: LayoutDashboard,
    links: [
      {
        href: ROUTES.shop.home,
        value: 'dashboard',
        label: 'Сводка',
        icon: LayoutDashboard,
        description: 'Ключевые показатели магазина',
      },
    ],
  },
  {
    id: 'retail-ops',
    label: 'Розница',
    icon: ShoppingCart,
    links: [
      {
        href: ROUTES.shop.orders,
        value: 'orders',
        label: 'Заказы клиентов',
        icon: ShoppingCart,
        description: 'Розничные заказы',
        subsections: [
          { href: ROUTES.shop.orders, label: 'Все заказы', value: 'all' },
          { href: `${ROUTES.shop.orders}?status=pending`, label: 'В обработке', value: 'pending' },
          { href: `${ROUTES.shop.orders}?status=shipped`, label: 'Отправлено', value: 'shipped' },
          {
            href: `${ROUTES.shop.orders}?status=completed`,
            label: 'Завершено',
            value: 'completed',
          },
        ],
      },
      {
        href: ROUTES.shop.bopis,
        value: 'omni-customer-fulfillment',
        label: 'Выдача и отгрузка',
        icon: Truck,
        description: 'Самовывоз, заказ с полки, между магазинами, отправка из точки',
        subsections: [
          { href: ROUTES.shop.bopis, label: 'Самовывоз из магазина', value: 'bopis' },
          {
            href: ROUTES.shop.endlessAisle,
            label: 'С полки и между магазинами',
            value: 'endless-aisle',
          },
          {
            href: ROUTES.shop.shipFromStore,
            label: 'Отправка из магазина',
            value: 'ship-from-store',
          },
        ],
      },
      {
        href: ROUTES.shop.promotions,
        value: 'promotions',
        label: 'Акции и скидки',
        icon: Percent,
        description: 'Промо и скидки',
      },
      {
        href: ROUTES.shop.clienteling,
        value: 'clienteling',
        label: 'Клиенты и лояльность',
        icon: Users,
        description: 'Персональные продажи и база клиентов',
      },
      {
        href: ROUTES.shop.stylistTablet,
        value: 'stylist-tablet',
        label: 'Планшет стилиста',
        icon: LayoutGrid,
        description: 'Сборка образа из каталога на планшете продавца',
        navTier: 'phase2' as const,
      },
      {
        href: ROUTES.shop.bnpl,
        value: 'bnpl',
        label: 'Рассрочка на кассе',
        icon: CreditCard,
        description: 'Рассрочка и оплата частями (банки-партнёры)',
      },
    ],
  },
  {
    id: 'inventory-precision',
    label: 'Склад сети',
    icon: Archive,
    links: [
      {
        href: ROUTES.shop.inventory,
        value: 'inventory',
        label: 'Склад и остатки',
        icon: Package,
        description: 'Остатки и движение',
        subsections: [
          { href: ROUTES.shop.inventory, label: 'Текущие остатки', value: 'current' },
          { href: ROUTES.shop.inventoryArchive, label: 'Архив', value: 'archive' },
        ],
      },
      {
        href: ROUTES.shop.cycleCounting,
        value: 'cycle-counting',
        label: 'Быстрая инвентаризация',
        icon: Camera,
        description: 'Пересчёт по зонам, камера телефона',
      },
      {
        href: ROUTES.shop.localInventoryAds,
        value: 'lia',
        label: 'Наличие на картах',
        icon: Map,
        description: 'Карточки в поиске карт (Google, Яндекс) с наличием',
        navTier: 'phase2' as const,
      },
      {
        href: ROUTES.shop.b2bShopifySync,
        value: 'shopify-sync',
        label: 'Учёт и каналы (1С, каталог)',
        icon: Package,
        description: 'Связка с 1С, каталогом и остатками',
      },
    ],
  },
  {
    id: 'b2b-procurement',
    label: 'Закупка у брендов',
    icon: Building2,
    links: [
      {
        href: ROUTES.shop.b2bPartners,
        value: 'partner-funnel',
        label: 'Бренды и партнёрство',
        icon: Handshake,
        description: 'Каталог брендов, заявки, портфель, договоры и документы',
        subsections: [
          { href: ROUTES.shop.b2bDiscover, label: 'Каталог и поиск брендов', value: 'discover' },
          { href: ROUTES.shop.b2bApply, label: 'Заявка на доступ', value: 'apply' },
          { href: ROUTES.shop.b2bPartners, label: 'Портфель брендов', value: 'portfolio' },
          { href: ROUTES.shop.b2bContracts, label: 'Договоры', value: 'contracts' },
          { href: ROUTES.shop.b2bDocuments, label: 'Документы', value: 'documents' },
          { href: ROUTES.shop.b2bRating, label: 'Рейтинг брендов', value: 'rating' },
        ],
      },
      {
        href: ROUTES.shop.b2bTradeShows,
        value: 'trade-events',
        label: 'Выставки и события',
        icon: CalendarDays,
        description: 'Календарь выставок и встречи',
        navTier: 'phase2' as const,
      },
      {
        href: ROUTES.shop.b2bCreateOrder,
        value: 'b2b-order-master',
        label: 'Новый заказ',
        icon: PlusCircle,
        description: 'Мастер и связанные экраны',
        subsections: [
          { href: ROUTES.shop.b2bOrderMode, label: 'Режим заказа', value: 'order-mode' },
          { href: ROUTES.shop.b2bCreateOrder, label: 'Мастер заказа', value: 'create-order' },
          { href: ROUTES.shop.b2bQuickOrder, label: 'Быстрый по артикулам', value: 'quick-order' },
          { href: ROUTES.shop.b2bCatalog, label: 'Каталог опта', value: 'catalog' },
          { href: ROUTES.shop.b2bOrderDrafts, label: 'Черновики', value: 'order-drafts' },
          { href: ROUTES.shop.b2bOrderTemplates, label: 'Шаблоны', value: 'order-templates' },
          { href: ROUTES.shop.b2bReorder, label: 'Повтор заказа', value: 'reorder' },
        ],
      },
      {
        href: ROUTES.shop.b2bCollectionTerms,
        value: 'collection-planning',
        label: 'Условия коллекций и план',
        icon: Calendar,
        description: 'Мин. партии, сроки, план и отбор',
        subsections: [
          {
            href: ROUTES.shop.b2bCollectionTerms,
            label: 'Условия и сроки',
            value: 'collection-terms',
          },
          {
            href: ROUTES.shop.b2bAssortmentPlanning,
            label: 'План ассортимента',
            value: 'assortment-planning',
          },
          {
            href: ROUTES.shop.b2bSelectionBuilder,
            label: 'Отбор коллекции',
            value: 'selection-builder',
          },
        ],
      },
    ],
  },
  {
    id: 'b2b-execution',
    label: 'Исполнение опта',
    icon: Briefcase,
    links: [
      {
        href: ROUTES.shop.b2bOrders,
        value: 'b2b-orders',
        label: 'Заказы опта',
        icon: ListOrdered,
        description: 'Опт у брендов',
        subsections: [
          { href: ROUTES.shop.b2bOrders, label: 'Все заказы', value: 'all' },
          { href: `${ROUTES.shop.b2bOrders}?status=draft`, label: 'Черновики', value: 'draft' },
          {
            href: `${ROUTES.shop.b2bOrders}?status=pending`,
            label: 'На согласовании',
            value: 'pending',
          },
          {
            href: `${ROUTES.shop.b2bOrders}?status=confirmed`,
            label: 'Подтвержденные',
            value: 'confirmed',
          },
          { href: `${ROUTES.shop.b2bOrders}?status=shipped`, label: 'В пути', value: 'shipped' },
        ],
      },
      {
        href: ROUTES.shop.b2bMatrix,
        value: 'matrix',
        label: 'Матрица заказов',
        icon: Edit,
        description: 'Быстрое создание заказов',
      },
      {
        href: ROUTES.shop.b2bWhiteboard,
        value: 'whiteboard',
        label: 'Визуальная доска',
        icon: LayoutGrid,
        description: 'Визуальное планирование ассортимента',
        navTier: 'phase2' as const,
      },
      {
        href: ROUTES.shop.b2bFulfillmentDashboard,
        value: 'b2b-supply-flow',
        label: 'Поставки',
        icon: Truck,
        description: 'Сроки, автопополнение, трек и остатки по сети — один контур',
        subsections: [
          {
            href: ROUTES.shop.b2bFulfillmentDashboard,
            label: 'Сроки и каналы',
            value: 'fulfillment-dashboard',
          },
          {
            href: ROUTES.shop.b2bDeliveryCalendar,
            label: 'Календарь поставок',
            value: 'delivery-calendar',
          },
          { href: ROUTES.shop.b2bReplenishment, label: 'Автопополнение', value: 'replenishment' },
          { href: ROUTES.shop.b2bTracking, label: 'Отслеживание', value: 'tracking' },
          { href: ROUTES.shop.b2bStockMap, label: 'Остатки по сети', value: 'stock-map' },
        ],
      },
      {
        href: ROUTES.shop.b2bPayment,
        value: 'payment',
        label: 'Оплата заказов',
        icon: CreditCard,
        description: 'Счета, этапы оплаты, валюта',
      },
      {
        href: ROUTES.shop.b2bMultiCurrency,
        value: 'multi-currency',
        label: 'Валюты и курсы',
        icon: DollarSign,
        description: 'Договорные валюты и пересчёт',
      },
      {
        href: ROUTES.shop.b2bLandedCost,
        value: 'landed-cost',
        label: 'Полная себестоимость',
        icon: Calculator,
        description: 'Пошлины и доставка до точки',
      },
      {
        href: ROUTES.shop.b2bClaims,
        value: 'claims',
        label: 'Претензии и возвраты',
        icon: ShieldAlert,
        description: 'Рекламации и возвраты поставщику',
      },
      {
        href: ROUTES.shop.b2bSizeMapping,
        value: 'size-mapping',
        label: 'Соответствие размеров',
        icon: Ruler,
        description: 'Сетка бренда и ваша сетка',
      },
      {
        href: ROUTES.shop.b2bTenders,
        value: 'indirect-procurement',
        label: 'Тендеры и запросы цен',
        icon: Gavel,
        description: 'Не опт у бренда — торги и котировки у поставщиков',
        navTier: 'phase2' as const,
        subsections: [
          { href: ROUTES.shop.b2bTenders, label: 'Тендеры и аукционы', value: 'tenders' },
          { href: ROUTES.shop.b2bRfq, label: 'Запрос цен', value: 'rfq' },
          {
            href: ROUTES.shop.b2bSupplierDiscovery,
            label: 'Поставщики',
            value: 'supplier-discovery',
          },
        ],
      },
    ],
  },
  {
    id: 'b2b-service',
    label: 'Сервис закупки',
    icon: Sparkles,
    links: [
      {
        href: ROUTES.shop.b2bAiSearch,
        value: 'ai-suite',
        label: 'Умный поиск и заказ',
        icon: Sparkles,
        description: 'Поиск, подсказки и заказ из свободного текста',
        navTier: 'phase2' as const,
        subsections: [
          { href: ROUTES.shop.b2bAiSearch, label: 'Поиск и подсказки', value: 'ai-search' },
          { href: ROUTES.shop.b2bAiSmartOrder, label: 'Заказ из текста', value: 'ai-smart-order' },
        ],
      },
      {
        href: ROUTES.shop.b2bShowroom,
        value: 'showroom-suite',
        label: 'Презентация коллекции',
        icon: Store,
        description: 'Шоурум, видео и закрытые показы',
        navTier: 'phase2' as const,
        subsections: [
          { href: ROUTES.shop.b2bShowroom, label: 'Шоурум', value: 'showroom' },
          {
            href: ROUTES.shop.b2bVideoConsultation,
            label: 'Видеосвязь',
            value: 'video-consultation',
          },
          {
            href: ROUTES.shop.b2bVipRoomBooking,
            label: 'Зал для встреч',
            value: 'vip-room-booking',
          },
          { href: '/s/prive/syntha-fw26-elite', label: 'Le Privé', value: 'le-prive' },
        ],
      },
      {
        href: ROUTES.shop.b2bScanner,
        value: 'scanner',
        label: 'Сканер и заказы',
        icon: Camera,
        description: 'Планшет или телефон в зале',
      },
      {
        href: ROUTES.shop.b2bSocialFeed,
        value: 'social-feed',
        label: 'Лента брендов',
        icon: MessageSquare,
        description: 'Новости коллекций, посты, подписка',
        navTier: 'phase2' as const,
      },
    ],
  },
  {
    id: 'analytics',
    label: 'Аналитика',
    icon: BarChart2,
    links: [
      {
        href: ROUTES.shop.analytics,
        value: 'retail-analytics',
        label: 'Розница',
        icon: BarChart2,
        description: 'Продажи в магазине и онлайн',
        subsections: [
          { href: ROUTES.shop.analytics, label: 'Продажи и спрос', value: 'retail-analytics' },
          { href: ROUTES.shop.analyticsFootfall, label: 'Трафик по зонам', value: 'footfall' },
        ],
      },
      {
        href: ROUTES.shop.b2bAnalytics,
        value: 'b2b-analytics',
        label: 'Опт',
        icon: Sigma,
        description: 'Закупки у брендов',
        subsections: [
          { href: ROUTES.shop.b2bAnalytics, label: 'Аналитика закупок', value: 'b2b-analytics' },
          { href: ROUTES.shop.b2bOrderAnalytics, label: 'По заказам', value: 'order-analytics' },
          { href: ROUTES.shop.b2bReports, label: 'Отчёты партнёра', value: 'b2b-reports' },
          { href: ROUTES.shop.b2bFinance, label: 'Финансы партнёра', value: 'b2b-finance' },
          { href: ROUTES.shop.b2bPayment, label: 'Оплата (JOOR Pay)', value: 'b2b-payment' },
        ],
      },
      {
        href: ROUTES.shop.b2bMarginAnalysis,
        value: 'margin-suite',
        label: 'Маржа и рентабельность',
        icon: TrendingUp,
        description: 'Маржа, отчёты, калькулятор',
        subsections: [
          { href: ROUTES.shop.b2bMarginAnalysis, label: 'Хаб маржи', value: 'margin-analysis' },
          { href: ROUTES.shop.b2bMarginReport, label: 'По брендам', value: 'margin-report' },
          {
            href: ROUTES.shop.b2bMarginCalculator,
            label: 'Калькулятор',
            value: 'margin-calculator',
          },
          { href: ROUTES.shop.b2bLandedCost, label: 'Landed cost', value: 'landed-cost' },
        ],
      },
    ],
  },
  {
    id: 'management',
    label: 'Сеть и доступы',
    icon: Settings,
    links: [
      {
        href: ROUTES.shop.calendar,
        value: 'calendar',
        label: 'Календарь',
        icon: Calendar,
        description: 'События, дедлайны, поставки',
      },
      {
        href: ROUTES.shop.messages,
        value: 'messages',
        label: 'Сообщения',
        icon: MessageSquare,
        description: 'Коммуникация с брендами',
      },
      {
        href: ROUTES.shop.staff,
        value: 'staff',
        label: 'Команда',
        icon: Users,
        description: 'Управление сотрудниками',
      },
      {
        href: ROUTES.shop.b2bWorkspaceMap,
        value: 'b2b-workspace-map',
        label: 'Схема процессов опта',
        icon: Map,
        description: 'Модули цепочки — для обучения',
        navTier: 'phase2' as const,
      },
      {
        href: ROUTES.shop.b2bBudget,
        value: 'budget',
        label: 'Бюджет закупок',
        icon: DollarSign,
        description: 'План и факт по сезонам (OTB)',
        subsections: [
          { href: ROUTES.shop.b2bBudget, label: 'Все сезоны', value: 'all' },
          { href: `${ROUTES.shop.b2bBudget}/FW26`, label: 'FW26', value: 'fw26' },
          { href: `${ROUTES.shop.b2bBudget}/SS27`, label: 'SS27', value: 'ss27' },
        ],
      },
      {
        href: ROUTES.shop.b2bPartnerOnboarding,
        value: 'partner-onboarding',
        label: 'Подключение партнёра',
        icon: UserPlus,
        description: 'ИНН, ЭДО, доступ к бренду',
      },
      {
        href: ROUTES.shop.b2bDealerCabinet,
        value: 'dealer-cabinet',
        label: 'Кабинет дилера',
        icon: LayoutDashboard,
        description: 'Документы, отчёты, аналитика',
      },
      {
        href: ROUTES.storeLocator,
        value: 'store-locator',
        label: 'Карта магазинов сети',
        icon: Map,
        description: 'Точки, часы, маршрут',
      },
      {
        href: ROUTES.shop.b2bGamification,
        value: 'gamification',
        label: 'Соревнования и награды',
        icon: Star,
        description: 'Мотивация закупщиков',
        navTier: 'phase2' as const,
      },
      {
        href: ROUTES.brand.b2bOrders,
        value: 'related-cabinets',
        label: 'Связанные кабинеты',
        icon: Network,
        description: 'Те же сценарии в кабинетах бренда, дистрибутора и платформы',
        subsections: [
          { href: ROUTES.brand.b2bOrders, label: 'Заказы опта (бренд)', value: 'brand-b2b-orders' },
          { href: ROUTES.brand.tradeShows, label: 'Выставки (бренд)', value: 'brand-tradeshows' },
          { href: ROUTES.distributor.home, label: 'Дистрибутор', value: 'distributor-home' },
          { href: ROUTES.admin.home, label: 'Админ платформы', value: 'admin-home' },
        ],
      },
      {
        href: ROUTES.shop.b2bSettings,
        value: 'settings',
        label: 'Настройки',
        icon: Settings,
        description: 'Настройки магазина',
      },
    ],
  },
];

/** Группы опта в горизонтальной навигации `/shop/b2b/*` (все B2B-функции в трёх крупных блоках). */
export const SHOP_B2B_NAV_GROUP_IDS = ['b2b-procurement', 'b2b-execution', 'b2b-service'] as const;

/** Карта хаба `/shop/b2b`: розница + склад + закупка + исполнение + сервис + аналитика. */
export const SHOP_B2B_HUB_GROUP_IDS = [
  'retail-ops',
  'inventory-precision',
  'b2b-procurement',
  'b2b-execution',
  'b2b-service',
  'analytics',
] as const;

export const b2bNavLinks = shopNavGroups
  .filter((g) => (SHOP_B2B_NAV_GROUP_IDS as readonly string[]).includes(g.id))
  .flatMap((g) => g.links);

/** Горизонтальные вкладки подмакета `/shop/b2b/*` (корень `/shop/b2b` → редирект на `/shop`). */
export const b2bHubTabLinks = [
  { href: ROUTES.shop.b2bPartners, value: 'partner-funnel', label: 'Бренды', icon: Handshake },
  {
    href: ROUTES.shop.b2bCreateOrder,
    value: 'b2b-order-master',
    label: 'Новый заказ',
    icon: PlusCircle,
  },
  { href: ROUTES.shop.b2bMatrix, value: 'matrix', label: 'Матрица', icon: Edit },
  { href: ROUTES.shop.b2bOrders, value: 'b2b-orders', label: 'Заказы опта', icon: ListOrdered },
  { href: ROUTES.shop.b2bPayment, value: 'payment', label: 'Оплата', icon: CreditCard },
  {
    href: ROUTES.shop.b2bFulfillmentDashboard,
    value: 'fulfillment-dashboard',
    label: 'Поставки',
    icon: Truck,
  },
  {
    href: ROUTES.shop.b2bAnalytics,
    value: 'b2b-analytics',
    label: 'Аналитика опта',
    icon: BarChart2,
  },
  { href: ROUTES.shop.b2bAiSearch, value: 'ai-suite', label: 'ИИ-поиск', icon: Sparkles },
  { href: ROUTES.shop.b2bShowroom, value: 'showroom-suite', label: 'Презентация', icon: Store },
  { href: ROUTES.shop.b2bSettings, value: 'settings', label: 'Настройки', icon: Settings },
] as const;

const B2B_HUB_TAB_VALUES = new Set<string>(b2bHubTabLinks.map((l) => l.value));

/** Родительский пункт B2B → вкладка таббара, если страница не входит в `b2bHubTabLinks`. */
const B2B_NAV_VALUE_TO_HUB_TAB: Record<string, string> = {
  'trade-events': 'partner-funnel',
  'collection-planning': 'partner-funnel',
  'margin-suite': 'b2b-analytics',
  whiteboard: 'matrix',
  'landed-cost': 'b2b-orders',
  claims: 'b2b-orders',
  'b2b-supply-flow': 'fulfillment-dashboard',
  'size-mapping': 'partner-funnel',
  'multi-currency': 'payment',
  'indirect-procurement': 'partner-funnel',
  scanner: 'showroom-suite',
  'social-feed': 'ai-suite',
};

/**
 * Активная вкладка горизонтального таббара B2B по URL (сайдбар B2B + аналитика по `/shop/b2b/*`).
 */
export function getB2bHubTabValue(pathname: string): string {
  const candidates: { href: string; parentValue: string }[] = [];
  const push = (href: string, parentValue: string) => {
    candidates.push({ href, parentValue });
  };
  for (const link of b2bNavLinks) {
    push(link.href, link.value);
    if (link.subsections) {
      for (const sub of link.subsections) {
        push(sub.href, link.value);
      }
    }
  }
  for (const g of shopNavGroups) {
    if (g.id !== 'analytics') continue;
    for (const link of g.links) {
      if (!link.href.startsWith('/shop/b2b')) continue;
      push(link.href, link.value);
      if (link.subsections) {
        for (const sub of link.subsections) {
          if (!sub.href.startsWith('/shop/b2b')) continue;
          push(sub.href, link.value);
        }
      }
    }
  }
  candidates.sort((a, b) => b.href.length - a.href.length);
  const hit = candidates.find((c) => pathname.startsWith(c.href));
  if (!hit) return 'partner-funnel';
  if (B2B_HUB_TAB_VALUES.has(hit.parentValue)) return hit.parentValue;
  return B2B_NAV_VALUE_TO_HUB_TAB[hit.parentValue] ?? 'partner-funnel';
}

export const mainShopNavLinks = shopNavGroups
  .flatMap((g) => g.links)
  .filter((link) => typeof link.href === 'string' && link.href.length > 0);

/**
 * Активный пункт верхнего уровня кабинета `/shop/*` по URL (включая href из подразделов).
 */
export function getMainShopNavTabValue(pathname: string): string {
  const normalizedPath = pathname.replace(/\/$/, '') || '/';
  const candidates: { href: string; value: string }[] = [];
  for (const g of shopNavGroups) {
    for (const link of g.links) {
      candidates.push({ href: link.href, value: link.value });
      if (link.subsections) {
        for (const sub of link.subsections) {
          candidates.push({ href: sub.href, value: link.value });
        }
      }
    }
  }
  candidates.sort((a, b) => b.href.length - a.href.length);
  const hit = candidates.find((c) => {
    const nh = c.href.replace(/\/$/, '') || '/';
    if (nh === '/shop') return normalizedPath === '/shop';
    return normalizedPath === nh || normalizedPath.startsWith(`${nh}/`);
  });
  return hit?.value ?? 'dashboard';
}

// Helper functions
export function findShopSubsection(sectionValue: string, subsectionValue: string) {
  const section = mainShopNavLinks.find((link) => link.value === sectionValue);
  return section?.subsections?.find((sub) => sub.value === subsectionValue);
}

export function getShopSubsections(sectionValue: string) {
  const section = mainShopNavLinks.find((link) => link.value === sectionValue);
  return section?.subsections || [];
}

export type ShopNavDisplayMode = 'full' | 'mvp';

/** Режим `mvp`: скрыть пункты с `navTier: 'phase2'`. Задаётся `NEXT_PUBLIC_SHOP_NAV_MVP=1`. */
export function getShopNavDisplayMode(): ShopNavDisplayMode {
  if (typeof process !== 'undefined' && process.env.NEXT_PUBLIC_SHOP_NAV_MVP === '1') return 'mvp';
  return 'full';
}

export function filterShopNavGroupsByTier(
  groups: typeof shopNavGroups,
  mode: ShopNavDisplayMode
): typeof shopNavGroups {
  if (mode === 'full') return groups;
  return groups.map((g) => ({
    ...g,
    links: g.links.filter((l) => (l as { navTier?: string }).navTier !== 'phase2'),
  })) as typeof shopNavGroups;
}
