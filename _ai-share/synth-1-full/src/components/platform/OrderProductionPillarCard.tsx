'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { CheckCircle2, Circle, Package } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { PlatformCoreChainStatusRefreshBadge } from '@/components/platform/PlatformCoreChainStatusRefreshBadge';
import { usePlatformCoreChainStatusPoll } from '@/hooks/use-platform-core-chain-status-poll';
import { usePlatformCoreDemoContext } from '@/components/platform/usePlatformCoreChainOverview';
import { useSpineActiveWholesaleOrderId } from '@/hooks/use-spine-active-wholesale-order-id';
import { usePillarSnapshot } from '@/hooks/use-pillar-snapshot';
import { pickOrderProductionSnapshot } from '@/lib/platform-core-pillar-snapshot.types';
import { isIntegrationImportedWholesaleOrderId } from '@/lib/integrations/spine/integration-ui-utils';
import { BrandOrderShipmentSpineStrip } from '@/components/integrations/BrandOrderShipmentSpineStrip';
import { BrandAllocationSpinePanel } from '@/components/integrations/BrandAllocationSpinePanel';
import {
  brandB2bOrderHandoffContextHref,
  brandB2bOrderHref,
  brandB2bOrdersProductionRegistryHref,
  brandMessagesB2bOrderContextHref,
  factoryProductionDossierContextHref,
  factoryMessagesB2bOrderContextHref,
  factoryProductionOrdersOrderContextHref,
  shopB2bTrackingOrderHref,
} from '@/lib/routes';
import {
  factoryHandoffQueueHrefForDemo,
  factoryMaterialsProcurementHrefForDemo,
  getPlatformCoreDemo,
} from '@/lib/platform-core-hub-matrix';
import { resolvePlatformCoreCabinetOrderId } from '@/lib/platform-core-spine-active-order-fallback';
import { ManufacturerSpineWipCabinetStrip } from '@/components/integrations/ManufacturerSpineWipCabinetStrip';
import { hubGadget } from '@/components/platform/platform-core-hub-gadget-styles';
import { PillarInsightHeader } from '@/components/platform/PillarInsightPrimitives';
import { PlatformCorePillarInsightSkeleton } from '@/components/platform/PlatformCorePillarInsightSkeleton';
import { isPlatformCoreMode } from '@/lib/cabinet-core-mode';
import {
  formatPlatformCoreWmsReserveBrandBadgeRu,
  formatPlatformCoreWmsReserveCabinetLongRu,
} from '@/lib/platform-core-wms-reserve-copy';
import { cn } from '@/lib/utils';
import { BrandOpCabinetSpinePeerStrip } from '@/components/platform/BrandOpCabinetSpinePeerStrip';
import { MfrOpCabinetSpinePeerStrip } from '@/components/factory/MfrOpCabinetSpinePeerStrip';

type HandoffItem = {
  b2bOrderId: string;
  productionOrderId: string;
  articleId?: string;
};

type Props = {
  variant: 'brand' | 'manufacturer';
  /** @deprecated Hub всегда compact; prop сохранён для совместимости. */
  compact?: boolean;
};

const linkClass = 'text-accent-primary text-xs font-medium hover:underline';

const OP_RESOLVE_BRAND = ['w2_registry', 'handoff', 'allocation', 'operational'] as const;
const OP_RESOLVE_MFR = ['w2_registry', 'handoff', 'allocation'] as const;

export function OrderProductionPillarCard({ variant, compact = false }: Props) {
  const demo = usePlatformCoreDemoContext();
  const { demoOrderId: fallbackOrderId, factoryId, collectionId, demoArticleId } = demo;
  const w2Fallback = fallbackOrderId.startsWith('__') ? '' : fallbackOrderId;
  const [spineReload, setSpineReload] = useState(0);

  const { activeOrderId: orderId } = useSpineActiveWholesaleOrderId({
    fallbackOrderId: w2Fallback,
    collectionId,
    resolveFrom: variant === 'brand' ? OP_RESOLVE_BRAND : OP_RESOLVE_MFR,
    actorRole: variant === 'brand' ? 'brand' : undefined,
    factoryId,
    reloadNonce: spineReload,
  });

  const canonicalDemoOrderId = getPlatformCoreDemo(collectionId).demoOrderId;
  const cabinetOrderId = resolvePlatformCoreCabinetOrderId(orderId || w2Fallback, canonicalDemoOrderId);
  const demoWithOrder = { ...demo, demoOrderId: cabinetOrderId };
  const handoffQueueHref = factoryHandoffQueueHrefForDemo(demoWithOrder);
  const hasActiveOrder = orderId.trim().length > 0;
  const isSpineActive = isIntegrationImportedWholesaleOrderId(orderId);
  const pollOrderIds = orderId.trim() ? [orderId] : [];
  const chainPollEnabled = pollOrderIds.length > 0;
  const { tick: chainPollTick, sseConnected } = usePlatformCoreChainStatusPoll(
    chainPollEnabled,
    pollOrderIds
  );

  useEffect(() => {
    setSpineReload(chainPollTick);
  }, [chainPollTick]);

  const roleId = variant === 'manufacturer' ? 'manufacturer' : 'brand';
  const { snapshot, loading: snapshotLoading } = usePillarSnapshot({
    collectionId,
    pillarId: 'order_production',
    roleId,
    pillarVariant: variant,
    wholesaleOrderId: orderId || undefined,
    factoryId,
    reloadNonce: chainPollTick,
  });
  const op = pickOrderProductionSnapshot(snapshot);
  const chainSteps = op?.chainSteps ?? [];
  const handoffItems: HandoffItem[] = op?.handoffItems ?? [];
  const productionOrderId = op?.productionOrderId ?? undefined;
  const bomLineCount = op?.bomLineCount ?? null;

  const manufacturerStepIds = new Set(['inventory_reserved', 'production_po', 'materials_supplied']);
  const materialsSuppliedDone =
    chainSteps.find((s) => s.id === 'materials_supplied')?.done === true;
  const inventoryReservedDone =
    chainSteps.find((s) => s.id === 'inventory_reserved')?.done === true;
  const steps =
    variant === 'manufacturer'
      ? chainSteps.filter((s) => manufacturerStepIds.has(s.id))
      : chainSteps;

  const panelTestId =
    variant === 'brand' ? 'brand-op-cabinet-panel' : 'mfr-op-cabinet-panel';
  const coreSlim = isPlatformCoreMode();

  if (compact && snapshotLoading && !op) {
    return (
      <PlatformCorePillarInsightSkeleton
        testId={`${variant === 'brand' ? 'brand' : 'mfr'}-op-pillar-insight-skeleton`}
      />
    );
  }

  return (
    <Card
      data-testid={panelTestId}
      data-audit-legacy="order-production-pillar-card"
      data-variant={variant}
      data-active-order-id={orderId}
      data-spine-order={isSpineActive ? 'true' : 'false'}
      className={cn(compact ? hubGadget.pillarCard : 'border-amber-200/50')}
    >
      <CardContent className={cn(compact ? hubGadget.pillarBody : 'space-y-2 p-3')}>
        {compact ? (
          <PillarInsightHeader
            icon={Package}
            title="Заказ → производство"
            subtitle={
              variant === 'brand'
                ? 'Handoff, PO и статус серии у цеха.'
                : 'Очередь PO и WIP по wholesale-заказу.'
            }
          />
        ) : null}
        {!compact ? (
          variant === 'brand' ? (
            <PlatformCoreChainStatusRefreshBadge
              sseConnected={sseConnected}
              enabled={chainPollEnabled}
              sseTestId="brand-op-cabinet-sse-live-badge"
              pollTestId="brand-op-cabinet-poll-badge"
              sseLegacyTestId="brand-op-chain-sse-live-badge"
            />
          ) : (
            <PlatformCoreChainStatusRefreshBadge
              sseConnected={sseConnected}
              enabled={chainPollEnabled}
              sseTestId="mfr-op-cabinet-sse-live-badge"
              pollTestId="mfr-op-cabinet-poll-badge"
            />
          )
        ) : null}
        <ul
          className="space-y-1.5"
          data-testid={
            variant === 'brand' ? 'brand-op-cabinet-chain-steps' : 'mfr-op-cabinet-chain-steps'
          }
          data-audit-legacy={variant === 'brand' ? 'brand-op-chain-steps' : undefined}
        >
          {!hasActiveOrder && steps.length === 0 ? (
            <li className="text-muted-foreground text-[10px]">
              {compact ? 'Нет активного заказа.' : 'Нет активного wholesale-заказа — шаги после confirm/handoff.'}
            </li>
          ) : null}
          {steps.map((step) => (
            <li
              key={step.id}
              className="flex flex-wrap items-start gap-x-2 gap-y-0.5 text-xs"
              data-testid={`platform-core-chain-step-${step.id}`}
              data-done={step.done ? 'true' : 'false'}
            >
              {step.done ? (
                <CheckCircle2 className="mt-0.5 h-3.5 w-3.5 shrink-0 text-emerald-600" aria-hidden />
              ) : (
                <Circle className="text-text-muted mt-0.5 h-3.5 w-3.5 shrink-0" aria-hidden />
              )}
              <span>{step.labelRu}</span>
              {step.id === 'materials_supplied' && step.done ? (
                variant === 'brand' ? (
                  <Link
                    href={factoryMaterialsProcurementHrefForDemo(demoWithOrder, { role: 'supplier' })}
                    data-testid="brand-op-cabinet-materials-step-link"
                    className="text-accent-primary text-[10px] font-medium hover:underline"
                  >
                    Закупка
                  </Link>
                ) : (
                  <Link
                    href={factoryMaterialsProcurementHrefForDemo(demoWithOrder)}
                    data-testid="mfr-op-cabinet-materials-step-link"
                    className="text-accent-primary text-[10px] font-medium hover:underline"
                  >
                    Материалы
                  </Link>
                )
              ) : null}
            </li>
          ))}
        </ul>
        {variant === 'brand' && hasActiveOrder && compact ? (
          <p className="text-text-muted text-[10px]" data-testid="brand-op-cabinet-sot-strip">
            Hub insight · полные факты в{' '}
            <Link
              href={brandB2bOrderHref(cabinetOrderId)}
              className="text-accent-primary font-medium hover:underline"
              data-testid="brand-op-cabinet-order-detail-sot-link"
            >
              карточке заказа
            </Link>
            {' · '}список в{' '}
            <Link
              href={brandB2bOrdersProductionRegistryHref(cabinetOrderId)}
              className="text-accent-primary font-medium hover:underline"
              data-testid="brand-op-cabinet-registry-sot-link"
            >
              реестре
            </Link>
          </p>
        ) : null}
        {variant === 'brand' && productionOrderId ? (
          <Link
            href={factoryProductionOrdersOrderContextHref(cabinetOrderId, { factoryId })}
            className="inline-flex"
            data-testid="brand-op-po-id-badge"
          >
            <Badge
              variant="outline"
              className={
                compact
                  ? hubGadget.metaBadge
                  : 'h-4 border-emerald-200 bg-emerald-50 px-1.5 font-mono text-[9px] text-emerald-900 hover:bg-emerald-100'
              }
            >
              PO {productionOrderId}
            </Badge>
          </Link>
        ) : null}
        {variant === 'brand' && chainSteps.some((s) => s.id === 'inventory_reserved') && !compact ? (
          <Badge
            variant="outline"
            data-testid="brand-op-cabinet-wms-reserve-badge"
            className={
              compact
                ? hubGadget.metaBadge
                : inventoryReservedDone
                  ? 'h-4 border-emerald-200 bg-emerald-50 px-1.5 text-[9px] text-emerald-800'
                  : 'h-4 border-amber-200 bg-amber-50 px-1.5 text-[9px] text-amber-800'
            }
          >
            {formatPlatformCoreWmsReserveBrandBadgeRu(inventoryReservedDone)}
          </Badge>
        ) : null}
        {variant === 'brand' && bomLineCount != null && bomLineCount > 0 && !compact ? (
          <Badge
            variant="outline"
            data-testid="brand-op-bom-preview-badge"
            className={
              materialsSuppliedDone || !chainSteps.some((s) => s.id === 'materials_supplied')
                ? 'h-4 border-emerald-200 bg-emerald-50 px-1.5 text-[9px] text-emerald-800'
                : 'h-4 border-amber-200 bg-amber-50 px-1.5 text-[9px] text-amber-800'
            }
          >
            BOM {bomLineCount}
            {chainSteps.some((s) => s.id === 'materials_supplied')
              ? materialsSuppliedDone
                ? ' · материалы ✓'
                : ' · материалы…'
              : ''}
          </Badge>
        ) : null}
        {variant === 'manufacturer' && productionOrderId ? (
          <Link
            href={factoryProductionOrdersOrderContextHref(cabinetOrderId, { factoryId })}
            className="inline-flex"
            data-testid="mfr-op-cabinet-po-badge"
          >
            <Badge
              variant="outline"
              className="h-4 border-emerald-200 bg-emerald-50 px-1.5 font-mono text-[9px] text-emerald-900 hover:bg-emerald-100"
            >
              PO {productionOrderId}
            </Badge>
          </Link>
        ) : null}
        {variant === 'manufacturer' && chainSteps.some((s) => s.id === 'materials_supplied') ? (
          <Badge
            variant="outline"
            data-testid="mfr-op-cabinet-materials-badge"
            className={
              compact
                ? cn(
                    'h-4 px-1.5 text-[9px]',
                    materialsSuppliedDone
                      ? 'border-emerald-200 bg-emerald-50 text-emerald-800'
                      : 'border-amber-200 bg-amber-50 text-amber-800'
                  )
                : materialsSuppliedDone
                  ? 'h-4 border-emerald-200 bg-emerald-50 px-1.5 text-[9px] text-emerald-800'
                  : 'h-4 border-amber-200 bg-amber-50 px-1.5 text-[9px] text-amber-800'
            }
          >
            {materialsSuppliedDone ? 'Материалы подтверждены' : 'Ожидает поставку материалов'}
          </Badge>
        ) : null}
        {variant === 'manufacturer' && chainSteps.some((s) => s.id === 'inventory_reserved') ? (
          <Badge
            variant="outline"
            data-testid="mfr-op-cabinet-wms-reserve-badge"
            data-audit-legacy="mfr-op-wms-reserve-badge"
            data-reserve-sse-live={sseConnected ? '1' : '0'}
            className={cn(
              compact ? 'h-4 px-1.5 text-[9px]' : 'h-4 px-1.5 text-[9px]',
              inventoryReservedDone
                ? 'border-emerald-200 bg-emerald-50 text-emerald-800'
                : 'border-amber-200 bg-amber-50 text-amber-800'
            )}
          >
            {formatPlatformCoreWmsReserveCabinetLongRu(inventoryReservedDone, 'manufacturer')}
          </Badge>
        ) : null}
        {variant === 'manufacturer' && !compact ? (
          <ManufacturerSpineWipCabinetStrip factoryId={factoryId} />
        ) : null}
        {variant === 'brand' && isSpineActive && !compact ? (
          <div className="space-y-2 border-t border-amber-100/80 pt-2" data-testid="brand-op-spine-strips">
            <BrandAllocationSpinePanel orderId={orderId} />
            <BrandOrderShipmentSpineStrip orderId={orderId} />
          </div>
        ) : null}
        {variant === 'manufacturer' && handoffItems.length > 0 ? (
          <ul
            className={cn(
              'space-y-1',
              compact ? 'border-t border-amber-100/60 pt-1.5' : 'border-t border-amber-100/80 pt-2'
            )}
            data-testid="mfr-op-queue-snippet"
          >
            {handoffItems.length > 3 ? (
              <li>
                <Link
                  href={factoryProductionOrdersOrderContextHref(cabinetOrderId, { factoryId })}
                  data-testid="mfr-op-all-production-orders-link"
                  className="text-accent-primary text-[10px] font-medium hover:underline"
                >
                  Все производственные заказы ({handoffItems.length}) →
                </Link>
              </li>
            ) : null}
            {handoffItems.slice(0, 3).map((item) => (
              <li key={item.productionOrderId} className="flex flex-wrap items-center gap-x-2 gap-y-0.5">
                <Link
                  href={
                    item.b2bOrderId
                      ? factoryProductionOrdersOrderContextHref(item.b2bOrderId, { factoryId })
                      : handoffQueueHref
                  }
                  className={linkClass}
                  data-testid={`mfr-op-queue-po-${item.productionOrderId}`}
                >
                  {item.productionOrderId}
                </Link>
                {item.b2bOrderId && !coreSlim ? (
                  <Link
                    href={factoryMessagesB2bOrderContextHref(item.b2bOrderId, {
                      role: 'manufacturer',
                    })}
                    className="text-accent-primary text-[10px] font-medium hover:underline"
                    data-testid={`mfr-op-queue-chat-${item.b2bOrderId}`}
                  >
                    Чат
                  </Link>
                ) : null}
              </li>
            ))}
          </ul>
        ) : null}
        <div className={compact ? undefined : 'space-y-1.5 border-t border-amber-100/80 pt-2'}>
          {compact && hasActiveOrder ? (
            <div
              className={hubGadget.goldenPath}
              data-testid={
                variant === 'brand' ? 'brand-op-cabinet-cta-strip' : 'mfr-op-cabinet-cta-strip'
              }
            >
              {variant === 'brand' ? (
                <>
                  <Link
                    href={brandB2bOrdersProductionRegistryHref(cabinetOrderId)}
                    data-testid="brand-op-cabinet-registry-link"
                    className={hubGadget.goldenLink}
                  >
                    Реестр
                  </Link>
                  <span className={hubGadget.goldenSep} aria-hidden>
                    ·
                  </span>
                  <Link
                    href={brandB2bOrderHandoffContextHref(cabinetOrderId)}
                    className={hubGadget.goldenLink}
                    data-testid="brand-op-cabinet-handoff-link"
                  >
                    Передача
                  </Link>
                  <span className={hubGadget.goldenSep} aria-hidden>
                    ·
                  </span>
                  <Link
                    href={shopB2bTrackingOrderHref(cabinetOrderId)}
                    data-testid="brand-op-cabinet-tracking-link"
                    className={hubGadget.goldenLink}
                  >
                    Трекинг
                  </Link>
                </>
              ) : (
                <>
                  <Link
                    href={handoffQueueHref}
                    className={hubGadget.goldenLink}
                    data-testid="mfr-op-cabinet-handoff-link"
                  >
                    Очередь
                  </Link>
                  <span className={hubGadget.goldenSep} aria-hidden>
                    ·
                  </span>
                  <Link
                    href={factoryProductionDossierContextHref(demoArticleId, {
                      collectionId,
                      orderId: cabinetOrderId,
                    })}
                    data-testid="mfr-op-cabinet-dossier-link"
                    className={hubGadget.goldenLink}
                  >
                    Досье
                  </Link>
                  <span className={hubGadget.goldenSep} aria-hidden>
                    ·
                  </span>
                  <Link
                    href={shopB2bTrackingOrderHref(cabinetOrderId)}
                    data-testid="mfr-op-cabinet-tracking-link"
                    className={hubGadget.goldenLink}
                  >
                    Трекинг
                  </Link>
                </>
              )}
            </div>
          ) : (
            <div
              className="flex flex-wrap gap-x-3 gap-y-1"
              data-testid={
                variant === 'brand' ? 'brand-op-cabinet-cta-strip' : 'mfr-op-cabinet-cta-strip'
              }
            >
          {variant === 'brand' && hasActiveOrder ? (
            <>
              <Link
                href={brandB2bOrdersProductionRegistryHref(cabinetOrderId)}
                data-testid="brand-op-cabinet-registry-link"
                className={linkClass}
              >
                Реестр
              </Link>
              <Link
                href={brandB2bOrderHandoffContextHref(cabinetOrderId)}
                className={linkClass}
                data-testid="brand-op-cabinet-handoff-link"
              >
                Передача
              </Link>
              <Link
                href={shopB2bTrackingOrderHref(cabinetOrderId)}
                data-testid="brand-op-cabinet-tracking-link"
                className={linkClass}
              >
                Трекинг
              </Link>
              {!coreSlim ? (
                <Link
                  href={brandMessagesB2bOrderContextHref(cabinetOrderId)}
                  data-testid="brand-op-cabinet-chat-link"
                  className={linkClass}
                >
                  Чат
                </Link>
              ) : null}
            </>
          ) : variant === 'manufacturer' ? (
            <>
              <Link
                href={handoffQueueHref}
                className={linkClass}
                data-testid="mfr-op-cabinet-handoff-link"
              >
                Очередь
              </Link>
              <Link
                href={factoryProductionOrdersOrderContextHref(cabinetOrderId, { factoryId })}
                data-testid="mfr-op-cabinet-prod-orders-link"
                className={linkClass}
              >
                Заказы цеха
              </Link>
              <Link
                href={factoryMaterialsProcurementHrefForDemo(demoWithOrder)}
                data-testid="mfr-op-cabinet-materials-link"
                className={linkClass}
              >
                Закупка
              </Link>
              <Link
                href={factoryProductionDossierContextHref(demoArticleId, {
                  collectionId,
                  orderId: cabinetOrderId,
                })}
                data-testid="mfr-op-cabinet-dossier-link"
                className={linkClass}
              >
                Досье
              </Link>
              <Link
                href={shopB2bTrackingOrderHref(cabinetOrderId)}
                data-testid="mfr-op-cabinet-tracking-link"
                className={linkClass}
              >
                Трекинг
              </Link>
              {!coreSlim ? (
                <Link
                  href={factoryMessagesB2bOrderContextHref(cabinetOrderId, { role: 'manufacturer' })}
                  data-testid="mfr-op-cabinet-chat-link"
                  className={linkClass}
                >
                  Чат
                </Link>
              ) : null}
            </>
          ) : null}
            </div>
          )}
          {compact && variant === 'brand' && hasActiveOrder ? (
            <BrandOpCabinetSpinePeerStrip orderId={cabinetOrderId} collectionId={collectionId} />
          ) : null}
          {compact && variant === 'manufacturer' && hasActiveOrder ? (
            <MfrOpCabinetSpinePeerStrip
              orderId={cabinetOrderId}
              collectionId={collectionId}
              factoryId={factoryId}
              articleId={demoArticleId}
            />
          ) : null}
        </div>
      </CardContent>
    </Card>
  );
}
