/**
 * Заявка на раскладку (nesting) — persist на заказе образца + экспорт JSON для фабрики.
 */

import type { Workshop2NestingRequest } from '@/lib/production/workshop2-dossier-phase1.types';
import type { Workshop2CeilingFetchFn } from '@/lib/production/workshop2-ceiling-staging-core';
import { workshop2NestingLocalHeuristicAllowed } from '@/lib/production/workshop2-nesting-prod-guard';
import type { Workshop2DossierPhase1 } from '@/lib/production/workshop2-dossier-phase1.types';
import { ensureWorkshop2ProductionModel } from '@/lib/production/workshop2-production-model-from-dossier';

export type { Workshop2NestingRequest };

export type Workshop2NestingFactoryExport = {
  format: 'workshop2-nesting-factory-v1';
  exportedAt: string;
  sampleOrderId: string;
  collectionId: string;
  articleId: string;
  /** Без DXF — только параметры для CAD/раскладочного ПО фабрики. */
  nesting: Workshop2NestingRequest;
  simulation?: {
    mode: 'heuristic_stub';
    labelRu: string;
    estimatedYieldPct?: number;
    noteRu: string;
  };
};

export function emptyWorkshop2NestingRequest(): Workshop2NestingRequest {
  return {};
}

export function normalizeWorkshop2NestingRequest(raw: unknown): Workshop2NestingRequest {
  if (!raw || typeof raw !== 'object') return emptyWorkshop2NestingRequest();
  const b = raw as Record<string, unknown>;
  const fabricWidthCm =
    typeof b.fabricWidthCm === 'number' && Number.isFinite(b.fabricWidthCm)
      ? b.fabricWidthCm
      : undefined;
  const efficiencyPct =
    typeof b.efficiencyPct === 'number' && Number.isFinite(b.efficiencyPct)
      ? Math.min(100, Math.max(0, b.efficiencyPct))
      : undefined;
  return {
    fabricWidthCm,
    efficiencyPct,
    notes: typeof b.notes === 'string' ? b.notes : undefined,
    updatedAt: typeof b.updatedAt === 'string' ? b.updatedAt : undefined,
    updatedBy: typeof b.updatedBy === 'string' ? b.updatedBy : undefined,
    simulationYieldPct:
      typeof b.simulationYieldPct === 'number' && Number.isFinite(b.simulationYieldPct)
        ? b.simulationYieldPct
        : undefined,
    simulationNote: typeof b.simulationNote === 'string' ? b.simulationNote : undefined,
  };
}

export function patchWorkshop2NestingRequest(
  prev: Workshop2NestingRequest | undefined,
  patch: Partial<Workshop2NestingRequest>
): Workshop2NestingRequest {
  const base = prev ?? emptyWorkshop2NestingRequest();
  return {
    ...base,
    ...patch,
    updatedAt: patch.updatedAt ?? new Date().toISOString(),
  };
}

/** Экспорт параметров раскладки (DXF-less JSON) для фабрики. */
export function buildWorkshop2NestingFactoryExport(input: {
  collectionId: string;
  articleId: string;
  sampleOrderId: string;
  nesting: Workshop2NestingRequest;
  includeSimulation?: boolean;
}): Workshop2NestingFactoryExport {
  const nesting = normalizeWorkshop2NestingRequest(input.nesting);
  const exportDoc: Workshop2NestingFactoryExport = {
    format: 'workshop2-nesting-factory-v1',
    exportedAt: new Date().toISOString(),
    sampleOrderId: input.sampleOrderId,
    collectionId: input.collectionId,
    articleId: input.articleId,
    nesting,
  };

  if (input.includeSimulation) {
    const width = nesting.fabricWidthCm ?? 150;
    const heuristicYield = Math.min(
      92,
      Math.max(55, 60 + width / 10 + (nesting.efficiencyPct ?? 0) * 0.2)
    );
    exportDoc.simulation = {
      mode: 'heuristic_stub',
      labelRu: 'Симуляция (не CAD-движок)',
      estimatedYieldPct: nesting.simulationYieldPct ?? Math.round(heuristicYield * 10) / 10,
      noteRu:
        nesting.simulationNote ??
        'Эвристика по ширине полотна и КПМ. Для production nesting подключите WORKSHOP2_NESTING_API_URL.',
    };
  }

  return exportDoc;
}

export function resolveWorkshop2NestingApiUrl(
  env?: Record<string, string | undefined>
): string | undefined {
  const fromEnv = env?.WORKSHOP2_NESTING_API_URL?.trim();
  if (fromEnv) return fromEnv;
  if (typeof process !== 'undefined' && process.env?.WORKSHOP2_NESTING_API_URL?.trim()) {
    return process.env.WORKSHOP2_NESTING_API_URL.trim();
  }
  return undefined;
}

export function buildWorkshop2NestingPomPayload(dossier?: Workshop2DossierPhase1): {
  measurements: Array<{ label: string; valueCm?: number; code?: string }>;
  sampleBasePerSize?: Workshop2DossierPhase1['sampleBasePerSizeDimensions'];
} {
  if (!dossier) {
    return { measurements: [] };
  }
  const model = ensureWorkshop2ProductionModel(dossier);
  return {
    measurements: (model.measurements ?? []).map((m) => ({
      label: String(m.label ?? m.code ?? ''),
      valueCm: typeof m.valueCm === 'number' ? m.valueCm : undefined,
      code: m.code,
    })),
    sampleBasePerSize: dossier.sampleBasePerSizeDimensions,
  };
}

/** Вызов внешнего nesting API (stub/simulation) — честная подпись в ответе. */
export async function callWorkshop2NestingSimulationStub(input: {
  collectionId: string;
  articleId: string;
  sampleOrderId: string;
  nesting: Workshop2NestingRequest;
  dossier?: Workshop2DossierPhase1;
  fetchImpl?: Workshop2CeilingFetchFn;
  env?: Record<string, string | undefined>;
}): Promise<{
  ok: boolean;
  simulation: Workshop2NestingFactoryExport['simulation'];
  source: 'external_api' | 'local_heuristic';
  error?: string;
  json?: Record<string, unknown>;
}> {
  const apiUrl = resolveWorkshop2NestingApiUrl(input.env);
  const local = buildWorkshop2NestingFactoryExport({
    ...input,
    includeSimulation: true,
  }).simulation;

  if (!apiUrl) {
    if (!workshop2NestingLocalHeuristicAllowed(input.env)) {
      return {
        ok: false,
        simulation: undefined,
        source: 'local_heuristic',
        error: 'nesting_stub_disabled_in_production',
      };
    }
    return { ok: true, simulation: local, source: 'local_heuristic' };
  }

  const fetchFn =
    input.fetchImpl ??
    (typeof globalThis.fetch === 'function' ? globalThis.fetch.bind(globalThis) : undefined);
  if (!fetchFn) {
    return {
      ok: false,
      simulation: undefined,
      source: 'external_api',
      error: 'fetch_unavailable',
    };
  }
  try {
    const res = await fetchFn(apiUrl.replace(/\/$/, '') + '/simulate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        collectionId: input.collectionId,
        articleId: input.articleId,
        sampleOrderId: input.sampleOrderId,
        nesting: input.nesting,
        pom: buildWorkshop2NestingPomPayload(input.dossier),
      }),
      signal: AbortSignal.timeout(10_000),
    });
    if (!res.ok) {
      return {
        ok: false,
        simulation: undefined,
        source: 'external_api',
        error: `nesting_api_${res.status}`,
      };
    }
    const json = (await res.json()) as Record<string, unknown> & {
      estimatedYieldPct?: number;
      note?: string;
    };
    return {
      ok: true,
      source: 'external_api',
      json,
      simulation: {
        mode: 'heuristic_stub',
        labelRu: 'Симуляция (внешний nesting API)',
        estimatedYieldPct:
          typeof json.estimatedYieldPct === 'number'
            ? json.estimatedYieldPct
            : local?.estimatedYieldPct,
        noteRu:
          (typeof json.note === 'string' ? json.note : undefined) ??
          local?.noteRu ??
          'Ответ nesting API',
      },
    };
  } catch (e) {
    return {
      ok: false,
      simulation: undefined,
      source: 'external_api',
      error: e instanceof Error ? e.message : 'nesting_api_unreachable',
    };
  }
}
