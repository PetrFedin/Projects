'use client';

import { Checkbox } from '@/components/ui/checkbox';
import type { Workshop2AttrComment } from '@/components/brand/production/workshop2-phase1-dossier-panel-attr-comments-dialog';

/** Единый переключатель «Позже (лок.)» + опциональный комментарий для полей брифа и блоков. */
export function Workshop2Phase1DeferLaterToggle({
  fieldKey,
  checked,
  disabled,
  onToggle,
  onOpenComments,
  commentCount = 0,
  showComments = true,
}: {
  fieldKey: string;
  checked: boolean;
  disabled?: boolean;
  onToggle: (fieldKey: string) => void;
  onOpenComments?: (fieldKey: string) => void;
  commentCount?: number;
  showComments?: boolean;
}) {
  return (
    <div className="flex shrink-0 items-center gap-1 pl-1">
      <label
        className="text-text-muted hover:text-text-primary flex cursor-pointer items-center gap-1.5 whitespace-nowrap text-[10px] font-semibold"
        title="Отложенное заполнение сохраняется в досье (для команды бренда на шаге 1 ТЗ)"
      >
        <Checkbox
          checked={checked}
          disabled={disabled}
          onCheckedChange={() => onToggle(fieldKey)}
          className="border-border-default h-3.5 w-3.5 shrink-0"
          aria-label={
            checked ? 'Снять отложенное заполнение' : 'Заполнить позже (только для бренда)'
          }
        />
        <span className="hidden sm:inline">Позже (лок.)</span>
      </label>
      {showComments && onOpenComments ? (
        <button
          type="button"
          className="text-text-muted hover:text-text-primary flex h-8 items-center px-1.5 text-[10px] font-semibold"
          onClick={() => onOpenComments(fieldKey)}
        >
          Комментарий
          {commentCount > 0 ? (
            <span className="ml-1 inline-flex min-w-4 items-center justify-center rounded-full bg-amber-100 px-1 text-[9px] font-bold text-amber-700">
              {commentCount}
            </span>
          ) : null}
        </button>
      ) : null}
    </div>
  );
}

export type { Workshop2AttrComment };
