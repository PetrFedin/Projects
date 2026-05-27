'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { Package, PackageCheck, Truck } from 'lucide-react';
import {
  fetchWorkshop2SampleOrders,
  postWorkshop2SampleOrderMovementApi,
  type Workshop2SampleOrderDto,
} from '@/lib/production/workshop2-sample-api-client';
import {
  WORKSHOP2_SAMPLE_MOVEMENT_LABELS_RU,
  getNextWorkshop2SampleMovementStatus,
  type Workshop2SampleGoodsMovementStatus,
} from '@/lib/production/workshop2-sample-goods-movement';
import { workshop2MobileInspectorHref } from '@/lib/production/workshop2-mobile-inspector-checklist';
import { workshop2ContextToProductionFloorFromSampleOrder } from '@/lib/production/workshop2-floor-bridge';
import { useToast } from '@/hooks/use-toast';
import type { Workshop2DossierPhase1 } from '@/lib/production/workshop2-dossier-phase1.types';
import { summarizeWorkshop2SampleMovementStatus } from '@/lib/production/workshop2-sample-movement-status';
import { WORKSHOP2_SURFACE_BANNER_INLINE_HINT_CLASS } from '@/lib/production/workshop2-surface-banner-tokens';
import {
  Workshop2OperationalMetaChips,
  Workshop2OperationalPanelChrome,
  Workshop2OperationalPanelShell,
} from '@/components/brand/production/workshop2-operational-panel-chrome';

type Props = {
  collectionId: string;
  articleId: string;
  articleUrlSegment?: string;
  dossier?: Workshop2DossierPhase1 | null;
};

export function Workshop2SampleGoodsMovementPanel({
  collectionId,
  articleId,
  articleUrlSegment,
  dossier,
}: Props) {
  const { toast } = useToast();
  const [orders, setOrders] = useState<Workshop2SampleOrderDto[]>([]);
  const [loading, setLoading] = useState(false);
  const [wmsReleaseHint, setWmsReleaseHint] = useState<string | null>(null);

  const reload = useCallback(async () => {
    setLoading(true);
    try {
      setOrders(await fetchWorkshop2SampleOrders(collectionId, articleId));
    } finally {
      setLoading(false);
    }
  }, [collectionId, articleId]);

  useEffect(() => {
    void reload();
  }, [reload]);

  const active = orders[0];
  const movement: Workshop2SampleGoodsMovementStatus = active?.movementStatus ?? 'created';
  const next = getNextWorkshop2SampleMovementStatus(movement);

  const movementStatus = useMemo(
    () =>
      summarizeWorkshop2SampleMovementStatus({
        hasSampleOrder: Boolean(active),
        movement,
        movementLogEntries: active?.movementLog?.length ?? 0,
        dossier,
      }),
    [active, dossier, movement]
  );

  const handleAdvance = async () => {
    if (!active || !next) return;
    const res = await postWorkshop2SampleOrderMovementApi({
      collectionId,
      articleId,
      orderId: active.id,
      target: next,
    });
    if (!res.ok) {
      toast({
        title: 'Переход заблокирован',
        description: res.messageRu ?? res.intakeMissing?.[0] ?? 'Проверьте Sample Intake',
        variant: 'destructive',
      });
      return;
    }
    if (res.wmsRelease?.messageRu) {
      setWmsReleaseHint(res.wmsRelease.messageRu);
    }
    toast({
      title: 'Движение обновлено',
      description: res.wmsRelease?.messageRu ?? WORKSHOP2_SAMPLE_MOVEMENT_LABELS_RU[next],
    });
    void reload();
  };

  const floorHref =
    articleUrlSegment?.trim() &&
    active &&
    workshop2ContextToProductionFloorFromSampleOrder(
      { collectionId, articleLineId: articleUrlSegment.trim() },
      active.status
    );

  const inspectorHref =
    active && workshop2MobileInspectorHref({ collectionId, articleId, orderId: active.id });

  const StatusIcon =
    movement === 'received' ? PackageCheck : movement === 'in_transit' ? Truck : Package;

  return (
    <Workshop2OperationalPanelShell data-testid="workshop2-sample-movement-panel">
      <Workshop2OperationalPanelChrome
        icon={StatusIcon}
        title="Движение образца"
        description="created → in_transit → received · синхронизация с заказом и Sample Intake"
        meta={
          <Workshop2OperationalMetaChips
            summary={movementStatus.hintRu}
            readiness={WORKSHOP2_SAMPLE_MOVEMENT_LABELS_RU[movement]}
            nextAction={
              active
                ? movementStatus.next
                  ? `→ ${WORKSHOP2_SAMPLE_MOVEMENT_LABELS_RU[movementStatus.next]}`
                  : 'Принят на склад'
                : 'Создайте заказ образца'
            }
            blockers={
              movementStatus.state === 'intake_blocked' && movementStatus.hintRu
                ? [movementStatus.hintRu]
                : undefined
            }
          />
        }
        actions={
          <Badge variant="outline" className="text-[10px]">
            {loading ? '…' : WORKSHOP2_SAMPLE_MOVEMENT_LABELS_RU[movement]}
          </Badge>
        }
      />

      {!active ? (
        <p className="text-text-secondary text-[11px]">
          Создайте заказ образца на вкладке «Примерка».
        </p>
      ) : (
        <>
          <p className="text-text-muted font-mono text-[10px]">
            Заказ {active.id.slice(0, 8)} · qty {active.quantity}
          </p>
          <div className="flex flex-wrap gap-2">
            {next ? (
              <Button
                type="button"
                size="sm"
                className="h-8 text-[11px]"
                data-testid="workshop2-sample-movement-advance"
                onClick={() => void handleAdvance()}
              >
                → {WORKSHOP2_SAMPLE_MOVEMENT_LABELS_RU[next]}
              </Button>
            ) : (
              <Badge className="bg-emerald-100 text-emerald-800">Принят на склад</Badge>
            )}
            {inspectorHref ? (
              <Button type="button" size="sm" variant="outline" className="h-8 text-[11px]" asChild>
                <Link href={inspectorHref}>Мобильный инспектор</Link>
              </Button>
            ) : null}
            {floorHref ? (
              <Button type="button" size="sm" variant="ghost" className="h-8 text-[11px]" asChild>
                <Link href={floorHref}>Пол цеха</Link>
              </Button>
            ) : null}
          </div>
          {movement === 'received' && dossier?.goldSampleStatus?.status !== 'approved' ? (
            <p className={WORKSHOP2_SURFACE_BANNER_INLINE_HINT_CLASS}>
              Образец на складе — для серии утвердите эталон (gold sample) во вкладке «Примерка».
            </p>
          ) : null}
          {movement === 'received' && wmsReleaseHint ? (
            <p
              className={WORKSHOP2_SURFACE_BANNER_INLINE_HINT_CLASS}
              data-testid="workshop2-movement-wms-release-hint"
            >
              WMS: {wmsReleaseHint}
            </p>
          ) : null}
          {active.movementLog && active.movementLog.length > 0 ? (
            <ul className="text-text-muted space-y-0.5 border-t border-dotted pt-2 text-[10px]">
              {active.movementLog.slice(-3).map((e, i) => (
                <li key={`${e.at}-${i}`}>
                  {e.from} → {e.to} · {new Date(e.at).toLocaleString('ru-RU')}
                </li>
              ))}
            </ul>
          ) : null}
        </>
      )}
    </Workshop2OperationalPanelShell>
  );
}
