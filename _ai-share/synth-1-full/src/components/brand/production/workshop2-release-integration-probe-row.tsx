'use client';

import { useEffect, useMemo, useState } from 'react';
import { Badge } from '@/components/ui/badge';
import {
  fetchWorkshop2LiveIntegrationProbes,
  type Workshop2IntegrationProbesResponse,
} from '@/lib/production/workshop2-live-integration-probes-client';
import {
  buildWorkshop2Wave2HorizontalProbes,
  isWorkshop2LiveErpConfigured,
  isWorkshop2LiveTmsConfigured,
} from '@/lib/production/workshop2-live-integration-probes-env';
import { isWorkshop2FloorMesConfigured } from '@/lib/production/workshop2-floor-mes';

type ProbeChip = {
  id: string;
  labelRu: string;
  tone: 'green' | 'red' | 'gray';
  title?: string;
};

function toneFromConfiguredLive(configured: boolean, live?: boolean): ProbeChip['tone'] {
  if (!configured) return 'gray';
  return live ? 'green' : 'red';
}

function buildReleaseProbeChips(
  probes: Workshop2IntegrationProbesResponse | null,
  kinds: Array<'mes' | 'erp' | 'tms'>
): ProbeChip[] {
  const wave2 = probes?.wave2Horizontal ?? buildWorkshop2Wave2HorizontalProbes();
  const wave3 = probes?.wave3Horizontal;
  const out: ProbeChip[] = [];

  if (kinds.includes('mes')) {
    const configured =
      wave2.floorMes.configured || isWorkshop2FloorMesConfigured();
    out.push({
      id: 'mes',
      labelRu: configured ? (wave2.floorMes.live ? 'MES live' : 'MES cfg') : 'MES journal',
      tone: toneFromConfiguredLive(configured, wave2.floorMes.live),
      title: wave2.floorMes.envKey,
    });
  }
  if (kinds.includes('erp')) {
    const configured =
      wave3?.erpPoCreate.configured ?? isWorkshop2LiveErpConfigured();
    const live = wave3?.erpPoCreate.live ?? false;
    out.push({
      id: 'erp',
      labelRu: configured ? (live ? 'ERP live' : 'ERP cfg') : 'ERP journal',
      tone: toneFromConfiguredLive(configured, live),
      title: 'WORKSHOP2_FACTORY_ERP_BASE_URL',
    });
  }
  if (kinds.includes('tms')) {
    const configured = isWorkshop2LiveTmsConfigured();
    out.push({
      id: 'tms',
      labelRu: configured ? 'TMS live' : 'TMS journal',
      tone: toneFromConfiguredLive(configured, configured),
      title: 'WORKSHOP2_TMS_*',
    });
  }
  return out;
}

type Props = {
  kinds: Array<'mes' | 'erp' | 'tms'>;
  testId?: string;
};

/** Компактная строка probe chips (green/red/gray) для release floor/logistics. */
export function Workshop2ReleaseIntegrationProbeRow({ kinds, testId }: Props) {
  const [probes, setProbes] = useState<Workshop2IntegrationProbesResponse | null>(null);

  useEffect(() => {
    let cancelled = false;
    void fetchWorkshop2LiveIntegrationProbes().then((r) => {
      if (!cancelled) setProbes(r);
    });
    return () => {
      cancelled = true;
    };
  }, []);

  const chips = useMemo(() => buildReleaseProbeChips(probes, kinds), [probes, kinds]);

  return (
    <div
      className="flex flex-wrap items-center gap-1.5"
      data-testid={testId ?? 'workshop2-release-integration-probe-row'}
    >
      <span className="text-text-muted text-[9px] font-semibold uppercase tracking-wide">
        Integrations
      </span>
      {chips.map((c) => (
        <Badge
          key={c.id}
          variant="outline"
          title={c.title}
          className={
            c.tone === 'green'
              ? 'border-emerald-300 bg-emerald-50 text-emerald-900 text-[9px]'
              : c.tone === 'red'
                ? 'border-amber-300 bg-amber-50 text-amber-900 text-[9px]'
                : 'border-slate-200 bg-slate-50 text-slate-600 text-[9px]'
          }
          data-testid={`workshop2-release-probe-${c.id}`}
        >
          {c.labelRu}
        </Badge>
      ))}
    </div>
  );
}
