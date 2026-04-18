/**
 * JOOR Passport / шоурум на выставке: события, слоты встреч, заметки по байеру, привязка заказов к слоту/событию.
 * Без API — localStorage; структура под REST.
 */

export interface PassportEvent {
  id: string;
  name: string;
  /** FW26, SS26, etc. */
  seasonCode: string;
  startDate: string;
  endDate: string;
  type: 'trade_show' | 'showroom' | 'virtual';
  timezone?: string;
}

export interface PassportSlot {
  id: string;
  eventId: string;
  /** ISO datetime */
  startAt: string;
  endAt: string;
  /** Название слота для отображения */
  label: string;
  /** Зона/стенд (опционально) */
  zone?: string;
}

export interface PassportMeeting {
  id: string;
  slotId: string;
  eventId: string;
  /** Байер (ритейлер) */
  buyerId: string;
  buyerName: string;
  buyerCompany: string;
  /** Заметки бренда по байеру (видит только бренд) */
  brandNotes: string;
  /** Статус встречи */
  status: 'scheduled' | 'completed' | 'no_show' | 'cancelled';
  /** Привязанные заказы по этому слоту/встрече */
  orderIds: string[];
  createdAt: string;
  updatedAt: string;
}

export interface PassportState {
  events: PassportEvent[];
  slots: PassportSlot[];
  meetings: PassportMeeting[];
}

const STORAGE_KEY = 'joor_passport_v1';

function seed(): PassportState {
  const e1 = '2026-03-15';
  const e2 = '2026-03-20';
  return {
    events: [
      {
        id: 'ev-fw26',
        name: 'FW26 Виртуальная выставка',
        seasonCode: 'FW26',
        startDate: e1,
        endDate: e2,
        type: 'virtual',
      },
      {
        id: 'ev-sh-rus',
        name: 'Шоурум Москва FW26',
        seasonCode: 'FW26',
        startDate: '2026-04-01',
        endDate: '2026-04-05',
        type: 'showroom',
      },
    ],
    slots: [
      {
        id: 'slot-1',
        eventId: 'ev-fw26',
        startAt: `${e1}T10:00:00`,
        endAt: `${e1}T10:30:00`,
        label: '10:00–10:30',
        zone: 'A',
      },
      {
        id: 'slot-2',
        eventId: 'ev-fw26',
        startAt: `${e1}T10:30:00`,
        endAt: `${e1}T11:00:00`,
        label: '10:30–11:00',
        zone: 'A',
      },
      {
        id: 'slot-3',
        eventId: 'ev-fw26',
        startAt: `${e1}T11:00:00`,
        endAt: `${e1}T11:30:00`,
        label: '11:00–11:30',
        zone: 'A',
      },
    ],
    meetings: [
      {
        id: 'mt-1',
        slotId: 'slot-1',
        eventId: 'ev-fw26',
        buyerId: 'buyer-podium',
        buyerName: 'Анна К.',
        buyerCompany: 'Podium (Москва)',
        brandNotes: 'Интересует верхняя группа, бюджет до 2 млн. Повторная встреча.',
        status: 'completed',
        orderIds: ['B2B-0013'],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
      {
        id: 'mt-2',
        slotId: 'slot-2',
        eventId: 'ev-fw26',
        buyerId: 'buyer-tsum',
        buyerName: 'Михаил В.',
        buyerCompany: 'ЦУМ (Москва)',
        brandNotes: '',
        status: 'scheduled',
        orderIds: [],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
    ],
  };
}

export function loadPassportState(): PassportState {
  if (typeof window === 'undefined') return seed();
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      const s = seed();
      localStorage.setItem(STORAGE_KEY, JSON.stringify(s));
      return s;
    }
    return JSON.parse(raw) as PassportState;
  } catch {
    return seed();
  }
}

export function savePassportState(state: PassportState): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}

export function updateMeetingNotes(
  state: PassportState,
  meetingId: string,
  brandNotes: string
): PassportState {
  const next: PassportState = {
    ...state,
    meetings: state.meetings.map((m) =>
      m.id === meetingId ? { ...m, brandNotes, updatedAt: new Date().toISOString() } : m
    ),
  };
  savePassportState(next);
  return next;
}

export function linkOrderToMeeting(
  state: PassportState,
  meetingId: string,
  orderId: string
): PassportState {
  const meeting = state.meetings.find((m) => m.id === meetingId);
  if (!meeting || meeting.orderIds.includes(orderId)) return state;
  const next: PassportState = {
    ...state,
    meetings: state.meetings.map((m) =>
      m.id === meetingId
        ? { ...m, orderIds: [...m.orderIds, orderId], updatedAt: new Date().toISOString() }
        : m
    ),
  };
  savePassportState(next);
  return next;
}

export function getMeetingsByEvent(state: PassportState, eventId: string): PassportMeeting[] {
  return state.meetings.filter((m) => m.eventId === eventId);
}

export function getSlotsByEvent(state: PassportState, eventId: string): PassportSlot[] {
  return state.slots.filter((s) => s.eventId === eventId);
}
