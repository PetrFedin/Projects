import { ROUTES, processLiveUrl } from '@/lib/routes';
import { PRIMARY_LINK_VALUES, type SecondaryNavItem } from './brand-nav-priority';
import {
  Activity,
  BarChart3,
  Briefcase,
  Building2,
  Calculator,
  Database,
  DollarSign,
  Cpu,
  Factory,
  FileSearch,
  FileText,
  Gavel,
  Globe,
  GraduationCap,
  Image as ImageIcon,
  Layers,
  Layers2,
  LayoutDashboard,
  Megaphone,
  Monitor,
  Package,
  PackageCheck,
  QrCode,
  Rocket,
  Settings,
  Shield,
  ShoppingCart,
  Sparkles,
  Target,
  Truck,
  UserCircle,
  Users,
  Wallet,
  Warehouse,
  Zap,
<<<<<<< HEAD
=======
  Map,
  Search,
  Store,
  CreditCard,
  UserPlus,
  PackageSearch,
  CalendarDays,
>>>>>>> recover/cabinet-wip-from-stash
} from 'lucide-react';

/** Группировки разделов — логические кластеры для визуальной организации навигации */
export const NAV_GROUP_CLUSTERS = [
  { id: 'profile', label: 'Бренд', order: 1 },
  { id: 'product', label: 'Продукт', order: 2 },
  { id: 'operations', label: 'Производство', order: 3 },
  { id: 'sales', label: 'Продажи', order: 4 },
  { id: 'insights', label: 'Аналитика и инструменты', order: 5 },
] as const;

export const brandNavGroups = [
  // ─── Кластер: Бренд ────────────────────────────────────────────
  {
    id: 'org',
    label: 'Профиль и организация',
    clusterId: 'profile',
    icon: Building2,
    scope: 'shared',
    links: [
      {
        label: 'Профиль',
        value: 'profile',
        icon: UserCircle,
        href: '/brand?group=profile&tab=brand',
        description: 'Профиль бренда, юр. данные, контакты',
      },
      {
        label: 'Команда',
        value: 'team',
        icon: Users,
        href: ROUTES.brand.team,
        description: 'Участники, задачи, права, орг. структура',
      },
      {
        label: 'Интеграции',
        value: 'integrations',
        icon: Zap,
        href: ROUTES.brand.integrations,
        description: 'Маркетплейсы, ERP, PLM, 1С, Webhooks, SSO',
      },
      {
        label: 'Документооборот и ЭДО',
        value: 'documents',
        icon: FileText,
        href: ROUTES.brand.documents,
        description:
          'Договоры, счета, ЭДО, Честный ЗНАК. Шаблоны, интеграции Диадок/СБИС, склад КИЗ.',
        iconColor: 'indigo',
        quickActions: [
          { label: 'Compliance', href: ROUTES.brand.compliance, icon: Shield },
          { label: 'B2B', href: ROUTES.brand.b2bOrders, icon: Factory },
        ],
      },
      {
        label: 'Настройки',
        value: 'settings',
        icon: Settings,
        href: ROUTES.brand.settings,
        description: 'Общие, безопасность, подписка',
      },
      {
        label: 'Центр управления',
        value: 'dashboard',
        icon: Cpu,
        href: ROUTES.brand.controlCenter,
        description:
          'Стратегический хаб: все модули организации, логистики, продуктов, B2B, производства, маркетинга, аналитики, финансов, арбитража, устойчивости, коммуникаций. Обзор и быстрые переходы.',
        iconColor: 'indigo',
        quickActions: [
          { label: 'Dashboard', href: ROUTES.brand.dashboard, icon: LayoutDashboard },
          { label: 'Analytics 360', href: ROUTES.brand.analytics360, icon: BarChart3 },
          { label: 'Customer Intel', href: ROUTES.brand.customerIntelligence, icon: Users },
          { label: 'Production', href: ROUTES.brand.production, icon: Factory },
          { label: 'B2B', href: ROUTES.brand.b2bOrders, icon: ShoppingCart },
        ],
      },
    ],
  },

  // ─── Кластер: Продукт ──────────────────────────────────────────
  {
    id: 'catalog',
    /** Не дублировать кластер «Продукт» (см. NAV_GROUP_CLUSTERS.product.label). */
    label: 'Каталог и PIM',
    clusterId: 'product',
    icon: Layers,
    scope: 'shared',
    links: [
      {
        label: 'Коллекции',
        value: 'collections',
        icon: Layers,
        href: ROUTES.brand.collections,
        description: 'Каталог коллекций, создание, архив',
      },
      {
        label: 'PIM-центр',
        value: 'pim',
        icon: Database,
        href: ROUTES.brand.products,
        description:
          'Каталог артикулов, сезонность, цены, медиа и статусы. Production — коллекции, BOM, сэмплы. B2B — Linesheets, заказы. Inventory — остатки. Matrix — размеры и цвета.',
        iconColor: 'indigo',
        quickActions: [
          { label: 'Production', href: ROUTES.brand.production, icon: Factory },
          { label: 'Planning', href: ROUTES.brand.planning, icon: Target },
          { label: 'Matrix', href: ROUTES.brand.productsMatrix, icon: Layers },
          { label: 'Inventory', href: ROUTES.brand.inventory, icon: Package },
          { label: 'Linesheets', href: ROUTES.brand.b2bLinesheets, icon: FileText },
        ],
      },
    ],
  },

  // ─── Кластер: Производство ─────────────────────────────────────
  {
    id: 'production',
    /** Не дублировать кластер «Производство» (NAV_GROUP_CLUSTERS.operations). */
    label: 'Цеха и материалы',
    clusterId: 'operations',
    icon: Factory,
    scope: 'shared',
    links: [
      {
        label: 'Цех',
        value: 'shop-floor',
        icon: Factory,
        href: ROUTES.brand.production,
        description: 'Мониторинг линий, ОТК, утверждение эталона',
      },
      {
        label: 'Цех 2',
        value: 'workshop2',
        icon: Layers2,
        href: ROUTES.brand.productionWorkshop2,
        description:
          'Коллекции и артикулы: /brand/production/workshop2. Сейчас в интерфейсе — SS27; новые коллекции сохраняются со сведениями «кто / когда».',
        iconColor: 'indigo',
        quickActions: [{ label: 'Цех', href: ROUTES.brand.production, icon: Factory }],
      },
      {
        label: 'LIVE: от идеи до склада',
        value: 'live-production',
        icon: Activity,
        href: processLiveUrl('production'),
        description:
          'Поэтапная схема процесса коллекции (бриф → ассортимент → материалы → сэмплы → PO → QC → склад). Контекст коллекции, сетка этапов, Kanban и Gantt. Дополняет вкладки цеха, не заменяет их.',
        iconColor: 'indigo',
        quickActions: [
          { label: 'Цех', href: ROUTES.brand.production, icon: Factory },
          { label: 'Все LIVE', href: ROUTES.brand.processLiveHub, icon: Activity },
        ],
      },
      {
        label: 'Фабрики',
        value: 'factories',
        icon: Factory,
        href: ROUTES.brand.factories,
        description:
          'Фабрики и ателье. Загрузка линий, качество, активные PO. Связь с Production, VMI (материалы) и B2B заказами.',
        iconColor: 'slate',
        quickActions: [
          { label: 'Products', href: ROUTES.brand.products, icon: Package },
          { label: 'Production', href: ROUTES.brand.production, icon: Factory },
          { label: 'VMI', href: ROUTES.brand.vmi, icon: Warehouse },
        ],
      },
      {
        label: 'Материалы',
        value: 'materials',
        icon: Layers,
        href: ROUTES.brand.materials,
        description:
          'Сырьё и фурнитура для производства и BOM. Связь с Production, VMI и поставщиками.',
        iconColor: 'slate',
        quickActions: [
          { label: 'Products', href: ROUTES.brand.products, icon: FileText },
          { label: 'Production', href: ROUTES.brand.production, icon: Factory },
          { label: 'VMI', href: ROUTES.brand.vmi, icon: Warehouse },
        ],
      },
    ],
  },
  {
    id: 'logistics',
    label: 'Логистика и закупки',
    clusterId: 'operations',
    icon: Truck,
    scope: 'shared',
    links: [
      {
        label: 'Центр логистики',
        value: 'logistics-hub',
        icon: Truck,
        href: ROUTES.brand.logistics,
        description:
          'Сводка по складам, перевозчикам, доставке и документам для российского бизнеса бренда.',
        iconColor: 'amber',
        quickActions: [
          { label: 'Склад', href: ROUTES.brand.warehouse, icon: Package },
          { label: 'B2B', href: ROUTES.brand.b2bOrders, icon: ShoppingCart },
        ],
      },
      {
        label: 'Склад и остатки',
        value: 'warehouse',
        icon: Package,
        href: ROUTES.brand.warehouse,
        description:
          'Остатки готовых изделий и материалов. Связь с Production (приёмки по PO), B2B (резервы под заказы) и Compliance (учёт КИЗ). Интеграция с маркировкой «Честный ЗНАК».',
        iconColor: 'blue',
        quickActions: [
          { label: 'Production', href: ROUTES.brand.production, icon: Factory },
          { label: 'B2B', href: ROUTES.brand.b2bOrders, icon: ShoppingCart },
          { label: 'КИЗ', href: ROUTES.brand.complianceStock, icon: QrCode },
        ],
      },
      {
        label: 'BOPIS Hub',
        value: 'bopis',
        icon: PackageCheck,
        href: ROUTES.brand.bopis,
        description:
          'Выдача и возврат интернет-заказов в магазине (Buy Online, Pick Up In Store). Статусы заказов на выдачу, приём возвратов в точке, отчётность по магазинам.',
        iconColor: 'emerald',
        quickActions: [
          { label: 'Склад', href: ROUTES.brand.warehouse, icon: Package },
          { label: 'Возвраты', href: ROUTES.brand.returnsClaims, icon: Truck },
          { label: 'Партнёры', href: ROUTES.brand.retailers, icon: Users },
        ],
      },
      {
        label: 'Поставщики',
        value: 'suppliers',
        icon: Package,
        href: ROUTES.brand.suppliers,
        description:
          'Реестр поставщиков, тендеры (RFQ), договоры, КП, история заказов. Связь с Production (BOM), Materials, VMI и Factories.',
        iconColor: 'amber',
        quickActions: [
          { label: 'Materials', href: ROUTES.brand.materials, icon: Layers },
          { label: 'Production', href: ROUTES.brand.production, icon: Factory },
        ],
      },
    ],
  },

  // ─── Кластер: Продажи ──────────────────────────────────────────
  {
    id: 'b2b',
    label: 'B2B Заказы',
    clusterId: 'sales',
    icon: ShoppingCart,
    scope: 'b2b',
    links: [
      {
        label: 'Карта B2B (ритейл)',
        value: 'retail-b2b-map',
        icon: Map,
        href: ROUTES.shop.b2bWorkspaceMap,
        description:
          'Сквозная визуализация модулей закупок в кабинете магазина: где шоурум, заказы и финансы стыкуются с вашим контуром.',
        iconColor: 'indigo',
        quickActions: [
          { label: 'Заказы B2B', href: ROUTES.brand.b2bOrders, icon: Package },
          { label: 'Ритейлеры', href: ROUTES.brand.retailers, icon: Users },
        ],
      },
      {
        label: 'B2B Шоурум',
        value: 'showroom',
        icon: Monitor,
        href: ROUTES.brand.showroom,
        description:
          'Phygital-презентации для байеров. Заказы из шоурума → B2B Orders. Связь с Products, Linesheets и Retailers.',
        iconColor: 'indigo',
        quickActions: [
          { label: 'Products', href: ROUTES.brand.products, icon: Layers },
          { label: 'Linesheets', href: ROUTES.brand.b2bLinesheets, icon: FileText },
          { label: 'B2B', href: ROUTES.brand.b2bOrders, icon: Package },
          { label: 'Выставки', href: ROUTES.brand.tradeShows, icon: Monitor },
          { label: 'Заявки байеров', href: ROUTES.brand.buyerApplications, icon: Users },
        ],
      },
      {
        label: 'Лайншиты',
        value: 'linesheets',
        icon: FileText,
        href: ROUTES.brand.b2bLinesheets,
        description:
          'Оптовые коллекции, персонализированные подборки для ритейлеров. Связи: Products, B2B Orders, Showroom, Retailers.',
        iconColor: 'indigo',
        quickActions: [
          { label: 'Products', href: ROUTES.brand.products, icon: Layers },
          { label: 'B2B Orders', href: ROUTES.brand.b2bOrders, icon: Package },
          { label: 'Showroom', href: ROUTES.brand.showroom, icon: Monitor },
          { label: 'Retailers', href: ROUTES.brand.retailers, icon: Users },
        ],
      },
      {
        label: 'Заказы B2B',
        value: 'orders',
        icon: Package,
        href: ROUTES.brand.b2bOrders,
        description: 'Заказы, PO, отгрузки, согласование',
      },
<<<<<<< HEAD
=======
      {
        label: 'Выставки и события (бренд)',
        value: 'brand-trade-shows',
        icon: Monitor,
        href: ROUTES.brand.tradeShows,
        description:
          'Календарь и стенды бренда; связь с заявками байеров и витриной в кабинете магазина.',
        iconColor: 'indigo',
        quickActions: [
          { label: 'Заявки байеров', href: ROUTES.brand.buyerApplications, icon: Users },
          { label: 'Passport (бренд)', href: ROUTES.brand.b2bPassport, icon: FileText },
        ],
      },
    ],
  },
  {
    id: 'buyer-retail-mirror',
    label: 'Витрина байера и площадка',
    clusterId: 'sales',
    icon: Globe,
    scope: 'b2b',
    links: [
      {
        label: 'Кабинет магазина',
        value: 'shop-home',
        icon: Store,
        href: ROUTES.shop.home,
        description:
          'Тот же хаб ритейла, что видит байер: сверка UX с шоурумом, лайншитами и B2B-заказами.',
      },
      {
        label: 'Discover (маркетплейс)',
        value: 'shop-discover',
        icon: Search,
        href: ROUTES.shop.b2bDiscover,
        description: 'Поиск брендов и запрос доступа — зеркало байерского Discover.',
      },
      {
        label: 'Карта процессов B2B',
        value: 'shop-b2b-map',
        icon: Map,
        href: ROUTES.shop.b2bWorkspaceMap,
        description: 'Сквозная схема модулей закупок в кабинете магазина.',
      },
      {
        label: 'Оплата заказов (ритейл)',
        value: 'shop-b2b-payment',
        icon: CreditCard,
        href: ROUTES.shop.b2bPayment,
        description: 'JOOR Pay и этапы оплаты в интерфейсе байера.',
      },
      {
        label: 'Подать заявку (сторона байера)',
        value: 'shop-b2b-apply',
        icon: UserPlus,
        href: ROUTES.shop.b2bApply,
        description: 'Онбординг байера к бренду — сопоставьте с заявками в бренд-кабинете.',
      },
      {
        label: 'Выставки (ритейл)',
        value: 'shop-trade-shows',
        icon: CalendarDays,
        href: ROUTES.shop.b2bTradeShows,
        description: 'Виртуальные выставки и календарь в кабинете магазина.',
        subsections: [
          { href: ROUTES.shop.b2bTradeShows, label: 'Календарь', value: 'calendar' },
          {
            href: ROUTES.shop.b2bTradeShowAppointments,
            label: 'Запись на встречи',
            value: 'appointments',
          },
        ],
      },
      {
        label: 'Passport выставки (ритейл)',
        value: 'shop-passport',
        icon: FileText,
        href: ROUTES.shop.b2bPassport,
        description: 'Портал события в интерфейсе байера.',
      },
      {
        label: 'Заявки байеров (бренд)',
        value: 'buyer-applications',
        icon: Users,
        href: ROUTES.brand.buyerApplications,
        description: 'Входящие заявки и статусы — пара к «Подать заявку» в ритейле.',
      },
      {
        label: 'Fulfillment (ритейл)',
        value: 'shop-fulfillment',
        icon: Truck,
        href: ROUTES.shop.b2bFulfillmentDashboard,
        description: 'SLA и каналы исполнения в кабинете магазина (наблюдение для бренда).',
      },
      {
        label: 'RFQ на площадке',
        value: 'shop-rfq',
        icon: FileSearch,
        href: ROUTES.shop.b2bRfq,
        description: 'Запросы котировок байеров; связь с RFQ материалов у бренда.',
      },
      {
        label: 'Тендеры (площадка)',
        value: 'shop-tenders',
        icon: Gavel,
        href: ROUTES.shop.b2bTenders,
        description: 'Конкурентные закупки на стороне ритейла.',
      },
      {
        label: 'Поиск поставщиков (площадка)',
        value: 'shop-supplier-discovery',
        icon: PackageSearch,
        href: ROUTES.shop.b2bSupplierDiscovery,
        description: 'Реестр поставщиков в контуре магазина; дополняет реестр бренда.',
      },
      {
        label: 'RFQ материалов (бренд)',
        value: 'brand-suppliers-rfq',
        icon: FileText,
        href: ROUTES.brand.suppliersRfq,
        description: 'Ваши запросы к поставщикам материалов — параллельно витрине RFQ ритейла.',
      },
>>>>>>> recover/cabinet-wip-from-stash
    ],
  },
  {
    id: 'partners',
    label: 'Партнёры и клиенты',
    clusterId: 'sales',
    icon: Users,
    scope: 'shared',
    links: [
      {
        label: 'Партнёры',
        value: 'retailers',
        icon: Users,
        href: ROUTES.brand.retailers,
        description: 'Ритейлеры и дистрибьюторы',
      },
      {
        label: 'Коммерческие условия',
        value: 'commercial',
        icon: DollarSign,
        href: ROUTES.brand.priceLists,
        description: 'Прайс-листы и группы клиентов',
      },
      {
        label: 'CRM и лояльность',
        value: 'customer-intelligence',
        icon: Sparkles,
        href: ROUTES.brand.customerIntelligence,
        description:
          'Аналитика аудитории, RFM, сегменты. Связь с Customers, Analytics, Reviews и B2B (байеры).',
        iconColor: 'indigo',
        quickActions: [
          { label: 'Customers', href: ROUTES.brand.customers, icon: Users },
          { label: 'Analytics', href: ROUTES.brand.analytics, icon: BarChart3 },
        ],
      },
      {
        label: 'Арбитраж и споры',
        value: 'disputes',
        icon: Gavel,
        href: ROUTES.brand.disputes,
        description:
          'B2B-претензии, арбитраж. Escrow — безопасные сделки. Связь с Production, B2B Orders и Finance.',
        iconColor: 'rose',
        quickActions: [
          { label: 'Escrow', href: ROUTES.brand.financeEscrow, icon: Shield },
          { label: 'B2B Orders', href: ROUTES.brand.b2bOrders, icon: Package },
        ],
      },
    ],
  },
  {
    id: 'marketing',
    label: 'Маркетинг',
    clusterId: 'sales',
    icon: Megaphone,
    scope: 'shared',
    links: [
      {
        label: 'Кампании и промо',
        value: 'campaigns',
        icon: Rocket,
        href: ROUTES.brand.kickstarter,
        description:
          'AI кампании, краудфандинг, предзаказы, скидки, акции. Связи: Pre-orders, Production, B2B Orders, Finance.',
        iconColor: 'emerald',
        quickActions: [
          { label: 'Pre-orders', href: ROUTES.brand.preOrders, icon: Package },
          { label: 'Production', href: ROUTES.brand.production, icon: Factory },
          { label: 'B2B', href: ROUTES.brand.b2bOrders, icon: ShoppingCart },
          { label: 'Finance', href: ROUTES.brand.finance, icon: DollarSign },
        ],
      },
      {
        label: 'PR-образцы',
        value: 'samples',
        icon: QrCode,
        href: ROUTES.brand.marketingSamples,
        description:
          'Учёт образцов коллекции для съёмок, редакций и стилистов. Связь с Production (сэмплы, артикулы) и маркетингом (кампании). ROI кампаний — в Аналитике.',
        iconColor: 'amber',
        quickActions: [
          { label: 'Products', href: ROUTES.brand.products, icon: Package },
          { label: 'Production', href: ROUTES.brand.production, icon: Factory },
          { label: 'Аналитика', href: ROUTES.brand.analyticsBi, icon: BarChart3 },
          { label: 'Content', href: ROUTES.brand.marketingContentFactory, icon: Megaphone },
        ],
      },
      {
        label: 'Медиа и контент',
        value: 'media',
        icon: ImageIcon,
        href: ROUTES.brand.media,
        description: 'DAM, трансляции, AI-видео. Связь с Products, Showroom и Marketing.',
        iconColor: 'blue',
        quickActions: [
          { label: 'Products', href: ROUTES.brand.products, icon: Package },
          { label: 'Showroom', href: ROUTES.brand.showroom, icon: Monitor },
        ],
      },
    ],
  },

  // ─── Кластер: Аналитика и инструменты ──────────────────────────
  {
    id: 'analytics',
    label: 'Аналитика и финансы',
    clusterId: 'insights',
    icon: BarChart3,
    scope: 'shared',
    links: [
      {
        label: 'Аналитика 360',
        value: 'analytics-360',
        icon: Target,
        href: ROUTES.brand.analytics360,
        description: 'Сквозная стратегическая аналитика',
      },
      {
        label: 'BI и отчёты',
        value: 'analytics-bi',
        icon: BarChart3,
        href: ROUTES.brand.analyticsBi,
        description:
          'Полная статистика бренда: продажи (B2B, дистрибуторы, маркетплейс, аутлет), производство, остатки, клиенты, коллекции. План vs Факт, Phase 2 закупки, дашборды. Интеграция: 1С, Excel, Мой Склад.',
        iconColor: 'indigo',
        quickActions: [
          { label: 'План vs Факт', href: ROUTES.brand.budgetActual, icon: Calculator },
          { label: 'Phase 2', href: ROUTES.brand.analyticsPhase2, icon: Layers },
          { label: 'AI Прогнозы', href: ROUTES.brand.analytics, icon: Zap },
          { label: '360°', href: ROUTES.brand.analytics360, icon: Target },
        ],
      },
      {
        label: 'План vs Факт',
        value: 'budget-actual',
        icon: Calculator,
        href: ROUTES.brand.budgetActual,
        description:
          'Бюджеты закупок, производства, маркетинга и логистики. РФ: рубли, контрагенты, статьи. Инфраструктура под API: ETL в fact_* / snapshot_*, импорт 1С/Мой Склад.',
        iconColor: 'indigo',
        quickActions: [
          { label: 'BI Hub', href: ROUTES.brand.analyticsBi, icon: BarChart3 },
          { label: 'Финансы', href: ROUTES.brand.finance, icon: DollarSign },
        ],
      },
      {
        label: 'AI Прогнозы',
        value: 'ai-analytics',
        icon: Zap,
        href: ROUTES.brand.analytics,
        description:
          'Анализ SKU, промо, A/B-тесты. Связи: Analytics 360, BI, Products, Promotions, Finance.',
        iconColor: 'indigo',
        quickActions: [
          { label: '360° Analytics', href: ROUTES.brand.analytics360, icon: Target },
          { label: 'BI Reports', href: ROUTES.brand.analyticsBi, icon: BarChart3 },
          { label: 'Products', href: ROUTES.brand.products, icon: Layers },
          { label: 'Promotions', href: ROUTES.brand.promotions, icon: Megaphone },
          { label: 'Finance', href: ROUTES.brand.finance, icon: DollarSign },
        ],
      },
      {
        label: 'Ценообразование',
        value: 'ai-pricing',
        icon: Calculator,
        href: ROUTES.brand.pricing,
        description: 'AI инструмент для настройки цен и маржи',
      },
      {
        label: 'Финансовый хаб',
        value: 'finance',
        icon: Wallet,
        href: ROUTES.brand.finance,
        description:
          'P&L, факторинг, бюджеты и кассовый контроль. Landed Cost — расчёт полной себестоимости (ткань + CMT + логистика + пошлины). Escrow — безопасные сделки B2B.',
        iconColor: 'emerald',
        quickActions: [
          { label: 'Landed Cost', href: ROUTES.brand.financeLandedCost, icon: Calculator },
          { label: 'Escrow', href: ROUTES.brand.financeEscrow, icon: Shield },
        ],
      },
      {
        label: 'ESG-мониторинг',
        value: 'esg',
        icon: Globe,
        href: ROUTES.brand.esg,
        description:
          'Сертификаты, отчёты GRI/CDP, углеродный след. Связь с Production (BOM, материалы), Compliance и Quality.',
        iconColor: 'emerald',
        quickActions: [
          { label: 'Production', href: ROUTES.brand.production, icon: Factory },
          { label: 'Compliance', href: ROUTES.brand.compliance, icon: Shield },
        ],
      },
    ],
  },
  {
    id: 'tools',
    label: 'AI и обучение',
    clusterId: 'insights',
    icon: Zap,
    scope: 'shared',
    links: [
      {
        label: 'AI Инструменты',
        value: 'ai-tools',
        icon: Sparkles,
        href: ROUTES.brand.aiDesign,
        description:
          'Генерация дизайна по описанию, техпакеты. Связь с Production (Tech Pack), Products и Planning.',
        iconColor: 'indigo',
        quickActions: [
          { label: 'Production', href: ROUTES.brand.production, icon: Factory },
          { label: 'Planning', href: ROUTES.brand.planning, icon: Layers },
        ],
      },
      {
        label: 'Академия',
        value: 'academy',
        icon: GraduationCap,
        href: ROUTES.brand.academy,
        description: 'Курсы, база знаний, материалы',
      },
      {
        label: 'HR-центр',
        value: 'hr-hub',
        icon: Briefcase,
        href: ROUTES.brand.hrHub,
        description:
          'Единый центр: вакансии, резюме, онбординг, обучение. Связь с Командой, Академией, Career.',
        iconColor: 'indigo',
        quickActions: [
          { label: 'Команда', href: ROUTES.brand.team, icon: Users },
          { label: 'Академия', href: ROUTES.brand.academy, icon: GraduationCap },
        ],
      },
    ],
  },
];

export const allBrandNavLinks = brandNavGroups.flatMap((group) => group.links);

/** Группы с только primary-пунктами (~25–35 видимых). */
export function getPrimaryNavGroups(
  groups: typeof brandNavGroups,
  filter: (g: (typeof brandNavGroups)[number]) => boolean
) {
  return groups
    .filter(filter)
    .map((g) => {
      const primaryValues = PRIMARY_LINK_VALUES[g.id] ?? [];
      const primaryLinks = g.links.filter((l) => primaryValues.includes(l.value));
      if (primaryLinks.length === 0) return null;
      return { ...g, links: primaryLinks };
    })
    .filter(Boolean) as (typeof brandNavGroups)[number][];
}

/** Второстепенные пункты для блока «Ещё», с указанием исходной группы. */
export function getSecondaryNavItems(
  groups: typeof brandNavGroups,
  filter: (g: (typeof brandNavGroups)[number]) => boolean
): SecondaryNavItem[] {
  const out: SecondaryNavItem[] = [];
  for (const g of groups) {
    if (!filter(g)) continue;
    const primaryValues = PRIMARY_LINK_VALUES[g.id] ?? [];
    for (const link of g.links) {
      if (!primaryValues.includes(link.value)) {
        out.push({
          link: link as SecondaryNavItem['link'],
          sourceGroupId: g.id,
          sourceGroupLabel: g.label,
        });
      }
    }
  }
  return out;
}

/** Хаб группы — первый (главный) раздел группы */
export function getGroupHub(groupId: string): { href: string; label: string } {
  const group = brandNavGroups.find((g) => g.id === groupId);
  if (!group?.links?.length) return { href: ROUTES.brand.home, label: 'Brand' };
  const first = group.links[0];
  return { href: first.href, label: first.label };
}

export type BrandSectionMeta = {
  groupId: string;
  groupLabel: string;
  groupHref: string;
  sectionLabel: string;
  sectionHref: string;
  /** Подраздел (напр. SSO внутри Интеграций) */
  subsectionLabel?: string;
  subsectionHref?: string;
  description: string;
  icon: (typeof brandNavGroups)[0]['links'][0]['icon'];
  iconColor?: 'indigo' | 'slate' | 'emerald' | 'amber' | 'rose' | 'blue';
  quickActions?: Array<{
    label: string;
    href: string;
    icon: (typeof brandNavGroups)[0]['links'][0]['icon'];
  }>;
};

function pathFromHref(href: string): string {
  return (href.split('?')[0] || '').replace(/\/$/, '') || '/';
}

/** Метаданные раздела по pathname — единый источник для BrandSectionHeaderBlock и breadcrumb */
export function getBrandSectionMeta(
  pathname: string,
  searchString?: string
): BrandSectionMeta | null {
  const path = pathname.replace(/\/$/, '') || '/brand';
  const flat: {
    href: string;
    pathOnly: string;
    link: (typeof brandNavGroups)[0]['links'][0];
    group: (typeof brandNavGroups)[0];
    subsection?: { href: string; label: string; value: string };
  }[] = [];
  for (const group of brandNavGroups) {
    for (const link of group.links) {
      const rawHref = link.href;
      flat.push({ href: rawHref, pathOnly: pathFromHref(rawHref), link, group });
      const subsections = (
        link as { subsections?: { href: string; label: string; value: string }[] }
      ).subsections;
      if (subsections?.length) {
        for (const sub of subsections) {
          flat.push({
            href: sub.href,
            pathOnly: pathFromHref(sub.href),
            link,
            group,
            subsection: sub,
          });
        }
      }
    }
  }
  flat.sort((a, b) => b.pathOnly.length - a.pathOnly.length);
  const matches: {
    link: (typeof brandNavGroups)[0]['links'][0];
    group: (typeof brandNavGroups)[0];
    subsection?: { href: string; label: string; value: string };
    prefersSearch: boolean;
  }[] = [];
  for (const { href, pathOnly, link, group, subsection } of flat) {
    const exact = path === pathOnly || path === pathFromHref(href);
    const nested = pathOnly !== '/brand' && path.startsWith(pathOnly + '/');
    if (exact || nested) {
      const prefersSearch = !!(
        searchString &&
        subsection?.href.includes('?') &&
        subsection.href.includes(searchString)
      );
      matches.push({ link, group, subsection, prefersSearch });
    }
  }
  const best = matches.sort((a, b) => (b.prefersSearch ? 1 : 0) - (a.prefersSearch ? 1 : 0))[0];
  if (best) {
    const { link, group, subsection } = best;
    const hub = getGroupHub(group.id);
    const subsections = (link as { subsections?: { href: string; label: string; value: string }[] })
      .subsections;
    let subsectionLabel: string | undefined;
    let subsectionHref: string | undefined;
    if (subsection) {
      subsectionLabel = subsection.label;
      subsectionHref = subsection.href;
    } else if (subsections?.length) {
      const sub = searchString
        ? (subsections.find((s) => s.href.includes('?') && s.href.includes(searchString)) ??
          subsections.find((s) => pathFromHref(s.href) === path))
        : subsections.find((s) => pathFromHref(s.href) === path);
      if (sub) {
        subsectionLabel = sub.label;
        subsectionHref = sub.href;
      }
    }
    const linkExt = link as {
      iconColor?: BrandSectionMeta['iconColor'];
      quickActions?: BrandSectionMeta['quickActions'];
    };
    return {
      groupId: group.id,
      groupLabel: group.label,
      groupHref: hub.href,
      sectionLabel: link.label,
      sectionHref: link.href,
      subsectionLabel,
      subsectionHref,
      description: link.description,
      icon: link.icon,
      iconColor: linkExt.iconColor ?? 'indigo',
      quickActions: linkExt.quickActions,
    };
  }
  return null;
}
