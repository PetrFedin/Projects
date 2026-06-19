'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { Progress } from '@/components/ui/progress';
import { WORKSHOP2_SS27_COLLECTION_ID } from '@/lib/production/workshop2-ru-journey-ss27';

type Ss27ChecklistPayload = {
  autoProgressPct?: number;
  autoPassed?: number;
  manualRemaining?: number;
  readyForHumanSignoff?: boolean;
  remainingManualSteps?: string[];
  b2bAutoChecks?: { id: string; labelRu: string; ok: boolean; noteRu?: string }[];
};

/** Wave 30: прогресс UAT SS27 на хабе — % из checklist API + B2B auto-checks. */
export function Workshop2Ss27UatChecklistPanel({ collectionId }: { collectionId: string }) {
  const cid = collectionId.trim();
  const [payload, setPayload] = useState<Ss27ChecklistPayload | null>(null);
  const [error, setError] = useState(false);

  useEffect(() => {
    if (cid !== WORKSHOP2_SS27_COLLECTION_ID) {
      setPayload(null);
      return;
    }
    let cancelled = false;
    void fetch('/api/workshop2/uat/ss27-checklist', { cache: 'no-store' })
      .then(async (res) => {
        if (!res.ok) return null;
        return (await res.json()) as Ss27ChecklistPayload | null;
      })
      .then((data) => {
        if (cancelled) return;
        if (!data) {
          setError(true);
          setPayload(null);
          return;
        }
        setError(false);
        setPayload(data);
      })
      .catch(() => {
        if (!cancelled) {
          setError(true);
          setPayload(null);
        }
      });
    return () => {
      cancelled = true;
    };
  }, [cid]);

  if (cid !== WORKSHOP2_SS27_COLLECTION_ID) return null;

  const pct = Math.max(0, Math.min(100, payload?.autoProgressPct ?? 0));
  const ready = payload?.readyForHumanSignoff === true;

  return (
    <section
      className="rounded-lg border border-indigo-200/80 bg-indigo-50/40 px-3 py-2.5"
      data-testid="workshop2-ss27-uat-checklist-panel"
    >
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div>
          <p className="text-[11px] font-bold text-indigo-950">Чеклист UAT SS27</p>
          <p className="text-[10px] text-indigo-900/80">
            auto {payload?.autoPassed ?? '—'}/
            {payload ? (payload.autoPassed ?? 0) + (payload.manualRemaining ?? 0) : '—'}
            {payload?.manualRemaining != null ? ` · manual ${payload.manualRemaining}` : ''}
          </p>
        </div>
        <span
          className={`rounded-full px-2 py-0.5 text-[10px] font-semibold tabular-nums ${
            ready ? 'bg-emerald-100 text-emerald-800' : 'bg-white text-indigo-800'
          }`}
          data-testid="workshop2-ss27-uat-progress-label"
        >
          {pct}%
        </span>
      </div>
      <Progress value={pct} className="mt-2 h-1.5" aria-label={`UAT SS27 auto ${pct}%`} />
      {error ? (
        <p className="mt-2 text-[10px] text-amber-800">Не удалось загрузить checklist API.</p>
      ) : null}
      {payload?.b2bAutoChecks?.length ? (
        <ul className="mt-2 space-y-0.5 text-[10px] text-indigo-950">
          {payload.b2bAutoChecks.map((c) => (
            <li key={c.id} className={c.ok ? 'text-emerald-800' : 'text-amber-900'}>
              {c.ok ? '✓' : '○'} {c.labelRu}
            </li>
          ))}
        </ul>
      ) : null}
      {payload?.remainingManualSteps?.length && !ready ? (
        <details className="mt-2 text-[10px] text-indigo-950">
          <summary className="cursor-pointer font-medium">
            Оставшиеся шаги ({payload.remainingManualSteps.length})
          </summary>
          <ul className="mt-1 list-disc space-y-0.5 pl-4">
            {payload.remainingManualSteps.slice(0, 5).map((step) => (
              <li key={step}>{step}</li>
            ))}
          </ul>
        </details>
      ) : null}
      {ready ? (
        <p className="mt-2 text-[10px] font-medium text-emerald-800">
          Готово к human sign-off UAT.
        </p>
      ) : null}
      <p className="mt-2 text-[10px]">
        <Link
          href="/api/workshop2/uat/ss27-checklist"
          className="text-indigo-800 underline"
          target="_blank"
          rel="noreferrer"
        >
          JSON checklist
        </Link>
        {' · '}
        <Link
          href="/brand/production/workshop2/setup#uat-ss27"
          className="text-indigo-800 underline"
        >
          Setup UAT
        </Link>
      </p>
    </section>
  );
}
