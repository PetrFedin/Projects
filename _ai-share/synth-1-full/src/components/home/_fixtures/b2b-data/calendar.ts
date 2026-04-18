import type { B2BRole } from './production-core';

export const CALENDAR_ITEMS: {
  label: string;
  title: string;
  desc: string;
  action: string;
  link: string;
  status: string;
  roles?: B2BRole[];
  badge?: 'AI' | 'STRATEGIC';
}[] = [
  {
    label: 'Радар индустрии',
    title: 'Глобальный Радар',
    desc: 'Общий календарь fashion-событий с бронированием слотов для встреч и презентаций.',
    action: 'Забронировать слот',
    link: '/dashboard/calendar/radar',
    status: '8 слотов свободно',
    roles: ['admin', 'brand', 'distributor', 'shop', 'manufacturer', 'supplier'],
  },
  {
    label: 'Синхронизация производства',
    title: 'Производственный цикл',
    desc: 'Синхронизация этапов пошива с фабриками и автоматическое бронирование свободных мощностей.',
    action: 'Проверить окна',
    link: '/dashboard/production/capacity',
    status: 'Фабрики: Online',
    roles: ['admin', 'brand', 'manufacturer'],
  },
  {
    label: 'Встречи байеров',
    title: 'Байерские сессии',
    desc: 'Управление оптовыми заказами, назначение встреч и фиксация результатов переговоров в реальном времени.',
    action: 'Назначить встречу',
    link: '/dashboard/commerce/meetings',
    status: '3 активных сессии',
    roles: ['admin', 'brand', 'shop', 'distributor'],
  },
  {
    label: 'Окна закупок',
    title: 'Сорсинг материалов',
    desc: 'Графики поступления новых материалов от поставщиков и синхронизация с планами производства.',
    action: 'Смотреть график',
    link: '/dashboard/resources/sourcing',
    status: 'Обновлено сегодня',
    roles: ['admin', 'manufacturer', 'supplier'],
  },
  {
    label: 'Логистическая синергия',
    title: 'Кооперация Поставок',
    desc: 'Календарь сборных грузов и таможенных окон для оптимизации стоимости и сроков доставки.',
    action: 'Присоединиться',
    link: '/dashboard/logistics/coop',
    status: 'Груз формируется',
    roles: ['admin', 'manufacturer', 'distributor', 'supplier'],
  },
  {
    label: 'Финансовый контроль',
    title: 'Фин-комплаенс',
    desc: 'График транзакций, триггерно привязанный к фактическому прохождению контроля качества (ОТК).',
    action: 'Настроить триггеры',
    link: '/dashboard/finance/compliance-flow',
    status: 'Безопасно',
    roles: ['admin', 'brand', 'manufacturer'],
  },
  {
    label: 'Медиа-планирование',
    title: 'Контент-план',
    desc: 'Координация съемок кампейнов и подготовки 3D-ассетов между брендом и медиа-хабом.',
    action: 'Загрузить ТЗ',
    link: '/dashboard/media/planning',
    status: 'Студии готовы',
    roles: ['admin', 'brand', 'manufacturer'],
  },
  {
    label: 'Обсуждение коллабораций',
    title: 'Стратегические Советы',
    desc: 'Площадка для обсуждения коллабораций и фиксации протоколов намерений внутри экосистемы.',
    action: 'Начать диалог',
    link: '/dashboard/ecosystem/collabs',
    status: '2 новых идеи',
    roles: ['admin', 'brand', 'distributor', 'manufacturer', 'supplier', 'shop'],
  },
];
