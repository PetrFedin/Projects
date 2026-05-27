/**
 * Лёгкий индекс href→value/label для client cabinet shell (breadcrumbs).
 * Без lucide — не тянет client-navigation в initial chunk.
 * Синхронизация: npm run client-nav:sync-path-index.
 */

export type ClientNavPathCandidate = {
  href: string;
  value: string;
  label: string;
};

export const clientNavPathCandidates: readonly ClientNavPathCandidate[] = [
  {
    href: '/client',
    value: 'dashboard',
    label: 'Главная',
  },
  {
    href: '/client/calendar',
    value: 'calendar',
    label: 'Календарь',
  },
  {
    href: '/client/wardrobe',
    value: 'wardrobe',
    label: 'Мой гардероб',
  },
  {
    href: '/client/wishlist',
    value: 'wishlist',
    label: 'Избранное',
  },
  {
    href: '/client/my-outfits',
    value: 'my-outfits',
    label: 'Мои образы',
  },
  {
    href: '/client/catalog',
    value: 'catalog',
    label: 'Каталог',
  },
  {
    href: '/client/try-before-you-buy',
    value: 'try-before-buy',
    label: 'Плати после примерки',
  },
  {
    href: '/client/gift-registry',
    value: 'gift-registry',
    label: 'Реестр подарков',
  },
  {
    href: '/client/scanner',
    value: 'scanner',
    label: 'Сканер',
  },
  {
    href: '/orders',
    value: 'orders',
    label: 'Мои заказы',
  },
  {
    href: '/client/returns',
    value: 'returns',
    label: 'Возвраты',
  },
  {
    href: '/client/passport',
    value: 'passport',
    label: 'Паспорта вещей',
  },
  {
    href: '/wallet',
    value: 'wallet',
    label: 'Кошелёк Syntha',
  },
  {
    href: '/client/me/payments',
    value: 'payments',
    label: 'Платежи',
  },
  {
    href: '/client/me',
    value: 'profile',
    label: 'Профиль',
  },
  {
    href: '/client/me/collections',
    value: 'profile-collections',
    label: 'Коллекции AI',
  },
  {
    href: '/client/me/wardrobe',
    value: 'profile-wardrobe',
    label: 'Гардероб в профиле',
  },
  {
    href: '/client/me/offers/renewal',
    value: 'profile-offers-renewal',
    label: 'Подписки и офферы',
  },
  {
    href: '/academy',
    value: 'academy',
    label: 'Академия',
  },
];

export const clientMainNavLabelByValue: Readonly<Record<string, string>> = {
  dashboard: 'Главная',
  calendar: 'Календарь',
  wardrobe: 'Мой гардероб',
  wishlist: 'Избранное',
  'my-outfits': 'Мои образы',
  catalog: 'Каталог',
  'try-before-buy': 'Плати после примерки',
  'gift-registry': 'Реестр подарков',
  scanner: 'Сканер',
  orders: 'Мои заказы',
  returns: 'Возвраты',
  passport: 'Паспорта вещей',
  wallet: 'Кошелёк Syntha',
  payments: 'Платежи',
  profile: 'Профиль',
  'profile-collections': 'Коллекции AI',
  'profile-wardrobe': 'Гардероб в профиле',
  'profile-offers-renewal': 'Подписки и офферы',
  academy: 'Академия',
};
