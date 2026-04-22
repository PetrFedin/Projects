export type View = "month" | "week" | "agenda";
export type Layer = "production" | "buying" | "events" | "drops" | "content" | "logistics" | "orders" | "communications" | "market" | "spam" | "trends";
export type Visibility = "personal" | "internal" | "partial" | "public";
export type EventType = "event" | "task" | "livestream" | "delivery" | "call" | "podcast" | "reminder" | "appointment";
export type InvitationStatus = "pending" | "accepted" | "rejected";

import { UserRole } from "@/lib/types";

export interface Participant {
  uid: string;
  name: string;
  role: UserRole;
  status: InvitationStatus;
}

export interface CalendarEvent {
  id: string;
  ownerId: string;
  ownerRole: UserRole;
  ownerName: string;
  calendarId: string;
  /** scheduled — по умолчанию; cancelled — отменено, остаётся в истории */
  status?: 'scheduled' | 'cancelled';
  title: string;
  description?: string;
  layer: Layer;
  visibility: Visibility;
  type: EventType;
  startAt: string; // ISO
  endAt: string; // ISO
  /** Напоминание за N минут до начала (демо: подсказка в карточке) */
  reminderMinutesBefore?: number;
  isMystery?: boolean;
  isSpam?: boolean;
  isActuallySpam?: boolean;
  streamUrl?: string;
  callUrl?: string;
  isSubscribed?: boolean;
  tags?: string[];
  participants: Participant[];
  entityId?: string;
  entityName?: string;
  /** Метка скетча (досье), если событие создано из треда точки. */
  linkedPinId?: string;
  /** Ссылка на страницу досье со скетчем (для возврата из календаря). */
  sketchPageUrl?: string;
  tasks?: { id: string; text: string; completed: boolean }[];
  attachments?: { id: string; name: string; type: string; url: string }[];
  isCompleted?: boolean;
  importance?: 'low' | 'medium' | 'high' | 'critical';
  offers?: { title: string; desc: string }[];
  userReaction?: 'excited' | 'doubting' | 'rejected' | 'watching';
  targetChatId?: string;
}
