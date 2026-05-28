'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { buildWorkshop2SetupHealthRows } from '@/lib/production/workshop2-setup-health-summary';
import type { Workshop2SetupHealthRow } from '@/lib/production/workshop2-setup-health-summary';
import { buildWorkshop2SetupRuIntegrationRows } from '@/lib/production/workshop2-setup-ru-integrations-summary';
import { fetchWorkshop2HubPgMetrics } from '@/lib/production/workshop2-hub-pg-metrics';

const STATUS_CLASS: Record<Workshop2SetupHealthRow['status'], string> = {
  ok: 'bg-emerald-50 text-emerald-900 border-emerald-200',
  warn: 'bg-amber-50 text-amber-950 border-amber-200',
  off: 'bg-slate-50 text-slate-600 border-slate-200',
  down: 'bg-rose-50 text-rose-900 border-rose-200',
};

/** Live health + pg-counts на странице setup. */
export function Workshop2SetupHealthPanel() {
  const [rows, setRows] = useState<Workshop2SetupHealthRow[] | null>(null);
  const [probesOneLiner, setProbesOneLiner] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    void (async () => {
      const [healthRes, pg, probesRes] = await Promise.all([
        fetch('/api/workshop2/health', { cache: 'no-store' }),
        fetchWorkshop2HubPgMetrics(),
        fetch('/api/workshop2/integration-probes', { cache: 'no-store' }),
      ]);
      if (cancelled) return;
      const health = healthRes.ok
        ? ((await healthRes.json()) as {
            ok?: boolean;
            postgres?: string;
            storeMode?: string;
            redis?: string;
            vaultS3?: string;
            genkit?: string;
          })
        : null;
      const baseRows = buildWorkshop2SetupHealthRows({
        healthOk: Boolean(health?.ok),
        postgres:
          health?.postgres === 'ok' ? 'ok' : health?.postgres === 'disabled' ? 'disabled' : 'down',
        storeMode: health?.storeMode,
        redis: health?.redis,
        vaultS3: health?.vaultS3,
        genkit: health?.genkit,
        pgCounts: pg.counts,
      });
      const ruRows = buildWorkshop2SetupRuIntegrationRows();
      setRows([...baseRows, ...ruRows]);

      if (probesRes.ok) {
        const probes = (await probesRes.json()) as {
          wave12RuJourney?: { checks?: { ok: boolean }[] };
        };
        const okCount = probes.wave12RuJourney?.checks?.filter((c) => c.ok).length ?? 0;
        const total = probes.wave12RuJourney?.checks?.length ?? 0;
        if (total > 0) {
          setProbesOneLiner(
            `Связность Wave 12: ${okCount}/${total} проверок OK — подробнее в integration-probes (wave12RuJourney).`
          );
        }
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  if (!rows) {
    return <p className="text-sm text-slate-500">Проверка зависимостей…</p>;
  }

  return (
    <div className="space-y-3">
      {probesOneLiner ? (
        <p
          className="rounded-md border border-slate-200 bg-slate-50 px-3 py-2 text-[11px] text-slate-700"
          data-testid="workshop2-setup-ru-probes-oneliner"
        >
          {probesOneLiner}{' '}
          <Link
            href="/api/workshop2/integration-probes"
            className="font-medium text-indigo-700 underline"
            target="_blank"
            rel="noopener noreferrer"
          >
            Открыть probes
          </Link>
        </p>
      ) : null}
      <ul className="space-y-2">
        {rows.map((row) => (
          <li
            key={row.id}
            className={`rounded-md border px-3 py-2 text-sm ${STATUS_CLASS[row.status]}`}
          >
            <p className="font-semibold">{row.labelRu}</p>
            <p className="text-[11px] opacity-90">{row.detailRu}</p>
          </li>
        ))}
      </ul>
    </div>
  );
}
