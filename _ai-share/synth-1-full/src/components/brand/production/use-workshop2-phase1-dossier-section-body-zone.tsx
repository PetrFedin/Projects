'use client';

import {
  Workshop2Phase1DossierPanelSectionBody,
  type Workshop2Phase1DossierPanelSectionBodyProps,
} from '@/components/brand/production/workshop2-phase1-dossier-panel-section-body';

export type UseWorkshop2Phase1DossierSectionBodyZoneInput = Omit<
  Workshop2Phase1DossierPanelSectionBodyProps,
  'tzMinimalConstruction' | 'onToggleTzMinimalConstruction'
> & {
  tzMinimalModeBySection: Workshop2Phase1DossierPanelSectionBodyProps['tzMinimalModeBySection'];
  setTzMinimalModeBySection: Workshop2Phase1DossierPanelSectionBodyProps['setTzMinimalModeBySection'];
};

/** Тело активной секции ТЗ — без inline JSX в orchestrator. */
export function useWorkshop2Phase1DossierSectionBodyZone({
  tzMinimalModeBySection,
  setTzMinimalModeBySection,
  ...rest
}: UseWorkshop2Phase1DossierSectionBodyZoneInput) {
  const sectionBody = (
    <Workshop2Phase1DossierPanelSectionBody
      {...rest}
      tzMinimalModeBySection={tzMinimalModeBySection}
      setTzMinimalModeBySection={setTzMinimalModeBySection}
      tzMinimalConstruction={tzMinimalModeBySection.construction}
      onToggleTzMinimalConstruction={() =>
        setTzMinimalModeBySection((prev) => ({
          ...prev,
          construction: !prev.construction,
        }))
      }
    />
  );

  return { sectionBody };
}
