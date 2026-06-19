'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { buildBrandInventoryOpsSession } from '@/lib/b2b/brand-inventory-ops';
import { ArrowRightLeft, Network, Package, Warehouse } from 'lucide-react';

type Props = {
  collectionId?: string;
};

export function BrandInventoryOverviewBridgePanel({ collectionId }: Props) {
  const session = buildBrandInventoryOpsSession({ collectionId });

  return (
    <Card data-testid="brand-inventory-overview-bridge-panel">
      <CardHeader className="pb-2">
        <div className="flex flex-wrap items-center gap-2">
          <Package className="h-4 w-4" />
          <CardTitle className="text-base">Brand ATP · ledger</CardTitle>
        </div>
        <CardDescription>
          Onfinity/SAP: brand matrix → balance transfer → shop retail sync (столп 4).
        </CardDescription>
      </CardHeader>
      <CardContent className="flex flex-wrap gap-2">
        <Button size="sm" variant="outline" asChild>
          <Link href={session.countHref} data-testid="brand-inventory-bridge-count-link">
            Physical count
          </Link>
        </Button>
        <Button size="sm" variant="outline" asChild>
          <Link href={session.balanceHref} data-testid="brand-inventory-bridge-balance-link">
            Balance tab
          </Link>
        </Button>
        <Button size="sm" variant="outline" asChild>
          <Link href={session.inventoryBalanceHref}>Stock transfer</Link>
        </Button>
        <Button size="sm" variant="outline" asChild>
          <Link href={session.multiLocationHref}>Multi-location</Link>
        </Button>
        <Button size="sm" variant="ghost" asChild>
          <Link href={session.legacyMatrixHref}>Full matrix (legacy)</Link>
        </Button>
        <Button size="sm" variant="ghost" asChild>
          <Link href={session.shopInventoryOverviewHref}>Shop inventory</Link>
        </Button>
        <Button size="sm" variant="ghost" asChild>
          <Link href={session.shopLandedMarginHref}>Shop margin</Link>
        </Button>
      </CardContent>
    </Card>
  );
}

export function BrandInventoryBalanceBridgePanel({ collectionId }: Props) {
  const session = buildBrandInventoryOpsSession({ collectionId });

  return (
    <div className="space-y-4" data-testid="brand-inventory-balance-panel">
      <Card>
        <CardHeader className="pb-2">
          <div className="flex flex-wrap items-center gap-2">
            <ArrowRightLeft className="h-4 w-4" />
            <CardTitle className="text-base">Balance · transfer</CardTitle>
          </div>
          <CardDescription>WMS proposals между складами и offline-точками.</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-wrap gap-2">
          <Button size="sm" asChild>
            <Link href={session.inventoryBalanceHref} data-testid="brand-inventory-balance-deep-link">
              Open stock transfer
            </Link>
          </Button>
          <Button size="sm" variant="outline" asChild>
            <Link href={session.shadowInventoryHref}>Shadow inventory</Link>
          </Button>
          <Button size="sm" variant="outline" asChild>
            <Link href={session.warehouseHref}>
              <Warehouse className="mr-1 h-3 w-3" />
              Warehouse
            </Link>
          </Button>
          <Button size="sm" variant="ghost" asChild>
            <Link href={session.overviewHref}>Overview tab</Link>
          </Button>
          <Button size="sm" variant="ghost" asChild>
            <Link href={session.shopLandedMarginHref}>Shop margin</Link>
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}

export function BrandInventoryNetworkBridgePanel({ collectionId }: Props) {
  const session = buildBrandInventoryOpsSession({ collectionId });

  return (
    <div className="space-y-4" data-testid="brand-inventory-network-panel">
      <Card>
        <CardHeader className="pb-2">
          <div className="flex flex-wrap items-center gap-2">
            <Network className="h-4 w-4" />
            <CardTitle className="text-base">Retailer network</CardTitle>
          </div>
          <CardDescription>Shop ATP · reconcile · replenishment alerts по сети.</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-wrap gap-2">
          <Button size="sm" asChild>
            <Link href={session.shopInventoryOverviewHref} data-testid="brand-inventory-shop-stock-link">
              Shop inventory
            </Link>
          </Button>
          <Button size="sm" variant="outline" asChild>
            <Link href={session.shopInventoryReconcileHref}>Shop reconcile</Link>
          </Button>
          <Button size="sm" variant="outline" asChild>
            <Link href={session.replenishmentAtpHref}>Replenishment · ATP</Link>
          </Button>
          <Button size="sm" variant="ghost" asChild>
            <Link href={session.replenishmentAlertsHref}>Replenishment alerts</Link>
          </Button>
          <Button size="sm" variant="ghost" asChild>
            <Link href={session.shopOrderCommsHref}>Shop order tracking</Link>
          </Button>
          <Button size="sm" variant="ghost" asChild>
            <Link href={session.shopMatrixHref}>Shop matrix</Link>
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}

export function BrandInventoryPhysicalCountPanel({ collectionId }: Props) {
  const session = buildBrandInventoryOpsSession({ collectionId });

  return (
    <div className="space-y-4" data-testid="brand-inventory-physical-count-panel">
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-base">Physical count · reconcile</CardTitle>
          <CardDescription>
            Onfinity: cycle count → discrepancy → shop ledger adjust (brand orchestrates network).
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-wrap gap-2">
          <Button size="sm" asChild>
            <Link href={session.shopInventoryReconcileHref} data-testid="brand-inventory-count-reconcile-link">
              Shop reconcile
            </Link>
          </Button>
          <Button size="sm" variant="outline" asChild>
            <Link href={session.cycleCountHref}>Cycle counting</Link>
          </Button>
          <Button size="sm" variant="outline" asChild>
            <Link href={session.multiLocationHref}>Multi-location</Link>
          </Button>
          <Button size="sm" variant="ghost" asChild>
            <Link href={session.countHref}>Count tab</Link>
          </Button>
          <Button size="sm" variant="ghost" asChild>
            <Link href={session.shopLandedMarginHref}>Shop margin</Link>
          </Button>
          <Button size="sm" variant="ghost" asChild>
            <Link href={session.brandLandedMarginHref}>Brand margin</Link>
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
