'use client';

import { CheckCircle2, Circle } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';
import type {
  Workshop2DossierSignoffMeta,
  Workshop2SketchSheetViewKind,
} from '@/lib/production/workshop2-dossier-phase1.types';
import { SKETCH_SHEET_VIEW_LABELS } from '@/lib/production/workshop2-sketch-sheets';
import type { CategorySketchAnnotatorSheetStorage } from '@/components/brand/production/category-sketch-annotator-types';

export type CategorySketchOnboardState = {
  s1: boolean;
  s2: boolean;
  s3: boolean;
  s4: boolean;
  done: boolean;
};

export type CategorySketchAnnotatorEditorBoardChromeProps = {
  sheetStorage?: CategorySketchAnnotatorSheetStorage;
  isFloorMode: boolean;
  readOnly: boolean;
  onboard: CategorySketchOnboardState;
  persistOnboard: (next: CategorySketchOnboardState) => void;
  articleSku?: string;
  showPassportSectionHeader: boolean;
  categorySketchProductionApproved?: Workshop2DossierSignoffMeta;
  categorySketchFreezeUntilDate?: string;
  boardSketchStatus: { label: string; detail: string };
  countersTotal: number;
  countersCritical: number;
  annotationLimit: number;
  sceneId?: string;
  sceneView?: Workshop2SketchSheetViewKind;
  onSceneIdChange: (next: string | undefined) => void;
  onSceneViewChange: (next: Workshop2SketchSheetViewKind | undefined) => void;
};

export function CategorySketchAnnotatorEditorBoardChrome({
  sheetStorage,
  isFloorMode,
  readOnly,
  onboard,
  persistOnboard,
  articleSku,
  showPassportSectionHeader,
  categorySketchProductionApproved,
  categorySketchFreezeUntilDate,
  boardSketchStatus,
  countersTotal,
  countersCritical,
  annotationLimit,
  sceneId,
  sceneView,
  onSceneIdChange,
  onSceneViewChange,
}: CategorySketchAnnotatorEditorBoardChromeProps) {
  return (
    <>
      {!sheetStorage && !isFloorMode ? (
        <details className="rounded-lg border border-slate-200 bg-slate-50/60 text-sm text-slate-700">
          <summary className="cursor-pointer list-none px-3 py-2 font-medium text-slate-800 [&::-webkit-details-marker]:hidden">
            Справка по меткам (цвет ≠ тип узла, ветка каталога)
          </summary>
          <div className="space-y-3 border-t border-slate-200 p-3">
            {!readOnly && !onboard.done ? (
              <div>
                <p className="mb-1.5 text-xs font-semibold uppercase tracking-wide text-slate-500">
                  Чеклист первого прохода
                </p>
                <ul className="space-y-1">
                  {(
                    [
                      { ok: onboard.s1, label: 'Выбран цвет группы (критично / ОТК / остальное)' },
                      { ok: onboard.s2, label: 'Нажато «+ на доске»' },
                      { ok: onboard.s3, label: 'Клик по картинке поставил точку' },
                      { ok: onboard.s4, label: 'Справа вписан текст метки' },
                    ] as const
                  ).map((row) => (
                    <li key={row.label} className="flex items-start gap-2">
                      {row.ok ? (
                        <CheckCircle2
                          className="mt-0.5 size-3.5 shrink-0 text-emerald-600"
                          aria-hidden
                        />
                      ) : (
                        <Circle className="mt-0.5 size-3.5 shrink-0 text-slate-400" aria-hidden />
                      )}
                      <span>{row.label}</span>
                    </li>
                  ))}
                </ul>
                <button
                  type="button"
                  className="mt-2 text-xs font-medium text-sky-800 underline"
                  onClick={() => persistOnboard({ ...onboard, done: true })}
                >
                  Скрыть чеклист
                </button>
              </div>
            ) : !readOnly ? (
              <p className="text-xs text-slate-600">
                <span className="font-medium text-slate-800">Порядок:</span> группа важности → «+ на
                доске» → клик по подложке → карточка метки справа.{' '}
                <kbd className="rounded border border-slate-200 bg-white px-1 py-0.5 font-mono text-[9px]">
                  Esc
                </kbd>{' '}
                — выйти из режима клика.
              </p>
            ) : null}
            <ul className="list-disc space-y-1.5 pl-4 text-xs leading-snug">
              <li>
                <span className="font-medium text-slate-900">Цвет кружка</span> — срочность и
                аудитория проверки (критично / ОТК / прочее). Отдельно от поля «тип узла» в блоке
                новой метки.
              </li>
              <li>
                <span className="font-medium text-slate-900">Тип, этап, задача ветки</span> — что
                отмечаем, когда проверяем и к какому блоку L1–L3 привязать формулировку (вкладка
                ветки в досье).
              </li>
            </ul>
          </div>
        </details>
      ) : null}
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-zinc-200 pb-1.5">
        <div className="flex min-w-0 flex-1 flex-wrap items-center gap-2">
          {articleSku?.trim() ? (
            <span className="rounded-md border border-zinc-200 bg-zinc-50 px-2 py-0.5 font-mono text-xs font-semibold text-zinc-900">
              {articleSku.trim()}
            </span>
          ) : null}
          {showPassportSectionHeader ? (
            <span className="text-xs font-medium text-zinc-500">
              {sheetStorage ? 'Лист скетча' : 'Основная доска'}
            </span>
          ) : null}
        </div>
        <div className="flex flex-wrap items-center justify-end gap-1.5">
          <span
            className={cn(
              'rounded-md border px-2 py-0.5 text-xs font-medium',
              categorySketchProductionApproved
                ? 'border-emerald-200 bg-emerald-50 text-emerald-900'
                : categorySketchFreezeUntilDate?.trim()
                  ? 'border-amber-200 bg-amber-50 text-amber-950'
                  : 'border-zinc-200 bg-white text-zinc-600'
            )}
            title={boardSketchStatus.detail}
          >
            {boardSketchStatus.label}
          </span>
          <span className="text-xs tabular-nums text-zinc-500">
            {countersTotal}/{annotationLimit}
            {countersCritical > 0 ? (
              <span className="text-rose-600"> · {countersCritical} крит.</span>
            ) : null}
          </span>
        </div>
      </div>

      {!sheetStorage ? (
        <details className="rounded-lg border border-zinc-200 bg-white text-xs">
          <summary className="cursor-pointer list-none px-3 py-2 font-medium text-zinc-700 [&::-webkit-details-marker]:hidden">
            ID сцены и вид листа (PLM, по желанию)
          </summary>
          <div className="flex flex-wrap items-end gap-3 border-t border-zinc-100 p-3">
            <label className="min-w-40 flex-1 space-y-0.5">
              <span className="text-[9px] font-semibold uppercase text-zinc-500">ID сцены</span>
              <Input
                className="h-8 text-sm"
                placeholder="один id на виды"
                value={sceneId ?? ''}
                disabled={readOnly}
                onChange={(e) => onSceneIdChange(e.target.value.trim() || undefined)}
              />
            </label>
            <label className="min-w-40 space-y-0.5">
              <span className="text-[9px] font-semibold uppercase text-zinc-500">Вид</span>
              <select
                className="h-8 w-full rounded-md border border-zinc-200 bg-white px-2 text-sm"
                value={sceneView ?? ''}
                disabled={readOnly}
                onChange={(e) => {
                  const v = e.target.value;
                  onSceneViewChange(v ? (v as Workshop2SketchSheetViewKind) : undefined);
                }}
              >
                <option value="">—</option>
                {Object.entries(SKETCH_SHEET_VIEW_LABELS).map(([k, lab]) => (
                  <option key={k} value={k}>
                    {lab}
                  </option>
                ))}
              </select>
            </label>
          </div>
        </details>
      ) : null}
    </>
  );
}
