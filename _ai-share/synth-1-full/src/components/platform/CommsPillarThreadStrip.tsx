'use client';

import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { Search } from 'lucide-react';
import { Input } from '@/components/ui/input';
import {
  brandMessagesB2bOrderContextHref,
  brandMessagesWorkshop2ArticleContextHref,
  factoryMessagesB2bOrderContextHref,
  factoryMessagesRoleHref,
  factoryMessagesWorkshop2ArticleContextHref,
  factorySupplierMessagesB2bOrderContextHref,
  factorySupplierMessagesWorkshop2ArticleContextHref,
  ROUTES,
  shopMessagesB2bOrderContextHref,
  shopMessagesWorkshop2ArticleContextHref,
} from '@/lib/routes';
import { fetchPgContextualThreads } from '@/lib/brand/brand-pg-contextual-chat-client';
import type { BrandPgThreadRow } from '@/lib/brand/brand-messages-pg-threads';
import type { PgContextualThreadsCabinet } from '@/lib/server/pg-contextual-message-threads-handler';
import { WORKSHOP2_B2B_ORDER_CONTEXT_TYPE } from '@/lib/production/workshop2-b2b-order-lifecycle';
import {
  commsHubThreadLabel,
  mergeCommsHubInboxThreadRows,
} from '@/lib/communications/comms-hub-inbox-rows';
import {
  usePlatformCoreB2bInboxOrderIds,
  type PlatformCoreB2bInboxCabinet,
} from '@/hooks/use-platform-core-b2b-inbox-order-ids';
import { useShopCoreBuyerId } from '@/hooks/use-shop-core-buyer-id';
import { usePlatformCoreB2bRegistryPoll } from '@/hooks/use-platform-core-b2b-registry-poll';
import { usePlatformCoreCommsInboxPoll } from '@/hooks/use-platform-core-comms-inbox-poll';
import { usePlatformCoreDemoContext } from '@/components/platform/usePlatformCoreChainOverview';
import { buildWorkshop2ApiRequestHeaders } from '@/lib/production/workshop2-api-client-headers';

type Variant = 'brand' | 'shop' | 'manufacturer' | 'supplier';

type Props = {
  variant: Variant;
  collectionId: string;
  orderId: string;
  disabled?: boolean;
  compact?: boolean;
};

function rolePrefix(variant: Variant): string {
  if (variant === 'shop') return 'shop-cm-cabinet';
  if (variant === 'manufacturer') return 'mfr-cm-cabinet';
  if (variant === 'supplier') return 'sup-cm-cabinet';
  return 'brand-cm-cabinet';
}

function pgCabinet(variant: Variant): PgContextualThreadsCabinet {
  return variant === 'shop' ? 'shop' : variant === 'brand' ? 'brand' : 'factory';
}

function inboxCabinet(variant: Variant): PlatformCoreB2bInboxCabinet {
  if (variant === 'shop') return 'shop';
  if (variant === 'brand') return 'brand';
  if (variant === 'supplier') return 'supplier';
  return 'manufacturer';
}

function threadWorkspaceHref(variant: Variant, thread: BrandPgThreadRow): string | null {
  if (thread.contextType === WORKSHOP2_B2B_ORDER_CONTEXT_TYPE) {
    const id = thread.contextId?.trim();
    if (!id) return null;
    if (variant === 'shop') return shopMessagesB2bOrderContextHref(id);
    if (variant === 'brand') return brandMessagesB2bOrderContextHref(id);
    if (variant === 'supplier') {
      return factorySupplierMessagesB2bOrderContextHref(id);
    }
    return factoryMessagesB2bOrderContextHref(id, { role: 'manufacturer' });
  }
  if (thread.workspaceHref?.trim()) return thread.workspaceHref.trim();
  const cid = thread.collectionId?.trim();
  const aid = thread.articleId?.trim();
  if (!cid || !aid) return null;
  if (variant === 'shop') return shopMessagesWorkshop2ArticleContextHref(cid, aid);
  if (variant === 'brand') return brandMessagesWorkshop2ArticleContextHref(cid, aid);
  if (variant === 'supplier') {
    return factorySupplierMessagesWorkshop2ArticleContextHref(cid, aid);
  }
  return factoryMessagesWorkshop2ArticleContextHref(cid, aid, { role: 'manufacturer' });
}

function inboxAllHref(variant: Variant): string {
  if (variant === 'shop') return ROUTES.shop.messages;
  if (variant === 'brand') return ROUTES.brand.messages;
  return factoryMessagesRoleHref(variant === 'supplier' ? 'supplier' : 'manufacturer');
}

export function CommsPillarThreadStrip({ variant, collectionId, orderId, disabled, compact = false }: Props) {
  const prefix = rolePrefix(variant);
  const demo = usePlatformCoreDemoContext();
  const { buyerId: shopBuyerId } = useShopCoreBuyerId();
  const cabinet = inboxCabinet(variant);
  const { orderIds: inboxOrderIds, ready: inboxReady } = usePlatformCoreB2bInboxOrderIds(
    disabled ? null : cabinet,
    cabinet === 'shop' ? shopBuyerId : undefined
  );
  const { tick: registryTick } = usePlatformCoreB2bRegistryPoll(!disabled);
  const { tick: inboxTick } = usePlatformCoreCommsInboxPoll(!disabled);
  const [query, setQuery] = useState('');
  const [pgThreads, setPgThreads] = useState<BrandPgThreadRow[]>([]);
  const [pgLoaded, setPgLoaded] = useState(false);
  const [poByOrderId, setPoByOrderId] = useState<Record<string, string>>({});

  useEffect(() => {
    if (disabled) {
      setPgThreads([]);
      setPgLoaded(true);
      return;
    }
    let cancelled = false;
    void fetchPgContextualThreads(pgCabinet(variant))
      .then(({ threads: rows }) => {
        if (!cancelled) setPgThreads(rows);
      })
      .finally(() => {
        if (!cancelled) setPgLoaded(true);
      });
    return () => {
      cancelled = true;
    };
  }, [variant, disabled, registryTick, inboxTick]);

  useEffect(() => {
    if (disabled || (variant !== 'manufacturer' && variant !== 'supplier')) {
      setPoByOrderId({});
      return;
    }
    let cancelled = false;
    void fetch(
      `/api/workshop2/factory/production-handoff-queue?factoryId=${encodeURIComponent(demo.factoryId)}`,
      { headers: buildWorkshop2ApiRequestHeaders(), cache: 'no-store' }
    )
      .then(async (res) => {
        if (!res.ok) return null;
        return (await res.json()) as {
          ok?: boolean;
          items?: Array<{ b2bOrderId?: string; productionOrderId?: string }>;
        };
      })
      .then((json) => {
        if (cancelled || !json?.ok || !Array.isArray(json.items)) return;
        const next: Record<string, string> = {};
        for (const item of json.items) {
          const b2b = item.b2bOrderId?.trim();
          const po = item.productionOrderId?.trim();
          if (b2b && po) next[b2b] = po;
        }
        setPoByOrderId(next);
      })
      .catch(() => {
        if (!cancelled) setPoByOrderId({});
      });
    return () => {
      cancelled = true;
    };
  }, [disabled, variant, demo.factoryId, registryTick]);

  const mergedThreads = useMemo(() => {
    if (disabled) return [];
    const orders =
      inboxOrderIds.length > 0 ? inboxOrderIds : orderId.trim() ? [orderId.trim()] : [];
    const rows = mergeCommsHubInboxThreadRows(pgThreads, orders, collectionId);
    const activeOrder = orderId.trim();
    return rows.filter((t) => {
      if (t.messageCount > 0 || Boolean(t.lastMessageAt?.trim())) return true;
      return (
        Boolean(activeOrder) &&
        t.contextType === WORKSHOP2_B2B_ORDER_CONTEXT_TYPE &&
        t.contextId?.trim() === activeOrder
      );
    });
  }, [disabled, pgThreads, inboxOrderIds, orderId, collectionId]);

  const loaded = pgLoaded && inboxReady;
  const maxVisible = variant === 'manufacturer' || variant === 'supplier' ? 8 : 5;

  const { visible, hiddenOrderCount } = useMemo(() => {
    const q = query.trim().toLowerCase();
    const tokens = q ? q.split(/\s+/).filter(Boolean) : [];
    let list = mergedThreads;
    if (tokens.length > 0) {
      list = mergedThreads.filter((t) => {
        const blob = [
          commsHubThreadLabel(t, poByOrderId),
          t.lastMessagePreview,
          t.contextId,
          t.collectionId,
          t.articleId,
          poByOrderId[t.contextId?.trim() ?? ''],
        ]
          .filter(Boolean)
          .join(' ')
          .toLowerCase();
        return tokens.every((tok) => blob.includes(tok));
      });
    }
    const orderOnly = list.filter((t) => t.contextType === WORKSHOP2_B2B_ORDER_CONTEXT_TYPE);
    const articles = list.filter((t) => t.contextType !== WORKSHOP2_B2B_ORDER_CONTEXT_TYPE);
    const visibleOrders = orderOnly.slice(0, maxVisible);
    const hiddenOrders = Math.max(0, orderOnly.length - visibleOrders.length);
    const room = Math.max(0, maxVisible - visibleOrders.length);
    return {
      visible: [...visibleOrders, ...articles.slice(0, room)],
      hiddenOrderCount: hiddenOrders,
    };
  }, [mergedThreads, query, poByOrderId, maxVisible]);

  const hasPoInbox = mergedThreads.some((t) => t.contextType === WORKSHOP2_B2B_ORDER_CONTEXT_TYPE);

  if (disabled) return null;

  return (
    <div className="space-y-1.5" data-testid={`${prefix}-thread-strip`}>
      {!compact ? (
        <div className="group relative">
          <Search
            className="text-text-muted absolute left-2 top-1/2 h-3 w-3 -translate-y-1/2"
            aria-hidden
          />
          <Input
            data-testid={`${prefix}-thread-search`}
            className="border-border-subtle bg-bg-surface1 placeholder:text-text-muted h-7 rounded-md pl-7 text-[10px]"
            placeholder="Поиск…"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            aria-label="Поиск тредов"
          />
        </div>
      ) : null}
      {loaded && visible.length > 0 ? (
        <ul
          className="space-y-0.5"
          data-testid={hasPoInbox ? `${prefix}-po-inbox` : `${prefix}-thread-list`}
          data-audit-legacy={`${prefix}-thread-list`}
        >
          {visible.map((t) => {
            const href = threadWorkspaceHref(variant, t);
            const unread =
              t.lastSeenMessageCount != null && t.messageCount > t.lastSeenMessageCount;
            const preview = t.lastMessagePreview?.trim().slice(0, 56) || 'Без сообщений';
            const label = commsHubThreadLabel(t, poByOrderId);
            return (
              <li key={`${t.contextType}:${t.contextId}`}>
                {href ? (
                  <Link
                    href={href}
                    data-testid={`${prefix}-thread-item`}
                    className="text-accent-primary hover:bg-bg-surface2 block rounded px-1 py-0.5 text-[10px] font-medium leading-snug"
                  >
                    <span className="font-mono">{label}</span>
                    {unread ? (
                      <span className="bg-accent-primary ml-1 inline-block h-1.5 w-1.5 rounded-full align-middle" />
                    ) : null}
                    <span className="text-text-muted block font-normal">· {preview}</span>
                  </Link>
                ) : (
                  <span className="text-text-muted block px-1 py-0.5 text-[10px]">
                    {label} · {preview}
                  </span>
                )}
              </li>
            );
          })}
        </ul>
      ) : loaded ? (
        <p className="text-text-muted px-0.5 text-[10px]" data-testid={`${prefix}-thread-empty`}>
          {query.trim() ? 'Нет по запросу' : 'Треды после первого сообщения'}
        </p>
      ) : null}
      {loaded && hiddenOrderCount > 0 ? (
        <Link
          href={inboxAllHref(variant)}
          data-testid={`${prefix}-po-inbox-more`}
          className="text-accent-primary px-0.5 text-[10px] font-medium hover:underline"
        >
          Ещё {hiddenOrderCount} заказов во «Все треды» →
        </Link>
      ) : null}
    </div>
  );
}
