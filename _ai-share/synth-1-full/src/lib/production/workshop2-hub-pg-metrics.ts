/**
 * Метрики хаба из PG (setup/pg-counts) для rollup без localStorage.
 */
export type Workshop2HubPgMetrics = {
  postgres: 'disabled' | 'ok' | 'down';
  counts: {
    collections: number;
    articles: number;
    dossiers: number;
    events: number;
    sampleOrders: number;
  } | null;
};

export async function fetchWorkshop2HubPgMetrics(baseUrl = ''): Promise<Workshop2HubPgMetrics> {
  const prefix = baseUrl.replace(/\/$/, '');
  const res = await fetch(`${prefix}/api/workshop2/setup/pg-counts`, { cache: 'no-store' });
  if (!res.ok) {
    return {
      postgres: 'down',
      counts: null,
    };
  }
  const json = (await res.json()) as {
    postgres?: string;
    counts?: {
      collections?: number;
      articles?: number;
      dossiers?: number;
      events?: number;
      sampleOrders?: number;
    } | null;
  };
  const pg = json.postgres === 'ok' ? 'ok' : json.postgres === 'disabled' ? 'disabled' : 'down';
  if (!json.counts) {
    return { postgres: pg, counts: null };
  }
  return {
    postgres: pg,
    counts: {
      collections: Number(json.counts.collections ?? 0),
      articles: Number(json.counts.articles ?? 0),
      dossiers: Number(json.counts.dossiers ?? 0),
      events: Number(json.counts.events ?? 0),
      sampleOrders: Number(json.counts.sampleOrders ?? 0),
    },
  };
}
