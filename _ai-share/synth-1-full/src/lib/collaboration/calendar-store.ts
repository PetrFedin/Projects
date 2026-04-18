/**
 * Хранилище событий календаря с участниками.
 * Persisted в localStorage — при переключении ролей/устройств каждый участник видит свои события и приглашения.
 */
import type { CalendarEvent, Participant, InvitationStatus } from '@/lib/types/calendar';
import type { UserRole } from '@/lib/types';

const STORAGE_KEY = 'syntha_collab_calendar_v1';

function storageKey(userId: string) {
  return `${STORAGE_KEY}_${userId}`;
}

function loadEvents(userId: string): CalendarEvent[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(storageKey(userId));
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function saveEvents(userId: string, events: CalendarEvent[]) {
  if (typeof window === 'undefined') return;
  localStorage.setItem(storageKey(userId), JSON.stringify(events));
}

/** События, где текущий пользователь — участник (для показа на его календаре) */
function loadEventsWhereParticipant(userId: string): CalendarEvent[] {
  if (typeof window === 'undefined') return [];
  const allKeys = Object.keys(localStorage).filter((k) => k.startsWith(STORAGE_KEY + '_'));
  const result: CalendarEvent[] = [];
  for (const key of allKeys) {
    try {
      const raw = localStorage.getItem(key);
      if (!raw) continue;
      const events: CalendarEvent[] = JSON.parse(raw);
      for (const e of events) {
        const isParticipant = e.participants?.some((p) => p.uid === userId);
        if (isParticipant && !result.some((r) => r.id === e.id)) {
          result.push(e);
        }
      }
    } catch {
      /* skip */
    }
  }
  return result;
}

/** Получить все события для пользователя: свои + где он участник */
export function getCalendarEvents(userId: string): CalendarEvent[] {
  const own = loadEvents(userId);
  const invited = loadEventsWhereParticipant(userId).filter((e) => !own.some((o) => o.id === e.id));
  return [...own, ...invited];
}

/** Сохранить событие (create/update) */
export function saveCalendarEvent(userId: string, event: CalendarEvent) {
  const events = loadEvents(userId).filter((e) => e.id !== event.id);
  events.push(event);
  saveEvents(userId, events);
}

/** Удалить событие */
export function deleteCalendarEvent(userId: string, eventId: string) {
  const events = loadEvents(userId).filter((e) => e.id !== eventId);
  saveEvents(userId, events);
}

/** Обновить статус приглашения участника (accept/reject) */
export function updateParticipantStatus(
  ownerId: string,
  eventId: string,
  participantId: string,
  status: InvitationStatus
): boolean {
  const events = loadEvents(ownerId);
  const ev = events.find((e) => e.id === eventId);
  if (!ev || !ev.participants) return false;
  const p = ev.participants.find((x) => x.uid === participantId);
  if (!p) return false;
  p.status = status;
  saveEvents(ownerId, events);
  return true;
}

/** Ответить на приглашение (принять/отклонить) — вызывается участником */
export function respondToInvitation(
  eventId: string,
  participantId: string,
  status: 'accepted' | 'rejected'
): boolean {
  const ownerId = findEventOwner(eventId);
  if (!ownerId) return false;
  return updateParticipantStatus(ownerId, eventId, participantId, status);
}

/** Найти владельца события по ID (для обновления статуса при accept/reject) */
export function findEventOwner(eventId: string): string | null {
  if (typeof window === 'undefined') return null;
  const allKeys = Object.keys(localStorage).filter((k) => k.startsWith(STORAGE_KEY + '_'));
  for (const key of allKeys) {
    try {
      const raw = localStorage.getItem(key);
      if (!raw) continue;
      const events: CalendarEvent[] = JSON.parse(raw);
      if (events.some((e) => e.id === eventId)) {
        return key.replace(STORAGE_KEY + '_', '');
      }
    } catch {
      /* skip */
    }
  }
  return null;
}
