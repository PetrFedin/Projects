/**
 * Wave 8 P1 #6: единый агрегатор уведомлений Workshop2 для brand layout.
 */
import type { Workshop2DomainEventEnvelope } from '@/lib/production/workshop2-domain-event-types';
import { listWorkshop2BrandCalendarEventsForCollection } from '@/lib/server/workshop2-brand-calendar-repository';
import { listWorkshop2ContextualMessages } from '@/lib/server/workshop2-contextual-messages-repository';
import { listWorkshop2DomainEventsForArticle } from '@/lib/server/workshop2-domain-events';
import {
  WORKSHOP2_ARTICLE_CONTEXT_TYPE,
  workshop2ArticleContextId,
} from '@/lib/production/workshop2-domain-event-types';

export type Workshop2BrandNotificationItem = {
  id: string;
  kind: 'domain_event' | 'chat_unread' | 'calendar_overdue';
  titleRu: string;
  bodyRu: string;
  href?: string;
  createdAt: string;
  severity: 'info' | 'warning' | 'urgent';
};

export type Workshop2BrandNotificationsSummary = {
  totalCount: number;
  unreadChatCount: number;
  overdueCalendarCount: number;
  domainEventCount: number;
  items: Workshop2BrandNotificationItem[];
  generatedAt: string;
};

const DEFAULT_ARTICLES = [
  { collectionId: 'SS27', articleId: 'demo-ss27-01' },
  { collectionId: 'SS27', articleId: 'demo-ss27-02' },
];

function isCalendarEventOverdue(event: { endAt?: string; isBlocker?: boolean }): boolean {
  const end = event.endAt?.trim();
  if (!end) return false;
  const ts = Date.parse(end);
  return Number.isFinite(ts) && ts < Date.now();
}

export async function buildWorkshop2BrandNotificationsSummary(input?: {
  collectionId?: string;
  articles?: { collectionId: string; articleId: string }[];
  chatUnreadBaselineIso?: string;
  domainEventLimit?: number;
}): Promise<Workshop2BrandNotificationsSummary> {
  const collectionId = (input?.collectionId ?? 'SS27').trim();
  const articles = input?.articles?.length ? input.articles : DEFAULT_ARTICLES;
  const items: Workshop2BrandNotificationItem[] = [];
  let unreadChatCount = 0;
  let overdueCalendarCount = 0;
  let domainEventCount = 0;

  const baselineIso =
    input?.chatUnreadBaselineIso?.trim() ||
    new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString();

  for (const { collectionId: cid, articleId: aid } of articles) {
    const contextId = workshop2ArticleContextId(cid, aid);
    const messages = await listWorkshop2ContextualMessages({
      contextType: WORKSHOP2_ARTICLE_CONTEXT_TYPE,
      contextId,
      limit: 50,
    });
    const unread = messages.filter((m) => m.createdAt > baselineIso).length;
    unreadChatCount += unread;
    if (unread > 0) {
      items.push({
        id: `chat:${contextId}`,
        kind: 'chat_unread',
        titleRu: `Чат · ${aid}`,
        bodyRu: `${unread} непрочитанных сообщений`,
        href: `/brand/production/workshop2/c/${encodeURIComponent(cid)}/a/${encodeURIComponent(aid)}?w2pane=tz`,
        createdAt: messages[messages.length - 1]?.createdAt ?? new Date().toISOString(),
        severity: unread >= 5 ? 'warning' : 'info',
      });
    }

    const events = await listWorkshop2DomainEventsForArticle({
      collectionId: cid,
      articleId: aid,
      limit: input?.domainEventLimit ?? 8,
    });
    for (const ev of events as Workshop2DomainEventEnvelope[]) {
      domainEventCount += 1;
      const payloadHint =
        typeof ev.payload?.messageRu === 'string'
          ? ev.payload.messageRu
          : typeof ev.payload?.gateId === 'string'
            ? ev.payload.gateId
            : ev.type;
      items.push({
        id: `domain:${ev.id ?? `${cid}:${aid}:${ev.createdAt}`}`,
        kind: 'domain_event',
        titleRu: ev.type,
        bodyRu: payloadHint,
        href: `/brand/production/workshop2/c/${encodeURIComponent(cid)}/a/${encodeURIComponent(aid)}`,
        createdAt: ev.createdAt,
        severity: ev.type.includes('blocked') ? 'warning' : 'info',
      });
    }
  }

  const calEvents = await listWorkshop2BrandCalendarEventsForCollection({ collectionId });
  for (const ev of calEvents) {
    if (!isCalendarEventOverdue(ev)) continue;
    overdueCalendarCount += 1;
    items.push({
      id: `cal:${ev.id ?? ev.title}`,
      kind: 'calendar_overdue',
      titleRu: `Просрочено · ${ev.title}`,
      bodyRu: ev.articleId
        ? `Артикул ${ev.articleId} · до ${ev.endAt?.slice(0, 10) ?? ''}`
        : (ev.endAt?.slice(0, 10) ?? 'без даты'),
      href: ev.articleId
        ? `/brand/production/workshop2/c/${encodeURIComponent(collectionId)}/a/${encodeURIComponent(ev.articleId)}?w2pane=plan`
        : `/brand/calendar/collection/${encodeURIComponent(collectionId)}`,
      createdAt: ev.endAt ?? new Date().toISOString(),
      severity: 'warning',
    });
  }

  items.sort((a, b) => (a.createdAt < b.createdAt ? 1 : -1));

  return {
    totalCount: items.length,
    unreadChatCount,
    overdueCalendarCount,
    domainEventCount,
    items: items.slice(0, 40),
    generatedAt: new Date().toISOString(),
  };
}
