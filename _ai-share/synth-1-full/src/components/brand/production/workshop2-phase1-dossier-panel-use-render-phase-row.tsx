'use client';

import { useCallback, type ReactNode } from 'react';
import {
  Workshop2DossierAttributeCard,
  type Workshop2DossierAttributeCardContextProps,
} from '@/components/brand/production/workshop2-phase1-dossier-panel-attribute-card';
import { Workshop2MatCompositionPhaseRow } from '@/components/brand/production/workshop2-phase1-dossier-panel-mat-phase-row';
import type { ResolvedPhase1AttributeRow } from '@/lib/production/attribute-catalog';
import type { AttributeCatalogAttribute } from '@/lib/production/attribute-catalog.types';
import type { MatPctRow } from '@/lib/production/workshop2-material-mat-rows';
import type { Workshop2DossierPhase1 } from '@/lib/production/workshop2-dossier-phase1.types';

export type UseWorkshop2Phase1DossierRenderPhaseRowParams = {
  applyMatRows: (rows: MatPctRow[]) => void;
  applyMatSoloParts: (parts: { parameterId: string; displayLabel: string }[]) => void;
  dossier: Workshop2DossierPhase1;
  dossierAttrCardCtx: Workshop2DossierAttributeCardContextProps;
  currentLeafL2Name: string;
  linkedMatComposition: boolean;
  linkedMatCompositionPhase2: boolean;
  linkedMatCompositionPhase3: boolean;
  matAttrDef: AttributeCatalogAttribute | null | undefined;
  matAttrForLeaf: AttributeCatalogAttribute | undefined;
  matRequiredUnset: boolean;
};

/** Рендер строки атрибута по фазе: материальная композиция или карточка атрибута. */
export function useWorkshop2Phase1DossierRenderPhaseRow({
  applyMatRows,
  applyMatSoloParts,
  dossier,
  dossierAttrCardCtx,
  currentLeafL2Name,
  linkedMatComposition,
  linkedMatCompositionPhase2,
  linkedMatCompositionPhase3,
  matAttrDef,
  matAttrForLeaf,
  matRequiredUnset,
}: UseWorkshop2Phase1DossierRenderPhaseRowParams) {
  return useCallback(
    (
      row: ResolvedPhase1AttributeRow,
      phase: '1' | '2' | '3',
      showAttributeNameHintIcon = false,
      strictAttributeFillLabelColors = false
    ): ReactNode => {
      if (row.attribute.attributeId === 'mat' && matAttrDef && matAttrForLeaf) {
        const linked =
          phase === '1'
            ? linkedMatComposition
            : phase === '2'
              ? linkedMatCompositionPhase2
              : linkedMatCompositionPhase3;

        return (
          <Workshop2MatCompositionPhaseRow
            key={
              phase === '1'
                ? 'mat-composition'
                : phase === '2'
                  ? 'mat-composition-p2'
                  : 'mat-composition-p3'
            }
            phase={phase}
            dossier={dossier}
            matAttribute={matAttrForLeaf}
            linkedComposition={linked}
            onApplyRows={applyMatRows}
            onApplySoloParts={applyMatSoloParts}
            showMaterialRequiredHint={phase === '1' && matRequiredUnset}
            showAttributeNameHintIcon={showAttributeNameHintIcon}
            showOuterwearMatHint={currentLeafL2Name === 'Верхняя одежда'}
          />
        );
      }
      return (
        <Workshop2DossierAttributeCard
          {...dossierAttrCardCtx}
          attribute={row.attribute}
          groupLabel={row.group?.label}
          variant="base"
          frame="card"
          workshopPhase={phase}
          showAttributeNameHintIcon={showAttributeNameHintIcon}
          strictAttributeFillLabelColors={strictAttributeFillLabelColors}
        />
      );
    },
    [
      applyMatRows,
      applyMatSoloParts,
      dossier,
      dossierAttrCardCtx,
      currentLeafL2Name,
      linkedMatComposition,
      linkedMatCompositionPhase2,
      linkedMatCompositionPhase3,
      matAttrDef,
      matAttrForLeaf,
      matRequiredUnset,
    ]
  );
}
