import {
  LayoutGrid,
  Venus,
  Mars,
  Baby,
  Scissors,
  Home as HomeIcon,
  Factory,
  Globe,
  Users,
  Activity,
  Video,
  ShoppingBag,
} from 'lucide-react';
import type { GlobalCategory } from '@/lib/types';

export const globalCategories: { id: GlobalCategory; label: string; icon: any }[] = [
  { id: 'all', label: 'Все', icon: LayoutGrid },
  { id: 'women', label: 'Женщинам', icon: Venus },
  { id: 'men', label: 'Мужчинам', icon: Mars },
  { id: 'kids', label: 'Детям', icon: Baby },
  { id: 'beauty', label: 'КРАСОТА', icon: Scissors },
  { id: 'home', label: 'ДОМ', icon: HomeIcon },
];

export const totalLookCards = [
  {
    id: 'look-1',
    title: 'Gorpcore City',
    author: 'Syntha Lab',
    type: 'expert',
    price: 85000,
    originalPrice: 112000,
    bonus: 2500,
    items: 4,
    timeLeft: '12:45:08',
    imageUrl: 'https://images.unsplash.com/photo-1558769132-cb1aea458c5e?q=80&w=800',
    videoUrls: [
      {
        url: 'https://cdn.pixabay.com/vimeo/327334509/fashion-22501.mp4?width=1280&hash=0a0a0a0a0a0a0a0a0a0a0a0a0a0a0a0a0a0a0a0a',
        label: 'Catwalk Preview',
      },
    ],
    gallery: [
      'https://images.unsplash.com/photo-1558769132-cb1aea458c5e?q=80&w=1200',
      'https://images.unsplash.com/photo-1523381210434-271e8be1f52b?q=80&w=1200',
      'https://images.unsplash.com/photo-1539533018447-63fcce2678e3?q=80&w=1200',
    ],
    products: [
      {
        id: 'p1',
        name: 'Технологичный анорак',
        price: 42000,
        brand: 'Syntha Lab',
        image: 'https://images.unsplash.com/photo-1591047139829-d91aecb6caea?w=400',
      },
      {
        id: 'p2',
        name: 'Брюки-карго',
        price: 28000,
        brand: 'Syntha Lab',
        image: 'https://images.unsplash.com/photo-1552970571-c41c44b8882c?w=400',
      },
      {
        id: 'p3',
        name: 'Ботинки Tactical',
        price: 35000,
        brand: 'Nordic Wool',
        image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400',
      },
      {
        id: 'p4',
        name: 'Шапка-бини',
        price: 7000,
        brand: 'Nordic Wool',
        image: 'https://images.unsplash.com/photo-1576871337622-98d48d1cf027?w=400',
      },
    ],
    category: 'all',
  },
  {
    id: 'look-2',
    title: 'Minimalist Winter',
    author: 'Nordic Wool',
    type: 'brand',
    price: 145000,
    originalPrice: 180000,
    bonus: 5000,
    items: 3,
    timeLeft: '05:20:12',
    imageUrl: 'https://images.unsplash.com/photo-1539533018447-63fcce2678e3?q=80&w=800',
    videoUrls: [
      {
        url: 'https://cdn.pixabay.com/vimeo/327334509/fashion-22501.mp4?width=1280&hash=0a0a0a0a0a0a0a0a0a0a0a0a0a0a0a0a0a0a0a0a',
        label: 'Catwalk Preview',
      },
    ],
    gallery: [
      'https://images.unsplash.com/photo-1539533018447-63fcce2678e3?q=80&w=1200',
      'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?q=80&w=1200',
      'https://images.unsplash.com/photo-1539533018447-63fcce2678e3?q=80&w=1200',
    ],
    products: [
      {
        id: 'p5',
        name: 'Пальто из кашемира',
        price: 95000,
        brand: 'Nordic Wool',
        image: 'https://images.unsplash.com/photo-1539533018447-63fcce2678e3?w=400',
      },
      {
        id: 'p6',
        name: 'Свитер с горлом',
        price: 35000,
        brand: 'Nordic Wool',
        image: 'https://images.unsplash.com/photo-1516733725897-1aa73b87c8e8?w=400',
      },
      {
        id: 'p7',
        name: 'Шерстяные брюки',
        price: 50000,
        brand: 'Nordic Wool',
        image: 'https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?w=400',
      },
    ],
    category: 'all',
  },
];

export const b2bSections = [
  { id: 'PRODUCTION_b2b', label: 'Производство', icon: Factory },
  { id: 'WORKPLACE_b2b', label: 'Пространство', icon: LayoutGrid },
  { id: 'ECOSYSTEM_b2b', label: 'Экосистема', icon: Globe },
  { id: 'PARTNERS_b2b', label: 'Альянс', icon: Users },
  { id: 'CALENDAR_b2b', label: 'Календарь', icon: Activity },
  { id: 'MEDIA_ECOSYSTEM_b2b', label: 'Медиа', icon: Video },
  { id: 'PROCUREMENT_b2b', label: 'Закупки', icon: ShoppingBag },
  { id: 'SHOWCASE_b2b', label: 'Витрина', icon: LayoutGrid },
];
