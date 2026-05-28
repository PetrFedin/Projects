'use client';

import type { ResolvedPhase1AttributeRow } from '@/lib/production/attribute-catalog';
import {
  Workshop2DossierSectionRows,
  type Workshop2DossierSectionRowsSharedBundle,
} from '@/components/brand/production/workshop2-phase1-dossier-panel-section-rows';

/** Остальные вкладки ТЗ без отдельного тела — строки атрибутов текущей фазы. */
export function Workshop2DossierSectionBodyDefaultRows({
  sectionRowsShared,
  sectionRowsCurrent,
  currentPhase,
}: {
  sectionRowsShared: Workshop2DossierSectionRowsSharedBundle;
  sectionRowsCurrent: ResolvedPhase1AttributeRow[];
  currentPhase: '1' | '2' | '3';
}) {
  return (
    <Workshop2DossierSectionRows
      {...sectionRowsShared}
      rows={sectionRowsCurrent}
      phase={currentPhase}
    />
  );
}
