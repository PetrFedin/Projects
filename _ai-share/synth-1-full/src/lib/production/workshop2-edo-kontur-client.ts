/**
 * Wave 32: минимальный клиент Контур Diadoc — POST document + poll status (fail-closed).
 * Без WORKSHOP2_KONTUR_DIADOC_URL — честный 503 с ссылкой на setup, без fake sign.
 */
import {
  resolveWorkshop2KonturEdoBaseUrl,
  workshop2EdoStatusLabelRu,
  type Workshop2EdoSignoffMirror,
} from '@/lib/production/workshop2-edo-signoff';

export const WORKSHOP2_KONTUR_EDO_SETUP_PATH =
  '/brand/production/workshop2/setup#kontur-edo' as const;

/** Diadoc API pattern — тело POST signoff-request (document envelope). */
export type Workshop2KonturDiadocDocumentRequest = {
  collectionId: string;
  articleId: string;
  actor: string;
  documentType: 'gold_sample_signoff';
  titleRu: string;
  metadata?: Record<string, string>;
};

export type Workshop2KonturDiadocPollStatus = 'draft' | 'pending' | 'signed' | 'rejected';

/** Маппинг статусов Diadoc → RU mirror states. */
export function mapWorkshop2KonturDiadocStatusToRu(
  raw: string | null | undefined
): Workshop2KonturDiadocPollStatus {
  const s = String(raw ?? '')
    .trim()
    .toLowerCase();
  if (!s) return 'pending';
  if (s === 'signed' || s === 'completed' || s === 'documentsigned' || s === 'finished') {
    return 'signed';
  }
  if (s === 'rejected' || s === 'declined' || s === 'refused' || s === 'revoked') {
    return 'rejected';
  }
  if (s === 'draft' || s === 'created' || s === 'outboundnotfinished') {
    return 'draft';
  }
  if (
    s.includes('wait') ||
    s.includes('pending') ||
    s.includes('recipient') ||
    s.includes('signature')
  ) {
    return 'pending';
  }
  return 'pending';
}

export function workshop2KonturDiadocStatusLabelRu(
  status: Workshop2KonturDiadocPollStatus
): string {
  return workshop2EdoStatusLabelRu(status);
}

export function buildWorkshop2KonturDiadocDocumentRequest(input: {
  collectionId: string;
  articleId: string;
  actor: string;
}): Workshop2KonturDiadocDocumentRequest {
  return {
    collectionId: input.collectionId,
    articleId: input.articleId,
    actor: input.actor,
    documentType: 'gold_sample_signoff',
    titleRu: `ЭП Gold Sample · ${input.collectionId}/${input.articleId}`,
    metadata: {
      source: 'workshop2-edo-request',
      market: 'ru',
    },
  };
}

export function resolveWorkshop2KonturEdoConfigured(
  env: Record<string, string | undefined> = process.env
): { configured: boolean; baseUrl: string | null } {
  const baseUrl = resolveWorkshop2KonturEdoBaseUrl(env) ?? null;
  return { configured: Boolean(baseUrl), baseUrl };
}

/** Честный 503 когда kontur выбран, но URL не задан. */
export function buildWorkshop2KonturEdoNotConfiguredResponse(): {
  status: 503;
  body: {
    ok: false;
    code: 'kontur_edo_not_configured';
    messageRu: string;
    setupPath: string;
    setupUrl: string;
    envKeys: string[];
  };
} {
  return {
    status: 503,
    body: {
      ok: false,
      code: 'kontur_edo_not_configured',
      messageRu:
        'ЭДО Контур не настроен: задайте WORKSHOP2_KONTUR_DIADOC_URL (или WORKSHOP2_KONTUR_EDO_API_URL). Без URL подпись недоступна — fail-closed.',
      setupPath: WORKSHOP2_KONTUR_EDO_SETUP_PATH,
      setupUrl: WORKSHOP2_KONTUR_EDO_SETUP_PATH,
      envKeys: [
        'WORKSHOP2_EDO_PROVIDER',
        'WORKSHOP2_KONTUR_DIADOC_URL',
        'WORKSHOP2_KONTUR_EDO_API_URL',
      ],
    },
  };
}

export async function postWorkshop2KonturDiadocSignoffRequest(input: {
  env?: Record<string, string | undefined>;
  document: Workshop2KonturDiadocDocumentRequest;
  fetchImpl?: typeof fetch;
}): Promise<
  | {
      ok: true;
      requestId: string;
      status: Workshop2KonturDiadocPollStatus;
      signedAt?: string | null;
    }
  | { ok: false; error: string; httpStatus?: number; notConfigured?: boolean }
> {
  const env = input.env ?? process.env;
  const { configured, baseUrl } = resolveWorkshop2KonturEdoConfigured(env);
  if (!configured || !baseUrl) {
    return { ok: false, error: 'kontur_edo_not_configured', notConfigured: true };
  }
  const fetchFn = input.fetchImpl ?? (typeof fetch === 'function' ? fetch : undefined);
  if (!fetchFn) {
    return { ok: false, error: 'fetch_unavailable' };
  }
  try {
    const res = await fetchFn(`${baseUrl.replace(/\/$/, '')}/signoff-request`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
      body: JSON.stringify(input.document),
      signal: AbortSignal.timeout(12_000),
    });
    if (!res.ok) {
      return { ok: false, error: `kontur_http_${res.status}`, httpStatus: res.status };
    }
    const json = (await res.json()) as {
      requestId?: string;
      id?: string;
      status?: string;
      signedAt?: string;
    };
    const requestId = (json.requestId ?? json.id)?.trim();
    if (!requestId) {
      return { ok: false, error: 'kontur_missing_request_id', httpStatus: res.status };
    }
    const status = mapWorkshop2KonturDiadocStatusToRu(json.status);
    return {
      ok: true,
      requestId,
      status,
      signedAt: json.signedAt ?? null,
    };
  } catch (e) {
    return {
      ok: false,
      error: e instanceof Error ? e.message : 'kontur_unreachable',
    };
  }
}

export async function pollWorkshop2KonturDiadocSignoffStatus(input: {
  requestId: string;
  env?: Record<string, string | undefined>;
  fetchImpl?: typeof fetch;
}): Promise<
  | {
      ok: true;
      status: Workshop2KonturDiadocPollStatus;
      signedAt?: string | null;
      statusLabelRu: string;
    }
  | { ok: false; error: string; notConfigured?: boolean; httpStatus?: number }
> {
  const env = input.env ?? process.env;
  const { configured, baseUrl } = resolveWorkshop2KonturEdoConfigured(env);
  if (!configured || !baseUrl) {
    return { ok: false, error: 'kontur_edo_not_configured', notConfigured: true };
  }
  const fetchFn = input.fetchImpl ?? (typeof fetch === 'function' ? fetch : undefined);
  if (!fetchFn) {
    return { ok: false, error: 'fetch_unavailable' };
  }
  try {
    const res = await fetchFn(
      `${baseUrl.replace(/\/$/, '')}/signoff-status/${encodeURIComponent(input.requestId)}`,
      { method: 'GET', signal: AbortSignal.timeout(12_000) }
    );
    if (!res.ok) {
      return { ok: false, error: `kontur_poll_http_${res.status}`, httpStatus: res.status };
    }
    const json = (await res.json()) as { status?: string; signedAt?: string };
    const status = mapWorkshop2KonturDiadocStatusToRu(json.status);
    return {
      ok: true,
      status,
      signedAt: json.signedAt ?? null,
      statusLabelRu: workshop2KonturDiadocStatusLabelRu(status),
    };
  } catch (e) {
    return {
      ok: false,
      error: e instanceof Error ? e.message : 'kontur_poll_unreachable',
    };
  }
}

export function mirrorFromWorkshop2KonturPoll(input: {
  status: Workshop2KonturDiadocPollStatus;
  requestId: string;
  signedAt?: string | null;
}): Pick<Workshop2EdoSignoffMirror, 'edoStatus' | 'statusLabelRu'> {
  return {
    edoStatus: input.status,
    statusLabelRu: workshop2KonturDiadocStatusLabelRu(input.status),
  };
}

/** Шаги мастера «Подключение Контур» для setup UI. */
export function buildWorkshop2KonturEdoSetupWizardSteps(
  env: Record<string, string | undefined> = process.env
): {
  id: string;
  labelRu: string;
  done: boolean;
  envKey?: string;
  hintRu: string;
}[] {
  const provider = String(env.WORKSHOP2_EDO_PROVIDER ?? '')
    .trim()
    .toLowerCase();
  const { configured, baseUrl } = resolveWorkshop2KonturEdoConfigured(env);
  return [
    {
      id: 'provider',
      labelRu: 'Провайдер ЭДО',
      done: provider === 'kontur',
      envKey: 'WORKSHOP2_EDO_PROVIDER=kontur',
      hintRu:
        provider === 'kontur'
          ? 'WORKSHOP2_EDO_PROVIDER=kontur'
          : 'Установите WORKSHOP2_EDO_PROVIDER=kontur (не mock для live).',
    },
    {
      id: 'diadoc_url',
      labelRu: 'URL API Diadoc',
      done: configured,
      envKey: 'WORKSHOP2_KONTUR_DIADOC_URL',
      hintRu: configured
        ? `Base URL: ${baseUrl}`
        : 'Задайте WORKSHOP2_KONTUR_DIADOC_URL — без URL API вернёт 503 (fail-closed).',
    },
    {
      id: 'health_probe',
      labelRu: 'Health probe',
      done: configured,
      hintRu: 'HEAD /health на base URL — probeWorkshop2KonturDiadocHttp в integration-probes.',
    },
    {
      id: 'human_signoff',
      labelRu: 'UAT human sign-off',
      done: false,
      hintRu: 'После env: POST edo-request → poll edo-status до «Подписано» в кабинете Diadoc.',
    },
  ];
}
