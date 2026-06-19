'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { buildSupplierOrderCommsSession } from '@/lib/b2b/supplier-order-comms';
import { PlatformCoreWmsReserveStrip } from '@/components/platform/PlatformCoreWmsReserveStrip';
import { SupplierCommsBrandPushStrip } from '@/components/factory/supplier/SupplierCommsBrandPushStrip';
import { SupCmOrderContextPeerStrip } from '@/components/factory/supplier/SupCmOrderContextPeerStrip';
import { Calendar, MessageSquare, Package } from 'lucide-react';

type Props = {
  orderId?: string;
  collectionId?: string;
  articleId?: string;
};

export function SupplierOrderCommsPanel({ orderId, collectionId, articleId }: Props) {
  const session = buildSupplierOrderCommsSession({ orderId, collectionId, articleId });

  return (
    <div className="space-y-4" data-testid="supplier-order-comms-panel">
      <SupCmOrderContextPeerStrip
        collectionId={session.collectionId}
        articleId={session.articleId}
        orderId={session.orderId}
      />
      <SupplierCommsBrandPushStrip
        collectionId={session.collectionId}
        articleId={session.articleId}
        orderId={session.orderId}
      />
      <PlatformCoreWmsReserveStrip
        variant="supplier"
        brandHandoffHref={session.brandOrderHandoffHref}
        shopTrackingHref={session.shopTrackingHref}
        testId="supplier-order-comms-wms-reserve-strip"
      />
      <Card>
        <CardHeader className="pb-2">
          <div className="flex flex-wrap items-center gap-2">
            <MessageSquare className="h-4 w-4" />
            <CardTitle className="text-base">Order comms</CardTitle>
          </div>
          <CardDescription>
            Столп 5 · B2B PO {session.orderId} · brand/shop/factory bridges.
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-wrap gap-2">
          <Button size="sm" asChild>
            <Link href={session.messagesHref} data-testid="supplier-order-comms-messages-link">
              Open messages
            </Link>
          </Button>
          <Button size="sm" variant="outline" asChild>
            <Link href={session.calendarHref}>
              <Calendar className="mr-1 h-3 w-3" />
              Order calendar
            </Link>
          </Button>
          <Button size="sm" variant="outline" asChild>
            <Link href={session.entitiesHref}>Entity threads</Link>
          </Button>
          <Button size="sm" variant="ghost" asChild>
            <Link href={session.orderTabHref}>Order tab</Link>
          </Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-2">
          <div className="flex flex-wrap items-center gap-2">
            <Package className="h-4 w-4" />
            <CardTitle className="text-base">Procurement chain</CardTitle>
          </div>
          <CardDescription>MRP supply → brand BOM → shop tracking → factory order.</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-wrap gap-2">
          <Button size="sm" variant="outline" asChild>
            <Link href={session.supplyTabHref}>MRP supply</Link>
          </Button>
          <Button size="sm" variant="outline" asChild>
            <Link href={session.brandBomHref}>Brand BOM</Link>
          </Button>
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
            <Link href={session.shopMatrixHref}>Shop matrix</Link>
          </Button>
          <Button size="sm" variant="ghost" asChild>
            <Link href={session.brandOrderChatHref}>Brand order chat</Link>
          </Button>
          <Button size="sm" variant="ghost" asChild>
            <Link href={session.brandOrderHandoffHref}>Brand handoff</Link>
          </Button>
          <Button size="sm" variant="ghost" asChild>
            <Link href={session.replenishmentAtpHref}>Replenishment ATP</Link>
          </Button>
          <Button size="sm" variant="ghost" asChild>
            <Link href={session.inventoryOverviewHref}>Shop inventory</Link>
          </Button>
          <Button size="sm" variant="ghost" asChild>
            <Link href={session.manufacturerOrderHref}>Factory order comms</Link>
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
