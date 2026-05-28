import * as React from 'react';
import { cn } from '@/lib/utils';
import { DataTableContainer, type DataTableContainerProps } from './data-table-container';

/** Oracle-style: таблица + заголовок блока + слоты toolbar/filters. */
export type DataPanelProps = DataTableContainerProps & {
  title?: string;
  description?: string;
};

export function DataPanel({ title, description, className, ...rest }: DataPanelProps) {
  return (
    <div className={cn('space-y-3', className)}>
      {(title || description) && (
        <div className="space-y-0.5">
          {title ? <h3 className="text-text-primary text-sm font-semibold">{title}</h3> : null}
          {description ? <p className="text-text-secondary text-xs">{description}</p> : null}
        </div>
      )}
      <DataTableContainer {...rest} />
    </div>
  );
}

export type PlanningPanelProps = {
  title?: string;
  description?: string;
  actions?: React.ReactNode;
  className?: string;
  children?: React.ReactNode;
};

/** Плотная панель планирования / бюджетов (Oracle-style). */
export function PlanningPanel({
  title,
  description,
  actions,
  className,
  children,
}: PlanningPanelProps) {
  return (
    <div
      className={cn('border-border-default rounded-xl border bg-white p-4 shadow-sm', className)}
    >
      <div className="mb-3 flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
        <div className="min-w-0 space-y-0.5">
          {title ? <h3 className="text-text-primary text-sm font-semibold">{title}</h3> : null}
          {description ? <p className="text-text-secondary text-xs">{description}</p> : null}
        </div>
        {actions ? <div className="flex shrink-0 flex-wrap gap-2">{actions}</div> : null}
      </div>
      <div className="space-y-3">{children}</div>
    </div>
  );
}

export type CommercePanelProps = PlanningPanelProps;

/** Showroom / linesheet / wholesale блок (JOOR-style — чуть воздушнее). */
export function CommercePanel({
  title,
  description,
  actions,
  className,
  children,
}: CommercePanelProps) {
  return (
    <div
      className={cn('border-border-default/90 rounded-xl border bg-white p-5 shadow-sm', className)}
    >
      <div className="mb-4 flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
        <div className="min-w-0 space-y-1">
          {title ? <h3 className="text-text-primary text-base font-semibold">{title}</h3> : null}
          {description ? <p className="text-text-secondary text-sm">{description}</p> : null}
        </div>
        {actions ? <div className="flex shrink-0 flex-wrap gap-2">{actions}</div> : null}
      </div>
      <div className="space-y-4">{children}</div>
    </div>
  );
}

/** Синоним брифа (PlanningCard = PlanningPanel). */
export const PlanningCard = PlanningPanel;
