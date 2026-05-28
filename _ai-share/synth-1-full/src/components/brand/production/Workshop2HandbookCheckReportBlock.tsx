'use client';

import type { ReactNode } from 'react';
import * as LucideIcons from 'lucide-react';
import { Button } from '@/components/ui/button';
import type { Workshop2TzSignoffSectionKey } from '@/lib/production/workshop2-dossier-phase1.types';
import { cn } from '@/lib/utils';

type HandbookCheckAspectRow = {
  label: string;
  ok: boolean;
  jumpSection?: Workshop2TzSignoffSectionKey;
  jumpAnchorId?: string;
};

type HandbookCheckSnapshotLike = {
  checkedAtIso: string;
  scopeSection: string;
  checkAspects: HandbookCheckAspectRow[];
  bySection: Record<string, string[]>;
  globalHandbookWarnings?: string[];
};

export function Workshop2HandbookCheckReportBlock({
  snapshot,
  sections,
  scopeLabel,
  expanded,
  onToggleExpanded,
  onJumpToHandbookCheckTarget,
}: {
  snapshot: HandbookCheckSnapshotLike;
  sections: Array<{ id: string; label: string }>;
  scopeLabel: string;
  expanded: boolean;
  onToggleExpanded: () => void;
  onJumpToHandbookCheckTarget?: (target: {
    section: Workshop2TzSignoffSectionKey;
    anchorId: string;
  }) => void;
}): ReactNode {
  const globals = snapshot.globalHandbookWarnings ?? [];
  const inSections = new Set(sections.flatMap((s) => snapshot.bySection[s.id] ?? []));
  const onlyGlobal = globals.filter((w) => !inSections.has(w));
  const hasSectionIssues = sections.some((s) => (snapshot.bySection[s.id]?.length ?? 0) > 0);
  const aspects = snapshot.checkAspects ?? [];
  const hasAspectFailures = aspects.some((a) => !a.ok);
  const hasAny = hasSectionIssues || onlyGlobal.length > 0 || hasAspectFailures;

  const checklistBlock =
    aspects.length > 0 ? (
      <div className="border-border-default/90 space-y-1.5 rounded-md border bg-white/70 p-2.5">
        <ul className="space-y-1" role="list">
          {aspects.map((a, i) => (
            <li key={`${a.label}-${i}`} className="flex gap-2 text-[11px] leading-snug">
              <span
                className={cn(
                  'w-4 shrink-0 text-center text-xs font-bold',
                  a.ok ? 'text-emerald-600' : 'text-amber-600'
                )}
                aria-hidden
              >
                {a.ok ? '✓' : '!'}
              </span>
              <span className={cn('min-w-0 flex-1', a.ok ? 'text-text-primary' : 'text-amber-900')}>
                {!a.ok && onJumpToHandbookCheckTarget && a.jumpSection && a.jumpAnchorId ? (
                  <button
                    type="button"
                    className="text-left font-medium text-amber-950 underline decoration-amber-700/70 underline-offset-2 hover:decoration-amber-900"
                    onClick={() =>
                      onJumpToHandbookCheckTarget({
                        section: a.jumpSection!,
                        anchorId: a.jumpAnchorId!,
                      })
                    }
                  >
                    {a.label}
                  </button>
                ) : (
                  <span className={cn(a.ok ? '' : 'font-medium')}>{a.label}</span>
                )}
              </span>
            </li>
          ))}
        </ul>
      </div>
    ) : null;

  const body = !hasAny ? (
    <p className="text-[11px] font-medium leading-snug text-emerald-700">
      Все контрольные пункты раздела и автоматические проверки закрыты.
    </p>
  ) : (
    <div className="space-y-2">
      {sections.map((s) => {
        const ws = snapshot.bySection[s.id] ?? [];
        if (ws.length === 0) return null;
        return (
          <details
            key={s.id}
            open={s.id === snapshot.scopeSection}
            className="rounded-md border border-amber-100 bg-amber-50/50 text-amber-950"
          >
            <summary className="cursor-pointer select-none px-2 py-2 text-[11px] font-semibold leading-snug [&::-webkit-details-marker]:hidden">
              {s.label}
              <span className="ml-1 font-normal text-amber-800/80">
                ({ws.length}) · развернуть / свернуть
              </span>
            </summary>
            <ul className="space-y-1.5 border-t border-amber-100/80 px-2 pb-2 pt-2">
              {ws.map((warning, idx) => (
                <li
                  key={`${s.id}-${idx}-${warning.slice(0, 48)}`}
                  className="rounded-md border border-amber-100/90 bg-white/80 p-2 text-[11px] text-amber-900"
                >
                  {warning}
                </li>
              ))}
            </ul>
          </details>
        );
      })}
      {onlyGlobal.length > 0 ? (
        <details className="border-border-default bg-bg-surface2/90 text-text-primary rounded-md border">
          <summary className="cursor-pointer select-none px-2 py-2 text-[11px] font-semibold leading-snug [&::-webkit-details-marker]:hidden">
            Сквозные проверки
            <span className="text-text-secondary ml-1 font-normal">
              ({onlyGlobal.length}) · мерки, подписи, визуал, материал…
            </span>
          </summary>
          <ul className="border-border-default space-y-1.5 border-t px-2 pb-2 pt-2">
            {onlyGlobal.map((warning, idx) => (
              <li
                key={`glob-${idx}-${warning.slice(0, 48)}`}
                className="border-border-subtle text-text-primary rounded-md border bg-white p-2 text-[11px]"
              >
                {warning}
              </li>
            ))}
          </ul>
        </details>
      ) : null}
    </div>
  );

  const checkedAtLabel = new Date(snapshot.checkedAtIso).toLocaleString('ru-RU', {
    dateStyle: 'short',
    timeStyle: 'short',
  });
  const collapsedSummary = !hasAny ? (
    <span className="font-medium text-emerald-700">Контрольные пункты раздела закрыты.</span>
  ) : (
    <span className="font-medium text-amber-800">Есть открытые пункты — разверните отчёт.</span>
  );

  return (
    <div className="border-border-subtle bg-bg-surface2/70 space-y-2 rounded-lg border p-3">
      <div className="flex flex-wrap items-start justify-between gap-2">
        <p className="text-text-secondary text-[10px] font-bold uppercase tracking-wide">
          Отчёт проверки · {scopeLabel}
        </p>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          className="text-text-secondary hover:text-text-primary h-7 shrink-0 gap-1 px-2 text-[10px] font-semibold"
          onClick={onToggleExpanded}
          aria-expanded={expanded}
        >
          {expanded ? (
            <>
              Свернуть
              <LucideIcons.ChevronUp className="h-3.5 w-3.5" aria-hidden />
            </>
          ) : (
            <>
              Развернуть
              <LucideIcons.ChevronDown className="h-3.5 w-3.5" aria-hidden />
            </>
          )}
        </Button>
      </div>
      {expanded ? (
        <>
          {checklistBlock}
          {body}
          <p className="text-text-secondary text-[10px]">
            {checkedAtLabel}
            {hasAny ? ' · исправьте замечания и нажмите «Проверить» снова.' : null}
          </p>
        </>
      ) : (
        <p className="text-text-secondary text-[10px] leading-snug">
          {collapsedSummary} <span className="text-text-muted">· {checkedAtLabel}</span>
        </p>
      )}
    </div>
  );
}
