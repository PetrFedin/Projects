'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { FactoryDossierTechPackAckPanel } from '@/components/platform/FactoryDossierTechPackAckPanel';
import { buildManufacturerHandoffQueueSession } from '@/lib/production/manufacturer-handoff-queue';
import { factoryProductionDossierContextHref } from '@/lib/routes';

type Props = {
  factoryId: string;
  collectionId: string;
  orderId?: string;
  articleId: string;
};

/** Manufacturer handoff workspace tab · factory-ack (tech pack приёмка цехом). */
export function ManufacturerTechPackAckWorkspacePanel({
  factoryId,
  collectionId,
  orderId,
  articleId,
}: Props) {
  const session = buildManufacturerHandoffQueueSession({ factoryId, orderId, collectionId });
  const dossierHref = factoryProductionDossierContextHref(articleId, {
    collectionId,
    orderId,
  });

  return (
    <div className="space-y-4" data-testid="manufacturer-handoff-techpack-ack-panel">
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-base">Factory-ack · tech pack</CardTitle>
          <CardDescription>
            Подтверждение приёмки ТЗ цехом → POST handoff/factory-ack (не sample-queue acknowledge).
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-wrap gap-2">
          <Button size="sm" variant="outline" asChild>
            <Link href={session.brandHandoffHref} data-testid="mfr-techpack-ack-brand-handoff-link">
              Brand handoff
            </Link>
          </Button>
          <Button size="sm" variant="outline" asChild>
            <Link href={dossierHref} data-testid="mfr-techpack-ack-dossier-link">
              Shop-floor dossier
            </Link>
          </Button>
          <Button size="sm" variant="outline" asChild>
            <Link href={session.handoffHref} data-testid="mfr-techpack-ack-handoff-queue-link">
              Handoff queue
            </Link>
          </Button>
          <Button size="sm" variant="outline" asChild>
            <Link href={session.brandQcGateHref} data-testid="mfr-techpack-ack-qc-gate-link">
              QC gate
            </Link>
          </Button>
          <Button size="sm" variant="ghost" asChild>
            <Link href={session.shopTrackingHref} data-testid="mfr-techpack-ack-shop-tracking-link">
              Shop tracking
            </Link>
          </Button>
        </CardContent>
      </Card>
      <FactoryDossierTechPackAckPanel
        collectionId={collectionId}
        articleId={articleId}
        surface="workspace"
      />
    </div>
  );
}
