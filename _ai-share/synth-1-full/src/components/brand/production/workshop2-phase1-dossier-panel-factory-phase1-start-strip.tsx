'use client';

import { Button } from '@/components/ui/button';
import type { Workshop2TzSignoffSectionKey } from '@/lib/production/workshop2-dossier-phase1.types';
import { W2_CONSTRUCTION_SUBPAGE_ANCHORS } from '@/lib/production/workshop2-construction-dossier-anchors';
import { W2_MATERIAL_SUBPAGE_ANCHORS } from '@/lib/production/workshop2-material-bom-check';
import { W2_VISUALS_SKETCH_ANCHOR_ID } from '@/lib/production/workshop2-material-bom-sketch-strip';
import { W2_PASSPORT_SUBPAGE_ANCHORS } from '@/lib/production/workshop2-passport-check';

const W2_PASSPORT_DESIGN_INTENT_ANCHOR = 'w2-passport-design-intent';
const W2_TZ_SECTION_SIGNOFF_VISUALS_ANCHOR = 'w2-tz-section-signoff-visuals';

export function Workshop2DossierFactoryPhase1StartStrip({
  jumpToTzSectionAnchor,
}: {
  jumpToTzSectionAnchor: (section: Workshop2TzSignoffSectionKey, anchorId: string) => void;
}) {
  return (
    <div className="border-border-default rounded-xl border-2 bg-white px-4 py-3 shadow-sm">
      <p className="text-text-secondary text-[10px] font-semibold">Фабрика · с чего начать</p>
      <p className="text-text-secondary mt-1 text-xs">
        SKU → образ в паспорте → эскиз в конструкции → BOM без лишнего скролла.
      </p>
      <div className="mt-2 flex flex-wrap gap-2">
        <Button
          type="button"
          size="sm"
          variant="secondary"
          className="h-8 text-xs"
          onClick={() => jumpToTzSectionAnchor('general', W2_PASSPORT_SUBPAGE_ANCHORS.hub)}
        >
          Паспорт / SKU
        </Button>
        <Button
          type="button"
          size="sm"
          variant="secondary"
          className="h-8 text-xs"
          onClick={() => jumpToTzSectionAnchor('general', W2_PASSPORT_DESIGN_INTENT_ANCHOR)}
        >
          Образ и рефы
        </Button>
        <Button
          type="button"
          size="sm"
          variant="secondary"
          className="h-8 text-xs"
          onClick={() => jumpToTzSectionAnchor('construction', W2_TZ_SECTION_SIGNOFF_VISUALS_ANCHOR)}
        >
          Канон визуала
        </Button>
        <Button
          type="button"
          size="sm"
          variant="secondary"
          className="h-8 text-xs"
          onClick={() => jumpToTzSectionAnchor('construction', W2_VISUALS_SKETCH_ANCHOR_ID)}
        >
          Эскиз
        </Button>
        <Button
          type="button"
          size="sm"
          variant="secondary"
          className="h-8 text-xs"
          onClick={() => jumpToTzSectionAnchor('material', W2_MATERIAL_SUBPAGE_ANCHORS.hub)}
        >
          Bom
        </Button>
        <Button
          type="button"
          size="sm"
          variant="secondary"
          className="h-8 text-xs"
          onClick={() => jumpToTzSectionAnchor('construction', W2_CONSTRUCTION_SUBPAGE_ANCHORS.hub)}
        >
          Конструкция
        </Button>
      </div>
    </div>
  );
}
