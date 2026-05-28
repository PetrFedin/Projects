'use client';

import type { ComponentType, ReactNode } from 'react';
import { cn } from '@/lib/utils';
import { shouldRenderWorkshop2DataModeBadgeInPanel } from '@/lib/production/workshop2-no-demo-deadends';
import type { Workshop2OperationalPgMirrorChip as PgMirrorChipProps } from '@/lib/production/workshop2-operational-pg-mirror-status';
import {
  WORKSHOP2_SURFACE_BANNER_BLOCKERS_LIST_CLASS,
  WORKSHOP2_SURFACE_BANNER_BLOCKERS_STACK_CLASS,
  WORKSHOP2_SURFACE_BANNER_BLOCKERS_TITLE_CLASS,
  WORKSHOP2_SURFACE_CHIP_TONE_CLASS,
} from '@/lib/production/workshop2-surface-banner-tokens';

/** Корневой контейнер operational panel — единый border/padding/shadow. */
export function Workshop2OperationalPanelShell({
  children,
  className,
  id,
}: {
  children: ReactNode;
  className?: string;
  id?: string;
}) {
  return (
    <div id={id} className={cn(W2_OPERATIONAL_PANEL_ROOT, 'space-y-4', className)}>
      {children}
    </div>
  );
}

export const W2_OPERATIONAL_PANEL_ROOT =
  'border-border-default rounded-xl border bg-white p-4 shadow-sm';
export const W2_OPERATIONAL_PANEL_TITLE = 'text-text-primary text-base font-semibold';
export const W2_OPERATIONAL_PANEL_DESC = 'text-text-secondary text-xs leading-snug';
export const W2_OPERATIONAL_ROLE_BADGE =
  'bg-slate-100 text-slate-600 text-[10px] px-2 py-0.5 rounded-full font-medium';
export const W2_OPERATIONAL_ICON_BOX =
  'bg-accent-primary/10 text-accent-primary flex h-8 w-8 shrink-0 items-center justify-center rounded-lg';
export const W2_OPERATIONAL_DATA_BADGE =
  'border-border-default bg-bg-surface2 text-text-secondary shrink-0 rounded border px-1.5 py-0.5 font-mono text-[9px]';

/** Единый заголовок операционных вкладок (снабжение, PO, QC, …). */
export function Workshop2OperationalPanelChrome({
  icon: Icon,
  title,
  role,
  description,
  dataMode,
  meta,
  actions,
  className,
}: {
  icon: ComponentType<{ className?: string }>;
  title: string;
  role?: string;
  description: string;
  dataMode?: 'local' | 'http' | string;
  meta?: ReactNode;
  actions?: ReactNode;
  className?: string;
}) {
  return (
    <div className={cn('flex flex-wrap items-start justify-between gap-2', className)}>
      <div className="flex min-w-0 flex-1 items-start gap-3">
        <div className={W2_OPERATIONAL_ICON_BOX}>
          <Icon className="h-4 w-4 shrink-0" aria-hidden />
        </div>
        <div className="min-w-0 flex-1 space-y-1">
          <div className="flex flex-wrap items-center gap-2">
            <h2 className={W2_OPERATIONAL_PANEL_TITLE}>{title}</h2>
            {role ? <span className={W2_OPERATIONAL_ROLE_BADGE}>{role}</span> : null}
          </div>
          <p className={W2_OPERATIONAL_PANEL_DESC}>{description}</p>
        </div>
      </div>
      <div className="flex shrink-0 flex-wrap items-center gap-2">
        {actions}
        {dataMode && shouldRenderWorkshop2DataModeBadgeInPanel() ? (
          <span
            className={W2_OPERATIONAL_DATA_BADGE}
            title={dataMode === 'http' ? 'Данные с API' : 'Локально в браузере'}
          >
            {dataMode === 'http' ? 'API' : 'local'}
          </span>
        ) : null}
      </div>
      {meta ? (
        <div className="border-border-subtle flex w-full flex-col gap-1.5 border-t border-dotted pt-2.5">
          {meta}
        </div>
      ) : null}
    </div>
  );
}

export function Workshop2OperationalMetaChips({
  summary,
  readiness,
  readinessTitle,
  nextAction,
  blockers,
}: {
  summary?: string;
  readiness?: string;
  /** §4.15: детальные счётчики — только в tooltip, не в видимой строке chip. */
  readinessTitle?: string;
  nextAction?: string;
  blockers?: string[];
}) {
  const hasMeta = summary || readiness || nextAction || (blockers && blockers.length > 0);
  if (!hasMeta) return null;

  return (
    <>
      <div className="flex flex-wrap gap-1.5">
        {summary ? (
          <span className="bg-bg-surface2/70 text-text-primary border-border-subtle max-w-full rounded border px-2 py-1 text-[10px] leading-snug">
            <span className="text-text-muted font-bold">Суть</span> · {summary}
          </span>
        ) : null}
        {readiness ? (
          <span
            className="text-text-primary border-border-subtle max-w-full rounded border bg-white px-2 py-1 text-[10px] font-semibold leading-snug"
            title={readinessTitle}
          >
            <span className="text-text-muted font-bold">Гот.</span> · {readiness}
          </span>
        ) : null}
        {nextAction ? (
          <span className="text-accent-primary border-accent-primary/25 bg-accent-primary/8 max-w-full rounded border px-2 py-1 text-[10px] font-semibold leading-snug">
            <span className="font-bold opacity-80">Далее</span> · {nextAction}
          </span>
        ) : null}
      </div>
      {blockers && blockers.length > 0 ? (
        <div className={WORKSHOP2_SURFACE_BANNER_BLOCKERS_STACK_CLASS}>
          <p className={WORKSHOP2_SURFACE_BANNER_BLOCKERS_TITLE_CLASS}>Риски</p>
          <ul className={WORKSHOP2_SURFACE_BANNER_BLOCKERS_LIST_CLASS}>
            {blockers.map((blocker) => (
              <li key={blocker}>{blocker}</li>
            ))}
          </ul>
        </div>
      ) : null}
    </>
  );
}

const PG_MIRROR_TONE_CLASS = WORKSHOP2_SURFACE_CHIP_TONE_CLASS;

/** Chip реального PG mirror status — не green toast без ACK. */
export function Workshop2OperationalPgMirrorChip({ label, tone, title }: PgMirrorChipProps) {
  return (
    <span
      className={cn(
        'max-w-full rounded border px-2 py-1 font-mono text-[9px] font-semibold leading-snug',
        PG_MIRROR_TONE_CLASS[tone]
      )}
      title={title}
    >
      PG · {label}
    </span>
  );
}
