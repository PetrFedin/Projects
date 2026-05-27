/**
 * Лёгкий path-index для breadcrumbs — без lucide / nav groups в layout chunk.
 * Синхронизация: npm run cabinet-hub-nav:sync-path-index
 */

import type { CabinetNavPathCandidate } from '@/lib/ui/cabinet-nav-active';

export const distributorNavPathCandidates: readonly CabinetNavPathCandidate[] = [
  {
    href: '/distributor/staff',
    label: 'Команда',
  },
  {
    href: '/shop/calendar',
    label: 'Календарь',
  },
  {
    href: '/shop/messages',
    label: 'Сообщения',
  },
  {
    href: '/shop/b2b/partners',
    label: 'Партнёры',
  },
  {
    href: '/shop/b2b/partners',
    label: 'Портфель брендов',
  },
  {
    href: '/shop/b2b/catalog',
    label: 'Каталог опта',
  },
  {
    href: '/shop/b2b/partners/discover',
    label: 'Поиск брендов',
  },
  {
    href: '/shop/b2b/contracts',
    label: 'Контракты',
  },
  {
    href: '/shop/b2b/documents',
    label: 'Документы',
  },
  {
    href: '/shop/b2b/discover',
    label: 'Подбор брендов',
  },
  {
    href: '/shop/b2b/trade-shows',
    label: 'Выставки и события',
  },
  {
    href: '/shop/b2b/orders',
    label: 'Заказы B2B',
  },
  {
    href: '/shop/b2b/orders',
    label: 'Все заказы',
  },
  {
    href: '/shop/b2b/orders?status=draft',
    label: 'Черновики',
  },
  {
    href: '/shop/b2b/orders?status=pending',
    label: 'На согласовании',
  },
  {
    href: '/shop/b2b/orders?status=confirmed',
    label: 'Подтверждённые',
  },
  {
    href: '/shop/b2b/order-mode',
    label: 'Режим заказа',
  },
  {
    href: '/shop/b2b/create-order',
    label: 'Создать заказ',
  },
  {
    href: '/shop/b2b/quick-order',
    label: 'Быстрый заказ',
  },
  {
    href: '/shop/b2b/reorder',
    label: 'Повтор заказа',
  },
  {
    href: '/shop/b2b/order-drafts',
    label: 'Черновики (личные)',
  },
  {
    href: '/shop/b2b/tracking',
    label: 'Логистика и претензии',
  },
  {
    href: '/shop/b2b/tracking',
    label: 'Карта поставок',
  },
  {
    href: '/shop/b2b/replenishment',
    label: 'Автопополнение',
  },
  {
    href: '/shop/b2b/claims',
    label: 'RMA и рекламации',
  },
  {
    href: '/distributor',
    label: 'Дашборд',
  },
  {
    href: '/shop/b2b/finance',
    label: 'Финансы',
  },
  {
    href: '/shop/b2b/budget',
    label: 'OTB Бюджет',
  },
  {
    href: '/shop/b2b/payment',
    label: 'Оплата заказов',
  },
  {
    href: '/shop/b2b/margin-calculator',
    label: 'Калькулятор маржи',
  },
  {
    href: '/shop/analytics',
    label: 'Аналитика',
  },
  {
    href: '/shop/b2b/analytics',
    label: 'Закупки B2B',
  },
  {
    href: '/shop/b2b/order-analytics',
    label: 'Аналитика заказов',
  },
  {
    href: '/shop/b2b/settings',
    label: 'Настройки',
  },
] as const;
