'use client';

import type { Dispatch, ReactNode, SetStateAction } from 'react';
import * as LucideIcons from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { CategorySketchAnnotator } from '@/components/brand/production/CategorySketchAnnotator';
import { SketchViewModeToggle } from '@/components/brand/production/SketchViewModeToggle';
import { SubcategorySketchTasksRibbon } from '@/components/brand/production/SubcategorySketchTasksRibbon';
import { DEFAULT_MASTER_PIN_SNIPPETS } from '@/lib/production/workshop2-sketch-sheets';
import { WORKSHOP2_MASTER_SKETCH_PIN_TEMPLATES_UI_ENABLED } from '@/lib/production/workshop2-sketch-pin-templates';
import { appendCategorySketchRevisionSnapshot } from '@/lib/production/sketch-plm-revisions';
import { mergeSketchMasterAuditLog } from '@/lib/production/sketch-annotation-audit';
import type { HandbookCategoryLeaf } from '@/lib/production/category-handbook-leaves';
import type {
  Workshop2DossierPhase1,
  Workshop2SketchPinTemplate,
  Workshop2TzPanelSectionId,
  Workshop2TzSignoffSectionKey,
  Workshop2TzSignoffStageId,
} from '@/lib/production/workshop2-dossier-phase1.types';
import type { VisualCatalogSketchLinkRow } from '@/lib/production/workshop2-sketch-tz-matrix';

type WorkshopSketchWorkspaceTab =
  | 'overview'
  | 'tz'
  | 'supply'
  | 'fit'
  | 'plan'
  | 'release'
  | 'qc'
  | 'stock';

export function Workshop2DossierConstructionSketchPhase23Panel({
  sketchPrimaryStatus,
  sketchViewFloor,
  setSketchFloorMode,
  lockedSketchFloorOnly,
  tzWriteDisabled,
  copySketchFloorLink,
  saveSketchLabelsSnapshot,
  sketchBundleBusy,
  exportSketchVisualBundleZip,
  setSketchPinLibraryOpen,
  sketchMasterTemplateId,
  setSketchMasterTemplateId,
  sketchEditsLocked,
  dossier,
  setDossier,
  orgSketchTemplatesList,
  applyMasterSketchPinTemplate,
  saveMasterSketchPinTemplate,
  saveMasterSketchPinTemplateToOrg,
  currentLeaf,
  sketchAttributeOptions,
  selectedAudienceId,
  selectedAudienceLabel,
  onNavigateWorkspaceTab,
  onJumpToTzPanelSection,
  onNavigateSketchRouteStage,
  appendSketchSheetFromUpload,
  skuDraft,
  nameDraft,
  updatedByLabel,
  visualsCatalogAttributeIdsForSketch,
  visualsCatalogSketchLinksForPins,
  onVisualCatalogSuggestFromSketch,
}: {
  sketchPrimaryStatus: ReactNode;
  sketchViewFloor: boolean;
  setSketchFloorMode: (floor: boolean) => void;
  lockedSketchFloorOnly: boolean;
  tzWriteDisabled: boolean;
  copySketchFloorLink: () => void;
  saveSketchLabelsSnapshot: () => void;
  sketchBundleBusy: boolean;
  exportSketchVisualBundleZip: () => void | Promise<void>;
  setSketchPinLibraryOpen: Dispatch<SetStateAction<boolean>>;
  sketchMasterTemplateId: string;
  setSketchMasterTemplateId: Dispatch<SetStateAction<string>>;
  sketchEditsLocked: boolean;
  dossier: Workshop2DossierPhase1;
  setDossier: Dispatch<SetStateAction<Workshop2DossierPhase1>>;
  orgSketchTemplatesList: readonly Workshop2SketchPinTemplate[];
  applyMasterSketchPinTemplate: (mode: 'merge' | 'replace') => void;
  saveMasterSketchPinTemplate: () => void;
  saveMasterSketchPinTemplateToOrg: () => void;
  currentLeaf: HandbookCategoryLeaf;
  sketchAttributeOptions: { id: string; label: string }[];
  selectedAudienceId: string;
  selectedAudienceLabel: string;
  onNavigateWorkspaceTab?: (
    tab: WorkshopSketchWorkspaceTab,
    opts?: { dossierSection?: Workshop2TzSignoffSectionKey; scrollDomId?: string }
  ) => void;
  onJumpToTzPanelSection: (section: Workshop2TzPanelSectionId) => void;
  onNavigateSketchRouteStage: (stage: Workshop2TzSignoffStageId) => void;
  appendSketchSheetFromUpload: (imageDataUrl: string, imageFileName?: string) => void;
  skuDraft: string;
  nameDraft: string;
  updatedByLabel: string;
  visualsCatalogAttributeIdsForSketch: readonly string[];
  visualsCatalogSketchLinksForPins: readonly VisualCatalogSketchLinkRow[];
  onVisualCatalogSuggestFromSketch: (ids: string[]) => void;
}) {
  return (
    <>
      <div className="flex items-start gap-3">
        <div className="bg-accent-primary/10 text-accent-primary flex h-8 w-8 shrink-0 items-center justify-center rounded-lg">
          <LucideIcons.Pencil className="h-4 w-4 shrink-0" aria-hidden />
        </div>
        <div className="min-w-0 flex-1 space-y-1">
          <h2 className="text-text-primary text-base font-semibold">Скетч по категории</h2>
          <p className="text-text-secondary text-sm leading-snug">
            Один силуэт на выбранную ветку каталога: отметьте узлы на скетче, привяжите метки к
            полям ТЗ.
          </p>
          <div className="flex flex-col gap-2 pt-2 sm:flex-row sm:flex-wrap sm:items-stretch">
            <div className="flex flex-wrap items-center gap-2">
              <SketchViewModeToggle
                floor={sketchViewFloor}
                onFloorChange={setSketchFloorMode}
                lockedToFloor={lockedSketchFloorOnly || tzWriteDisabled}
                onCopyFloorLink={copySketchFloorLink}
              />
              <Button
                type="button"
                variant="outline"
                size="sm"
                className="h-8 text-xs"
                onClick={saveSketchLabelsSnapshot}
              >
                Снимок меток
              </Button>
              <Button
                type="button"
                variant="outline"
                size="sm"
                className="h-8 text-xs"
                disabled={sketchBundleBusy}
                onClick={() => void exportSketchVisualBundleZip()}
              >
                {sketchBundleBusy ? 'Архив…' : 'ZIP: PNG + PDF'}
              </Button>
              <Button
                type="button"
                variant="secondary"
                size="sm"
                className="h-8 text-xs"
                onClick={() => setSketchPinLibraryOpen(true)}
              >
                Снимки и шаблоны…
              </Button>
            </div>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="text-text-secondary hover:text-text-primary h-8 w-8 shrink-0"
                  aria-label="Панель скетча: как пользоваться"
                >
                  <LucideIcons.CircleHelp className="h-4 w-4 shrink-0" aria-hidden />
                </Button>
              </PopoverTrigger>
              <PopoverContent
                align="end"
                className="max-h-[min(32rem,70vh)] w-[min(calc(100vw-1.5rem),24rem)] overflow-y-auto p-0"
                sideOffset={6}
              >
                <div className="border-border-subtle bg-bg-surface2/80 border-b px-4 py-3">
                  <p className="text-text-primary text-sm font-semibold">Панель над скетчем</p>
                  <p className="text-text-secondary mt-1 text-xs leading-snug">
                    Те же смыслы, что и в фазе 1: режим ТЗ/цех, ссылка для цеха, библиотека и
                    выгрузки.
                  </p>
                </div>
                <div className="text-text-primary space-y-4 p-4 text-xs leading-relaxed">
                  <section>
                    <p className="text-text-primary font-semibold">Режим · ТЗ / Цех</p>
                    <p className="text-text-secondary mt-1">
                      ТЗ — правки меток; цех — только просмотр крупных номеров. Ссылка цеха копирует
                      URL с{' '}
                      <code className="bg-bg-surface2 rounded px-1 py-0.5 font-mono text-[10px]">
                        ?sketchFloor=1
                      </code>
                      .
                    </p>
                  </section>
                  <section>
                    <p className="text-text-primary font-semibold">Снимки и шаблоны</p>
                    <p className="text-text-secondary mt-1">
                      Открывает библиотеку шаблонов и эталонов. Снимок меток и ZIP — быстрый экспорт
                      без меню «Ещё».
                    </p>
                  </section>
                </div>
              </PopoverContent>
            </Popover>
          </div>
        </div>
      </div>
      {sketchPrimaryStatus}
      {WORKSHOP2_MASTER_SKETCH_PIN_TEMPLATES_UI_ENABLED ? (
        <div className="border-border-subtle bg-bg-surface2/60 flex flex-col gap-2 rounded-lg border p-2 sm:flex-row sm:flex-wrap sm:items-center">
          <span className="text-text-secondary text-[10px] font-semibold">Шаблоны меток</span>
          <select
            className="border-border-default h-9 min-w-[200px] flex-1 rounded-md border bg-white px-2 text-sm disabled:opacity-60"
            value={sketchMasterTemplateId}
            disabled={sketchEditsLocked}
            onChange={(e) => setSketchMasterTemplateId(e.target.value)}
            aria-label="Выбор шаблона меток"
          >
            <option value="">— шаблон —</option>
            {(dossier.sketchPinTemplates ?? []).length > 0 ? (
              <optgroup label="Это досье">
                {(dossier.sketchPinTemplates ?? []).map((t) => (
                  <option key={`d:${t.templateId}`} value={`d:${t.templateId}`}>
                    {t.name} ({t.annotations.length} пин.)
                  </option>
                ))}
              </optgroup>
            ) : null}
            {orgSketchTemplatesList.length > 0 ? (
              <optgroup label="Библиотека коллекции (браузер)">
                {orgSketchTemplatesList.map((t) => (
                  <option key={`o:${t.templateId}`} value={`o:${t.templateId}`}>
                    {t.name} ({t.annotations.length} пин.)
                  </option>
                ))}
              </optgroup>
            ) : null}
          </select>
          <div className="flex flex-wrap gap-1.5">
            <Button
              type="button"
              variant="outline"
              size="sm"
              className="h-8 text-xs"
              disabled={!sketchMasterTemplateId || sketchEditsLocked}
              onClick={() => applyMasterSketchPinTemplate('merge')}
            >
              + К доске
            </Button>
            <Button
              type="button"
              variant="outline"
              size="sm"
              className="h-8 text-xs"
              disabled={!sketchMasterTemplateId || sketchEditsLocked}
              onClick={() => applyMasterSketchPinTemplate('replace')}
            >
              Заменить
            </Button>
            <Button
              type="button"
              variant="secondary"
              size="sm"
              className="h-8 text-xs"
              disabled={sketchEditsLocked}
              onClick={saveMasterSketchPinTemplate}
            >
              В досье
            </Button>
            <Button
              type="button"
              variant="secondary"
              size="sm"
              className="h-8 text-xs"
              disabled={sketchEditsLocked}
              onClick={saveMasterSketchPinTemplateToOrg}
            >
              В коллекцию
            </Button>
          </div>
        </div>
      ) : null}
      <CategorySketchAnnotator
        currentLeaf={currentLeaf}
        imageDataUrl={dossier.categorySketchImageDataUrl}
        imageFileName={dossier.categorySketchImageFileName}
        annotations={dossier.categorySketchAnnotations ?? []}
        attributeOptions={sketchAttributeOptions}
        sketchContext={{
          audienceId: selectedAudienceId,
          audienceName: selectedAudienceLabel,
          isUnisex: dossier.isUnisex,
        }}
        onNavigateStage={(stage) => onNavigateWorkspaceTab?.(stage)}
        onJumpToDossierSection={onJumpToTzPanelSection}
        onNavigateRouteStage={onNavigateSketchRouteStage}
        onPatch={(patch) => setDossier((p: Workshop2DossierPhase1) => ({ ...p, ...patch }))}
        onAddAsNewSheetFromUpload={appendSketchSheetFromUpload}
        showPassportSectionHeader={false}
        pinTextSnippets={DEFAULT_MASTER_PIN_SNIPPETS}
        exportFileNameStem={`master-${skuDraft.replace(/[^a-zA-Z0-9а-яА-ЯёЁ._-]+/g, '-').slice(0, 48)}`}
        articleSku={skuDraft}
        viewMode={sketchEditsLocked ? 'floor' : 'edit'}
        subcategorySketchSlots={dossier.subcategorySketchSlots ?? []}
        categorySketchCompareOverlayDataUrl={
          dossier.categorySketchCompareOverlayDataUrl ?? undefined
        }
        categorySketchCompareOverlayFileName={
          dossier.categorySketchCompareOverlayFileName ?? undefined
        }
        categorySketchCompareOverlayOpacityPct={dossier.categorySketchCompareOverlayOpacityPct}
        categorySketchCompareOverlayScalePct={dossier.categorySketchCompareOverlayScalePct}
        categorySketchCompareOffsetXPct={dossier.categorySketchCompareOffsetXPct}
        categorySketchCompareOffsetYPct={dossier.categorySketchCompareOffsetYPct}
        sketchPropagatedDrafts={dossier.sketchPropagatedDrafts ?? []}
        auditActor={updatedByLabel}
        categorySketchRevisionLabel={dossier.categorySketchRevisionLabel}
        categorySketchFreezeUntilDate={dossier.categorySketchFreezeUntilDate}
        categorySketchProductionApproved={dossier.categorySketchProductionApproved}
        categorySketchCompliance={dossier.categorySketchCompliance}
        sketchBrandbookConstraints={dossier.sketchBrandbookConstraints}
        sketchMasterAnnotationAuditLog={dossier.sketchMasterAnnotationAuditLog ?? []}
        categorySketchRevisionSnapshots={dossier.categorySketchRevisionSnapshots ?? []}
        categorySketchSceneId={dossier.categorySketchSceneId}
        categorySketchSceneView={dossier.categorySketchSceneView}
        sketchMesDefectCatalog={dossier.sketchMesDefectCatalog}
        sketchMaterialCards={dossier.categorySketchMaterialCards ?? []}
        onSketchMaterialCardsChange={(next) =>
          setDossier((p: Workshop2DossierPhase1) => ({
            ...p,
            categorySketchMaterialCards: next,
          }))
        }
        onAppendSketchRevisionSnapshot={() => {
          setDossier((p: Workshop2DossierPhase1) => {
            const next = appendCategorySketchRevisionSnapshot(p, {
              leafId: currentLeaf.leafId,
              by: updatedByLabel,
              revisionLabel: p.categorySketchRevisionLabel ?? 'snapshot',
              annotations: p.categorySketchAnnotations ?? [],
              compliance: p.categorySketchCompliance,
            });
            const snap = next.categorySketchRevisionSnapshots?.at(-1);
            const pinCount = snap?.annotations.length ?? 0;
            const audit = mergeSketchMasterAuditLog(next.sketchMasterAnnotationAuditLog ?? [], [
              {
                entryId:
                  typeof crypto !== 'undefined' && crypto.randomUUID
                    ? crypto.randomUUID()
                    : `e-${Date.now()}`,
                at: new Date().toISOString(),
                by: updatedByLabel,
                annotationId: '__plm_snapshot__',
                action: 'revision_snapshot',
                summary: `Архив PLM: снимок «${p.categorySketchRevisionLabel ?? 'snapshot'}», ${pinCount} мет.`,
              },
            ]);
            return { ...next, sketchMasterAnnotationAuditLog: audit };
          });
        }}
        sketchTasksPanel={
          <SubcategorySketchTasksRibbon
            currentLeaf={currentLeaf}
            dossier={dossier}
            articleSku={skuDraft}
            articleName={nameDraft}
            setDossier={setDossier}
            sketchContext={{
              audienceId: selectedAudienceId,
              audienceName: selectedAudienceLabel,
              isUnisex: dossier.isUnisex,
            }}
          />
        }
        onSavePinTemplateToDossier={saveMasterSketchPinTemplate}
        onSavePinTemplateToOrg={saveMasterSketchPinTemplateToOrg}
        visualCatalogAttributeIds={visualsCatalogAttributeIdsForSketch}
        visualCatalogSketchLinks={visualsCatalogSketchLinksForPins}
        onVisualCatalogSuggestFromSketch={onVisualCatalogSuggestFromSketch}
      />
    </>
  );
}
