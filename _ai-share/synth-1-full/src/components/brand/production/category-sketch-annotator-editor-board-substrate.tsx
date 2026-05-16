'use client';

import type { ChangeEvent, Dispatch, LegacyRef, MouseEvent, RefObject, SetStateAction } from 'react';
import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { cn } from '@/lib/utils';
import { Layers } from 'lucide-react';
import { CategorySketchTemplateSvg } from '@/lib/production/category-sketch-template';
import { isSketchDimensionLineAnnotation } from '@/lib/production/sketch-dimension-line';
import { MAX_SKETCH_MATERIAL_CARDS_PER_BOARD } from '@/lib/production/workshop2-sketch-sheets';
import type {
  SketchRevisionCompareResult,
  SketchRevisionOverlayPoint,
} from '@/lib/production/sketch-revision-diff';
import type { HandbookCategoryLeaf } from '@/lib/production/category-handbook-leaves';
import type {
  Workshop2Phase1CategorySketchAnnotation,
  Workshop2SketchMaterialCard,
} from '@/lib/production/workshop2-dossier-phase1.types';
import type {
  CategorySketchAnnotatorContext,
  CategorySketchAnnotatorSheetStorage,
} from '@/components/brand/production/category-sketch-annotator-types';
import { NEXT_PIN_PRESET_LABEL } from '@/components/brand/production/category-sketch-annotator-label-maps';
import { CategorySketchPinHoverCard } from '@/components/brand/production/category-sketch-pin-hover-card';

export type CategorySketchAnnotatorEditorBoardSubstrateProps = {
  boardRef: RefObject<HTMLDivElement | null>;
  templateLayerRef: RefObject<HTMLDivElement | null>;
  materialCardFileInputRef: RefObject<HTMLInputElement | null>;
  readOnly: boolean;
  sheetStorage: CategorySketchAnnotatorSheetStorage | null | undefined;
  imageDataUrl?: string;
  currentLeaf: HandbookCategoryLeaf;
  sketchContext?: CategorySketchAnnotatorContext;
  compareOverlayDataUrl?: string | null;
  compareOpacity: number;
  compareOffsetXPct: number;
  compareOffsetYPct: number;
  compareScalePct: number;
  materialCardPlaceMode: boolean;
  materialCardsEnabled: boolean;
  dimensionLineExtendMode: boolean;
  dimensionLinePlaceMode: boolean;
  dimensionLineStartDraft: { xPct: number; yPct: number } | null;
  placeMode: boolean;
  nextPinPreset: 'critical' | 'qc' | 'other';
  activeAnnIdx: number;
  revisionDiff: SketchRevisionCompareResult | null;
  revisionDiffOverlayPins: SketchRevisionOverlayPoint[];
  revisionDiffChangedIdSet: Set<string>;
  revisionDiffOverlayOn: boolean;
  setRevisionDiffOverlayOn: Dispatch<SetStateAction<boolean>>;
  revisionDiffOnlyMode: boolean;
  setRevisionDiffOnlyMode: Dispatch<SetStateAction<boolean>>;
  pinsOnLeaf: Workshop2Phase1CategorySketchAnnotation[];
  dataMaterialCards: Workshop2SketchMaterialCard[];
  activeMaterialCardId: string | null;
  setActiveMaterialCardId: (id: string | null) => void;
  setActiveId: (id: string | null) => void;
  activeId: string | null;
  visibleIds: Set<string>;
  attributeOptions: { id: string; label: string }[];
  taskSlotLabelById: Record<string, string>;
  onBoardClick: (e: MouseEvent<HTMLDivElement>) => void;
  onPickMaterialCardImage: (e: ChangeEvent<HTMLInputElement>) => void;
};

export function CategorySketchAnnotatorEditorBoardSubstrate({
  boardRef,
  templateLayerRef,
  materialCardFileInputRef,
  readOnly,
  sheetStorage,
  imageDataUrl,
  currentLeaf,
  sketchContext,
  compareOverlayDataUrl,
  compareOpacity,
  compareOffsetXPct,
  compareOffsetYPct,
  compareScalePct,
  materialCardPlaceMode,
  materialCardsEnabled,
  dimensionLineExtendMode,
  dimensionLinePlaceMode,
  dimensionLineStartDraft,
  placeMode,
  nextPinPreset,
  activeAnnIdx,
  revisionDiff,
  revisionDiffOverlayPins,
  revisionDiffChangedIdSet,
  revisionDiffOverlayOn,
  setRevisionDiffOverlayOn,
  revisionDiffOnlyMode,
  setRevisionDiffOnlyMode,
  pinsOnLeaf,
  dataMaterialCards,
  activeMaterialCardId,
  setActiveMaterialCardId,
  setActiveId,
  activeId,
  visibleIds,
  attributeOptions,
  taskSlotLabelById,
  onBoardClick,
  onPickMaterialCardImage,
}: CategorySketchAnnotatorEditorBoardSubstrateProps) {
  return (
    <div className="rounded-xl border border-zinc-200 bg-white p-2 shadow-sm">
      <p className="mb-2 text-center text-xs font-semibold text-zinc-900">Подложка и точки</p>
      {revisionDiff && revisionDiffOverlayPins.length > 0 ? (
        <div className="mb-2 flex flex-wrap items-center gap-1.5 rounded border border-violet-200 bg-violet-50/60 px-2 py-1 text-[10px] text-violet-900">
          <Button
            type="button"
            size="sm"
            variant={revisionDiffOverlayOn ? 'default' : 'outline'}
            className="h-6 px-2 text-[10px]"
            onClick={() => setRevisionDiffOverlayOn((v) => !v)}
          >
            {revisionDiffOverlayOn ? 'Скрыть diff' : 'Показать diff'}
          </Button>
          <Button
            type="button"
            size="sm"
            variant={revisionDiffOnlyMode ? 'default' : 'outline'}
            className="h-6 px-2 text-[10px]"
            disabled={!revisionDiffOverlayOn}
            onClick={() => setRevisionDiffOnlyMode((v) => !v)}
          >
            Только изменения
          </Button>
          <span className="inline-flex items-center gap-1">
            <span className="h-2.5 w-2.5 rounded-full bg-emerald-500" />+{revisionDiff.addedIds.length}
          </span>
          <span className="inline-flex items-center gap-1">
            <span className="h-2.5 w-2.5 rounded-full bg-rose-500" />−{revisionDiff.removedIds.length}
          </span>
          <span className="inline-flex items-center gap-1">
            <span className="h-2.5 w-2.5 rounded-full bg-amber-500" />~{revisionDiff.changed.length}
          </span>
        </div>
      ) : null}
      <div className="rounded-lg border border-zinc-200 bg-zinc-100 p-1.5">
        <div
          ref={boardRef as LegacyRef<HTMLDivElement>}
          role="region"
          aria-label="Поле скетча категории с метками"
          className={cn(
            'relative aspect-[4/3] w-full overflow-hidden border border-zinc-200 bg-white',
            (placeMode ||
              dimensionLinePlaceMode ||
              dimensionLineExtendMode ||
              (materialCardPlaceMode && materialCardsEnabled)) &&
              'cursor-crosshair ring-2 ring-offset-2',
            placeMode &&
              !dimensionLinePlaceMode &&
              !dimensionLineExtendMode &&
              !(materialCardPlaceMode && materialCardsEnabled) &&
              'ring-zinc-900',
            dimensionLinePlaceMode && 'ring-indigo-700',
            dimensionLineExtendMode && 'ring-violet-700',
            materialCardPlaceMode && materialCardsEnabled && 'ring-teal-700'
          )}
          onClick={onBoardClick}
        >
          <input
            ref={materialCardFileInputRef as LegacyRef<HTMLInputElement>}
            type="file"
            accept="image/*"
            className="sr-only"
            aria-hidden
            tabIndex={-1}
            onChange={(ev) => void onPickMaterialCardImage(ev)}
          />
          {materialCardPlaceMode && materialCardsEnabled ? (
            <div className="pointer-events-none absolute inset-x-3 top-3 z-10 rounded-md border border-teal-200 bg-white/95 px-2.5 py-1.5 text-xs font-medium text-teal-950 shadow-sm">
              Карточка материала: кликните по подложке, куда вставить смотку (до{' '}
              {MAX_SKETCH_MATERIAL_CARDS_PER_BOARD} шт.).
            </div>
          ) : dimensionLineExtendMode ? (
            <div className="pointer-events-none absolute inset-x-3 top-3 z-10 rounded-md border border-violet-200 bg-white/95 px-2.5 py-1.5 text-xs font-medium text-violet-950 shadow-sm">
              Метка #{activeAnnIdx >= 0 ? activeAnnIdx + 1 : '—'}: один клик по подложке — конец линии
              размера (начало — центр выбранной метки). Подпись и значение — справа.
            </div>
          ) : dimensionLinePlaceMode ? (
            <div className="pointer-events-none absolute inset-x-3 top-3 z-10 rounded-md border border-indigo-200 bg-white/95 px-2.5 py-1.5 text-xs font-medium text-indigo-950 shadow-sm">
              {dimensionLineStartDraft
                ? 'Второй клик — конец линии размера на изделии.'
                : 'Первый клик — начало линии, второй — конец. Подпись и число (см/мм) — справа в панели метки.'}
            </div>
          ) : placeMode ? (
            <div className="pointer-events-none absolute inset-x-3 top-3 z-10 rounded-md border border-teal-200 bg-white/90 px-2.5 py-1.5 text-xs font-medium text-teal-900 shadow-sm">
              Кружок: <span className="font-bold">{NEXT_PIN_PRESET_LABEL[nextPinPreset]}</span>. Кликните по
              картинке.
            </div>
          ) : null}
          <div ref={templateLayerRef as LegacyRef<HTMLDivElement>} className="absolute inset-0 size-full">
            {imageDataUrl ? (
              // eslint-disable-next-line @next/next/no-img-element -- data URL из досье
              <img src={imageDataUrl} alt="Подложка скетча" className="size-full object-contain" />
            ) : sheetStorage ? (
              <div className="flex size-full flex-col items-center justify-center gap-1 bg-zinc-50 px-4 text-center text-[11px] text-zinc-500">
                <span className="font-medium text-zinc-600">Подложки нет</span>
                <span>Загрузите файл — «Загрузить скетч» выше.</span>
              </div>
            ) : (
              <>
                <div className="flex size-full flex-col items-center justify-center gap-1 bg-zinc-50 px-4 text-center">
                  <span className="text-sm font-medium text-zinc-600">Пока не загружен скетч</span>
                  <span className="text-[11px] text-zinc-500">
                    Загрузите изображение кнопкой выше — типовой силуэт не подставляется.
                  </span>
                </div>
                {/* Скрытый SVG для «Скачать .svg силуэта» (экспорт типового контура без показа на доске). */}
                <div
                  className="pointer-events-none absolute left-0 top-0 overflow-hidden opacity-0"
                  style={{ width: 320, height: 240 }}
                  aria-hidden
                >
                  <CategorySketchTemplateSvg
                    leaf={currentLeaf}
                    sketchContext={sketchContext}
                    className="size-full"
                  />
                </div>
              </>
            )}
            {compareOverlayDataUrl && !sheetStorage ? (
              // eslint-disable-next-line @next/next/no-img-element -- data URL эталона
              <img
                src={compareOverlayDataUrl}
                alt=""
                className="pointer-events-none absolute inset-0 size-full object-contain"
                style={{
                  opacity: compareOpacity / 100,
                  transform: `translate(${compareOffsetXPct}%, ${compareOffsetYPct}%) scale(${compareScalePct / 100})`,
                  transformOrigin: 'center center',
                }}
              />
            ) : null}
          </div>
          {pinsOnLeaf.some(isSketchDimensionLineAnnotation) ? (
            <svg
              className="pointer-events-none absolute inset-0 z-[3] size-full"
              viewBox="0 0 100 100"
              preserveAspectRatio="none"
              aria-hidden
            >
              {pinsOnLeaf.filter(isSketchDimensionLineAnnotation).map((a) => (
                <line
                  key={`dim-line-${a.annotationId}`}
                  x1={a.xPct}
                  y1={a.yPct}
                  x2={a.lineEndXPct}
                  y2={a.lineEndYPct}
                  stroke="#0d9488"
                  strokeWidth={0.42}
                  strokeLinecap="round"
                  vectorEffect="non-scaling-stroke"
                />
              ))}
            </svg>
          ) : null}
          {dataMaterialCards.map((card) => (
            <div
              key={card.cardId}
              className={cn(
                'absolute z-[4] -translate-x-1/2 -translate-y-1/2 overflow-hidden rounded-md border-2 border-white bg-white shadow-md ring-1 ring-zinc-300',
                activeMaterialCardId === card.cardId && 'ring-2 ring-teal-600 ring-offset-1'
              )}
              style={{
                left: `${card.xPct}%`,
                top: `${card.yPct}%`,
                width: `${card.widthPct ?? 12}%`,
              }}
            >
              <button
                type="button"
                className="relative block w-full cursor-pointer text-left"
                onClick={(ev) => {
                  ev.stopPropagation();
                  setActiveMaterialCardId(card.cardId);
                  setActiveId(null);
                }}
                aria-label={
                  card.caption?.trim()
                    ? `Карточка материала: ${card.caption.trim()}`
                    : 'Карточка материала'
                }
              >
                {card.imageDataUrl ? (
                  // eslint-disable-next-line @next/next/no-img-element -- data URL
                  <img src={card.imageDataUrl} alt="" className="aspect-square w-full object-cover" />
                ) : (
                  <div className="flex aspect-square w-full flex-col items-center justify-center gap-0.5 bg-zinc-100 px-1 text-center">
                    <Layers className="size-5 text-zinc-400" aria-hidden />
                    <span className="text-[8px] font-medium leading-tight text-zinc-500">Фото</span>
                  </div>
                )}
                {card.caption?.trim() ? (
                  <span className="absolute inset-x-0 bottom-0 line-clamp-2 bg-black/55 px-0.5 py-0.5 text-[8px] font-medium leading-tight text-white">
                    {card.caption.trim()}
                  </span>
                ) : null}
              </button>
            </div>
          ))}
          {(revisionDiffOnlyMode && revisionDiffOverlayOn
            ? pinsOnLeaf.filter((a) => revisionDiffChangedIdSet.has(a.annotationId))
            : pinsOnLeaf
          ).map((a, idx) => (
            <Tooltip key={a.annotationId} delayDuration={200}>
              <TooltipTrigger asChild>
                <button
                  type="button"
                  id={`w2-sketch-pin-${a.annotationId}`}
                  className={cn(
                    'absolute z-[5] flex -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border-2 bg-zinc-50 font-mono font-bold tabular-nums text-zinc-900 shadow-sm transition-shadow',
                    readOnly ? 'size-11 text-base' : 'size-9 text-sm',
                    a.priority === 'critical'
                      ? 'border-rose-600 shadow-[0_0_0_1px_rgba(225,29,72,0.35)]'
                      : a.stage === 'qc'
                        ? 'border-amber-500 shadow-[0_0_0_1px_rgba(217,119,6,0.35)]'
                        : 'border-zinc-400',
                    activeId === a.annotationId && 'ring-2 ring-zinc-900 ring-offset-1',
                    !visibleIds.has(a.annotationId) && 'ring-dashed opacity-55 ring-1 ring-slate-400'
                  )}
                  style={{ left: `${a.xPct}%`, top: `${a.yPct}%` }}
                  onClick={(ev) => {
                    ev.stopPropagation();
                    setActiveMaterialCardId(null);
                    setActiveId(a.annotationId);
                  }}
                  aria-label={`Метка ${idx + 1}, наведите для описания и параметров`}
                >
                  {idx + 1}
                </button>
              </TooltipTrigger>
              <TooltipContent
                side="top"
                sideOffset={8}
                className="border-slate-200 bg-white p-3 text-popover-foreground shadow-lg"
              >
                <CategorySketchPinHoverCard
                  annotation={a}
                  index={idx}
                  attributeOptions={attributeOptions}
                  taskSlotLabelById={taskSlotLabelById}
                />
              </TooltipContent>
            </Tooltip>
          ))}
          {revisionDiffOverlayOn
            ? revisionDiffOverlayPins.map((p, idx) => (
                <div
                  key={`${p.kind}-${p.annotationId}-${idx}`}
                  className={cn(
                    'pointer-events-none absolute z-[4] -translate-x-1/2 -translate-y-1/2 rounded-full border-2 bg-white/90',
                    p.kind === 'added'
                      ? 'h-5 w-5 border-emerald-500'
                      : p.kind === 'removed'
                        ? 'h-5 w-5 border-rose-500'
                        : 'h-5 w-5 border-amber-500'
                  )}
                  style={{ left: `${p.xPct}%`, top: `${p.yPct}%` }}
                  title={`${p.kind}: ${p.annotationId}`}
                  aria-hidden
                />
              ))
            : null}
        </div>
      </div>
    </div>
  );
}
