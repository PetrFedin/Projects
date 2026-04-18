'use client';

import {
  Store,
  Settings,
  LayoutDashboard,
  Activity,
  Shield,
  Users,
  BookText,
  ListChecks,
  Ruler,
  Palette,
  DollarSign,
  Megaphone,
  Sigma,
  MessageSquare,
  Calendar,
  Gavel,
  TrendingUp,
  FileText,
  Globe,
  BarChart2,
<<<<<<< HEAD
=======
  Map,
  Truck,
  Search,
  PackageSearch,
  Factory,
  Briefcase,
  Building2,
>>>>>>> recover/cabinet-wip-from-stash
} from 'lucide-react';
import { ROUTES } from '@/lib/routes';

/**
 * Normalized Admin Cabinet Navigation Structure
 * Clear separation by functional areas
 */

export const adminNavGroups = [
  {
    id: 'overview',
    label: 'Контроль',
    icon: LayoutDashboard,
    links: [
      {
<<<<<<< HEAD
        href: '/admin',
=======
        href: ROUTES.admin.home,
>>>>>>> recover/cabinet-wip-from-stash
        value: 'dashboard',
        label: 'Дашборд HQ',
        icon: LayoutDashboard,
        description: 'Главная панель управления платформой',
      },
      {
<<<<<<< HEAD
        href: '/admin/activity',
=======
        href: ROUTES.admin.activity,
>>>>>>> recover/cabinet-wip-from-stash
        value: 'activity',
        label: 'Логи активности',
        icon: Activity,
        description: 'Мониторинг всех действий на платформе',
      },
      {
<<<<<<< HEAD
        href: '/admin/audit',
=======
        href: ROUTES.admin.audit,
>>>>>>> recover/cabinet-wip-from-stash
        value: 'audit',
        label: 'Audit Trail Ledger',
        icon: FileText,
        description: 'Неизменяемый лог всех действий в системе',
      },
      {
<<<<<<< HEAD
        href: '/admin/production/dossier-metrics',
=======
        href: ROUTES.admin.productionDossierMetrics,
>>>>>>> recover/cabinet-wip-from-stash
        value: 'dossier-metrics',
        label: 'Метрики досье ТЗ',
        icon: BarChart2,
        description: 'Workshop2: сессии, вехи контура, команды (Upstash/файл)',
      },
      {
<<<<<<< HEAD
        href: '/admin/production/dossier-metrics/ops',
=======
        href: ROUTES.admin.productionDossierMetricsOps,
>>>>>>> recover/cabinet-wip-from-stash
        value: 'dossier-metrics-ops',
        label: 'Операции · воронка W2',
        icon: TrendingUp,
        description: 'Алерты, дневная воронка вех, ссылка на архив cron',
      },
    ],
  },
  {
<<<<<<< HEAD
=======
    id: 'ecosystem-bridges',
    label: 'Экосистема: кабинеты',
    icon: Globe,
    links: [
      {
        href: ROUTES.shop.home,
        value: 'bridge-shop',
        label: 'Ритейл',
        icon: Store,
        description: 'Кабинет магазина (B2C/B2B контур)',
      },
      {
        href: ROUTES.shop.b2bDiscover,
        value: 'bridge-b2b-discover',
        label: 'B2B Discover',
        icon: Globe,
        description: 'Точка входа байера на площадке',
      },
      {
        href: ROUTES.shop.b2bWorkspaceMap,
        value: 'bridge-b2b-workspace-map',
        label: 'Карта B2B (ритейл)',
        icon: Map,
        description: 'Digital Workplace — модули закупки',
      },
      {
        href: ROUTES.shop.b2bRfq,
        value: 'bridge-shop-rfq',
        label: 'RFQ (витрина)',
        icon: FileText,
        description: 'Запросы котировок в кабинете магазина',
      },
      {
        href: ROUTES.shop.b2bTenders,
        value: 'bridge-shop-tenders',
        label: 'Тендеры B2B',
        icon: Gavel,
        description: 'Торги на стороне ритейла',
      },
      {
        href: ROUTES.shop.b2bSupplierDiscovery,
        value: 'bridge-supplier-discovery',
        label: 'Поиск поставщиков',
        icon: PackageSearch,
        description: 'Реестр и матчинг в контуре магазина',
      },
      {
        href: ROUTES.shop.b2bFulfillmentDashboard,
        value: 'bridge-fulfillment',
        label: 'Fulfillment (ритейл)',
        icon: Truck,
        description: 'Исполнение и SLA для байера',
      },
      {
        href: ROUTES.brand.home,
        value: 'bridge-brand',
        label: 'Бренд',
        icon: Building2,
        description: 'Кабинет бренда',
      },
      {
        href: ROUTES.brand.suppliersRfq,
        value: 'bridge-brand-rfq',
        label: 'RFQ материалов (бренд)',
        icon: Search,
        description: 'Запросы бренда к поставщикам',
      },
      {
        href: ROUTES.factory.production,
        value: 'bridge-factory',
        label: 'Производство',
        icon: Factory,
        description: 'Manufacturer / supplier — фабрика и материалы',
      },
      {
        href: ROUTES.distributor.home,
        value: 'bridge-distributor',
        label: 'Дистрибьютор',
        icon: Briefcase,
        description: 'Территория, заказы, шоурумы',
      },
    ],
  },
  {
>>>>>>> recover/cabinet-wip-from-stash
    id: 'users',
    label: 'Пользователи и организации',
    icon: Users,
    links: [
      {
<<<<<<< HEAD
        href: '/admin/users',
=======
        href: ROUTES.admin.users,
>>>>>>> recover/cabinet-wip-from-stash
        value: 'users',
        label: 'Пользователи',
        icon: Users,
        description: 'Управление пользователями платформы',
        subsections: [
<<<<<<< HEAD
          { href: '/admin/users', label: 'Все пользователи', value: 'all' },
          { href: '/admin/users?role=brand', label: 'Бренды', value: 'brands' },
          { href: '/admin/users?role=shop', label: 'Ритейлеры', value: 'shops' },
          { href: '/admin/users?role=client', label: 'Клиенты', value: 'clients' },
        ],
      },
      {
        href: '/admin/brands',
=======
          { href: ROUTES.admin.users, label: 'Все пользователи', value: 'all' },
          { href: `${ROUTES.admin.users}?role=brand`, label: 'Бренды', value: 'brands' },
          { href: `${ROUTES.admin.users}?role=shop`, label: 'Ритейлеры', value: 'shops' },
          { href: `${ROUTES.admin.users}?role=client`, label: 'Клиенты', value: 'clients' },
        ],
      },
      {
        href: ROUTES.admin.brands,
>>>>>>> recover/cabinet-wip-from-stash
        value: 'brands',
        label: 'Бренды и компании',
        icon: Store,
        description: 'Управление брендами на платформе',
        subsections: [
<<<<<<< HEAD
          { href: '/admin/brands', label: 'Все бренды', value: 'all' },
          { href: '/admin/brands?status=active', label: 'Активные', value: 'active' },
          { href: '/admin/brands?status=pending', label: 'На модерации', value: 'pending' },
          { href: '/admin/brands?status=suspended', label: 'Приостановленные', value: 'suspended' },
        ],
      },
      {
        href: '/admin/staff',
=======
          { href: ROUTES.admin.brands, label: 'Все бренды', value: 'all' },
          { href: `${ROUTES.admin.brands}?status=active`, label: 'Активные', value: 'active' },
          {
            href: `${ROUTES.admin.brands}?status=pending`,
            label: 'На модерации',
            value: 'pending',
          },
          {
            href: `${ROUTES.admin.brands}?status=suspended`,
            label: 'Приостановленные',
            value: 'suspended',
          },
        ],
      },
      {
        href: ROUTES.admin.staff,
>>>>>>> recover/cabinet-wip-from-stash
        value: 'staff',
        label: 'Команда HQ',
        icon: Shield,
        description: 'Администраторы и модераторы',
      },
      {
<<<<<<< HEAD
        href: '/admin/appeals',
=======
        href: ROUTES.admin.appeals,
>>>>>>> recover/cabinet-wip-from-stash
        value: 'appeals',
        label: 'Апелляции',
        icon: Gavel,
        description: 'Рассмотрение жалоб и споров',
      },
    ],
  },
  {
    id: 'catalog',
    label: 'Каталог и справочники',
    icon: BookText,
    links: [
      {
        href: '/project-info/categories',
        value: 'categories',
        label: 'Категории',
        icon: BookText,
        description: 'Дерево категорий товаров',
      },
      {
        href: '/project-info/attributes',
        value: 'attribute-ref',
        label: 'Справочник атрибутов',
        icon: ListChecks,
        description: 'Значения атрибутов',
      },
      {
        href: '/project-info/sizes',
        value: 'sizes',
        label: 'Размерные сетки',
        icon: Ruler,
        description: 'Управление размерами',
      },
      {
        href: '/project-info/colors',
        value: 'colors',
        label: 'Палитра цветов',
        icon: Palette,
        description: 'Цветовые справочники',
      },
    ],
  },
  {
    id: 'commerce',
    label: 'Коммерция и транзакции',
    icon: DollarSign,
    links: [
      {
<<<<<<< HEAD
        href: '/admin/billing',
=======
        href: ROUTES.admin.billing,
>>>>>>> recover/cabinet-wip-from-stash
        value: 'billing',
        label: 'Биллинг',
        icon: DollarSign,
        description: 'Управление платежами и подписками',
        subsections: [
<<<<<<< HEAD
          { href: '/admin/billing', label: 'Обзор', value: 'overview' },
          { href: '/admin/billing?view=subscriptions', label: 'Подписки', value: 'subscriptions' },
          { href: '/admin/billing?view=transactions', label: 'Транзакции', value: 'transactions' },
          { href: '/admin/billing?view=invoices', label: 'Счета', value: 'invoices' },
        ],
      },
      {
        href: '/admin/bpi-matrix',
=======
          { href: ROUTES.admin.billing, label: 'Обзор', value: 'overview' },
          {
            href: `${ROUTES.admin.billing}?view=subscriptions`,
            label: 'Подписки',
            value: 'subscriptions',
          },
          {
            href: `${ROUTES.admin.billing}?view=transactions`,
            label: 'Транзакции',
            value: 'transactions',
          },
          { href: `${ROUTES.admin.billing}?view=invoices`, label: 'Счета', value: 'invoices' },
        ],
      },
      {
        href: ROUTES.admin.bpiMatrix,
>>>>>>> recover/cabinet-wip-from-stash
        value: 'bpi-matrix',
        label: 'Матрица BPI',
        icon: Sigma,
        description: 'Индекс эффективности брендов',
      },
    ],
  },
  {
    id: 'marketing',
    label: 'Маркетинг',
    icon: Megaphone,
    links: [
      {
<<<<<<< HEAD
        href: '/admin/promotions',
=======
        href: ROUTES.admin.promotions,
>>>>>>> recover/cabinet-wip-from-stash
        value: 'promotions',
        label: 'Акции и промо',
        icon: Megaphone,
        description: 'Управление промо-кампаниями',
        subsections: [
<<<<<<< HEAD
          { href: '/admin/promotions', label: 'Все акции', value: 'all' },
          { href: '/admin/promotions?status=active', label: 'Активные', value: 'active' },
          { href: '/admin/promotions/calendar', label: 'Календарь', value: 'calendar' },
=======
          { href: ROUTES.admin.promotions, label: 'Все акции', value: 'all' },
          { href: `${ROUTES.admin.promotions}?status=active`, label: 'Активные', value: 'active' },
          { href: ROUTES.admin.promotionsCalendar, label: 'Календарь', value: 'calendar' },
>>>>>>> recover/cabinet-wip-from-stash
        ],
      },
    ],
  },
  {
    id: 'content',
    label: 'Контент и модерация',
    icon: FileText,
    links: [
      {
<<<<<<< HEAD
        href: '/admin/home',
=======
        href: ROUTES.admin.cmsHome,
>>>>>>> recover/cabinet-wip-from-stash
        value: 'home',
        label: 'Главная страница',
        icon: Globe,
        description: 'Управление контентом главной',
      },
      {
<<<<<<< HEAD
        href: '/admin/quality',
=======
        href: ROUTES.admin.quality,
>>>>>>> recover/cabinet-wip-from-stash
        value: 'quality',
        label: 'Контроль качества',
        icon: Shield,
        description: 'Модерация контента и товаров',
      },
      {
<<<<<<< HEAD
        href: '/admin/auctions',
=======
        href: ROUTES.admin.auctions,
>>>>>>> recover/cabinet-wip-from-stash
        value: 'auctions',
        label: 'Аукционы',
        icon: Gavel,
        description: 'Управление аукционами',
      },
    ],
  },
  {
    id: 'communication',
    label: 'Коммуникации',
    icon: MessageSquare,
    links: [
      {
<<<<<<< HEAD
        href: '/admin/messages',
=======
        href: ROUTES.admin.messages,
>>>>>>> recover/cabinet-wip-from-stash
        value: 'messages',
        label: 'Сообщения',
        icon: MessageSquare,
        description: 'Внутренние сообщения',
      },
      {
<<<<<<< HEAD
        href: '/admin/calendar',
=======
        href: ROUTES.admin.calendar,
>>>>>>> recover/cabinet-wip-from-stash
        value: 'calendar',
        label: 'Календарь',
        icon: Calendar,
        description: 'События и дедлайны платформы',
      },
    ],
  },
  {
    id: 'settings',
    label: 'Система',
    icon: Settings,
    links: [
      {
<<<<<<< HEAD
        href: '/admin/settings',
=======
        href: ROUTES.admin.settings,
>>>>>>> recover/cabinet-wip-from-stash
        value: 'settings',
        label: 'Настройки OS',
        icon: Settings,
        description: 'Глобальные настройки платформы',
        subsections: [
<<<<<<< HEAD
          { href: '/admin/settings', label: 'Общие', value: 'general' },
          { href: '/admin/settings?tab=integrations', label: 'Интеграции', value: 'integrations' },
          { href: '/admin/settings?tab=security', label: 'Безопасность', value: 'security' },
          {
            href: '/admin/settings?tab=notifications',
=======
          { href: ROUTES.admin.settings, label: 'Общие', value: 'general' },
          {
            href: `${ROUTES.admin.settings}?tab=integrations`,
            label: 'Интеграции',
            value: 'integrations',
          },
          {
            href: `${ROUTES.admin.settings}?tab=security`,
            label: 'Безопасность',
            value: 'security',
          },
          {
            href: `${ROUTES.admin.settings}?tab=notifications`,
>>>>>>> recover/cabinet-wip-from-stash
            label: 'Уведомления',
            value: 'notifications',
          },
        ],
      },
    ],
  },
];

export const allAdminLinks = adminNavGroups.flatMap((g) => g.links);

// Helper functions
export function findAdminSubsection(sectionValue: string, subsectionValue: string) {
  const section = allAdminLinks.find((link) => link.value === sectionValue);
  return section?.subsections?.find((sub) => sub.value === subsectionValue);
}

export function getAdminSubsections(sectionValue: string) {
  const section = allAdminLinks.find((link) => link.value === sectionValue);
  return section?.subsections || [];
}
