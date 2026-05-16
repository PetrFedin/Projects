'use client';

import type { ChangeEvent } from 'react';
import { ArrowRight, Wand2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  ORPHAN_LINKED_TASK_LABEL,
  PRIORITY_LABELS,
  STAGE_LABELS,
  STATUS_LABELS,
  TYPE_LABELS,
} from '@/components/brand/production/category-sketch-annotator-label-maps';
import {
  collectCategorySketchPinValidationIssues,
  normalizeAnnotation,
} from '@/components/brand/production/category-sketch-annotator-annotation-helpers';
import { SketchPinThreadPanel } from '@/components/brand/production/SketchPinThreadPanel';
import { isSketchDimensionLineAnnotation } from '@/lib/production/sketch-dimension-line';
import {
  addAnnotationIdToSlotLinkedIds,
  appendMasterPinLineToSlotWhatToDo,
  createAnnotationTaskLine,
} from '@/lib/production/workshop2-tz-subcategory-sketches';
import {
  mergeSuggestedTzAttributeIdsForSketchType,
  recommendedTzSectionForSketchType,
  sketchTypeTzMatrixHint,
  type VisualCatalogSketchLinkRow,
} from '@/lib/production/workshop2-sketch-tz-matrix';
import {
  labelForStoredTzPanelSection,
  normalizeLinkedTzPanelSectionForNav,
  ROUTE_STAGE_NAV_OPTIONS,
  TZ_PANEL_SECTION_LABELS,
} from '@/lib/production/workshop2-visual-excellence';
import { classifyBomLineRef } from '@/lib/production/sketch-bom-integrity';
import { defectBreadcrumbChain } from '@/lib/production/sketch-mes-catalog';
import { isValidMesShiftId, MES_SHIFT_PRESETS } from '@/lib/production/sketch-mes-shift-utils';
import type {
  Workshop2MesDefectCodeRow,
  Workshop2Phase1CategorySketchAnnotation,
  Workshop2Phase1SubcategorySketchSlot,
  Workshop2SketchAnnotationAuditEntry,
  Workshop2SketchAnnotationPriority,
  Workshop2SketchAnnotationStage,
  Workshop2SketchAnnotationStatus,
  Workshop2SketchAnnotationType,
  Workshop2TzPanelSectionId,
  Workshop2TzSignoffStageId,
} from '@/lib/production/workshop2-dossier-phase1.types';
import type {
  CategorySketchAnnotatorPatch,
  CategorySketchAnnotatorSheetStorage,
} from '@/components/brand/production/category-sketch-annotator-types';

export type CategorySketchAnnotatorEditorActivePinFormProps = {
  activeAnn: Workshop2Phase1CategorySketchAnnotation;
  activeAnnIdx: number;
  readOnly: boolean;
  updateAnnotation: (
    id: string,
    patch:
      | Partial<Workshop2Phase1CategorySketchAnnotation>
      | ((
          current: Workshop2Phase1CategorySketchAnnotation
        ) => Partial<Workshop2Phase1CategorySketchAnnotation>)
  ) => void;
  removeAnn: (id: string) => void;
  onPickProofPhoto: (annotationId: string, e: ChangeEvent<HTMLInputElement>) => void;
  attributeOptions: { id: string; label: string }[];
  taskSlotLabelOptions: { slotId: string; label: string }[];
  taskSlotLabelById: Record<string, string>;
  subcategorySketchSlots: Workshop2Phase1SubcategorySketchSlot[];
  onPatch: (patch: CategorySketchAnnotatorPatch) => void;
  setEditorOpen: (open: boolean) => void;
  onJumpToDossierSection?: (section: Workshop2TzPanelSectionId) => void;
  onNavigateRouteStage?: (stageId: Workshop2TzSignoffStageId) => void;
  visualCatalogSketchLinks?: readonly VisualCatalogSketchLinkRow[];
  bomLinePickOptions: readonly { value: string; label: string }[];
  baselineBomRefs: Set<string> | undefined;
  liveBomRefs: Set<string>;
  sheetStorage: CategorySketchAnnotatorSheetStorage | null | undefined;
  mesDefectCatalogMerged: Workshop2MesDefectCodeRow[];
  auditActor?: string;
  articleSku?: string;
  pathLabel: string;
  sketchPageUrl?: string;
  activePinAuditTrail: Workshop2SketchAnnotationAuditEntry[];
};

export function CategorySketchAnnotatorEditorActivePinForm({
  activeAnn,
  activeAnnIdx,
  readOnly,
  updateAnnotation,
  removeAnn,
  onPickProofPhoto,
  attributeOptions,
  taskSlotLabelOptions,
  taskSlotLabelById,
  subcategorySketchSlots,
  onPatch,
  setEditorOpen,
  onJumpToDossierSection,
  onNavigateRouteStage,
  visualCatalogSketchLinks,
  bomLinePickOptions,
  baselineBomRefs,
  liveBomRefs,
  sheetStorage,
  mesDefectCatalogMerged,
  auditActor,
  articleSku,
  pathLabel,
  sketchPageUrl,
  activePinAuditTrail,
}: CategorySketchAnnotatorEditorActivePinFormProps) {
  return (
            <div className="space-y-2 rounded-lg border border-zinc-200 bg-white p-2.5">
              <div className="flex items-center justify-between gap-2 border-b border-zinc-100 pb-1.5">
                <span className="font-mono text-xl font-bold tabular-nums tracking-tight text-zinc-900">
                  #{activeAnnIdx + 1}
                </span>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="h-7 text-xs text-red-600"
                  disabled={readOnly}
                  onClick={() => removeAnn(activeAnn.annotationId)}
                >
                  Удалить
                </Button>
              </div>
              {collectCategorySketchPinValidationIssues(activeAnn).length > 0 ? (
                <div className="rounded border border-amber-200 bg-amber-50 px-2 py-1 text-[10px] text-amber-950">
                  Довести до готовности:{' '}
                  {collectCategorySketchPinValidationIssues(activeAnn).join(', ')}.
                </div>
              ) : (
                <div className="rounded border border-emerald-200 bg-emerald-50 px-2 py-1 text-[10px] text-emerald-900">
                  Метка заполнена.
                </div>
              )}

              {isSketchDimensionLineAnnotation(activeAnn) ? (
                <div className="space-y-2 rounded-md border border-teal-200 bg-teal-50/50 p-2">
                  <p className="text-[10px] font-semibold text-teal-950">Линейный размер на изделии</p>
              <label className="block space-y-1">
                    <span className="text-[9px] font-semibold uppercase text-zinc-500">
                      Подпись — что измеряем
                    </span>
                    <Input
                      className="h-8 text-sm"
                      placeholder="Например: длина рукава, пояс, манжет, длина по спинке"
                      value={activeAnn.dimensionLabel ?? ''}
                      disabled={readOnly}
                      onChange={(e) =>
                        updateAnnotation(activeAnn.annotationId, {
                          dimensionLabel: e.target.value,
                        })
                      }
                    />
                  </label>
                  <label className="block space-y-1">
                    <span className="text-[9px] font-semibold uppercase text-zinc-500">
                      Значение (см, мм…)
                    </span>
                    <Input
                      className="h-8 text-sm"
                      placeholder="Например: 62 или 62 см"
                      value={activeAnn.dimensionValueText ?? ''}
                      disabled={readOnly}
                      onChange={(e) =>
                        updateAnnotation(activeAnn.annotationId, {
                          dimensionValueText: e.target.value,
                        })
                      }
                    />
                  </label>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    className="h-7 w-full text-[10px]"
                    disabled={readOnly}
                    onClick={() =>
                      updateAnnotation(activeAnn.annotationId, {
                        lineEndXPct: undefined,
                        lineEndYPct: undefined,
                        dimensionLabel: undefined,
                        dimensionValueText: undefined,
                      })
                    }
                  >
                    Убрать линию (остаётся точка)
                  </Button>
                  <p className="text-[9px] leading-snug text-teal-900/90">
                    Связь с строкой BOM и атрибутом ТЗ задаётся в блоках ниже («Строка из досье», «Связь с
                    атрибутом ТЗ») — так размер попадает в техпак и PLM-таблицу вместе с ref строки.
                  </p>
                </div>
              ) : null}

              <label className="block space-y-1">
                <span className="text-[9px] font-semibold uppercase text-zinc-500">
                  {isSketchDimensionLineAnnotation(activeAnn) ? 'Доп. комментарий' : 'Текст'}
                </span>
                <Textarea
                  className="min-h-[72px] text-sm"
                  placeholder={
                    isSketchDimensionLineAnnotation(activeAnn)
                      ? 'Необязательно: уточнение к размеру…'
                      : 'Что показать в этой точке…'
                  }
                  value={activeAnn.text}
                  disabled={readOnly}
                  onChange={(e) =>
                    updateAnnotation(activeAnn.annotationId, { text: e.target.value })
                  }
                />
              </label>

              <div className="space-y-1">
                <span className="text-[9px] font-semibold uppercase text-zinc-500">
                  Фото-доказательство
                </span>
                <div className="flex flex-wrap items-end gap-2">
                  <Input
                    type="file"
                    accept="image/*"
                    className="h-8 max-w-full cursor-pointer text-xs"
                    disabled={readOnly}
                    onChange={(e) => void onPickProofPhoto(activeAnn.annotationId, e)}
                  />
                  <select
                    className="h-8 rounded-md border border-zinc-200 bg-white px-2 text-xs"
                    value={activeAnn.proofStatus ?? 'pending'}
                    disabled={readOnly || !activeAnn.proofPhotoDataUrl}
                    onChange={(e) =>
                      updateAnnotation(activeAnn.annotationId, {
                        proofStatus: e.target.value as 'pending' | 'accepted' | 'rejected',
                      })
                    }
                  >
                    <option value="pending">На проверке</option>
                    <option value="accepted">Принято</option>
                    <option value="rejected">Брак</option>
                  </select>
                </div>
                {activeAnn.proofPhotoDataUrl ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={activeAnn.proofPhotoDataUrl}
                    alt=""
                    className="max-h-40 max-w-full rounded border border-zinc-200 object-contain"
                  />
                ) : null}
              </div>

              <div className="grid gap-2 sm:grid-cols-2">
                <label className="space-y-1">
                  <span className="text-[9px] font-semibold uppercase text-zinc-500">Срок</span>
                  <Input
                    type="date"
                    className="h-8 text-sm"
                    value={activeAnn.dueDate ?? ''}
                    disabled={readOnly}
                    onChange={(e) =>
                      updateAnnotation(activeAnn.annotationId, {
                        dueDate: e.target.value || undefined,
                      })
                    }
                  />
                </label>
                <label className="space-y-1">
                  <span className="text-[9px] font-semibold uppercase text-zinc-500">
                    Ответственный
                  </span>
                  <Input
                    className="h-8 text-sm"
                    value={activeAnn.owner ?? ''}
                    disabled={readOnly}
                    onChange={(e) =>
                      updateAnnotation(activeAnn.annotationId, { owner: e.target.value })
                    }
                    placeholder="ФИО"
                  />
                </label>
              </div>

              {attributeOptions.length > 0 ? (
                <label className="block space-y-1">
                  <span className="text-[9px] font-semibold uppercase text-zinc-500">
                    Связь с атрибутом ТЗ
                  </span>
                  <select
                    className="h-9 w-full rounded-md border border-zinc-200 bg-white px-2 text-sm"
                    value={activeAnn.linkedAttributeId ?? ''}
                    disabled={readOnly}
                    onChange={(e) =>
                      updateAnnotation(activeAnn.annotationId, {
                        linkedAttributeId: e.target.value || undefined,
                      })
                    }
                  >
                    <option value="">Не связан</option>
                    {attributeOptions.map((option) => (
                      <option key={option.id} value={option.id}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                </label>
              ) : null}
              {!readOnly && attributeOptions.some((o) => o.id === 'mat') ? (
                <Button
                  type="button"
                  variant="secondary"
                  size="sm"
                  className="h-7 w-full text-[9px]"
                  disabled={readOnly || activeAnn.linkedAttributeId === 'mat'}
                  onClick={() =>
                    updateAnnotation(activeAnn.annotationId, { linkedAttributeId: 'mat' })
                  }
                >
                  Связать с полем «Основной материал»
                </Button>
              ) : null}

              {taskSlotLabelOptions.length > 0 ? (
                <label className="block space-y-1">
                  <span className="text-[9px] font-semibold uppercase text-zinc-500">
                    Задача подкатегории
                  </span>
                  <select
                    className="h-9 w-full rounded-md border border-zinc-200 bg-white px-2 text-sm"
                    value={activeAnn.linkedTaskId ?? ''}
                    disabled={readOnly}
                    title={
                      activeAnn.linkedTaskId
                        ? (taskSlotLabelById[activeAnn.linkedTaskId] ?? ORPHAN_LINKED_TASK_LABEL)
                        : undefined
                    }
                    onChange={(e) =>
                      updateAnnotation(activeAnn.annotationId, {
                        linkedTaskId: e.target.value || undefined,
                      })
                    }
                  >
                    <option value="">Не связана</option>
                    {taskSlotLabelOptions.map((o) => (
                      <option key={o.slotId} value={o.slotId}>
                        {o.label}
                      </option>
                    ))}
                  </select>
                </label>
              ) : null}

              {taskSlotLabelOptions.length > 0 && activeAnn.linkedTaskId ? (
                <div className="space-y-2 rounded-md border border-indigo-100 bg-indigo-50/50 p-2 text-xs text-indigo-950">
                  <p className="leading-snug">
                    Блок задач:{' '}
                    <span className="font-semibold">
                      {taskSlotLabelById[activeAnn.linkedTaskId] ?? ORPHAN_LINKED_TASK_LABEL}
                    </span>
                  </p>
                  <div className="flex flex-wrap gap-1.5">
                    <Button
                      type="button"
                      size="sm"
                      variant="secondary"
                      className="h-7 text-[9px]"
                      disabled={readOnly}
                      onClick={() => {
                        const line = createAnnotationTaskLine(normalizeAnnotation(activeAnn));
                        const next = appendMasterPinLineToSlotWhatToDo(
                          subcategorySketchSlots,
                          activeAnn.linkedTaskId!,
                          line
                        );
                        onPatch({ subcategorySketchSlots: next });
                      }}
                    >
                      В «Что сделать»
                    </Button>
                    <Button
                      type="button"
                      size="sm"
                      variant="outline"
                      className="h-7 text-[9px]"
                      disabled={readOnly}
                      onClick={() => {
                        const next = addAnnotationIdToSlotLinkedIds(
                          subcategorySketchSlots,
                          activeAnn.linkedTaskId!,
                          activeAnn.annotationId
                        );
                        onPatch({ subcategorySketchSlots: next });
                      }}
                    >
                      Привязать к задаче
                    </Button>
                  </div>
                </div>
              ) : null}

              {activeAnn.linkedAttributeId ? (
                <button
                  type="button"
                  className="flex items-center gap-1 text-xs font-semibold text-indigo-700 hover:underline"
                  onClick={() => {
                    const el = document.getElementById(`w2-attr-${activeAnn.linkedAttributeId}`);
                    if (el) {
                      setEditorOpen(false);
                      setTimeout(() => el.scrollIntoView({ behavior: 'smooth' }), 100);
                    }
                  }}
                >
                  <ArrowRight className="size-3" />К полю в ТЗ
                </button>
              ) : null}

              <div className="space-y-2 rounded-md border border-violet-100 bg-violet-50/50 p-2">
                <span className="text-[9px] font-semibold uppercase text-violet-900">
                  Раздел ТЗ и маршрут
                </span>
                <label className="block space-y-1">
                  <span className="text-[9px] font-semibold uppercase text-zinc-500">Раздел ТЗ</span>
                  <select
                    className="h-8 w-full rounded-md border border-zinc-200 bg-white px-2 text-sm"
                    value={normalizeLinkedTzPanelSectionForNav(activeAnn.linkedTzSectionKey) ?? ''}
                    disabled={readOnly}
                    onChange={(e) =>
                      updateAnnotation(activeAnn.annotationId, {
                        linkedTzSectionKey: (e.target.value || undefined) as
                          | Workshop2TzPanelSectionId
                          | undefined,
                      })
                    }
                  >
                    <option value="">Не задан</option>
                    {(Object.keys(TZ_PANEL_SECTION_LABELS) as Workshop2TzPanelSectionId[]).map(
                      (k) => (
                        <option key={k} value={k}>
                          {TZ_PANEL_SECTION_LABELS[k]}
                        </option>
                      )
                    )}
                  </select>
                </label>
                {activeAnn.annotationType ? (
                  <div className="rounded border border-violet-200/90 bg-white/90 px-2 py-1 text-[11px] leading-snug text-violet-950">
                    <p className="text-violet-900/95">{sketchTypeTzMatrixHint(activeAnn.annotationType)}</p>
                    {(() => {
                      const rec = recommendedTzSectionForSketchType(activeAnn.annotationType);
                      if (!rec) return null;
                      const matches =
                        normalizeLinkedTzPanelSectionForNav(activeAnn.linkedTzSectionKey) === rec;
                      return (
                        <div className="mt-1 flex flex-wrap items-center justify-between gap-2">
                          <span className="text-[9px] text-zinc-600">
                            Раздел:{' '}
                            <span className="font-semibold text-zinc-800">
                              {TZ_PANEL_SECTION_LABELS[rec]}
                            </span>
                            {matches ? ' · ок' : null}
                          </span>
                          {!readOnly && !matches ? (
                            <Button
                              type="button"
                              variant="outline"
                              size="sm"
                              className="h-6 shrink-0 px-2 text-[9px]"
                              onClick={() =>
                                updateAnnotation(activeAnn.annotationId, {
                                  linkedTzSectionKey: rec,
                                })
                              }
                            >
                              Подставить
                            </Button>
                          ) : null}
                        </div>
                      );
                    })()}
                  </div>
                ) : null}
                {activeAnn.annotationType && attributeOptions.length > 0
                  ? (() => {
                      const sug = mergeSuggestedTzAttributeIdsForSketchType(
                        activeAnn.annotationType,
                        visualCatalogSketchLinks
                      );
                      const quick = attributeOptions.filter((o) => sug.includes(o.id));
                      if (!quick.length) return null;
                      return (
                        <div className="rounded border border-sky-200/90 bg-sky-50/60 px-2 py-1.5 text-xs text-sky-950">
                          <p className="text-[9px] font-bold uppercase tracking-wide text-sky-900">
                            Поля ТЗ по типу
                          </p>
                          <div className="mt-1 flex flex-wrap gap-1">
                            {quick.map((o) => (
                              <Button
                                key={o.id}
                                type="button"
                                variant={
                                  activeAnn.linkedAttributeId === o.id ? 'default' : 'outline'
                                }
                                size="sm"
                                className="h-7 max-w-full truncate px-2 text-[9px]"
                                disabled={readOnly}
                                title={o.id}
                                onClick={() =>
                                  updateAnnotation(activeAnn.annotationId, {
                                    linkedAttributeId:
                                      activeAnn.linkedAttributeId === o.id ? undefined : o.id,
                                  })
                                }
                              >
                                {o.label}
                              </Button>
                            ))}
                          </div>
                        </div>
                      );
                    })()
                  : null}
                {onJumpToDossierSection && activeAnn.linkedTzSectionKey ? (
                  <Button
                    type="button"
                    variant="secondary"
                    size="sm"
                    className="h-7 w-full text-[9px]"
                    onClick={() => {
                      const nav = normalizeLinkedTzPanelSectionForNav(activeAnn.linkedTzSectionKey);
                      if (nav) onJumpToDossierSection(nav);
                      setEditorOpen(false);
                    }}
                  >
                    Открыть раздел «{labelForStoredTzPanelSection(activeAnn.linkedTzSectionKey)}»
                  </Button>
                ) : null}
                <label className="block space-y-1">
                  <span className="text-[9px] font-semibold uppercase text-zinc-500">Этап SKU</span>
                  <select
                    className="h-8 w-full rounded-md border border-zinc-200 bg-white px-2 text-sm"
                    value={activeAnn.linkedRouteStageId ?? ''}
                    disabled={readOnly}
                    onChange={(e) =>
                      updateAnnotation(activeAnn.annotationId, {
                        linkedRouteStageId: (e.target.value || undefined) as
                          | Workshop2TzSignoffStageId
                          | undefined,
                      })
                    }
                  >
                    <option value="">Не задан</option>
                    {ROUTE_STAGE_NAV_OPTIONS.map((o) => (
                      <option key={o.id} value={o.id}>
                        {o.label}
                      </option>
                    ))}
                  </select>
                </label>
                {onNavigateRouteStage && activeAnn.linkedRouteStageId ? (
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    className="h-7 w-full text-[9px]"
                    onClick={() => {
                      onNavigateRouteStage(activeAnn.linkedRouteStageId!);
                      setEditorOpen(false);
                    }}
                  >
                    Перейти к вкладке этапа
                  </Button>
                ) : null}
              </div>

              <div className="grid gap-2 rounded-md border border-emerald-100 bg-emerald-50/50 p-2 sm:grid-cols-2">
                {bomLinePickOptions.length > 0 ? (
                  <label className="space-y-1 sm:col-span-2">
                    <span className="text-[9px] font-semibold uppercase text-emerald-900">
                      Строка из досье (BOM / материал)
                    </span>
                    <select
                      key={`${activeAnn.annotationId}-${activeAnn.linkedBomLineRef ?? ''}`}
                      className="h-8 w-full rounded-md border border-emerald-200/80 bg-white px-2 text-sm text-zinc-900"
                      disabled={readOnly}
                      defaultValue=""
                      aria-label="Подставить ref из заполненного BOM в досье"
                      onChange={(e) => {
                        const v = e.target.value;
                        if (!v) return;
                        updateAnnotation(activeAnn.annotationId, { linkedBomLineRef: v });
                      }}
                    >
                      <option value="">Выбрать из досье…</option>
                      {bomLinePickOptions.map((o) => (
                        <option key={o.value} value={o.value}>
                          {o.label}
                        </option>
                      ))}
                    </select>
                  </label>
                ) : null}
                <label className="space-y-1 sm:col-span-2">
                  <span className="text-[9px] font-semibold uppercase text-emerald-900">
                    BOM / PLM — ref строки
                  </span>
                  <div className="flex items-center gap-2">
                    <Input
                      className="h-8 text-sm flex-1"
                      placeholder="ID строки BOM, PIM, PLM…"
                      value={activeAnn.linkedBomLineRef ?? ''}
                      disabled={readOnly}
                      onChange={(e) =>
                        updateAnnotation(activeAnn.annotationId, {
                          linkedBomLineRef: e.target.value || undefined,
                        })
                      }
                    />
                    {!readOnly && (
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        className="h-8 px-2 text-[10px] border-emerald-200 bg-emerald-50 text-emerald-800 hover:bg-emerald-100"
                        title="AI Magic Wand: Кликните по детали на скетче (слой SVG), чтобы ИИ автоматически связал её с BOM"
                        onClick={() => {
                          if (typeof window !== 'undefined') {
                            const toast = (window as any).__toast__;
                            if (toast) {
                              toast({
                                title: 'AI Magic Wand (BOM Link)',
                                description: 'Режим распознавания слоев SVG активен. Кликните по детали (например, воротнику) на скетче для авто-привязки.',
                              });
                            }
                          }
                        }}
                      >
                        <Wand2 className="h-3.5 w-3.5 mr-1" />
                        Авто-связь (SVG)
                      </Button>
                    )}
                  </div>
                </label>
                <label className="space-y-1 sm:col-span-2">
                  <span className="text-[9px] font-semibold text-emerald-900">
                    Материал / узел (текст)
                  </span>
                  <Input
                    className="h-8 text-sm"
                    placeholder="Ткань, фурнитура, узел…"
                    value={activeAnn.linkedMaterialNote ?? ''}
                    disabled={readOnly}
                    onChange={(e) =>
                      updateAnnotation(activeAnn.annotationId, {
                        linkedMaterialNote: e.target.value || undefined,
                      })
                    }
                  />
                </label>
                {!sheetStorage ? (
                  <p className="text-[9px] leading-snug text-emerald-900/90 sm:col-span-2">
                    {(() => {
                      const st = classifyBomLineRef(
                        activeAnn.linkedBomLineRef,
                        baselineBomRefs,
                        liveBomRefs
                      );
                      if (st === 'empty') return null;
                      if (st === 'no_snapshot')
                        return 'Нет снимка ревизии в архиве — сверка ref с PLM по снимку недоступна; сделайте «Снимок ревизии в архив».';
                      if (st === 'in_baseline') return 'Ref входит в последний снимок ревизии.';
                      if (st === 'not_in_baseline')
                        return 'Ref не в последнем снимке (новая привязка или расхождение с архивом).';
                      return 'Ref в снимке и среди текущих ref на доске.';
                    })()}
                  </p>
                ) : null}
              </div>

              <details className="rounded-md border border-amber-100 bg-amber-50/30">
                <summary className="cursor-pointer list-none px-2 py-1.5 text-[9px] font-semibold uppercase text-amber-950 [&::-webkit-details-marker]:hidden">
                  MES: смена и код дефекта
                </summary>
                <div className="grid gap-2 border-t border-amber-100/80 p-2 sm:grid-cols-2">
                <div className="flex flex-wrap gap-1 sm:col-span-2">
                  <span className="w-full text-[8px] font-semibold uppercase text-amber-900">
                      Пресеты смены
                  </span>
                  {MES_SHIFT_PRESETS.map((p) => (
                    <Button
                      key={p.id}
                      type="button"
                      variant="outline"
                      size="sm"
                      className="h-6 px-2 text-[9px]"
                      disabled={readOnly}
                      onClick={() =>
                        updateAnnotation(activeAnn.annotationId, { mesShiftId: p.value })
                      }
                    >
                      {p.label}
                    </Button>
                  ))}
                </div>
                <label className="space-y-1">
                    <span className="text-[9px] font-semibold text-amber-950">Смена / партия</span>
                  <Input
                    className="h-8 text-sm"
                    placeholder="Смена А, 2026-04-01…"
                    value={activeAnn.mesShiftId ?? ''}
                    disabled={readOnly}
                    onChange={(e) =>
                      updateAnnotation(activeAnn.annotationId, {
                        mesShiftId: e.target.value || undefined,
                      })
                    }
                  />
                  {(activeAnn.mesShiftId ?? '').trim() &&
                  !isValidMesShiftId(activeAnn.mesShiftId) ? (
                    <span className="text-[8px] text-rose-700">
                      Формат: буквы, цифры, пробел, дефис, дата.
                    </span>
                  ) : null}
                </label>
                <label className="space-y-1">
                    <span className="text-[9px] font-semibold text-amber-950">Код дефекта</span>
                  <select
                    className="h-8 w-full rounded-md border border-zinc-200 bg-white px-2 text-xs"
                    value={activeAnn.mesDefectCode ?? ''}
                    disabled={readOnly}
                    onChange={(e) =>
                      updateAnnotation(activeAnn.annotationId, {
                        mesDefectCode: e.target.value || undefined,
                      })
                    }
                  >
                    <option value="">—</option>
                    {mesDefectCatalogMerged.map((row) => (
                      <option key={row.code} value={row.code}>
                        {(row.parentCode ? '· ' : '') + row.code + ' — ' + row.label}
                      </option>
                    ))}
                  </select>
                </label>
                {activeAnn.mesDefectCode?.trim() ? (
                  <p className="text-[9px] text-amber-950/90 sm:col-span-2">
                    <span className="font-semibold">Цепочка:</span>{' '}
                    {defectBreadcrumbChain(mesDefectCatalogMerged, activeAnn.mesDefectCode)
                      .map((c) => `${c.code} (${c.label})`)
                      .join(' → ')}
                  </p>
                ) : null}
              </div>
              </details>

              <SketchPinThreadPanel
                annotationId={activeAnn.annotationId}
                pinNumber={activeAnnIdx >= 0 ? activeAnnIdx + 1 : undefined}
                mesDefectCode={activeAnn.mesDefectCode}
                linkedQcZoneId={activeAnn.linkedQcZoneId}
                linkedBomLineRef={activeAnn.linkedBomLineRef}
                comments={activeAnn.sketchPinComments}
                actorLabel={auditActor?.trim() || 'Участник'}
                sku={articleSku}
                pathLabel={pathLabel}
                readOnly={readOnly}
                threadResolved={activeAnn.sketchPinThreadResolved}
                threadLastReadAt={activeAnn.sketchPinThreadLastReadAt}
                sketchPageUrl={sketchPageUrl}
                onPatchThreadMeta={(patch) => updateAnnotation(activeAnn.annotationId, patch)}
                onReplaceComments={(next) =>
                  updateAnnotation(activeAnn.annotationId, { sketchPinComments: next })
                }
                threadVariant="compact"
              />
              {activePinAuditTrail.length > 0 ? (
                <div className="rounded border border-zinc-200 bg-zinc-50 px-2 py-1.5 text-[10px] text-zinc-700">
                  <p className="mb-1 font-semibold text-zinc-800">История пина</p>
                  <ul className="space-y-0.5">
                    {activePinAuditTrail.map((e) => (
                      <li key={e.entryId} className="truncate">
                        {e.by}: {e.summary}
                      </li>
                    ))}
                  </ul>
                </div>
              ) : null}

              <div className="rounded-md border border-zinc-100 bg-zinc-50/80 p-2">
                <p className="mb-1.5 text-[9px] font-semibold uppercase text-zinc-600">
                  Тип, приоритет, статус, этап
                </p>
                <div className="grid gap-2 sm:grid-cols-2">
                  <label className="space-y-1">
                    <span className="text-[9px] text-zinc-500">Тип</span>
                    <select
                      className="h-7 w-full rounded-md border border-zinc-200 bg-white px-2 text-xs"
                      value={activeAnn.annotationType ?? 'construction'}
                      disabled={readOnly}
                      onChange={(e) =>
                        updateAnnotation(activeAnn.annotationId, {
                          annotationType: e.target.value as Workshop2SketchAnnotationType,
                        })
                      }
                    >
                      {Object.entries(TYPE_LABELS).map(([key, label]) => (
                        <option key={key} value={key}>
                          {label}
                        </option>
                      ))}
                    </select>
                  </label>
                  <label className="space-y-1">
                    <span className="text-[9px] text-zinc-500">Приоритет</span>
                    <select
                      className="h-7 w-full rounded-md border border-zinc-200 bg-white px-2 text-xs"
                      value={activeAnn.priority ?? 'important'}
                      disabled={readOnly}
                      onChange={(e) =>
                        updateAnnotation(activeAnn.annotationId, {
                          priority: e.target.value as Workshop2SketchAnnotationPriority,
                        })
                      }
                    >
                      {Object.entries(PRIORITY_LABELS).map(([key, label]) => (
                        <option key={key} value={key}>
                          {label}
                        </option>
                      ))}
                    </select>
                  </label>
                  <label className="space-y-1">
                    <span className="text-[9px] text-zinc-500">Статус</span>
                    <select
                      className="h-7 w-full rounded-md border border-zinc-200 bg-white px-2 text-xs"
                      value={activeAnn.status ?? 'new'}
                      disabled={readOnly}
                      onChange={(e) =>
                        updateAnnotation(activeAnn.annotationId, {
                          status: e.target.value as Workshop2SketchAnnotationStatus,
                        })
                      }
                    >
                      {Object.entries(STATUS_LABELS).map(([key, label]) => (
                        <option key={key} value={key}>
                          {label}
                        </option>
                      ))}
                    </select>
                  </label>
                  <label className="space-y-1">
                    <span className="text-[9px] text-zinc-500">Этап</span>
                    <select
                      className="h-7 w-full rounded-md border border-zinc-200 bg-white px-2 text-xs"
                      value={activeAnn.stage ?? 'tz'}
                      disabled={readOnly}
                      onChange={(e) =>
                        updateAnnotation(activeAnn.annotationId, {
                          stage: e.target.value as Workshop2SketchAnnotationStage,
                        })
                      }
                    >
                      {Object.entries(STAGE_LABELS).map(([key, label]) => (
                        <option key={key} value={key}>
                          {label}
                        </option>
                      ))}
                    </select>
                  </label>
                </div>
                  </div>
            </div>
  );
}
