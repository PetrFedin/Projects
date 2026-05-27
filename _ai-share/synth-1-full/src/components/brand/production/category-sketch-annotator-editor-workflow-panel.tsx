'use client';

import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Factory } from 'lucide-react';
import type { CategorySketchAnnotatorSheetStorage } from '@/components/brand/production/category-sketch-annotator-types';

export type CategorySketchEditorWorkflowMode = 'setup' | 'review' | 'floor';

export type CategorySketchEditorSketchHealth = {
  score: number;
  complete: number;
  incomplete: number;
  criticalOpen: number;
  noText: number;
  noBom: number;
  noOwner: number;
};

export type CategorySketchAnnotatorEditorWorkflowPanelProps = {
  qualityHints: string[];
  readOnly: boolean;
  sheetStorage?: CategorySketchAnnotatorSheetStorage;
  workflowMode: CategorySketchEditorWorkflowMode;
  onWorkflowModeChange: (mode: CategorySketchEditorWorkflowMode) => void;
  sketchHealth: CategorySketchEditorSketchHealth;
  pinsOnLeafCount: number;
  onResetMasterBoard: () => void;
};

export function CategorySketchAnnotatorEditorWorkflowPanel({
  qualityHints,
  readOnly,
  sheetStorage,
  workflowMode,
  onWorkflowModeChange,
  sketchHealth,
  pinsOnLeafCount,
  onResetMasterBoard,
}: CategorySketchAnnotatorEditorWorkflowPanelProps) {
  const isSetupMode = workflowMode === 'setup';
  const isReviewMode = workflowMode === 'review';

  return (
    <>
      {qualityHints.length > 0 ? (
        <Alert className="border-amber-200 bg-amber-50/70">
          <AlertTitle className="text-xs">Проверка перед «готово»</AlertTitle>
          <AlertDescription className="text-sm text-slate-800">
            <ul className="list-disc space-y-0.5 pl-4">
              {qualityHints.map((h) => (
                <li key={h}>{h}</li>
              ))}
            </ul>
          </AlertDescription>
        </Alert>
      ) : null}
      {readOnly ? (
        <div className="flex items-start gap-2 rounded-lg border border-teal-200 bg-teal-50/90 px-3 py-2 text-sm text-teal-950">
          <Factory className="mt-0.5 size-4 shrink-0" aria-hidden />
          <div>
            <p className="font-semibold">Режим цеха</p>
            <p className="text-teal-900/90">Просмотр и экспорт; правки меток отключены.</p>
          </div>
        </div>
      ) : null}
      <div className="rounded-lg border border-zinc-200 bg-white p-2.5">
        <div className="flex flex-wrap items-center gap-1.5">
          {(
            [
              { id: 'setup' as const, label: 'Постановка' },
              { id: 'review' as const, label: 'Проверка' },
              { id: 'floor' as const, label: 'Цех' },
            ] as const
          ).map((m) => (
            <Button
              key={m.id}
              type="button"
              size="sm"
              variant={workflowMode === m.id ? 'default' : 'outline'}
              className="h-7 text-[11px]"
              onClick={() => onWorkflowModeChange(m.id)}
              disabled={readOnly && m.id !== 'floor'}
            >
              {m.label}
            </Button>
          ))}
          <span className="ml-auto text-[11px] text-zinc-600">
            Готовность: <strong className="text-zinc-900">{sketchHealth.score}%</strong>
          </span>
        </div>
        <p className="mt-1 text-[11px] text-zinc-600">
          {isSetupMode
            ? 'Постановка: создание и привязка новых точек.'
            : isReviewMode
              ? 'Проверка: фокус на незаполненных и рисках.'
              : 'Цех: чистый просмотр и экспорт.'}
        </p>
        <div className="mt-2 grid gap-1 text-[11px] text-zinc-700 sm:grid-cols-2">
          <span>
            Полных: <strong>{sketchHealth.complete}</strong> / {pinsOnLeafCount}
          </span>
          <span>
            Критичных не закрыто:{' '}
            <strong className="text-rose-700">{sketchHealth.criticalOpen}</strong>
          </span>
          <span>Без текста: {sketchHealth.noText}</span>
          <span>Без BOM ref: {sketchHealth.noBom}</span>
        </div>
        {sketchHealth.criticalOpen > 0 || sketchHealth.noOwner > 0 ? (
          <div className="mt-2 rounded border border-amber-200 bg-amber-50 px-2 py-1.5 text-[11px] text-amber-950">
            Риски: критичные не закрыты ({sketchHealth.criticalOpen}), без ответственного (
            {sketchHealth.noOwner}).
          </div>
        ) : null}
      </div>
      {!readOnly && !sheetStorage ? (
        <div className="flex flex-wrap items-center justify-end gap-2 border-b border-slate-100 pb-2">
          <Button
            type="button"
            variant="ghost"
            size="sm"
            className="h-8 text-xs text-red-700 hover:bg-red-50 hover:text-red-900"
            title="Удаляет метки листа 1 для текущей ветки, сбрасывает фото и сравнение с эталоном. Метки других веток на этой доске не меняются."
            onClick={onResetMasterBoard}
          >
            Очистить основную доску…
          </Button>
        </div>
      ) : null}
    </>
  );
}
