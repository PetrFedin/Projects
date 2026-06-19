'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { buildManufacturerHandoffQueueSession } from '@/lib/production/manufacturer-handoff-queue';
import { ClipboardList, Factory } from 'lucide-react';

type Props = {
  factoryId: string;
  orderId?: string;
  collectionId?: string;
};

export function ManufacturerHandoffBridgePanel({ factoryId, orderId, collectionId }: Props) {
  const session = buildManufacturerHandoffQueueSession({ factoryId, orderId, collectionId });

  return (
    <div className="space-y-4" data-testid="manufacturer-handoff-orders-bridge-panel">
      <Card>
        <CardHeader className="pb-2">
          <div className="flex flex-wrap items-center gap-2">
            <Factory className="h-4 w-4" />
            <CardTitle className="text-base">Production orders</CardTitle>
          </div>
          <CardDescription>
            Apparel Magic/WFX: handoff ack → PO в цехе → materials procurement.
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-wrap gap-2">
          <Button size="sm" asChild>
            <Link href={session.factoryOrdersHref} data-testid="mfr-handoff-bridge-prod-orders-link">
              Заказы цеха
            </Link>
          </Button>
          <Button size="sm" variant="outline" asChild>
            <Link href={session.handoffHref} data-testid="mfr-handoff-bridge-queue-link">
              Очередь handoff
            </Link>
          </Button>
          <Button size="sm" variant="outline" asChild>
            <Link href={session.materialsHref}>Materials / procurement</Link>
          </Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-2">
          <div className="flex flex-wrap items-center gap-2">
            <ClipboardList className="h-4 w-4" />
            <CardTitle className="text-base">Cross-role</CardTitle>
          </div>
          <CardDescription>Brand ops handoff · shop tracking после передачи.</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-wrap gap-2">
          <Button size="sm" variant="outline" asChild>
            <Link href={session.brandHandoffHref} data-testid="mfr-handoff-bridge-brand-ops-link">
              Brand handoff tab
            </Link>
          </Button>
          {orderId ? (
            <>
              <Button size="sm" variant="outline" asChild>
                <Link href={session.shopTrackingHref}>Shop tracking</Link>
              </Button>
              <Button size="sm" variant="outline" asChild>
                <Link href={session.shopOrderCommsHref}>Shop order comms</Link>
              </Button>
              <Button size="sm" variant="outline" asChild>
                <Link href={session.shopLandedMarginHref}>Shop margin</Link>
              </Button>
              <Button size="sm" variant="outline" asChild>
                <Link href={session.brandOrderChatHref}>Brand order chat</Link>
              </Button>
              <Button size="sm" variant="ghost" asChild>
                <Link href={session.brandQcGateHref}>Brand QC gate</Link>
              </Button>
              <Button size="sm" variant="ghost" asChild>
                <Link href={session.productionOpsCutTicketHref}>Factory cut ticket</Link>
              </Button>
              <Button size="sm" variant="ghost" asChild>
                <Link href={session.manufacturerOrderCommsHref}>Factory comms</Link>
              </Button>
            </>
          ) : (
            <p className="text-text-secondary text-sm">Добавьте `?order=` для shop tracking.</p>
          )}
          <Button size="sm" variant="ghost" asChild>
            <Link href={session.sampleQueueHref}>Sample queue</Link>
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
