'use client';

import * as LucideIcons from 'lucide-react';
import type { ResolvedPhase1AttributeRow } from '@/lib/production/attribute-catalog';
import {
  Workshop2DossierSectionRows,
  type Workshop2DossierSectionRowsSharedBundle,
  type Workshop2DossierSectionRowsExtra,
} from '@/components/brand/production/workshop2-phase1-dossier-panel-section-rows';

export function Workshop2DossierSampleIntakeCatalogBlock({
  rows,
  phase,
  extras,
  sectionRowsShared,
}: {
  rows: ResolvedPhase1AttributeRow[];
  phase: '1' | '2' | '3';
  extras: Workshop2DossierSectionRowsExtra[];
  sectionRowsShared: Workshop2DossierSectionRowsSharedBundle;
}) {
  if (rows.length + extras.length === 0) return null;

  return (
    <div
      id="w2-sample-intake-catalog"
      className="border-border-default scroll-mt-24 space-y-3 rounded-xl border border-amber-200/60 bg-amber-50/20 p-4 shadow-sm"
    >
      <div className="flex flex-wrap items-start gap-3">
        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-amber-200 bg-white text-amber-900 shadow-sm">
          <LucideIcons.Globe className="h-4 w-4 shrink-0" aria-hidden />
        </div>
        <div className="min-w-0 flex-1 space-y-1">
          <h2 className="text-text-primary text-sm font-semibold">Таможня после образца (каталог)</h2>
          <p className="text-text-secondary text-xs leading-snug">
            Дополнительные коды ТН ВЭД, черновик до согласования, обоснование классификации и декларация HS
            не нужны цеху до раскроя — убраны из карточки артикула. Финальный пакет (код под отгрузку, ОКПД2,
            ТР, маркировка…) закрывается на вкладке артикула «Склад» в блоке приёмки сэмпла.
          </p>
        </div>
      </div>
      <Workshop2DossierSectionRows
        {...sectionRowsShared}
        rows={rows}
        phase={phase}
        extras={extras}
        opts={{
          showAttributeNameHintIcons: true,
          fieldLayout: 'grid2',
          strictAttributeFillLabelColors: true,
        }}
      />
    </div>
  );
}
