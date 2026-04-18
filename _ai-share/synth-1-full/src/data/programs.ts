import { Program } from '@/lib/types';

export const PROGRAMS: Program[] = [
  {
    id: 'fashion-pulse',
    title: 'Fashion Pulse',
    description:
      'Еженедельный обзор главных событий индустрии моды, аналитика трендов и инсайды от экспертов.',
    coverUrl: 'https://images.unsplash.com/photo-1492707892479-7bc8d5a4ee93?q=80&w=1000',
    subscribers: 24500,
    host: {
      name: 'Александр Васильев',
      photoUrl: 'https://i.pravatar.cc/150?img=11',
      role: 'Fashion эксперт и историк моды',
    },
    sponsors: [
      {
        name: 'SberPay',
        logoUrl: 'https://images.unsplash.com/photo-1614680376573-df3480f0c6ff?q=80&w=200',
        url: 'https://sberpay.ru',
      },
      { name: 'TSUM', logoUrl: 'https://i.imgur.com/JMgcWwL.png', url: 'https://tsum.ru' },
    ],
    schedule: {
      dayOfWeek: 'Понедельник',
      time: '19:00',
    },
    category: 'Аналитика',
    pastBroadcasts: [
      {
        id: 'past-fp-1',
        title: 'Итоги года 2025',
        date: '2025-12-28T19:00:00Z',
        duration: 45,
        imageUrl: 'https://images.unsplash.com/photo-1492707892479-7bc8d5a4ee93?q=80&w=400',
      },
      {
        id: 'past-fp-2',
        title: 'Тренды весны 2026',
        date: '2026-01-05T19:00:00Z',
        duration: 52,
        imageUrl: 'https://images.unsplash.com/photo-1492707892479-7bc8d5a4ee93?q=80&w=400',
      },
    ],
  },
  {
    id: 'brand-secrets',
    title: 'Секреты Брендов',
    description: 'Глубокие интервью с основателями и креативными директорами ведущих модных домов.',
    coverUrl: 'https://images.unsplash.com/photo-1557804506-669a67965ba0?q=80&w=1000',
    subscribers: 18200,
    host: {
      name: 'Елена Белова',
      photoUrl: 'https://i.pravatar.cc/150?img=32',
      role: 'Главный редактор SYNTHA Mag',
    },
    sponsors: [
      {
        name: 'Media Group',
        logoUrl: 'https://images.unsplash.com/photo-1557683316-973673baf926?q=80&w=200',
        url: 'https://mediagroup.com',
      },
    ],
    schedule: {
      dayOfWeek: 'Среда',
      time: '18:00',
    },
    category: 'Интервью',
    pastBroadcasts: [
      {
        id: 'past-bs-1',
        title: 'В гостях у Prada',
        date: '2025-12-15T18:00:00Z',
        duration: 60,
        imageUrl: 'https://images.unsplash.com/photo-1557804506-669a67965ba0?q=80&w=400',
      },
      {
        id: 'past-bs-2',
        title: 'История успеха Loewe',
        date: '2026-01-08T18:00:00Z',
        duration: 48,
        imageUrl: 'https://images.unsplash.com/photo-1557804506-669a67965ba0?q=80&w=400',
      },
    ],
  },
  {
    id: 'tech-runway',
    title: 'Tech Runway',
    description: 'Как технологии меняют моду: от AI-дизайна до метавселенных и цифровой примерки.',
    coverUrl: 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?q=80&w=1000',
    subscribers: 15600,
    host: {
      name: 'Петр Соколов',
      photoUrl: 'https://i.pravatar.cc/150?img=12',
      role: 'CTO Syntha OS',
    },
    sponsors: [
      {
        name: 'Global Logistics',
        logoUrl: 'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?q=80&w=200',
        url: 'https://globallogistics.com',
      },
    ],
    schedule: {
      dayOfWeek: 'Пятница',
      time: '17:00',
    },
    category: 'Технологии',
    pastBroadcasts: [
      {
        id: 'past-tr-1',
        title: 'AI в дизайне',
        date: '2025-11-20T17:00:00Z',
        duration: 40,
        imageUrl: 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?q=80&w=400',
      },
      {
        id: 'past-tr-2',
        title: 'Digital Fashion',
        date: '2025-12-12T17:00:00Z',
        duration: 55,
        imageUrl: 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?q=80&w=400',
      },
    ],
  },
];
