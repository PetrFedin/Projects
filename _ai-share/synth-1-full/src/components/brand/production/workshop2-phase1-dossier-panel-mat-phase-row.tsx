'use client';

import * as LucideIcons from 'lucide-react';
import { MaterialCompositionBlock } from '@/components/brand/production/workshop2-phase1-dossier-panel-material-composition';
import { WorkshopInlineHintIcon } from '@/components/brand/production/workshop2-phase1-dossier-panel-field-hints';
import type { AttributeCatalogAttribute } from '@/lib/production/attribute-catalog.types';
import {
  matCompositionPctState,
  type MatPctRow,
} from '@/lib/production/workshop2-material-mat-rows';
import type { Workshop2DossierPhase1 } from '@/lib/production/workshop2-dossier-phase1.types';
import { cn } from '@/lib/utils';

type WorkshopMatPhase = '1' | '2' | '3';

export function Workshop2MatCompositionPhaseRow({
  phase,
  dossier,
  matAttribute,
  linkedComposition,
  onApplyRows,
  onApplySoloParts,
  showMaterialRequiredHint,
  showAttributeNameHintIcon,
  showOuterwearMatHint,
}: {
  phase: WorkshopMatPhase;
  dossier: Workshop2DossierPhase1;
  matAttribute: AttributeCatalogAttribute;
  linkedComposition: boolean;
  onApplyRows: (rows: MatPctRow[]) => void;
  onApplySoloParts: (parts: { parameterId: string; displayLabel: string }[]) => void;
  showMaterialRequiredHint: boolean;
  showAttributeNameHintIcon: boolean;
  showOuterwearMatHint: boolean;
}) {
  const matPctState = matCompositionPctState(dossier, matAttribute, linkedComposition);
  const matCompositionSumInvalid = linkedComposition && matPctState.invalid;

  return (
    <li id="w2-material-required-section" className="col-span-full min-w-0 list-none">
      <div
        className={cn(
          'border-border-subtle w-full min-w-0 space-y-3 rounded-lg border bg-white/80',
          matCompositionSumInvalid &&
            'ring-offset-bg-surface2/80 p-0.5 ring-2 ring-amber-400/90 ring-offset-2'
        )}
      >
        <div className="flex w-full min-w-0 items-start gap-3 pb-1">
          <div className="bg-accent-primary/10 text-accent-primary flex h-8 w-8 shrink-0 items-center justify-center rounded-lg">
            <LucideIcons.Layers className="h-4 w-4 shrink-0" aria-hidden />
          </div>
          <div className="min-w-0 flex-1 space-y-1">
            <div className="inline-flex max-w-full flex-wrap items-center gap-1">
              <h2 className="text-text-primary text-base font-semibold">Материал и состав</h2>
              {showAttributeNameHintIcon ? (
                <WorkshopInlineHintIcon label="Материал и состав">
                  <p>
                    Укажите основной материал из справочника. Если включён состав — доли по строкам
                    должны в сумме давать 100%.
                  </p>
                  {showOuterwearMatHint ? (
                    <p className="border-border-default mt-2 border-t pt-2">
                      Для верхней одежды разведите shell, подклад, утеплитель и фурнитуру по разным
                      строкам справочника.
                    </p>
                  ) : null}
                </WorkshopInlineHintIcon>
              ) : null}
            </div>
            <p className="text-text-secondary w-full min-w-0 text-xs leading-snug">
              Материалы и доли — по строкам из справочника. При связке с составом сумма процентов
              должна быть 100%.
            </p>
          </div>
        </div>
        <MaterialCompositionBlock
          dossier={dossier}
          matAttribute={matAttribute}
          linkedComposition={linkedComposition}
          onApplyRows={onApplyRows}
          onApplySoloParts={onApplySoloParts}
          showMaterialRequiredHint={showMaterialRequiredHint}
        />
      </div>
    </li>
  );
}
