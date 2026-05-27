'use client';

import { Button } from '@/components/ui/button';
import { Sparkles } from 'lucide-react';
import type { W2ProductionPreflightIssue } from '@/lib/production/workshop2-production-preflight';

/** Короткая подсказка перед подписью секции: детали — в «Пульсе артикула». */
export function Workshop2DossierTzBlockersFooter({
  onOpenPulse,
  aiWarnings = [],
}: {
  onOpenPulse?: () => void;
  aiWarnings?: W2ProductionPreflightIssue[];
}) {
  return (
    <div className="flex flex-col gap-2">
      {aiWarnings.length > 0 && (
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
      )}
      <div
        className="border-border-default text-text-secondary scroll-mt-24 rounded-xl border border-dashed border-slate-200/90 bg-slate-50/60 px-3 py-2.5 text-[11px] leading-snug"
        id="w2-tz-blockers-footer"
      >
        <span className="text-text-primary font-medium">Перед подписью секции</span>
        {' — '}
        готовность к передаче, pre-flight производства и обязательные поля по разделам смотрите в{' '}
        {onOpenPulse ? (
          <Button
            type="button"
            variant="link"
            className="text-accent-primary h-auto p-0 text-[11px] font-semibold underline"
            onClick={onOpenPulse}
          >
            «Пульс артикула»
          </Button>
        ) : (
          <span className="font-semibold">«Пульс артикула»</span>
        )}
        .
      </div>
    </div>
  );
}
