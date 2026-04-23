'use client';

import * as LucideIcons from 'lucide-react';
import { Button } from '@/components/ui/button';

type Props = {
  onOpenSketch: () => void;
};

/** Подсказка: редактор скетча перенесён в раздел «Конструкция». */
export function Workshop2VisualsSketchMovedHint({ onOpenSketch }: Props) {
  return (
    <div
      id="w2-visuals-sketch-moved-hint"
      className="border-accent-primary/30 bg-accent-primary/10 scroll-mt-24 rounded-xl border border-dashed p-4 shadow-sm"
    >
      <div className="flex flex-wrap items-start gap-3">
        <div className="text-accent-primary flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-white shadow-sm">
          <LucideIcons.Layers className="h-4 w-4 shrink-0" aria-hidden />
        </div>
        <div className="min-w-0 flex-1 space-y-1">
          <p className="text-text-primary text-sm font-semibold">Скетч перенесён в контур ТЗ</p>
          <p className="text-text-secondary text-xs leading-snug">
            Редактор меток и листов — в «Конструкция» → разверните «Табель мер: хаб ТЗ» и прокрутите к
            блоку скетча (тот же якорь для переходов из материалов и «до 9»).
          </p>
          <Button
            type="button"
            variant="secondary"
            size="sm"
            className="mt-1 h-8 text-[11px]"
            onClick={onOpenSketch}
          >
            Открыть конструкцию → скетч
          </Button>
        </div>
      </div>
    </div>
  );
}
