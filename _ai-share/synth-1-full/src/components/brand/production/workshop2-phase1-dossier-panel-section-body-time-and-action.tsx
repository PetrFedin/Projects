'use client';

import type { ComponentProps } from 'react';
import { Workshop2TimeAndActionPanel } from '@/components/brand/production/Workshop2TimeAndActionPanel';
import { Workshop2PredictiveRiskPanel } from '@/components/brand/production/Workshop2PredictiveRiskPanel';
import type { Workshop2DossierPhase1 } from '@/lib/production/workshop2-dossier-phase1.types';

export function Workshop2DossierSectionBodyTimeAndAction({
  articleId,
  dossier,
}: {
  articleId: string;
  dossier?: Workshop2DossierPhase1;
}) {
  return (
    <div className="space-y-4">
      <Workshop2PredictiveRiskPanel dossier={dossier} articleId={articleId} />
      <Workshop2TimeAndActionPanel articleId={articleId} dossier={dossier} />
    </div>
  );
}
