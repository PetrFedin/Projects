'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { CheckCircle2, Circle, Factory } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { useWorkshop2B2bOrderDetail } from '@/hooks/use-workshop2-b2b-order-detail';
import { usePlatformCoreOrderDetailPillarId } from '@/hooks/use-platform-core-order-detail-pillar';
import { usePlatformCoreChainStatusPoll } from '@/hooks/use-platform-core-chain-status-poll';
import { buildWorkshop2ApiRequestHeaders } from '@/lib/production/workshop2-api-client-headers';
import {
  ROUTES,
  brandB2bOrderChainContextHref,
  brandB2bOrderHandoffContextHref,
  brandCalendarB2bOrderContextHref,
  brandMessagesB2bOrderContextHref,
  brandW2ProductionTzHref,
  factoryProductionDossierHref,
  factoryProductionHandoffQueueHref,
  factoryProductionOrdersOrderContextHref,
  shopCalendarB2bOrderContextHref,
  shopB2bTrackingOrderHref,
  shopB2bMatrixReorderHref,
  shopB2bOrderProductionContextHref,
  shopB2bOrdersCollectionRegistryHref,
  shopB2bOrdersProductionRegistryHref,
  shopMessagesB2bOrderContextHref,
  brandB2bOrdersCollectionRegistryHref,
} from '@/lib/routes';
import {
  getPlatformCoreCollectionLabel,
  getPlatformCoreDemoByOrderId,
} from '@/lib/platform-core-hub-matrix';
import { B2bOrderAmendmentPanel } from '@/components/b2b/B2bOrderAmendmentPanel';
import { B2bOrderChainStatusCard } from '@/components/b2b/B2bOrderChainStatusCard';
import { BrandOpDossierProductionPeerStrip } from '@/components/platform/BrandOpDossierProductionPeerStrip';
import { ShopCoTrackingEtaPeekStrip } from '@/components/platform/ShopCoTrackingEtaPeekStrip';
import { ShopCoDetailSpinePeerStrip } from '@/components/shop/b2b/ShopCoDetailSpinePeerStrip';
import { PLATFORM_CORE_ORDER_UNAVAILABLE_RU } from '@/lib/platform-core-user-messages';
import { isPlatformCoreMode } from '@/lib/cabinet-core-mode';
import { isIntegrationImportedWholesaleOrderId } from '@/lib/integrations/spine/integration-ui-utils';
import { OperationalImportedOrderDetailCard } from '@/components/b2b/OperationalImportedOrderDetailCard';
import { workshop2ArticleHref } from '@/lib/production/workshop2-url';
import {
  PRODUCTION_HANDOFF_DONE_RU,
  PRODUCTION_HANDOFF_PENDING_RU,
  PRODUCTION_HANDOFF_QUEUE_RU,
} from '@/lib/platform-core-canonical-labels';

type Props = {
  orderId: string;
  variant: 'brand' | 'shop';
};

type ChainStep = { id: string; labelRu: string; done: boolean };

type ChainDossierDiff = {
  dossierVersionAtHandoff?: number;
  currentDossierVersion?: number;
  dossierChangedSinceHandoff?: boolean;
  dossierDiffSummaryRu?: string;
  dossierDiffLines?: string[];
};

type ChainPayload = {
  productionOrderId?: string;
  handedOff?: boolean;
  dossierHref?: string;
  factoryId?: string;
  poStatusLabelRu?: string;
  dossierDiff?: ChainDossierDiff;
  steps?: ChainStep[];
};

export function PlatformCoreB2bOrderDetailFacts({ orderId, variant }: Props) {
  if (isIntegrationImportedWholesaleOrderId(orderId)) {
    return <OperationalImportedOrderDetailCard orderId={orderId} variant={variant} />;
  }
  return <PlatformCoreW2OrderDetailFacts orderId={orderId} variant={variant} />;
}

function PlatformCoreW2OrderDetailFacts({ orderId, variant }: Props) {
  const { order, loadState } = useWorkshop2B2bOrderDetail(orderId, true);
  const pillarId = usePlatformCoreOrderDetailPillarId();
  const productionPillar = pillarId === 'order_production';
  const [chain, setChain] = useState<ChainPayload | null>(null);
  const demo = getPlatformCoreDemoByOrderId(orderId);
  const { tick: chainPollTick } = usePlatformCoreChainStatusPoll(true, [orderId]);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const res = await fetch(
          `/api/workshop2/b2b/orders/${encodeURIComponent(orderId)}/chain-status`,
          { headers: buildWorkshop2ApiRequestHeaders(), cache: 'no-store' }
        );
        const json = (await res.json()) as { ok?: boolean; chain?: ChainPayload };
        if (!cancelled && json.ok && json.chain) setChain(json.chain);
      } catch {
        if (!cancelled) setChain(null);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [orderId, chainPollTick]);

  if (loadState === 'loading') {
    return (
      <p
        className="text-text-secondary py-6 text-center text-sm"
        data-testid="platform-core-order-facts-loading"
      >
        Загрузка заказа из W2…
      </p>
    );
  }

  if (loadState === 'error' || !order) {
    return (
      <Card
        className="border-amber-200 bg-amber-50/50"
        data-testid="platform-core-order-facts-error"
      >
        <CardContent className="py-6 text-center text-sm text-amber-900">
          {PLATFORM_CORE_ORDER_UNAVAILABLE_RU}
        </CardContent>
      </Card>
    );
  }

  const collectionId = order.collectionId ?? demo.collectionId;
  const articleId = order.articleId ?? demo.demoArticleId;
  const showroomHref = `${ROUTES.shop.b2bShowroom}?collection=${encodeURIComponent(collectionId)}`;
  const factoryDossierHref =
    chain?.dossierHref ?? factoryProductionDossierHref(articleId, { collectionId });
  const articleHref =
    variant === 'shop' ? showroomHref : workshop2ArticleHref(collectionId, articleId);
  const poId = chain?.productionOrderId ?? demo.productionOrderId;
  const poHandedOff = chain?.handedOff === true;
  const materialsSuppliedStep = chain?.steps?.find((s) => s.id === 'materials_supplied');
  const materialsSuppliedDone = materialsSuppliedStep?.done === true;
  const dossierDiff = chain?.dossierDiff;
  const dossierChangedSinceHandoff = dossierDiff?.dossierChangedSinceHandoff === true;
  const canShopAmend = variant === 'shop' && !poHandedOff && order.status === 'submitted';
  const brandConfirmedDone = chain?.steps?.find((s) => s.id === 'brand_confirmed')?.done === true;
  const coreSlim = isPlatformCoreMode();

  const w2DossierHref = brandW2ProductionTzHref(collectionId, articleId);
  const detailPanelTestId =
    variant === 'brand'
      ? productionPillar
        ? 'brand-op-detail-panel'
        : 'brand-co-detail-panel'
      : productionPillar
        ? 'shop-op-order-status-panel'
        : 'shop-co-detail-panel';

  return (
    <div data-testid={detailPanelTestId} className="space-y-4">
      <div data-testid="platform-core-b2b-order-facts" className="space-y-4">
        <B2bOrderChainStatusCard
          orderId={orderId}
          variant={variant}
          productionPillar={productionPillar}
        />
        {variant === 'shop' && !productionPillar && collectionId ? (
          <ShopCoDetailSpinePeerStrip orderId={orderId} collectionId={collectionId} />
        ) : null}
        {!productionPillar ? (
          <B2bOrderAmendmentPanel
            orderId={orderId}
            variant={variant}
            canShopSubmit={canShopAmend}
          />
        ) : null}
        {variant === 'brand' ? (
          <Card
            id="production-dossier"
            data-testid={
              productionPillar ? 'brand-op-dossier-card' : 'brand-co-detail-dossier-card'
            }
            data-audit-legacy="brand-order-w2-dossier-card"
            className="border-indigo-200/50 bg-indigo-50/20"
          >
            <CardContent className="flex flex-wrap items-center justify-between gap-3 py-3 text-xs">
              <div className="min-w-0">
                <p className="text-text-muted text-[10px] font-bold uppercase">
                  ТЗ для производства
                </p>
                <p className="text-text-secondary mt-0.5 text-[11px]">
                  {coreSlim
                    ? poHandedOff
                      ? 'Зафиксировано.'
                      : 'Перед передачей.'
                    : poHandedOff
                      ? 'Зафиксировано при передаче.'
                      : 'Проверьте перед передачей.'}
                </p>
                {poHandedOff ? (
                  <>
                    <Badge
                      variant="outline"
                      data-testid="brand-order-w2-dossier-locked-badge"
                      className="mt-1.5 border-emerald-200 bg-emerald-50 text-[9px] text-emerald-800"
                    >
                      {dossierDiff?.dossierVersionAtHandoff != null
                        ? `Зафиксировано v${dossierDiff.dossierVersionAtHandoff} при передаче`
                        : 'Зафиксировано при передаче'}
                    </Badge>
                    {dossierChangedSinceHandoff ? (
                      <Badge
                        variant="outline"
                        data-testid="brand-order-w2-dossier-changed-badge"
                        className="mt-1.5 border-amber-200 bg-amber-50 text-[9px] text-amber-900"
                      >
                        ТЗ изменилось после передачи
                      </Badge>
                    ) : null}
                  </>
                ) : null}
                {poHandedOff && dossierDiff?.dossierDiffSummaryRu ? (
                  <p
                    className="text-text-muted mt-1 text-[10px]"
                    data-testid="brand-order-w2-dossier-diff-summary"
                  >
                    {dossierDiff.dossierDiffSummaryRu}
                  </p>
                ) : null}
              </div>
              <div className="flex flex-wrap gap-x-3 gap-y-1">
                <Link
                  href={w2DossierHref}
                  data-testid="brand-order-w2-dossier-link"
                  className="text-accent-primary font-semibold hover:underline"
                >
                  ТЗ · {articleId} →
                </Link>
                {poHandedOff ? (
                  <Link
                    href={factoryDossierHref}
                    data-testid="brand-order-factory-dossier-link"
                    className="font-medium text-emerald-700 hover:underline"
                  >
                    Досье цеха →
                  </Link>
                ) : null}
              </div>
            </CardContent>
          </Card>
        ) : null}
        {variant === 'brand' && productionPillar ? (
          <BrandOpDossierProductionPeerStrip
            orderId={orderId}
            collectionId={collectionId}
            articleId={articleId}
            poHandedOff={poHandedOff}
          />
        ) : null}
        {variant === 'shop' &&
        !productionPillar &&
        brandConfirmedDone &&
        order.status !== 'draft' &&
        order.status !== 'cancelled' ? (
          <ShopCoTrackingEtaPeekStrip orderId={orderId} variant="detail" />
        ) : null}
        {variant === 'shop' &&
        !productionPillar &&
        order.status !== 'draft' &&
        order.status !== 'cancelled' &&
        !isPlatformCoreMode() ? (
          <Card
            data-testid="shop-co-detail-amend-card"
            data-audit-legacy="shop-order-amend-card"
            className="border-violet-200/70 bg-violet-50/25"
          >
            <CardContent className="flex flex-wrap items-center justify-between gap-2 py-3 text-xs">
              <div className="min-w-0">
                <p className="text-text-muted text-[10px] font-bold uppercase">
                  {canShopAmend ? 'Изменение заказа' : 'Повтор заказа'}
                </p>
                <p className="text-text-secondary mt-0.5 leading-relaxed">
                  {canShopAmend
                    ? 'До подтверждения брендом — заявка ниже, матрица или чат.'
                    : poHandedOff
                      ? 'Заказ в производстве — новый заказ через матрицу или уточнение в чате.'
                      : 'Статус заказа зафиксирован — повтор через матрицу.'}
                </p>
              </div>
              <div className="flex flex-wrap gap-x-3 gap-y-1">
                {canShopAmend && order.collectionId ? (
                  <Link
                    href={shopB2bMatrixReorderHref(order.collectionId, orderId)}
                    data-testid="shop-order-amend-matrix-cta"
                    className="text-accent-primary font-semibold hover:underline"
                  >
                    Изменить количества →
                  </Link>
                ) : null}
                <Link
                  href={shopMessagesB2bOrderContextHref(orderId)}
                  data-testid="shop-order-amend-chat-cta"
                  className="text-accent-primary font-medium hover:underline"
                >
                  Запросить в чате →
                </Link>
                {order.collectionId ? (
                  <Link
                    href={shopB2bMatrixReorderHref(order.collectionId)}
                    data-testid="shop-order-duplicate-matrix-cta"
                    className="text-accent-primary font-medium hover:underline"
                  >
                    Повторить в матрице →
                  </Link>
                ) : null}
              </div>
            </CardContent>
          </Card>
        ) : null}
        {variant === 'shop' && poHandedOff && productionPillar ? (
          <Card
            id="order-production"
            data-testid="shop-op-order-status-eta-card"
            data-audit-legacy="shop-order-production-eta-card"
            className="scroll-mt-24 border-sky-200/80 bg-sky-50/30"
          >
            <CardContent className="flex flex-wrap items-center justify-between gap-2 py-3 text-xs">
              <div>
                <p className="text-text-muted text-[10px] font-bold uppercase">
                  Ожидаемая отгрузка
                </p>
                <p className="font-semibold tabular-nums">
                  {order.requestedDeliveryDate ?? 'Уточняется с брендом'}
                </p>
                <p className="text-text-muted mt-0.5">
                  Коллекция {getPlatformCoreCollectionLabel(collectionId)}
                  {chain?.poStatusLabelRu ? ` · ${chain.poStatusLabelRu}` : ''}
                </p>
              </div>
              {!coreSlim ? (
                <p className="text-text-muted text-[10px]">
                  Статус цепочки и логистика — в трекинге и календаре (ссылки выше и внизу
                  карточки).
                </p>
              ) : null}
            </CardContent>
          </Card>
        ) : null}
        {poId ? (
          <Card
            id={variant === 'shop' ? 'order-production-po' : undefined}
            data-testid="platform-core-order-po-card"
            className={
              poHandedOff ? 'border-emerald-200/80 bg-emerald-50/30' : 'border-amber-200/60'
            }
          >
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center gap-2 text-sm font-bold">
                <Factory className="h-4 w-4 text-emerald-600" aria-hidden />
                Производственный заказ (PO)
              </CardTitle>
              <CardDescription className="text-xs">
                {coreSlim
                  ? poHandedOff
                    ? (chain?.poStatusLabelRu ?? PRODUCTION_HANDOFF_DONE_RU)
                    : PRODUCTION_HANDOFF_PENDING_RU
                  : poHandedOff
                    ? chain?.poStatusLabelRu
                      ? `${PRODUCTION_HANDOFF_DONE_RU} · ${chain.poStatusLabelRu}.`
                      : `${PRODUCTION_HANDOFF_DONE_RU} — производственный заказ в очереди цеха.`
                    : `Производственный заказ зарезервирован — ${PRODUCTION_HANDOFF_PENDING_RU.toLowerCase()}.`}
              </CardDescription>
            </CardHeader>
            <CardContent className="flex flex-wrap items-center gap-2 text-xs">
              {variant === 'brand' && poHandedOff ? (
                <Link
                  href={factoryProductionOrdersOrderContextHref(orderId, {
                    factoryId: chain?.factoryId ?? demo.factoryId,
                  })}
                  className="text-accent-primary font-mono text-[10px] font-semibold hover:underline"
                  data-testid="platform-core-order-po"
                >
                  {poId}
                </Link>
              ) : (
                <code
                  className="font-mono text-[10px] font-semibold"
                  data-testid="platform-core-order-po"
                >
                  {poId}
                </code>
              )}
              <Badge variant={poHandedOff ? 'default' : 'outline'}>
                {poHandedOff
                  ? (chain?.poStatusLabelRu ?? PRODUCTION_HANDOFF_QUEUE_RU)
                  : PRODUCTION_HANDOFF_PENDING_RU}
              </Badge>
              {chain?.factoryId ? (
                <span className="text-text-muted">· {chain.factoryId}</span>
              ) : null}
              {variant === 'brand' ? (
                <>
                  <Link
                    href={factoryProductionHandoffQueueHref(orderId, {
                      factoryId: chain?.factoryId ?? demo.factoryId,
                      collectionId,
                    })}
                    data-testid="brand-order-detail-factory-queue-link"
                    className="text-accent-primary font-medium hover:underline"
                  >
                    Очередь цеха
                  </Link>
                </>
              ) : (
                <Link
                  href={shopB2bTrackingOrderHref(orderId)}
                  data-testid="shop-op-order-status-po-tracking-link"
                  data-audit-legacy="shop-order-po-tracking-link"
                  className="text-accent-primary font-medium hover:underline"
                >
                  Трекинг заказа →
                </Link>
              )}
            </CardContent>
          </Card>
        ) : null}

        <Card>
          <CardHeader className="sr-only">
            <CardTitle>Оптовый заказ · {orderId}</CardTitle>
          </CardHeader>
          <CardContent className="grid gap-3 text-sm sm:grid-cols-2 lg:grid-cols-3">
            <div>
              <p className="text-text-muted text-[10px] font-bold uppercase">Статус</p>
              <Badge variant="outline" data-testid="platform-core-order-status">
                {order.statusLabelRu}
              </Badge>
            </div>
            <div>
              <p className="text-text-muted text-[10px] font-bold uppercase">Партнёр</p>
              <p className="font-medium">{order.buyerLabelRu}</p>
            </div>
            <div>
              <p className="text-text-muted text-[10px] font-bold uppercase">Коллекция</p>
              <p className="font-medium">{order.collectionId ?? '—'}</p>
            </div>
            <div>
              <p className="text-text-muted text-[10px] font-bold uppercase">Артикул</p>
              <Link href={articleHref} className="text-accent-primary font-medium hover:underline">
                {articleId}
              </Link>
            </div>
            <div>
              <p className="text-text-muted text-[10px] font-bold uppercase">Сумма</p>
              <p className="font-black tabular-nums" data-testid="platform-core-order-total">
                {order.totalRub.toLocaleString('ru-RU')} ₽
              </p>
            </div>
            <div>
              <p className="text-text-muted text-[10px] font-bold uppercase">Отгрузка</p>
              <p>{order.requestedDeliveryDate ?? '—'}</p>
            </div>
            {order.paymentTermsLabelRu ? (
              <div>
                <p className="text-text-muted text-[10px] font-bold uppercase">Оплата</p>
                <p>{order.paymentTermsLabelRu}</p>
              </div>
            ) : null}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm">Строки заказа</CardTitle>
          </CardHeader>
          <CardContent className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Артикул</TableHead>
                  <TableHead>Цвет</TableHead>
                  <TableHead>Размер</TableHead>
                  <TableHead className="text-right">Qty</TableHead>
                  <TableHead className="text-right">Опт, ₽</TableHead>
                  <TableHead className="text-right">Сумма</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {order.lines.map((line, idx) => (
                  <TableRow key={`${line.articleId}-${line.size}-${idx}`}>
                    <TableCell className="font-medium">{line.articleId}</TableCell>
                    <TableCell>{line.colorCode}</TableCell>
                    <TableCell>{line.size}</TableCell>
                    <TableCell className="text-right tabular-nums">{line.qty}</TableCell>
                    <TableCell className="text-right tabular-nums">
                      {line.wholesalePriceRub.toLocaleString('ru-RU')}
                    </TableCell>
                    <TableCell className="text-right tabular-nums">
                      {(line.qty * line.wholesalePriceRub).toLocaleString('ru-RU')}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
