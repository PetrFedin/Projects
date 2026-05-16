'use client';

import type { Dispatch, ReactNode, SetStateAction } from 'react';
import type { ResolvedPhase1AttributeRow } from '@/lib/production/attribute-catalog';
import type { DossierSection } from '@/lib/production/dossier-readiness-engine';
import type { HandbookCategoryLeaf } from '@/lib/production/category-handbook-leaves';
import type { Workshop2DossierPhase1 } from '@/lib/production/workshop2-dossier-phase1.types';
import { W2_MATERIAL_SUBPAGE_ANCHORS } from '@/lib/production/workshop2-material-bom-anchors';
import { Workshop2CompositionLabelSpecBlock } from '@/components/brand/production/Workshop2CompositionLabelSpecBlock';
import { Workshop2MaterialSourcingBlock } from '@/components/brand/production/Workshop2MaterialSourcingBlock';
import { Workshop2MaterialTzHintsPanel } from '@/components/brand/production/Workshop2MaterialTzHintsPanel';
import { Workshop2ProductionBomByNodesPanel } from '@/components/brand/production/Workshop2ProductionBomByNodesPanel';
import {
  Workshop2DossierSectionRows,
  type Workshop2DossierSectionRowsSharedBundle,
} from '@/components/brand/production/workshop2-phase1-dossier-panel-section-rows';
import { Workshop2MaterialRequisitionPanel } from '@/components/brand/production/Workshop2MaterialRequisitionPanel';

export function Workshop2DossierMaterialSectionBody({
  currentLeaf,
  sectionRowsShared,
  sectionRowsCurrent,
  currentPhase,
  dossier,
  setDossier,
  tzWriteDisabled,
  tzSignoffStrip,
  tzBlockersFooter,
}: {
  currentLeaf: HandbookCategoryLeaf;
  sectionRowsShared: Workshop2DossierSectionRowsSharedBundle;
  sectionRowsCurrent: ResolvedPhase1AttributeRow[];
  currentPhase: '1' | '2' | '3';
  dossier: Workshop2DossierPhase1;
  setDossier: Dispatch<SetStateAction<Workshop2DossierPhase1>>;
  tzWriteDisabled: boolean;
  tzSignoffStrip: ReactNode;
  tzBlockersFooter: ReactNode;
}) {
  const l2 = currentLeaf.l2Name;
  const materialMatRows = sectionRowsCurrent.filter((r) => r.attribute.attributeId === 'mat');
  const materialCatalogRows = sectionRowsCurrent.filter(
    (r) => r.attribute.attributeId !== 'mat'
  );
  const materialOuterwearUnified = l2 === 'Верхняя одежда';
  const materialUnifiedFieldRows = [...materialMatRows, ...materialCatalogRows];
  const materialFieldsBlocks = materialOuterwearUnified ? (
    <div id="w2-material-mat" className="scroll-mt-24">
      <Workshop2DossierSectionRows
        {...sectionRowsShared}
        rows={materialUnifiedFieldRows}
        phase={currentPhase}
        extras={[]}
        opts={{
          materialCatalogAnchorAfterMat: W2_MATERIAL_SUBPAGE_ANCHORS.catalog,
          fieldLayout: 'grid2',
          flatCatalogGroups: true,
        }}
      />
    </div>
  ) : (
    <>
      <div id="w2-material-mat" className="scroll-mt-24">
        <Workshop2DossierSectionRows
          {...sectionRowsShared}
          rows={materialMatRows}
          phase={currentPhase}
          extras={[]}
          opts={{ fieldLayout: 'grid2', flatCatalogGroups: true }}
        />
      </div>
      <div id="w2-material-catalog" className="scroll-mt-24">
        <Workshop2DossierSectionRows
          {...sectionRowsShared}
          rows={materialCatalogRows}
          phase={currentPhase}
          extras={[]}
          opts={{ fieldLayout: 'grid2', flatCatalogGroups: true }}
        />
      </div>
    </>
  );

  return (
    <div id="w2-material-hub" className="scroll-mt-24 space-y-4 px-1 sm:px-2">
      <div
        id="w2-material-fields"
        className="border-border-default scroll-mt-24 space-y-4 rounded-xl border bg-white p-4 shadow-sm"
      >
        <Workshop2MaterialTzHintsPanel layout="embedded" l2Name={l2} />
        {materialFieldsBlocks}
      </div>
      <Workshop2ProductionBomByNodesPanel
        dossier={dossier}
        disabled={tzWriteDisabled}
        onChange={(patch) => setDossier((p: Workshop2DossierPhase1) => ({ ...p, ...patch }))}
      />
      <Workshop2CompositionLabelSpecBlock
        spec={dossier.compositionLabelSpec}
        onChange={(next) =>
          setDossier((p: Workshop2DossierPhase1) => ({ ...p, compositionLabelSpec: next }))
        }
        tzWriteDisabled={tzWriteDisabled}
        dossier={dossier}
      />
      {tzBlockersFooter}
      {tzSignoffStrip}
    </div>
  );
}
