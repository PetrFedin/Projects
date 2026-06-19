import { TZ_TAB_SECTIONS } from '@/components/brand/production/workshop2-phase1-dossier-panel-dossier-constants';
import {
  isWorkshop2DossierViewPrimarySection,
  type Workshop2DossierViewProfile,
} from '@/lib/production/workshop2-dossier-view-infrastructure';

export type Workshop2Phase1DossierNavSections = {
  dossierNavPrimarySections: typeof TZ_TAB_SECTIONS;
  dossierNavSecondarySections: typeof TZ_TAB_SECTIONS;
};

/** TZ tab nav primary/secondary split by dossier view profile (navigation zone). */
export function buildWorkshop2Phase1DossierNavSections(
  dossierViewProfile: Workshop2DossierViewProfile
): Workshop2Phase1DossierNavSections {
  if (dossierViewProfile === 'full') {
    return {
      dossierNavPrimarySections: TZ_TAB_SECTIONS,
      dossierNavSecondarySections: [],
    };
  }
  return {
    dossierNavPrimarySections: TZ_TAB_SECTIONS.filter((s) =>
      isWorkshop2DossierViewPrimarySection(dossierViewProfile, s.id)
    ),
    dossierNavSecondarySections: TZ_TAB_SECTIONS.filter(
      (s) => !isWorkshop2DossierViewPrimarySection(dossierViewProfile, s.id)
    ),
  };
}
