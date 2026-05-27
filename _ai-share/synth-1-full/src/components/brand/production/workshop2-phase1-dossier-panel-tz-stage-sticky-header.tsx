'use client';

import { Workshop2SectionStageBoard } from '@/components/brand/production/Workshop2SectionStageBoard';
import { W2_TZ_SECTION_STAGE_DOM_ID } from '@/lib/production/workshop2-construction-dossier-anchors';

export function Workshop2DossierTzStageStickyHeader({
  stageBoardWarnings,
  tzRevokeDeniedHint,
  onJumpToVisualBrandNotes,
}: {
  stageBoardWarnings: string[];
  tzRevokeDeniedHint: string | null | undefined;
  onJumpToVisualBrandNotes: () => void;
}) {
  return (
    <div id={W2_TZ_SECTION_STAGE_DOM_ID} className="sticky top-4 z-20 scroll-mt-24 space-y-2">
      <Workshop2SectionStageBoard
        warnings={stageBoardWarnings}
        onJumpToVisualBrandNotes={onJumpToVisualBrandNotes}
      />
      {tzRevokeDeniedHint ? (
        <p className="rounded-lg border border-amber-200 bg-amber-50/90 px-3 py-2 text-[11px] text-amber-900">
          {tzRevokeDeniedHint}
        </p>
      ) : null}
    </div>
  );
}
