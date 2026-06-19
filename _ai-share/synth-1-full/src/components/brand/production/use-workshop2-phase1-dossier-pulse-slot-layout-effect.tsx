'use client';

import type { Dispatch, MutableRefObject, SetStateAction } from 'react';
import { useLayoutEffect, type ReactNode } from 'react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import type { DossierSection } from '@/lib/production/dossier-readiness-engine';
import type { HandbookCategoryLeaf } from '@/lib/production/category-handbook-leaves';
import type { MaterialBomExportInput } from '@/lib/production/workshop2-material-bom-export';
import type { MaterialBomHubModel } from '@/lib/production/workshop2-material-bom-check';
import type { MaterialSketchBomStrip } from '@/lib/production/workshop2-material-bom-sketch-strip';
import { W2_CONSTRUCTION_SUBPAGE_ANCHORS } from '@/lib/production/workshop2-construction-dossier-anchors';
import { W2_VISUALS_SKETCH_ANCHOR_ID } from '@/lib/production/workshop2-material-bom-sketch-strip';
import {
  buildWorkshop2VisualGateItems,
  W2_VISUAL_SUBPAGE_ANCHORS,
} from '@/lib/production/workshop2-visual-section-warnings';
import type {
  Workshop2DossierPhase1,
  Workshop2Phase1SketchSheet,
  Workshop2TzSignoffSectionKey,
} from '@/lib/production/workshop2-dossier-phase1.types';
import type { Workshop2DossierViewProfile } from '@/lib/production/workshop2-dossier-view-infrastructure';
import type { Workshop2Phase1DossierPanelProps } from '@/components/brand/production/workshop2-phase1-dossier-panel-props';
import { Workshop2MaterialHubPanel } from '@/components/brand/production/Workshop2MaterialHubPanel';
import { Workshop2VisualsExcellenceBlock } from '@/components/brand/production/Workshop2VisualsExcellenceBlock';

export type Workshop2Phase1PulseSlotRef = MutableRefObject<{
  renderVisualHub?: () => ReactNode;
  renderMaterialBomHub?: () => ReactNode;
  renderTzMinimalControls?: () => ReactNode;
}>;

export function useWorkshop2Phase1DossierPulseSlotLayoutEffect(p: {
  pulseSlotRef: Workshop2Phase1PulseSlotRef | undefined;
  dossier: Workshop2DossierPhase1;
  setDossier: Dispatch<SetStateAction<Workshop2DossierPhase1>>;
  updatedByLabel: string;
  normalizedSketchSheets: Workshop2Phase1SketchSheet[];
  skuDraft: string;
  nameDraft: string;
  currentLeaf: HandbookCategoryLeaf;
  visualsShareAbsoluteUrl: string;
  /** Режим «цех» по query `?sketchFloor=1` — см. `useWorkshop2Phase1DossierSketchFloorMode`. */
  sketchViewFloor: boolean;
  currentPhase: '1' | '2' | '3';
  dossierViewProfile: Workshop2DossierViewProfile;
  onNavigateToTab?: Workshop2Phase1DossierPanelProps['onNavigateToTab'];
  buildRouteHandoffAbsoluteUrl: (tab: 'fit' | 'qc' | 'supply', domId: string) => string;
  sectionReadinessConstructionPct: number;
  materialBomHubModel: MaterialBomHubModel;
  materialMatHint: string;
  materialCategoryNotes: string[];
  materialSketchBomStripModel: MaterialSketchBomStrip | null;
  materialBomExportInput: MaterialBomExportInput;
  tzWriteDisabled: boolean;
  sketchBomRefsUnion: string[];
  matSketchBomGapRefs: string[];
  collectionId: string;
  articleId: string;
  jumpToTzSectionAnchorFromPulse: (section: Workshop2TzSignoffSectionKey, anchorId: string) => void;
  onRequestClosePulse?: () => void;
  openSketchFromMaterialHubForPulse: () => void;
  jumpToQcArticleSection: () => void;
  tzMinimalModeBySection: Record<DossierSection, boolean>;
  setTzMinimalModeBySection: Dispatch<SetStateAction<Record<DossierSection, boolean>>>;
}) {
  const {
    pulseSlotRef,
    dossier,
    setDossier,
    updatedByLabel,
    normalizedSketchSheets,
    skuDraft,
    nameDraft,
    currentLeaf,
    visualsShareAbsoluteUrl,
    sketchViewFloor,
    currentPhase,
    dossierViewProfile,
    onNavigateToTab,
    buildRouteHandoffAbsoluteUrl,
    sectionReadinessConstructionPct,
    materialBomHubModel,
    materialMatHint,
    materialCategoryNotes,
    materialSketchBomStripModel,
    materialBomExportInput,
    tzWriteDisabled,
    sketchBomRefsUnion,
    matSketchBomGapRefs,
    collectionId,
    articleId,
    jumpToTzSectionAnchorFromPulse,
    onRequestClosePulse,
    openSketchFromMaterialHubForPulse,
    jumpToQcArticleSection,
    tzMinimalModeBySection,
    setTzMinimalModeBySection,
  } = p;

  useLayoutEffect(() => {
    if (!pulseSlotRef) return;
    const mediaRefIds = (dossier.visualReferences ?? []).map((r) => r.refId);
    const sheetOptions = normalizedSketchSheets.map((s) => ({
      sheetId: s.sheetId,
      title: (s.title ?? '').trim() || 'Лист',
    }));
    const visualGateItems = buildWorkshop2VisualGateItems(dossier, currentLeaf);
    pulseSlotRef.current.renderVisualHub = () => (
      <Workshop2VisualsExcellenceBlock
        dossier={dossier}
        setDossier={setDossier}
        updatedByLabel={updatedByLabel}
        mediaRefIds={mediaRefIds}
        sheetOptions={sheetOptions}
        articleSku={skuDraft}
        articleName={nameDraft}
        visualGateItems={visualGateItems}
        onJumpToVisualAnchor={(anchorId) => {
          const id = anchorId.replace(/^#/, '');
          const inConstructionDom = new Set([
            W2_VISUALS_SKETCH_ANCHOR_ID,
            W2_VISUAL_SUBPAGE_ANCHORS.sketchTemplates,
            'w2-visuals-sketch-export-surfaces',
            'w2-visuals-sketch-link-fields',
            'w2-visuals-checklist',
            'w2-visuals-canon-version',
            'w2-visuals-handoff',
          ]);
          if (inConstructionDom.has(id)) {
            jumpToTzSectionAnchorFromPulse('construction', id);
          } else if (id === W2_VISUAL_SUBPAGE_ANCHORS.attributes) {
            jumpToTzSectionAnchorFromPulse('general', id);
          } else if (id === W2_VISUAL_SUBPAGE_ANCHORS.refs) {
            jumpToTzSectionAnchorFromPulse('general', 'w2-visuals-refs');
          } else if (id === W2_VISUAL_SUBPAGE_ANCHORS.hub) {
            jumpToTzSectionAnchorFromPulse('construction', id);
          } else {
            jumpToTzSectionAnchorFromPulse('general', id);
          }
        }}
        visualShareAbsoluteUrl={visualsShareAbsoluteUrl}
        sketchFloorInUrl={sketchViewFloor}
        tzPhase={currentPhase}
        onJumpToPassportSection={() => jumpToTzSectionAnchorFromPulse('general', 'w2-passport-hub')}
        onJumpToMaterialSection={() =>
          jumpToTzSectionAnchorFromPulse('material', 'w2-material-hub')
        }
        dossierViewProfile={dossierViewProfile}
        onHandoffToRoute={(tab, domId) => {
          onRequestClosePulse?.();
          onNavigateToTab?.(tab, { scrollDomId: domId });
        }}
        buildRouteHandoffAbsoluteUrl={buildRouteHandoffAbsoluteUrl}
        nineGapSectionPct={sectionReadinessConstructionPct}
        nineGapOnDossierJump={jumpToTzSectionAnchorFromPulse}
      />
    );
    pulseSlotRef.current.renderMaterialBomHub = () => (
      <Workshop2MaterialHubPanel
        model={materialBomHubModel}
        l2Name={currentLeaf.l2Name}
        matHint={materialMatHint}
        categoryNotes={materialCategoryNotes}
        sketchBomStrip={materialSketchBomStripModel}
        bomExport={materialBomExportInput}
        onNavigate={(anchorId) => {
          onRequestClosePulse?.();
          onNavigateToTab?.('tz', {
            dossierSection: 'material',
            scrollDomId: anchorId.replace(/^#/, ''),
          });
        }}
        onOpenVisualSketch={openSketchFromMaterialHubForPulse}
        tzWriteDisabled={tzWriteDisabled}
        onJumpToPassportSection={() => jumpToTzSectionAnchorFromPulse('general', 'w2-passport-hub')}
        onJumpToVisualSection={() =>
          jumpToTzSectionAnchorFromPulse('general', 'w2-passport-design-intent')
        }
        articleScopedKey={`${collectionId}:${articleId}`}
        materialComplianceChecklist={dossier.materialComplianceChecklist ?? {}}
        onMaterialComplianceChecklistChange={(next) =>
          setDossier((prev: Workshop2DossierPhase1) => ({
            ...prev,
            materialComplianceChecklist: next,
          }))
        }
        dossierViewProfile={dossierViewProfile}
        sketchLinkedBomRefs={sketchBomRefsUnion}
        matSketchBomGapRefs={matSketchBomGapRefs}
        onJumpToConstructionContour={() =>
          jumpToTzSectionAnchorFromPulse('construction', W2_CONSTRUCTION_SUBPAGE_ANCHORS.contour)
        }
        onJumpToQcRoute={
          onNavigateToTab
            ? () => {
                onRequestClosePulse?.();
                jumpToQcArticleSection();
              }
            : undefined
        }
      />
    );
    const minimalSections: { key: DossierSection; label: string }[] = [
      { key: 'general', label: 'Паспорт' },
      { key: 'visuals', label: 'Визуал' },
      { key: 'material', label: 'Материалы' },
      { key: 'construction', label: 'Конструкция' },
    ];
    pulseSlotRef.current.renderTzMinimalControls =
      currentPhase === '1' || currentPhase === '2'
        ? () => (
            <div className="border-border-subtle bg-bg-surface2/40 space-y-2 rounded-lg border px-3 py-2">
              <p className="text-text-primary text-[11px] font-semibold">Минимум шага (фазы 1–2)</p>
              <p className="text-text-muted text-[10px] leading-snug">
                Показывать только обязательные поля и скрывать «Позже» там, где это поддерживается.
              </p>
              <div className="flex flex-col gap-1.5">
                {minimalSections.map(({ key, label }) => {
                  const on = Boolean(tzMinimalModeBySection[key]);
                  return (
                    <div
                      key={key}
                      className="border-border-subtle/70 flex flex-wrap items-center justify-between gap-2 rounded-md border bg-white/80 px-2 py-1.5"
                    >
                      <span className="text-text-secondary text-[10px] font-medium">{label}</span>
                      <Button
                        type="button"
                        variant={on ? 'default' : 'outline'}
                        size="sm"
                        className={cn('h-7 text-[10px]', on && 'shadow-sm')}
                        onClick={() =>
                          setTzMinimalModeBySection((prev) => ({
                            ...prev,
                            [key]: !prev[key],
                          }))
                        }
                      >
                        {on ? 'Вкл' : 'Выкл'}
                      </Button>
                    </div>
                  );
                })}
              </div>
            </div>
          )
        : () => null;
    return () => {
      delete pulseSlotRef.current.renderVisualHub;
      delete pulseSlotRef.current.renderMaterialBomHub;
      delete pulseSlotRef.current.renderTzMinimalControls;
    };
  }, [
    pulseSlotRef,
    dossier,
    setDossier,
    updatedByLabel,
    normalizedSketchSheets,
    skuDraft,
    nameDraft,
    currentLeaf,
    visualsShareAbsoluteUrl,
    sketchViewFloor,
    currentPhase,
    dossierViewProfile,
    onNavigateToTab,
    buildRouteHandoffAbsoluteUrl,
    sectionReadinessConstructionPct,
    materialBomHubModel,
    materialMatHint,
    materialCategoryNotes,
    materialSketchBomStripModel,
    materialBomExportInput,
    tzWriteDisabled,
    sketchBomRefsUnion,
    matSketchBomGapRefs,
    collectionId,
    articleId,
    jumpToTzSectionAnchorFromPulse,
    onRequestClosePulse,
    openSketchFromMaterialHubForPulse,
    jumpToQcArticleSection,
    tzMinimalModeBySection,
    setTzMinimalModeBySection,
  ]);
}
