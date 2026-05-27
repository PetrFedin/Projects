/**
 * Wave 34: staging LIVE verify — Kontur Diadoc + ЧЗ URLs из .env.staging.live.ru.example.
 * Fail-closed: 401/503 без ключа — OK; crash/network error — not OK.
 */
import type { Workshop2ProcessEnvLike } from '@/lib/production/workshop2-live-integration-probes-env';

export type Workshop2StagingLiveVerifyProbe = {
  id: 'kontur_diadoc' | 'marking_api';
  url: string;
  probed: boolean;
  ok: boolean;
  status?: number;
  expectedFailClosed: boolean;
  messageRu: string;
};

export type Workshop2StagingLiveVerifyReport = {
  generatedAt: string;
  envSource: string;
  market: string;
  ok: boolean;
  probes: Workshop2StagingLiveVerifyProbe[];
  summaryRu: string;
};

/** Парсит KEY=VALUE из example env (без dotenv). */
export function parseWorkshop2DotEnvExample(content: string): Record<string, string> {
  const out: Record<string, string> = {};
  for (const line of content.split('\n')) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('#')) continue;
    const eq = trimmed.indexOf('=');
    if (eq <= 0) continue;
    const key = trimmed.slice(0, eq).trim();
    let val = trimmed.slice(eq + 1).trim();
    if ((val.startsWith('"') && val.endsWith('"')) || (val.startsWith("'") && val.endsWith("'"))) {
      val = val.slice(1, -1);
    }
    out[key] = val;
  }
  return out;
}

/** HEAD probe — без fake ACK; 401/403/503 считаем ожидаемым fail-closed без API key. */
export async function probeWorkshop2StagingLiveHttpUrl(input: {
  url: string;
  labelRu: string;
  fetchImpl?: typeof fetch;
  timeoutMs?: number;
}): Promise<Workshop2StagingLiveVerifyProbe> {
  const url = input.url.trim();
  const id = input.labelRu.toLowerCase().includes('диадoc') ? 'kontur_diadoc' : 'marking_api';
  if (!url || url.includes('YOUR-')) {
    return {
      id,
      url,
      probed: false,
      ok: false,
      expectedFailClosed: true,
      messageRu: `${input.labelRu}: URL не заполнен в example — probe пропущен.`,
    };
  }
  const fetchFn = input.fetchImpl ?? (typeof fetch === 'function' ? fetch : undefined);
  if (!fetchFn) {
    return {
      id,
      url,
      probed: false,
      ok: false,
      expectedFailClosed: true,
      messageRu: `${input.labelRu}: fetch недоступен.`,
    };
  }
  try {
    const target = `${url.replace(/\/$/, '')}/health`;
    const res = await fetchFn(target, {
      method: 'HEAD',
      signal: AbortSignal.timeout(input.timeoutMs ?? 8_000),
    });
    const expectedFailClosed = res.status === 401 || res.status === 403 || res.status === 503;
    const ok = res.ok || expectedFailClosed;
    return {
      id,
      url,
      probed: true,
      ok,
      status: res.status,
      expectedFailClosed,
      messageRu: ok
        ? expectedFailClosed
          ? `${input.labelRu}: HTTP ${res.status} — fail-closed без ключа (ожидаемо).`
          : `${input.labelRu}: HTTP ${res.status} — endpoint доступен.`
        : `${input.labelRu}: HTTP ${res.status} — неожиданный ответ.`,
    };
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    return {
      id,
      url,
      probed: true,
      ok: false,
      expectedFailClosed: false,
      messageRu: `${input.labelRu}: сеть недоступна (${msg}) — не crash-safe.`,
    };
  }
}

export async function buildWorkshop2StagingLiveVerifyReport(input?: {
  env?: Workshop2ProcessEnvLike;
  envExampleContent?: string;
  fetchImpl?: typeof fetch;
}): Promise<Workshop2StagingLiveVerifyReport> {
  const env = input?.env ?? process.env;
  const parsed = input?.envExampleContent
    ? parseWorkshop2DotEnvExample(input.envExampleContent)
    : {};
  const diadocUrl = String(
    env.WORKSHOP2_KONTUR_DIADOC_URL ?? parsed.WORKSHOP2_KONTUR_DIADOC_URL ?? ''
  ).trim();
  const markingUrl = String(
    env.WORKSHOP2_MARKING_API_URL ?? parsed.WORKSHOP2_MARKING_API_URL ?? ''
  ).trim();

  const probes = await Promise.all([
    probeWorkshop2StagingLiveHttpUrl({
      url: diadocUrl,
      labelRu: 'Контур Diadoc',
      fetchImpl: input?.fetchImpl,
    }),
    probeWorkshop2StagingLiveHttpUrl({
      url: markingUrl,
      labelRu: 'Честный ЗНАК API',
      fetchImpl: input?.fetchImpl,
    }),
  ]);

  const ok = probes.every((p) => p.ok || !p.probed);
  return {
    generatedAt: new Date().toISOString(),
    envSource: '.env.staging.live.ru.example',
    market: String(env.WORKSHOP2_MARKET ?? parsed.WORKSHOP2_MARKET ?? 'ru'),
    ok,
    probes,
    summaryRu: ok
      ? 'Staging live verify: fail-closed без ключей — без crash.'
      : 'Staging live verify: есть ошибки probe (см. probes).',
  };
}
