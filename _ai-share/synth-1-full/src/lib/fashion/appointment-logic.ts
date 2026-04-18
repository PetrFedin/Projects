import type { ShowroomAppointmentV1 } from './types';

export type { ShowroomAppointmentV1 };

const STORAGE_KEY = 'synth.showroomAppointments.v1';

export function loadAppointments(): ShowroomAppointmentV1[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw
      ? JSON.parse(raw)
      : [
          {
            id: 'apt-1',
            partnerName: 'Nordic Retail Group',
            date: '2026-04-15',
            time: '10:00',
            type: 'physical',
            status: 'confirmed',
          },
          {
            id: 'apt-2',
            partnerName: 'Milan Fashion House',
            date: '2026-04-16',
            time: '14:30',
            type: 'virtual',
            status: 'pending',
          },
        ];
  } catch {
    return [];
  }
}

export function saveAppointments(list: ShowroomAppointmentV1[]) {
  if (typeof window === 'undefined') return;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
}
