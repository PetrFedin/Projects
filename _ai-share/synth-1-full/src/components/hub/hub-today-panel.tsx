'use client';

import Link from 'next/link';
import { cn } from '@/lib/utils';

export type HubAlertLevel = 'info' | 'warning' | 'critical';

export type HubAlert = {
  level: HubAlertLevel;
  text: string;
};

export type HubKpi = {
  label: string;
  value: string;
  hint?: string;
};

export type HubTodayAction = {
  label: string;
  href: string;
  desc?: string;
};

export function HubTodayPanel({
  e2eVariant,
  hubLabel,
  accentClass,
  kpis,
  actions,
  alerts,
}: {
  e2eVariant: string;
  hubLabel: string;
  accentClass: string;
  kpis: HubKpi[];
  actions: HubTodayAction[];
  alerts: HubAlert[];
}) {
  return (
    <section
      data-e2e={`hub-today-${e2eVariant}`}
      className="border-border-default from-bg-surface2 to-bg-surface rounded-xl border bg-gradient-to-br p-5 shadow-sm"
    >
      <h1 className={cn('text-lg font-bold tracking-tight', accentClass)}>Сегодня · {hubLabel}</h1>
      <p className="mt-1 text-xs text-muted-foreground">
        Сводка и быстрые действия (демо; под API подставятся живые KPI).
      </p>

      <div className="mt-4 grid gap-3 sm:grid-cols-3">
        {kpis.map((k) => (
          <div
            key={k.label}
            className="border-border-subtle rounded-lg border bg-white/80 px-3 py-2.5"
          >
            <p className="text-text-secondary text-[10px] font-semibold uppercase tracking-wider">
              {k.label}
            </p>
            <p className="text-text-primary text-xl font-bold tabular-nums">{k.value}</p>
            {k.hint && <p className="text-text-muted text-[10px]">{k.hint}</p>}
          </div>
        ))}
      </div>

      <div className="mt-4 flex flex-wrap gap-2">
        {actions.map((a) => (
          <Link
            key={a.href}
            href={a.href}
            className={cn(
              'border-border-default hover:border-border-default hover:bg-bg-surface2 inline-flex min-w-[140px] flex-col rounded-lg border bg-white px-3 py-2 text-left text-xs font-semibold transition-colors',
              accentClass
            )}
          >
            <span>{a.label}</span>
            {a.desc && (
              <span className="text-text-secondary mt-0.5 text-[10px] font-normal">{a.desc}</span>
            )}
          </Link>
        ))}
      </div>

      {alerts.length > 0 && (
        <ul className="mt-4 space-y-2">
          {alerts.map((a, i) => (
            <li
              key={`${a.level}-${i}`}
              className={cn(
                'rounded-md border px-3 py-2 text-[11px]',
                a.level === 'warning' && 'border-amber-200 bg-amber-50/80 text-amber-900',
                a.level === 'critical' && 'border-red-200 bg-red-50/80 text-red-900',
                a.level === 'info' && 'border-border-default bg-bg-surface2 text-text-primary'
              )}
            >
              {a.text}
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
