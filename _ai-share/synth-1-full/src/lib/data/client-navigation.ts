'use client';

import {
  LayoutDashboard,
  User,
  Heart,
  ShoppingBag,
  Scan,
  Gift,
  FileCheck,
  Wallet,
  BookOpen,
  CreditCard,
  Shirt,
  Sparkles,
  RefreshCw,
  Calendar,
} from 'lucide-react';
import { ROUTES } from '@/lib/routes';

export const clientNavGroups = [
  {
    id: 'overview',
    label: 'Обзор',
    icon: LayoutDashboard,
    links: [
      {
        href: '/client',
        value: 'dashboard',
        label: 'Главная',
        icon: LayoutDashboard,
        description: 'Сводка заказов, подборок и быстрых действий.',
      },
      {
        href: ROUTES.client.calendar,
        value: 'calendar',
        label: 'Календарь',
        icon: Calendar,
        description: 'События, планы и эфиры в одной ленте.',
      },
    ],
  },
  {
    id: 'wardrobe',
    label: 'Гардероб и избранное',
    icon: User,
    links: [
      {
        href: ROUTES.client.wardrobe,
        value: 'wardrobe',
        label: 'Мой гардероб',
        icon: User,
        description: 'Вещи, образы и заметки по посадке.',
      },
      {
        href: ROUTES.client.wishlist,
        value: 'wishlist',
        label: 'Избранное',
        icon: Heart,
        description: 'Отложенные SKU и списки желаний.',
      },
      {
        href: ROUTES.client.myOutfits,
        value: 'my-outfits',
        label: 'Мои образы',
        icon: Shirt,
        description: 'Сохранённые луки и комплекты.',
      },
    ],
  },
  {
    id: 'shopping',
    label: 'Покупки',
    icon: ShoppingBag,
    links: [
      {
        href: ROUTES.client.catalog,
        value: 'catalog',
        label: 'Каталог',
        icon: ShoppingBag,
        description: 'Поиск по брендам, размерам и атрибутам.',
      },
      {
        href: ROUTES.client.tryBeforeYouBuy,
        value: 'try-before-buy',
        label: 'Плати после примерки',
        icon: Scan,
        description: 'Примерка дома и оплата после решения.',
      },
      {
        href: ROUTES.client.giftRegistry,
        value: 'gift-registry',
        label: 'Реестр подарков',
        icon: Gift,
        description: 'Списки к праздникам и совместные вишлисты.',
      },
      {
        href: ROUTES.client.scanner,
        value: 'scanner',
        label: 'Сканер',
        icon: Scan,
        description: 'QR и штрихкоды в магазине и онлайн.',
      },
    ],
  },
  {
    id: 'orders',
    label: 'Заказы и возвраты',
    icon: FileCheck,
    links: [
      {
        href: ROUTES.client.orders,
        value: 'orders',
        label: 'Мои заказы',
        icon: FileCheck,
        description: 'Статусы, трекинг и детали покупок.',
      },
      {
        href: ROUTES.client.returns,
        value: 'returns',
        label: 'Возвраты',
        icon: FileCheck,
        description: 'Заявки и история возвратов.',
      },
      {
        href: ROUTES.client.passport,
        value: 'passport',
        label: 'Паспорта вещей',
        icon: FileCheck,
        description: 'Цифровые паспорта изделий и уход.',
      },
    ],
  },
  {
    id: 'wallet',
    label: 'Кошелёк и лояльность',
    icon: Wallet,
    links: [
      {
        href: '/wallet',
        value: 'wallet',
        label: 'Кошелёк Syntha',
        icon: Wallet,
        description: 'Баланс, бонусы и движение средств.',
      },
      {
        href: '/client/me/payments',
        value: 'payments',
        label: 'Платежи',
        icon: CreditCard,
        description: 'Способы оплаты и история списаний.',
      },
    ],
  },
  {
    id: 'account',
    label: 'Аккаунт',
    icon: User,
    links: [
      {
        href: '/client/me',
        value: 'profile',
        label: 'Профиль',
        icon: User,
        description: 'Имя, контакты и настройки аккаунта.',
      },
      {
        href: ROUTES.client.profileCollections,
        value: 'profile-collections',
        label: 'Коллекции AI',
        icon: Sparkles,
        description: 'Персональные подборки и витрина интересов.',
      },
      {
        href: ROUTES.client.profileWardrobe,
        value: 'profile-wardrobe',
        label: 'Гардероб в профиле',
        icon: Shirt,
        description: 'Публичная витрина вещей в профиле.',
      },
      {
        href: ROUTES.client.profileOffersRenewal,
        value: 'profile-offers-renewal',
        label: 'Подписки и офферы',
        icon: RefreshCw,
        description: 'Рассылки, программы и продления.',
      },
      {
        href: ROUTES.academyPlatform,
        value: 'academy',
        label: 'Академия',
        icon: BookOpen,
        description: 'Курсы, база знаний и эфиры для профи.',
      },
    ],
  },
];
