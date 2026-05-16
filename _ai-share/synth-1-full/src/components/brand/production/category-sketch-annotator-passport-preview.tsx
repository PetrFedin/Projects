'use client';

import type { ChangeEvent, LegacyRef, RefObject } from 'react';
import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { cn } from '@/lib/utils';
import { Expand, Upload } from 'lucide-react';
import type { Workshop2Phase1CategorySketchAnnotation } from '@/lib/production/workshop2-dossier-phase1.types';
import type { CategorySketchAnnotatorSheetStorage } from '@/components/brand/production/category-sketch-annotator-types';
import { normalizeAnnotation } from '@/components/brand/production/category-sketch-annotator-annotation-helpers';
import { sketchPinBelongsToLeaf } from '@/lib/production/workshop2-sketch-pin-templates';
import { CategorySketchPinHoverCard } from '@/components/brand/production/category-sketch-pin-hover-card';

export type CategorySketchAnnotatorPassportPreviewProps = {
  suppressPreviewActionRow: boolean;
  previewSketchFileInputRef: RefObject<HTMLInputElement | null>;
  onPickImage: (e: ChangeEvent<HTMLInputElement>) => void | Promise<void>;
  showPassportSectionHeader: boolean;
  readOnly: boolean;
  canOpenSketchEditor: boolean;
  onOpenEditor: () => void;
  imageDataUrl?: string;
  sheetStorage?: CategorySketchAnnotatorSheetStorage;
  externalPreviewSketchToolbar: boolean;
  dataAnnotations: Workshop2Phase1CategorySketchAnnotation[];
  leafId: string;
  attributeOptions: { id: string; label: string }[];
  taskSlotLabelById: Record<string, string>;
  onPinBadgeClick: (annotationId: string) => void;
};

export function CategorySketchAnnotatorPassportPreview({
  suppressPreviewActionRow,
  previewSketchFileInputRef,
  onPickImage,
  showPassportSectionHeader,
  readOnly,
  canOpenSketchEditor,
  onOpenEditor,
  imageDataUrl,
  sheetStorage,
  externalPreviewSketchToolbar,
  dataAnnotations,
  leafId,
  attributeOptions,
  taskSlotLabelById,
  onPinBadgeClick,
}: CategorySketchAnnotatorPassportPreviewProps) {
  return (
    <>
      {suppressPreviewActionRow ? (
        <input
          ref={previewSketchFileInputRef as LegacyRef<HTMLInputElement>}
          type="file"
          accept="image/*"
          className="sr-only"
          aria-hidden
          tabIndex={-1}
          onChange={(e) => void onPickImage(e)}
        />
      ) : (
        <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between sm:gap-3">
          <div className="min-w-0 flex-1 space-y-1">
            {showPassportSectionHeader ? (
              <>
                <p className="text-sm font-semibold text-slate-900">Скетч по категории</p>
                <p className="text-sm leading-snug text-slate-600">
                  Метки привязаны к ветке каталога и SKU; полный редактор — по кнопке или по превью.
                </p>
              </>
            ) : null}
          </div>
          <div className="flex w-full flex-none flex-wrap items-center justify-end gap-2 sm:ml-auto sm:w-auto">
            <input
              ref={previewSketchFileInputRef as LegacyRef<HTMLInputElement>}
              type="file"
              accept="image/*"
              className="sr-only"
              aria-hidden
              tabIndex={-1}
              onChange={(e) => void onPickImage(e)}
            />
            <Button
              type="button"
              variant="outline"
              size="sm"
              className="h-9 min-w-[9.5rem] flex-1 gap-1.5 text-xs sm:flex-initial"
              disabled={readOnly}
              title={
                readOnly
                  ? 'В режиме цеха загрузка отключена'
                  : 'Загрузить или заменить изображение скетча'
              }
              onClick={() => previewSketchFileInputRef.current?.click()}
            >
              <Upload className="size-3.5 shrink-0" aria-hidden />
              Загрузить скетч
            </Button>
            <Button
              type="button"
              size="sm"
              className="h-9 min-w-[9.5rem] flex-1 gap-1.5 text-xs sm:flex-initial"
              disabled={!canOpenSketchEditor}
              title={
                !canOpenSketchEditor
                  ? 'Сначала загрузите изображение скетча'
                  : readOnly
                    ? 'Просмотр меток (режим цеха)'
                    : 'Открыть полный редактор меток'
              }
              onClick={() => {
                if (!canOpenSketchEditor) return;
                onOpenEditor();
              }}
            >
              <Expand className="size-3.5 shrink-0" aria-hidden />
              Открыть скетч
            </Button>
          </div>
        </div>
      )}

      <div
        role={canOpenSketchEditor ? 'button' : undefined}
        tabIndex={canOpenSketchEditor ? 0 : undefined}
        onClick={() => {
          if (canOpenSketchEditor) onOpenEditor();
        }}
        onKeyDown={(e) => {
          if (!canOpenSketchEditor) return;
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            onOpenEditor();
          }
        }}
        className={cn(
          'group block w-full overflow-hidden rounded-lg border border-slate-200 bg-white text-left shadow-sm transition focus-visible:outline-none',
          canOpenSketchEditor
            ? cn(
                'cursor-pointer hover:border-teal-300 focus-visible:ring-2 focus-visible:ring-teal-500 focus-visible:ring-offset-2',
                readOnly && 'hover:border-slate-200'
              )
            : 'cursor-default opacity-95'
        )}
      >
        <div className="relative aspect-[4/3] min-h-56 w-full overflow-hidden bg-white sm:min-h-[min(56vh,32rem)]">
          {imageDataUrl ? (
            // eslint-disable-next-line @next/next/no-img-element -- data URL из досье
            <img src={imageDataUrl} alt="Подложка скетча" className="size-full object-contain" />
          ) : sheetStorage ? (
            <div className="flex size-full flex-col items-center justify-center gap-2 bg-zinc-50 px-4 text-center text-xs text-zinc-500">
              <span className="font-medium text-zinc-600">Подложки нет</span>
              {readOnly ? (
                <span className="text-[11px]">В режиме цеха загрузка отключена.</span>
              ) : (
                <button
                  type="button"
                  className="text-[11px] font-semibold text-teal-700 underline decoration-teal-700/60 underline-offset-2 hover:text-teal-800"
                  onClick={() => previewSketchFileInputRef.current?.click()}
                >
                  Выбрать файл для листа…
                </button>
              )}
            </div>
          ) : (
            <div className="flex size-full flex-col items-center justify-center gap-1 bg-zinc-50 px-4 text-center">
              <span className="text-sm font-medium text-zinc-600">Пока не загружен скетч</span>
              <span className="text-[11px] text-zinc-500">
                {externalPreviewSketchToolbar
                  ? 'Загрузите файл кнопкой «Загрузить скетч» рядом с вкладками «Скетч» / «Узлы ветки» — затем откроется полный редактор.'
                  : 'Загрузите файл кнопкой выше — затем откроется полный редактор.'}
              </span>
            </div>
          )}
          {dataAnnotations
            .map(normalizeAnnotation)
            .filter((a) => sketchPinBelongsToLeaf(a, leafId))
            .slice(0, 8)
            .map((a, idx) => (
              <Tooltip key={a.annotationId} delayDuration={200}>
                <TooltipTrigger asChild>
                  <button
                    type="button"
                    className={cn(
                      'pointer-events-auto absolute z-[15] flex size-7 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border-2 bg-zinc-50 font-mono text-sm font-bold tabular-nums text-zinc-900 shadow-sm transition-transform hover:scale-105',
                      a.priority === 'critical'
                        ? 'border-rose-600'
                        : a.stage === 'qc'
                          ? 'border-amber-500'
                          : 'border-zinc-400'
                    )}
                    style={{ left: `${a.xPct}%`, top: `${a.yPct}%` }}
                    onClick={(e) => {
                      e.stopPropagation();
                      onPinBadgeClick(a.annotationId);
                    }}
                    aria-label={`Метка ${idx + 1}, наведите для комментария`}
                  >
                    {idx + 1}
                  </button>
                </TooltipTrigger>
                <TooltipContent
                  side="top"
                  sideOffset={6}
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
          {canOpenSketchEditor ? (
            <div className="pointer-events-none absolute inset-x-0 bottom-0 z-10 flex items-center justify-end px-3 py-2 text-white">
              <span className="shrink-0 text-xs opacity-90 group-hover:underline">Открыть редактор</span>
            </div>
          ) : null}
        </div>
      </div>
    </>
  );
}
