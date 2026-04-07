/**
 * Расширенные функции календаря: шаблоны, capacity, аналитика, связь с заказами.
 */
import type { CalendarEvent, EventSource } from './calendar-events';

/** Шаблон события — быстрый выбор типа с предзаполнением */
export interface EventTemplate {
  id: string;
  label: string;
  source: EventSource;
  defaultTitle: string;
  defaultDuration?: string; // "1:00"
  reminderMinutes?: number;
  partner?: string;
  role?: string;
  entityType?: CalendarEvent['entityType'];
}

export const EVENT_TEMPLATES: EventTemplate[] = [
  { id: 'qc-sample', label: 'QC Sample', source: 'tasks', defaultTitle: 'Gold Sample — QC', reminderMinutes: 60, role: 'QC', entityType: 'task' },
  { id: 'b2b-meeting', label: 'B2B встреча', source: 'meetings', defaultTitle: 'Встреча с партнёром', reminderMinutes: 15, defaultDuration: '1:00' },
  { id: 'escrow', label: 'Escrow', source: 'finance', defaultTitle: 'Escrow Milestone', reminderMinutes: 1440, entityType: 'escrow' },
  { id: 'production-milestone', label: 'Production milestone', source: 'production', defaultTitle: 'Отгрузка / Milestone', reminderMinutes: 60, entityType: 'production' },
  { id: 'order-approval', label: 'Согласование заказа', source: 'orders', defaultTitle: 'Согласование PO', reminderMinutes: 15, role: 'Байер', entityType: 'order' },
  { id: 'call-supplier', label: 'Звонок с поставщиком', source: 'meetings', defaultTitle: 'Звонок с поставщиком', reminderMinutes: 5, defaultDuration: '0:30' },
  { id: 'event', label: 'Мероприятие', source: 'events', defaultTitle: 'Мероприятие', reminderMinutes: 60, entityType: 'event' },
  { id: 'training', label: 'Обучение', source: 'tasks', defaultTitle: 'Обучение', reminderMinutes: 30 },
];

/** Capacity по исполнителю — нагрузка в часах за день/неделю */
export function getCapacityByAssignee(events: CalendarEvent[], year: number, month: number): Map<string, { day: number; hours: number }[]> {
  const byAssignee = new Map<string, Map<number, number>>();
  const SOURCE_WEIGHTS: Record<EventSource, number> = {
    production: 2, orders: 1.5, finance: 1.5, events: 1.5, meetings: 0.5, tasks: 0.8, marketing: 1, content: 1,
  };
  for (const e of events) {
    const assignee = e.assignee || e.role || 'Без назначения';
    if (!byAssignee.has(assignee)) byAssignee.set(assignee, new Map());
    const byDay = byAssignee.get(assignee)!;
    const w = e.weight ?? SOURCE_WEIGHTS[e.source] ?? 1;
    byDay.set(e.d, (byDay.get(e.d) ?? 0) + w);
  }
  const result = new Map<string, { day: number; hours: number }[]>();
  for (const [assignee, byDay] of byAssignee) {
    result.set(assignee, Array.from(byDay.entries()).map(([day, hours]) => ({ day, hours })));
  }
  return result;
}

/** Найти свободные слоты в день (часы без событий) */
export function getFreeSlots(events: CalendarEvent[], day: number): { start: string; end: string }[] {
  const dayEvs = events.filter(e => e.d === day && e.startTime).sort((a, b) => {
    const [ah, am] = (a.startTime || '00:00').split(':').map(Number);
    const [bh, bm] = (b.startTime || '00:00').split(':').map(Number);
    return ah * 60 + am - (bh * 60 + bm);
  });
  const slots: { start: string; end: string }[] = [];
  let lastEnd = 9 * 60; // 09:00
  const dayEnd = 18 * 60; // 18:00
  for (const e of dayEvs) {
    const [sh, sm] = (e.startTime || '09:00').split(':').map(Number);
    const start = sh * 60 + sm;
    const [eh, em] = (e.endTime || '10:00').split(':').map(Number);
    const end = eh * 60 + em;
    if (start > lastEnd && start - lastEnd >= 30) {
      slots.push({
        start: `${String(Math.floor(lastEnd / 60)).padStart(2, '0')}:${String(lastEnd % 60).padStart(2, '0')}`,
        end: `${String(Math.floor(start / 60)).padStart(2, '0')}:${String(start % 60).padStart(2, '0')}`,
      });
    }
    lastEnd = Math.max(lastEnd, end);
  }
  if (dayEnd - lastEnd >= 30) {
    slots.push({
      start: `${String(Math.floor(lastEnd / 60)).padStart(2, '0')}:${String(lastEnd % 60).padStart(2, '0')}`,
      end: '18:00',
    });
  }
  return slots;
}

/** Аналитика календаря — сводка по слоям, партнёрам, просрочкам */
export function getCalendarAnalytics(events: CalendarEvent[], year: number, month: number) {
  const bySource = new Map<EventSource, number>();
  const byPartner = new Map<string, number>();
  let overdue = 0;
  const today = new Date();
  for (const e of events) {
    bySource.set(e.source, (bySource.get(e.source) ?? 0) + 1);
    if (e.partner) byPartner.set(e.partner, (byPartner.get(e.partner) ?? 0) + 1);
    const d = new Date(year, month, e.d);
    if (d < today) overdue++;
  }
  return {
    bySource: Object.fromEntries(bySource),
    byPartner: Object.fromEntries(byPartner),
    total: events.length,
    overdue,
  };
}

/** B2B заказы для связи с событиями (импорт из order-data) */
export const B2B_ORDER_IDS = ['B2B-0012', 'B2B-0011', 'B2B-0013', 'ORD-4521', 'ORD-4420'] as const;
