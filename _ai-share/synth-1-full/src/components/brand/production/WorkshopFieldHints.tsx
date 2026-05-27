'use client';

import type { ReactNode } from 'react';
import * as LucideIcons from 'lucide-react';
import { Label } from '@/components/ui/label';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { cn } from '@/lib/utils';
import type { AttributeCatalogAttribute } from '@/lib/production/attribute-catalog.types';

export const WORKSHOP_FIELD_LABEL_CLASS = 'text-sm font-semibold text-text-primary';

const WORKSHOP_HINT_TOOLTIP_CLASS =
  'max-w-[min(22rem,calc(100vw-2rem))] space-y-1.5 border border-border-default bg-white px-3 py-2 text-left text-[11px] leading-snug text-text-primary shadow-md';

/** Подпись поля + иконка «i» с подсказкой (наведение). */
export function WorkshopLabelWithHint({
  htmlFor,
  children,
  hint,
  labelClassName,
}: {
  htmlFor?: string;
  children: ReactNode;
  hint: ReactNode;
  labelClassName?: string;
}) {
  const labelCls = cn(WORKSHOP_FIELD_LABEL_CLASS, labelClassName);
  return (
    <div className="flex items-center gap-1">
      {htmlFor ? (
        <Label htmlFor={htmlFor} className={labelCls}>
          {children}
        </Label>
      ) : (
        <span className={labelCls}>{children}</span>
      )}
      <Tooltip>
        <TooltipTrigger asChild>
          <button
            type="button"
            className="text-text-muted hover:bg-bg-surface2 hover:text-text-secondary focus-visible:ring-accent-primary inline-flex h-5 w-5 shrink-0 items-center justify-center rounded-full transition focus-visible:outline-none focus-visible:ring-2"
            aria-label="Справка по полю"
          >
            <LucideIcons.Info className="h-3 w-3" strokeWidth={2} aria-hidden />
          </button>
        </TooltipTrigger>
        <TooltipContent side="top" className={WORKSHOP_HINT_TOOLTIP_CLASS}>
          {hint}
        </TooltipContent>
      </Tooltip>
    </div>
  );
}

function attributeDetailHintBody(attribute: AttributeCatalogAttribute): ReactNode {
  const d = attribute.descriptionHint?.trim();
  const u = attribute.uiInformationHint?.trim();
  if (!d && !u) {
    return (
      <p>
        Поле «{attribute.name}»: выберите значение из справочника или введите текст, если поле это
        допускает. Подсказку для команды можно задать в каталоге атрибутов.
      </p>
    );
  }
  return (
    <div className="space-y-1.5">
      {d ? <p>{d}</p> : null}
      {u ? <p className="text-text-secondary">{u}</p> : null}
    </div>
  );
}

/** Иконка «i» с произвольным содержимым тултипа. */
export function WorkshopInlineHintIcon({
  label,
  children,
}: {
  label: string;
  children: ReactNode;
}) {
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <button
          type="button"
          className="text-text-muted hover:bg-bg-surface2 hover:text-text-secondary focus-visible:ring-accent-primary inline-flex h-5 w-5 shrink-0 items-center justify-center rounded-full transition focus-visible:outline-none focus-visible:ring-2"
          aria-label={`Подробнее: ${label}`}
        >
          <LucideIcons.Info className="h-3 w-3" strokeWidth={2} aria-hidden />
        </button>
      </TooltipTrigger>
      <TooltipContent side="top" className={WORKSHOP_HINT_TOOLTIP_CLASS}>
        {children}
      </TooltipContent>
    </Tooltip>
  );
}

export function WorkshopAttributeHintIcon({ attribute }: { attribute: AttributeCatalogAttribute }) {
  return (
    <WorkshopInlineHintIcon label={attribute.name}>
      {attributeDetailHintBody(attribute)}
    </WorkshopInlineHintIcon>
  );
}
