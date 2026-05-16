'use client';

import { Fragment, type ReactNode } from 'react';
import * as LucideIcons from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  getWorkshop2ConstructionTabMergedGroupIds,
  workshop2ConstructionMergedStackTitle,
  type ResolvedPhase1AttributeRow,
} from '@/lib/production/attribute-catalog';
import type { AttributeCatalogAttribute } from '@/lib/production/attribute-catalog.types';
import type { HandbookCategoryLeaf } from '@/lib/production/category-handbook-leaves';
import type { Workshop2DossierPhase1 } from '@/lib/production/workshop2-dossier-phase1.types';
import type { DossierSection } from '@/lib/production/dossier-readiness-engine';
import { cn } from '@/lib/utils';
import {
  WORKSHOP_FLAT_CATALOG_SINGLE_GROUP_KEY,
  WORKSHOP_MERGED_OUTERWEAR_MATERIAL_TAB_LABEL,
  WORKSHOP_MERGE_OUTERWEAR_MATERIAL_TAB_GROUP_IDS,
  WORKSHOP_MERGE_OUTERWEAR_MATERIAL_TAB_LABELS,
} from '@/components/brand/production/workshop2-phase1-dossier-panel-ui-constants';
import { workshopGroupSectionTitle } from '@/components/brand/production/workshop2-phase1-dossier-panel-signoff-format';
import {
  w2ConstructionOmitTechPackForAside,
  w2ConstructionRowsDrapeThenPattern,
} from '@/components/brand/production/workshop2-phase1-dossier-panel-construction-layout';
import { WorkshopPassportColorBundle } from '@/components/brand/production/workshop2-phase1-dossier-panel-passport-color-bundle';
import {
  Workshop2DossierAttributeCard,
  type Workshop2DossierAttributeCardContextProps,
} from '@/components/brand/production/workshop2-phase1-dossier-panel-attribute-card';
import {
  PASSPORT_COLOR_BUNDLE_IDS,
  PASSPORT_COLOR_BUNDLE_ORDER,
} from '@/components/brand/production/workshop2-phase1-dossier-panel-dossier-constants';
import type { Workshop2AttrComment } from '@/components/brand/production/workshop2-phase1-dossier-panel-attr-comments-dialog';

export type Workshop2DossierSectionRowsOpts = {
  showAttributeNameHintIcons?: boolean;
  materialCatalogAnchorAfterMat?: string | null;
  flatCatalogGroups?: boolean;
  fieldLayout?: 'stack' | 'grid2';
  strictAttributeFillLabelColors?: boolean;
};

export type Workshop2DossierSectionRowsExtra = {
  attribute: AttributeCatalogAttribute;
  groupLabel: string;
};

export type Workshop2DossierSectionRowsProps = {
  rows: ResolvedPhase1AttributeRow[];
  phase: '1' | '2' | '3';
  extras?: Workshop2DossierSectionRowsExtra[];
  opts?: Workshop2DossierSectionRowsOpts;
  activeSection: DossierSection;
  currentLeaf: HandbookCategoryLeaf;
  tzMinimalModeBySection: Record<
    'general' | 'visuals' | 'material' | 'construction',
    boolean
  >;
  collapsedAttrGroups: ReadonlySet<string>;
  pinnedAttrGroups: ReadonlySet<string>;
  toggleAttrGroupPinned: (groupName: string) => void;
  toggleAttrGroupCollapsed: (groupName: string) => void;
  deferGroupSetAll: (ids: readonly string[], nextChecked: boolean) => void;
  isPhase1: boolean;
  dossier: Workshop2DossierPhase1;
  dossierAttrCardCtx: Workshop2DossierAttributeCardContextProps;
  allowMultiHandbook: boolean;
  patchColor: (u: {
    handbook?: { parameterId: string; displayLabel: string } | null;
    freeText?: string;
  }) => void;
  deferredAttrIds: ReadonlySet<string>;
  toggleDeferAttribute: (attributeId: string) => void;
  attrCommentsById: Record<string, Workshop2AttrComment[] | undefined>;
  openAttrComments: (attributeId: string) => void;
  onSetHandbookParametersWithColorBundleSync: (
    id: string,
    parts: { parameterId: string; displayLabel: string }[]
  ) => void;
  onSetHandbookParameters: (
    attributeId: string,
    parts: { parameterId: string; displayLabel: string }[]
  ) => void;
  onFreeTextSide: (attributeId: string, text: string) => void;
  renderPhaseRow: (
    row: ResolvedPhase1AttributeRow,
    phase: '1' | '2' | '3',
    showAttributeNameHintIcon?: boolean,
    strictAttributeFillLabelColors?: boolean
  ) => ReactNode;
};

/** Пропсы `Workshop2DossierSectionRows` без строк фазы / `rows` — для `{...spread}` из родителя. */
export type Workshop2DossierSectionRowsSharedBundle = Omit<
  Workshop2DossierSectionRowsProps,
  'rows' | 'phase' | 'extras' | 'opts'
>;

export function Workshop2DossierSectionRows({
  rows,
  phase,
  extras = [],
  opts,
  activeSection,
  currentLeaf,
  tzMinimalModeBySection,
  collapsedAttrGroups,
  pinnedAttrGroups,
  toggleAttrGroupPinned,
  toggleAttrGroupCollapsed,
  deferGroupSetAll,
  isPhase1,
  dossier,
  dossierAttrCardCtx,
  allowMultiHandbook,
  patchColor,
  deferredAttrIds,
  toggleDeferAttribute,
  attrCommentsById,
  openAttrComments,
  onSetHandbookParametersWithColorBundleSync,
  onSetHandbookParameters,
  onFreeTextSide,
  renderPhaseRow,
}: Workshop2DossierSectionRowsProps) {
  const minimalSection =
    activeSection === 'general' ||
    activeSection === 'visuals' ||
    activeSection === 'material' ||
    activeSection === 'construction'
      ? activeSection
      : null;
  const minimalModeEnabled =
    phase !== '3' && minimalSection !== null && tzMinimalModeBySection[minimalSection];
  const isRequiredForPhase = (attribute: AttributeCatalogAttribute) =>
    (phase === '1' && attribute.requiredForPhase1) ||
    (phase === '2' && attribute.requiredForPhase2);
  const effectiveRows = minimalModeEnabled
    ? rows.filter((r) => isRequiredForPhase(r.attribute))
    : rows;
  const effectiveExtras = minimalModeEnabled
    ? extras.filter((e) => isRequiredForPhase(e.attribute))
    : extras;

  if (effectiveRows.length === 0 && effectiveExtras.length === 0) {
    return <p className="text-text-secondary text-sm">Для этого раздела пока нет атрибутов.</p>;
  }

  const showAttrHintIcons = opts?.showAttributeNameHintIcons === true;
  const flatCatalogGroups = opts?.flatCatalogGroups === true;
  const fieldLayout = opts?.fieldLayout ?? 'stack';
  const strictAttrFillLabels = opts?.strictAttributeFillLabelColors === true;
  const rowListClass =
    fieldLayout === 'grid2'
      ? activeSection === 'material'
        ? 'grid grid-cols-2 gap-2 *:min-w-0 max-sm:grid-cols-1'
        : 'grid gap-2 sm:grid-cols-2 *:min-w-0'
      : 'space-y-2';

  const mergeOuterwearMaterialTab =
    activeSection === 'material' && currentLeaf?.l2Name === 'Верхняя одежда';
  const mergeConstructionCategoryStack = activeSection === 'construction';
  const mergedConstructionStackLabel = mergeConstructionCategoryStack
    ? workshop2ConstructionMergedStackTitle(currentLeaf)
    : '';
  const constructionMergedGroupIds = mergeConstructionCategoryStack
    ? getWorkshop2ConstructionTabMergedGroupIds()
    : null;

  const catalogGroupKeyForRow = (row: ResolvedPhase1AttributeRow): string => {
    if (flatCatalogGroups) return WORKSHOP_FLAT_CATALOG_SINGLE_GROUP_KEY;
    const fallback = row.group?.label || 'Разное';
    const gid = row.attribute.groupId;
    if (mergeOuterwearMaterialTab && WORKSHOP_MERGE_OUTERWEAR_MATERIAL_TAB_GROUP_IDS.has(gid)) {
      return WORKSHOP_MERGED_OUTERWEAR_MATERIAL_TAB_LABEL;
    }
    if (mergeConstructionCategoryStack && constructionMergedGroupIds?.has(gid)) {
      return mergedConstructionStackLabel;
    }
    return fallback;
  };

  const catalogGroupKeyForExtra = (ex: Workshop2DossierSectionRowsExtra): string => {
    if (flatCatalogGroups) return WORKSHOP_FLAT_CATALOG_SINGLE_GROUP_KEY;
    const base = ex.groupLabel || 'Доп. атрибуты';
    const gid = ex.attribute.groupId;
    if (mergeOuterwearMaterialTab && WORKSHOP_MERGE_OUTERWEAR_MATERIAL_TAB_LABELS.has(base)) {
      return WORKSHOP_MERGED_OUTERWEAR_MATERIAL_TAB_LABEL;
    }
    if (mergeConstructionCategoryStack && constructionMergedGroupIds?.has(gid)) {
      return mergedConstructionStackLabel;
    }
    return base;
  };

  const groupedBase: Record<string, ResolvedPhase1AttributeRow[]> = {};
  for (const row of effectiveRows) {
    const g = catalogGroupKeyForRow(row);
    if (!groupedBase[g]) groupedBase[g] = [];
    groupedBase[g].push(row);
  }

  const groupedExtras: Record<string, Workshop2DossierSectionRowsExtra[]> = {};
  for (const ex of effectiveExtras) {
    const g = catalogGroupKeyForExtra(ex);
    if (!groupedExtras[g]) groupedExtras[g] = [];
    groupedExtras[g].push(ex);
  }

  const allGroupNames = Array.from(
    new Set([...Object.keys(groupedBase), ...Object.keys(groupedExtras)])
  );

  return (
    <div className="space-y-3">
      {allGroupNames.map((groupName) => {
        const collapseKey = `${activeSection}::${groupName}`;
        const isCollapsed = collapsedAttrGroups.has(collapseKey);
        const isPinned = pinnedAttrGroups.has(collapseKey);
        /** В карточках паспорта — без полосок-разделителей по подгруппам каталога (в т.ч. «… · …»). */
        const hidePassportCatalogGroupHeader =
          activeSection === 'general' &&
          (groupName === 'Паспорт' ||
            groupName === 'Свойства' ||
            groupName.includes('·') ||
            groupName.includes('•'));
        /** В «Материалы» без подсекций «Доп. атрибуты» / «Верхняя одежда · материалы» — один общий блок сверху. */
        const hideMaterialSubsectionStripe =
          activeSection === 'material' &&
          (groupName === WORKSHOP_MERGED_OUTERWEAR_MATERIAL_TAB_LABEL ||
            groupName === 'Доп. атрибуты' ||
            groupName === 'Паспорт');
        /** В «Конструкция» — без полоски группы («… · …»), без «Все позже» / «Снять все» / pin / свёрнуть. */
        const hideConstructionCatalogGroupHeader = activeSection === 'construction';
        const showGroupHeader =
          !hidePassportCatalogGroupHeader &&
          !flatCatalogGroups &&
          !hideMaterialSubsectionStripe &&
          !hideConstructionCatalogGroupHeader;
        const contentCollapsed = flatCatalogGroups
          ? false
          : hidePassportCatalogGroupHeader || hideConstructionCatalogGroupHeader
            ? false
            : isCollapsed;
        const inGroup = groupedBase[groupName] ?? [];
        return (
          <div key={groupName} className="space-y-1.5">
            {showGroupHeader ? (
              <div className="flex items-center gap-2 px-1">
                <h3 className="text-text-muted flex min-w-0 flex-1 items-center gap-2 text-[10px] font-semibold">
                  <span className="bg-bg-surface2 h-px min-w-[1rem] flex-1" />
                  <span className="shrink-0">{workshopGroupSectionTitle(groupName)}</span>
                  <span className="bg-bg-surface2 h-px min-w-[1rem] flex-1" />
                </h3>
                <div className="flex shrink-0 flex-wrap items-center justify-end gap-1">
                  {/* Buttons 'Все позже', 'Снять все', 'Закрепить', 'Свернуть' were removed per user request to simplify TZ */}
                </div>
              </div>
            ) : null}
            {contentCollapsed ? null : (
              <ul className={rowListClass}>
                {(() => {
                  const bundleOrdered = PASSPORT_COLOR_BUNDLE_ORDER.map((id) =>
                    inGroup.find((r) => r.attribute.attributeId === id)
                  ).filter((r): r is ResolvedPhase1AttributeRow => Boolean(r));
                  const hasColorBundle =
                    activeSection === 'general' &&
                    flatCatalogGroups &&
                    groupName === WORKSHOP_FLAT_CATALOG_SINGLE_GROUP_KEY &&
                    bundleOrdered.length > 0;
                  let restBase: ResolvedPhase1AttributeRow[] = hasColorBundle
                    ? inGroup.filter((r) => !PASSPORT_COLOR_BUNDLE_IDS.has(r.attribute.attributeId))
                    : [...inGroup];
                  if (activeSection === 'construction') {
                    restBase = w2ConstructionOmitTechPackForAside(
                      w2ConstructionRowsDrapeThenPattern(restBase)
                    );
                  }
                  return (
                    <>
                      {hasColorBundle ? (
                        <WorkshopPassportColorBundle
                          bundleRows={bundleOrdered}
                          dossier={dossier}
                          currentLeaf={currentLeaf}
                          phase={phase}
                          allowMultiHandbook={allowMultiHandbook}
                          patchColor={patchColor}
                          showAttributeHintIcons={showAttrHintIcons}
                          fieldDeferralPhase1={isPhase1 && !minimalModeEnabled}
                          deferredAttrIds={deferredAttrIds}
                          onToggleFieldDeferral={toggleDeferAttribute}
                          attrCommentsById={attrCommentsById}
                          onOpenAttrComments={openAttrComments}
                          onSetHandbookParameters={(id, parts) =>
                            id === 'primaryColorFamilyOptions' ||
                            id === 'colorReferenceSystemOptions'
                              ? onSetHandbookParametersWithColorBundleSync(id, parts)
                              : onSetHandbookParameters(id, parts)
                          }
                          onFreeTextSide={onFreeTextSide}
                        />
                      ) : null}
                      {restBase.map((row) => (
                        <Fragment key={row.attribute.attributeId}>
                          {renderPhaseRow(row, phase, showAttrHintIcons, strictAttrFillLabels)}
                          {opts?.materialCatalogAnchorAfterMat &&
                          row.attribute.attributeId === 'mat' ? (
                            <li
                              key={`${row.attribute.attributeId}-catalog-nav`}
                              id={opts.materialCatalogAnchorAfterMat}
                              className="col-span-full !m-0 !mb-0 !mt-0 !h-0 !min-h-0 scroll-mt-24 list-none overflow-hidden border-0 !p-0"
                              aria-hidden
                            />
                          ) : null}
                        </Fragment>
                      ))}
                    </>
                  );
                })()}
                {groupedExtras[groupName]?.map(({ attribute, groupLabel }) => (
                  <Workshop2DossierAttributeCard
                    key={attribute.attributeId}
                    {...dossierAttrCardCtx}
                    attribute={attribute}
                    groupLabel={groupLabel}
                    variant="extra"
                    frame="card"
                    workshopPhase={phase}
                    showAttributeNameHintIcon={showAttrHintIcons}
                    strictAttributeFillLabelColors={strictAttrFillLabels}
                  />
                ))}
              </ul>
            )}
          </div>
        );
      })}
    </div>
  );
}
