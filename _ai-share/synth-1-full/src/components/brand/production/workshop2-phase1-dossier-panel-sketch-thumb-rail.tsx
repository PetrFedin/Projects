'use client';

import { defaultExtraSketchSheetTitle } from '@/lib/production/workshop2-sketch-sheets';
import { sketchPinBelongsToLeaf } from '@/lib/production/workshop2-sketch-pin-templates';
import type {
  Workshop2Phase1SketchSheet,
  Workshop2SketchBoardOrientation,
} from '@/lib/production/workshop2-dossier-phase1.types';
import { cn } from '@/lib/utils';

export const W2_SKETCH_RAIL_THUMB_MAX_H =
  'max-h-[28rem] flex-row overflow-x-auto overflow-y-hidden pb-0.5 lg:max-h-[56rem] lg:flex-col lg:overflow-y-auto lg:overflow-x-hidden lg:pb-0';

function w2SketchThumbAspectClass(o?: Workshop2SketchBoardOrientation) {
  return o === 'portrait' ? 'aspect-[3/4]' : 'aspect-[4/3]';
}

export function W2SketchThumbRail(props: {
  masterImageUrl?: string;
  masterBoardOrientation?: Workshop2SketchBoardOrientation;
  masterPins: number;
  sheets: readonly Workshop2Phase1SketchSheet[];
  activeSheetId: string | null;
  sketchSurface: 'master' | 'sheets';
  leafId: string;
  sketchEditsLocked: boolean;
  onMaster: () => void;
  onPickSheet: (id: string) => void;
}) {
  const showMasterThumb = Boolean(props.masterImageUrl?.trim());
  const hasExtraSheets = props.sheets.length > 0;
  /** Без файла на основной доске миниатюру «Лист 1» не показываем; доп. листы — с верхней границы рейла (без заглушки «Скетч артикула»). */
  if (!showMasterThumb && !hasExtraSheets) return null;

  const activeSid = props.activeSheetId ?? props.sheets[0]?.sheetId ?? null;
  return (
    <div
      className={cn(
        'flex shrink-0 gap-2 self-start lg:w-[12.5rem]',
        W2_SKETCH_RAIL_THUMB_MAX_H
      )}
      role="tablist"
      aria-label="Скетч-листы артикула"
    >
      {showMasterThumb ? (
        <button
          type="button"
          role="tab"
          aria-selected={props.sketchSurface === 'master'}
          title="Лист 1 — загруженный скетч артикула; листы 2 и далее — ниже."
          onClick={props.onMaster}
          className={cn(
            'relative w-[11.5rem] shrink-0 overflow-hidden rounded-lg border-2 text-left transition-colors lg:w-full',
            w2SketchThumbAspectClass(props.masterBoardOrientation),
            props.sketchSurface === 'master'
              ? 'border-accent-primary shadow-sm ring-1 ring-accent-primary/25'
              : 'border-border-default hover:border-border-subtle'
          )}
        >
          {/* eslint-disable-next-line @next/next/no-img-element -- data URL из досье */}
          <img
            src={props.masterImageUrl ?? ''}
            alt=""
            className="h-full w-full object-contain"
          />
          <span className="pointer-events-none absolute bottom-1 left-0.5 rounded bg-black/65 px-1 py-px text-[9px] font-bold text-white">
            Лист 1
          </span>
          {props.masterPins > 0 ? (
            <span className="absolute bottom-0.5 right-0.5 rounded bg-black/75 px-1 py-px text-[9px] font-bold tabular-nums text-white">
              {props.masterPins}
            </span>
          ) : null}
        </button>
      ) : null}
      {props.sheets.map((s, idx) => {
        const sheetPinCount = s.annotations.filter((a) =>
          sketchPinBelongsToLeaf(a, props.leafId)
        ).length;
        const selected = props.sketchSurface === 'sheets' && s.sheetId === activeSid;
        const fallbackTitle = showMasterThumb
          ? defaultExtraSketchSheetTitle(idx)
          : `Лист ${idx + 1}`;
        const thumbLabel = (s.title?.trim() || fallbackTitle).slice(0, 40);
        return (
          <button
            key={s.sheetId}
            type="button"
            role="tab"
            aria-selected={selected}
            title={thumbLabel}
            onClick={() => props.onPickSheet(s.sheetId)}
            className={cn(
              'relative w-[11.5rem] shrink-0 overflow-hidden rounded-lg border-2 text-left transition-colors lg:w-full',
              w2SketchThumbAspectClass(s.boardOrientation),
              selected
                ? 'border-accent-primary shadow-sm ring-1 ring-accent-primary/25'
                : 'border-border-default hover:border-border-subtle'
            )}
          >
            {s.imageDataUrl ? (
              // eslint-disable-next-line @next/next/no-img-element -- data URL из досье
              <img src={s.imageDataUrl} alt="" className="h-full w-full object-contain" />
            ) : (
              <div className="bg-bg-surface2/70 flex h-full w-full flex-col items-center justify-center p-0.5">
                <span className="text-text-muted line-clamp-4 text-center text-[10px] font-semibold leading-tight">
                  {thumbLabel}
                </span>
              </div>
            )}
            {sheetPinCount > 0 ? (
              <span className="absolute bottom-0.5 right-0.5 rounded bg-black/75 px-1 py-px text-[9px] font-bold tabular-nums text-white">
                {sheetPinCount}
              </span>
            ) : null}
          </button>
        );
      })}
    </div>
  );
}
