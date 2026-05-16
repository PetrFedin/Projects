'use client';

import type { ComponentProps, Dispatch, ReactNode, SetStateAction } from 'react';
import type { ResolvedPhase1AttributeRow } from '@/lib/production/attribute-catalog';
import { Workshop2TechPackHandoffBlock } from '@/components/brand/production/Workshop2TechPackHandoffBlock';
import { Workshop2DossierAssignmentSendPanel } from '@/components/brand/production/workshop2-phase1-dossier-panel-assignment-send-panel';
import { Workshop2DossierAssignmentStatusBanner } from '@/components/brand/production/workshop2-phase1-dossier-panel-assignment-status-banner';
import { Workshop2DossierSampleIntakeCatalogBlock } from '@/components/brand/production/workshop2-phase1-dossier-panel-sample-intake-catalog-block';
import type {
  Workshop2DossierSectionRowsExtra,
  Workshop2DossierSectionRowsSharedBundle,
} from '@/components/brand/production/workshop2-phase1-dossier-panel-section-rows';
import { Workshop2VendorBiddingPanel } from '@/components/brand/production/Workshop2VendorBiddingPanel';
import type { Workshop2DossierPhase1, Workshop2VendorBid } from '@/lib/production/workshop2-dossier-phase1.types';

type AssignmentSendPanelProps = ComponentProps<typeof Workshop2DossierAssignmentSendPanel>;
type HandoffBlockProps = ComponentProps<typeof Workshop2TechPackHandoffBlock>;

export function Workshop2DossierSectionBodyAssignment({
  onOpenProblemBlock,
  sampleIntakeCatalogRows,
  sampleIntakeCatalogExtras,
  sectionRowsShared,
  currentPhase,
  sendPanelProps,
  handoffBlockProps,
  articleId,
  dossier,
  setDossier,
  onOpenPulse,
  tzBlockersFooter,
}: {
  onOpenProblemBlock: () => void;
  sampleIntakeCatalogRows: ResolvedPhase1AttributeRow[];
  sampleIntakeCatalogExtras: Workshop2DossierSectionRowsExtra[];
  sectionRowsShared: Workshop2DossierSectionRowsSharedBundle;
  currentPhase: '1' | '2' | '3';
  sendPanelProps: Omit<AssignmentSendPanelProps, 'children'>;
  handoffBlockProps: HandoffBlockProps;
  articleId: string;
  dossier: Workshop2DossierPhase1;
  setDossier: Dispatch<SetStateAction<Workshop2DossierPhase1>>;
  onOpenPulse?: () => void;
  tzBlockersFooter: ReactNode;
}) {
  const assignmentHubReady =
    !sendPanelProps.factorySendHubPreview.firstUnmet && sendPanelProps.tzPreflight.ok;
  const statusText = assignmentHubReady
    ? 'Шаг готов к передаче в цех.'
    : `Дальше: ${sendPanelProps.factorySendHubPreview.firstUnmet?.label ?? sendPanelProps.tzPreflight.issues[0]?.title ?? 'закройте блокеры передачи'}.`;

  const handleBidsUpdate = (updatedBids: Workshop2VendorBid[]) => {
    setDossier(prev => ({
      ...prev,
      bids: updatedBids
    }));
  };

  return (
    <div className="space-y-4">
      <Workshop2DossierAssignmentStatusBanner
        hubReady={assignmentHubReady}
        statusText={statusText}
        onOpenProblemBlock={onOpenProblemBlock}
        onOpenPulse={onOpenPulse}
      />
      <Workshop2DossierAssignmentSendPanel {...sendPanelProps}>
        <Workshop2TechPackHandoffBlock {...handoffBlockProps} />
      </Workshop2DossierAssignmentSendPanel>
      <Workshop2VendorBiddingPanel articleId={articleId} bids={dossier.bids} onBidsUpdate={handleBidsUpdate} />
      {tzBlockersFooter}
    </div>
  );
}
