import type { Workshop2B2bCalendarEvent } from '@/lib/production/workshop2-b2b-campaign-hub';
import type { CalendarEvent } from '@/lib/types/calendar';
import type { UserRole } from '@/lib/types';
import { resolvePlatformCoreCalendarThreadChatId } from '@/lib/platform-core-calendar-thread-link';

const KIND_LABEL_RU: Record<Workshop2B2bCalendarEvent['kind'], string> = {
  delivery_window: 'Окно поставки',
  market_date: 'Маркетинговая дата',
  preorder_window: 'Окно предзаказа',
};

export function mapPlatformCoreB2bEventToCalendar(
  e: Workshop2B2bCalendarEvent,
  ownerRole: UserRole = 'shop'
): CalendarEvent {
  const layer =
    e.kind === 'delivery_window' ? 'logistics' : e.kind === 'market_date' ? 'events' : 'orders';
  const targetChatId = resolvePlatformCoreCalendarThreadChatId(e);
  const descParts = [KIND_LABEL_RU[e.kind]];
  if (e.b2bOrderId?.trim()) descParts.push(`заказ ${e.b2bOrderId.trim()}`);
  else if (e.articleId?.trim()) descParts.push(`артикул ${e.articleId.trim()}`);
  return {
    id: e.id,
    ownerId: 'workshop2',
    ownerRole,
    ownerName: 'Оптовые заказы (B2B)',
    calendarId: 'workshop2-b2b',
    title: e.title,
    description: descParts.join(' · '),
    layer,
    visibility: 'internal',
    type: e.kind === 'delivery_window' ? 'delivery' : 'event',
    startAt: e.startAt,
    endAt: e.endAt,
    participants: [],
    importance: 'medium',
    targetChatId,
  };
}
