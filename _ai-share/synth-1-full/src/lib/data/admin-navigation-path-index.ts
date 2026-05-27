/**
 * Лёгкий индекс admin nav для layout breadcrumbs — без lucide.
 * Синхронизация: npm run admin-nav:sync-path-index
 */

export type AdminNavPathCandidate = {
  href: string;
  value: string;
  label: string;
  groupLabel: string;
};

export const adminNavPathCandidates: readonly AdminNavPathCandidate[] = [
  {
    href: '/admin',
    value: 'dashboard',
    label: 'Дашборд HQ',
    groupLabel: 'Контроль',
  },
  {
    href: '/admin/activity',
    value: 'activity',
    label: 'Логи активности',
    groupLabel: 'Контроль',
  },
  {
    href: '/admin/audit',
    value: 'audit',
    label: 'Audit Trail Ledger',
    groupLabel: 'Контроль',
  },
  {
    href: '/admin/production/dossier-metrics',
    value: 'dossier-metrics',
    label: 'Метрики досье ТЗ',
    groupLabel: 'Контроль',
  },
  {
    href: '/admin/production/dossier-metrics/ops',
    value: 'dossier-metrics-ops',
    label: 'Операции · воронка W2',
    groupLabel: 'Контроль',
  },
  {
    href: '/shop',
    value: 'bridge-shop',
    label: 'Ритейл',
    groupLabel: 'Экосистема: кабинеты',
  },
  {
    href: '/shop/b2b/discover',
    value: 'bridge-b2b-discover',
    label: 'B2B Discover',
    groupLabel: 'Экосистема: кабинеты',
  },
  {
    href: '/shop/b2b/workspace-map',
    value: 'bridge-b2b-workspace-map',
    label: 'Карта B2B (ритейл)',
    groupLabel: 'Экосистема: кабинеты',
  },
  {
    href: '/shop/b2b/rfq',
    value: 'bridge-shop-rfq',
    label: 'RFQ (витрина)',
    groupLabel: 'Экосистема: кабинеты',
  },
  {
    href: '/shop/b2b/tenders',
    value: 'bridge-shop-tenders',
    label: 'Тендеры B2B',
    groupLabel: 'Экосистема: кабинеты',
  },
  {
    href: '/shop/b2b/supplier-discovery',
    value: 'bridge-supplier-discovery',
    label: 'Поиск поставщиков',
    groupLabel: 'Экосистема: кабинеты',
  },
  {
    href: '/shop/b2b/fulfillment-dashboard',
    value: 'bridge-fulfillment',
    label: 'Fulfillment (ритейл)',
    groupLabel: 'Экосистема: кабинеты',
  },
  {
    href: '/brand/profile',
    value: 'bridge-brand',
    label: 'Бренд',
    groupLabel: 'Экосистема: кабинеты',
  },
  {
    href: '/brand/suppliers/rfq',
    value: 'bridge-brand-rfq',
    label: 'RFQ материалов (бренд)',
    groupLabel: 'Экосистема: кабинеты',
  },
  {
    href: '/factory/production',
    value: 'bridge-factory',
    label: 'Производство',
    groupLabel: 'Экосистема: кабинеты',
  },
  {
    href: '/distributor',
    value: 'bridge-distributor',
    label: 'Дистрибьютор',
    groupLabel: 'Экосистема: кабинеты',
  },
  {
    href: '/admin/users',
    value: 'users',
    label: 'Пользователи',
    groupLabel: 'Пользователи и организации',
  },
  {
    href: '/admin/users',
    value: 'users',
    label: 'Пользователи',
    groupLabel: 'Пользователи и организации',
  },
  {
    href: '/admin/users?role=brand',
    value: 'users',
    label: 'Пользователи',
    groupLabel: 'Пользователи и организации',
  },
  {
    href: '/admin/users?role=shop',
    value: 'users',
    label: 'Пользователи',
    groupLabel: 'Пользователи и организации',
  },
  {
    href: '/admin/users?role=client',
    value: 'users',
    label: 'Пользователи',
    groupLabel: 'Пользователи и организации',
  },
  {
    href: '/admin/brands',
    value: 'brands',
    label: 'Бренды и компании',
    groupLabel: 'Пользователи и организации',
  },
  {
    href: '/admin/brands',
    value: 'brands',
    label: 'Бренды и компании',
    groupLabel: 'Пользователи и организации',
  },
  {
    href: '/admin/brands?status=active',
    value: 'brands',
    label: 'Бренды и компании',
    groupLabel: 'Пользователи и организации',
  },
  {
    href: '/admin/brands?status=pending',
    value: 'brands',
    label: 'Бренды и компании',
    groupLabel: 'Пользователи и организации',
  },
  {
    href: '/admin/brands?status=suspended',
    value: 'brands',
    label: 'Бренды и компании',
    groupLabel: 'Пользователи и организации',
  },
  {
    href: '/admin/staff',
    value: 'staff',
    label: 'Команда HQ',
    groupLabel: 'Пользователи и организации',
  },
  {
    href: '/admin/appeals',
    value: 'appeals',
    label: 'Апелляции',
    groupLabel: 'Пользователи и организации',
  },
  {
    href: '/project-info/categories',
    value: 'categories',
    label: 'Категории',
    groupLabel: 'Каталог и справочники',
  },
  {
    href: '/project-info/attributes',
    value: 'attribute-ref',
    label: 'Справочник атрибутов',
    groupLabel: 'Каталог и справочники',
  },
  {
    href: '/project-info/sizes',
    value: 'sizes',
    label: 'Размерные сетки',
    groupLabel: 'Каталог и справочники',
  },
  {
    href: '/project-info/colors',
    value: 'colors',
    label: 'Палитра цветов',
    groupLabel: 'Каталог и справочники',
  },
  {
    href: '/admin/billing',
    value: 'billing',
    label: 'Биллинг',
    groupLabel: 'Коммерция и транзакции',
  },
  {
    href: '/admin/billing',
    value: 'billing',
    label: 'Биллинг',
    groupLabel: 'Коммерция и транзакции',
  },
  {
    href: '/admin/billing?view=subscriptions',
    value: 'billing',
    label: 'Биллинг',
    groupLabel: 'Коммерция и транзакции',
  },
  {
    href: '/admin/billing?view=transactions',
    value: 'billing',
    label: 'Биллинг',
    groupLabel: 'Коммерция и транзакции',
  },
  {
    href: '/admin/billing?view=invoices',
    value: 'billing',
    label: 'Биллинг',
    groupLabel: 'Коммерция и транзакции',
  },
  {
    href: '/admin/bpi-matrix',
    value: 'bpi-matrix',
    label: 'Матрица BPI',
    groupLabel: 'Коммерция и транзакции',
  },
  {
    href: '/admin/promotions',
    value: 'promotions',
    label: 'Акции и промо',
    groupLabel: 'Маркетинг',
  },
  {
    href: '/admin/promotions',
    value: 'promotions',
    label: 'Акции и промо',
    groupLabel: 'Маркетинг',
  },
  {
    href: '/admin/promotions?status=active',
    value: 'promotions',
    label: 'Акции и промо',
    groupLabel: 'Маркетинг',
  },
  {
    href: '/admin/promotions/calendar',
    value: 'promotions',
    label: 'Акции и промо',
    groupLabel: 'Маркетинг',
  },
  {
    href: '/admin/home',
    value: 'home',
    label: 'Главная страница',
    groupLabel: 'Контент и модерация',
  },
  {
    href: '/admin/quality',
    value: 'quality',
    label: 'Контроль качества',
    groupLabel: 'Контент и модерация',
  },
  {
    href: '/admin/auctions',
    value: 'auctions',
    label: 'Аукционы',
    groupLabel: 'Контент и модерация',
  },
  {
    href: '/admin/messages',
    value: 'messages',
    label: 'Сообщения',
    groupLabel: 'Коммуникации',
  },
  {
    href: '/admin/calendar',
    value: 'calendar',
    label: 'Календарь',
    groupLabel: 'Коммуникации',
  },
  {
    href: '/admin/settings',
    value: 'settings',
    label: 'Настройки OS',
    groupLabel: 'Система',
  },
  {
    href: '/admin/settings',
    value: 'settings',
    label: 'Настройки OS',
    groupLabel: 'Система',
  },
  {
    href: '/admin/settings?tab=integrations',
    value: 'settings',
    label: 'Настройки OS',
    groupLabel: 'Система',
  },
  {
    href: '/admin/settings?tab=security',
    value: 'settings',
    label: 'Настройки OS',
    groupLabel: 'Система',
  },
  {
    href: '/admin/settings?tab=notifications',
    value: 'settings',
    label: 'Настройки OS',
    groupLabel: 'Система',
  },
] as const;

export const ADMIN_HOME = '/admin';
