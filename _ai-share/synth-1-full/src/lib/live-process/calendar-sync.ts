/**
 * Синхронизация дат LIVE process ↔ календарь.
 * При указании plannedStartAt/plannedEndAt создаётся/обновляется событие.
 * Двусторонняя: изменение в календаре обновляет runtime.
 */

const STORAGE_KEY = 'live_process_calendar_events_v1';

export interface CalendarEvent {
  id: string;
  processId: string;
  contextId: string;
  stageId: string;
  title: string;
  startAt: string;
  endAt: string;
}

function loadEvents(): CalendarEvent[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as CalendarEvent[]) : [];
  } catch {
    return [];
  }
}

function saveEvents(events: CalendarEvent[]) {
  if (typeof window === 'undefined') return;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(events));
}

function eventKey(processId: string, contextId: string, stageId: string): string {
  return `${processId}__${contextId}__${stageId}`;
}

/** Создать/обновить событие при изменении plannedStartAt/plannedEndAt */
export function syncDatesToCalendar(
  processId: string,
  contextId: string,
  stageId: string,
  stageTitle: string,
  plannedStartAt: string | null,
  plannedEndAt: string | null
): string | null {
  const events = loadEvents();
  const key = eventKey(processId, contextId, stageId);

  if (!plannedStartAt || !plannedEndAt) {
    const filtered = events.filter((e) => eventKey(e.processId, e.contextId, e.stageId) !== key);
    saveEvents(filtered);
    return null;
  }

  const existing = events.find((e) => eventKey(e.processId, e.contextId, e.stageId) === key);
  const event: CalendarEvent = existing
    ? { ...existing, title: stageTitle, startAt: plannedStartAt, endAt: plannedEndAt }
    : {
        id: `cal-${Date.now()}-${stageId}`,
        processId,
        contextId,
        stageId,
        title: stageTitle,
        startAt: plannedStartAt,
        endAt: plannedEndAt,
      };

  const rest = events.filter((e) => eventKey(e.processId, e.contextId, e.stageId) !== key);
  saveEvents([...rest, event]);
  return event.id;
}

/** Двусторонняя синхронизация: дата изменена в календаре → обновить runtime */
export function onCalendarDateChange(
  eventId: string,
  startAt: string,
  endAt: string,
  onRuntimeUpdate: (stageId: string, plannedStartAt: string, plannedEndAt: string) => void
) {
  const events = loadEvents();
  const ev = events.find((e) => e.id === eventId);
  if (ev) {
    onRuntimeUpdate(ev.stageId, startAt, endAt);
    ev.startAt = startAt;
    ev.endAt = endAt;
    saveEvents(events);
  }
}

/** Получить все события для процесса (Gantt/timeline) */
export function getEventsForProcess(processId: string, contextId?: string): CalendarEvent[] {
  const events = loadEvents();
  return events.filter(
    (e) => e.processId === processId && (!contextId || e.contextId === contextId)
  );
}

/** Получить все события (все процессы) */
export function getAllCalendarEvents(): CalendarEvent[] {
  return loadEvents();
}
