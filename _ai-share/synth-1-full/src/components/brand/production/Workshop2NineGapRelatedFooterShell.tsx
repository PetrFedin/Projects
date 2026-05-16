'use client';

import { type ReactNode } from 'react';
import { Button } from '@/components/ui/button';

type Props = {
  children: ReactNode;
  matSketchBomGapRefs: readonly string[];
  onJumpMaterialHub: () => void;
  onJumpSketch: () => void;
  /** Якорь таблицы mat (`w2-material-mat`). */
  onJumpMaterialMatTable?: () => void;
  onJumpConstructionContour?: () => void;
  onJumpQcRoute?: () => void;
  hint?: string;
};

/** Футер стрипа «до 9»: ряд переходов, короткая подсказка, при разрыве BOM↔скетч — предупреждение и кнопки. */
export function Workshop2NineGapRelatedFooterShell({
  children,
  matSketchBomGapRefs,
  onJumpMaterialHub,
  onJumpSketch,
  onJumpMaterialMatTable,
  onJumpConstructionContour,
  onJumpQcRoute,
  hint,
}: Props) {
  const gapCount = matSketchBomGapRefs.length;
  const preview = matSketchBomGapRefs.slice(0, 4).join(', ');
  const more = gapCount > 4 ? '…' : '';
  return (
    <div className="space-y-2">
      <div className="flex flex-wrap gap-1.5">{children}</div>
      {hint ? <p className="text-text-secondary text-[9px] leading-snug">{hint}</p> : null}
      {gapCount > 0 ? (
        <div className="space-y-1.5 rounded-md border border-amber-300/80 bg-amber-50/65 px-2 py-1.5">
          <p className="text-[9px] font-bold uppercase tracking-wide text-amber-950">
            Разрыв BOM ↔ скетч
          </p>
          <div className="flex flex-wrap gap-1.5">
            <Button
              type="button"
              variant="outline"
              size="sm"
              className="h-7 border-amber-400/90 bg-white text-[10px] text-amber-950 hover:bg-amber-50"
              onClick={onJumpMaterialHub}
            >
              К хабу материалов
            </Button>
            {onJumpMaterialMatTable ? (
              <Button
                type="button"
                variant="outline"
                size="sm"
                className="h-7 border-amber-400/90 bg-white text-[10px] text-amber-950 hover:bg-amber-50"
                onClick={onJumpMaterialMatTable}
              >
                К таблице mat
              </Button>
            ) : null}
            <Button
              type="button"
              variant="outline"
              size="sm"
              className="h-7 border-amber-400/90 bg-white text-[10px] text-amber-950 hover:bg-amber-50"
              onClick={onJumpSketch}
            >
              К скетчу · lineRef
            </Button>
            {onJumpConstructionContour ? (
              <Button
                type="button"
                variant="outline"
                size="sm"
                className="h-7 border-amber-400/90 bg-white text-[10px] text-amber-950 hover:bg-amber-50"
                onClick={onJumpConstructionContour}
              >
                Конструкция · контур
              </Button>
            ) : null}
            {onJumpQcRoute ? (
              <Button
                type="button"
                variant="outline"
                size="sm"
                className="h-7 border-amber-400/90 bg-white text-[10px] text-amber-950 hover:bg-amber-50"
                onClick={onJumpQcRoute}
              >
                ОТК · вкладка
              </Button>
            ) : null}
          </div>
          <p className="text-[9px] leading-snug text-amber-950/95">
            <span className="font-semibold tabular-nums">{gapCount}</span> ref с меток или скетча не
            найдены в строках mat: <span className="break-all font-mono text-[8px]">{preview}</span>
            {more}
          </p>
        </div>
      ) : null}
    </div>
  );
}
