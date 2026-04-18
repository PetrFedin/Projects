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
<<<<<<< HEAD
  FileSearch,
  Sparkles,
=======
  Sparkles,
  Network,
>>>>>>> recover/cabinet-wip-from-stash
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
<<<<<<< HEAD
        label: 'Дашборд',
        icon: LayoutDashboard,
        description: 'Общая панель управления магазином',
=======
        label: 'Сводка',
        icon: LayoutDashboard,
        description: 'Ключевые показатели магазина',
>>>>>>> recover/cabinet-wip-from-stash
      },
    ],
  },
  {
<<<<<<< HEAD
    id: 'retail',
    label: 'Розничные продажи (B2C)',
=======
    id: 'retail-ops',
    label: 'Розница',
>>>>>>> recover/cabinet-wip-from-stash
    icon: ShoppingCart,
    links: [
      {
        href: ROUTES.shop.orders,
        value: 'orders',
        label: 'Заказы клиентов',
        icon: ShoppingCart,
<<<<<<< HEAD
        description: 'Управление розничными заказами',
=======
        description: 'Розничные заказы',
>>>>>>> recover/cabinet-wip-from-stash
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
<<<<<<< HEAD
        href: ROUTES.shop.inventory,
        value: 'inventory',
        label: 'Склад и остатки',
        icon: Package,
        description: 'Управление складскими остатками',
        subsections: [
          { href: ROUTES.shop.inventory, label: 'Текущие остатки', value: 'current' },
          { href: ROUTES.shop.inventoryArchive, label: 'Архив', value: 'archive' },
=======
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
>>>>>>> recover/cabinet-wip-from-stash
        ],
      },
      {
        href: ROUTES.shop.promotions,
        value: 'promotions',
        label: 'Акции и скидки',
        icon: Percent,
<<<<<<< HEAD
        description: 'Управление промо-акциями',
=======
        description: 'Промо и скидки',
>>>>>>> recover/cabinet-wip-from-stash
      },
      {
        href: ROUTES.shop.clienteling,
        value: 'clienteling',
<<<<<<< HEAD
        label: 'Клиентинг',
        icon: Users,
        description: 'CRM для работы с клиентами',
      },
      {
        href: ROUTES.shop.bopis,
        value: 'bopis',
        label: 'BOPIS (самовывоз)',
        icon: Package,
        description: 'Выдача интернет-заказов в магазине, ЭДО и маркировка (РФ)',
=======
        label: 'Клиенты и лояльность',
        icon: Users,
        description: 'Персональные продажи и база клиентов',
>>>>>>> recover/cabinet-wip-from-stash
      },
      {
        href: ROUTES.shop.stylistTablet,
        value: 'stylist-tablet',
<<<<<<< HEAD
        label: 'Endless Stylist Tablet',
        icon: LayoutGrid,
        description: 'Сборка образа из каталога на планшете продавца',
=======
        label: 'Планшет стилиста',
        icon: LayoutGrid,
        description: 'Сборка образа из каталога на планшете продавца',
        navTier: 'phase2' as const,
>>>>>>> recover/cabinet-wip-from-stash
      },
      {
        href: ROUTES.shop.bnpl,
        value: 'bnpl',
<<<<<<< HEAD
        label: 'Рассрочка на кассе (BNPL)',
        icon: CreditCard,
        description: 'Тинькофф, Сбер и др. на кассе',
      },
      {
        href: ROUTES.shop.cycleCounting,
        value: 'cycle-counting',
        label: 'Cycle Counting',
        icon: Camera,
        description: 'Инвентаризация склада через камеру смартфона (~15 мин)',
      },
      {
        href: ROUTES.shop.localInventoryAds,
        value: 'lia',
        label: 'Local Inventory Ads',
        icon: Map,
        description: 'Наличие в Google / Yandex Maps',
      },
      {
        href: ROUTES.shop.endlessAisle,
        value: 'endless-aisle',
        label: 'Endless Aisle POS',
        icon: Package,
        description: 'Заказ отсутствующего размера со склада бренда из примерочной',
      },
      {
        href: ROUTES.shop.shipFromStore,
        value: 'ship-from-store',
        label: 'Ship-from-Store',
        icon: Truck,
        description: 'Отправка онлайн-заказа из ближайшей точки (омниканал)',
=======
        label: 'Рассрочка на кассе',
        icon: CreditCard,
        description: 'Рассрочка и оплата частями (банки-партнёры)',
>>>>>>> recover/cabinet-wip-from-stash
      },
    ],
  },
  {
<<<<<<< HEAD
    id: 'b2b',
    label: 'Оптовые закупки (B2B)',
    icon: Briefcase,
    links: [
      {
        href: ROUTES.shop.b2bApply,
        value: 'b2b-apply',
        label: 'Подать заявку',
        icon: UserPlus,
        description: 'Заявка на партнёрство с брендом (JOOR-style Buyer Onboarding)',
      },
      {
        href: ROUTES.shop.b2bTradeShows,
        value: 'trade-shows',
        label: 'Мои выставки',
        icon: CalendarDays,
        description: 'Виртуальные выставки брендов, на которые вы приглашены',
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
        href: ROUTES.shop.b2bPassport,
        value: 'passport',
        label: 'Passport выставки',
        icon: FileText,
        description: 'JOOR: портал события — каталог, заказы с выставки',
      },
      {
        href: ROUTES.shop.b2bDiscover,
        value: 'discover',
        label: 'Discover (маркетплейс)',
        icon: Search,
        description: 'JOOR: каталог брендов, поиск, запрос доступа',
      },
      {
        href: ROUTES.shop.b2bPayment,
        value: 'payment',
        label: 'Оплата заказов',
        icon: CreditCard,
        description: 'JOOR Pay: оплата внутри платформы, по этапам',
      },
      {
        href: ROUTES.shop.b2b,
        value: 'showroom',
        label: 'B2B Шоурум',
        icon: Store,
        description: 'Просмотр коллекций брендов',
      },
      {
        href: ROUTES.shop.b2bOrderMode,
        value: 'order-mode',
        label: 'Режим заказа (Buy Now / Reorder / Pre-order)',
        icon: Zap,
        description: 'NuOrder-style: один экран выбора типа заказа',
      },
      {
        href: ROUTES.shop.b2bCreateOrder,
        value: 'create-order',
        label: 'Написание заказа по коллекции',
        icon: Edit,
        description: 'JOOR: сезон, бренд, коллекция → матрица',
      },
      {
        href: ROUTES.shop.b2bQuickOrder,
        value: 'quick-order',
        label: 'Быстрый заказ по артикулам',
        icon: Zap,
        description: 'NuOrder/JOOR: ввод по стилю, размеру, qty → матрица',
      },
      {
        href: ROUTES.shop.b2bOrderByCollection,
        value: 'order-by-collection',
        label: 'Заказ по коллекции / лукбуку',
        icon: Package,
        description: 'JOOR: выбор коллекции бренда, затем писать заказ',
      },
      {
        href: ROUTES.shop.b2bOrderTemplates,
        value: 'order-templates',
        label: 'Шаблоны заказов',
        icon: FileText,
        description: 'JOOR: сохранённые наборы позиций по коллекции',
      },
      {
        href: ROUTES.shop.b2bCollaborativeOrder,
        value: 'collaborative-order',
        label: 'Коллективный заказ',
        icon: Users,
        description: 'JOOR: общий черновик заказа для команды магазина',
      },
      {
        href: ROUTES.shop.b2bOrderDrafts,
        value: 'order-drafts',
        label: 'Черновики заказов',
        icon: Edit,
        description: 'JOOR: личные черновики по коллекциям',
      },
      {
        href: ROUTES.shop.b2bCollectionTerms,
        value: 'collection-terms',
        label: 'Условия по коллекциям',
        icon: Calendar,
        description: 'JOOR: дедлайны, MOQ, мин. сумма',
      },
      {
        href: ROUTES.shop.b2bReorder,
        value: 'reorder',
        label: 'Reorder from history',
        icon: RefreshCcw,
        description: 'Повтор заказа из прошлого сезона (копия + правки)',
      },
      {
        href: ROUTES.shop.b2bAssortmentPlanning,
        value: 'assortment-planning',
        label: 'Планирование ассортимента',
        icon: LayoutGrid,
        description: 'Планирование по категориям и бюджету до заказа',
      },
      {
        href: ROUTES.shop.b2bSelectionBuilder,
        value: 'selection-builder',
        label: 'Формирование селекции',
        icon: Layers,
        description: 'Сток, бренд-сезон, кросс-бренд — образы, аналитика, AI',
      },
      {
        href: ROUTES.shop.b2bCatalog,
        value: 'catalog',
        label: 'Каталог',
        icon: Package,
        description: 'Каталог для оптовых закупок',
      },
      {
        href: ROUTES.shop.b2bEzOrder,
        value: 'ez-order',
        label: 'EZ Order (One-Click)',
        icon: Zap,
        description: 'NuOrder: лайншит = форма заказа без матрицы',
      },
      {
        href: ROUTES.shop.b2bCustomAssortments,
        value: 'custom-assortments',
        label: 'Custom Assortments',
        icon: Layers,
        description: 'RepSpark: персональный ассортимент под ритейлера',
      },
      {
        href: ROUTES.shop.b2bSalesRepPortal,
        value: 'sales-rep-portal',
        label: 'Sales Rep Portal',
        icon: UserCircle,
        description: 'Shopify/Candid: портал для репов и showroom',
      },
      {
        href: ROUTES.shop.b2bQuoteToOrder,
        value: 'quote-to-order',
        label: 'Quote-to-Order',
        icon: FileText,
        description: 'NetSuite/BigCommerce: переход от КП к заказу',
      },
      {
        href: ROUTES.shop.b2bGridOrdering,
        value: 'grid-ordering',
        label: 'Grid Ordering',
        icon: LayoutGrid,
        description: 'NetSuite: массовое занесение позиций (таблица)',
      },
      {
        href: ROUTES.shop.b2bWorkingOrder,
        value: 'working-order',
        label: 'Working Order',
        icon: FileText,
        description: 'NuOrder: экспорт/импорт заказа Excel',
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
      },
      {
        href: ROUTES.shop.b2bLandedCost,
        value: 'landed-cost',
        label: 'Себестоимость',
        icon: Calculator,
        description: 'Расчет пошлин и логистики',
      },
      {
        href: ROUTES.shop.b2bPartnersDiscover,
        value: 'partners-discover',
        label: 'Discovery Radar',
        icon: Search,
        description: 'AI поиск новых брендов',
      },
      {
        href: ROUTES.shop.b2bStockMap,
        value: 'stock-map',
        label: 'Global Stock',
        icon: Map,
        description: 'Карта остатков по миру',
      },
      {
        href: ROUTES.shop.b2bClaims,
        value: 'claims',
        label: 'RMA & Рекламации',
        icon: ShieldAlert,
        description: 'Управление возвратами',
      },
      {
        href: ROUTES.shop.b2bOrders,
        value: 'b2b-orders',
        label: 'B2B Заказы',
        icon: ListOrdered,
        description: 'Оптовые заказы у брендов',
=======
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
>>>>>>> recover/cabinet-wip-from-stash
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
<<<<<<< HEAD
        href: ROUTES.shop.b2bReplenishment,
        value: 'replenishment',
        label: 'Автопополнение',
        icon: RefreshCcw,
        description: 'Автоматическое пополнение остатков',
      },
      {
        href: ROUTES.shop.b2bOrderAnalytics,
        value: 'order-analytics',
        label: 'Аналитика заказов',
        icon: BarChart2,
        description: 'NuOrder: топ стилей, тренды, сравнение с сезоном',
      },
      {
        href: ROUTES.shop.b2bFulfillmentDashboard,
        value: 'fulfillment-dashboard',
        label: 'Fulfillment (ZEOS)',
        icon: Truck,
        description: 'Zalando: каналы исполнения, Replenishment AI',
      },
      {
        href: ROUTES.shop.b2bMarginReport,
        value: 'margin-report',
        label: 'Маржа по брендам',
        icon: DollarSign,
        description: 'ASOS: маржа и оборачиваемость',
      },
      {
        href: ROUTES.shop.b2bSizeMapping,
        value: 'size-mapping',
        label: 'Маппинг размеров',
        icon: Ruler,
        description: 'ASOS: размер бренда → ритейл',
      },
      {
        href: ROUTES.shop.b2bMarginCalculator,
        value: 'margin-calculator',
        label: 'Калькулятор маржи',
        icon: Calculator,
        description: 'NuOrder: маржа в корзине и по заказу',
      },
      {
        href: ROUTES.shop.b2bMultiCurrency,
        value: 'multi-currency',
        label: 'Мультивалюта',
        icon: DollarSign,
        description: 'B2B-Center: валюты и курсы (РФ)',
      },
      {
        href: ROUTES.shop.b2bTenders,
        value: 'tenders',
        label: 'Тендеры / аукционы',
        icon: Gavel,
        description: 'B2B-Center: закупки через торги (РФ)',
      },
      {
        href: ROUTES.shop.b2bRfq,
        value: 'rfq',
        label: 'Запрос котировок (RFQ)',
        icon: FileSearch,
        description: 'Alibaba/OroCommerce: запрос цен у поставщиков',
      },
      {
        href: ROUTES.shop.b2bSupplierDiscovery,
        value: 'supplier-discovery',
        label: 'Поиск поставщиков',
        icon: Search,
        description: 'Supl.biz: реестр по гео и категориям (РФ)',
      },
      {
        href: ROUTES.shop.b2bAiSearch,
        value: 'ai-search',
        label: 'AI-поиск и рекомендации',
        icon: Sparkles,
        description: 'WizCommerce/Brandboom: персонализация, допродажи',
      },
      {
        href: ROUTES.shop.b2bAiSmartOrder,
        value: 'ai-smart-order',
        label: 'AI SmartOrder',
        icon: Zap,
        description: 'OroCommerce: черновик заказа из PDF/email PO',
      },
      {
        href: ROUTES.shop.b2bVideoConsultation,
        value: 'video-consultation',
        label: 'Видео-консультация',
        icon: MessageSquare,
        description: 'TSUM/Farfetch: слоты со стилистом, Zoom/Teams',
      },
      {
        href: ROUTES.shop.b2bVipRoomBooking,
        value: 'vip-room-booking',
        label: 'VIP Шоурум',
        icon: CalendarDays,
        description: 'TSUM: бронирование приватного шоурума',
      },
      {
        href: '/s/prive/syntha-fw26-elite',
        value: 'le-prive',
        label: 'Le Privé (VIP URL)',
        icon: Store,
        description: 'Le New Black: приватный showroom по ссылке',
      },
      {
        href: ROUTES.shop.b2bScanner,
        value: 'scanner',
        label: 'Sales App / Сканер',
        icon: Camera,
        description: 'Colect/Le New Black: iPad/телефон — показ и приём заказов',
      },
      {
        href: ROUTES.shop.b2bDealerCabinet,
        value: 'dealer-cabinet',
        label: 'Личный кабинет дилера',
        icon: LayoutDashboard,
        description: 'Sellty/Compo: документы, отчёты, аналитика',
      },
      {
        href: ROUTES.shop.b2bShopifySync,
        value: 'shopify-sync',
        label: 'Синхронизация (Shopify / 1С)',
        icon: Package,
        description: 'JOOR/NuOrder: заказы и каталог. РФ: 1С, Мой Склад, ЭДО в планах',
      },
      {
        href: ROUTES.shop.b2bSocialFeed,
        value: 'social-feed',
        label: 'Лента брендов',
        icon: MessageSquare,
        description: 'Новости коллекций, посты, подписка',
      },
      {
        href: ROUTES.shop.b2bGamification,
        value: 'gamification',
        label: 'Челленджи и бейджи',
        icon: Star,
        description: 'Баллы, достижения, скидки для байеров',
      },
      {
        href: ROUTES.shop.b2bPartnerOnboarding,
        value: 'partner-onboarding',
        label: 'Онбординг партнёра',
        icon: UserPlus,
        description: 'Zalando: пошаговое подключение к бренду, ИНН, ЭДО',
      },
      {
        href: ROUTES.storeLocator,
        value: 'store-locator',
        label: 'Карта магазинов',
        icon: Map,
        description: 'Наличие в точках, часы работы, маршрут (2GIS/Яндекс)',
      },
      {
        href: ROUTES.shop.b2bTracking,
        value: 'tracking',
        label: 'Карта поставок',
        icon: Map,
        description: 'Отслеживание грузов на карте',
      },
      {
        href: ROUTES.shop.b2bBudget,
        value: 'budget',
        label: 'OTB Бюджет',
        icon: DollarSign,
        description: 'Планирование закупочного бюджета',
        subsections: [
          { href: ROUTES.shop.b2bBudget, label: 'Все сезоны', value: 'all' },
          { href: `${ROUTES.shop.b2bBudget}/FW26`, label: 'FW26', value: 'fw26' },
          { href: `${ROUTES.shop.b2bBudget}/SS27`, label: 'SS27', value: 'ss27' },
        ],
      },
    ],
  },
  {
    id: 'partners',
    label: 'Партнеры-бренды',
    icon: Handshake,
    links: [
      {
        href: ROUTES.shop.b2bPartners,
        value: 'partners',
        label: 'Мои бренды',
        icon: Handshake,
        description: 'Управление партнерствами с брендами',
        subsections: [
          { href: ROUTES.shop.b2bPartners, label: 'Все партнеры', value: 'all' },
          { href: `${ROUTES.shop.b2bPartners}?status=active`, label: 'Активные', value: 'active' },
          { href: ROUTES.shop.b2bPartnersDiscover, label: 'Поиск брендов', value: 'discover' },
        ],
      },
      {
        href: ROUTES.shop.b2bContracts,
        value: 'contracts',
        label: 'Контракты',
        icon: FileText,
        description: 'Договоры с брендами',
      },
      {
        href: ROUTES.shop.b2bRating,
        value: 'rating',
        label: 'Рейтинг брендов',
        icon: Star,
        description: 'Оценка и отзывы о брендах',
      },
      {
        href: ROUTES.shop.b2bDocuments,
        value: 'documents',
        label: 'Документы',
        icon: BookText,
        description: 'Лайншиты, прайсы, сертификаты',
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
        label: 'Продажи B2C',
        icon: BarChart2,
        description: 'Аналитика розничных продаж',
      },
      {
        href: ROUTES.shop.b2bAnalytics,
        value: 'b2b-analytics',
        label: 'Закупки B2B',
        icon: Sigma,
        description: 'Аналитика оптовых закупок',
      },
      {
        href: ROUTES.shop.b2bMarginAnalysis,
        value: 'margin',
        label: 'Анализ маржи',
        icon: TrendingUp,
        description: 'Маржинальность по брендам и категориям',
=======
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
>>>>>>> recover/cabinet-wip-from-stash
      },
    ],
  },
  {
    id: 'management',
<<<<<<< HEAD
    label: 'Управление',
=======
    label: 'Сеть и доступы',
>>>>>>> recover/cabinet-wip-from-stash
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
<<<<<<< HEAD
=======
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
>>>>>>> recover/cabinet-wip-from-stash
        href: ROUTES.shop.b2bSettings,
        value: 'settings',
        label: 'Настройки',
        icon: Settings,
        description: 'Настройки магазина',
      },
    ],
  },
];

<<<<<<< HEAD
export const mainShopNavLinks = shopNavGroups.flatMap((g) => g.links);
=======
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
>>>>>>> recover/cabinet-wip-from-stash

// Helper functions
export function findShopSubsection(sectionValue: string, subsectionValue: string) {
  const section = mainShopNavLinks.find((link) => link.value === sectionValue);
  return section?.subsections?.find((sub) => sub.value === subsectionValue);
}

export function getShopSubsections(sectionValue: string) {
  const section = mainShopNavLinks.find((link) => link.value === sectionValue);
  return section?.subsections || [];
<<<<<<< HEAD
=======
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
>>>>>>> recover/cabinet-wip-from-stash
}
