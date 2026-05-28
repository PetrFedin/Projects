'use client';

import { Button } from '@/components/ui/button';
import {
  SECTION_LABEL_BY_ID,
  TZ_TAB_SECTIONS,
} from '@/components/brand/production/workshop2-phase1-dossier-panel-dossier-constants';
import type { Workshop2TzSignoffSectionKey } from '@/lib/production/workshop2-dossier-phase1.types';
import {
  isWorkshop2DossierViewPrimarySection,
  WORKSHOP2_DOSSIER_VIEW_OPTIONS,
  type Workshop2DossierViewProfile,
} from '@/lib/production/workshop2-dossier-view-infrastructure';

type TzNavTab = (typeof TZ_TAB_SECTIONS)[number];

/** Пояснение, что текущая вкладка вторична для выбранного режима `w2view`, с переходом к первичной. */
export function Workshop2DossierSecondaryTzSectionCallout({
  dossierViewProfile,
  activeSection,
  dossierNavPrimarySections,
  onSelectSection,
}: {
  dossierViewProfile: Workshop2DossierViewProfile;
  activeSection: Workshop2TzSignoffSectionKey;
  dossierNavPrimarySections: readonly TzNavTab[];
  onSelectSection: (id: Workshop2TzSignoffSectionKey) => void;
}) {
  if (
    dossierViewProfile === 'full' ||
    isWorkshop2DossierViewPrimarySection(dossierViewProfile, activeSection)
  ) {
    return null;
  }

  const first = dossierNavPrimarySections[0];

  return (
    <div
      className="border-border-default bg-bg-surface2/95 text-text-primary flex flex-wrap items-center justify-between gap-2 rounded-lg border border-dashed px-3 py-2 text-[11px]"
      role="status"
    >
      <p className="min-w-0 leading-snug">
        <span className="font-semibold">Вторичный раздел</span> для режима «
        {WORKSHOP2_DOSSIER_VIEW_OPTIONS.find((o) => o.value === dossierViewProfile)?.label ??
          dossierViewProfile}
        ». Первичные: {dossierNavPrimarySections.map((s) => SECTION_LABEL_BY_ID[s.id]).join(', ')}.
      </p>
      {first ? (
        <Button
          type="button"
          variant="secondary"
          size="sm"
          className="h-8 shrink-0 text-[10px]"
          onClick={() => onSelectSection(first.id)}
        >
          К: {SECTION_LABEL_BY_ID[first.id]}
        </Button>
      ) : null}
    </div>
  );
}
