'use client';

import { Button } from '@/components/ui/button';
import { Workshop2NineGapRelatedFooterShell } from '@/components/brand/production/Workshop2NineGapRelatedFooterShell';
import { W2_PASSPORT_SUBPAGE_ANCHORS } from '@/lib/production/workshop2-passport-check';
import type { Workshop2TzSignoffSectionKey } from '@/lib/production/workshop2-dossier-phase1.types';

const HINT =
  'Опорные поля SKU и ветка L1–L3; визуал, BOM и конструкция наследуют тот же артикул.';

type Props = {
  matSketchBomGapRefs: readonly string[];
  onJumpMaterialHub: () => void;
  onJumpSketch: () => void;
  onJumpMaterialMatTable?: () => void;
  onJumpConstructionContour?: () => void;
  onJumpQcRoute?: () => void;
  onDossierJump: (section: Workshop2TzSignoffSectionKey, anchorId: string) => void;
};

/** Кнопки футера «до 9» в хабе паспорта (переходы по якорям ТЗ). */
export function Workshop2PassportHubNineGapFooter({
  matSketchBomGapRefs,
  onJumpMaterialHub,
  onJumpSketch,
  onJumpMaterialMatTable,
  onJumpConstructionContour,
  onJumpQcRoute,
  onDossierJump,
}: Props) {
  return (
    <Workshop2NineGapRelatedFooterShell
      matSketchBomGapRefs={matSketchBomGapRefs}
      onJumpMaterialHub={onJumpMaterialHub}
      onJumpSketch={onJumpSketch}
      onJumpMaterialMatTable={onJumpMaterialMatTable}
      onJumpConstructionContour={onJumpConstructionContour}
      onJumpQcRoute={onJumpQcRoute}
      hint={HINT}
    >
      <Button
        type="button"
        variant="outline"
        size="sm"
        className="h-7 text-[10px]"
        onClick={() => onDossierJump('visuals', 'w2-visuals-hub')}
      >
        Визуал / эскиз
      </Button>
      <Button
        type="button"
        variant="outline"
        size="sm"
        className="h-7 text-[10px]"
        onClick={() => onDossierJump('material', 'w2-material-hub')}
      >
        Материалы и BOM
      </Button>
      <Button
        type="button"
        variant="outline"
        size="sm"
        className="h-7 text-[10px]"
        onClick={() => onDossierJump('construction', 'w2-measurements-fields')}
      >
        Мерки
      </Button>
      <Button
        type="button"
        variant="outline"
        size="sm"
        className="h-7 text-[10px]"
        onClick={() => onDossierJump('construction', 'w2-construction-hub')}
      >
        Конструкция
      </Button>
      <Button
        type="button"
        variant="outline"
        size="sm"
        className="h-7 text-[10px]"
        onClick={() => onDossierJump('general', W2_PASSPORT_SUBPAGE_ANCHORS.audit)}
      >
        Аудит
      </Button>
      <Button
        type="button"
        variant="outline"
        size="sm"
        className="h-7 text-[10px]"
        onClick={() => onDossierJump('general', W2_PASSPORT_SUBPAGE_ANCHORS.denseView)}
      >
        Режим ТЗ · w2view
      </Button>
      <Button
        type="button"
        variant="outline"
        size="sm"
        className="h-7 text-[10px]"
        onClick={() => onDossierJump('general', W2_PASSPORT_SUBPAGE_ANCHORS.readOnly)}
      >
        Read-only
      </Button>
    </Workshop2NineGapRelatedFooterShell>
  );
}
