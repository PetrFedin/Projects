/**
 * M12: ML Smart Routing — env-gated external API (fail-closed, без fake routing в prod).
 */
import type { Workshop2CeilingFetchFn } from '@/lib/production/workshop2-ceiling-staging-core';
import type { Workshop2SmartRoutingOperation } from '@/lib/production/workshop2-dossier-phase1.types';
import { isWorkshop2SmartRoutingDemoAllowed } from '@/lib/production/workshop2-smart-routing-demo';

export function resolveWorkshop2SmartRoutingApiUrl(
  env?: Record<string, string | undefined>
): string | undefined {
  const fromEnv = env?.WORKSHOP2_SMART_ROUTING_API_URL?.trim();
  if (fromEnv) return fromEnv;
  if (typeof process !== 'undefined' && process.env?.WORKSHOP2_SMART_ROUTING_API_URL?.trim()) {
    return process.env.WORKSHOP2_SMART_ROUTING_API_URL.trim();
  }
  return undefined;
}

export function isWorkshop2SmartRoutingApiConfigured(
  env?: Record<string, string | undefined>
): boolean {
  return Boolean(resolveWorkshop2SmartRoutingApiUrl(env));
}

export type Workshop2SmartRoutingApiResult = {
  ok: boolean;
  source: 'external_api' | 'demo_blocked' | 'unconfigured';
  operations?: Workshop2SmartRoutingOperation[];
  error?: string;
  noteRu?: string;
};

/** Вызов внешнего smart routing API; demo_template не подменяет ответ в production. */
export async function callWorkshop2SmartRoutingApi(input: {
  collectionId: string;
  articleId: string;
  categoryLeafId?: string;
  fetchImpl?: Workshop2CeilingFetchFn;
  env?: Record<string, string | undefined>;
}): Promise<Workshop2SmartRoutingApiResult> {
  const apiUrl = resolveWorkshop2SmartRoutingApiUrl(input.env);
  if (!apiUrl) {
    if (!isWorkshop2SmartRoutingDemoAllowed(input.env as NodeJS.ProcessEnv)) {
      return {
        ok: false,
        source: 'demo_blocked',
        error: 'smart_routing_api_unconfigured',
        noteRu: 'WORKSHOP2_SMART_ROUTING_API_URL не задан — демо-шаблон заблокирован в production.',
      };
    }
    return {
      ok: false,
      source: 'unconfigured',
      error: 'smart_routing_api_unconfigured',
      noteRu: 'Задайте WORKSHOP2_SMART_ROUTING_API_URL или WORKSHOP2_SMART_ROUTING_DEMO=1.',
    };
  }

  const fetchFn =
    input.fetchImpl ??
    (typeof globalThis.fetch === 'function' ? globalThis.fetch.bind(globalThis) : undefined);
  if (!fetchFn) {
    return {
      ok: false,
      source: 'external_api',
      error: 'fetch_unavailable',
      noteRu: 'fetch недоступен для smart routing API.',
    };
  }

  try {
    const res = await fetchFn(apiUrl.replace(/\/$/, '') + '/route', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        collectionId: input.collectionId,
        articleId: input.articleId,
        categoryLeafId: input.categoryLeafId,
      }),
      signal: AbortSignal.timeout(12_000),
    });
    if (!res.ok) {
      return {
        ok: false,
        source: 'external_api',
        error: `smart_routing_api_${res.status}`,
        noteRu: `Smart routing API вернул HTTP ${res.status}.`,
      };
    }
    const json = (await res.json()) as {
      operations?: Workshop2SmartRoutingOperation[];
      steps?: Workshop2SmartRoutingOperation[];
      note?: string;
    };
    const ops = json.operations ?? json.steps ?? [];
    if (!Array.isArray(ops) || ops.length === 0) {
      return {
        ok: false,
        source: 'external_api',
        error: 'smart_routing_api_empty',
        noteRu: 'Smart routing API вернул пустой маршрут.',
      };
    }
    return {
      ok: true,
      source: 'external_api',
      operations: ops,
      noteRu:
        (typeof json.note === 'string' ? json.note : undefined) ??
        `Маршрут из external API (${ops.length} ops).`,
    };
  } catch (e) {
    return {
      ok: false,
      source: 'external_api',
      error: e instanceof Error ? e.message : 'smart_routing_api_unreachable',
      noteRu: 'Smart routing API недоступен (fail-closed).',
    };
  }
}
