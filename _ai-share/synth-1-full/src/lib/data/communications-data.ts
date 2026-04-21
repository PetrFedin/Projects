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
    title: 'Договор с ЦУМ',
    date: '2026-01-28',
    dateShort: '28 янв',
    href: buildCalendarUrl({ layers: 'orders', date: '2026-01-28', role: 'CFO' }),
    layer: 'orders',
    color: 'bg-rose-50 text-rose-600',
    role: 'CFO',
  },
  {
    id: '2',
    title: 'Дроп SS26 — Москва',
    date: '2026-01-24',
    dateShort: '24 янв',
    href: buildCalendarUrl({ layers: 'events', date: '2026-01-24' }),
    layer: 'events',
    color: 'bg-blue-50 text-blue-600',
  },
  {
    id: '3',
    title: 'Образец Gold Sample (QC)',
    date: '2026-01-18',
    dateShort: '18 янв',
    href: buildCalendarUrl({ layers: 'production', date: '2026-01-18', partner: 'Фабрика #4' }),
    layer: 'production',
    color: 'bg-slate-50 text-slate-600',
    partner: 'Фабрика #4',
  },
  {
    id: '4',
    title: 'Публикация лукбука',
    date: '2026-01-12',
    dateShort: '12 янв',
    href: buildCalendarUrl({ layers: 'content', date: '2026-01-12' }),
    layer: 'content',
    color: 'bg-purple-50 text-purple-600',
  },
  {
    id: '5',
    title: 'Escrow ЦУМ',
    date: '2026-01-20',
    dateShort: '20 янв',
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
  Podium: 'chat_podium',
  ЦУМ: 'chat_tsum_order',
  'Фабрика #4': 'chat_production_line',
};

export const RECENT_CHATS_PREVIEW: RecentChatPreview[] = [
  {
    id: '1',
    title: 'Podium',
    preview: 'TSUM: подтверждение заказа #4521',
    unread: 2,
    href: '/brand/messages',
    calendarHref: buildCalendarUrl({ partner: 'Podium', layers: 'orders' }),
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
    calendarHref: buildCalendarUrl({ partner: 'SS26', layers: ['tasks', 'content'] }),
  },
];
