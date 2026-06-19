'use client';

import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { Bell, Calendar, MessageSquare } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { fetchPgContextualThreads } from '@/lib/brand/brand-pg-contextual-chat-client';
import type { PgContextualThreadsCabinet } from '@/lib/server/pg-contextual-message-threads-handler';
import { usePgContextualActorId } from '@/hooks/use-pg-contextual-actor-id';
import { usePlatformCoreCommsInboxPoll } from '@/hooks/use-platform-core-comms-inbox-poll';
import { buildPgUnreadCountByChat, pgThreadToChatId } from '@/lib/communications/pg-contextual-unread-metrics';
import { isPlatformCoreDemoPinOrderId } from '@/lib/platform-core-spine-active-order-fallback';
import { isPlatformCorePgB2bOrder } from '@/lib/platform-core-demo-order';
import { buildWorkshop2ApiRequestHeaders } from '@/lib/production/workshop2-api-client-headers';
import {
  brandCalendarB2bOrderContextHref,
  brandMessagesB2bOrderContextHref,
  factoryCalendarB2bOrderContextHref,
  factoryMessagesB2bOrderContextHref,
  factorySupplierCalendarB2bOrderContextHref,
  factorySupplierMessagesB2bOrderContextHref,
  shopCalendarB2bOrderContextHref,
  shopMessagesB2bOrderContextHref,
} from '@/lib/routes';
import { PlatformCoreShopCommsNotificationPrefsStrip } from '@/components/platform/PlatformCoreShopCommsNotificationPrefsStrip';

type CalendarPreviewEvent = {
  id: string;
  title: string;
  kind: string;
  startAt: string;
};

type Props = {
  variant: 'shop' | 'brand' | 'manufacturer' | 'supplier';
  collectionId: string;
  orderId: string;
  disabled?: boolean;
  /** Hub pillar card — компактная строка без рамки. */
  compact?: boolean;
  /** Order comms workspace — только треды b2b_order для orderId. */
  orderScoped?: boolean;
};

function cabinetForVariant(variant: Props['variant']): PgContextualThreadsCabinet {
  if (variant === 'shop') return 'shop';
  if (variant === 'brand') return 'brand';
  return 'factory';
}

function orderChatHref(variant: Props['variant'], orderId: string): string {
  if (variant === 'shop') return shopMessagesB2bOrderContextHref(orderId);
  if (variant === 'brand') return brandMessagesB2bOrderContextHref(orderId);
  if (variant === 'supplier') return factorySupplierMessagesB2bOrderContextHref(orderId);
  return factoryMessagesB2bOrderContextHref(orderId, { role: 'manufacturer' });
}

function threadLabel(contextType: string, contextId: string, preview?: string): string {
  if (contextType === 'b2b_order') {
    const id = contextId.trim();
    if (isPlatformCoreDemoPinOrderId(id)) return 'Оптовый заказ · demo';
    if (isPlatformCorePgB2bOrder(id)) return `Оптовый заказ · ${id.slice(-8)}`;
    return `B2B · ${id.slice(0, 24)}`;
  }
  return preview?.slice(0, 48) || contextId;
}

function calendarLinkHref(variant: Props['variant'], orderId: string): string {
  if (variant === 'shop') return shopCalendarB2bOrderContextHref(orderId);
  if (variant === 'brand') return brandCalendarB2bOrderContextHref(orderId);
  if (variant === 'supplier') return factorySupplierCalendarB2bOrderContextHref(orderId);
  return factoryCalendarB2bOrderContextHref(orderId);
}

/** Компактный notification center: unread threads + ближайшие события календаря. */
export function CommsNotificationCenterStrip({
  variant,
  collectionId,
  orderId,
  disabled = false,
  compact = false,
  orderScoped = false,
}: Props) {
  const cabinet = cabinetForVariant(variant);
  const readerId = usePgContextualActorId(cabinet);
  const { tick: inboxTick, sseConnected: inboxSseConnected } = usePlatformCoreCommsInboxPoll(
    !disabled && Boolean(orderId.trim())
  );
  const [unreadThreads, setUnreadThreads] = useState<
    Array<{ chatId: string; label: string; unread: number }>
  >([]);
  const [events, setEvents] = useState<CalendarPreviewEvent[]>([]);
  const [threadSource, setThreadSource] = useState<string>('empty');
  const [loaded, setLoaded] = useState(false);

  const testIdPrefix =
    variant === 'shop'
      ? 'shop-cm'
      : variant === 'brand'
        ? 'brand-cm'
        : variant === 'supplier'
          ? 'sup-cm'
          : 'mfr-cm';

  useEffect(() => {
    if (disabled || !orderId.trim()) {
      setUnreadThreads([]);
      setEvents([]);
      setLoaded(false);
      return;
    }
    let cancelled = false;
    setLoaded(false);
    void (async () => {
      try {
        const [threadsRes, calRes] = await Promise.all([
          fetchPgContextualThreads(cabinet, readerId),
          fetch(
            `/api/workshop2/platform-core/calendar-events?collectionId=${encodeURIComponent(collectionId)}&orderId=${encodeURIComponent(orderId)}`,
            { headers: buildWorkshop2ApiRequestHeaders(), cache: 'no-store' }
          ),
        ]);
        if (cancelled) return;
        setThreadSource(threadsRes.source);
        const scopedThreads = orderScoped
          ? threadsRes.threads.filter(
              (t) => t.contextType === 'b2b_order' && t.contextId.trim() === orderId.trim()
            )
          : threadsRes.threads;
        const unreadByChat = buildPgUnreadCountByChat(scopedThreads);
        const unreadList = scopedThreads
          .map((t) => {
            const chatId = pgThreadToChatId(t);
            return {
              chatId,
              label: threadLabel(
                t.contextType,
                t.contextId,
                t.lastMessagePreview ?? undefined
              ),
              unread: unreadByChat[chatId] ?? 0,
            };
          })
          .filter((t) => t.unread > 0)
          .slice(0, 3);
        setUnreadThreads(unreadList);

        if (calRes.ok) {
          const calJson = (await calRes.json()) as {
            events?: CalendarPreviewEvent[];
          };
          const sorted = (calJson.events ?? [])
            .slice()
            .sort((a, b) => a.startAt.localeCompare(b.startAt))
            .slice(0, 3);
          setEvents(sorted);
        } else {
          setEvents([]);
        }
      } catch {
        if (!cancelled) {
          setUnreadThreads([]);
          setEvents([]);
        }
      } finally {
        if (!cancelled) setLoaded(true);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [cabinet, collectionId, disabled, inboxTick, orderId, orderScoped, readerId]);

  const totalUnread = useMemo(
    () => unreadThreads.reduce((sum, t) => sum + t.unread, 0),
    [unreadThreads]
  );

  if (disabled || !orderId.trim()) return null;

  if (compact) {
    return (
      <div
        className="flex flex-wrap items-center gap-2"
        data-testid={`${testIdPrefix}-notification-center-compact`}
      >
        <Bell className="text-text-muted h-3 w-3" aria-hidden />
        {!loaded ? (
          <span className="text-text-muted text-[10px]">Уведомления…</span>
        ) : totalUnread > 0 ? (
          <Link
            href={orderChatHref(variant, orderId)}
            className="text-accent-primary text-[10px] font-medium hover:underline"
            data-testid={`${testIdPrefix}-notification-center`}
          >
            Непрочитанных: {totalUnread}
          </Link>
        ) : (
          <span
            className="text-text-muted text-[10px]"
            data-testid={`${testIdPrefix}-notification-center`}
          >
            Нет непрочитанных
          </span>
        )}
        {events.length > 0 ? (
          <Link
            href={calendarLinkHref(variant, orderId)}
            className="text-text-muted text-[10px] hover:underline"
            data-testid={`${testIdPrefix}-notification-events-compact`}
          >
            Календарь · {events.length}
          </Link>
        ) : null}
        {variant === 'shop' ? <PlatformCoreShopCommsNotificationPrefsStrip compact /> : null}
      </div>
    );
  }

  return (
    <div
      className="border-border-subtle space-y-2 rounded-lg border bg-slate-50/80 p-2.5"
      data-testid={`${testIdPrefix}-notification-center`}
    >
      <div className="flex flex-wrap items-center gap-2">
        <Bell className="text-text-muted h-3.5 w-3.5" aria-hidden />
        <p className="text-text-secondary text-[10px] font-semibold uppercase tracking-wide">
          Уведомления
        </p>
        <Badge
          variant="outline"
          className="text-[8px] uppercase"
          data-testid={`${testIdPrefix}-inbox-source-${threadSource === 'postgres' ? 'pg' : 'local'}`}
        >
          {threadSource === 'postgres' ? 'PG inbox' : threadSource}
        </Badge>
        <Badge
          variant="outline"
          className="text-[8px] uppercase"
          data-testid={`${testIdPrefix}-inbox-sse-${inboxSseConnected ? 'live' : 'poll'}`}
        >
          {inboxSseConnected ? 'SSE live' : 'SSE poll'}
        </Badge>
        {totalUnread > 0 ? (
          <span
            className="inline-flex h-4 min-w-4 items-center justify-center rounded-full bg-accent-primary px-1 text-[8px] font-black text-white"
            data-testid={`${testIdPrefix}-notification-unread-count`}
          >
            {totalUnread}
          </span>
        ) : null}
        {!loaded ? (
          <span className="text-text-muted text-[10px]">Загрузка…</span>
        ) : null}
      </div>

      {unreadThreads.length > 0 ? (
        <ul className="space-y-1" data-testid={`${testIdPrefix}-notification-unread-list`}>
          {unreadThreads.map((row) => (
            <li key={row.chatId}>
              <Link
                href={orderChatHref(variant, orderId)}
                className="text-accent-primary inline-flex items-center gap-1 text-[10px] font-medium hover:underline"
                data-testid={`${testIdPrefix}-notification-thread-${row.chatId}`}
              >
                <MessageSquare className="h-3 w-3" aria-hidden />
                {row.label}
                <span className="font-mono tabular-nums">· {row.unread}</span>
              </Link>
            </li>
          ))}
        </ul>
      ) : loaded ? (
        <p className="text-text-muted text-[10px]" data-testid={`${testIdPrefix}-notification-empty`}>
          Нет непрочитанных тредов по заказу.
        </p>
      ) : null}

      {events.length > 0 ? (
        <ul className="space-y-1 border-t border-slate-200/80 pt-2" data-testid={`${testIdPrefix}-notification-events-list`}>
          {events.map((ev) => (
            <li key={ev.id}>
              <Link
                href={calendarLinkHref(variant, orderId)}
                className="text-text-secondary inline-flex items-center gap-1 text-[10px] hover:underline"
                data-testid={`${testIdPrefix}-notification-event-${ev.id}`}
              >
                <Calendar className="h-3 w-3 shrink-0" aria-hidden />
                <span className="line-clamp-1">{ev.title}</span>
              </Link>
            </li>
          ))}
        </ul>
      ) : null}
      {variant === 'shop' ? <PlatformCoreShopCommsNotificationPrefsStrip /> : null}
    </div>
  );
}
