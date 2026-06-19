/**
 * Wave 9 RU: маркировка «Честный ЗНАК» — journal-only без fake ACK от ЦРПТ.
 */
import type {
  Workshop2DossierPhase1,
  Workshop2MarkingHonestSignMirror,
} from '@/lib/production/workshop2-dossier-phase1.types';
import type { Workshop2ProcessEnvLike } from '@/lib/production/workshop2-live-integration-probes-env';

export type { Workshop2MarkingHonestSignMirror };

export function isWorkshop2MarkingApiConfigured(
  env: Workshop2ProcessEnvLike = process.env
): boolean {
  return Boolean(String(env.WORKSHOP2_MARKING_API_URL ?? '').trim());
}

export function probeWorkshop2MarkingHonestSign(env: Workshop2ProcessEnvLike = process.env): {
  integrationId: 'marking_honest_sign';
  configured: boolean;
  live: boolean;
  journalOnly: boolean;
  messageRu: string;
} {
  const url = String(env.WORKSHOP2_MARKING_API_URL ?? '').trim();
  const configured = Boolean(url);
  return {
    integrationId: 'marking_honest_sign',
    configured,
    live: false,
    journalOnly: true,
    messageRu: configured
      ? 'Маркировка: URL задан — заказы только в journal до подтверждённого ACK ЦРПТ.'
      : 'Маркировка: journal-only (без WORKSHOP2_MARKING_API_URL — без отправки в ЦРПТ).',
  };
}

export function resolveWorkshop2PassportMarkingFields(dossier: Workshop2DossierPhase1): {
  markingRequired: boolean;
  gtin: string | null;
  markingOrderId: string | null;
} {
  const pb = dossier.passportProductionBrief;
  const mirror = dossier.markingHonestSignMirror;
  return {
    markingRequired: Boolean(pb?.markingRequired ?? mirror?.markingRequired),
    gtin: (pb?.gtin ?? mirror?.gtin ?? null)?.trim() || null,
    markingOrderId: (mirror?.markingOrderId ?? pb?.markingOrderId ?? null)?.trim() || null,
  };
}

/** Wave 32: UI state machine для register-order (без fake ACK). */
export type Workshop2MarkingUiStatusRu = 'csv_only' | 'pending_api' | 'registered';

export function resolveWorkshop2MarkingUiStatusRu(input: {
  apiConfigured: boolean;
  crptOrderId?: string | null;
  mirrorStatus?: Workshop2MarkingHonestSignMirror['status'];
  httpOk?: boolean;
}): Workshop2MarkingUiStatusRu {
  if (input.crptOrderId?.trim() || input.mirrorStatus === 'registered') {
    return 'registered';
  }
  if (input.apiConfigured && (input.httpOk || input.mirrorStatus === 'pending_external')) {
    return 'pending_api';
  }
  return 'csv_only';
}

export function workshop2MarkingUiStatusLabelRu(status: Workshop2MarkingUiStatusRu): string {
  switch (status) {
    case 'registered':
      return 'зарегистрировано в ЧЗ';
    case 'pending_api':
      return 'ожидает ответа API';
    default:
      return 'CSV вручную';
  }
}

/** Попытка live HTTP в ЦРПТ (fail-closed — без fake ACK при ошибке сети). */
export async function attemptWorkshop2MarkingHonestSignHttpPost(input: {
  apiUrl: string;
  payload: { gtin: string | null; markingOrderId: string; collectionId: string; articleId: string };
  env?: Workshop2ProcessEnvLike;
  fetchImpl?: typeof fetch;
}): Promise<{
  attempted: true;
  ok: boolean;
  status?: number;
  messageRu: string;
  /** id из тела ответа ЦРПТ — только при 2xx. */
  crptOrderId?: string | null;
}> {
  const url = input.apiUrl.trim();
  if (!url) {
    return { attempted: true, ok: false, messageRu: 'WORKSHOP2_MARKING_API_URL не задан.' };
  }
  const fetchFn = input.fetchImpl ?? (typeof fetch === 'function' ? fetch : undefined);
  if (!fetchFn) {
    return {
      attempted: true,
      ok: false,
      messageRu: 'fetch недоступен — HTTP POST ЧЗ не выполнен.',
    };
  }
  try {
    const res = await fetchFn(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
      body: JSON.stringify({
        gtin: input.payload.gtin,
        orderId: input.payload.markingOrderId,
        collectionId: input.payload.collectionId,
        articleId: input.payload.articleId,
      }),
      signal: AbortSignal.timeout(8_000),
    });
    if (!res.ok) {
      return {
        attempted: true,
        ok: false,
        status: res.status,
        messageRu: `Честный ЗНАК: HTTP ${res.status} — journal-only, без fake ACK.`,
      };
    }
    let crptOrderId: string | null = null;
    try {
      const body = (await res.json()) as { id?: string; orderId?: string };
      crptOrderId = (body.id ?? body.orderId)?.trim() || null;
    } catch {
      crptOrderId = null;
    }
    return {
      attempted: true,
      ok: true,
      status: res.status,
      crptOrderId,
      messageRu: crptOrderId
        ? `Честный ЗНАК: заказ ${crptOrderId} принят API (id из ответа).`
        : 'Честный ЗНАК: HTTP POST принят (без id в теле — journal-only).',
    };
  } catch {
    return {
      attempted: true,
      ok: false,
      messageRu: 'Честный ЗНАК: сеть недоступна — остаёмся в journal-only.',
    };
  }
}

/** Wave 32: одна повторная попытка HTTP POST (prod path, без fake ACK). */
export async function attemptWorkshop2MarkingHonestSignHttpPostWithRetry(input: {
  apiUrl: string;
  payload: { gtin: string | null; markingOrderId: string; collectionId: string; articleId: string };
  env?: Workshop2ProcessEnvLike;
  fetchImpl?: typeof fetch;
}): Promise<
  Awaited<ReturnType<typeof attemptWorkshop2MarkingHonestSignHttpPost>> & {
    retried: boolean;
  }
> {
  const first = await attemptWorkshop2MarkingHonestSignHttpPost(input);
  if (first.ok) {
    return { ...first, retried: false };
  }
  const second = await attemptWorkshop2MarkingHonestSignHttpPost(input);
  return { ...second, retried: true };
}

/** Payload журнала маркировки для dossier_events (PG / file-store). */
export function buildWorkshop2MarkingJournalEventPayload(input: {
  collectionId: string;
  articleId: string;
  gtin: string | null;
  markingOrderId: string;
  uiStatusRu: Workshop2MarkingUiStatusRu;
  actor: string;
  httpOk?: boolean;
  crptOrderId?: string | null;
}): Record<string, unknown> {
  return {
    collectionId: input.collectionId,
    articleId: input.articleId,
    gtin: input.gtin,
    markingOrderId: input.markingOrderId,
    uiStatusRu: input.uiStatusRu,
    uiStatusLabelRu: workshop2MarkingUiStatusLabelRu(input.uiStatusRu),
    actor: input.actor,
    httpOk: Boolean(input.httpOk),
    crptOrderId: input.crptOrderId ?? null,
    journalAt: new Date().toISOString(),
  };
}

export function isWorkshop2MarkingRegisteredForSampleGate(
  dossier: Workshop2DossierPhase1
): boolean {
  const f = resolveWorkshop2PassportMarkingFields(dossier);
  if (f.gtin?.trim()) return true;
  const mirror = dossier.markingHonestSignMirror;
  if (mirror?.status === 'registered') return true;
  if (
    resolveWorkshop2MarkingUiStatusRu({
      apiConfigured: isWorkshop2MarkingApiConfigured(),
      crptOrderId: f.markingOrderId,
      mirrorStatus: mirror?.status,
      httpOk: mirror?.status === 'pending_external' && Boolean(f.markingOrderId),
    }) === 'registered'
  ) {
    return true;
  }
  return false;
}

export function registerWorkshop2MarkingOrderJournal(input: {
  dossier: Workshop2DossierPhase1;
  collectionId: string;
  articleId: string;
  gtin?: string | null;
  markingRequired?: boolean;
  actor: string;
  env?: Workshop2ProcessEnvLike;
}): {
  ok: boolean;
  dossier: Workshop2DossierPhase1;
  mirror: Workshop2MarkingHonestSignMirror;
  error?: string;
  sentToCrpt: boolean;
} {
  const env = input.env ?? process.env;
  const apiUrl = String(env.WORKSHOP2_MARKING_API_URL ?? '').trim();
  const gtin = (input.gtin ?? input.dossier.passportProductionBrief?.gtin ?? '').trim() || null;
  const markingRequired =
    input.markingRequired ?? Boolean(input.dossier.passportProductionBrief?.markingRequired);

  if (!markingRequired && !gtin) {
    return {
      ok: false,
      error: 'marking_not_required',
      sentToCrpt: false,
      dossier: input.dossier,
      mirror: input.dossier.markingHonestSignMirror ?? {
        mirroredAt: new Date().toISOString(),
        markingRequired: false,
        gtin: null,
        markingOrderId: null,
        status: 'draft',
        journalOnly: true,
        hintRu: 'Укажите markingRequired или GTIN в паспорте изделия.',
      },
    };
  }

  const orderId = `mark-journal-${input.collectionId}-${input.articleId}-${Date.now()}`;
  const mirror: Workshop2MarkingHonestSignMirror = {
    mirroredAt: new Date().toISOString(),
    markingRequired: Boolean(markingRequired),
    gtin,
    markingOrderId: orderId,
    status: apiUrl ? 'pending_external' : 'journal_only',
    journalOnly: !apiUrl,
    actor: input.actor,
    hintRu: apiUrl
      ? 'Заказ в journal; при register-order выполняется HTTP POST (без fake ACK).'
      : 'Журнал маркировки (РФ): без WORKSHOP2_MARKING_API_URL — CSV вручную.',
  };

  const passportProductionBrief = {
    ...input.dossier.passportProductionBrief,
    markingRequired: Boolean(markingRequired),
    gtin: gtin ?? undefined,
    markingOrderId: orderId,
  };

  return {
    ok: true,
    sentToCrpt: false,
    dossier: {
      ...input.dossier,
      passportProductionBrief,
      markingHonestSignMirror: mirror,
    },
    mirror,
  };
}

export type Workshop2MarkingWizardStepId = 'gtin' | 'order_journal' | 'await_api';

export type Workshop2MarkingWizardStep = {
  id: Workshop2MarkingWizardStepId;
  labelRu: string;
  status: 'done' | 'active' | 'pending';
  hintRu: string;
};

/** Шаги мастера ЧЗ без fake ACK — при отсутствии API статус «ожидает API». */
export function buildWorkshop2MarkingWizardSteps(
  dossier: Workshop2DossierPhase1,
  env: Workshop2ProcessEnvLike = process.env
): Workshop2MarkingWizardStep[] {
  const fields = resolveWorkshop2PassportMarkingFields(dossier);
  const apiConfigured = isWorkshop2MarkingApiConfigured(env);
  const hasGtin = Boolean(fields.gtin);
  const hasOrder = Boolean(fields.markingOrderId);
  return [
    {
      id: 'gtin',
      labelRu: 'GTIN / признак маркировки',
      status: hasGtin || fields.markingRequired ? 'done' : 'active',
      hintRu: hasGtin
        ? `GTIN: ${fields.gtin}`
        : 'Укажите GTIN в паспорте изделия или включите markingRequired.',
    },
    {
      id: 'order_journal',
      labelRu: 'Журнал заказа кодов',
      status: hasOrder ? 'done' : hasGtin ? 'active' : 'pending',
      hintRu: hasOrder
        ? `Заказ: ${fields.markingOrderId}`
        : 'Зарегистрируйте заказ в journal (без отправки в ЦРПТ).',
    },
    {
      id: 'await_api',
      labelRu: 'Статус интеграции',
      status: apiConfigured ? 'active' : hasOrder ? 'done' : 'pending',
      hintRu: apiConfigured
        ? 'Ожидает API — live ACK только после подтверждённого контракта ЦРПТ.'
        : 'Ожидает API: экспортируйте CSV для загрузки в личный кабинет Честный ЗНАК.',
    },
  ];
}

/** CSV для ручной загрузки в ЛК ЧЗ (без fake CRPT ACK). */
export function buildWorkshop2MarkingHonestSignCsv(input: {
  dossier: Workshop2DossierPhase1;
  collectionId: string;
  articleId: string;
}): string {
  const f = resolveWorkshop2PassportMarkingFields(input.dossier);
  const header = 'collection_id;article_id;gtin;marking_required;marking_order_id;status';
  const row = [
    input.collectionId,
    input.articleId,
    f.gtin ?? '',
    f.markingRequired ? '1' : '0',
    f.markingOrderId ?? '',
    input.dossier.markingHonestSignMirror?.status ?? 'journal_only',
  ].join(';');
  return `${header}\n${row}\n`;
}

/** Связь gate маркировки с экспортом бирки состава (общий GTIN). */
export function workshop2MarkingCompositionLabelGateHintRu(
  dossier: Workshop2DossierPhase1
): string {
  const f = resolveWorkshop2PassportMarkingFields(dossier);
  if (!f.markingRequired) {
    return 'Маркировка не требуется — бирка состава без привязки к ЧЗ.';
  }
  if (!f.gtin) {
    return 'Для ЧЗ укажите GTIN — он же попадёт в PDF бирки состава.';
  }
  return `ЧЗ: GTIN ${f.gtin} — экспортируйте бирку состава и CSV для ЛК.`;
}
