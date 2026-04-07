import type { ShowroomAppointmentV1 } from './types';

/** Улучшенный планировщик шоурумов (Advanced B2B). */
export function getShowroomAppointments(): ShowroomAppointmentV1[] {
  return [
    {
      id: 'SH-2026-01',
      partnerName: 'Fashion Distribution RU',
      date: '2026-04-15',
      location: 'Moscow Showroom',
      selectedSkus: ['SKU-101', 'SKU-102'],
      status: 'scheduled',
      sampleStatus: 'ready',
      estimatedPreOrderValue: 4500000,
      partnerFeedback: { 'SKU-101': 'love', 'SKU-102': 'maybe' },
    },
    {
      id: 'SH-2026-02',
      partnerName: 'Asia Retail Group',
      date: '2026-04-20',
      location: 'Almaty Hub',
      selectedSkus: ['SKU-205', 'SKU-208', 'SKU-301'],
      status: 'review',
      sampleStatus: 'in_transit',
      estimatedPreOrderValue: 2100000,
    }
  ];
}
