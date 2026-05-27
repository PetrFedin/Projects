'use client';

import type { Dispatch, SetStateAction } from 'react';
import * as LucideIcons from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { Workshop2TechPackAttachmentsBlock } from '@/components/brand/production/Workshop2TechPackAttachmentsBlock';
import { Workshop2SampleBaseSizeBlock as SampleBaseSizeBlock } from '@/components/brand/production/Workshop2SampleBaseSizeBlock';
import { AttributeRowEditor } from '@/components/brand/production/workshop2-phase1-dossier-panel-attribute-row-editor';
import {
  getWorkshop2ConstructionTabMergedGroupIds,
  resolveEffectiveParametersForLeaf,
} from '@/lib/production/attribute-catalog';
import type { AttributeCatalogAttribute } from '@/lib/production/attribute-catalog.types';
import type { HandbookCategoryLeaf } from '@/lib/production/category-handbook-leaves';
import type { DossierSection } from '@/lib/production/dossier-readiness-engine';
import type {
  Workshop2DossierPhase1,
  Workshop2TzActionLogPayload,
} from '@/lib/production/workshop2-dossier-phase1.types';
import { cn } from '@/lib/utils';
import {
  MATERIAL_GUIDE_ATTR_IDS,
  WORKSHOP_GROUP_LABEL_AMBER,
  WORKSHOP_MERGED_OUTERWEAR_MATERIAL_TAB_LABEL,
  WORKSHOP_REQUIRED_BADGE_DONE_CLASS,
  WORKSHOP_REQUIRED_BADGE_TODO_CLASS,
} from '@/components/brand/production/workshop2-phase1-dossier-panel-ui-constants';
import {
  W2_VISUAL_QUAD_ATTR_IDS,
  w2TzAttributeDisplayName,
} from '@/components/brand/production/workshop2-phase1-dossier-panel-w2-tz-labels';
import { WorkshopAttributeHintIcon } from '@/components/brand/production/workshop2-phase1-dossier-panel-field-hints';
import { canonicalPhaseAssignmentFilled } from '@/components/brand/production/workshop2-phase1-dossier-panel-assignment-helpers';
import type { Workshop2AttrComment } from '@/components/brand/production/workshop2-phase1-dossier-panel-attr-comments-dialog';

/** Поля, общие для всех карточек атрибутов в панели досье (передаются из `useMemo` в родителе). */
export type Workshop2DossierAttributeCardContextProps = {
  activeSection: DossierSection;
  currentLeaf: HandbookCategoryLeaf;
  dossier: Workshop2DossierPhase1;
  setDossier: Dispatch<SetStateAction<Workshop2DossierPhase1>>;
  setDossierInternal: Dispatch<SetStateAction<Workshop2DossierPhase1>>;
  collectionId: string;
  articleId: string;
  techPackSessionBlobById: Record<string, string>;
  setTechPackSessionBlobById: Dispatch<SetStateAction<Record<string, string>>>;
  skuDraft: string;
  allowMultiHandbook: boolean;
  onSetHandbookParameters: (
    attributeId: string,
    parts: { parameterId: string; displayLabel: string }[]
  ) => void;
  onFreeTextSide: (attributeId: string, text: string) => void;
  patchColor: (u: {
    handbook?: { parameterId: string; displayLabel: string } | null;
    freeText?: string;
  }) => void;
  isPhase1: boolean;
  tzMinimalHideDeferCommentUi: boolean;
  tzWriteDisabled: boolean;
  deferredAttrIds: Set<string>;
  toggleDeferAttribute: (attributeId: string) => void;
  attrCommentsById: Record<string, Workshop2AttrComment[] | undefined>;
  openAttrComments: (attributeId: string) => void;
  sketchVisualCatalogHighlightSet: ReadonlySet<string>;
  attributeIdsLinkedOnSketch: ReadonlySet<string>;
  logTechPackZipLine: (line: string) => void;
  appendTzPulse: (action: Workshop2TzActionLogPayload) => void;
  updatedByLabel: string;
};

export type Workshop2DossierAttributeCardProps = Workshop2DossierAttributeCardContextProps & {
  attribute: AttributeCatalogAttribute;
  groupLabel: string | undefined;
  variant: 'base' | 'extra';
  frame?: 'card' | 'plain';
  workshopPhase?: '1' | '2' | '3';
  showAttributeNameHintIcon?: boolean;
  strictAttributeFillLabelColors?: boolean;
};

export function Workshop2DossierAttributeCard({
  attribute,
  groupLabel,
  variant,
  frame = 'card',
  workshopPhase,
  showAttributeNameHintIcon = false,
  strictAttributeFillLabelColors = false,
  activeSection,
  currentLeaf,
  dossier,
  setDossier,
  setDossierInternal,
  collectionId,
  articleId,
  techPackSessionBlobById,
  setTechPackSessionBlobById,
  skuDraft,
  allowMultiHandbook,
  onSetHandbookParameters,
  onFreeTextSide,
  patchColor,
  isPhase1,
  tzMinimalHideDeferCommentUi,
  tzWriteDisabled,
  deferredAttrIds,
  toggleDeferAttribute,
  attrCommentsById,
  openAttrComments,
  sketchVisualCatalogHighlightSet,
  attributeIdsLinkedOnSketch,
  logTechPackZipLine,
  appendTzPulse,
  updatedByLabel,
}: Workshop2DossierAttributeCardProps) {
  const effParams = resolveEffectiveParametersForLeaf(attribute, currentLeaf);
  const attrForEditor: AttributeCatalogAttribute = { ...attribute, parameters: effParams };
  const editor = (
    <AttributeRowEditor
      attribute={attrForEditor}
      dossier={dossier}
      allowMultiHandbook={allowMultiHandbook}
      onSetHandbookParameters={onSetHandbookParameters}
      onFreeTextSide={onFreeTextSide}
      patchColor={attribute.attributeId === 'color' ? patchColor : undefined}
    />
  );
  const suppressCatalogInlineDescriptions =
    (activeSection === 'general' && (groupLabel === 'Паспорт' || groupLabel === 'Доп. атрибуты')) ||
    (activeSection === 'material' &&
      currentLeaf.l2Name === 'Верхняя одежда' &&
      groupLabel === WORKSHOP_MERGED_OUTERWEAR_MATERIAL_TAB_LABEL) ||
    (activeSection === 'material' && MATERIAL_GUIDE_ATTR_IDS.has(attribute.attributeId)) ||
    (activeSection === 'construction' &&
      getWorkshop2ConstructionTabMergedGroupIds().has(attribute.groupId));

  const body =
    attribute.attributeId === 'techPackRef' ? (
      <div className="space-y-3">
        {activeSection === 'construction' ? null : (
          <Workshop2TechPackAttachmentsBlock
            collectionId={collectionId}
            articleId={articleId}
            sessionBlobById={techPackSessionBlobById}
            setSessionBlobById={setTechPackSessionBlobById}
            attachments={dossier.techPackAttachments ?? []}
            onChange={(next) =>
              setDossier((p: Workshop2DossierPhase1) => ({ ...p, techPackAttachments: next }))
            }
            onPatchAttachment={(id, patch) =>
              setDossier((p: Workshop2DossierPhase1) => ({
                ...p,
                techPackAttachments: (p.techPackAttachments ?? []).map((a) =>
                  a.attachmentId === id ? { ...a, ...patch } : a
                ),
              }))
            }
            onJournalLine={logTechPackZipLine}
            onPulseAction={appendTzPulse}
            sealActorLabel={updatedByLabel}
            zipFileNameStem={skuDraft}
          />
        )}
        {editor}
      </div>
    ) : attribute.attributeId === 'sampleBaseSize' ? (
      <SampleBaseSizeBlock
        attribute={attribute}
        currentLeaf={currentLeaf}
        dossier={dossier}
        setDossier={setDossier}
        setDossierInternal={setDossierInternal}
        tzWriteDisabled={tzWriteDisabled}
        onFreeTextSide={onFreeTextSide}
        fieldDeferralPhase1={isPhase1 && !tzMinimalHideDeferCommentUi}
        deferHandbookLater={deferredAttrIds.has('sampleBaseSize')}
        onToggleDeferHandbookLater={() => toggleDeferAttribute('sampleBaseSize')}
        handbookCommentsCount={attrCommentsById.sampleBaseSize?.length ?? 0}
        onOpenHandbookComments={() => openAttrComments('sampleBaseSize')}
      />
    ) : (
      editor
    );

  const showRequired =
    variant === 'base' &&
    ((workshopPhase === '1' && attribute.requiredForPhase1) ||
      (workshopPhase === '2' && attribute.requiredForPhase2));
  const assignment = dossier.assignments.find((a) => a.attributeId === attribute.attributeId);
  const isFilled = canonicalPhaseAssignmentFilled(assignment, attribute);
  const isMissingRequired = showRequired && !isFilled;

  const hideMaterialFlatGroupCrumb =
    activeSection === 'material' &&
    groupLabel &&
    (groupLabel === 'Доп. атрибуты' ||
      groupLabel === 'Материалы' ||
      groupLabel === WORKSHOP_MERGED_OUTERWEAR_MATERIAL_TAB_LABEL);

  const gl = (groupLabel ?? '').trim();
  const glNorm = gl.replace(/\s+/g, ' ').trim();
  /** `\b` в JS не работает с кириллицей — явно скрываем крошку «Конструкция». */
  const hideConstructionGroupCrumb =
    glNorm.length > 0 &&
    (glNorm.toLowerCase() === 'конструкция' || /^конструкция(\s|[·:]|\s*[-–])/i.test(glNorm));
  /** В паспорте не показываем крошку вида «Верхняя одежда · Пальто» — ветка уже задана выше. */
  const hidePassportCatalogPathCrumb =
    activeSection === 'general' && (glNorm.includes('·') || glNorm.includes('•'));
  const hideCatalogSectionSubtitle =
    !gl ||
    hideMaterialFlatGroupCrumb ||
    hideConstructionGroupCrumb ||
    hidePassportCatalogPathCrumb ||
    gl === 'Паспорт' ||
    gl === 'Доп. атрибуты' ||
    gl === 'Материалы' ||
    /материалы/i.test(glNorm);

  const header = (
    <div className="flex items-center justify-between gap-2">
      <div className="flex min-w-0 flex-1 flex-wrap items-baseline gap-x-2 gap-y-0">
        {showRequired ? (
          <span
            className={cn(
              isMissingRequired
                ? WORKSHOP_REQUIRED_BADGE_TODO_CLASS
                : WORKSHOP_REQUIRED_BADGE_DONE_CLASS
            )}
          >
            {isMissingRequired ? 'Заполните' : 'Обязательный'}
          </span>
        ) : null}
        {frame === 'card' && groupLabel && !hideCatalogSectionSubtitle ? (
          <span
            className={cn(
              'text-[10px] font-semibold',
              groupLabel && WORKSHOP_GROUP_LABEL_AMBER.has(groupLabel)
                ? 'text-orange-800'
                : variant === 'base'
                  ? 'text-text-muted font-bold'
                  : 'text-accent-primary font-bold'
            )}
          >
            {groupLabel}
          </span>
        ) : null}
        <span className="inline-flex min-w-0 flex-wrap items-center gap-1">
          {attribute.attributeId === 'sampleBaseSize' ? null : (
            <span
              className={cn(
                'text-sm font-semibold',
                activeSection === 'general' ||
                  activeSection === 'material' ||
                  activeSection === 'construction'
                  ? !isFilled
                    ? 'text-red-600'
                    : 'text-text-primary'
                  : strictAttributeFillLabelColors
                    ? isMissingRequired
                      ? 'text-red-600'
                      : 'text-text-primary'
                    : 'text-text-primary'
              )}
            >
              {w2TzAttributeDisplayName(attribute)}
            </span>
          )}
          {showAttributeNameHintIcon ? <WorkshopAttributeHintIcon attribute={attribute} /> : null}
          {attributeIdsLinkedOnSketch.has(attribute.attributeId) ? (
            <Tooltip>
              <TooltipTrigger asChild>
                <span
                  className="inline-flex rounded-full bg-teal-100 p-0.5 text-teal-700"
                  aria-label="Есть метка на скетче"
                >
                  <LucideIcons.MapPin className="h-3 w-3 shrink-0" />
                </span>
              </TooltipTrigger>
              <TooltipContent side="top" className="max-w-[240px] text-xs">
                К атрибуту привязана метка на общем скетче или скетч-листе
              </TooltipContent>
            </Tooltip>
          ) : null}
        </span>
      </div>
      {isPhase1 &&
      !tzMinimalHideDeferCommentUi &&
      frame === 'card' &&
      attribute.attributeId !== 'sampleBaseSize' &&
      (variant === 'base' ||
        (activeSection === 'construction' &&
          W2_VISUAL_QUAD_ATTR_IDS.has(attribute.attributeId))) ? (
        <div className="flex shrink-0 items-center gap-1 pl-1">
          <label
            className="text-text-muted hover:text-text-primary flex cursor-pointer items-center gap-1.5 whitespace-nowrap text-[10px] font-semibold"
            title="Отложенное заполнение сохраняется только в браузере (для команды бренда)"
          >
            <Checkbox
              checked={deferredAttrIds.has(attribute.attributeId)}
              onCheckedChange={() => toggleDeferAttribute(attribute.attributeId)}
              className="border-border-default h-3.5 w-3.5 shrink-0"
              aria-label={
                deferredAttrIds.has(attribute.attributeId)
                  ? 'Снять отложенное заполнение'
                  : 'Заполнить позже (только для бренда)'
              }
            />
            <span className="hidden sm:inline">Позже (лок.)</span>
          </label>
          <button
            type="button"
            className="text-text-muted hover:text-text-primary flex h-8 items-center px-1.5 text-[10px] font-semibold"
            onClick={() => openAttrComments(attribute.attributeId)}
          >
            Комментарий
            {(attrCommentsById[attribute.attributeId]?.length ?? 0) > 0 ? (
              <span className="ml-1 inline-flex min-w-4 items-center justify-center rounded-full bg-amber-100 px-1 text-[9px] font-bold text-amber-700">
                {attrCommentsById[attribute.attributeId]!.length}
              </span>
            ) : null}
          </button>
        </div>
      ) : null}
    </div>
  );

  if (frame === 'plain') {
    return (
      <div key={attribute.attributeId} className="space-y-2">
        {header}
        {body}
      </div>
    );
  }

  const passportWideMeasurements =
    activeSection === 'general' &&
    (attribute.attributeId === 'sampleBaseSize' || attribute.attributeId === 'techPackRef');

  return (
    <li
      id={`w2-attr-${attribute.attributeId}`}
      className={cn(
        'scroll-mt-24 space-y-2 rounded-lg border p-3 transition-all',
        passportWideMeasurements && 'col-span-full',
        variant === 'base'
          ? isMissingRequired
            ? activeSection === 'material'
              ? 'border-amber-300/80 bg-amber-50/30'
              : 'border border-red-500/90 bg-red-50/20'
            : 'border-border-subtle bg-bg-surface2/40'
          : 'border-accent-primary/20 bg-accent-primary/10',
        (activeSection === 'general' || activeSection === 'construction') &&
          sketchVisualCatalogHighlightSet.has(attribute.attributeId) &&
          'ring-accent-primary/90 ring-2 ring-offset-2 ring-offset-white'
      )}
    >
      {header}
      {attribute.uiInformationHint &&
      !showAttributeNameHintIcon &&
      !suppressCatalogInlineDescriptions ? (
        <p className="border-border-subtle bg-bg-surface2/80 text-text-secondary rounded-md border px-2 py-1.5 text-[10px] leading-snug">
          {attribute.uiInformationHint}
        </p>
      ) : null}
      {body}
    </li>
  );
}
