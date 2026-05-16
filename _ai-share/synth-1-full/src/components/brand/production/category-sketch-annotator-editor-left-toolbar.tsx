'use client';

import type { Dispatch, SetStateAction } from 'react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { Filter, LayoutGrid, Layers, Ruler, Save } from 'lucide-react';
import type {
  Workshop2SketchAnnotationStage,
  Workshop2SketchAnnotationType,
} from '@/lib/production/workshop2-dossier-phase1.types';
import type { CategorySketchHotspotPreset } from '@/components/brand/production/category-sketch-annotator-hotspot-presets';
import type { SketchPinTextSnippet } from '@/lib/production/workshop2-sketch-sheets';
import {
  NEXT_PIN_PRESET_LABEL,
  STAGE_LABELS,
  TYPE_LABELS,
} from '@/components/brand/production/category-sketch-annotator-label-maps';
import type { CategorySketchAnnotatorSheetStorage } from '@/components/brand/production/category-sketch-annotator-types';

export type CategorySketchAnnotatorEditorLeftToolbarProps = {
  readOnly: boolean;
  sheetStorage?: CategorySketchAnnotatorSheetStorage;
  pinsOnLeafCount: number;
  pinsHasActiveAnnotation: boolean;
  activeId: string | null;
  materialCardsEnabled: boolean;
  nextPinPreset: 'critical' | 'qc' | 'other';
  setNextPinPreset: Dispatch<SetStateAction<'critical' | 'qc' | 'other'>>;
  placeMode: boolean;
  setPlaceMode: Dispatch<SetStateAction<boolean>>;
  materialCardPlaceMode: boolean;
  setMaterialCardPlaceMode: Dispatch<SetStateAction<boolean>>;
  dimensionLinePlaceMode: boolean;
  setDimensionLinePlaceMode: Dispatch<SetStateAction<boolean>>;
  dimensionLineStartDraft: { xPct: number; yPct: number } | null;
  setDimensionLineStartDraft: Dispatch<SetStateAction<{ xPct: number; yPct: number } | null>>;
  dimensionLineExtendMode: boolean;
  setDimensionLineExtendMode: Dispatch<SetStateAction<boolean>>;
  nextAnnotationType: Workshop2SketchAnnotationType;
  setNextAnnotationType: Dispatch<SetStateAction<Workshop2SketchAnnotationType>>;
  applyLastPinStyleToNext: () => void;
  filterPinVisual: 'all' | 'critical' | 'qc' | 'other';
  setFilterPinVisual: Dispatch<SetStateAction<'all' | 'critical' | 'qc' | 'other'>>;
  filterType: 'all' | Workshop2SketchAnnotationType;
  setFilterType: Dispatch<SetStateAction<'all' | Workshop2SketchAnnotationType>>;
  filterStage: 'all' | Workshop2SketchAnnotationStage;
  setFilterStage: Dispatch<SetStateAction<'all' | Workshop2SketchAnnotationStage>>;
  pinVisualCounts: { critical: number; qc: number; other: number };
  hiddenByFilters: boolean;
  hotspotPresets: CategorySketchHotspotPreset[];
  addPresetAnnotation: (preset: CategorySketchHotspotPreset) => void;
  pinTextSnippets: SketchPinTextSnippet[];
  applyPinTextSnippet: (text: string) => void;
  onSavePinTemplateToDossier?: () => void;
  onSavePinTemplateToOrg?: () => void;
};

export function CategorySketchAnnotatorEditorLeftToolbar({
  readOnly,
  sheetStorage,
  pinsOnLeafCount,
  pinsHasActiveAnnotation,
  activeId,
  materialCardsEnabled,
  nextPinPreset,
  setNextPinPreset,
  placeMode,
  setPlaceMode,
  materialCardPlaceMode,
  setMaterialCardPlaceMode,
  dimensionLinePlaceMode,
  setDimensionLinePlaceMode,
  dimensionLineStartDraft,
  setDimensionLineStartDraft,
  dimensionLineExtendMode,
  setDimensionLineExtendMode,
  nextAnnotationType,
  setNextAnnotationType,
  applyLastPinStyleToNext,
  filterPinVisual,
  setFilterPinVisual,
  filterType,
  setFilterType,
  filterStage,
  setFilterStage,
  pinVisualCounts,
  hiddenByFilters,
  hotspotPresets,
  addPresetAnnotation,
  pinTextSnippets,
  applyPinTextSnippet,
  onSavePinTemplateToDossier,
  onSavePinTemplateToOrg,
}: CategorySketchAnnotatorEditorLeftToolbarProps) {
  return (
<div className="rounded-xl border border-zinc-200 bg-white p-2.5 shadow-sm">
  <p className="mb-1 text-xs font-semibold text-zinc-900">Новая метка на подложке</p>
  <div className="rounded-lg border border-zinc-100 bg-zinc-50/90 p-2">
    <div className="mb-1.5 text-xs text-zinc-600">
      Группа важности → «+ на доске» → клик по изображению ниже. Текст, ТЗ, BOM и прочее —
      в карточке выбранного номера справа.
    </div>
    <div className="flex flex-wrap items-center gap-2 rounded-md border border-zinc-200/80 bg-white px-2 py-1.5">
      <span className="text-[9px] font-semibold uppercase tracking-wide text-zinc-500">
        Группа
      </span>
      <div className="flex flex-wrap gap-1">
        {(
          [
            {
              key: 'critical' as const,
              dot: 'bg-rose-600',
              border: 'border-rose-300',
              activeBg: 'bg-rose-50',
            },
            {
              key: 'qc' as const,
              dot: 'bg-amber-600',
              border: 'border-amber-300',
              activeBg: 'bg-amber-50',
            },
            {
              key: 'other' as const,
              dot: 'bg-zinc-400',
              border: 'border-zinc-300',
              activeBg: 'bg-zinc-50',
            },
          ] as const
        ).map(({ key, dot, border, activeBg }) => (
          <button
            key={key}
            type="button"
            className={cn(
              'inline-flex items-center gap-1 rounded border px-2 py-1 text-xs font-medium transition-colors',
              nextPinPreset === key
                ? cn(border, activeBg, 'text-zinc-900')
                : 'border-transparent bg-white text-zinc-600 hover:bg-zinc-100'
            )}
            aria-pressed={nextPinPreset === key}
            disabled={readOnly}
            onClick={() => setNextPinPreset(key)}
          >
            <span className={cn('size-2 shrink-0 rounded-full', dot)} aria-hidden />
            {NEXT_PIN_PRESET_LABEL[key]}
          </button>
        ))}
      </div>
      <Button
        type="button"
        variant={placeMode ? 'default' : 'outline'}
        size="sm"
        className={cn(
          'h-7 shrink-0 text-xs',
          pinsOnLeafCount === 0 && !placeMode && !readOnly && 'animate-pulse shadow-md'
        )}
        disabled={readOnly}
        onClick={() => {
          setMaterialCardPlaceMode(false);
          setDimensionLinePlaceMode(false);
          setDimensionLineStartDraft(null);
          setDimensionLineExtendMode(false);
          setPlaceMode((v) => !v);
        }}
        title={
          pinsOnLeafCount === 0
            ? 'Нажмите, затем кликните по подложке, чтобы поставить первую метку'
            : undefined
        }
      >
        {placeMode ? 'Клик…' : '+ на доске'}
      </Button>
      {materialCardsEnabled ? (
        <Button
          type="button"
          variant={materialCardPlaceMode ? 'default' : 'outline'}
          size="sm"
          className="h-7 shrink-0 gap-1 text-xs"
          disabled={readOnly}
          title="Смотка / фото материала на эскизе рядом с узлом"
          onClick={() => {
            setPlaceMode(false);
            setDimensionLinePlaceMode(false);
            setDimensionLineStartDraft(null);
            setDimensionLineExtendMode(false);
            setMaterialCardPlaceMode((v) => !v);
          }}
        >
          <Layers className="size-3.5 shrink-0" aria-hidden />
          {materialCardPlaceMode ? 'Клик…' : '+ материал'}
        </Button>
      ) : null}
      <Button
        type="button"
        variant={dimensionLinePlaceMode ? 'default' : 'outline'}
        size="sm"
        className="h-7 shrink-0 gap-1 text-xs"
        disabled={readOnly}
        title="Первый клик — начало линии на изделии, второй — конец; подпись и число — в панели справа"
        onClick={() => {
          setPlaceMode(false);
          setMaterialCardPlaceMode(false);
          setDimensionLineExtendMode(false);
          setDimensionLinePlaceMode((v) => {
            const next = !v;
            if (!next) setDimensionLineStartDraft(null);
            return next;
          });
        }}
      >
        <Ruler className="size-3.5 shrink-0" aria-hidden />
        {dimensionLinePlaceMode
          ? dimensionLineStartDraft
            ? '2-й клик…'
            : '1-й клик…'
          : '+ размер'}
      </Button>
      <Button
        type="button"
        variant={dimensionLineExtendMode ? 'default' : 'outline'}
        size="sm"
        className="h-7 shrink-0 text-xs"
        disabled={
          readOnly ||
          !activeId ||
          !pinsHasActiveAnnotation
        }
        title="Сначала выберите метку справа (номер). Затем один клик по подложке — конец линии от этой метки."
        onClick={() => {
          if (!activeId) return;
          setPlaceMode(false);
          setMaterialCardPlaceMode(false);
          setDimensionLinePlaceMode(false);
          setDimensionLineStartDraft(null);
          setDimensionLineExtendMode((v) => !v);
        }}
      >
        {dimensionLineExtendMode ? 'Клик — конец…' : 'От метки'}
      </Button>
      <Button
        type="button"
        variant="ghost"
        size="sm"
        className="h-7 shrink-0 text-xs"
        disabled={readOnly}
        onClick={applyLastPinStyleToNext}
      >
        Как у последней
      </Button>
      <label className="flex min-w-0 flex-wrap items-center gap-1.5 text-xs text-zinc-600">
        <span className="shrink-0 font-semibold uppercase tracking-wide text-zinc-500">
          Тип узла
        </span>
        <select
          className="h-7 max-w-44 rounded-md border border-zinc-200 bg-white px-1.5 text-xs"
          value={nextAnnotationType}
          disabled={readOnly}
          onChange={(e) =>
            setNextAnnotationType(e.target.value as Workshop2SketchAnnotationType)
          }
          title="Используется при «+ на доске» и шаблонах текста без выбранной метки"
        >
          {Object.entries(TYPE_LABELS).map(([key, label]) => (
            <option key={key} value={key}>
              {label}
            </option>
          ))}
        </select>
      </label>
    </div>
  </div>

  <details className="rounded-lg border border-slate-100 bg-white">
    <summary className="cursor-pointer list-none p-2 text-xs font-medium text-slate-800 [&::-webkit-details-marker]:hidden">
      Фильтр списка номеров справа
    </summary>
    <div className="space-y-1.5 border-t border-slate-100 p-2">
      <div className="flex flex-wrap items-center gap-1.5">
        <Filter className="size-3.5 shrink-0 text-amber-700" aria-hidden />
        <span className="text-xs font-semibold text-slate-700">По цвету кружка</span>
        <span
          className="cursor-help text-[8px] font-normal normal-case text-slate-500"
          title="Только панель номеров справа; на подложке все точки листа видны всегда."
        >
          ⓘ
        </span>
      </div>
      <p className="text-[9px] leading-snug text-slate-500">
        «Все» / «Сбросить всё» — снять фильтры. Пресет для следующей точки — блок «Группа»
        выше.
      </p>
      <div className="flex flex-wrap items-center gap-x-2 gap-y-1 text-[9px] text-slate-600">
        <button
          type="button"
          className={cn(
            'inline-flex items-center gap-1 rounded-md border px-1.5 py-0.5 transition-colors',
            filterPinVisual === 'all' && filterType === 'all' && filterStage === 'all'
              ? 'border-zinc-400 bg-zinc-100 font-medium text-zinc-900'
              : 'border-transparent bg-transparent hover:bg-slate-100'
          )}
          aria-pressed={
            filterPinVisual === 'all' && filterType === 'all' && filterStage === 'all'
          }
          title="Снять фильтры: полный список справа; на доске и так видны все метки листа"
          onClick={() => {
            setFilterPinVisual('all');
            setFilterType('all');
            setFilterStage('all');
          }}
        >
          Все
          <span className="tabular-nums text-slate-400">({pinsOnLeafCount})</span>
        </button>
        <button
          type="button"
          className={cn(
            'inline-flex items-center gap-1 rounded-md border px-1.5 py-0.5 transition-colors',
            filterPinVisual === 'critical'
              ? 'border-rose-300 bg-rose-50 text-rose-900'
              : 'border-transparent bg-transparent hover:bg-slate-100'
          )}
          aria-pressed={filterPinVisual === 'critical'}
          title="Только красное кольцо (приоритет «критично»). Ещё раз — режим «Все»."
          onClick={() =>
            setFilterPinVisual((v) => (v === 'critical' ? 'all' : 'critical'))
          }
        >
          <span className="size-2.5 shrink-0 rounded-full bg-rose-600" aria-hidden />
          критично
          <span className="tabular-nums text-slate-400">
            ({pinVisualCounts.critical})
          </span>
        </button>
        <button
          type="button"
          className={cn(
            'inline-flex items-center gap-1 rounded-md border px-1.5 py-0.5 transition-colors',
            filterPinVisual === 'qc'
              ? 'border-amber-300 bg-amber-50 text-amber-950'
              : 'border-transparent bg-transparent hover:bg-slate-100'
          )}
          aria-pressed={filterPinVisual === 'qc'}
          title="Только этап ОТК (янтарь). Ещё раз — «Все»."
          onClick={() => setFilterPinVisual((v) => (v === 'qc' ? 'all' : 'qc'))}
        >
          <span className="size-2.5 shrink-0 rounded-full bg-amber-600" aria-hidden />
          этап ОТК
          <span className="tabular-nums text-slate-400">({pinVisualCounts.qc})</span>
        </button>
        <button
          type="button"
          className={cn(
            'inline-flex items-center gap-1 rounded-md border px-1.5 py-0.5 transition-colors',
            filterPinVisual === 'other'
              ? 'border-teal-300 bg-teal-50 text-teal-950'
              : 'border-transparent bg-transparent hover:bg-slate-100'
          )}
          aria-pressed={filterPinVisual === 'other'}
          title="Остальные (серое кольцо). Ещё раз — «Все»."
          onClick={() => setFilterPinVisual((v) => (v === 'other' ? 'all' : 'other'))}
        >
          <span className="size-2.5 shrink-0 rounded-full bg-teal-600" aria-hidden />
          остальные
          <span className="tabular-nums text-slate-400">({pinVisualCounts.other})</span>
        </button>
        <button
          type="button"
          className="ml-0.5 text-[9px] font-medium text-slate-500 underline-offset-2 hover:underline"
          disabled={
            filterPinVisual === 'all' &&
            filterType === 'all' &&
            filterStage === 'all' &&
            !placeMode &&
            !dimensionLinePlaceMode &&
            !dimensionLineExtendMode &&
            nextPinPreset === 'other'
          }
          onClick={() => {
            setFilterPinVisual('all');
            setFilterType('all');
            setFilterStage('all');
            setPlaceMode(false);
            setDimensionLinePlaceMode(false);
            setDimensionLineStartDraft(null);
            setDimensionLineExtendMode(false);
            setNextPinPreset('other');
          }}
        >
          Сбросить всё
        </button>
      </div>
      {hiddenByFilters ? (
        <p className="rounded border border-amber-200 bg-amber-50/90 px-2 py-1.5 text-[9px] text-amber-950">
          Ни одна метка не подходит под фильтр — справа список пустой. Нажмите «Все» или
          «Сбросить всё». На подложке точки не скрываются.
        </p>
      ) : null}

      <details className="rounded-lg border border-slate-100 bg-slate-50/80 p-2">
        <summary className="flex cursor-pointer list-none items-center gap-1.5 text-xs font-semibold text-slate-700 [&::-webkit-details-marker]:hidden">
          <LayoutGrid className="size-3.5 shrink-0 text-slate-600" aria-hidden />
          Тип узла и этап маршрута
          <span
            className="ml-auto cursor-help text-[8px] font-normal text-slate-500"
            title="Сужает только список номеров справа; на доске по-прежнему все точки."
          >
            ⓘ
          </span>
        </summary>
        <p className="mt-2 text-[9px] leading-snug text-slate-600">
          Суммируется с фильтром по цвету выше — только для панели номеров.
        </p>
        <div className="mt-2 grid gap-2 sm:grid-cols-2">
          <label className="space-y-1">
            <span className="text-xs font-semibold uppercase tracking-wide text-slate-500">
              Тип узла
            </span>
            <select
              className="h-8 w-full rounded-md border border-slate-200 bg-white px-2 text-sm"
              value={filterType}
              onChange={(e) => setFilterType(e.target.value as typeof filterType)}
            >
              <option value="all">Все типы</option>
              {Object.entries(TYPE_LABELS).map(([key, label]) => (
                <option key={key} value={key}>
                  {label}
                </option>
              ))}
            </select>
          </label>
          <label className="space-y-1">
            <span className="text-xs font-semibold uppercase tracking-wide text-slate-500">
              Этап маршрута
            </span>
            <select
              className="h-8 w-full rounded-md border border-slate-200 bg-white px-2 text-sm"
              value={filterStage}
              onChange={(e) => setFilterStage(e.target.value as typeof filterStage)}
            >
              <option value="all">Все этапы</option>
              {Object.entries(STAGE_LABELS).map(([key, label]) => (
                <option key={key} value={key}>
                  {label}
                </option>
              ))}
            </select>
          </label>
        </div>
      </details>
    </div>
  </details>

  {hotspotPresets.length > 0 ? (
    <details className="rounded-lg border border-teal-100 bg-teal-50/20">
      <summary className="cursor-pointer list-none p-2 text-xs font-medium text-teal-950 [&::-webkit-details-marker]:hidden">
        Готовые точки по зонам (ускорение)
      </summary>
      <div className="flex flex-wrap gap-1.5 border-t border-teal-100 p-2">
        {hotspotPresets.map((preset) => (
          <Button
            key={preset.id}
            type="button"
            size="sm"
            variant="outline"
            className="h-7 text-xs"
            onClick={() => addPresetAnnotation(preset)}
          >
            + {preset.label}
          </Button>
        ))}
      </div>
    </details>
  ) : null}

  {pinTextSnippets.length > 0 ? (
    <div className="rounded-lg border border-slate-200 bg-slate-50/80 p-2">
      <p className="mb-1.5 text-xs font-medium text-slate-800">
        Готовые фразы в текст метки
      </p>
      <div className="flex flex-wrap gap-1.5">
        {pinTextSnippets.map((s) => (
          <Button
            key={s.id}
            type="button"
            size="sm"
            variant="secondary"
            className="h-7 text-xs"
            onClick={() => applyPinTextSnippet(s.text)}
          >
            {s.label}
          </Button>
        ))}
      </div>
    </div>
  ) : null}

  {!readOnly &&
  !sheetStorage &&
  (onSavePinTemplateToDossier || onSavePinTemplateToOrg) ? (
    <details className="rounded-lg border border-emerald-200 bg-emerald-50/30">
      <summary className="cursor-pointer list-none p-2 text-xs font-medium text-emerald-950 [&::-webkit-details-marker]:hidden">
        Сохранить этот набор точек как шаблон
      </summary>
      <div className="flex flex-wrap gap-2 border-t border-emerald-100 p-2">
        {onSavePinTemplateToDossier ? (
          <Button
            type="button"
            size="sm"
            variant="default"
            className="h-8 gap-1 text-xs"
            onClick={onSavePinTemplateToDossier}
          >
            <Save className="size-3.5" />В досье
          </Button>
        ) : null}
        {onSavePinTemplateToOrg ? (
          <Button
            type="button"
            size="sm"
            variant="outline"
            className="h-8 text-xs"
            onClick={onSavePinTemplateToOrg}
          >
            В библиотеку
          </Button>
        ) : null}
      </div>
    </details>
  ) : null}
</div>
  );
}
