/**
 * Wave 17 RU: сводка «Проверить связность» на setup — только parse ответов существующих API.
 */
import {
  probeWorkshop2KonturDiadocHttp,
  resolveWorkshop2EdoProvider,
} from '@/lib/production/workshop2-edo-signoff';

export type Workshop2SetupConnectivityRow = {
  id: string;
  labelRu: string;
  status: 'ok' | 'fail' | 'warn';
  detailRu?: string;
};

export async function buildWorkshop2SetupConnectivityRows(input: {
  probes: Record<string, unknown> | null;
  readiness: Record<string, unknown> | null;
  uat: Record<string, unknown> | null;
}): Promise<{ rows: Workshop2SetupConnectivityRow[]; summaryRu: string }> {
  const rows: Workshop2SetupConnectivityRow[] = [];

  const probesOk = input.probes?.ok === true;
  const market = String(input.probes?.market ?? '—');
  const wave18Api = input.probes?.wave18RuApiCoverage as
    | {
        cumulativeWrapped?: number;
        cumulativeTotal?: number;
        checks?: Array<{ id: string; ok: boolean; hintRu?: string }>;
      }
    | undefined;
  const apiCov =
    wave18Api?.checks?.find((c) => c.id === 'api_error_ru_cumulative_coverage') ??
    (
      input.probes?.wave17RuApiErrors as { checks?: Array<{ id: string; ok: boolean }> } | undefined
    )?.checks?.find((c) => c.id === 'api_error_ru_high_traffic_wrapper');
  rows.push({
    id: 'integration_probes',
    labelRu: 'Integration probes',
    status: probesOk ? 'ok' : 'fail',
    detailRu: probesOk
      ? `market=${market}${
          apiCov && wave18Api?.cumulativeTotal
            ? ` · API RU ${wave18Api.cumulativeWrapped}/${wave18Api.cumulativeTotal} ${apiCov.ok ? 'OK' : 'FAIL'}`
            : apiCov
              ? ` · API RU wrapper ${apiCov.ok ? 'OK' : 'FAIL'}`
              : ''
        }`
      : 'GET /api/workshop2/integration-probes недоступен',
  });

  const ready = input.readiness?.readyForInvestorDemo === true;
  const stagingNote =
    typeof input.readiness?.stagingNoteRu === 'string'
      ? input.readiness.stagingNoteRu.slice(0, 80)
      : undefined;
  rows.push({
    id: 'investor_readiness',
    labelRu: 'Investor readiness',
    status: ready ? 'ok' : 'warn',
    detailRu: ready
      ? 'readyForInvestorDemo'
      : (stagingNote ?? 'Демо возможно в staging; см. reasons в API'),
  });

  const autoPassed = Number(input.uat?.autoPassed ?? 0);
  const manualRemaining = Number(input.uat?.manualRemaining ?? 0);
  const itemCount = Array.isArray(input.uat?.items) ? input.uat.items.length : 0;
  const uatOk = itemCount > 0 && manualRemaining === 0;
  rows.push({
    id: 'ss27_uat',
    labelRu: 'UAT SS27 checklist',
    status: uatOk ? 'ok' : autoPassed > 0 ? 'warn' : 'fail',
    detailRu:
      itemCount > 0
        ? `auto ${autoPassed}/${itemCount} · manual осталось ${manualRemaining}`
        : 'GET /api/workshop2/uat/ss27-checklist — пустой ответ',
  });

  const wave11 = input.probes?.wave11RuConnectivity as
    | { checks?: Array<{ ok: boolean }> }
    | undefined;
  if (wave11?.checks?.length) {
    const ok = wave11.checks.filter((c) => c.ok).length;
    rows.push({
      id: 'wave11_connectivity',
      labelRu: 'Wave 11 connectivity probe',
      status: ok === wave11.checks.length ? 'ok' : 'warn',
      detailRu: `${ok}/${wave11.checks.length} checks OK`,
    });
  }

  if (resolveWorkshop2EdoProvider() === 'kontur') {
    const kontur = await probeWorkshop2KonturDiadocHttp();
    rows.push({
      id: 'edo_kontur_diadoc',
      labelRu: 'ЭДО Контур Diadoc',
      status: kontur.ok ? 'ok' : kontur.probed ? 'fail' : 'warn',
      detailRu: kontur.messageRu.slice(0, 120),
    });
  }

  const okCount = rows.filter((r) => r.status === 'ok').length;
  const summaryRu = `Связность: ${okCount}/${rows.length} зелёных · ${rows.filter((r) => r.status === 'fail').length} красных`;

  return { rows, summaryRu };
}
