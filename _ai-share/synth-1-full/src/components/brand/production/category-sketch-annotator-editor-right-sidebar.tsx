'use client';

import type { ReactNode } from 'react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import type { Workshop2Phase1CategorySketchAnnotation } from '@/lib/production/workshop2-dossier-phase1.types';

export type CategorySketchAnnotatorEditorRightSidebarProps = {
  nextIncompletePinId: string | null;
  onJumpToNextIncompletePin: () => void;
  readOnly: boolean;
  activeAnn: Workshop2Phase1CategorySketchAnnotation | null;
  onAutoFixActivePin: () => void;
  revisionDiffOnlyMode: boolean;
  revisionDiffOverlayOn: boolean;
  pinsOnLeaf: Workshop2Phase1CategorySketchAnnotation[];
  revisionDiffChangedIdSet: ReadonlySet<string>;
  visibleIds: ReadonlySet<string>;
  onSelectPin: (annotationId: string) => void;
  children: ReactNode;
};

export function CategorySketchAnnotatorEditorRightSidebar({
  nextIncompletePinId,
  onJumpToNextIncompletePin,
  readOnly,
  activeAnn,
  onAutoFixActivePin,
  revisionDiffOnlyMode,
  revisionDiffOverlayOn,
  pinsOnLeaf,
  revisionDiffChangedIdSet,
  visibleIds,
  onSelectPin,
  children,
}: CategorySketchAnnotatorEditorRightSidebarProps) {
  return (
    <div className="flex min-w-0 flex-col gap-2 border-l border-zinc-200 pl-3 lg:sticky lg:top-4 lg:max-h-[calc(100dvh-5rem)] lg:self-start lg:overflow-y-auto lg:pl-4">
      <div className="flex flex-wrap items-center gap-2">
        <p className="text-xs font-semibold uppercase tracking-wide text-zinc-600">Выбор метки</p>
        <Button
          type="button"
          size="sm"
          variant="outline"
          className="h-6 px-2 text-[10px]"
          disabled={!nextIncompletePinId}
          onClick={onJumpToNextIncompletePin}
        >
          Следующий незаполненный
        </Button>
        <Button
          type="button"
          size="sm"
          variant="secondary"
          className="h-6 px-2 text-[10px]"
          disabled={!activeAnn || readOnly}
          onClick={onAutoFixActivePin}
        >
          Авто-фикс
        </Button>
        {revisionDiffOnlyMode && revisionDiffOverlayOn ? (
          <span className="text-[10px] text-violet-700">Показаны только изменённые пины</span>
        ) : null}
      </div>
      <div className="flex flex-wrap gap-1">
        {(revisionDiffOnlyMode && revisionDiffOverlayOn
          ? pinsOnLeaf.filter((p) => revisionDiffChangedIdSet.has(p.annotationId))
          : pinsOnLeaf
        ).map((p, idx) => {
          const inFilter = visibleIds.has(p.annotationId);
          return (
            <button
              key={p.annotationId}
              type="button"
              className={cn(
                'flex h-9 min-w-9 items-center justify-center rounded-md border font-mono text-sm font-bold tabular-nums transition-colors',
                activeAnn?.annotationId === p.annotationId
                  ? 'border-zinc-900 bg-zinc-900 text-white'
                  : 'border-zinc-300 bg-white text-zinc-900 hover:bg-zinc-50',
                p.priority === 'critical' &&
                  activeAnn?.annotationId !== p.annotationId &&
                  'border-rose-500',
                p.stage === 'qc' &&
                  p.priority !== 'critical' &&
                  activeAnn?.annotationId !== p.annotationId &&
                  'border-amber-500',
                !inFilter &&
                  activeAnn?.annotationId !== p.annotationId &&
                  'border-dashed opacity-45'
              )}
              onClick={() => onSelectPin(p.annotationId)}
            >
              {idx + 1}
            </button>
          );
        })}
      </div>
      {children}
    </div>
  );
}
