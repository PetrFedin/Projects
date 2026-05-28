'use client';

import { Button } from '@/components/ui/button';
import type { Workshop2DossierViewProfile } from '@/lib/production/workshop2-dossier-view-infrastructure';
import { W2_CONSTRUCTION_SUBPAGE_ANCHORS } from '@/lib/production/workshop2-construction-dossier-anchors';
import { W2_MATERIAL_SUBPAGE_ANCHORS } from '@/lib/production/workshop2-material-bom-check';
import type { Workshop2TzSignoffSectionKey } from '@/lib/production/workshop2-dossier-phase1.types';

export function Workshop2DossierViewProfileQuickAside({
  dossierViewProfile,
  jumpToTzSectionAnchor,
  jumpToConstructionContour,
  jumpToSketchLineRefs,
}: {
  dossierViewProfile: Workshop2DossierViewProfile;
  jumpToTzSectionAnchor: (section: Workshop2TzSignoffSectionKey, anchorId: string) => void;
  jumpToConstructionContour: () => void;
  jumpToSketchLineRefs: () => void;
}) {
  const showFactory = dossierViewProfile === 'factory';
  const showFinance = dossierViewProfile === 'finance';
  if (!showFactory && !showFinance) {
    return null;
  }

  return (
    <aside className="space-y-4 self-start xl:sticky xl:top-4">
      <div className="border-border-default rounded-xl border bg-white p-4 shadow-sm">
        {showFactory ? (
          <div className="border-accent-primary/25 bg-accent-primary/10 rounded-lg border p-2.5">
            <p className="text-text-primary/90 text-[10px] font-semibold">Быстро · фабрика</p>
            <div className="mt-1.5 flex flex-wrap gap-1">
              <Button
                type="button"
                variant="outline"
                size="sm"
                className="border-accent-primary/25 text-text-primary h-7 bg-white text-[10px]"
                onClick={() =>
                  jumpToTzSectionAnchor('construction', W2_CONSTRUCTION_SUBPAGE_ANCHORS.hub)
                }
              >
                Хаб конструкции
              </Button>
              <Button
                type="button"
                variant="outline"
                size="sm"
                className="border-accent-primary/25 text-text-primary h-7 bg-white text-[10px]"
                onClick={jumpToConstructionContour}
              >
                Контур
              </Button>
              <Button
                type="button"
                variant="outline"
                size="sm"
                className="border-accent-primary/25 text-text-primary h-7 bg-white text-[10px]"
                onClick={() =>
                  jumpToTzSectionAnchor(
                    'construction',
                    W2_CONSTRUCTION_SUBPAGE_ANCHORS.patternFiles
                  )
                }
              >
                Лекала / CAD
              </Button>
              <Button
                type="button"
                variant="outline"
                size="sm"
                className="border-accent-primary/25 text-text-primary h-7 bg-white text-[10px]"
                onClick={() =>
                  jumpToTzSectionAnchor('assignment', W2_CONSTRUCTION_SUBPAGE_ANCHORS.send)
                }
              >
                Задание
              </Button>
              <Button
                type="button"
                variant="outline"
                size="sm"
                className="border-accent-primary/25 text-text-primary h-7 bg-white text-[10px]"
                onClick={jumpToSketchLineRefs}
              >
                Скетч · метки
              </Button>
              <Button
                type="button"
                variant="outline"
                size="sm"
                className="border-accent-primary/25 text-text-primary h-7 bg-white text-[10px]"
                onClick={() => jumpToTzSectionAnchor('material', W2_MATERIAL_SUBPAGE_ANCHORS.hub)}
              >
                BOM
              </Button>
            </div>
          </div>
        ) : null}
        {showFinance ? (
          <div className="mt-3 rounded-lg border border-emerald-200/85 bg-emerald-50/40 p-2.5">
            <p className="text-[10px] font-semibold text-emerald-900/85">К образу · финансы</p>
            <div className="mt-1.5 flex flex-wrap gap-1">
              <Button
                type="button"
                variant="outline"
                size="sm"
                className="h-7 border-emerald-200 bg-white text-[10px] text-emerald-950"
                onClick={() =>
                  jumpToTzSectionAnchor('construction', 'w2-tz-section-signoff-visuals')
                }
              >
                Канон и версия
              </Button>
              <Button
                type="button"
                variant="outline"
                size="sm"
                className="h-7 border-emerald-200 bg-white text-[10px] text-emerald-950"
                onClick={() => jumpToTzSectionAnchor('general', 'w2-passport-hub')}
              >
                Паспорт
              </Button>
            </div>
          </div>
        ) : null}
      </div>
    </aside>
  );
}
