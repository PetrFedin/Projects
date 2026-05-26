'use client';

import { useState } from 'react';
import { ChevronDown, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { WORKSHOP2_SURFACE_BANNER_TZ_NOTICE_CLASS } from '@/lib/production/workshop2-surface-banner-tokens';
import type { W2ProductionPreflightIssue } from '@/lib/production/workshop2-production-preflight';

/**
 * Phase 1B: readonly + blockers footer в одном collapsible (audit §4 #12–13).
 * Заменяет Workshop2DossierTzReadonlyBanner + Workshop2DossierTzBlockersFooter.
 */
export function Workshop2DossierTzSectionNotices({
  readonlyMode = false,
  onOpenPulse,
  aiWarnings = [],
}: {
  readonlyMode?: boolean;
  onOpenPulse?: () => void;
  aiWarnings?: W2ProductionPreflightIssue[];
}) {
  const hasAi = aiWarnings.length > 0;
  const hasContent = readonlyMode || hasAi || Boolean(onOpenPulse);
  const [open, setOpen] = useState(false);

  if (!hasContent) return null;

  return (
    <details
      open={open}
      onToggle={(e) => setOpen((e.target as HTMLDetailsElement).open)}
      className="rounded-lg border border-border-subtle bg-slate-50/60"
      id="w2-tz-section-notices"
    >
      <summary className="flex cursor-pointer list-none items-center justify-between gap-2 px-3 py-2 text-[11px] font-medium text-text-primary [&::-webkit-details-marker]:hidden">
        <span>Подсказки и ограничения ТЗ</span>
        <ChevronDown className={cn('h-4 w-4 shrink-0 transition-transform', open && 'rotate-180')} />
      </summary>
      <div className="space-y-2 border-t border-border-subtle px-3 py-2.5">
        {readonlyMode ? (
          <p className={WORKSHOP2_SURFACE_BANNER_TZ_NOTICE_CLASS} role="status">
            <span className="font-semibold">Только просмотр.</span> У этой роли нет права «Редактировать
            производство» — изменения ТЗ не сохраняются; экспорт доступен.
          </p>
        ) : null}
        {hasAi ? (
          <div className="rounded-xl border border-violet-200 bg-violet-50 px-3 py-2.5 text-[11px] leading-snug text-violet-800">
            <div className="mb-1 flex items-center gap-1.5 font-medium text-violet-900">
              <Sparkles className="h-3.5 w-3.5" />
              <span>AI-проверка (Pre-flight)</span>
            </div>
            <ul className="list-inside list-disc space-y-1 pl-1">
              {aiWarnings.map((w) => (
                <li key={w.id}>
                  <span className="font-semibold">{w.label}:</span> {w.detail}
                </li>
              ))}
            </ul>
          </div>
        ) : null}
        <p className="text-[11px] leading-snug text-text-secondary">
          <span className="font-medium text-text-primary">Перед подписью секции</span>
          {' — '}
          готовность и pre-flight смотрите в{' '}
          {onOpenPulse ? (
            <Button
              type="button"
              variant="link"
              className="h-auto p-0 text-[11px] font-semibold text-accent-primary underline"
              onClick={onOpenPulse}
            >
              «Пульс артикула»
            </Button>
          ) : (
            <span className="font-semibold">«Пульс артикула»</span>
          )}
          .
        </p>
      </div>
    </details>
  );
}

/** @deprecated Phase 1B — use Workshop2DossierTzSectionNotices */
export function Workshop2DossierTzBlockersFooter(props: {
  onOpenPulse?: () => void;
  aiWarnings?: W2ProductionPreflightIssue[];
  readonlyMode?: boolean;
}) {
  return <Workshop2DossierTzSectionNotices {...props} />;
}

/** @deprecated Phase 1B — merged into Workshop2DossierTzSectionNotices */
export function Workshop2DossierTzReadonlyBanner() {
  return null;
}
