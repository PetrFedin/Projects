/**
 * Video Consultation — типы для MVP.
 * При API: заменить моки на GET/POST эндпоинты (эксперты, слоты, создание брони).
 */

export type ConsultationStatus = 'scheduled' | 'completed' | 'cancelled';

export interface VideoExpert {
  id: string;
  name: string;
  role: string;
  rating: number;
  /** При API: URL аватара */
  avatarUrl?: string;
}

export interface ConsultationSlot {
  id: string;
  expertId: string;
  start: string; // ISO
  end: string;
  available: boolean;
}

export interface ConsultationBooking {
  id: string;
  expertId: string;
  slotId: string;
  start: string;
  end: string;
  status: ConsultationStatus;
  /** При API: ссылка Zoom/Teams */
  meetingUrl?: string;
}

export const VIDEO_CONSULTATION_API = {
  listExperts: '/api/v1/video-consultation/experts',
  listSlots: '/api/v1/video-consultation/slots',
  book: '/api/v1/video-consultation/book',
  myBookings: '/api/v1/video-consultation/bookings',
} as const;
