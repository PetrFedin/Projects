/**
 * Wave 3 P0: ЭП Gold Sample (РФ) — stub Контур/СБИС, mock только в dev.
 */
import type { Workshop2DossierPhase1 } from '@/lib/production/workshop2-dossier-phase1.types';
import type { Workshop2HandoffReadinessCheck } from '@/lib/production/workshop2-handoff-readiness';

export type Workshop2EdoProvider = 'kontur' | 'sbis' | 'goskey' | 'mock' | 'none';

/** Русские подписи статусов ЭДО для UI (Wave 9 RU). */
export function workshop2EdoStatusLabelRu(status: Workshop2EdoSignoffMirror['edoStatus']): string {
  switch (status) {
    case 'pending':
      return 'Ожидает подписи';
    case 'signed':
      return 'Подписано';
    case 'rejected':
      return 'Отклонено';
    default:
      return 'Черновик';
  }
}

/**
 * API pattern (fail-closed без env):
 * - POST {WORKSHOP2_KONTUR_EDO_API_URL}/signoff-request — Контур Diadoc
 * - GET  {WORKSHOP2_KONTUR_EDO_API_URL}/signoff-status/{requestId}
 * - POST {WORKSHOP2_SBIS_EDO_API_URL}/signoff-request — СБИС API
 * - GET  {WORKSHOP2_SBIS_EDO_API_URL}/signoff-status/{requestId}
 * Без URL — только journal mirror, HTTP не вызывается.
 */

export type Workshop2EdoSignoffMirror = NonNullable<Workshop2DossierPhase1['edoSignoffMirror']>;

/** Wave 21 pilot: Контур Diadoc URL (приоритет над legacy KONTUR_EDO_API_URL). */
export function resolveWorkshop2KonturEdoBaseUrl(
  env?: Record<string, string | undefined>
): string | undefined {
  const e = env ?? process.env;
  return (
    e.WORKSHOP2_KONTUR_DIADOC_URL?.trim() || e.WORKSHOP2_KONTUR_EDO_API_URL?.trim() || undefined
  );
}

/** Fail-closed HTTP probe — без имитации signed при недоступном API. */
export async function probeWorkshop2KonturDiadocHttp(input?: {
  env?: Record<string, string | undefined>;
  fetchImpl?: typeof fetch;
}): Promise<{ ok: boolean; probed: boolean; status?: number; messageRu: string }> {
  const env = input?.env ?? process.env;
  const provider = resolveWorkshop2EdoProvider(env);
  if (provider !== 'kontur') {
    return { ok: true, probed: false, messageRu: 'Провайдер не kontur — HTTP probe пропущен.' };
  }
  const base = resolveWorkshop2KonturEdoBaseUrl(env);
  if (!base) {
    return {
      ok: false,
      probed: true,
      messageRu:
        'WORKSHOP2_EDO_PROVIDER=kontur: задайте WORKSHOP2_KONTUR_DIADOC_URL (fail-closed, без fake sign).',
    };
  }
  const fetchFn = input?.fetchImpl ?? (typeof fetch === 'function' ? fetch : undefined);
  if (!fetchFn) {
    return { ok: false, probed: true, messageRu: 'fetch недоступен — probe ЭДО не выполнен.' };
  }
  try {
    const res = await fetchFn(`${base.replace(/\/$/, '')}/health`, {
      method: 'HEAD',
      signal: AbortSignal.timeout(8_000),
    });
    return {
      ok: res.ok,
      probed: true,
      status: res.status,
      messageRu: res.ok
        ? 'Контур Diadoc HTTP доступен.'
        : `Контур Diadoc HTTP ${res.status} — подпись недоступна (fail-closed).`,
    };
  } catch {
    return {
      ok: false,
      probed: true,
      messageRu: 'Контур Diadoc недоступен — fail-closed, статус signed не выставляется.',
    };
  }
}

export function resolveWorkshop2EdoProvider(
  env?: Record<string, string | undefined>
): Workshop2EdoProvider {
  const raw = String(env?.WORKSHOP2_EDO_PROVIDER ?? process.env.WORKSHOP2_EDO_PROVIDER ?? '')
    .trim()
    .toLowerCase();
  if (raw === 'kontur' || raw === 'sbis' || raw === 'goskey' || raw === 'mock') return raw;
  return 'none';
}

export function isWorkshop2EdoSignoffRequired(env?: Record<string, string | undefined>): boolean {
  const e = env ?? process.env;
  return (
    e.WORKSHOP2_EDO_SIGNOFF_REQUIRED === 'true' ||
    resolveWorkshop2EdoProvider(e) === 'kontur' ||
    resolveWorkshop2EdoProvider(e) === 'sbis'
  );
}

export function buildWorkshop2EdoSignoffMirror(input: {
  dossier: Workshop2DossierPhase1;
  provider: Workshop2EdoProvider;
  edoStatus: Workshop2EdoSignoffMirror['edoStatus'];
  requestId?: string | null;
  signedAt?: string | null;
  env?: Record<string, string | undefined>;
}): Workshop2EdoSignoffMirror {
  const required = isWorkshop2EdoSignoffRequired(input.env);
  const blockerHandoff = required && input.edoStatus !== 'signed';
  let hintRu: string | undefined;
  if (input.provider === 'mock') {
    hintRu =
      'EDO mock (dev) — prod требует kontur|sbis + edoStatus=signed для handoff Gold Sample.';
  } else if (blockerHandoff) {
    hintRu = `ЭП Gold Sample: edoStatus=${input.edoStatus} — требуется signed (${input.provider}).`;
  } else if (input.edoStatus === 'signed') {
    hintRu = `ЭП подписан через ${input.provider}.`;
  }
  return {
    mirroredAt: new Date().toISOString(),
    provider: input.provider,
    edoStatus: input.edoStatus,
    requestId: input.requestId ?? null,
    signedAt: input.signedAt ?? null,
    blockerHandoff,
    hintRu,
    statusLabelRu: workshop2EdoStatusLabelRu(input.edoStatus),
  };
}

export async function requestWorkshop2EdoSignoff(input: {
  dossier: Workshop2DossierPhase1;
  collectionId: string;
  articleId: string;
  actor: string;
  env?: Record<string, string | undefined>;
  fetchImpl?: typeof fetch;
}): Promise<{
  ok: boolean;
  dossier: Workshop2DossierPhase1;
  mirror: Workshop2EdoSignoffMirror;
  error?: string;
}> {
  const env = input.env ?? process.env;
  const provider = resolveWorkshop2EdoProvider(env);
  const nodeEnv = env.NODE_ENV ?? process.env.NODE_ENV;

  if (provider === 'goskey') {
    const mirror = buildWorkshop2EdoSignoffMirror({
      dossier: input.dossier,
      provider: 'goskey',
      edoStatus: 'pending',
      env,
    });
    return {
      ok: false,
      error: 'edo_goskey_stub',
      dossier: { ...input.dossier, edoSignoffMirror: mirror },
      mirror,
    };
  }

  if (provider === 'none') {
    const mirror = buildWorkshop2EdoSignoffMirror({
      dossier: input.dossier,
      provider: 'none',
      edoStatus: 'draft',
      env,
    });
    return {
      ok: false,
      error: 'edo_provider_not_configured',
      dossier: { ...input.dossier, edoSignoffMirror: mirror },
      mirror,
    };
  }

  if (provider === 'mock') {
    const stagingMock =
      env.WORKSHOP2_STAGING_CONTRACT_MODE === 'true' || env.WORKSHOP2_EDO_MOCK_STAGING === 'true';
    if (nodeEnv === 'production' && !stagingMock) {
      const mirror = buildWorkshop2EdoSignoffMirror({
        dossier: input.dossier,
        provider: 'mock',
        edoStatus: 'pending',
        env,
      });
      return {
        ok: false,
        error: 'edo_mock_blocked_in_production',
        dossier: { ...input.dossier, edoSignoffMirror: mirror },
        mirror,
      };
    }
    const requestId = `mock-edo-${Date.now()}`;
    const mirror = buildWorkshop2EdoSignoffMirror({
      dossier: input.dossier,
      provider: 'mock',
      edoStatus: 'signed',
      requestId,
      signedAt: new Date().toISOString(),
      env,
    });
    return {
      ok: true,
      dossier: { ...input.dossier, edoSignoffMirror: mirror },
      mirror,
    };
  }

  const baseUrl =
    provider === 'kontur'
      ? resolveWorkshop2KonturEdoBaseUrl(env)
      : env.WORKSHOP2_SBIS_EDO_API_URL?.trim();
  const fetchFn = input.fetchImpl ?? (typeof fetch === 'function' ? fetch : undefined);

  if (!baseUrl || !fetchFn) {
    const mirror = buildWorkshop2EdoSignoffMirror({
      dossier: input.dossier,
      provider,
      edoStatus: 'pending',
      env,
    });
    return {
      ok: false,
      error: 'edo_api_url_not_configured',
      dossier: { ...input.dossier, edoSignoffMirror: mirror },
      mirror,
    };
  }

  if (provider === 'kontur') {
    const probe = await probeWorkshop2KonturDiadocHttp({ env, fetchImpl: fetchFn });
    if (probe.probed && !probe.ok) {
      const mirror = buildWorkshop2EdoSignoffMirror({
        dossier: input.dossier,
        provider,
        edoStatus: 'pending',
        env,
      });
      return {
        ok: false,
        error: 'kontur_diadoc_unreachable',
        dossier: { ...input.dossier, edoSignoffMirror: mirror },
        mirror,
      };
    }
  }

  try {
    const res = await fetchFn(baseUrl.replace(/\/$/, '') + '/signoff-request', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        collectionId: input.collectionId,
        articleId: input.articleId,
        actor: input.actor,
        provider,
      }),
      signal: AbortSignal.timeout(12_000),
    });
    if (!res.ok) {
      const mirror = buildWorkshop2EdoSignoffMirror({
        dossier: input.dossier,
        provider,
        edoStatus: 'pending',
        env,
      });
      return {
        ok: false,
        error: `edo_http_${res.status}`,
        dossier: { ...input.dossier, edoSignoffMirror: mirror },
        mirror,
      };
    }
    const json = (await res.json()) as {
      requestId?: string;
      status?: string;
      signedAt?: string;
    };
    const edoStatus =
      json.status === 'signed'
        ? ('signed' as const)
        : json.status === 'rejected'
          ? ('rejected' as const)
          : ('pending' as const);
    const mirror = buildWorkshop2EdoSignoffMirror({
      dossier: input.dossier,
      provider,
      edoStatus,
      requestId: json.requestId ?? null,
      signedAt: json.signedAt ?? null,
      env,
    });
    return {
      ok: edoStatus === 'signed' || edoStatus === 'pending',
      dossier: { ...input.dossier, edoSignoffMirror: mirror },
      mirror,
    };
  } catch (e) {
    const mirror = buildWorkshop2EdoSignoffMirror({
      dossier: input.dossier,
      provider,
      edoStatus: 'pending',
      env,
    });
    return {
      ok: false,
      error: e instanceof Error ? e.message : 'edo_unreachable',
      dossier: { ...input.dossier, edoSignoffMirror: mirror },
      mirror,
    };
  }
}

/** Wave 8 P2: poll EDO status (kontur/sbis) — fail-closed без URL. */
export async function pollWorkshop2EdoSignoffStatus(input: {
  dossier: Workshop2DossierPhase1;
  collectionId: string;
  articleId: string;
  requestId?: string | null;
  env?: Record<string, string | undefined>;
  fetchImpl?: typeof fetch;
}): Promise<{
  ok: boolean;
  dossier: Workshop2DossierPhase1;
  mirror: Workshop2EdoSignoffMirror;
  error?: string;
}> {
  const env = input.env ?? process.env;
  const provider = resolveWorkshop2EdoProvider(env);
  const mirrorExisting = input.dossier.edoSignoffMirror;

  if (provider === 'none' || provider === 'mock') {
    const mirror = buildWorkshop2EdoSignoffMirror({
      dossier: input.dossier,
      provider,
      edoStatus: mirrorExisting?.edoStatus ?? 'draft',
      requestId: mirrorExisting?.requestId ?? input.requestId ?? null,
      signedAt: mirrorExisting?.signedAt ?? null,
      env,
    });
    return {
      ok: provider === 'mock' && mirror.edoStatus === 'signed',
      dossier: { ...input.dossier, edoSignoffMirror: mirror },
      mirror,
      error: provider === 'none' ? 'edo_provider_not_configured' : undefined,
    };
  }

  const baseUrl =
    provider === 'kontur'
      ? resolveWorkshop2KonturEdoBaseUrl(env)
      : env.WORKSHOP2_SBIS_EDO_API_URL?.trim();
  const fetchFn = input.fetchImpl ?? (typeof fetch === 'function' ? fetch : undefined);
  const requestId = input.requestId ?? mirrorExisting?.requestId ?? null;

  if (provider === 'kontur' && baseUrl && fetchFn) {
    const probe = await probeWorkshop2KonturDiadocHttp({ env, fetchImpl: fetchFn });
    if (probe.probed && !probe.ok) {
      const mirror = buildWorkshop2EdoSignoffMirror({
        dossier: input.dossier,
        provider,
        edoStatus: mirrorExisting?.edoStatus ?? 'pending',
        requestId,
        env,
      });
      return {
        ok: false,
        error: 'kontur_diadoc_unreachable',
        dossier: { ...input.dossier, edoSignoffMirror: mirror },
        mirror,
      };
    }
  }

  if (!baseUrl || !fetchFn || !requestId) {
    const mirror = buildWorkshop2EdoSignoffMirror({
      dossier: input.dossier,
      provider,
      edoStatus: mirrorExisting?.edoStatus ?? 'pending',
      requestId,
      env,
    });
    return {
      ok: false,
      error: !requestId ? 'edo_request_id_missing' : 'edo_api_url_not_configured',
      dossier: { ...input.dossier, edoSignoffMirror: mirror },
      mirror,
    };
  }

  try {
    const res = await fetchFn(
      `${baseUrl.replace(/\/$/, '')}/signoff-status/${encodeURIComponent(requestId)}`,
      { method: 'GET', signal: AbortSignal.timeout(12_000) }
    );
    if (!res.ok) {
      const mirror = buildWorkshop2EdoSignoffMirror({
        dossier: input.dossier,
        provider,
        edoStatus: mirrorExisting?.edoStatus ?? 'pending',
        requestId,
        env,
      });
      return {
        ok: false,
        error: `edo_poll_http_${res.status}`,
        dossier: { ...input.dossier, edoSignoffMirror: mirror },
        mirror,
      };
    }
    const json = (await res.json()) as {
      status?: string;
      signedAt?: string;
    };
    const edoStatus =
      json.status === 'signed'
        ? ('signed' as const)
        : json.status === 'rejected'
          ? ('rejected' as const)
          : ('pending' as const);
    const mirror = buildWorkshop2EdoSignoffMirror({
      dossier: input.dossier,
      provider,
      edoStatus,
      requestId,
      signedAt: json.signedAt ?? mirrorExisting?.signedAt ?? null,
      env,
    });
    return {
      ok: true,
      dossier: { ...input.dossier, edoSignoffMirror: mirror },
      mirror,
    };
  } catch (e) {
    const mirror = buildWorkshop2EdoSignoffMirror({
      dossier: input.dossier,
      provider,
      edoStatus: mirrorExisting?.edoStatus ?? 'pending',
      requestId,
      env,
    });
    return {
      ok: false,
      error: e instanceof Error ? e.message : 'edo_poll_unreachable',
      dossier: { ...input.dossier, edoSignoffMirror: mirror },
      mirror,
    };
  }
}

export function evaluateWorkshop2EdoSignoffHandoffGate(
  dossier: Workshop2DossierPhase1,
  env?: Record<string, string | undefined>
): Workshop2HandoffReadinessCheck | null {
  if (!isWorkshop2EdoSignoffRequired(env)) return null;
  const mirror = dossier.edoSignoffMirror;
  if (!mirror) {
    return {
      id: 'edo.signoff.missing',
      severity: 'blocker',
      messageRu:
        'ЭП Gold Sample: запросите подпись через ЭДО (Контур/СБИС) перед передачей в массовый пошив.',
    };
  }
  if (mirror.blockerHandoff || mirror.edoStatus !== 'signed') {
    const statusRu = mirror.statusLabelRu ?? workshop2EdoStatusLabelRu(mirror.edoStatus);
    return {
      id: 'edo.signoff.not_signed',
      severity: 'blocker',
      messageRu:
        mirror.hintRu ??
        `ЭП Gold Sample: статус «${statusRu}» — требуется «Подписано» перед handoff.`,
    };
  }
  return null;
}
