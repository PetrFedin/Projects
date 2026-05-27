'use client';

import type { ReactNode } from 'react';
import { Card, CardContent, CardDescription } from '@/components/ui/card';
import { cn } from '@/lib/utils';

export function PanelShell({
  title,
  hint,
  dataMode,
  summary,
  readiness,
  blockers,
  nextAction,
  children,
}: {
  title: string | ReactNode;
  hint: string | ReactNode;
  dataMode: string;
  summary?: string;
  readiness?: string;
  blockers?: string[];
  nextAction?: string;
  children: ReactNode;
}) {
  const hasMeta = Boolean(summary || readiness || nextAction || (blockers && blockers.length > 0));

  return (
    <Card className="border-border-default">
      <CardContent className="space-y-3 pb-4 pt-4">
        <div className="flex flex-wrap items-start justify-between gap-2">
          <div className="min-w-0 flex-1 space-y-0.5">
            <p className="text-text-primary text-[12px] font-semibold leading-tight">{title}</p>
            <CardDescription className="text-text-muted line-clamp-2 text-[10px] leading-snug">
              {hint}
            </CardDescription>
          </div>
          <span
            className="border-border-default bg-bg-surface2 text-text-secondary shrink-0 rounded border px-1.5 py-0.5 font-mono text-[9px]"
            title={dataMode === 'http' ? 'Данные с API' : 'Локальные данные в браузере'}
          >
            {dataMode === 'http' ? 'API' : 'local'}
          </span>
        </div>
        <div className="min-w-0">{children}</div>
        {hasMeta ? (
          <div className="border-border-subtle flex flex-col gap-1.5 border-t border-dotted pt-2.5">
            <div className="flex flex-wrap gap-1.5">
              {summary ? (
                <span className="bg-bg-surface2/70 text-text-primary border-border-subtle max-w-full rounded border px-2 py-1 text-[10px] leading-snug">
                  <span className="text-text-muted font-bold">Суть</span> · {summary}
                </span>
              ) : null}
              {readiness ? (
                <span className="text-text-primary border-border-subtle max-w-full rounded border bg-white px-2 py-1 text-[10px] font-semibold leading-snug">
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
              <div className="max-w-full rounded border border-amber-200/80 bg-amber-50/60 px-2 py-1.5">
                <p className="text-[9px] font-bold tracking-wide text-amber-700">Риски</p>
                <ul className="mt-0.5 list-inside list-disc space-y-0.5 pl-0.5 text-[10px] text-amber-950">
                  {blockers.map((blocker) => (
                    <li key={blocker}>{blocker}</li>
                  ))}
                </ul>
              </div>
            ) : null}
          </div>
        ) : null}
      </CardContent>
    </Card>
  );
}

const W2_SECTION_FLASH_CLASS = 'rounded-xl transition-[box-shadow] duration-300';

export function SectionFlashWrap({
  id,
  flashSectionId,
  children,
}: {
  id: string;
  flashSectionId: string | null;
  children: ReactNode;
}) {
  return (
    <div
      id={id}
      className={cn(
        W2_SECTION_FLASH_CLASS,
        flashSectionId === id && 'ring-accent-primary ring-offset-bg-surface2 ring-4 ring-offset-2'
      )}
    >
      {children}
    </div>
  );
}
