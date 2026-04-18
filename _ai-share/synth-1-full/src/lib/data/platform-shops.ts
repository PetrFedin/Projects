/**
 * Участники платформы — магазины для выбора при добавлении интернет-магазина.
 * Используется в профиле бренда и при подтверждении синхронизации со стороны магазина.
 */
import type { PlatformShop } from '@/lib/brand-profile/online-store-types';

export const PLATFORM_SHOPS: PlatformShop[] = [
  {
    id: 'shop1',
    name: 'Podium',
    nameAlt: 'Подиум',
    city: 'Москва',
    type: 'Мультибренд',
    logoUrl: 'https://picsum.photos/seed/podium-logo/40/40',
    website: 'https://podium.ru',
  },
  {
    id: 'shop2',
    name: 'ЦУМ',
    nameAlt: 'TSUM',
    city: 'Москва',
    type: 'Универмаг',
    logoUrl: 'https://i.imgur.com/JMgcWwL.png',
    website: 'https://tsum.ru',
  },
  {
    id: 'shop3',
    name: 'Boutique No.7',
    nameAlt: 'Бутик №7',
    city: 'Санкт-Петербург',
    type: 'Бутик',
    logoUrl: 'https://picsum.photos/seed/boutique7-logo/40/40',
  },
  {
    id: 'shop4',
    name: 'Lamoda',
    nameAlt: 'Ла Мода',
    city: 'Москва',
    type: 'Маркетплейс',
    logoUrl: 'https://picsum.photos/seed/lamoda/40/40',
    website: 'https://lamoda.ru',
  },
  {
    id: 'shop5',
    name: 'Wildberries',
    nameAlt: 'Вайлдберриз',
    city: 'Москва',
    type: 'Маркетплейс',
    logoUrl: 'https://picsum.photos/seed/wb/40/40',
    website: 'https://wildberries.ru',
  },
  {
    id: 'shop6',
    name: 'Ozon',
    city: 'Москва',
    type: 'Маркетплейс',
    logoUrl: 'https://picsum.photos/seed/ozon/40/40',
    website: 'https://ozon.ru',
  },
];
