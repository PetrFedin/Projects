'use client';

import Link from 'next/link';
import { useMemo } from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import SupplierCollectionOrderForecast from '@/components/platform/empty-cells/supplier-collection-order-forecast-panel';
import { SupplierManufacturerHandoffPeerStrip } from '@/components/factory/supplier/SupplierManufacturerHandoffPeerStrip';
import { SupplierProcurementPillarCard } from '@/components/platform/SupplierProcurementPillarCard';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { mapSupplierProcurementBomLines } from '@/lib/fashion/brand-supplier-bom-lines';
import {
  buildSupplierProcurementSession,
  summarizeSupplierProcurementBom,
} from '@/lib/fashion/supplier-procurement-workspace';
import { PLATFORM_CORE_DEMO, resolvePageCollectionId } from '@/lib/platform-core-hub-matrix';
import { usePillarSnapshot } from '@/hooks/use-pillar-snapshot';
import { SupplierProcurementSlaResponseStrip } from '@/components/factory/supplier/SupplierProcurementSlaResponseStrip';

type Props = {
  collectionId?: string;
  articleId?: string;
};

export function SupplierProcurementBomPanel({
  collectionId = PLATFORM_CORE_DEMO.collectionId,
  articleId = PLATFORM_CORE_DEMO.demoArticleId,
}: Props) {
  const { snapshot } = usePillarSnapshot({
    collectionId,
    pillarId: 'order_production',
    roleId: 'supplier',
    articleId,
    enabled: true,
  });

  const lines = snapshot?.supplierProcurement?.bomLines ?? [];
  const summary = useMemo(() => summarizeSupplierProcurementBom(lines), [lines]);
  const rows = useMemo(() => mapSupplierProcurementBomLines(lines), [lines]);

  return (
    <div className="space-y-4" data-testid="supplier-procurement-bom-panel">
      <div className="flex flex-wrap gap-2">
        <Badge variant="secondary">
          BOM {summary.filled}/{summary.total}
        </Badge>
        <Badge variant="outline">{summary.pct}%</Badge>
      </div>
      <SupplierProcurementPillarCard compact />
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-base">BOM lines</CardTitle>
          <CardDescription>Столп 4 · supplier snapshot под PO.</CardDescription>
        </CardHeader>
        <CardContent className="overflow-x-auto p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Material</TableHead>
                <TableHead className="text-right">Qty</TableHead>
                <TableHead>Unit</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {rows.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={3} className="text-text-muted text-xs">
                    Нет строк BOM — откройте materials dossier или дождитесь handoff.
                  </TableCell>
                </TableRow>
              ) : (
                rows.map((row) => (
                  <TableRow key={row.lineId}>
                    <TableCell>{row.materialName}</TableCell>
                    <TableCell className="text-right font-mono text-sm">{row.qty}</TableCell>
                    <TableCell className="text-xs">{row.unit}</TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}

export function SupplierProcurementRfqPanel({
  collectionId = PLATFORM_CORE_DEMO.collectionId,
  articleId = PLATFORM_CORE_DEMO.demoArticleId,
}: Props) {
  const session = useMemo(
    () => buildSupplierProcurementSession({ collectionId, articleId }),
    [articleId, collectionId]
  );

  return (
    <div className="space-y-4" data-testid="supplier-procurement-rfq-panel">
      <SupplierProcurementSlaResponseStrip collectionId={collectionId} articleId={articleId} />
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-base">Procurement · RFQ chain</CardTitle>
          <CardDescription>Centric RFQ ↔ brand BOM ↔ materials dossier.</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-wrap gap-2">
          <Button size="sm" asChild>
            <Link href={session.rfqHref}>RFQ workspace</Link>
          </Button>
          <Button size="sm" variant="outline" asChild>
            <Link href={session.entitiesHref}>Entity threads</Link>
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}

export function SupplierProcurementInboxHintPanel() {
  return (
    <p className="text-text-secondary text-xs" data-testid="supplier-procurement-inbox-hint">
      Inbox ниже — contextual threads по заказу и артикулу (столп 5).
    </p>
  );
}

export function SupplierProcurementForecastPanel({
  collectionId = PLATFORM_CORE_DEMO.collectionId,
  orderId,
}: Props & { orderId?: string }) {
  const demo = {
    ...PLATFORM_CORE_DEMO,
    collectionId,
    demoOrderId: orderId?.trim() || PLATFORM_CORE_DEMO.demoOrderId,
  };

  return (
    <div className="space-y-3" data-testid="supplier-procurement-forecast-panel">
      <SupplierManufacturerHandoffPeerStrip
        factoryId={demo.factoryId}
        collectionId={collectionId}
        orderId={orderId}
      />
      <SupplierCollectionOrderForecast demo={demo} embedCrossRole />
    </div>
  );
}
