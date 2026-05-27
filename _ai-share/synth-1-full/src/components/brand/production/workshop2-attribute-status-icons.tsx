'use client';

import * as LucideIcons from 'lucide-react';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { cn } from '@/lib/utils';

const iconBtn =
  'inline-flex h-6 w-6 shrink-0 items-center justify-center rounded-md border transition-colors';

/** Иконки статуса поля ТЗ (обязательность, матрица, скетч) — подписи в tooltip при наведении. */
export function Workshop2AttributeStatusIcons({
  showRequired,
  isMissingRequired,
  linkedToMatrix,
  linkedOnSketch,
  className,
}: {
  showRequired?: boolean;
  isMissingRequired?: boolean;
  linkedToMatrix?: boolean;
  linkedOnSketch?: boolean;
  className?: string;
}) {
  if (!showRequired && !linkedToMatrix && !linkedOnSketch) return null;

  return (
    <span className={cn('inline-flex shrink-0 items-center gap-0.5', className)}>
      {showRequired ? (
        <Tooltip>
          <TooltipTrigger asChild>
            <span
              className={cn(
                iconBtn,
                isMissingRequired
                  ? 'border-red-200 bg-red-50 text-red-700'
                  : 'border-emerald-200 bg-emerald-50 text-emerald-800'
              )}
              aria-label={
                isMissingRequired ? 'Заполните обязательное поле' : 'Обязательное поле заполнено'
              }
            >
              {isMissingRequired ? (
                <LucideIcons.CircleAlert className="h-3.5 w-3.5" aria-hidden />
              ) : (
                <LucideIcons.CircleCheck className="h-3.5 w-3.5" aria-hidden />
              )}
            </span>
          </TooltipTrigger>
          <TooltipContent side="top" className="max-w-[260px] text-xs">
            {isMissingRequired
              ? 'Обязательное для фазы 1 — укажите значение из справочника или свой текст.'
              : 'Обязательное поле заполнено для текущей фазы ТЗ.'}
          </TooltipContent>
        </Tooltip>
      ) : null}
      {linkedToMatrix ? (
        <Tooltip>
          <TooltipTrigger asChild>
            <span
              className={cn(iconBtn, 'border-violet-200 bg-violet-50/90 text-violet-800')}
              aria-label="Связано с матрицей info-pick"
            >
              <LucideIcons.Grid3x3 className="h-3.5 w-3.5" aria-hidden />
            </span>
          </TooltipTrigger>
          <TooltipContent side="top" className="max-w-[280px] text-xs">
            Атрибут связан с матрицей info-pick / project-info — изменения влияют на общий
            справочник бренда.
          </TooltipContent>
        </Tooltip>
      ) : null}
      {linkedOnSketch ? (
        <Tooltip>
          <TooltipTrigger asChild>
            <span
              className={cn(iconBtn, 'border-teal-200 bg-teal-50 text-teal-800')}
              aria-label="Есть метка на скетче"
            >
              <LucideIcons.MapPin className="h-3.5 w-3.5" aria-hidden />
            </span>
          </TooltipTrigger>
          <TooltipContent side="top" className="max-w-[240px] text-xs">
            К атрибуту привязана метка на общем скетче или скетч-листе.
          </TooltipContent>
        </Tooltip>
      ) : null}
    </span>
  );
}
