'use client';

import type { ChangeEvent } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Download, GitCompare, ImageIcon } from 'lucide-react';
import type {
  CategorySketchAnnotatorPatch,
  CategorySketchAnnotatorSheetStorage,
} from '@/components/brand/production/category-sketch-annotator-types';

export type CategorySketchAnnotatorEditorSketchFilePanelProps = {
  sketchImageInputId: string;
  sketchCompareInputId: string;
  sheetStorage: CategorySketchAnnotatorSheetStorage | null | undefined;
  readOnly: boolean;
  imageDataUrl?: string;
  imageFileName?: string;
  compareOverlayDataUrl?: string | null;
  compareOverlayFileName?: string | null;
  compareOpacity: number;
  compareScalePct: number;
  compareOffsetXPct: number;
  compareOffsetYPct: number;
  demoRefBusy: boolean;
  onPickImage: (e: ChangeEvent<HTMLInputElement>) => void;
  onPickCompareOverlay: (e: ChangeEvent<HTMLInputElement>) => void;
  clearCompareOverlay: () => void;
  clearImage: () => void;
  downloadSvgSilhouette: () => void;
  applyDemoAiReference: (prompt?: string) => void | Promise<void>;
  onPatch: (patch: CategorySketchAnnotatorPatch) => void;
};

export function CategorySketchAnnotatorEditorSketchFilePanel({
  sketchImageInputId,
  sketchCompareInputId,
  sheetStorage,
  readOnly,
  imageDataUrl,
  imageFileName,
  compareOverlayDataUrl,
  compareOverlayFileName,
  compareOpacity,
  compareScalePct,
  compareOffsetXPct,
  compareOffsetYPct,
  demoRefBusy,
  onPickImage,
  onPickCompareOverlay,
  clearCompareOverlay,
  clearImage,
  downloadSvgSilhouette,
  applyDemoAiReference,
  onPatch,
}: CategorySketchAnnotatorEditorSketchFilePanelProps) {
  return (
    <details className="rounded-xl border border-slate-200 bg-white shadow-sm">
      <summary className="cursor-pointer list-none px-3 py-2.5 text-xs font-medium text-zinc-800 [&::-webkit-details-marker]:hidden">
        {sheetStorage
          ? 'Файл подложки листа · эталон · .svg'
          : 'Файл подложки · эталон для сравнения · .svg'}
      </summary>
      <div className="space-y-2 border-t border-slate-100 p-3">
        <p className="text-xs leading-snug text-slate-600">
          {sheetStorage
            ? 'Замена файла — только этот лист; координаты меток сохраняются.'
            : 'Подложка — загруженный файл; без файла доска пустая (силуэт на экран не подставляем).'}
        </p>
        <div className="space-y-1">
          <Label htmlFor={sketchImageInputId} className="text-xs text-slate-500">
            {imageDataUrl ? 'Заменить другим файлом' : 'Файл изображения (jpg, png, webp…)'}
          </Label>
          <Input
            id={sketchImageInputId}
            type="file"
            accept="image/*"
            className="h-9 cursor-pointer text-xs"
            disabled={readOnly}
            onChange={(e) => void onPickImage(e)}
          />
        </div>
        <div className="flex flex-wrap gap-2 pt-0.5">
          <Button
            type="button"
            variant="outline"
            size="sm"
            className="h-8 gap-1 text-xs"
            disabled={Boolean(imageDataUrl)}
            onClick={downloadSvgSilhouette}
            title={imageDataUrl ? 'Сбросьте фото, чтобы экспортировать вектор' : ''}
          >
            <Download className="size-3.5" />
            Скачать .svg силуэта
          </Button>
          {!sheetStorage ? (
            <details className="min-w-48 flex-1 rounded-md border border-dashed border-teal-200 bg-teal-50/30 p-2 text-xs">
              <summary
                className="mb-1.5 flex cursor-pointer items-center gap-1.5 font-semibold text-teal-800/60 opacity-80"
                title="В разработке"
              >
                <ImageIcon className="size-4" />
                Сгенерировать скетч (скоро)
              </summary>
              <div className="pointer-events-none space-y-2 border-t border-teal-100 pt-2 opacity-60">
                <div className="space-y-1">
                  <Label
                    htmlFor="ai-sketch-prompt"
                    className="text-[10px] font-medium text-teal-700"
                  >
                    Текстовое описание (опционально)
                  </Label>
                  <Textarea
                    id="ai-sketch-prompt"
                    placeholder="Например: классическая белая рубашка, длинный рукав, приталенный силуэт..."
                    className="h-16 resize-none border-teal-200 text-[11px] focus-visible:ring-teal-500"
                    disabled={true}
                  />
                </div>
                <div className="flex items-center gap-2">
                  <Button
                    type="button"
                    variant="default"
                    size="sm"
                    className="h-8 w-full gap-1 bg-teal-600 text-xs text-white hover:bg-teal-700"
                    disabled={true}
                  >
                    Генерация (в разработке)
                  </Button>
                </div>
                <p className="text-[9px] leading-snug text-teal-600/80">
                  AI создаст базовый скетч по описанию и параметрам артикула (ожидается подключение
                  бэкенда).
                </p>
              </div>
            </details>
          ) : null}
        </div>
        {!sheetStorage ? (
          <div className="space-y-1.5 border-t border-slate-200/80 pt-2">
            <div className="flex flex-wrap items-center gap-1.5">
              <GitCompare className="size-3.5 shrink-0 text-teal-700" aria-hidden />
              <p className="text-xs font-semibold uppercase tracking-wide text-slate-600">
                Сравнение с эталоном
              </p>
              <span
                className="cursor-help text-[8px] font-normal normal-case text-slate-500"
                title="Накладывает референс поверх подложки для визуальной проверки. Не входит в экспорт SVG силуэта."
              >
                ⓘ
              </span>
            </div>
            <p className="text-[9px] leading-snug text-slate-600">
              Наложение поверх подложки (прошлая партия, референс). Подгонка масштаба и сдвига —
              слайдерами ниже.
            </p>
            <Label htmlFor={sketchCompareInputId} className="text-xs text-slate-500">
              {compareOverlayDataUrl ? 'Заменить эталон' : 'Файл эталона (jpg, png…)'}
            </Label>
            <Input
              id={sketchCompareInputId}
              type="file"
              accept="image/*"
              className="h-9 cursor-pointer text-xs"
              disabled={readOnly}
              onChange={(e) => void onPickCompareOverlay(e)}
            />
            {compareOverlayDataUrl ? (
              <div className="space-y-2">
                <p className="text-[9px] leading-snug text-slate-600">
                  Прозрачность, масштаб и смещение по полю.
                </p>
                <div className="flex flex-wrap items-center gap-2">
                  <span className="text-[9px] text-slate-600">Прозрачность: {compareOpacity}%</span>
                  <input
                    type="range"
                    min={15}
                    max={100}
                    value={compareOpacity}
                    disabled={readOnly}
                    className="h-2 w-[min(100%,12rem)] accent-teal-600"
                    onChange={(e) =>
                      onPatch({
                        categorySketchCompareOverlayOpacityPct: Number(e.target.value),
                      })
                    }
                  />
                </div>
                <div className="flex flex-wrap items-center gap-2">
                  <span className="text-[9px] text-slate-600">Масштаб: {compareScalePct}%</span>
                  <input
                    type="range"
                    min={40}
                    max={200}
                    value={compareScalePct}
                    disabled={readOnly}
                    className="h-2 w-[min(100%,10rem)] accent-teal-600"
                    onChange={(e) =>
                      onPatch({
                        categorySketchCompareOverlayScalePct: Number(e.target.value),
                      })
                    }
                  />
                </div>
                <div className="flex flex-wrap items-center gap-2">
                  <span className="text-[9px] text-slate-600">Сдвиг X: {compareOffsetXPct}%</span>
                  <input
                    type="range"
                    min={-40}
                    max={40}
                    value={compareOffsetXPct}
                    disabled={readOnly}
                    className="h-2 w-[min(100%,10rem)] accent-teal-600"
                    onChange={(e) =>
                      onPatch({ categorySketchCompareOffsetXPct: Number(e.target.value) })
                    }
                  />
                </div>
                <div className="flex flex-wrap items-center gap-2">
                  <span className="text-[9px] text-slate-600">Сдвиг Y: {compareOffsetYPct}%</span>
                  <input
                    type="range"
                    min={-40}
                    max={40}
                    value={compareOffsetYPct}
                    disabled={readOnly}
                    className="h-2 w-[min(100%,10rem)] accent-teal-600"
                    onChange={(e) =>
                      onPatch({ categorySketchCompareOffsetYPct: Number(e.target.value) })
                    }
                  />
                </div>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="h-7 text-xs text-slate-600"
                  disabled={readOnly}
                  onClick={clearCompareOverlay}
                >
                  Убрать наложение
                </Button>
              </div>
            ) : null}
            {compareOverlayFileName ? (
              <p className="truncate text-[9px] text-slate-500" title={compareOverlayFileName}>
                {compareOverlayFileName}
              </p>
            ) : null}
          </div>
        ) : null}
        {imageFileName || imageDataUrl ? (
          <div className="flex flex-wrap items-center gap-2 border-t border-slate-200/80 pt-2">
            <span className="truncate text-xs text-slate-600" title={imageFileName ?? ''}>
              {imageFileName?.trim()
                ? imageFileName
                : imageDataUrl
                  ? 'Своя подложка (без имени файла)'
                  : ''}
              {!imageDataUrl && imageFileName ? ' · файл не сохранён (слишком большой)' : ''}
            </span>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              className="h-7 text-xs text-red-600"
              onClick={clearImage}
            >
              {sheetStorage ? 'Убрать подложку' : 'Убрать фото (пустая доска)'}
            </Button>
          </div>
        ) : null}
      </div>
    </details>
  );
}
