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
import { BrandCmCabinetSpinePeerStrip } from '@/components/platform/BrandCmCabinetSpinePeerStrip';
import { ShopCmCabinetSpinePeerStrip } from '@/components/platform/ShopCmCabinetSpinePeerStrip';
import { SupplierMaterialQuoteCard } from '@/components/platform/SupplierMaterialQuoteCard';
import { SupplierCommsBrandPushStrip } from '@/components/factory/supplier/SupplierCommsBrandPushStrip';
import { SupplierCommsCrmPeerStrip } from '@/components/factory/supplier/SupplierCommsCrmPeerStrip';
import { SupCmCabinetSpinePeerStrip } from '@/components/factory/supplier/SupCmCabinetSpinePeerStrip';
import { SupplierArticleDevQuoteHonestStrip } from '@/components/factory/supplier/SupplierArticleDevQuoteHonestStrip';
import { ManufacturerUnifiedPoInboxStrip } from '@/components/factory/ManufacturerUnifiedPoInboxStrip';
import { ManufacturerArticleAttachTzPeerStrip } from '@/components/factory/ManufacturerArticleAttachTzPeerStrip';
import { PlatformCoreRegistryStreamHealthStrip } from '@/components/platform/PlatformCoreRegistryStreamHealthStrip';
import { useSpineActiveWholesaleOrderId } from '@/hooks/use-spine-active-wholesale-order-id';
import { usePillarSnapshot } from '@/hooks/use-pillar-snapshot';
import { pickCommsSnapshot } from '@/lib/platform-core-pillar-snapshot.types';
import {
  formatWholesaleOrderDisplayId,
  isIntegrationImportedWholesaleOrderId,
  wholesaleOrderKindLabelRu,
} from '@/lib/integrations/spine/integration-ui-utils';
import { hubGadget } from '@/components/platform/platform-core-hub-gadget-styles';
import { PillarInsightHeader } from '@/components/platform/PillarInsightPrimitives';
import { PlatformCorePillarInsightSkeleton } from '@/components/platform/PlatformCorePillarInsightSkeleton';
import { cn } from '@/lib/utils';

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

export function CommsPillarCard({ variant, compact = false }: Props) {
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
  const {
    totalUnread: pgUnreadTotal,
    sseConnected: commsSseLive,
    unreadByChat,
    threads,
  } = usePgCommunicationsUnread(pgCabinet, !emptyChain);
  const readerId = usePgContextualActorId(pgCabinet);

  const { snapshot, loading: snapshotLoading } = usePillarSnapshot({
    collectionId,
    pillarId: 'comms',
    roleId: variant,
    wholesaleOrderId: orderId || undefined,
    factoryId: isFactory ? factoryId : undefined,
    enabled: !emptyChain,
  });
  const comms = pickCommsSnapshot(snapshot);
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
    ? 'Нет тредов.'
    : compact
      ? null
      : threadCount != null
        ? `${threadCount} тредов · ${calendarEventCount ?? 0} календарь${unreadSuffix}`
        : `Чат · календарь${unreadSuffix}`;

  const unreadBadge =
    pgUnreadTotal > 0 ? (
      <span
        data-testid="comms-pillar-unread-badge"
        className="bg-accent-primary ml-1 inline-flex h-[16px] min-w-[16px] items-center justify-center rounded-full px-1 text-[8px] font-black text-white"
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

  if (compact && snapshotLoading && !comms && !emptyChain) {
    return (
      <PlatformCorePillarInsightSkeleton testId={`${variant}-comms-pillar-insight-skeleton`} />
    );
  }

  return (
    <Card
      data-testid="comms-pillar-card"
      className={cn(compact ? hubGadget.pillarCard : 'border-sky-200/50')}
    >
      <CardContent className={cn(compact ? hubGadget.pillarBody : 'space-y-2 p-3 text-xs')}>
        {compact ? (
          <PillarInsightHeader
            icon={MessageSquare}
            title="Связь"
            subtitle="Чат, календарь и треды по заказу."
          />
        ) : null}
        {statusLine ? (
          <p className={compact ? hubGadget.muted : 'text-text-secondary'}>{statusLine}</p>
        ) : null}
        {!compact && spineActive ? (
          <Badge variant="outline" className="font-mono text-[9px]">
            {wholesaleOrderKindLabelRu(orderId)} · {formatWholesaleOrderDisplayId(orderId)}
          </Badge>
        ) : null}
        {!compact && spineActive && deliveryWindowCount > 0 ? (
          <Badge
            variant="outline"
            className="border-sky-200 bg-sky-50 text-[9px] text-sky-900"
            data-testid="comms-pillar-delivery-window-badge"
          >
            Окна поставки · {deliveryWindowCount}
          </Badge>
        ) : null}
        {!compact && commsSseLive ? (
          <Badge
            variant="outline"
            className="border-emerald-200 bg-emerald-50 text-[9px] text-emerald-900"
            data-testid="comms-pillar-sse-live-badge"
          >
            SSE live
          </Badge>
        ) : null}
        <CommsPillarThreadStrip
          variant={variant}
          collectionId={collectionId}
          orderId={cabinetOrderId}
          disabled={emptyChain}
          compact={compact}
        />
        {!compact ? (
          <CommsSectionGroupsPicker
            variant={variant}
            collectionId={collectionId}
            orderId={orderId}
            disabled={emptyChain}
            unreadByChat={unreadByChat}
            threads={threads}
            readerId={readerId}
          />
        ) : null}
        {!compact ? (
          <CommsSectionContextAutoThread
            orderId={orderId}
            disabled={emptyChain || !orderId}
            readerId={readerId}
          />
        ) : null}
        {!compact && !emptyChain && orderId ? (
          <CommsNotificationCenterStrip
            variant={variant}
            collectionId={collectionId}
            orderId={orderId}
          />
        ) : null}
        {compact && !emptyChain && orderId ? (
          <CommsNotificationCenterStrip
            variant={variant}
            collectionId={collectionId}
            orderId={orderId}
            compact
          />
        ) : null}
        {variant === 'supplier' && !emptyChain && orderId ? (
          <SupplierMaterialQuoteCard orderId={orderId} />
        ) : null}
        {variant === 'supplier' && !emptyChain && orderId ? (
          <SupplierCommsBrandPushStrip
            collectionId={collectionId}
            articleId={demoArticleId}
            orderId={orderId}
          />
        ) : null}
        {variant === 'supplier' && !emptyChain ? (
          <SupplierCommsCrmPeerStrip collectionId={collectionId} orderId={orderId || undefined} />
        ) : null}
        {variant === 'supplier' && !emptyChain ? <SupplierArticleDevQuoteHonestStrip /> : null}
        {variant === 'manufacturer' && !emptyChain ? (
          <ManufacturerUnifiedPoInboxStrip compact={compact} />
        ) : null}
        {variant === 'manufacturer' && !emptyChain ? (
          <ManufacturerArticleAttachTzPeerStrip
            collectionId={collectionId}
            articleId={demoArticleId}
          />
        ) : null}
        {(variant === 'brand' || variant === 'shop') && !emptyChain ? (
          <PlatformCoreRegistryStreamHealthStrip
            variant={variant}
            orderId={orderId}
            testIdPrefix={variant === 'brand' ? 'brand-cm-cabinet' : 'shop-cm-cabinet'}
          />
        ) : null}
        {variant === 'brand' && compact && !emptyChain ? (
          <BrandCmCabinetSpinePeerStrip collectionId={collectionId} orderId={orderId || undefined} />
        ) : null}
        {variant === 'shop' && compact && !emptyChain ? (
          <ShopCmCabinetSpinePeerStrip collectionId={collectionId} orderId={orderId || undefined} />
        ) : null}
        {variant === 'supplier' && compact && !emptyChain ? (
          <SupCmCabinetSpinePeerStrip
            collectionId={collectionId}
            articleId={demoArticleId}
            orderId={orderId || undefined}
            factoryId={factoryId}
          />
        ) : null}
        <div className={hubGadget.ctaRow}>
          {compact ? (
            <Link
              href={inboxAllHref}
              data-testid="comms-pillar-inbox-all"
              className={hubGadget.ctaLink}
            >
              Все сообщения
              {unreadBadge}
            </Link>
          ) : (
            <>
              <Link href={messagesHref} className={hubGadget.ctaLink} data-testid={orderChatTestId}>
                <MessageSquare className="h-3 w-3" aria-hidden />
                Чат
              </Link>
              <Link
                href={calendarHref}
                className={hubGadget.ctaLink}
                data-testid={calendarTestId}
                data-audit-legacy="comms-pillar-calendar"
              >
                <Calendar className="h-3 w-3" aria-hidden />
                Календарь
                {calendarEventCount != null && calendarEventCount > 0 ? (
                  <span
                    className="ml-0.5 font-mono text-[9px] tabular-nums opacity-80"
                    data-testid={`${calendarTestId.replace('-link', '')}-events-count`}
                  >
                    ·{calendarEventCount}
                  </span>
                ) : null}
              </Link>
              {!compact && !emptyChain ? (
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
              {!compact && variant === 'manufacturer' ? (
                <Link
                  href={factorySupplierMessagesB2bOrderContextHref(orderId)}
                  data-testid="comms-pillar-supplier-thread-compact"
                  className={linkClass}
                >
                  Поставщик
                </Link>
              ) : null}
              {!compact && isFactory ? (
                <Link
                  href={poHref}
                  data-testid="comms-pillar-handoff-queue-compact"
                  className={linkClass}
                >
                  <ClipboardList className="h-3 w-3" aria-hidden />
                  Очередь передачи
                </Link>
              ) : null}
              {!compact ? (
                <Link
                  href={inboxAllHref}
                  data-testid="comms-pillar-inbox-all"
                  className={linkClass}
                >
                  Все треды
                  {unreadBadge}
                </Link>
              ) : null}
            </>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
