/**
 * Trade Show Appointments — запись на визиты и встречи на выставке.
 */

export type AppointmentStatus = 'pending' | 'confirmed' | 'completed' | 'cancelled';

export interface TradeShowAppointment {
  id: string;
  tradeShowId: string;
  tradeShowName?: string;
  partnerId: string;
  partnerName: string;
  slotStart: string; // ISO datetime
  slotEnd: string;
  status: AppointmentStatus;
  notes?: string;
  createdAt: string;
}

const STORAGE_KEY = 'b2b_trade_show_appointments_v1';

function load(): TradeShowAppointment[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function save(items: TradeShowAppointment[]) {
  if (typeof window === 'undefined') return;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
}

export function getAppointments(tradeShowId?: string): TradeShowAppointment[] {
  const all = load();
  return tradeShowId ? all.filter((a) => a.tradeShowId === tradeShowId) : all;
}

export function createAppointment(data: Omit<TradeShowAppointment, 'id' | 'createdAt'>): TradeShowAppointment {
  const item: TradeShowAppointment = {
    ...data,
    id: `apt-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
    createdAt: new Date().toISOString(),
  };
  const all = load();
  all.push(item);
  save(all);
  return item;
}
