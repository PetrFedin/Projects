'use client';

import type { Workshop2DossierPanelPostMainTrailProps } from '@/components/brand/production/workshop2-phase1-dossier-panel-post-main-trail';

export type UseWorkshop2Phase1DossierPostMainTrailPropsZoneInput =
  Workshop2DossierPanelPostMainTrailProps;

/** Post-main trail props без inline nesting в orchestrator. */
export function useWorkshop2Phase1DossierPostMainTrailPropsZone(
  input: UseWorkshop2Phase1DossierPostMainTrailPropsZoneInput
): Workshop2DossierPanelPostMainTrailProps {
  return input;
}
