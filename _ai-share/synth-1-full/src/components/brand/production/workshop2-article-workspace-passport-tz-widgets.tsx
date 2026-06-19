'use client';

import { useEffect, useState, type ReactNode } from 'react';
import * as LucideIcons from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import {
  W2_PASSPORT_TZ_STAGE_DEFS,
  W2_PASSPORT_TZ_STAGE_ORDER,
} from '@/components/brand/production/workshop2-article-workspace-ui-constants';
import type {
  Workshop2TzSignatoryExtraRow,
  Workshop2TzSignoffStageId,
} from '@/lib/production/workshop2-dossier-phase1.types';
import {
  workshopTzAssigneeOrganizationName,
  workshopTzLabelsMatch,
  workshopTzSelectedStageIds,
} from '@/lib/production/workshop2-tz-signatory-options';
import { cn } from '@/lib/utils';

export function W2PassportTzStagesPick({
  idPrefix,
  selectedIds,
  disabledIds = [],
  onChange,
}: {
  idPrefix: string;
  selectedIds: Workshop2TzSignoffStageId[];
  disabledIds?: Workshop2TzSignoffStageId[];
  onChange: (ids: Workshop2TzSignoffStageId[]) => void;
}) {
  const [open, setOpen] = useState(false);
  const sel = new Set(selectedIds);
  const disabled = new Set(disabledIds);
  const selectionTitle =
    selectedIds.length === 0
      ? 'Не выбран ни один этап'
      : W2_PASSPORT_TZ_STAGE_DEFS.filter((d) => sel.has(d.id))
          .map((d) => d.label)
          .join(', ');
  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <button
          type="button"
          title={selectionTitle}
          aria-expanded={open}
          aria-haspopup="dialog"
          className="text-text-primary hover:bg-bg-surface2 flex h-8 w-[5.5rem] shrink-0 cursor-pointer items-center justify-center gap-0.5 rounded-md border border-input bg-background px-1 text-[10px] font-medium transition-colors"
        >
          <LucideIcons.ListFilter className="h-3 w-3 shrink-0 opacity-70" aria-hidden />
          <span className="shrink-0">Этапы</span>
        </button>
      </PopoverTrigger>
      <PopoverContent align="end" className="w-[11rem] p-2.5" sideOffset={6}>
        <p className="text-text-secondary mb-2 text-[9px] font-semibold">Этапы маршрута</p>
        <p className="text-text-secondary mb-2 text-[9px] leading-snug">
          Снимите галочку — роль не участвует на этапе; включите снова, когда нужно.
        </p>
        <div className="max-h-[14rem] space-y-0.5 overflow-y-auto pr-0.5">
          {W2_PASSPORT_TZ_STAGE_DEFS.map(({ id, label }) => {
            const isDisabled = disabled.has(id);
            return (
              <label
                key={id}
                className={cn(
                  'text-text-primary hover:bg-bg-surface2 flex items-center gap-2 rounded py-1 pl-0.5 pr-1 text-[10px]',
                  isDisabled ? 'cursor-not-allowed opacity-50' : 'cursor-pointer'
                )}
                title={isDisabled ? 'Этот этап обязателен для данной роли' : undefined}
              >
                <input
                  id={`${idPrefix}-${id}`}
                  type="checkbox"
                  className={cn(
                    'border-border-default h-3 w-3 shrink-0 rounded',
                    isDisabled ? 'cursor-not-allowed' : 'cursor-pointer'
                  )}
                  checked={sel.has(id) || isDisabled}
                  disabled={isDisabled}
                  onChange={(e) => {
                    if (isDisabled) return;
                    const next = new Set(selectedIds);
                    if (e.target.checked) next.add(id);
                    else next.delete(id);
                    onChange(W2_PASSPORT_TZ_STAGE_ORDER.filter((sid) => next.has(sid)));
                  }}
                />
                <span>{label}</span>
              </label>
            );
          })}
        </div>
      </PopoverContent>
    </Popover>
  );
}

export function PassportTzExtraAssigneeCard({
  ex,
  signatorySelectChildren,
  articleCardOwnerName,
  onPatchTitle,
  onPatchAssignee,
  onStagesChange,
  onRemove,
  toggleCardAdminForAssignee,
  canRemoveRow,
}: {
  ex: Workshop2TzSignatoryExtraRow;
  signatorySelectChildren: ReactNode;
  articleCardOwnerName: string;
  onPatchTitle: (title: string) => void;
  onPatchAssignee: (value: string) => void;
  onStagesChange: (ids: Workshop2TzSignoffStageId[]) => void;
  onRemove: () => void;
  toggleCardAdminForAssignee: (name: string | undefined, on: boolean) => void;
  /** Крестик «удалить роль»: только админ карточки и не строка, где этот человек отмечен как админ. */
  canRemoveRow: boolean;
}) {
  const [editingTitle, setEditingTitle] = useState(() => ex.roleTitle.trim() === 'Роль');
  const titleInputId = `w2-passport-tz-extra-title-${ex.rowId}`;
  const trimmedTitle = ex.roleTitle?.trim() ?? '';
  const exAssignee = ex.assigneeDisplayLabel?.trim() ?? '';
  const adminName = articleCardOwnerName.trim();
  const adminOn = Boolean(exAssignee && adminName && workshopTzLabelsMatch(exAssignee, adminName));

  useEffect(() => {
    if (!editingTitle) return;
    const el = document.getElementById(titleInputId) as HTMLInputElement | null;
    if (el) {
      el.focus();
      el.select();
    }
  }, [editingTitle, titleInputId]);

  return (
    <div className="border-border-subtle bg-bg-surface2/80 rounded-md border p-1.5">
      <div className="mb-1 flex min-w-0 items-center gap-1">
        {editingTitle ? (
          <Input
            id={titleInputId}
            className="h-8 min-w-0 flex-1 px-1.5 text-[11px]"
            value={ex.roleTitle}
            onChange={(e) => onPatchTitle(e.target.value)}
            onBlur={() => setEditingTitle(false)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') (e.target as HTMLInputElement).blur();
            }}
            placeholder="Название роли"
            aria-label="Название роли"
          />
        ) : (
          <button
            type="button"
            className="text-text-secondary hover:bg-bg-surface2 hover:text-text-primary min-h-[1rem] min-w-0 flex-1 truncate rounded px-0.5 py-0 text-left text-[9px] font-semibold leading-tight"
            onClick={() => setEditingTitle(true)}
            aria-label="Редактировать название роли"
          >
            {trimmedTitle || 'Название роли'}
          </button>
        )}
        {canRemoveRow ? (
          <button
            type="button"
            className="inline-flex h-4 w-4 shrink-0 items-center justify-center rounded text-red-500 transition hover:bg-red-50 hover:text-red-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-300"
            onClick={onRemove}
            aria-label="Удалить роль"
          >
            <LucideIcons.X className="h-2 w-2" strokeWidth={2.75} aria-hidden />
          </button>
        ) : (
          <span className="inline-block h-4 w-4 shrink-0" aria-hidden />
        )}
      </div>
      <div className="flex min-w-0 flex-wrap items-center gap-1.5 sm:flex-nowrap">
        <select
          className="h-8 min-w-0 flex-1 basis-full rounded-md border border-input bg-background px-1.5 text-[11px] sm:min-w-[7rem] sm:basis-auto"
          value={ex.assigneeDisplayLabel ?? ''}
          onChange={(e) => onPatchAssignee(e.target.value)}
          aria-label={`Ответственный: ${trimmedTitle || 'роль'}`}
        >
          {signatorySelectChildren}
        </select>
        <W2PassportTzStagesPick
          idPrefix={ex.rowId}
          selectedIds={workshopTzSelectedStageIds(ex.signStages, W2_PASSPORT_TZ_STAGE_ORDER)}
          onChange={onStagesChange}
        />
        <button
          type="button"
          disabled={!exAssignee}
          title="Администратор модели карточки SKU: один на артикул, можно снять"
          aria-pressed={adminOn}
          className={cn(
            'shrink-0 whitespace-nowrap rounded border px-1 py-0.5 text-[8px] font-semibold transition',
            !exAssignee && 'cursor-not-allowed opacity-35',
            adminOn
              ? 'border-accent-primary/40 bg-accent-primary/15 text-accent-primary'
              : 'border-border-default text-text-secondary hover:bg-bg-surface2 bg-white'
          )}
          onClick={() => toggleCardAdminForAssignee(exAssignee || undefined, !adminOn)}
        >
          Админ
        </button>
      </div>
      {exAssignee ? (
        <p
          className="text-text-muted pl-0.5 text-[9px] leading-tight"
          title="Организация в справочнике"
        >
          {workshopTzAssigneeOrganizationName(exAssignee) || '—'}
        </p>
      ) : null}
    </div>
  );
}
