'use client';

import {
  LayoutDashboard, User, Heart, ShoppingBag, Scan, Gift, FileCheck,
  Wallet, BookOpen, CreditCard, Shirt,
} from 'lucide-react';
import { ROUTES } from '@/lib/routes';

export const clientNavGroups = [
  {
    id: 'overview',
    label: 'Обзор',
    icon: LayoutDashboard,
    links: [
      { href: '/client', value: 'dashboard', label: 'Главная', icon: LayoutDashboard, description: 'Личный кабинет' },
    ],
  },
  {
    id: 'wardrobe',
    label: 'Гардероб и избранное',
    icon: User,
    links: [
      { href: ROUTES.client.wardrobe, value: 'wardrobe', label: 'Мой гардероб', icon: User, description: 'Ваши вещи' },
      { href: ROUTES.client.wishlist, value: 'wishlist', label: 'Избранное', icon: Heart, description: 'Список желаний' },
      { href: ROUTES.client.myOutfits, value: 'my-outfits', label: 'Мои образы', icon: Shirt, description: 'Образы из корзины' },
    ],
  },
  {
    id: 'shopping',
    label: 'Покупки',
    icon: ShoppingBag,
    links: [
      { href: ROUTES.client.catalog, value: 'catalog', label: 'Каталог', icon: ShoppingBag, description: 'Каталог товаров' },
      { href: ROUTES.client.tryBeforeYouBuy, value: 'try-before-buy', label: 'Try Before Buy', icon: Scan, description: 'Примерка перед покупкой' },
      { href: ROUTES.client.giftRegistry, value: 'gift-registry', label: 'Реестр подарков', icon: Gift, description: 'Список подарков' },
      { href: ROUTES.client.scanner, value: 'scanner', label: 'Сканер', icon: Scan, description: 'Сканирование товаров' },
    ],
  },
  {
    id: 'orders',
    label: 'Заказы и возвраты',
    icon: FileCheck,
    links: [
      { href: ROUTES.client.orders, value: 'orders', label: 'Мои заказы', icon: FileCheck, description: 'История заказов' },
      { href: ROUTES.client.returns, value: 'returns', label: 'Возвраты', icon: FileCheck, description: 'Возврат товаров' },
      { href: ROUTES.client.passport, value: 'passport', label: 'Паспорта вещей', icon: FileCheck, description: 'Digital Product Passport' },
    ],
  },
  {
    id: 'wallet',
    label: 'Кошелёк и лояльность',
    icon: Wallet,
    links: [
      { href: '/wallet', value: 'wallet', label: 'Кошелёк Syntha', icon: Wallet, description: 'Баланс и платежи' },
      { href: '/u/payments', value: 'payments', label: 'Платежи', icon: CreditCard, description: 'Способы оплаты' },
    ],
  },
  {
    id: 'account',
    label: 'Аккаунт',
    icon: User,
    links: [
      { href: '/u', value: 'profile', label: 'Профиль', icon: User, description: 'Настройки профиля' },
      { href: ROUTES.academyPlatform, value: 'academy', label: 'Академия', icon: BookOpen, description: 'Курсы и обучение' },
    ],
  },
];
