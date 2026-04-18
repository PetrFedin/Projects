/**
 * Общие данные календаря для всех разделов бренда.
 * Связывает Production, B2B, Finance, Tasks, Events, Messages — единый источник.
 */

import { format, differenceInDays, startOfDay } from 'date-fns';

export type EventSource =
  | 'production'
  | 'orders'
  | 'events'
  | 'tasks'
  | 'meetings'
  | 'marketing'
  | 'content'
  | 'finance';

export type RecurrenceType = 'daily' | 'weekly' | 'monthly' | 'yearly';

export type CollectionSeason = 'SS26' | 'FW26' | 'pre-collection' | 'core' | '';

export interface CalendarEvent {
  d: number;
  t: string;
  source: EventSource;
  c: string;
  ai?: boolean;
  href?: string;
  role?: string;
  partner?: string;
  assignee?: string;
  entityId?: string;
  entityType?: 'order' | 'task' | 'event' | 'escrow' | 'production';
  startTime?: string;
  endTime?: string;
  timezone?: string;
  recurrence?: RecurrenceType;
  reminderMinutes?: number;
  location?: string;
  description?: string;
  /** Коллекция/сезон для фильтра */
  collection?: CollectionSeason;
  /** ID события, от которого зависит (для critical path) */
  dependsOn?: string;
  /** Вес для тепловой карты (часы или приоритет 1-3) */
  weight?: number;
  /** Фактическая дата (план vs факт) */
  actualDate?: string;
  /** Приоритет: high, medium, low */
  priority?: 'high' | 'medium' | 'low';
  /** ID чата для cross-link в сообщения */
  targetChatId?: string;
  /** Участники (расширенный список: клиенты, партнёры, платформа) */
  participants?: string[];
}

export interface UpcomingDeadline {
  t: string;
  d: string;
  s: string;
  color: string;
  href?: string;
  role?: string;
  partner?: string;
  entityId?: string;
  layer?: EventSource;
  /** Дней до дедлайна (отрицательное = просрочено) */
  daysUntil?: number;
  /** Просрочено */
  isOverdue?: boolean;
  /** URL календаря с нужной датой и слоем */
  calendarHref?: string;
  /** День месяца (1–31) */
  day?: number;
}

/** События января 2026 — единый источник для календаря и cross-links */
export const ALL_CALENDAR_EVENTS: CalendarEvent[] = [
  {
    d: 3,
    t: 'Paris Fashion Week',
    source: 'events',
    c: 'bg-slate-900 text-white',
    href: '/brand/events',
    partner: 'Оргкомитет',
    entityType: 'event',
    startTime: '10:00',
    endTime: '18:00',
    timezone: 'Europe/Paris',
    location: 'Paris',
    reminderMinutes: 60,
    collection: 'SS26',
    weight: 8,
    priority: 'high',
  },
  {
    d: 5,
    t: 'Согласование PO ORD-4521',
    source: 'orders',
    c: 'bg-indigo-100 text-indigo-700',
    href: '/brand/b2b-orders/4521',
    role: 'Байер',
    partner: 'Podium',
    entityId: '4521',
    entityType: 'order',
    startTime: '11:00',
    endTime: '12:00',
    reminderMinutes: 15,
    collection: 'SS26',
    dependsOn: 'task-podium',
    weight: 1,
    priority: 'high',
  },
  {
    d: 5,
    t: 'Звонок с Podium',
    source: 'meetings',
    c: 'bg-sky-100 text-sky-700',
    href: '/brand/messages',
    role: 'Байер',
    partner: 'Podium',
    entityId: 'podium-chat',
    startTime: '14:00',
    endTime: '14:30',
    reminderMinutes: 5,
    collection: 'SS26',
    weight: 0.5,
  },
  {
    d: 6,
    t: 'Договор Podium — черновик',
    source: 'tasks',
    c: 'bg-violet-100 text-violet-700',
    href: '/brand/tasks',
    assignee: 'Анна',
    role: 'Юрист',
    entityId: 'task-podium',
    entityType: 'task',
    startTime: '09:00',
    endTime: '12:00',
    collection: 'SS26',
    weight: 3,
  },
  {
    d: 8,
    t: 'Escrow Milestone 1 — 30%',
    source: 'finance',
    c: 'bg-emerald-100 text-emerald-700',
    href: '/brand/finance/escrow',
    partner: 'ЦУМ',
    entityId: 'escrow-tsum',
    entityType: 'escrow',
    startTime: '12:00',
    endTime: '13:00',
    reminderMinutes: 1440,
    collection: 'SS26',
    weight: 1.5,
    priority: 'high',
  },
  {
    d: 11,
    t: 'Отгрузка SS26 Main',
    source: 'production',
    c: 'bg-amber-100 text-amber-700',
    href: '/brand/production',
    role: 'Логист',
    entityType: 'production',
    startTime: '08:00',
    endTime: '17:00',
    collection: 'SS26',
    weight: 9,
    priority: 'high',
  },
  {
    d: 12,
    t: 'Lookbook Graphene — релиз',
    source: 'content',
    c: 'bg-purple-100 text-purple-700',
    href: '/brand/media',
    role: 'Маркетолог',
    startTime: '09:00',
    endTime: '10:00',
    collection: 'SS26',
    weight: 1,
  },
  {
    d: 12,
    t: 'Gold Sample SYN-001',
    source: 'tasks',
    c: 'bg-violet-100 text-violet-700',
    href: '/brand/production',
    assignee: 'Петр (QC)',
    entityId: 'syn-001',
    entityType: 'task',
    startTime: '10:00',
    endTime: '11:30',
    recurrence: 'weekly',
    collection: 'SS26',
    weight: 1.5,
    dependsOn: 'sample-fitting',
    actualDate: '2026-01-13',
    priority: 'medium',
  },
  {
    d: 14,
    t: 'Peak Conversion Day',
    source: 'marketing',
    c: 'bg-emerald-100 text-emerald-700 font-bold',
    ai: true,
    href: '/brand/promotions',
    startTime: '00:00',
    endTime: '23:59',
    collection: 'SS26',
    weight: 3,
    priority: 'high',
  },
  {
    d: 15,
    t: 'Встреча с ЦУМ',
    source: 'meetings',
    c: 'bg-sky-100 text-sky-700',
    href: '/brand/b2b-orders',
    partner: 'ЦУМ',
    startTime: '15:00',
    endTime: '16:30',
    timezone: 'Europe/Moscow',
    reminderMinutes: 30,
    collection: 'SS26',
    weight: 1.5,
  },
  {
    d: 18,
    t: 'Gold Sample — примерка',
    source: 'production',
    c: 'bg-purple-100 text-purple-700',
    href: '/brand/production',
    role: 'QC',
    partner: 'Фабрика #4',
    entityType: 'production',
    startTime: '11:00',
    endTime: '14:00',
    location: 'Фабрика #4',
    entityId: 'sample-fitting',
    collection: 'SS26',
    weight: 3,
  },
  {
    d: 20,
    t: 'Оплата ORD-4420 Escrow',
    source: 'finance',
    c: 'bg-emerald-100 text-emerald-700',
    href: '/brand/finance/escrow',
    partner: 'ЦУМ',
    entityId: '4420',
    entityType: 'escrow',
    startTime: '10:00',
    endTime: '11:00',
    reminderMinutes: 60,
    collection: 'SS26',
    weight: 1,
    priority: 'high',
  },
  {
    d: 24,
    t: 'Milan SS26 Drop',
    source: 'events',
    c: 'bg-blue-100 text-blue-700',
    href: '/brand/events',
    entityType: 'event',
    startTime: '09:00',
    endTime: '20:00',
    timezone: 'Europe/Rome',
    location: 'Milan',
    collection: 'SS26',
    weight: 11,
    priority: 'high',
  },
  {
    d: 28,
    t: 'Контракт TSUM — подписание',
    source: 'orders',
    c: 'bg-indigo-100 text-indigo-700',
    href: '/brand/b2b-orders',
    role: 'CFO',
    partner: 'ЦУМ',
    entityId: 'tsum-contract',
    entityType: 'order',
    startTime: '16:00',
    endTime: '17:00',
    reminderMinutes: 60,
    collection: 'SS26',
    weight: 1,
    priority: 'high',
  },
];

/** Цвета статусов по источнику */
const SOURCE_COLORS: Record<EventSource, string> = {
  production: 'bg-amber-50 text-amber-600 border-amber-100',
  orders: 'bg-indigo-50 text-indigo-600 border-indigo-100',
  finance: 'bg-emerald-50 text-emerald-600 border-emerald-100',
  events: 'bg-blue-50 text-blue-600 border-blue-100',
  meetings: 'bg-sky-50 text-sky-600 border-sky-100',
  tasks: 'bg-violet-50 text-violet-600 border-violet-100',
  marketing: 'bg-emerald-50 text-emerald-600 border-emerald-100',
  content: 'bg-purple-50 text-purple-600 border-purple-100',
};

/** Генерирует Upcoming Deadlines из событий календаря: сортировка по дате, дни до дедлайна, просроченные */
export function getUpcomingDeadlines(
  events: CalendarEvent[],
  year: number,
  month: number,
  options?: { limit?: number; role?: string; partner?: string; layer?: EventSource }
): UpcomingDeadline[] {
  const today = startOfDay(new Date());
  const limit = options?.limit ?? 20;

  const mapped = events.map((ev) => {
    const date = new Date(year, month, ev.d);
    const daysUntil = differenceInDays(date, today);
    const isOverdue = daysUntil < 0;
    const baseColor = SOURCE_COLORS[ev.source] ?? 'bg-slate-50 text-slate-500 border-slate-100';
    const color = isOverdue ? 'bg-rose-50 text-rose-600 border-rose-200' : baseColor;
    let s: string;
    if (ev.priority === 'high') s = 'Urgent';
    else if (daysUntil <= 3 && daysUntil >= 0) s = 'Active';
    else if (daysUntil < 0) s = 'Overdue';
    else if (ev.source === 'content' || ev.source === 'marketing' || ev.source === 'finance')
      s = ev.source.charAt(0).toUpperCase() + ev.source.slice(1);
    else s = 'Pending';

    return {
      t: ev.t,
      d: format(date, 'd MMM', { locale: undefined }),
      day: ev.d,
      s,
      color,
      href: ev.href,
      role: ev.role,
      partner: ev.partner,
      entityId: ev.entityId,
      layer: ev.source,
      daysUntil,
      isOverdue,
      calendarHref: buildCalendarUrl({
        layers: ev.source,
        date: `${year}-${String(month + 1).padStart(2, '0')}-${String(ev.d).padStart(2, '0')}`,
      }),
    };
  });

  const filtered =
    options?.role || options?.partner || options?.layer
      ? mapped.filter((d) => {
          if (options.role && d.role !== options.role) return false;
          if (options.partner && d.partner !== options.partner) return false;
          if (options.layer && d.layer !== options.layer) return false;
          return true;
        })
      : mapped;

  return filtered.sort((a, b) => (a.daysUntil ?? 0) - (b.daysUntil ?? 0)).slice(0, limit);
}

/** Upcoming deadlines — автогенерация из ALL_CALENDAR_EVENTS (SS26 январь 2026) */
export function getDefaultUpcomingDeadlines(options?: { limit?: number }): UpcomingDeadline[] {
  return getUpcomingDeadlines(ALL_CALENDAR_EVENTS, 2026, 0, options);
}

/** @deprecated используйте getDefaultUpcomingDeadlines() */
export const UPCOMING_DEADLINES: UpcomingDeadline[] = getDefaultUpcomingDeadlines();

/** URL календаря с контекстом для cross-links из других разделов */
export function buildCalendarUrl(params: {
  layers?: EventSource | EventSource[];
  partner?: string;
  role?: string;
  date?: string;
  month?: string;
  collection?: CollectionSeason;
  /** Открыть форму добавления события (из Messages/UpcomingStrip) */
  add?: boolean;
}): string {
  const q = new URLSearchParams();
  if (params.layers) {
    const arr = Array.isArray(params.layers) ? params.layers : [params.layers];
    if (arr.length > 0) q.set('layers', arr.join(','));
  }
  if (params.partner) q.set('partner', params.partner);
  if (params.role) q.set('role', params.role);
  if (params.date) q.set('date', params.date);
  if (params.month) q.set('month', params.month);
  if (params.collection) q.set('collection', params.collection);
  if (params.add) q.set('add', '1');
  const query = q.toString();
  return `/brand/calendar${query ? `?${query}` : ''}`;
}

/** Season Pipeline — фазы fashion-цикла. layers — какие слои календаря релевантны */
export const SEASON_PIPELINE_PHASES = [
  {
    id: 'research',
    label: 'Research',
    color: 'bg-slate-100 text-slate-700',
    layers: ['tasks', 'meetings'] as EventSource[],
  },
  {
    id: 'design',
    label: 'Design',
    color: 'bg-indigo-100 text-indigo-700',
    layers: ['tasks', 'content', 'orders'] as EventSource[],
  },
  {
    id: 'sampling',
    label: 'Sampling',
    color: 'bg-violet-100 text-violet-700',
    layers: ['production', 'tasks', 'meetings'] as EventSource[],
  },
  {
    id: 'production',
    label: 'Production',
    color: 'bg-amber-100 text-amber-700',
    layers: ['production', 'orders', 'finance'] as EventSource[],
  },
  {
    id: 'launch',
    label: 'Launch',
    color: 'bg-emerald-100 text-emerald-700',
    layers: ['events', 'marketing', 'content'] as EventSource[],
  },
] as const;

/** Fashion Key Dates по сезонам. calendarDate для ссылки в календарь (YYYY-MM-DD) */
export interface FashionSeasonDate {
  season: string;
  label: string;
  date: string;
  phase: string;
  href: string;
  calendarDate?: string;
  layers?: EventSource;
}
export const FASHION_SEASON_DATES: FashionSeasonDate[] = [
  {
    season: 'SS26',
    label: 'Paris FW',
    date: '3 Jan',
    phase: 'launch',
    href: '/brand/events',
    calendarDate: '2026-01-03',
    layers: 'events',
  },
  {
    season: 'SS26',
    label: 'Lookbook Release',
    date: '12 Jan',
    phase: 'launch',
    href: '/brand/media',
    calendarDate: '2026-01-12',
    layers: 'content',
  },
  {
    season: 'SS26',
    label: 'Milan Drop',
    date: '24 Jan',
    phase: 'launch',
    href: '/brand/events',
    calendarDate: '2026-01-24',
    layers: 'events',
  },
  {
    season: 'SS26',
    label: 'Pre-Order Close',
    date: '15 Feb',
    phase: 'production',
    href: '/brand/pre-orders',
    calendarDate: '2026-02-15',
    layers: 'orders',
  },
  {
    season: 'FW26',
    label: 'Pre-Order Open',
    date: 'Mar 2026',
    phase: 'design',
    href: '/brand/pre-orders',
    calendarDate: '2026-03-01',
    layers: 'orders',
  },
];

/** Пороги тепловой карты: лёгкая / средняя / пик (часы) */
export const HEAT_THRESHOLDS = { low: 3, high: 6 } as const;

/** Веса источников для взвешенной тепловой карты (часы эквивалента) */
export const SOURCE_WEIGHTS: Record<EventSource, number> = {
  production: 2,
  orders: 1.5,
  finance: 1.5,
  events: 1.5,
  meetings: 0.5,
  tasks: 0.8,
  marketing: 1,
  content: 1,
};
