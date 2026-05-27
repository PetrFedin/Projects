'use client';

import { Button } from '@/components/ui/button';
import type { Workshop2DossierLayoutMode } from '@/lib/production/workshop2-dossier-layout-mode';

type Props = {
  mode: Workshop2DossierLayoutMode;
  onChange: (mode: Workshop2DossierLayoutMode) => void;
};

/** Переключатель full / dense макета ТЗ (w2layout). */
export function Workshop2DossierLayoutToggle({ mode, onChange }: Props) {
  return (
    <div
      className="inline-flex items-center gap-1 rounded-md border border-slate-200 bg-white p-0.5"
      role="group"
      aria-label="Плотность макета ТЗ"
    >
      <Button
        type="button"
        size="sm"
        variant={mode === 'full' ? 'default' : 'ghost'}
        className="h-7 px-2 text-[10px]"
        onClick={() => onChange('full')}
      >
        Полный
      </Button>
      <Button
        type="button"
        size="sm"
        variant={mode === 'dense' ? 'default' : 'ghost'}
        className="h-7 px-2 text-[10px]"
        onClick={() => onChange('dense')}
      >
        Dense
      </Button>
    </div>
  );
}
