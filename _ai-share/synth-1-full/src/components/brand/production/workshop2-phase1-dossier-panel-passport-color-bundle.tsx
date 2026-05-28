'use client';

import { useMemo } from 'react';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import {
  resolveEffectiveParametersForLeaf,
  type ResolvedPhase1AttributeRow,
} from '@/lib/production/attribute-catalog';
import type { AttributeCatalogAttribute } from '@/lib/production/attribute-catalog.types';
import type { HandbookCategoryLeaf } from '@/lib/production/category-handbook-leaves';
import type { Workshop2DossierPhase1 } from '@/lib/production/workshop2-dossier-phase1.types';
import type { Workshop2AttrComment } from '@/components/brand/production/workshop2-phase1-dossier-panel-attr-comments-dialog';
import { cn } from '@/lib/utils';
import { collectColorBundlePaletteNeedles } from '@/components/brand/production/workshop2-phase1-dossier-panel-color-mat-helpers';
import { canonicalPhaseAssignmentFilled } from '@/components/brand/production/workshop2-phase1-dossier-panel-assignment-helpers';
import { passportManualFieldLabelClass } from '@/components/brand/production/workshop2-phase1-dossier-panel-signoff-format';
import {
  WORKSHOP_FIELD_LABEL_CLASS,
  WORKSHOP_REQUIRED_BADGE_DONE_CLASS,
  WORKSHOP_REQUIRED_BADGE_TODO_CLASS,
} from '@/components/brand/production/workshop2-phase1-dossier-panel-ui-constants';
import { w2TzAttributeDisplayName } from '@/components/brand/production/workshop2-phase1-dossier-panel-w2-tz-labels';
import { WorkshopAttributeHintIcon } from '@/components/brand/production/workshop2-phase1-dossier-panel-field-hints';
import {
  AttributeRowEditor,
  ColorAttributeRow,
} from '@/components/brand/production/workshop2-phase1-dossier-panel-attribute-row-editor';

export function WorkshopPassportColorBundle({
  bundleRows,
  dossier,
  currentLeaf,
  phase,
  allowMultiHandbook,
  patchColor,
  showAttributeHintIcons = false,
  fieldDeferralPhase1,
  deferredAttrIds,
  onToggleFieldDeferral,
  attrCommentsById,
  onOpenAttrComments,
  onSetHandbookParameters,
  onFreeTextSide,
}: {
  bundleRows: ResolvedPhase1AttributeRow[];
  dossier: Workshop2DossierPhase1;
  currentLeaf: HandbookCategoryLeaf;
  phase: '1' | '2' | '3';
  allowMultiHandbook: boolean;
  patchColor: (u: {
    handbook?: { parameterId: string; displayLabel: string } | null;
    freeText?: string;
  }) => void;
  onSetHandbookParameters: (
    attributeId: string,
    parts: { parameterId: string; displayLabel: string }[]
  ) => void;
  onFreeTextSide: (attributeId: string, text: string) => void;
  showAttributeHintIcons?: boolean;
  fieldDeferralPhase1: boolean;
  deferredAttrIds: ReadonlySet<string>;
  onToggleFieldDeferral: (attributeId: string) => void;
  attrCommentsById: Record<string, Workshop2AttrComment[] | undefined>;
  onOpenAttrComments: (attributeId: string) => void;
}) {
  const primary = bundleRows.find((r) => r.attribute.attributeId === 'primaryColorFamilyOptions');
  const refRow = bundleRows.find((r) => r.attribute.attributeId === 'colorReferenceSystemOptions');
  const colorRow = bundleRows.find((r) => r.attribute.attributeId === 'color');

  const attrRequired = (attr: AttributeCatalogAttribute) =>
    (phase === '1' && attr.requiredForPhase1) || (phase === '2' && attr.requiredForPhase2);

  const isMissingRequired = (attr: AttributeCatalogAttribute | undefined) => {
    if (!attr || !attrRequired(attr)) return false;
    const assignment = dossier.assignments.find((a) => a.attributeId === attr.attributeId);
    return !canonicalPhaseAssignmentFilled(assignment, attr);
  };
  const colorBundleLabelClass = (attr: AttributeCatalogAttribute) => {
    const assignment = dossier.assignments.find((a) => a.attributeId === attr.attributeId);
    return passportManualFieldLabelClass(canonicalPhaseAssignmentFilled(assignment, attr));
  };

  let anyShowReq = false;
  let anyMissing = false;
  for (const r of bundleRows) {
    if (attrRequired(r.attribute)) {
      anyShowReq = true;
      if (isMissingRequired(r.attribute)) anyMissing = true;
    }
  }

  const paletteCrossNeedles = useMemo(
    () => collectColorBundlePaletteNeedles(dossier),
    [dossier.assignments]
  );

  return (
    <li
      id="w2-passport-color-bundle"
      className={cn(
        'scroll-mt-24 space-y-3 transition-all',
        anyShowReq && anyMissing && 'ring-2 ring-amber-200/90 ring-offset-1 ring-offset-white'
      )}
    >
      {anyShowReq ? (
        <div className="flex flex-wrap items-baseline gap-x-2 gap-y-0">
          <span
            className={cn(
              anyMissing ? WORKSHOP_REQUIRED_BADGE_TODO_CLASS : WORKSHOP_REQUIRED_BADGE_DONE_CLASS,
              anyMissing && 'animate-pulse'
            )}
          >
            {anyMissing ? 'Заполните' : 'Обязательный'}
          </span>
        </div>
      ) : null}
      <div className="space-y-4">
        {primary || refRow ? (
          <div
            className={cn('grid gap-3', primary && refRow ? 'md:grid-cols-2 md:items-start' : '')}
          >
            {primary ? (
              <div className="bg-bg-surface2/40 space-y-2 rounded-md p-3">
                <div className="flex flex-wrap items-center justify-between gap-x-2 gap-y-1">
                  <div className="flex min-w-0 flex-1 flex-wrap items-center gap-1">
                    <Label
                      className={cn(
                        WORKSHOP_FIELD_LABEL_CLASS,
                        colorBundleLabelClass(primary.attribute)
                      )}
                    >
                      {w2TzAttributeDisplayName(primary.attribute)}
                    </Label>
                    {showAttributeHintIcons ? (
                      <WorkshopAttributeHintIcon attribute={primary.attribute} />
                    ) : null}
                  </div>
                  {fieldDeferralPhase1 ? (
                    <div className="flex shrink-0 items-center gap-1.5 pl-1">
                      <label
                        className="text-text-muted hover:text-text-primary flex cursor-pointer items-center gap-1.5 whitespace-nowrap text-[10px] font-semibold leading-none"
                        title="Отложенное заполнение сохраняется только в браузере (для команды бренда)"
                      >
                        <Checkbox
                          checked={deferredAttrIds.has(primary.attribute.attributeId)}
                          onCheckedChange={() =>
                            onToggleFieldDeferral(primary.attribute.attributeId)
                          }
                          className="border-border-default h-3.5 w-3.5 shrink-0"
                          aria-label={
                            deferredAttrIds.has(primary.attribute.attributeId)
                              ? 'Снять отложенное заполнение'
                              : 'Заполнить позже (только для бренда)'
                          }
                        />
                        <span className="hidden sm:inline">Позже (лок.)</span>
                      </label>
                      <button
                        type="button"
                        className="text-text-muted hover:text-text-primary flex h-8 items-center px-1.5 text-[10px] font-semibold leading-none"
                        onClick={() => onOpenAttrComments(primary.attribute.attributeId)}
                      >
                        Комментарий
                        {(attrCommentsById[primary.attribute.attributeId]?.length ?? 0) > 0 ? (
                          <span className="ml-1 inline-flex min-w-4 items-center justify-center rounded-full bg-amber-100 px-1 text-[9px] font-bold text-amber-700">
                            {attrCommentsById[primary.attribute.attributeId]!.length}
                          </span>
                        ) : null}
                      </button>
                    </div>
                  ) : null}
                </div>
                <AttributeRowEditor
                  attribute={{
                    ...primary.attribute,
                    parameters: resolveEffectiveParametersForLeaf(primary.attribute, currentLeaf),
                  }}
                  dossier={dossier}
                  allowMultiHandbook={allowMultiHandbook}
                  onSetHandbookParameters={onSetHandbookParameters}
                  onFreeTextSide={onFreeTextSide}
                />
              </div>
            ) : null}
            {refRow ? (
              <div className="bg-bg-surface2/40 space-y-2 rounded-md p-3">
                <div className="flex flex-wrap items-center justify-between gap-x-2 gap-y-1">
                  <div className="flex min-w-0 flex-1 flex-wrap items-center gap-1">
                    <Label
                      className={cn(
                        WORKSHOP_FIELD_LABEL_CLASS,
                        colorBundleLabelClass(refRow.attribute)
                      )}
                    >
                      {w2TzAttributeDisplayName(refRow.attribute)}
                    </Label>
                    {showAttributeHintIcons ? (
                      <WorkshopAttributeHintIcon attribute={refRow.attribute} />
                    ) : null}
                  </div>
                  {fieldDeferralPhase1 ? (
                    <div className="flex shrink-0 items-center gap-1.5 pl-1">
                      <label
                        className="text-text-muted hover:text-text-primary flex cursor-pointer items-center gap-1.5 whitespace-nowrap text-[10px] font-semibold leading-none"
                        title="Отложенное заполнение сохраняется только в браузере (для команды бренда)"
                      >
                        <Checkbox
                          checked={deferredAttrIds.has(refRow.attribute.attributeId)}
                          onCheckedChange={() =>
                            onToggleFieldDeferral(refRow.attribute.attributeId)
                          }
                          className="border-border-default h-3.5 w-3.5 shrink-0"
                          aria-label={
                            deferredAttrIds.has(refRow.attribute.attributeId)
                              ? 'Снять отложенное заполнение'
                              : 'Заполнить позже (только для бренда)'
                          }
                        />
                        <span className="hidden sm:inline">Позже (лок.)</span>
                      </label>
                      <button
                        type="button"
                        className="text-text-muted hover:text-text-primary flex h-8 items-center px-1.5 text-[10px] font-semibold leading-none"
                        onClick={() => onOpenAttrComments(refRow.attribute.attributeId)}
                      >
                        Комментарий
                        {(attrCommentsById[refRow.attribute.attributeId]?.length ?? 0) > 0 ? (
                          <span className="ml-1 inline-flex min-w-4 items-center justify-center rounded-full bg-amber-100 px-1 text-[9px] font-bold text-amber-700">
                            {attrCommentsById[refRow.attribute.attributeId]!.length}
                          </span>
                        ) : null}
                      </button>
                    </div>
                  ) : null}
                </div>
                <AttributeRowEditor
                  attribute={{
                    ...refRow.attribute,
                    parameters: resolveEffectiveParametersForLeaf(refRow.attribute, currentLeaf),
                  }}
                  dossier={dossier}
                  allowMultiHandbook={allowMultiHandbook}
                  onSetHandbookParameters={onSetHandbookParameters}
                  onFreeTextSide={onFreeTextSide}
                />
              </div>
            ) : null}
          </div>
        ) : null}
        {colorRow ? (
          <div className="space-y-2 pt-2">
            {showAttributeHintIcons ? (
              <div className="flex items-center gap-1">
                <span className={cn(WORKSHOP_FIELD_LABEL_CLASS, 'text-text-primary')}>
                  {w2TzAttributeDisplayName(colorRow.attribute)}
                </span>
                <WorkshopAttributeHintIcon attribute={colorRow.attribute} />
              </div>
            ) : null}
            <ColorAttributeRow
              attribute={{
                ...colorRow.attribute,
                parameters: resolveEffectiveParametersForLeaf(colorRow.attribute, currentLeaf),
              }}
              dossier={dossier}
              patchColor={patchColor}
              paletteCrossNeedles={paletteCrossNeedles}
            />
          </div>
        ) : null}
      </div>
    </li>
  );
}
