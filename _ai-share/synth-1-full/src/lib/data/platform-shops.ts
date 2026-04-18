/**
 * Участники платформы — магазины для выбора при добавлении интернет-магазина.
 * Используется в профиле бренда и при подтверждении синхронизации со стороны магазина.
 */
import type { PlatformShop } from '@/lib/brand-profile/online-store-types';

export const PLATFORM_SHOPS: PlatformShop[] = [
  {
    id: 'shop1',
    name: 'Демо-магазин · Москва 1',
    nameAlt: 'Демо MSK 1',
    city: 'Москва',
    type: 'Мультибренд',
    logoUrl: 'https://picsum.photos/seed/demo-retail-msk1/40/40',
  },
  {
    id: 'shop2',
    name: 'Демо-магазин · Москва 2',
    nameAlt: 'Демо MSK 2',
    city: 'Москва',
    type: 'Универмаг',
    logoUrl: 'https://picsum.photos/seed/demo-retail-msk2/40/40',
  },
  {
    id: 'shop3',
    name: 'Демо-магазин · СПб',
    nameAlt: 'Демо СПб',
    city: 'Санкт-Петербург',
    type: 'Бутик',
    logoUrl: 'https://picsum.photos/seed/demo-retail-spb/40/40',
  },
];
