'use client';

import { Workshop2TimeAndActionPanel } from '@/components/brand/production/Workshop2TimeAndActionPanel';
import { Workshop2PredictiveRiskPanel } from '@/components/brand/production/Workshop2PredictiveRiskPanel';
import type { Workshop2DossierPhase1 } from '@/lib/production/workshop2-dossier-phase1.types';
import { isWorkshop2ShowHeuristicRiskEnabled } from '@/lib/production/workshop2-show-heuristic-risk';

export function Workshop2DossierSectionBodyTimeAndAction({
  articleId,
  collectionId,
  dossier,
}: {
  articleId: string;
  collectionId?: string;
  dossier?: Workshop2DossierPhase1;
}) {
  const showHeuristicRisk = isWorkshop2ShowHeuristicRiskEnabled();

  return (
    <div className="space-y-4">
      {showHeuristicRisk ? (
        <Workshop2PredictiveRiskPanel dossier={dossier} articleId={articleId} />
      ) : null}
      <Workshop2TimeAndActionPanel
        articleId={articleId}
        collectionId={collectionId}
        dossier={dossier}
      />
    </div>
  );
}
