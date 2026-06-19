'use client';

import Link from 'next/link';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { PlatformCoreChainStatusRefreshBadge } from '@/components/platform/PlatformCoreChainStatusRefreshBadge';
import { BrandOpHandoffInventoryPeerStrip } from '@/components/platform/BrandOpHandoffInventoryPeerStrip';
import { BrandOpHandoffCoSpinePeerStrip } from '@/components/platform/BrandOpHandoffCoSpinePeerStrip';
import { buildBrandProductionHandoffSession } from '@/lib/brand-production/brand-production-handoff';
import type { BrandProductionState } from '@/lib/brand-production';
import { manufacturerHandoffFeatureHref } from '@/lib/production/manufacturer-handoff-queue';
import { usePlatformCoreChainStatusPoll } from '@/hooks/use-platform-core-chain-status-poll';
import { PLATFORM_CORE_DEMO } from '@/lib/platform-core-hub-matrix';
import { Factory, Truck } from 'lucide-react';

type Props = {
  state: BrandProductionState;
  selectedCollectionId: string;
  orderId?: string;
  factoryId?: string;
};

export function BrandProductionHandoffPanel({
  state,
  selectedCollectionId,
  orderId,
  factoryId = PLATFORM_CORE_DEMO.factoryId,
}: Props) {
  const resolvedOrderId =
    orderId?.trim() || state.b2bOrderRefs.find((r) => r.status !== 'cancelled')?.orderRef;
  const session = buildBrandProductionHandoffSession({
    orderId: resolvedOrderId,
    collectionId: selectedCollectionId,
    factoryId,
  });
  const refsForCollection = state.b2bOrderRefs.filter(
    (r) =>
      state.articles.some(
        (a) => a.collectionId === selectedCollectionId && a.sku === r.articleSku
      ) || !selectedCollectionId
  );
  const { sseConnected } = usePlatformCoreChainStatusPoll(Boolean(resolvedOrderId), [
    resolvedOrderId ?? '',
  ]);
  const manufacturerQcHref = manufacturerHandoffFeatureHref('qc-gate', {
    factoryId,
    collectionId: selectedCollectionId,
    orderId: resolvedOrderId,
  });
  const manufacturerAckHref = manufacturerHandoffFeatureHref('techpack-ack', {
    factoryId,
    collectionId: selectedCollectionId,
    orderId: resolvedOrderId,
  });

  return (
    <div className="space-y-4" data-testid="brand-production-handoff-panel">
      {resolvedOrderId ? (
        <>
          <BrandOpHandoffInventoryPeerStrip
            orderId={resolvedOrderId}
            collectionId={selectedCollectionId}
            factoryId={factoryId}
          />
          <BrandOpHandoffCoSpinePeerStrip
            orderId={resolvedOrderId}
            collectionId={selectedCollectionId}
            factoryId={factoryId}
          />
        </>
      ) : null}
      <Card>
        <CardHeader className="pb-2">
          <div className="flex flex-wrap items-center gap-2">
            <Factory className="h-4 w-4" />
            <CardTitle className="text-base">Handoff → очередь цеха</CardTitle>
            <Badge variant="outline" className="text-[10px] uppercase">
              {refsForCollection.length} B2B ref
            </Badge>
            {resolvedOrderId ? (
              <PlatformCoreChainStatusRefreshBadge
                sseConnected={sseConnected}
                enabled
                sseTestId="brand-production-handoff-chain-sse-live-badge"
                pollTestId="brand-production-handoff-chain-poll-badge"
              />
            ) : null}
          </div>
          <CardDescription>
            W2/Apparel Magic: confirmed B2B → factory handoff queue → cut ticket → QC.
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-wrap gap-2">
          <Button size="sm" asChild>
            <Link
              href={session.factoryQueueHref}
              data-testid="brand-production-handoff-factory-queue-link"
            >
              Очередь цеха
            </Link>
          </Button>
          <Button size="sm" variant="outline" asChild>
            <Link href={session.cutTicketTabHref}>Cut ticket</Link>
          </Button>
          <Button size="sm" variant="outline" asChild>
            <Link href={session.qcGateTabHref} data-testid="brand-production-handoff-qc-tab-link">
              QC gate
            </Link>
          </Button>
          <Button size="sm" variant="outline" asChild>
            <Link href={manufacturerQcHref} data-testid="brand-production-handoff-manufacturer-qc-link">
              Manufacturer QC
            </Link>
          </Button>
          <Button size="sm" variant="outline" asChild>
            <Link href={manufacturerAckHref} data-testid="brand-production-handoff-factory-ack-link">
              Factory-ack
            </Link>
          </Button>
          <Button size="sm" variant="ghost" asChild>
            <Link href={session.factoryOrdersHref}>Заказы цеха</Link>
          </Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-2">
          <div className="flex flex-wrap items-center gap-2">
            <Truck className="h-4 w-4" />
            <CardTitle className="text-base">Shop · downstream</CardTitle>
          </div>
          <CardDescription>Трекинг и working order после handoff.</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-wrap gap-2">
          {resolvedOrderId ? (
            <>
              <Button size="sm" variant="outline" asChild>
                <Link href={session.shopTrackingHref}>Shop tracking</Link>
              </Button>
              <Button size="sm" variant="outline" asChild>
                <Link href={session.shopWorkingOrderHref}>Working order</Link>
              </Button>
              <Button size="sm" variant="outline" asChild>
                <Link href={session.shopOrderCommsHref}>Order comms</Link>
              </Button>
              <Button size="sm" variant="ghost" asChild>
                <Link href={session.manufacturerOrderCommsHref}>Factory comms</Link>
              </Button>
            </>
          ) : (
            <p className="text-text-secondary text-sm">
              Укажите `?order=` в URL или подтвердите B2B на вкладке «Операции».
            </p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
