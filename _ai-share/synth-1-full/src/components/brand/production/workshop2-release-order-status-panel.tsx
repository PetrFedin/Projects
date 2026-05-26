'use client';

import Link from 'next/link';
import { useState } from 'react';
import { AlertCircle, Package, RefreshCw } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import type { Workshop2SampleOrderDto } from '@/lib/production/workshop2-sample-api-client';
import { postWorkshop2SampleOrderMovementApi, postWorkshop2SampleOrderTransitionApi } from '@/lib/production/workshop2-sample-api-client';
import {
  labelWorkshop2SampleMovementStatusRu,
  labelWorkshop2SampleOrderStatusRu,
} from '@/lib/production/workshop2-release-production-display';
import { summarizeWorkshop2SampleOrderStatus } from '@/lib/production/workshop2-sample-order-status';
import { getNextWorkshop2SampleOrderStatus } from '@/lib/production/workshop2-sample-order-transitions';
import { emptyWorkshop2DossierPhase1 } from '@/lib/production/workshop2-phase1-dossier-storage';
import type { Workshop2DossierPhase1 } from '@/lib/production/workshop2-dossier-phase1.types';
import { workshop2ContextToProductionFloorFromSampleOrder } from '@/lib/production/workshop2-floor-bridge';
import { workshop2ArticleHref, W2_ARTICLE_SECTION_DOM } from '@/lib/production/workshop2-url';
import { useToast } from '@/hooks/use-toast';
import { getNextWorkshop2SampleMovementStatus } from '@/lib/production/workshop2-sample-goods-movement';

type Props = {
  dossier: Workshop2DossierPhase1 | null;
  collectionId: string;
  articleUrlSegment: string;
  categoryLeafId?: string;
  orders: Workshop2SampleOrderDto[];
  activeOrder: Workshop2SampleOrderDto | null;
  ordersLoading: boolean;
  onOrderUpdated?: (order: Workshop2SampleOrderDto) => void;
};

/** Сводка заказа образца и связь release ↔ fit (без дублирования CRUD). */
export function Workshop2ReleaseOrderStatusPanel({
  dossier,
  collectionId,
  articleUrlSegment,
  categoryLeafId,
  orders,
  activeOrder,
  ordersLoading,
  onOrderUpdated,
}: Props) {
  const { toast } = useToast();
  const [movementBusy, setMovementBusy] = useState(false);
  const [transitionBusy, setTransitionBusy] = useState(false);

  const vaultFileCount = (dossier?.vaultDocuments ?? []).filter((d) =>
    Boolean((d as { storagePath?: string }).storagePath?.trim())
  ).length;

  const sampleSummary = summarizeWorkshop2SampleOrderStatus({
    handoffInput: {
      dossier: dossier ?? emptyWorkshop2DossierPhase1(),
      categoryLeafId,
      vaultFileCount,
    },
    activeOrderCount: orders.length,
    activeOrderStatus: activeOrder?.status,
    movementStatus: activeOrder?.movementStatus,
    pgBacked: true,
  });

  const fitHref = workshop2ArticleHref(collectionId, articleUrlSegment, {
    w2pane: 'fit',
    hash: W2_ARTICLE_SECTION_DOM.fit,
  });
  const stockHref = activeOrder
    ? workshop2ArticleHref(collectionId, articleUrlSegment, {
        w2pane: 'stock',
        hash: W2_ARTICLE_SECTION_DOM.stock,
      })
    : null;
  const floorHref = workshop2ContextToProductionFloorFromSampleOrder(
    { collectionId, articleLineId: articleUrlSegment },
    activeOrder?.status
  );

  const nextMovement = activeOrder?.movementStatus
    ? getNextWorkshop2SampleMovementStatus(activeOrder.movementStatus)
    : null;

  const nextOrderStatus = activeOrder?.status
    ? getNextWorkshop2SampleOrderStatus(activeOrder.status)
    : null;

  const handleAdvanceTransition = async () => {
    if (!activeOrder || !nextOrderStatus) return;
    setTransitionBusy(true);
    try {
      const res = await postWorkshop2SampleOrderTransitionApi({
        collectionId,
        articleId: articleUrlSegment,
        orderId: activeOrder.id,
        toStatus: nextOrderStatus,
        actor: 'release-order-panel',
        note: 'Следующий шаг (wizard)',
      });
      if (res.ok && res.order) {
        onOrderUpdated?.(res.order);
        toast({
          title: 'Статус обновлён',
          description: `${labelWorkshop2SampleOrderStatusRu(res.from)} → ${labelWorkshop2SampleOrderStatusRu(res.order.status)}`,
        });
      } else {
        toast({
          title: 'Переход запрещён',
          description: res.messageRu ?? 'Проверьте allowed transitions.',
          variant: 'destructive',
        });
      }
    } finally {
      setTransitionBusy(false);
    }
  };

  const handleAdvanceMovement = async () => {
    if (!activeOrder || !nextMovement) return;
    setMovementBusy(true);
    try {
      const res = await postWorkshop2SampleOrderMovementApi({
        collectionId,
        articleId: articleUrlSegment,
        orderId: activeOrder.id,
        target: nextMovement,
      });
      if (res.ok && res.order) {
        onOrderUpdated?.(res.order);
        toast({
          title: 'Движение обновлено',
          description: labelWorkshop2SampleMovementStatusRu(res.order.movementStatus),
        });
      } else {
        toast({
          title: 'Движение не выполнено',
          description: res.messageRu ?? 'Проверьте intake и WMS.',
          variant: 'destructive',
        });
      }
    } finally {
      setMovementBusy(false);
    }
  };

  return (
    <div
      className="space-y-3 rounded-lg border border-slate-200 bg-white p-4"
      data-testid="workshop2-release-order-status-panel"
    >
      <p className="text-text-primary flex items-center gap-1.5 text-sm font-semibold">
        <Package className="h-4 w-4 text-indigo-500" />
        Статус заказа образца
      </p>

      {ordersLoading ? (
        <p className="text-text-secondary text-sm">Загрузка заказов…</p>
      ) : activeOrder ? (
        <dl className="grid gap-2 text-[11px] sm:grid-cols-2">
          <div>
            <dt className="text-text-muted">ID заказа</dt>
            <dd className="font-mono text-slate-800">{activeOrder.id}</dd>
          </div>
          <div>
            <dt className="text-text-muted">Статус заказа</dt>
            <dd>
              <Badge variant="outline">{labelWorkshop2SampleOrderStatusRu(activeOrder.status)}</Badge>
            </dd>
          </div>
          <div>
            <dt className="text-text-muted">Движение (WMS)</dt>
            <dd>
              {activeOrder.movementStatus ? (
                <Badge variant="secondary">
                  {labelWorkshop2SampleMovementStatusRu(activeOrder.movementStatus)}
                </Badge>
              ) : (
                '—'
              )}
            </dd>
          </div>
          <div>
            <dt className="text-text-muted">Кол-во / размер</dt>
            <dd>
              {activeOrder.quantity} ·{' '}
              {Object.entries(activeOrder.sizes ?? {})
                .map(([k, v]) => `${k}:${v}`)
                .join(', ') || '—'}
            </dd>
          </div>
        </dl>
      ) : (
        <p className="text-text-secondary flex items-start gap-2 text-sm">
          <AlertCircle className="mt-0.5 h-4 w-4 shrink-0 text-amber-600" />
          Активный заказ не найден. Создайте заказ на вкладке «Примерка» после прохождения handoff.
        </p>
      )}

      <p className="text-text-secondary rounded-md bg-slate-50 px-2 py-1.5 text-[10px]">
        {sampleSummary.hintRu ?? '—'}
      </p>

      {dossier?.sseRealtimeMirror ? (
        <p
          className="text-text-muted text-[10px]"
          data-testid="workshop2-release-order-sse-mirror"
        >
          Realtime: {dossier.sseRealtimeMirror.transport}
          {dossier.sseRealtimeMirror.transport === 'sse'
            ? ' · обновление без 30 с poll'
            : dossier.sseRealtimeMirror.transport === 'polling'
              ? ' · polling fallback'
              : ''}
        </p>
      ) : null}

      {activeOrder && nextOrderStatus ? (
        <div
          className="rounded-md border border-indigo-100 bg-indigo-50/50 px-3 py-2"
          data-testid="workshop2-release-order-next-step-wizard"
        >
          <p className="text-[10px] font-semibold uppercase tracking-wide text-indigo-900">
            Следующий шаг
          </p>
          <p className="text-text-secondary mt-1 text-[11px]">
            {labelWorkshop2SampleOrderStatusRu(activeOrder.status)} →{' '}
            <span className="font-medium text-indigo-800">
              {labelWorkshop2SampleOrderStatusRu(nextOrderStatus)}
            </span>
          </p>
          <Button
            type="button"
            size="sm"
            variant="default"
            className="mt-2 h-8 text-[11px]"
            disabled={transitionBusy}
            onClick={() => void handleAdvanceTransition()}
            data-testid="workshop2-release-order-advance-status"
          >
            {transitionBusy ? 'Переход…' : `Перевести в «${labelWorkshop2SampleOrderStatusRu(nextOrderStatus)}»`}
          </Button>
        </div>
      ) : null}

      {activeOrder && nextMovement ? (
        <Button
          type="button"
          size="sm"
          variant="secondary"
          className="h-8 text-[11px]"
          disabled={movementBusy}
          onClick={() => void handleAdvanceMovement()}
          data-testid="workshop2-release-order-advance-movement"
        >
          <RefreshCw className={movementBusy ? 'mr-1 h-3.5 w-3.5 animate-spin' : 'mr-1 h-3.5 w-3.5'} />
          {movementBusy ? 'Обновление…' : `Обновить movement → ${labelWorkshop2SampleMovementStatusRu(nextMovement)}`}
        </Button>
      ) : null}

      <div className="flex flex-wrap gap-2">
        <Button type="button" size="sm" variant="default" className="h-8 text-[11px]" asChild>
          <Link href={fitHref}>Управление образцом → Примерка</Link>
        </Button>
        {stockHref ? (
          <Button type="button" size="sm" variant="outline" className="h-8 text-[11px]" asChild>
            <Link href={stockHref}>Приёмка / движение</Link>
          </Button>
        ) : null}
        <Button
          type="button"
          size="sm"
          variant="secondary"
          className="h-8 text-[11px]"
          asChild
          data-testid="workshop2-release-order-floor-cta"
        >
          <Link href={floorHref}>В цех (очередь)</Link>
        </Button>
      </div>
    </div>
  );
}
