'use client';

import type { ReactNode } from 'react';
import { Workshop2Phase1DossierPanelRollbackBanner } from '@/components/brand/production/Workshop2Phase1DossierPanelRollbackBanner';
import {
  Workshop2Phase1DossierPanelBodyShell,
  type Workshop2Phase1DossierPanelBodyShellProps,
} from '@/components/brand/production/workshop2-phase1-dossier-panel-body-shell';
import {
  Workshop2DossierPanelPostMainTrail,
  type Workshop2DossierPanelPostMainTrailProps,
} from '@/components/brand/production/workshop2-phase1-dossier-panel-post-main-trail';
import type { Workshop2DossierViewProfile } from '@/lib/production/workshop2-dossier-view-infrastructure';

export type UseWorkshop2Phase1DossierPanelMainLayoutZoneInput = {
  dossierViewProfile: Workshop2DossierViewProfile;
  rollback: {
    show: boolean;
    lifecycleState: 'sent_to_production' | 'handoff_ready';
    onRollback: () => void;
  };
  bodyShell: Workshop2Phase1DossierPanelBodyShellProps;
  postMainTrail: Workshop2DossierPanelPostMainTrailProps;
};

/** Корневой layout панели: rollback banner + body shell + post-main trail. */
export function useWorkshop2Phase1DossierPanelMainLayoutZone({
  dossierViewProfile,
  rollback,
  bodyShell,
  postMainTrail,
}: UseWorkshop2Phase1DossierPanelMainLayoutZoneInput): { panelRoot: ReactNode } {
  const panelRoot = (
    <div className="w-full min-w-0 space-y-3 text-left" data-w2-dossier-view={dossierViewProfile}>
      <Workshop2Phase1DossierPanelRollbackBanner
        show={rollback.show}
        lifecycleState={rollback.lifecycleState}
        onRollback={rollback.onRollback}
      />
      <Workshop2Phase1DossierPanelBodyShell {...bodyShell} />
      <Workshop2DossierPanelPostMainTrail {...postMainTrail} />
    </div>
  );

  return { panelRoot };
}
