'use client';

import { Button } from '@/components/ui/button';
import { Workshop2NineGapRelatedFooterShell } from '@/components/brand/production/Workshop2NineGapRelatedFooterShell';
import { W2_MATERIAL_SUBPAGE_ANCHORS } from '@/lib/production/workshop2-material-bom-anchors';
import type { Workshop2TzSignoffSectionKey } from '@/lib/production/workshop2-dossier-phase1.types';

const HINT =
  'Строки mat с теми же linkedBomLineRef, что на метках скетча; дельта и альтернативы — в снабжении.';

type Props = {
  matSketchBomGapRefs: readonly string[];
  onJumpMaterialHub: () => void;
  onJumpSketch: () => void;
  onJumpMaterialMatTable?: () => void;
  onJumpConstructionContour?: () => void;
  onJumpQcRoute?: () => void;
  onDossierJump: (section: Workshop2TzSignoffSectionKey, anchorId: string) => void;
};

/** Кнопки футера «до 9» в хабе материалов (переходы по якорям ТЗ). */
export function Workshop2MaterialHubNineGapFooter({
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
        onClick={() => onDossierJump('general', 'w2-passport-hub')}
      >
        Паспорт
      </Button>
      <Button
        type="button"
        variant="outline"
        size="sm"
        className="h-7 text-[10px]"
        onClick={() => onDossierJump('visuals', 'w2-visuals-hub')}
      >
        Визуал
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
        onClick={() => onDossierJump('material', W2_MATERIAL_SUBPAGE_ANCHORS.supplyDrafts)}
      >
        Снабжение · черновики
      </Button>
      <Button
        type="button"
        variant="outline"
        size="sm"
        className="h-7 text-[10px]"
        onClick={() => onDossierJump('material', W2_MATERIAL_SUBPAGE_ANCHORS.supplyDraftsDelta)}
      >
        Дельта BOM
      </Button>
      <Button
        type="button"
        variant="outline"
        size="sm"
        className="h-7 text-[10px]"
        onClick={() => onDossierJump('material', W2_MATERIAL_SUBPAGE_ANCHORS.factoryExport)}
      >
        Фабрика CSV
      </Button>
      <Button
        type="button"
        variant="outline"
        size="sm"
        className="h-7 text-[10px]"
        onClick={() => onDossierJump('material', W2_MATERIAL_SUBPAGE_ANCHORS.supplyDraftsAlts)}
      >
        Альтернативы
      </Button>
      <Button
        type="button"
        variant="outline"
        size="sm"
        className="h-7 text-[10px]"
        onClick={() => onDossierJump('material', W2_MATERIAL_SUBPAGE_ANCHORS.compliance)}
      >
        Комплаенс
      </Button>
      <Button
        type="button"
        variant="outline"
        size="sm"
        className="h-7 text-[10px]"
        onClick={() => onDossierJump('material', W2_MATERIAL_SUBPAGE_ANCHORS.supplyDraftsCosting)}
      >
        Costing
      </Button>
      <Button
        type="button"
        variant="outline"
        size="sm"
        className="h-7 text-[10px]"
        onClick={() => onDossierJump('material', W2_MATERIAL_SUBPAGE_ANCHORS.bomNorms)}
      >
        Нормы BOM
      </Button>
    </Workshop2NineGapRelatedFooterShell>
  );
}
