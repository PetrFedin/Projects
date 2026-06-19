'use client';

import { useCallback, useEffect, useState } from 'react';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

type SlaPayload = {
  ackEdoP99Ms?: number | null;
  ackMarkingP99Ms?: number | null;
  b2b3dErrorRate?: number;
  probeLastOkAt?: string | null;
  sloOk?: boolean;
  labelRu?: string;
  sloTargets?: { ackP99Ms: number; b2b3dErrorRatePct: number; labelRu?: string };
};

/** Wave 53: read-only ops SLA panel из GET /api/workshop2/ops/sla-dashboard. */
export function Workshop2HubSlaOpsPanel({ compact = false }: { compact?: boolean }) {
  const [payload, setPayload] = useState<SlaPayload | null>(null);
  const [error, setError] = useState(false);

  const load = useCallback(async () => {
    const res = await fetch('/api/workshop2/ops/sla-dashboard', { cache: 'no-store' });
    if (!res.ok) {
      setError(true);
      return;
    }
    setError(false);
    setPayload((await res.json()) as SlaPayload);
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  if (compact) {
    return (
      <div
        className="flex flex-wrap items-center gap-2 rounded-md border border-border-subtle bg-bg-surface2/60 px-3 py-2 text-xs"
        data-testid="workshop2-hub-sla-ops-panel"
      >
        {error ? (
          <span className="text-destructive">SLA dashboard недоступен</span>
        ) : payload ? (
          <>
            <Badge variant={payload.sloOk ? 'default' : 'destructive'} className="text-[9px]">
              SLO {payload.sloOk ? 'ok' : 'нарушен'}
            </Badge>
            <span className="text-text-muted tabular-nums">
              3D err {payload.b2b3dErrorRate ?? 0}%
            </span>
            {payload.probeLastOkAt ? (
              <span className="text-text-muted text-[10px]">probe {payload.probeLastOkAt.slice(0, 10)}</span>
            ) : null}
          </>
        ) : (
          <span className="text-text-muted">SLA…</span>
        )}
      </div>
    );
  }

  return (
    <Card data-testid="workshop2-hub-sla-ops-panel">
      <CardHeader className="pb-2">
        <CardTitle className="text-base">Ops SLA</CardTitle>
        <CardDescription>ACK p99, 3D error rate, probe heartbeat — journal_only metrics.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-2 text-sm">
        {error && <p className="text-destructive">Не удалось загрузить SLA dashboard.</p>}
        {payload && (
          <>
            <div className="flex flex-wrap gap-2">
              <Badge variant={payload.sloOk ? 'default' : 'destructive'}>
                SLO: {payload.sloOk ? 'ok' : 'нарушен'}
              </Badge>
            </div>
            <dl className="grid grid-cols-2 gap-x-4 gap-y-1">
              <dt className="text-muted-foreground">ЭДО ACK p99</dt>
              <dd>{payload.ackEdoP99Ms ?? '—'} ms</dd>
              <dt className="text-muted-foreground">ЧЗ ACK p99</dt>
              <dd>{payload.ackMarkingP99Ms ?? '—'} ms</dd>
              <dt className="text-muted-foreground">3D error rate</dt>
              <dd>{payload.b2b3dErrorRate ?? 0}%</dd>
              <dt className="text-muted-foreground">Probe last OK</dt>
              <dd>{payload.probeLastOkAt ?? '—'}</dd>
            </dl>
            <p className="text-muted-foreground text-xs">{payload.labelRu}</p>
            {payload.sloTargets?.labelRu && (
              <p className="text-muted-foreground text-xs">{payload.sloTargets.labelRu}</p>
            )}
          </>
        )}
      </CardContent>
    </Card>
  );
}
