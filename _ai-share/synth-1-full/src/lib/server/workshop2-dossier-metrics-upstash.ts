import type { Workshop2DossierMetricsPayload } from '@/lib/production/workshop2-dossier-metrics-ingest';

const REDIS_KEY = 'w2:dossier:metrics:v1';

export function getW2UpstashMetricsMaxListLen(): number {
  const raw = parseInt(
    process.env.W2_UPSTASH_METRICS_MAX_LEN ?? process.env.W2_METRICS_REDIS_MAX_LEN ?? '20000',
    10
  );
  if (!Number.isFinite(raw)) return 20_000;
  return Math.min(Math.max(raw, 1000), 50_000);
}

export type UpstashConfig = { url: string; token: string };

/** Поддержка Vercel KV / Upstash (REST) без отдельного npm-пакета. */
export function getW2DossierMetricsUpstashConfig(): UpstashConfig | null {
  const url =
    process.env.W2_UPSTASH_REDIS_REST_URL?.trim() ||
    process.env.UPSTASH_REDIS_REST_URL?.trim() ||
    process.env.KV_REST_API_URL?.trim();
  const token =
    process.env.W2_UPSTASH_REDIS_REST_TOKEN?.trim() ||
    process.env.UPSTASH_REDIS_REST_TOKEN?.trim() ||
    process.env.KV_REST_API_TOKEN?.trim();
  if (!url || !token) return null;
  return { url: url.replace(/\/$/, ''), token };
}

async function upstashCmd(cmd: (string | number)[]): Promise<unknown> {
  const c = getW2DossierMetricsUpstashConfig();
  if (!c) throw new Error('no_upstash');
  const res = await fetch(c.url, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${c.token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(cmd),
  });
  if (!res.ok) {
    const t = await res.text().catch(() => '');
    throw new Error(`upstash ${res.status} ${t}`);
  }
  const j = (await res.json()) as { result?: unknown };
  return j.result;
}

export async function upstashAppendW2DossierMetricRow(row: Workshop2DossierMetricsPayload): Promise<void> {
  const line = JSON.stringify(row);
  const cap = getW2UpstashMetricsMaxListLen();
  await upstashCmd(['LPUSH', REDIS_KEY, line]);
  await upstashCmd(['LTRIM', REDIS_KEY, 0, cap - 1]);
}

/** Опасно: очистить список после успешного архива (см. W2_METRICS_ARCHIVE_AFTER_SUCCESS_CLEAR_REDIS). */
export async function upstashDeleteW2DossierMetricsList(): Promise<void> {
  await upstashCmd(['DEL', REDIS_KEY]);
}

export async function upstashReadW2DossierMetricsTail(maxLines: number): Promise<Workshop2DossierMetricsPayload[]> {
  const n = Math.min(Math.max(maxLines, 1), 5000);
  const raw = await upstashCmd(['LRANGE', REDIS_KEY, 0, n - 1]);
  if (!Array.isArray(raw)) return [];
  const out: Workshop2DossierMetricsPayload[] = [];
  for (const item of raw) {
    if (typeof item !== 'string') continue;
    try {
      out.push(JSON.parse(item) as Workshop2DossierMetricsPayload);
    } catch {
      /* skip */
    }
  }
  return out;
}

export function w2DossierMetricsBackendLabel(): 'upstash' | 'file' {
  return getW2DossierMetricsUpstashConfig() ? 'upstash' : 'file';
}
