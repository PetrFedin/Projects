'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import * as LucideIcons from 'lucide-react';
import {
  Workshop2DossierSectionRows,
  type Workshop2DossierSectionRowsExtra,
  type Workshop2DossierSectionRowsSharedBundle,
} from '@/components/brand/production/workshop2-phase1-dossier-panel-section-rows';
import type { ResolvedPhase1AttributeRow } from '@/lib/production/attribute-catalog';
import {
  passportCheckpointTitleClass,
  type Workshop2PassportHubModel,
} from '@/lib/production/workshop2-passport-check';
import { cn } from '@/lib/utils';

export type Workshop2DossierGeneralArticleStartBlockProps = {
  isPhase1: boolean;
  showPhase1PassportArticleCard: boolean;
  passportHubModel: Workshop2PassportHubModel;
  currentPhase: '1' | '2' | '3';
  workshop2DossierSectionRowsSharedProps: Workshop2DossierSectionRowsSharedBundle;
  passportArticleCardStartRows: ResolvedPhase1AttributeRow[];
  passportArticleCardStartExtras: Workshop2DossierSectionRowsExtra[];
  generalPassportPreSampleRows: ResolvedPhase1AttributeRow[];
  generalPassportPreSampleExtras: Workshop2DossierSectionRowsExtra[];
  passportSewingPlanStartRows: ResolvedPhase1AttributeRow[];
  passportSewingPlanStartExtras: Workshop2DossierSectionRowsExtra[];
  passportStep1BriefHref: string;
};

export function Workshop2DossierGeneralArticleStartBlock({
  isPhase1,
  showPhase1PassportArticleCard,
  passportHubModel,
  currentPhase,
  workshop2DossierSectionRowsSharedProps,
  passportArticleCardStartRows,
  passportArticleCardStartExtras,
  generalPassportPreSampleRows,
  generalPassportPreSampleExtras,
  passportSewingPlanStartRows,
  passportSewingPlanStartExtras,
  passportStep1BriefHref,
}: Workshop2DossierGeneralArticleStartBlockProps) {
  return (
    <>
    {isPhase1 ? (
      showPhase1PassportArticleCard ? (
        <div
          id="w2-passport-start"
          className="border-border-default scroll-mt-24 space-y-4 rounded-xl border bg-white p-4 shadow-sm"
        >
          <div className="flex items-start gap-3 pb-1">
            <div className="bg-accent-primary/10 text-accent-primary flex h-8 w-8 shrink-0 items-center justify-center rounded-lg">
              <LucideIcons.LayoutGrid className="h-4 w-4 shrink-0" aria-hidden />
            </div>
            <div className="min-w-0 flex-1 space-y-1">
              <h2 className="text-text-primary text-base font-semibold">Карточка артикула</h2>
              <p className="text-text-secondary text-[11px] leading-snug">
                Основные поля карточки товара для каталога (дополнительные коды ТН ВЭД — на этапе приемки сэмпла).
              </p>
            </div>
          </div>
      <Workshop2DossierSectionRows
        {...workshop2DossierSectionRowsSharedProps}
        rows={passportArticleCardStartRows}
        phase={currentPhase}
        extras={passportArticleCardStartExtras}
        opts={{
          showAttributeNameHintIcons: true,
          fieldLayout: 'grid2',
          strictAttributeFillLabelColors: true,
          flatCatalogGroups: true,
        }}
      />
      {generalPassportPreSampleRows.length + generalPassportPreSampleExtras.length > 0 ? (
        <Workshop2DossierSectionRows
          {...workshop2DossierSectionRowsSharedProps}
          rows={generalPassportPreSampleRows}
          phase={currentPhase}
          extras={generalPassportPreSampleExtras}
          opts={{
            showAttributeNameHintIcons: true,
            fieldLayout: 'grid2',
            strictAttributeFillLabelColors: true,
            flatCatalogGroups: true,
          }}
        />
      ) : null}
        </div>
      ) : null
    ) : (
      <>
        <div
          id="w2-passport-brief"
          className="border-border-default scroll-mt-24 rounded-lg border bg-white p-3 shadow-sm"
        >
          <p className="text-text-secondary text-[11px] leading-snug">
            Сроки и тип запуска задаются в блоке «Паспорт артикула» выше.
          </p>
          <Button asChild variant="outline" size="sm" className="mt-2 h-8 text-[10px]">
            <Link href={passportStep1BriefHref}>Шаг 1 ТЗ → паспорт</Link>
          </Button>
        </div>
        <div
          id="w2-passport-start"
          className="border-border-default scroll-mt-24 space-y-4 rounded-xl border bg-white p-4 shadow-sm"
        >
          <div className="flex items-start gap-3 pb-1">
            <div className="bg-accent-primary/10 text-accent-primary flex h-8 w-8 shrink-0 items-center justify-center rounded-lg">
              <LucideIcons.LayoutGrid className="h-4 w-4 shrink-0" aria-hidden />
            </div>
            <div className="min-w-0 flex-1 space-y-1">
              <h2
                className={cn(
                  'text-base font-semibold',
                  passportCheckpointTitleClass(passportHubModel, 'pc-start')
                )}
              >
                Старт по каталогу
              </h2>
              <p className="text-text-secondary text-[11px] leading-snug">
                Поля паспорта на шаге {currentPhase} ТЗ.
                {generalPassportPreSampleRows.length + generalPassportPreSampleExtras.length > 0
                  ? ' Поля «до образца» (рынок, коды) — ниже.'
                  : ''}
              </p>
            </div>
          </div>
          {passportSewingPlanStartRows.length + passportSewingPlanStartExtras.length > 0 ? (
            <div className="border-border-subtle space-y-2 rounded-lg border bg-bg-surface2/30 p-3">
              <p className="text-text-secondary text-[10px] font-semibold">
                План: штрихкод, ТН ВЭД, стоимость / Incoterms
              </p>
                <Workshop2DossierSectionRows
                  {...workshop2DossierSectionRowsSharedProps}
                  rows={passportSewingPlanStartRows}
                  phase={currentPhase}
                  extras={passportSewingPlanStartExtras}
                  opts={{
                    showAttributeNameHintIcons: true,
                    fieldLayout: 'grid2',
                    strictAttributeFillLabelColors: true,
                    flatCatalogGroups: true,
                  }}
                />
            </div>
          ) : null}
      <Workshop2DossierSectionRows
        {...workshop2DossierSectionRowsSharedProps}
        rows={passportArticleCardStartRows}
        phase={currentPhase}
        extras={passportArticleCardStartExtras}
        opts={{
          showAttributeNameHintIcons: true,
          fieldLayout: 'grid2',
          strictAttributeFillLabelColors: true,
          flatCatalogGroups: true,
        }}
      />
      {generalPassportPreSampleRows.length + generalPassportPreSampleExtras.length > 0 ? (
        <Workshop2DossierSectionRows
          {...workshop2DossierSectionRowsSharedProps}
          rows={generalPassportPreSampleRows}
          phase={currentPhase}
          extras={generalPassportPreSampleExtras}
          opts={{
            showAttributeNameHintIcons: true,
            fieldLayout: 'grid2',
            strictAttributeFillLabelColors: true,
            flatCatalogGroups: true,
          }}
        />
      ) : null}
        </div>
      </>
    )}
    </>
  );
}
