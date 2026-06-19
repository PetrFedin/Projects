'use client';

import Link from 'next/link';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ShopWorkingOrderSpinePanel } from '@/components/integrations/ShopWorkingOrderSpinePanel';
import { PlatformCoreWmsReserveStrip } from '@/components/platform/PlatformCoreWmsReserveStrip';
import { buildShopWorkingOrderSession } from '@/lib/b2b/shop-working-order-session';
import { shopB2bOrderHref } from '@/lib/routes';

type Props = {
  wholesaleOrderId: string;
  collectionId?: string;
};

export function ShopWorkingOrderVersionsPanel({ wholesaleOrderId, collectionId }: Props) {
  const session = buildShopWorkingOrderSession({ wholesaleOrderId, collectionId });

  return (
    <div className="space-y-4" data-testid="shop-working-order-versions-panel">
      <PlatformCoreWmsReserveStrip
        variant="workspace"
        checkoutHref={session.checkoutHref}
        trackingHref={session.orderCommsHref}
      />
      <div className="flex flex-wrap gap-2">
        <Badge variant="secondary">Order: {session.wholesaleOrderId}</Badge>
        <Button size="sm" variant="outline" asChild>
          <Link href={session.bulkHref}>Bulk entry</Link>
        </Button>
        <Button size="sm" variant="outline" asChild>
          <Link href={session.handoffHref}>Handoff</Link>
        </Button>
      </div>
      <ShopWorkingOrderSpinePanel wholesaleOrderId={wholesaleOrderId} />
    </div>
  );
}

export function ShopWorkingOrderBulkPanel({ wholesaleOrderId, collectionId }: Props) {
  const session = buildShopWorkingOrderSession({ wholesaleOrderId, collectionId });

  return (
    <div className="space-y-4" data-testid="shop-working-order-bulk-panel">
      <PlatformCoreWmsReserveStrip
        variant="workspace"
        checkoutHref={session.checkoutHref}
        trackingHref={session.orderCommsHref}
      />
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-base">Bulk entry · NuOrder</CardTitle>
          <CardDescription>Replenishment → matrix → pre-pack → working versions.</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-wrap gap-2">
          <Button size="sm" asChild>
            <Link href={session.matrixHref}>Co-edit matrix</Link>
          </Button>
          <Button size="sm" variant="outline" asChild>
            <Link href={session.replenishmentHref}>Replenishment ATP</Link>
          </Button>
          <Button size="sm" variant="outline" asChild>
            <Link href={session.versionsHref}>Versions</Link>
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}

export function ShopWorkingOrderHandoffPanel({ wholesaleOrderId, collectionId }: Props) {
  const session = buildShopWorkingOrderSession({ wholesaleOrderId, collectionId });

  return (
    <div className="space-y-4" data-testid="shop-working-order-handoff-panel">
      <PlatformCoreWmsReserveStrip
        variant="workspace"
        checkoutHref={session.checkoutHref}
        trackingHref={session.orderCommsHref}
      />
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-base">Handoff · comms</CardTitle>
          <CardDescription>Export confirm → approvals → order chat.</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-wrap gap-2">
          <Button size="sm" asChild>
            <Link href={shopB2bOrderHref(wholesaleOrderId)}>Order card</Link>
          </Button>
          <Button size="sm" variant="outline" asChild>
            <Link href={session.collaborativeHref}>Collaborative approvals</Link>
          </Button>
          <Button size="sm" variant="outline" asChild>
            <Link href={session.messagesHref}>Order chat</Link>
          </Button>
          <Button size="sm" variant="ghost" asChild>
            <Link href={session.brandOrderHandoffHref}>Brand handoff</Link>
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
