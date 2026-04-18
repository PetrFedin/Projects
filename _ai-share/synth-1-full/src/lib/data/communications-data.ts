/**
 * Общие данные для раздела Коммуникации (Messages + Calendar)
 * Связано с calendar-events.ts — единый источник дедлайнов.
 */
import { buildCalendarUrl } from './calendar-events';

export interface UpcomingItem {
  id: string;
  title: string;
  date: string;
  dateShort: string;
  href: string;
  layer?: string;
  color: string;
  role?: string;
  partner?: string;
}

export const UPCOMING_EVENTS: UpcomingItem[] = [
  {
    id: '1',
<<<<<<< HEAD
    title: 'Contract TSUM',
=======
    title: 'Контракт с демо-магазином',
>>>>>>> recover/cabinet-wip-from-stash
    date: '2026-01-28',
    dateShort: '28 Jan',
    href: buildCalendarUrl({ layers: 'orders', date: '2026-01-28', role: 'CFO' }),
    layer: 'orders',
    color: 'bg-rose-50 text-rose-600',
    role: 'CFO',
  },
  {
    id: '2',
    title: 'Milan SS26 Drop',
    date: '2026-01-24',
    dateShort: '24 Jan',
    href: buildCalendarUrl({ layers: 'events', date: '2026-01-24' }),
    layer: 'events',
    color: 'bg-blue-50 text-blue-600',
  },
  {
    id: '3',
    title: 'QC Gold Sample',
    date: '2026-01-18',
    dateShort: '18 Jan',
    href: buildCalendarUrl({ layers: 'production', date: '2026-01-18', partner: 'Фабрика #4' }),
    layer: 'production',
<<<<<<< HEAD
    color: 'bg-slate-50 text-slate-600',
=======
    color: 'bg-bg-surface2 text-text-secondary',
>>>>>>> recover/cabinet-wip-from-stash
    partner: 'Фабрика #4',
  },
  {
    id: '4',
    title: 'Lookbook Release',
    date: '2026-01-12',
    dateShort: '12 Jan',
    href: buildCalendarUrl({ layers: 'content', date: '2026-01-12' }),
    layer: 'content',
<<<<<<< HEAD
    color: 'bg-purple-50 text-purple-600',
  },
  {
    id: '5',
    title: 'Escrow ЦУМ',
=======
    color: 'bg-accent-primary/10 text-accent-primary',
  },
  {
    id: '5',
    title: 'Escrow (демо-ритейл)',
>>>>>>> recover/cabinet-wip-from-stash
    date: '2026-01-20',
    dateShort: '20 Jan',
    href: buildCalendarUrl({ layers: 'finance', date: '2026-01-20' }),
    layer: 'finance',
    color: 'bg-emerald-50 text-emerald-600',
  },
];

export interface RecentChatPreview {
  id: string;
  title: string;
  preview: string;
  unread?: number;
  href: string;
  /** Ссылка в календарь с контекстом партнёра/роли */
  calendarHref?: string;
}

/** URL сообщений с контекстом (чат, партнёр, заказ) — для cross-links из календаря */
export function buildMessagesUrl(params: {
  chat?: string;
  partner?: string;
  order?: string;
}): string {
  const q = new URLSearchParams();
  if (params.chat) q.set('chat', params.chat);
  if (params.partner) q.set('partner', params.partner);
  if (params.order) q.set('order', params.order);
  const query = q.toString();
  return `/brand/messages${query ? `?${query}` : ''}`;
}

/** Маппинг партнёр → chatId для deep link из календаря */
export const PARTNER_CHAT_MAP: Record<string, string> = {
<<<<<<< HEAD
  Podium: 'chat_podium',
  ЦУМ: 'chat_tsum_order',
=======
  'Демо-магазин · Москва 1': 'chat_podium',
  'Демо-магазин · Москва 2': 'chat_tsum_order',
>>>>>>> recover/cabinet-wip-from-stash
  'Фабрика #4': 'chat_production_line',
};

export const RECENT_CHATS_PREVIEW: RecentChatPreview[] = [
  {
    id: '1',
<<<<<<< HEAD
    title: 'Podium',
    preview: 'TSUM: подтверждение заказа #4521',
    unread: 2,
    href: '/brand/messages',
    calendarHref: buildCalendarUrl({ partner: 'Podium', layers: 'orders' }),
=======
    title: 'Демо-магазин · Москва 1',
    preview: 'Подтверждение заказа #4521',
    unread: 2,
    href: '/brand/messages',
    calendarHref: buildCalendarUrl({ partner: 'Демо-магазин · Москва 1', layers: 'orders' }),
>>>>>>> recover/cabinet-wip-from-stash
  },
  {
    id: '2',
    title: 'Production Line',
    preview: 'Gold Sample SYN-001 готов',
    href: '/brand/messages',
    calendarHref: buildCalendarUrl({ partner: 'Фабрика #4', layers: 'production' }),
  },
  {
    id: '3',
    title: 'SS26',
    preview: 'Финальные образцы на согласовании',
    href: '/brand/messages',
<<<<<<< HEAD
    calendarHref: buildCalendarUrl({ layers: 'tasks,content' }),
=======
    calendarHref: buildCalendarUrl({ layers: ['tasks', 'content'] }),
>>>>>>> recover/cabinet-wip-from-stash
  },
];
