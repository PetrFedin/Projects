'use client';

import Link from 'next/link';
import { Calendar, ClipboardList, MessageSquare } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import {
  ROUTES,
  brandCalendarB2bOrderContextHref,
  brandMessagesB2bOrderContextHref,
  brandMessagesWorkshop2ArticleContextHref,
  factoryCalendarB2bOrderContextHref,
  factoryMessagesB2bOrderContextHref,
  factoryMessagesRoleHref,
  factoryMessagesWorkshop2ArticleContextHref,
  factorySupplierCalendarB2bOrderContextHref,
  factorySupplierMessagesB2bOrderContextHref,
  factorySupplierMessagesWorkshop2ArticleContextHref,
  shopCalendarB2bOrderContextHref,
  shopMessagesB2bOrderContextHref,
  shopMessagesWorkshop2ArticleContextHref,
} from '@/lib/routes';
import {
  factoryHandoffQueueHrefForDemo,
  getPlatformCoreDemo,
  isPlatformCoreEmptyChainCollection,
} from '@/lib/platform-core-hub-matrix';
import { resolvePlatformCoreCabinetOrderId } from '@/lib/platform-core-spine-active-order-fallback';
import { useShopCoreBuyerId } from '@/hooks/use-shop-core-buyer-id';
import { usePlatformCoreDemoContext } from '@/components/platform/usePlatformCoreChainOverview';
import { usePgCommunicationsUnread } from '@/lib/communications/use-pg-communications-unread';
import { usePgContextualActorId } from '@/hooks/use-pg-contextual-actor-id';
import type { PgContextualThreadsCabinet } from '@/lib/server/pg-contextual-message-threads-handler';
import { CommsPillarThreadStrip } from '@/components/platform/CommsPillarThreadStrip';
import { CommsSectionGroupsPicker } from '@/components/platform/CommsSectionGroupsPicker';
import { CommsSectionContextAutoThread } from '@/components/platform/CommsSectionContextAutoThread';
import { CommsNotificationCenterStrip } from '@/components/platform/CommsNotificationCenterStrip';
import { SupplierMaterialQuoteCard } from '@/components/platform/SupplierMaterialQuoteCard';
import { useSpineActiveWholesaleOrderId } from '@/hooks/use-spine-active-wholesale-order-id';
import { usePillarSnapshot } from '@/hooks/use-pillar-snapshot';
import {
  formatWholesaleOrderDisplayId,
  isIntegrationImportedWholesaleOrderId,
  wholesaleOrderKindLabelRu,
} from '@/lib/integrations/spine/integration-ui-utils';

/**
 * Comms pillar card — единая точка чата/календаря/групп (канон: platform-core-comms-canon.ts).
 * Deep-link из других столпов — context strip only, не дублирующие разделы.
 */
type Props = {
  variant: 'brand' | 'shop' | 'manufacturer' | 'supplier';
  /** @deprecated Hub всегда compact; prop сохранён для совместимости API. */
  compact?: boolean;
};

const linkClass =
  'border-border-subtle hover:bg-bg-surface2 inline-flex items-center gap-1 rounded-md border px-2 py-1 text-[10px] font-medium';

export function CommsPillarCard({ variant }: Props) {
  const demo = usePlatformCoreDemoContext();
  const { demoOrderId: fallbackOrderId, collectionId, demoArticleId, factoryId } = demo;
  const w2Fallback = fallbackOrderId.startsWith('__') ? '' : fallbackOrderId;
  const { buyerId } = useShopCoreBuyerId();
  const emptyChain = isPlatformCoreEmptyChainCollection(collectionId);
  const spineResolveFrom =
    variant === 'shop'
      ? (['w2_registry', 'allocation', 'operational'] as const)
      : variant === 'brand'
        ? (['w2_registry', 'handoff', 'allocation', 'operational'] as const)
        : (['w2_registry', 'handoff', 'allocation'] as const);
  const { activeOrderId: orderId } = useSpineActiveWholesaleOrderId({
    fallbackOrderId: w2Fallback,
    collectionId,
    resolveFrom: spineResolveFrom,
    actorRole: variant === 'shop' ? 'shop' : variant === 'brand' ? 'brand' : undefined,
    factoryId: variant === 'manufacturer' || variant === 'supplier' ? factoryId : undefined,
    buyerId: variant === 'shop' ? buyerId : undefined,
    enabled: !emptyChain,
  });
  const canonicalDemoOrderId = getPlatformCoreDemo(collectionId).demoOrderId;
  const cabinetOrderId = resolvePlatformCoreCabinetOrderId(orderId, canonicalDemoOrderId);
  const isFactory = variant === 'manufacturer' || variant === 'supplier';
  const pgCabinet: PgContextualThreadsCabinet =
    variant === 'shop' ? 'shop' : variant === 'brand' ? 'brand' : 'factory';
  const { totalUnread: pgUnreadTotal, sseConnected: commsSseLive, unreadByChat, threads } =
    usePgCommunicationsUnread(pgCabinet, !emptyChain);
  const readerId = usePgContextualActorId(pgCabinet);

  const { snapshot } = usePillarSnapshot({
    collectionId,
    pillarId: 'comms',
    roleId: variant,
    wholesaleOrderId: orderId || undefined,
    factoryId: isFactory ? factoryId : undefined,
    enabled: !emptyChain,
  });
  const comms = snapshot?.pillarId === 'comms' ? snapshot.comms : null;
  const threadCount = emptyChain ? 0 : (comms?.commsThreadCount ?? null);
  const calendarEventCount = emptyChain ? 0 : (comms?.calendarEventCount ?? null);
  const deliveryWindowCount = comms?.deliveryWindowCount ?? 0;

  const messagesHref = (() => {
    if (variant === 'shop') return shopMessagesB2bOrderContextHref(cabinetOrderId);
    if (variant === 'brand') return brandMessagesB2bOrderContextHref(cabinetOrderId);
    if (variant === 'supplier') return factorySupplierMessagesB2bOrderContextHref(cabinetOrderId);
    return factoryMessagesB2bOrderContextHref(cabinetOrderId, { role: 'manufacturer' });
  })();
  const calendarHref = (() => {
    if (variant === 'shop') return shopCalendarB2bOrderContextHref(cabinetOrderId);
    if (variant === 'brand') return brandCalendarB2bOrderContextHref(cabinetOrderId);
    if (variant === 'supplier') return factorySupplierCalendarB2bOrderContextHref(cabinetOrderId);
    return factoryCalendarB2bOrderContextHref(cabinetOrderId);
  })();
  const poHref = factoryHandoffQueueHrefForDemo({ ...demo, demoOrderId: cabinetOrderId });
  const inboxAllHref =
    variant === 'shop'
      ? ROUTES.shop.messages
      : variant === 'brand'
        ? ROUTES.brand.messages
        : factoryMessagesRoleHref(variant === 'supplier' ? 'supplier' : 'manufacturer');
  const articleChatHref = (() => {
    if (variant === 'brand') {
      return brandMessagesWorkshop2ArticleContextHref(collectionId, demoArticleId);
    }
    if (variant === 'shop') {
      return shopMessagesWorkshop2ArticleContextHref(collectionId, demoArticleId);
    }
    if (variant === 'supplier') {
      return factorySupplierMessagesWorkshop2ArticleContextHref(collectionId, demoArticleId);
    }
    return factoryMessagesWorkshop2ArticleContextHref(collectionId, demoArticleId, {
      role: 'manufacturer',
    });
  })();

  const unreadSuffix = pgUnreadTotal > 0 ? ` · ${pgUnreadTotal} непрочит.` : '';
  const spineActive = isIntegrationImportedWholesaleOrderId(orderId);
  const statusLine = emptyChain
    ? 'Пустая цепочка — нет тредов и событий.'
    : threadCount != null
      ? threadCount > 0
        ? `${threadCount} сообщ. · ${calendarEventCount ?? 0} событий календаря${
            deliveryWindowCount > 0 ? ` · ${deliveryWindowCount} окон поставки` : ''
          }${unreadSuffix}`
        : `Тред и календарь по заказу цепочки${
            deliveryWindowCount > 0 ? ` · ${deliveryWindowCount} окон поставки` : ''
          }${unreadSuffix}`
      : `Чат и календарь по заказу цепочки${unreadSuffix}`;

  const unreadBadge =
    pgUnreadTotal > 0 ? (
      <span
        data-testid="comms-pillar-unread-badge"
        className="ml-1 inline-flex h-[16px] min-w-[16px] items-center justify-center rounded-full bg-accent-primary px-1 text-[8px] font-black text-white"
      >
        {pgUnreadTotal}
      </span>
    ) : null;

  const orderChatTestId =
    variant === 'brand'
      ? 'brand-cm-order-chat-link'
      : variant === 'shop'
        ? 'shop-cm-order-chat-link'
        : variant === 'supplier'
          ? 'sup-cm-order-chat-link'
          : 'mfr-cm-order-chat-link';
  const articleChatTestId =
    variant === 'brand'
      ? 'brand-cm-article-chat-link'
      : variant === 'shop'
        ? 'shop-cm-article-chat-link'
        : variant === 'supplier'
          ? 'sup-cm-article-chat-link'
          : 'mfr-cm-article-chat-link';
  const calendarTestId =
    variant === 'brand'
      ? 'brand-cm-calendar-link'
      : variant === 'shop'
        ? 'shop-cm-calendar-link'
        : variant === 'supplier'
          ? 'sup-cm-calendar-link'
          : 'mfr-cm-calendar-link';

  return (
    <Card data-testid="comms-pillar-card" className="border-sky-200/50">
      <CardContent className="space-y-2 p-3 text-xs">
        <div className="flex flex-wrap items-center gap-2">
          <p className="text-text-secondary">{statusLine}</p>
          {spineActive ? (
            <Badge variant="outline" className="text-[9px] font-mono">
              {wholesaleOrderKindLabelRu(orderId)} · {formatWholesaleOrderDisplayId(orderId)}
            </Badge>
          ) : null}
          {spineActive && deliveryWindowCount > 0 ? (
            <Badge
              variant="outline"
              className="border-sky-200 bg-sky-50 text-[9px] text-sky-900"
              data-testid="comms-pillar-delivery-window-badge"
            >
              Окна поставки · {deliveryWindowCount}
            </Badge>
          ) : null}
          {commsSseLive ? (
            <Badge
              variant="outline"
              className="border-emerald-200 bg-emerald-50 text-[9px] text-emerald-900"
              data-testid="comms-pillar-sse-live-badge"
            >
              SSE live
            </Badge>
          ) : null}
        </div>
        <CommsPillarThreadStrip
          variant={variant}
          collectionId={collectionId}
          orderId={cabinetOrderId}
          disabled={emptyChain}
        />
        <CommsSectionGroupsPicker
          variant={variant}
          collectionId={collectionId}
          orderId={orderId}
          disabled={emptyChain}
          unreadByChat={unreadByChat}
          threads={threads}
          readerId={readerId}
        />
        <CommsSectionContextAutoThread
          orderId={orderId}
          disabled={emptyChain || !orderId}
          readerId={readerId}
        />
        {!emptyChain && orderId ? (
          <CommsNotificationCenterStrip
            variant={variant}
            collectionId={collectionId}
            orderId={orderId}
          />
        ) : null}
        {variant === 'supplier' && !emptyChain && orderId ? (
          <SupplierMaterialQuoteCard orderId={orderId} />
        ) : null}
        <div className="flex flex-wrap gap-1.5">
          <Link href={messagesHref} className={linkClass} data-testid={orderChatTestId}>
            <MessageSquare className="h-3 w-3" aria-hidden />
            Чат
          </Link>
          <Link
            href={calendarHref}
            className={linkClass}
            data-testid={calendarTestId}
            data-audit-legacy="comms-pillar-calendar"
          >
            <Calendar className="h-3 w-3" aria-hidden />
            Календарь
            {calendarEventCount != null && calendarEventCount > 0 ? (
              <span
                className="ml-0.5 font-mono tabular-nums text-[9px] opacity-80"
                data-testid={`${calendarTestId.replace('-link', '')}-events-count`}
              >
                ·{calendarEventCount}
              </span>
            ) : null}
          </Link>
          {!emptyChain ? (
            <Link
              href={articleChatHref}
              data-testid={articleChatTestId}
              data-audit-legacy="comms-pillar-article-chat-compact"
              className={linkClass}
            >
              <MessageSquare className="h-3 w-3" aria-hidden />
              Чат · артикул
            </Link>
          ) : null}
          {variant === 'manufacturer' ? (
            <Link
              href={factorySupplierMessagesB2bOrderContextHref(orderId)}
              data-testid="comms-pillar-supplier-thread-compact"
              className={linkClass}
            >
              Поставщик
            </Link>
          ) : null}
          {isFactory ? (
            <Link
              href={poHref}
              data-testid="comms-pillar-handoff-queue-compact"
              className={linkClass}
            >
              <ClipboardList className="h-3 w-3" aria-hidden />
              Очередь передачи
            </Link>
          ) : null}
          <Link href={inboxAllHref} data-testid="comms-pillar-inbox-all" className={linkClass}>
            Все треды
            {unreadBadge}
          </Link>
        </div>
      </CardContent>
    </Card>
  );
}
