'use client';

import { Factory, Link2, Pencil } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

export type SketchViewModeToggleProps = {
  floor: boolean;
  onFloorChange: (floor: boolean) => void;
  /** Роль производства/поставщика: только цех, без переключения в ТЗ. */
  lockedToFloor?: boolean;
  /** Копирует URL с ?sketchFloor=1 (родитель показывает toast). */
  onCopyFloorLink?: () => void;
  className?: string;
};

/** Переключение edit vs floor для CategorySketchAnnotator (досье воркшопа). */
export function SketchViewModeToggle({
  floor,
  onFloorChange,
  lockedToFloor = false,
  onCopyFloorLink,
  className,
}: SketchViewModeToggleProps) {
  if (lockedToFloor) {
    return (
      <div
        className={cn(
          'inline-flex flex-wrap items-center gap-1.5 rounded-md border border-teal-200 bg-teal-50/90 px-1.5 py-0.5 text-[9px] text-teal-950 shadow-sm',
          className
        )}
        role="status"
      >
        <Factory className="h-3 w-3 shrink-0" aria-hidden />
        <span className="font-bold uppercase tracking-wide">Только цех</span>
        <span className="max-w-[14rem] text-[8px] font-normal leading-tight text-teal-900/90">
          Редактирование меток недоступно для вашей роли.
        </span>
        {onCopyFloorLink ? (
          <Button
            type="button"
            variant="outline"
            size="sm"
            className="h-6 gap-0.5 border-teal-300 bg-white px-1.5 text-[9px] text-teal-900"
            onClick={onCopyFloorLink}
          >
            <Link2 className="h-3 w-3 shrink-0" aria-hidden />
            Ссылка цеха
          </Button>
        ) : null}
      </div>
    );
  }

  return (
    <div
      className={cn(
        'border-border-default/90 inline-flex flex-wrap items-center gap-1 rounded-md border bg-white px-0.5 py-0.5 shadow-sm',
        className
      )}
    >
      <span className="text-text-secondary shrink-0 pl-1 text-[10px] font-medium">Режим</span>
      <div
        className="bg-bg-surface2 flex rounded p-px"
        role="group"
        aria-label="Режим работы со скетчем"
      >
        <button
          type="button"
          className={cn(
            'inline-flex h-6 items-center gap-1 rounded-sm px-2 text-[10px] font-semibold transition-colors',
            !floor
<<<<<<< HEAD
              ? 'bg-white text-slate-900 shadow-sm'
              : 'text-slate-600 hover:bg-slate-200/60 hover:text-slate-900'
=======
              ? 'text-text-primary bg-white shadow-sm'
              : 'text-text-secondary hover:bg-bg-surface2/60 hover:text-text-primary'
>>>>>>> recover/cabinet-wip-from-stash
          )}
          aria-pressed={!floor}
          title="Редактирование меток, шаблоны, снимки"
          onClick={() => onFloorChange(false)}
        >
          <Pencil className="h-3 w-3 shrink-0" aria-hidden />
          ТЗ
        </button>
        <button
          type="button"
          className={cn(
            'inline-flex h-6 items-center gap-1 rounded-sm px-2 text-[10px] font-semibold transition-colors',
            floor
<<<<<<< HEAD
              ? 'bg-white text-slate-900 shadow-sm'
              : 'text-slate-600 hover:bg-slate-200/60 hover:text-slate-900'
=======
              ? 'text-text-primary bg-white shadow-sm'
              : 'text-text-secondary hover:bg-bg-surface2/60 hover:text-text-primary'
>>>>>>> recover/cabinet-wip-from-stash
          )}
          aria-pressed={floor}
          title="Только просмотр и экспорт; в ссылке будет ?sketchFloor=1"
          onClick={() => onFloorChange(true)}
        >
          <Factory className="h-3 w-3 shrink-0" aria-hidden />
          Цех
        </button>
      </div>
      {onCopyFloorLink ? (
        <Button
          type="button"
          variant="outline"
          size="sm"
          className="border-border-default text-text-primary h-6 gap-1 bg-white px-2 text-[10px] font-medium shadow-none"
          title="Скопировать адрес страницы с режимом цеха (?sketchFloor=1)"
          onClick={onCopyFloorLink}
        >
          <Link2 className="h-3 w-3 shrink-0" aria-hidden />
          Ссылка цеха
        </Button>
      ) : null}
    </div>
  );
}
