import type { ShowroomResourceV1 } from './types';

/** Управление ресурсами и загрузкой шоурума (Resource Capacity). */
export function getShowroomResourceAvailability(): ShowroomResourceV1[] {
  return [
    {
      resourceId: 'STYLIST-ELENA',
      type: 'stylist',
      name: 'Elena (Lead Stylist)',
      availabilityPercent: 45,
      nextAvailableSlot: '2026-04-01 14:00',
    },
    {
      resourceId: 'FITTING-ROOM-1',
      type: 'fitting_room',
      name: 'Vip Fitting Room (Center)',
      availabilityPercent: 10,
      nextAvailableSlot: '2026-04-01 16:30',
    },
    {
      resourceId: 'PRESENTATION-ZONE-A',
      type: 'presentation_zone',
      name: 'Main Presentation Hall',
      availabilityPercent: 100,
      nextAvailableSlot: '2026-04-01 09:00',
    }
  ];
}
