'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { CheckCircle2, Circle } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { PlatformCoreChainStatusRefreshBadge } from '@/components/platform/PlatformCoreChainStatusRefreshBadge';
import { usePlatformCoreChainStatusPoll } from '@/hooks/use-platform-core-chain-status-poll';
import { usePlatformCoreDemoContext } from '@/components/platform/usePlatformCoreChainOverview';
import { useSpineActiveWholesaleOrderId } from '@/hooks/use-spine-active-wholesale-order-id';
import { usePillarSnapshot } from '@/hooks/use-pillar-snapshot';
import { isIntegrationImportedWholesaleOrderId } from '@/lib/integrations/spine/integration-ui-utils';
import { BrandOrderShipmentSpineStrip } from '@/components/integrations/BrandOrderShipmentSpineStrip';
import { BrandAllocationSpinePanel } from '@/components/integrations/BrandAllocationSpinePanel';
import {
  brandB2bOrderChainContextHref,
  brandB2bOrderDossierContextHref,
  brandB2bOrderHandoffContextHref,
  brandB2bOrdersProductionRegistryHref,
  brandCalendarB2bOrderContextHref,
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

export function OrderProductionPillarCard({ variant }: Props) {
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
  const { snapshot } = usePillarSnapshot({
    collectionId,
    pillarId: 'order_production',
    roleId,
    pillarVariant: variant,
    wholesaleOrderId: orderId || undefined,
    factoryId,
    reloadNonce: chainPollTick,
  });
  const op = snapshot?.pillarId === 'order_production' ? snapshot.orderProduction : null;
  const chainSteps = op?.chainSteps ?? [];
  const handoffItems: HandoffItem[] = op?.handoffItems ?? [];
  const productionOrderId = op?.productionOrderId ?? undefined;
  const bomLineCount = op?.bomLineCount ?? null;
  const bomPreviewLines = op?.bomPreviewLines ?? [];

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

  return (
    <Card
      data-testid={panelTestId}
      data-audit-legacy="order-production-pillar-card"
      data-variant={variant}
      data-active-order-id={orderId}
      data-spine-order={isSpineActive ? 'true' : 'false'}
      className="border-amber-200/50"
    >
      <CardContent className="space-y-2 p-3">
        {variant === 'brand' ? (
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
        )}
        <ul
          className="space-y-1.5"
          data-testid={
            variant === 'brand' ? 'brand-op-cabinet-chain-steps' : 'mfr-op-cabinet-chain-steps'
          }
          data-audit-legacy={variant === 'brand' ? 'brand-op-chain-steps' : undefined}
        >
          {!hasActiveOrder && steps.length === 0 ? (
            <li className="text-muted-foreground text-[10px]">
              Нет активного wholesale-заказа — шаги цепочки появятся после импорта или подтверждения.
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
        {variant === 'brand' && productionOrderId ? (
          <Link
            href={factoryProductionOrdersOrderContextHref(cabinetOrderId, { factoryId })}
            className="inline-flex"
            data-testid="brand-op-po-id-badge"
          >
            <Badge
              variant="outline"
              className="h-4 border-emerald-200 bg-emerald-50 px-1.5 font-mono text-[9px] text-emerald-900 hover:bg-emerald-100"
            >
              PO {productionOrderId}
            </Badge>
          </Link>
        ) : null}
        {variant === 'brand' && chainSteps.some((s) => s.id === 'inventory_reserved') ? (
          <Badge
            variant="outline"
            data-testid="brand-op-cabinet-wms-reserve-badge"
            className={
              inventoryReservedDone
                ? 'h-4 border-emerald-200 bg-emerald-50 px-1.5 text-[9px] text-emerald-800'
                : 'h-4 border-amber-200 bg-amber-50 px-1.5 text-[9px] text-amber-800'
            }
          >
            {inventoryReservedDone ? 'Резерв WMS оформлен' : 'Резерв WMS ожидается'}
          </Badge>
        ) : null}
        {variant === 'brand' && bomLineCount != null && bomLineCount > 0 ? (
          <div className="flex flex-wrap items-center gap-1.5">
            <Badge
              variant="outline"
              data-testid="brand-op-bom-preview-badge"
              className="h-4 border-emerald-200 bg-emerald-50 px-1.5 text-[9px] text-emerald-800"
            >
              BOM · {bomLineCount} строк
            </Badge>
            {chainSteps.some((s) => s.id === 'materials_supplied') ? (
              <Badge
                variant="outline"
                data-testid="brand-op-materials-step-badge"
                className={
                  materialsSuppliedDone
                    ? 'h-4 border-emerald-200 bg-emerald-50 px-1.5 text-[9px] text-emerald-800'
                    : 'h-4 border-amber-200 bg-amber-50 px-1.5 text-[9px] text-amber-800'
                }
              >
                {materialsSuppliedDone ? 'Материалы подтверждены' : 'Ожидает поставку материалов'}
              </Badge>
            ) : null}
          </div>
        ) : null}
        {variant === 'brand' && bomPreviewLines.length > 0 ? (
          <ul
            className="space-y-0.5 border-t border-amber-100/80 pt-2"
            data-testid="brand-op-bom-preview-lines"
          >
            {bomPreviewLines.map((line, index) => (
              <li
                key={`${line.materialName}-${index}`}
                className="text-muted-foreground truncate text-[10px]"
              >
                {line.materialName}
              </li>
            ))}
          </ul>
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
              materialsSuppliedDone
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
            className={
              inventoryReservedDone
                ? 'h-4 border-emerald-200 bg-emerald-50 px-1.5 text-[9px] text-emerald-800'
                : 'h-4 border-amber-200 bg-amber-50 px-1.5 text-[9px] text-amber-800'
            }
          >
            {inventoryReservedDone ? 'Резерв WMS оформлен' : 'Резерв WMS ожидается'}
          </Badge>
        ) : null}
        {variant === 'manufacturer' ? (
          <ManufacturerSpineWipCabinetStrip factoryId={factoryId} />
        ) : null}
        {variant === 'brand' && isSpineActive ? (
          <div className="space-y-2 border-t border-amber-100/80 pt-2" data-testid="brand-op-spine-strips">
            <BrandAllocationSpinePanel orderId={orderId} />
            <BrandOrderShipmentSpineStrip orderId={orderId} />
          </div>
        ) : null}
        {variant === 'manufacturer' && handoffItems.length > 0 ? (
          <ul className="space-y-1 border-t border-amber-100/80 pt-2" data-testid="mfr-op-queue-snippet">
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
                {item.b2bOrderId ? (
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
        <div className="space-y-1.5 border-t border-amber-100/80 pt-2">
          <div
            className="flex flex-wrap gap-x-3 gap-y-1"
            data-testid={
              variant === 'brand' ? 'brand-op-cabinet-cta-production' : 'mfr-op-cabinet-cta-production'
            }
          >
          {variant === 'brand' && hasActiveOrder ? (
            <>
              <Link
                href={brandB2bOrderHandoffContextHref(cabinetOrderId)}
                className={linkClass}
                data-testid="brand-op-cabinet-handoff-link"
              >
                Передача
              </Link>
              <Link
                href={brandB2bOrdersProductionRegistryHref(cabinetOrderId)}
                data-testid="brand-op-cabinet-registry-link"
                className={linkClass}
              >
                Реестр
              </Link>
              <Link
                href={brandB2bOrderChainContextHref(cabinetOrderId)}
                data-testid="brand-op-cabinet-order-link"
                className={linkClass}
              >
                Карточка
              </Link>
              <Link
                href={factoryMaterialsProcurementHrefForDemo(demoWithOrder, { role: 'supplier' })}
                data-testid="brand-op-procurement-preview-link"
                className={linkClass}
              >
                Закупка
              </Link>
              <Link
                href={brandB2bOrderDossierContextHref(cabinetOrderId)}
                data-testid="brand-op-order-dossier-link"
                className={linkClass}
              >
                ТЗ
              </Link>
            </>
          ) : (
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
            </>
          )}
          </div>
          <div
            className="flex flex-wrap gap-x-3 gap-y-1"
            data-testid={
              variant === 'brand' ? 'brand-op-cabinet-cta-comms' : 'mfr-op-cabinet-cta-comms'
            }
          >
          {variant === 'brand' ? (
            <>
              <Link
                href={shopB2bTrackingOrderHref(cabinetOrderId)}
                data-testid="brand-op-cabinet-tracking-link"
                className={linkClass}
              >
                Трекинг магазина
              </Link>
              <Link
                href={brandCalendarB2bOrderContextHref(cabinetOrderId)}
                data-testid="brand-op-cabinet-calendar-link"
                className={linkClass}
              >
                Календарь
              </Link>
              <Link
                href={brandMessagesB2bOrderContextHref(cabinetOrderId)}
                data-testid="brand-op-cabinet-chat-link"
                className={linkClass}
              >
                Чат
              </Link>
            </>
          ) : (
            <>
              <Link
                href={shopB2bTrackingOrderHref(cabinetOrderId)}
                data-testid="mfr-op-cabinet-tracking-link"
                className={linkClass}
              >
                Трекинг магазина
              </Link>
              <Link
                href={factoryMessagesB2bOrderContextHref(cabinetOrderId, { role: 'manufacturer' })}
                data-testid="mfr-op-cabinet-chat-link"
                className={linkClass}
              >
                Чат
              </Link>
            </>
          )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
