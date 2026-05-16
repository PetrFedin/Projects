'use client';

import type { Dispatch, SetStateAction } from 'react';
import * as LucideIcons from 'lucide-react';
import { Workshop2DesignerManifestoBlock } from '@/components/brand/production/Workshop2DesignerManifestoBlock';
import { VisualReferencesBlock } from '@/components/brand/production/workshop2-phase1-dossier-panel-visual-references-block';
import { WorkshopPassportColorBundle } from '@/components/brand/production/workshop2-phase1-dossier-panel-passport-color-bundle';
import { PASSPORT_COLOR_BUNDLE_ORDER } from '@/components/brand/production/workshop2-phase1-dossier-panel-dossier-constants';
import type { ResolvedPhase1AttributeRow } from '@/lib/production/attribute-catalog';
import type { HandbookCategoryLeaf } from '@/lib/production/category-handbook-leaves';
import type { Workshop2DossierPhase1 } from '@/lib/production/workshop2-dossier-phase1.types';
import type { Workshop2AttrComment } from '@/components/brand/production/workshop2-phase1-dossier-panel-attr-comments-dialog';
import type { DossierSection } from '@/lib/production/dossier-readiness-engine';

export type Workshop2DossierGeneralDesignVisualBlockProps = {
  isPhase1: boolean;
  dossier: Workshop2DossierPhase1;
  setDossier: Dispatch<SetStateAction<Workshop2DossierPhase1>>;
  saveDraft: () => void;
  updatedByLabel: string;
  sectionRowsCurrent: ResolvedPhase1AttributeRow[];
  currentLeaf: HandbookCategoryLeaf;
  currentPhase: '1' | '2' | '3';
  allowMultiHandbook: boolean;
  patchColor: (u: {
    handbook?: { parameterId: string; displayLabel: string } | null;
    freeText?: string;
  }) => void;
  onSetHandbookParametersWithColorBundleSync: (
    id: string,
    parts: { parameterId: string; displayLabel: string }[]
  ) => void;
  onSetHandbookParameters: (
    id: string,
    parts: { parameterId: string; displayLabel: string }[]
  ) => void;
  onFreeTextSide: (attributeId: string, text: string) => void;
  tzMinimalModeBySection: Record<DossierSection, boolean>;
  deferredAttrIds: Set<string>;
  toggleDeferAttribute: (attributeId: string) => void;
  attrCommentsById: Record<string, Workshop2AttrComment[] | undefined>;
  openAttrComments: (blockId: string) => void;
};

export function Workshop2DossierGeneralDesignVisualBlock({
  isPhase1,
  dossier,
  setDossier,
  saveDraft,
  updatedByLabel,
  sectionRowsCurrent,
  currentLeaf,
  currentPhase,
  allowMultiHandbook,
  patchColor,
  onSetHandbookParametersWithColorBundleSync,
  onSetHandbookParameters,
  onFreeTextSide,
  tzMinimalModeBySection,
  deferredAttrIds,
  toggleDeferAttribute,
  attrCommentsById,
  openAttrComments,
}: Workshop2DossierGeneralDesignVisualBlockProps) {
  return (
    <>
    {isPhase1 ? (
      <>
        <div
          id="w2-passport-design-intent"
          className="border-border-default scroll-mt-24 rounded-xl border bg-white p-4 shadow-sm"
        >
          <Workshop2DesignerManifestoBlock
            brandNotes={dossier.brandNotes}
            onBrandNotesChange={(value) =>
              setDossier((prev: Workshop2DossierPhase1) => ({ ...prev, brandNotes: value }))
            }
            onSaveDraft={saveDraft}
          />
        </div>
        <div
          id="w2-visuals-refs"
          className="border-border-default scroll-mt-24 rounded-xl border bg-white p-4 shadow-sm"
        >
          <VisualReferencesBlock
            items={dossier.visualReferences ?? []}
            onChange={(next) =>
              setDossier((p: Workshop2DossierPhase1) => ({ ...p, visualReferences: next }))
            }
            currentUserLabel={updatedByLabel}
            threadAuthorLabel={
              (dossier.passportProductionBrief?.articleCardOwnerName ?? '').trim() ||
              updatedByLabel
            }
            canonicalMainPhotoRefId={dossier.canonicalMainPhotoRefId}
            onSetCanonicalMainPhoto={(refId) =>
              setDossier((p: Workshop2DossierPhase1) => ({
                ...p,
                canonicalMainPhotoRefId: refId ?? undefined,
              }))
            }
          />
        </div>
        {(() => {
          const colorCells: ResolvedPhase1AttributeRow[] = [];
          for (const id of PASSPORT_COLOR_BUNDLE_ORDER) {
            const row = sectionRowsCurrent.find((r) => r.attribute.attributeId === id);
            if (row) colorCells.push(row);
          }
          if (colorCells.length === 0) return null;
          return (
            <div
              id="w2-visuals-attributes"
              className="border-border-default scroll-mt-24 rounded-xl border bg-white p-4 shadow-sm"
            >
              <div className="flex flex-wrap items-start gap-3 pb-3">
                <div className="bg-accent-primary/10 text-accent-primary flex h-8 w-8 shrink-0 items-center justify-center rounded-lg">
                  <LucideIcons.Palette className="h-4 w-4 shrink-0" aria-hidden />
                </div>
                <div className="min-w-0 flex-1 space-y-1">
                  <h2 className="text-text-primary text-base font-semibold">Цвет и палитра</h2>
                  <p className="text-text-secondary text-[11px] leading-snug">
                    Основной цвет, референс системы, палитра, градиент и свои оттенки.
                  </p>
                </div>
              </div>
              <ul className="list-none space-y-0 p-0">
                <WorkshopPassportColorBundle
                  bundleRows={colorCells}
                  dossier={dossier}
                  currentLeaf={currentLeaf}
                  phase={currentPhase}
                  allowMultiHandbook={allowMultiHandbook}
                  patchColor={patchColor}
                  showAttributeHintIcons
                  fieldDeferralPhase1={isPhase1 && !tzMinimalModeBySection.general}
                  deferredAttrIds={deferredAttrIds}
                  onToggleFieldDeferral={toggleDeferAttribute}
                  attrCommentsById={attrCommentsById}
                  onOpenAttrComments={openAttrComments}
                  onSetHandbookParameters={(id, parts) =>
                    id === 'primaryColorFamilyOptions' ||
                    id === 'colorReferenceSystemOptions' ||
                    id === 'color'
                      ? onSetHandbookParametersWithColorBundleSync(id, parts)
                      : onSetHandbookParameters(id, parts)
                  }
                  onFreeTextSide={onFreeTextSide}
                />
              </ul>
            </div>
          );
        })()}
      </>
    ) : null}
    </>
  );
}
