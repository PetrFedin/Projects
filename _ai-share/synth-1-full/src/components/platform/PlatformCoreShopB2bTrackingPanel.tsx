'use client';

import { useEffect } from 'react';
import { useMemo, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { CheckCircle2, Circle } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { PlatformCoreChainStatusRefreshBadge } from '@/components/platform/PlatformCoreChainStatusRefreshBadge';
import { Button } from '@/components/ui/button';
import { downloadB2bRegistryCsv } from '@/lib/platform-core-b2b-registry-csv';
import { filterPlatformCoreShopOrderRows } from '@/lib/platform-core-b2b-registry-url';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useShopWorkshop2B2bOrdersList } from '@/hooks/use-shop-workshop2-b2b-orders-list';
import {
  usePlatformCoreShopTrackingChains,
  type PlatformCoreShopTrackingChain,
} from '@/hooks/use-platform-core-shop-tracking-chains';
import { formatShopB2bTrackingReserveLabelRu } from '@/lib/platform-core-tracking-reserve-label';
import {
  ROUTES,
  shopB2bOrderHref,
  shopB2bOrderProductionContextHref,
  shopB2bOrdersProductionRegistryHref,
  shopCalendarB2bOrderContextHref,
  shopB2bWorkingOrderOrderContextHref,
  shopMessagesB2bOrderContextHref,
} from '@/lib/routes';
import { cn } from '@/lib/utils';
import { B2bChainPhaseBadge } from '@/components/b2b/B2bChainPhaseBadge';
import { ShopOrderShipmentTrackingStrip } from '@/components/integrations/ShopOrderShipmentTrackingStrip';
import { IntegrationProductionWipStrip } from '@/components/integrations/IntegrationProductionWipStrip';
import { mergeRegistryRowsWithSpineOverlay } from '@/lib/integrations/spine/registry-spine-merge';
import { useB2bRegistryIntegrationOverlay } from '@/hooks/use-b2b-registry-integration-overlay';
import {
  formatWholesaleOrderDisplayId,
  isIntegrationImportedWholesaleOrderId,
} from '@/lib/integrations/spine/integration-ui-utils';
import { buildOrderSectionCommsMessagesHref } from '@/lib/platform-core-comms-section-groups';
import { usePlatformCoreDemoContext } from '@/components/platform/usePlatformCoreChainOverview';
import {
  legacyShopOpTrackingTestId,
  shopCoTrackingTestId,
} from '@/lib/platform-core-shop-co-test-ids';
import { buildWorkshop2ApiRequestHeaders } from '@/lib/production/workshop2-api-client-headers';
import { workshop2B2bOrderStatusLabelRu } from '@/lib/production/workshop2-b2b-order-lifecycle';
import {
  applyShopBuyerChainVisibility,
  getShopProductionVisibilityPolicy,
  type ShopProductionVisibility,
} from '@/lib/platform-core-shop-production-visibility';

function formatTrackingUpdatedAt(iso: string): string {
  try {
    return new Date(iso).toLocaleString('ru-RU', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  } catch {
    return iso;
  }
}

const RESERVE_TONE_CLASS: Record<string, string> = {
  ok: 'border-emerald-200 bg-emerald-50/80 text-emerald-900',
  pending: 'border-amber-200 bg-amber-50/80 text-amber-900',
  muted: 'border-border-subtle bg-bg-surface2/60 text-text-muted',
  warn: 'border-rose-200 bg-rose-50/80 text-rose-900',
};

function resolveFocusOrderId(searchParams: URLSearchParams): string | null {
  return searchParams.get('order')?.trim() || searchParams.get('orderId')?.trim() || null;
}

/** Резерв на карточке: PG chain или честный fallback для golden B2B-DEMO после bootstrap. */
function resolveShopTrackingReserveLabel(
  chain: PlatformCoreShopTrackingChain | null | undefined,
  row: { order: string; status: string }
): ReturnType<typeof formatShopB2bTrackingReserveLabelRu> | null {
  if (chain != null) {
    return formatShopB2bTrackingReserveLabelRu({
      status: chain.status,
      handedOff: chain.handedOff,
      inventoryReserved: chain.inventoryReserved,
      inventoryReservedQty: chain.inventoryReservedQty,
      inventoryReserveReason: chain.inventoryReserveReason,
    });
  }
  if (!row.order.startsWith('B2B-DEMO-')) return null;
  if (row.status === 'Подтверждён' || row.status.includes('Подтверж')) {
    return formatShopB2bTrackingReserveLabelRu({
      status: 'confirmed',
      handedOff: true,
      inventoryReserved: false,
      inventoryReserveReason: 'internal_wms_disabled',
    });
  }
  return formatShopB2bTrackingReserveLabelRu({
    status: 'pending',
    handedOff: false,
    inventoryReserved: false,
  });
}

export function PlatformCoreShopB2bTrackingPanel() {
  const searchParams = useSearchParams();
  const { collectionId: contextCollectionId } = usePlatformCoreDemoContext();
  const focusOrderId = resolveFocusOrderId(searchParams);
  const { rows: w2Rows, loadState } = useShopWorkshop2B2bOrdersList(true);
  const integrationOverlay = useB2bRegistryIntegrationOverlay('shop', true);

  const rows = useMemo(() => {
    if (loadState !== 'ready' || !w2Rows) return null;
    const w2Mapped = w2Rows.map((r) => ({
      order: r.order,
      brand: r.brand,
      status: r.status,
      amount: r.amount,
      collectionId: r.collectionId,
      updatedAt: r.updatedAt,
    }));
    const importedMapped = (
      integrationOverlay.loadState === 'ready' ? integrationOverlay.importedShopRows : []
    ).map((o) => ({
      order: o.orderId,
      brand: o.brand,
      status: o.status,
      amount: o.amount,
      collectionId: o.collectionId ?? contextCollectionId,
      updatedAt: new Date().toISOString(),
    }));
    const merged = mergeRegistryRowsWithSpineOverlay(w2Mapped, importedMapped, (r) => r.order);
    return filterPlatformCoreShopOrderRows(merged, focusOrderId);
  }, [w2Rows, loadState, integrationOverlay.importedShopRows, contextCollectionId, focusOrderId]);
  const orderIds = rows?.map((r) => r.order) ?? [];
  const {
    chains,
    loading: chainsLoading,
    lastFetchedAt,
    sseConnected,
  } = usePlatformCoreShopTrackingChains(orderIds, { enabled: Boolean(rows?.length) });

  const [focusChainOverride, setFocusChainOverride] =
    useState<PlatformCoreShopTrackingChain | null>(null);

  useEffect(() => {
    if (!focusOrderId) {
      setFocusChainOverride(null);
      return;
    }
    let cancelled = false;
    const headers = buildWorkshop2ApiRequestHeaders();
    void (async () => {
      try {
        const chainRes = await fetch(
          `/api/workshop2/b2b/orders/${encodeURIComponent(focusOrderId)}/chain-status`,
          { headers, cache: 'no-store' }
        );
        if (!chainRes.ok) return;
        const chainJson = (await chainRes.json()) as {
          ok?: boolean;
          chain?: PlatformCoreShopTrackingChain;
        };
        if (!chainJson.ok || !chainJson.chain) return;

        let chain = chainJson.chain;
        const visRes = await fetch(
          `/api/workshop2/b2b/orders/${encodeURIComponent(focusOrderId)}/shop-production-visibility`,
          { headers, cache: 'no-store' }
        );
        if (visRes.ok) {
          const visJson = (await visRes.json()) as {
            ok?: boolean;
            visibility?: ShopProductionVisibility;
          };
          if (visJson.ok && visJson.visibility) {
            chain =
              applyShopBuyerChainVisibility(
                chain,
                getShopProductionVisibilityPolicy(visJson.visibility)
              ) ?? chain;
          }
        }
        if (!cancelled) setFocusChainOverride(chain);
      } catch {
        /* poll hook covers refresh */
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [focusOrderId, chainsLoading, lastFetchedAt]);

  const resolvedChains = useMemo(() => {
    if (!focusOrderId || !focusChainOverride) return chains;
    if (chains[focusOrderId]?.steps?.length) return chains;
    return { ...chains, [focusOrderId]: focusChainOverride };
  }, [chains, focusOrderId, focusChainOverride]);

  useEffect(() => {
    if (!focusOrderId) return;
    const el =
      document.querySelector(`[data-testid="shop-co-tracking-row-${focusOrderId}"]`) ??
      document.querySelector(`[data-testid="platform-core-tracking-${focusOrderId}"]`);
    if (el) {
      el.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
    }
  }, [focusOrderId, rows, resolvedChains]);

  if (loadState === 'idle' || loadState === 'loading' || rows == null) {
    return (
      <p
        className="text-text-secondary py-6 text-center text-sm"
        data-testid="platform-core-tracking-loading"
      >
        Загрузка заказов и статусов цепочки…
      </p>
    );
  }

  if (loadState === 'error' || rows.length === 0) {
    return (
      <Card className="border-amber-200 bg-amber-50/50" data-testid="platform-core-tracking-empty">
        <CardContent className="space-y-2 py-6 text-center text-sm text-amber-900">
          <p>Нет оптовых заказов для отслеживания по этой коллекции.</p>
          <div className="flex flex-wrap justify-center gap-x-4 gap-y-1 text-xs">
            <Link
              href={shopB2bOrdersProductionRegistryHref()}
              data-testid="shop-tracking-empty-registry-link"
              className="text-accent-primary font-medium hover:underline"
            >
              Реестр заказов
            </Link>
            <Link
              href={ROUTES.shop.b2bMatrix}
              data-testid="shop-tracking-empty-matrix-link"
              className="text-accent-primary font-medium hover:underline"
            >
              Матрица заказа
            </Link>
          </div>
        </CardContent>
      </Card>
    );
  }

  function downloadTrackingCsv() {
    if (!rows?.length) return;
    downloadB2bRegistryCsv(
      'shop-b2b-tracking.csv',
      ['order', 'brand', 'collection', 'status', 'po', 'steps_done', 'steps_total', 'updated_at'],
      rows.map((row) => {
        const chain = resolvedChains[row.order];
        const doneCount = chain?.steps?.filter((s) => s.done).length ?? 0;
        const totalSteps = chain?.steps?.length ?? 0;
        return [
          row.order,
          row.brand,
          row.collectionId ?? '',
          row.status,
          chain?.productionOrderId ?? '',
          doneCount,
          totalSteps,
          row.updatedAt ?? '',
        ];
      })
    );
  }

  return (
    <div
      data-testid={shopCoTrackingTestId('list')}
      data-audit-legacy={legacyShopOpTrackingTestId('list')}
      className="space-y-3"
    >
      {focusOrderId ? (
        <div
          className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs"
          data-testid="shop-co-tracking-context-strip"
          data-audit-legacy="shop-tracking-order-context-strip"
        >
          <Link
            href={shopB2bOrderHref(focusOrderId)}
            data-testid="shop-co-tracking-order-detail-link"
            data-audit-legacy="shop-tracking-order-detail-link"
            className="text-accent-primary font-medium hover:underline"
          >
            Карточка заказа
          </Link>
          {resolvedChains[focusOrderId]?.steps?.some((s) => s.id === 'production_po') ? (
            <Link
              href={shopB2bOrderProductionContextHref(focusOrderId)}
              data-testid="shop-co-tracking-order-production-link"
              className="text-accent-primary font-medium hover:underline"
            >
              Выпуск
            </Link>
          ) : null}
          <Link
            href={buildOrderSectionCommsMessagesHref({
              roleId: 'shop',
              orderId: focusOrderId,
              collectionId: contextCollectionId,
              sectionId: 'shop-co-buyer-tracking',
            })}
            data-testid="shop-co-tracking-order-chat-link"
            data-audit-legacy="shop-tracking-order-chat-link"
            className="text-accent-primary font-medium hover:underline"
          >
            Чат
          </Link>
          <Link
            href={shopCalendarB2bOrderContextHref(focusOrderId)}
            data-testid="shop-co-tracking-order-calendar-link"
            data-audit-legacy="shop-tracking-order-calendar-link"
            className="text-accent-primary font-medium hover:underline"
          >
            Календарь
          </Link>
          <Link
            href={shopB2bOrdersProductionRegistryHref(focusOrderId)}
            data-testid="shop-co-tracking-registry-link"
            data-audit-legacy="shop-tracking-registry-link"
            className="text-accent-primary font-medium hover:underline"
          >
            Реестр
          </Link>
        </div>
      ) : null}
      <div className="flex flex-wrap items-center justify-end gap-2">
        <PlatformCoreChainStatusRefreshBadge
          sseConnected={sseConnected}
          enabled={orderIds.length > 0}
          sseTestId="shop-co-tracking-sse-live-badge"
          pollTestId="shop-co-tracking-poll-badge"
          sseLegacyTestId="shop-tracking-sse-live-badge"
        />
        <Link
          href={
            focusOrderId
              ? shopB2bOrdersProductionRegistryHref(focusOrderId)
              : shopB2bOrdersProductionRegistryHref()
          }
          data-testid="shop-co-tracking-toolbar-registry-link"
          data-audit-legacy="shop-tracking-toolbar-registry-link"
          className="text-accent-primary text-[10px] font-semibold uppercase hover:underline"
        >
          Реестр
        </Link>
        <Button
          variant="outline"
          size="sm"
          className="h-8 text-[10px] font-bold uppercase"
          data-testid="shop-co-tracking-export-csv"
          data-audit-legacy="shop-b2b-tracking-export-csv"
          onClick={downloadTrackingCsv}
        >
          Экспорт CSV
        </Button>
      </div>
      {(rows ?? []).map((row) => {
        const chain = resolvedChains[row.order];
        const doneCount = chain?.steps?.filter((s) => s.done).length ?? 0;
        const totalSteps = chain?.steps?.length ?? 0;
        const reserve = resolveShopTrackingReserveLabel(chain, row);
        const isHubTrackingRow =
          row.order.startsWith('B2B-DEMO-') ||
          isIntegrationImportedWholesaleOrderId(row.order) ||
          /^B2B-\d+$/.test(row.order);
        const materialsStep = chain?.steps?.find((s) => s.id === 'materials_supplied');
        const materialsDone = chain?.materialsSupplied === true || materialsStep?.done === true;
        const materialsPending =
          chain?.handedOff === true && materialsStep != null && !materialsDone;
        const rowFocused = focusOrderId === row.order;
        return (
          <Card
            key={row.order}
            data-testid={
              rowFocused
                ? shopCoTrackingTestId('focus-row')
                : isHubTrackingRow
                  ? shopCoTrackingTestId(`row-${row.order}`)
                  : undefined
            }
            data-audit-legacy={
              rowFocused
                ? legacyShopOpTrackingTestId('focus-row')
                : isHubTrackingRow
                  ? `platform-core-tracking-${row.order}`
                  : undefined
            }
            className={
              rowFocused
                ? 'border-accent-primary ring-accent-primary/30 border-2 ring-2'
                : 'border-indigo-200/40'
            }
          >
            <CardHeader className="pb-2">
              <div className="flex flex-wrap items-start justify-between gap-2">
                <div>
                  <CardTitle className="text-sm font-bold">
                    <Link
                      href={shopB2bOrderHref(row.order)}
                      className="text-accent-primary hover:underline"
                    >
                      {formatWholesaleOrderDisplayId(row.order)}
                    </Link>
                  </CardTitle>
                  <CardDescription className="text-xs">
                    {row.brand} · {row.collectionId ?? '—'} · {row.status}
                    {chain?.productionOrderId ? ` · PO ${chain.productionOrderId}` : null}
                    {row.updatedAt ? (
                      <span
                        className="text-text-muted block text-[10px]"
                        data-testid={
                          isHubTrackingRow
                            ? `platform-core-tracking-updated-${row.order}`
                            : undefined
                        }
                      >
                        Обновлено: {formatTrackingUpdatedAt(row.updatedAt)}
                      </span>
                    ) : null}
                  </CardDescription>
                  {reserve ? (
                    <p
                      className={cn(
                        'mt-2 inline-block rounded-md border px-2 py-0.5 text-[10px] font-medium',
                        RESERVE_TONE_CLASS[reserve.tone]
                      )}
                      data-testid={
                        isHubTrackingRow ? `platform-core-tracking-reserve-${row.order}` : undefined
                      }
                    >
                      {reserve.text}
                    </p>
                  ) : null}
                </div>
                <div className="flex flex-wrap items-center justify-end gap-1.5">
                  {chain?.steps?.some((s) => s.id === 'production_po') ? (
                    <Link
                      href={shopB2bOrderProductionContextHref(row.order)}
                      className="text-accent-primary text-[10px] font-semibold uppercase hover:underline"
                      data-testid={
                        isHubTrackingRow
                          ? `shop-co-tracking-production-link-${row.order}`
                          : undefined
                      }
                    >
                      Выпуск
                    </Link>
                  ) : null}
                  <Link
                    href={shopMessagesB2bOrderContextHref(row.order)}
                    className="text-accent-primary text-[10px] font-semibold uppercase hover:underline"
                    data-testid={
                      isHubTrackingRow ? `shop-co-tracking-chat-link-${row.order}` : undefined
                    }
                    data-audit-legacy={
                      isHubTrackingRow ? `platform-core-tracking-chat-${row.order}` : undefined
                    }
                  >
                    Чат
                  </Link>
                  <Link
                    href={shopCalendarB2bOrderContextHref(row.order)}
                    className="text-accent-primary text-[10px] font-semibold uppercase hover:underline"
                    data-testid={
                      isHubTrackingRow ? `shop-co-tracking-calendar-link-${row.order}` : undefined
                    }
                    data-audit-legacy={
                      isHubTrackingRow ? `platform-core-tracking-calendar-${row.order}` : undefined
                    }
                  >
                    Календарь
                  </Link>
                  {isIntegrationImportedWholesaleOrderId(row.order) ? (
                    <Link
                      href={shopB2bWorkingOrderOrderContextHref(row.order)}
                      className="text-accent-primary text-[10px] font-semibold uppercase hover:underline"
                      data-testid={`shop-co-tracking-working-order-link-${row.order}`}
                    >
                      Рабочий заказ
                    </Link>
                  ) : null}
                  {chain ? (
                    <B2bChainPhaseBadge
                      orderStatusLabel={
                        chain.status
                          ? workshop2B2bOrderStatusLabelRu(
                              chain.status as Parameters<typeof workshop2B2bOrderStatusLabelRu>[0]
                            )
                          : row.status
                      }
                      chain={{
                        orderId: row.order,
                        handedOff: chain.handedOff,
                        poStatusLabelRu: chain.poStatusLabelRu,
                        productionOrderId: chain.productionOrderId,
                        inventoryReserved: chain.inventoryReserved,
                        orderStatusLabelRu: workshop2B2bOrderStatusLabelRu(
                          chain.status as Parameters<typeof workshop2B2bOrderStatusLabelRu>[0]
                        ),
                      }}
                    />
                  ) : null}
                  {materialsDone ? (
                    <Badge
                      variant="outline"
                      className="border-emerald-300 text-[10px] text-emerald-800"
                      data-testid={
                        isHubTrackingRow
                          ? `shop-co-tracking-materials-badge-${row.order}`
                          : undefined
                      }
                      data-audit-legacy={
                        isHubTrackingRow
                          ? `platform-core-tracking-materials-${row.order}`
                          : undefined
                      }
                    >
                      Материалы подтверждены
                    </Badge>
                  ) : materialsPending ? (
                    <Badge
                      variant="outline"
                      className="border-amber-300 text-[10px] text-amber-900"
                      data-testid={
                        isHubTrackingRow
                          ? `shop-co-tracking-materials-pending-${row.order}`
                          : undefined
                      }
                    >
                      Ожидает материалы
                    </Badge>
                  ) : totalSteps > 0 ? (
                    <Badge variant="outline" className="text-[10px]">
                      {doneCount}/{totalSteps} этапов
                    </Badge>
                  ) : null}
                </div>
              </div>
              {isIntegrationImportedWholesaleOrderId(row.order) ? (
                <ShopOrderShipmentTrackingStrip wholesaleOrderId={row.order} />
              ) : null}
              {chain?.handedOff && isIntegrationImportedWholesaleOrderId(row.order) ? (
                <IntegrationProductionWipStrip
                  wholesaleOrderId={row.order}
                  productionOrderId={chain.productionOrderId}
                  variant="shop"
                />
              ) : null}
            </CardHeader>
            {chain?.steps?.length ? (
              <CardContent>
                <ul className="space-y-1.5">
                  {chain.steps.map((step) => (
                    <li
                      key={step.id}
                      className="flex flex-wrap items-start gap-x-2 gap-y-0.5 text-xs"
                      data-testid={`platform-core-chain-step-${step.id}`}
                      data-order={row.order}
                      data-done={step.done ? 'true' : 'false'}
                    >
                      {step.done ? (
                        <CheckCircle2
                          className="mt-0.5 h-3.5 w-3.5 shrink-0 text-emerald-600"
                          aria-hidden
                        />
                      ) : (
                        <Circle
                          className="text-text-muted mt-0.5 h-3.5 w-3.5 shrink-0"
                          aria-hidden
                        />
                      )}
                      <span className={step.done ? 'text-text-primary' : 'text-text-muted'}>
                        {step.labelRu}
                      </span>
                      {step.id === 'materials_supplied' && step.done ? (
                        <Link
                          href={shopB2bOrderProductionContextHref(row.order)}
                          data-testid={
                            isHubTrackingRow
                              ? `shop-co-tracking-materials-step-link-${row.order}`
                              : undefined
                          }
                          className="text-accent-primary text-[10px] font-medium hover:underline"
                        >
                          Выпуск
                        </Link>
                      ) : null}
                    </li>
                  ))}
                </ul>
              </CardContent>
            ) : null}
          </Card>
        );
      })}
    </div>
  );
}
