'use client';

import {
  LayoutDashboard, Package, DollarSign, BarChart2, Handshake, FileText, Truck,
  CreditCard, Users, Settings, Calendar, Search, Percent, ListOrdered,
  RefreshCcw, Map, Gavel, UserPlus, MessageSquare, Star, Calculator,
} from 'lucide-react';
import { ROUTES } from '@/lib/routes';

/** Навигация Distributor — оптовые продажи, партнёры, каталог (B2B) */
export const distributorNavGroups = [
  {
    id: 'overview',
    label: 'Обзор',
    icon: LayoutDashboard,
    links: [
      { href: '/distributor', value: 'dashboard', label: 'Дашборд', icon: LayoutDashboard, description: 'Обзор оптовых продаж' },
    ],
  },
  {
    id: 'orders',
    label: 'Заказы',
    icon: Package,
    links: [
      { href: ROUTES.shop.b2bOrders, value: 'orders', label: 'B2B Заказы', icon: ListOrdered, description: 'Оптовые заказы', subsections: [
        { href: ROUTES.shop.b2bOrders, label: 'Все заказы', value: 'all' },
        { href: `${ROUTES.shop.b2bOrders}?status=draft`, label: 'Черновики', value: 'draft' },
        { href: `${ROUTES.shop.b2bOrders}?status=pending`, label: 'На согласовании', value: 'pending' },
        { href: `${ROUTES.shop.b2bOrders}?status=confirmed`, label: 'Подтверждённые', value: 'confirmed' },
      ]},
      { href: ROUTES.shop.b2bCreateOrder, value: 'create-order', label: 'Создать заказ', icon: Package, description: 'Написание заказа по коллекции' },
      { href: ROUTES.shop.b2bQuickOrder, value: 'quick-order', label: 'Быстрый заказ', icon: Package, description: 'По артикулам' },
      { href: ROUTES.shop.b2bReorder, value: 'reorder', label: 'Повтор заказа', icon: RefreshCcw, description: 'Из истории' },
      { href: ROUTES.shop.b2bOrderDrafts, value: 'order-drafts', label: 'Черновики', icon: FileText, description: 'Личные черновики' },
    ],
  },
  {
    id: 'catalog',
    label: 'Каталог и партнёры',
    icon: Handshake,
    links: [
      { href: ROUTES.shop.b2bCatalog, value: 'catalog', label: 'Каталог', icon: Package, description: 'Каталог для закупок' },
      { href: ROUTES.shop.b2bPartners, value: 'partners', label: 'Партнёры-бренды', icon: Handshake, description: 'Мои бренды', subsections: [
        { href: ROUTES.shop.b2bPartners, label: 'Все партнёры', value: 'all' },
        { href: ROUTES.shop.b2bPartnersDiscover, label: 'Поиск брендов', value: 'discover' },
      ]},
      { href: ROUTES.shop.b2bContracts, value: 'contracts', label: 'Контракты', icon: FileText, description: 'Договоры с брендами' },
      { href: ROUTES.shop.b2bTradeShows, value: 'trade-shows', label: 'Выставки', icon: Calendar, description: 'Виртуальные выставки' },
      { href: ROUTES.shop.b2bDiscover, value: 'discover', label: 'Discover', icon: Search, description: 'Маркетплейс брендов' },
      { href: ROUTES.shop.b2bDocuments, value: 'documents', label: 'Документы', icon: FileText, description: 'Лайншиты, прайсы' },
    ],
  },
  {
    id: 'finance',
    label: 'Финансы',
    icon: DollarSign,
    links: [
      { href: ROUTES.shop.b2bFinance, value: 'finance', label: 'Финансы', icon: DollarSign, description: 'Оплаты и счета' },
      { href: ROUTES.shop.b2bBudget, value: 'budget', label: 'OTB Бюджет', icon: CreditCard, description: 'Планирование бюджета' },
      { href: ROUTES.shop.b2bPayment, value: 'payment', label: 'Оплата заказов', icon: CreditCard, description: 'JOOR Pay' },
      { href: ROUTES.shop.b2bMarginCalculator, value: 'margin-calculator', label: 'Калькулятор маржи', icon: Calculator, description: 'Маржа в корзине' },
    ],
  },
  {
    id: 'logistics',
    label: 'Логистика',
    icon: Truck,
    links: [
      { href: ROUTES.shop.b2bTracking, value: 'tracking', label: 'Карта поставок', icon: Map, description: 'Отслеживание грузов' },
      { href: ROUTES.shop.b2bReplenishment, value: 'replenishment', label: 'Автопополнение', icon: RefreshCcw, description: 'Автоматическое пополнение' },
      { href: ROUTES.shop.b2bClaims, value: 'claims', label: 'RMA и рекламации', icon: Gavel, description: 'Возвраты' },
    ],
  },
  {
    id: 'analytics',
    label: 'Аналитика',
    icon: BarChart2,
    links: [
      { href: ROUTES.shop.analytics, value: 'analytics', label: 'Аналитика', icon: BarChart2, description: 'Отчёты и метрики' },
      { href: ROUTES.shop.b2bAnalytics, value: 'b2b-analytics', label: 'Закупки B2B', icon: BarChart2, description: 'Аналитика закупок' },
      { href: ROUTES.shop.b2bOrderAnalytics, value: 'order-analytics', label: 'Аналитика заказов', icon: BarChart2, description: 'Топ стилей, тренды' },
    ],
  },
  {
    id: 'management',
    label: 'Управление',
    icon: Settings,
    links: [
      { href: ROUTES.shop.calendar, value: 'calendar', label: 'Календарь', icon: Calendar, description: 'События и дедлайны' },
      { href: ROUTES.shop.messages, value: 'messages', label: 'Сообщения', icon: MessageSquare, description: 'Коммуникация с брендами' },
      { href: ROUTES.shop.staff, value: 'staff', label: 'Команда', icon: Users, description: 'Сотрудники' },
      { href: ROUTES.shop.b2bSettings, value: 'settings', label: 'Настройки', icon: Settings, description: 'Настройки дистрибьютора' },
    ],
  },
];
