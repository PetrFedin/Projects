'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { buildSupplierMrpSupplySession } from '@/lib/fashion/supplier-mrp-supply';
import { supplierOrderCommsFeatureHref } from '@/lib/b2b/supplier-order-comms';
import { SupplierProcurementBrandNotifyStrip } from '@/components/factory/supplier/SupplierProcurementBrandNotifyStrip';
import { PlatformCoreWmsReserveStrip } from '@/components/platform/PlatformCoreWmsReserveStrip';
import { buildSupplierOrderCommsSession } from '@/lib/b2b/supplier-order-comms';
import { Boxes, Factory, ShoppingCart } from 'lucide-react';

type Props = {
  collectionId?: string;
  articleId?: string;
  orderId?: string;
};

export function SupplierMrpSupplyPanel({
  collectionId,
  articleId,
  orderId,
}: Props) {
  const session = buildSupplierMrpSupplySession({ collectionId, articleId, orderId });
  const orderComms = buildSupplierOrderCommsSession({ collectionId, articleId, orderId });

  return (
    <div className="space-y-4" data-testid="supplier-mrp-supply-panel">
      <PlatformCoreWmsReserveStrip
        variant="supplier"
        brandHandoffHref={orderComms.brandOrderHandoffHref}
        shopTrackingHref={orderComms.shopTrackingHref}
      />
      {orderId ? (
        <SupplierProcurementBrandNotifyStrip
          collectionId={session.collectionId}
          articleId={session.articleId}
          orderId={orderId}
        />
      ) : null}
      <Card>
        <CardHeader className="pb-2">
          <div className="flex flex-wrap items-center gap-2">
            <Boxes className="h-4 w-4" />
            <CardTitle className="text-base">MRP · shortage → PO</CardTitle>
          </div>
          <CardDescription>
            Onfinity MRP: BOM × order qty → materials dossier → brand BOM → replenishment.
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-wrap gap-2">
          <Button size="sm" asChild>
            <Link href={session.materialsHref} data-testid="supplier-mrp-materials-link">
              Materials dossier
            </Link>
          </Button>
          <Button size="sm" variant="outline" asChild>
            <Link href={session.w2SupplyHref}>W2 supply</Link>
          </Button>
          <Button size="sm" variant="outline" asChild>
            <Link href={session.brandBomHref}>Brand BOM</Link>
          </Button>
          <Button size="sm" variant="ghost" asChild>
            <Link href={session.centricRfqHref}>Centric RFQ</Link>
          </Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-2">
          <div className="flex flex-wrap items-center gap-2">
            <Factory className="h-4 w-4" />
            <CardTitle className="text-base">Chain bridges</CardTitle>
          </div>
          <CardDescription>Столп 4 ↔ shop replenishment ↔ brand production.</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-wrap gap-2">
          <Button size="sm" variant="outline" asChild>
            <Link href={session.brandProductionHref}>Brand production ops</Link>
          </Button>
          <Button size="sm" variant="outline" asChild>
            <Link href={session.replenishmentHref}>
              <ShoppingCart className="mr-1 h-3 w-3" />
              Shop replenishment
            </Link>
          </Button>
          <Button size="sm" variant="outline" asChild>
            <Link href={session.shopMatrixHref}>Shop matrix</Link>
          </Button>
          <Button size="sm" variant="ghost" asChild>
            <Link href={session.shopOrderCommsHref}>Shop order comms</Link>
          </Button>
          <Button size="sm" variant="ghost" asChild>
            <Link href={session.shopLandedMarginHref}>Shop margin</Link>
          </Button>
          <Button size="sm" variant="ghost" asChild>
            <Link href={session.manufacturerOrderCommsHref}>Factory order comms</Link>
          </Button>
          <Button size="sm" variant="ghost" asChild>
            <Link href={session.supplyTabHref}>Supply tab</Link>
          </Button>
          <Button size="sm" variant="ghost" asChild>
            <Link href={supplierOrderCommsFeatureHref(session.orderId, session.collectionId, session.articleId)}>
              Order comms
            </Link>
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
