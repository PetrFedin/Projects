/**
 * Отправка агрегированного снимка сессии досье на сервер (лог / дальнейший ETL).
 * Вызовы throttled; ошибки сети игнорируются — UX не блокируется.
 *
 * ML / MLE (следующий уровень):
 * — Периодический flush (`source: workshop2_phase1_dossier`) может включать `mlNextStep` из sessionStorage
 *   (предупреждения, decisionItems, primaryAction, bundleHash, routeStages).
 * — Смена вкладки/секции (`source: workshop2_next_step_feedback`) — тот же снимок + `outcome` (куда ушёл пользователь,
 *   navigationSeq, msSinceSnapshot, hitRecommendedWithinTwoNavs). Оценка офлайн: доля hit в 1–2 шага, время до закрытия блока.
 */

import {
  getW2ContourMilestones,
  getW2DossierAbandonCount,
  getW2DossierPersistStats,
  getW2DossierSessionOpenedAtMs,
} from '@/lib/production/workshop2-dossier-session-metrics';
import {
  w2ReadNextStepMlBuffer,
  type W2NextStepBuffered,
  type W2NextStepMlSnapshot,
} from '@/lib/production/workshop2-dossier-next-step-telemetry';

const lastFlushMs = new Map<string, number>();
const MIN_INTERVAL_MS = 30_000;

const ACTOR_LS = 'w2-tz-metrics-actor-v1';
const TEAM_LS = 'w2-tz-metrics-team-v1';

/** Стабильный анонимный id браузера (не email). Создаётся один раз в localStorage. */
export function getW2TzMetricsClientActorId(): string | undefined {
  if (typeof localStorage === 'undefined') return undefined;
  try {
    let id = localStorage.getItem(ACTOR_LS)?.trim();
    if (!id) {
      id =
        typeof crypto !== 'undefined' && crypto.randomUUID
          ? crypto.randomUUID()
          : `a-${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;
      localStorage.setItem(ACTOR_LS, id);
    }
    return id;
  } catch {
    return undefined;
  }
}

/**
 * Опциональная метка «команды» для срезов (задаётся вручную: localStorage w2-tz-metrics-team-v1).
 * Не передаём ФИО/email — только произвольный тег (например slug бренда).
 */
export function getW2TzMetricsTeamTag(): string | undefined {
  if (typeof localStorage === 'undefined') return undefined;
  try {
    const t = localStorage.getItem(TEAM_LS)?.trim();
    return t ? t.slice(0, 120) : undefined;
  } catch {
    return undefined;
  }
}

/**
 * Доп. контекст для срезов «кто / какая организация».
 * Не передаём email/ФИО. Доступ к сырым рядам — только с секретом чтения метрик.
 * Отключить отправку: NEXT_PUBLIC_W2_DOSSIER_METRICS_DISABLE_USER_CONTEXT=1
 */
export type Workshop2DossierMetricsFlushContext = {
  /** uid из профиля (внутренний id платформы). */
  appUserUid?: string | null;
  /** activeOrganizationId из профиля (тенант). */
  orgId?: string | null;
  /** Публичный SKU (без персональных данных) — для срезов ML next-step. */
  sku?: string | null;
};

function isW2MetricsStampClientEnabled(): boolean {
  return process.env.NEXT_PUBLIC_W2_METRICS_STAMP_ENABLED === 'true';
}

let cachedMetricsStamp: string | null = null;
let cachedMetricsStampUntil = 0;
let stampRefreshInFlight: Promise<void> | null = null;

async function fetchW2MetricsStampFromServer(ctx?: Workshop2DossierMetricsFlushContext): Promise<void> {
  if (typeof window === 'undefined' || !isW2MetricsStampClientEnabled()) return;
  const uid =
    ctx?.appUserUid?.trim() ||
    getW2TzMetricsClientActorId()?.trim() ||
    '';
  if (!uid) return;

  try {
    const headers: Record<string, string> = { 'Content-Type': 'application/json' };
    const token = typeof localStorage !== 'undefined' ? localStorage.getItem('syntha_access_token')?.trim() : '';
    if (token) headers.Authorization = `Bearer ${token}`;
    const res = await fetch('/api/production/workshop2-dossier-metrics/stamp', {
      method: 'POST',
      headers,
      credentials: 'same-origin',
      body: JSON.stringify({
        uid,
        orgId: ctx?.orgId?.trim() ?? '',
      }),
    });
    if (!res.ok) return;
    const j = (await res.json()) as { ok?: boolean; stamp?: string; ttlSec?: number };
    if (j.ok && j.stamp) {
      cachedMetricsStamp = j.stamp;
      const ttlMs = (typeof j.ttlSec === 'number' ? j.ttlSec : 900) * 1000;
      cachedMetricsStampUntil = Date.now() + Math.max(45_000, ttlMs - 120_000);
    }
  } catch {
    /* ignore */
  }
}

async function ensureW2MetricsStampFresh(ctx?: Workshop2DossierMetricsFlushContext): Promise<void> {
  if (!isW2MetricsStampClientEnabled()) return;
  if (cachedMetricsStamp && Date.now() < cachedMetricsStampUntil) return;
  if (stampRefreshInFlight) {
    await stampRefreshInFlight;
    return;
  }
  stampRefreshInFlight = (async () => {
    await fetchW2MetricsStampFromServer(ctx);
  })().finally(() => {
    stampRefreshInFlight = null;
  });
  await stampRefreshInFlight;
}

/** Прогрев stamp при открытии досье (если включён NEXT_PUBLIC_W2_METRICS_STAMP_ENABLED). */
export function warmupW2MetricsStamp(ctx?: Workshop2DossierMetricsFlushContext): void {
  void ensureW2MetricsStampFresh(ctx);
}

/** Снимок + исход рекомендации для обучения ранжирования следующего шага (без PII). */
export type W2MlNextStepPayload = {
  snapshotHash: string;
  snapshot: W2NextStepMlSnapshot;
  /** Заполняется в событии навигации после снимка. */
  outcome?: {
    mainTab: string;
    dossierSection?: string;
    /** Сколько смен вкладки/секции с момента актуального snapshotHash. */
    navigationSeq: number;
    msSinceSnapshot: number;
    /** Совпадение с rule-based primaryAction.tab. */
    hitRecommendedTab: boolean;
    /** Совпадение с primaryAction.dossierSection, если оно было. */
    hitRecommendedSection: boolean;
    /** hitRecommendedTab && (нет целевой секции || hitRecommendedSection), в пределах 1–2 навигаций. */
    hitRecommendedWithinTwoNavs: boolean;
  };
};

export type Workshop2DossierMetricsPayload = {
  capturedAt: string;
  collectionId: string;
  articleId: string;
  tabOpenMinutes: number | null;
  persistSuccessCount: number;
  abandonCount: number;
  contour: ReturnType<typeof getW2ContourMilestones>;
  /** Периодический снимок досье | событие навигации после рекомендации (ML pipeline). */
  source: 'workshop2_phase1_dossier' | 'workshop2_next_step_feedback';
  /** Анонимный id клиента (браузер). */
  clientActorId?: string;
  /** Произвольный тег команды/бренда (опционально). */
  teamTag?: string;
  /** Внутренний id пользователя (если не отключено env). */
  appUserUid?: string;
  /** Активная организация (тенант). */
  orgId?: string;
  /** Публичный код модели (опционально). */
  sku?: string;
  /**
   * Рядом с периодическим flush: последний буферизованный снимок next-step (фичи для ETL).
   * В событии `workshop2_next_step_feedback` — тот же снимок + outcome.
   */
  mlNextStep?: W2MlNextStepPayload;
};

function shouldAttachUserContext(): boolean {
  if (typeof process === 'undefined') return true;
  return process.env.NEXT_PUBLIC_W2_DOSSIER_METRICS_DISABLE_USER_CONTEXT !== '1';
}

function clip(s: string, max: number): string {
  const t = s.trim();
  return t.length <= max ? t : t.slice(0, max);
}

function mlBufferToPayload(buf: W2NextStepBuffered): W2MlNextStepPayload {
  return {
    snapshotHash: buf.snapshotHash,
    snapshot: buf.snapshot,
  };
}

export function buildWorkshop2DossierMetricsPayload(
  collectionId: string,
  articleId: string,
  ctx?: Workshop2DossierMetricsFlushContext
): Workshop2DossierMetricsPayload {
  const now = Date.now();
  const opened = getW2DossierSessionOpenedAtMs(collectionId, articleId);
  const tabOpenMinutes =
    opened != null ? Math.max(0, Math.floor((now - opened) / 60_000)) : null;
  const persist = getW2DossierPersistStats(collectionId, articleId);
  const attach = shouldAttachUserContext();
  const uid =
    attach && ctx?.appUserUid?.trim() ? clip(ctx.appUserUid, 128) : undefined;
  const oid = attach && ctx?.orgId?.trim() ? clip(ctx.orgId, 128) : undefined;
  const skuRaw = ctx?.sku?.trim();
  const sku = skuRaw ? clip(skuRaw, 96) : undefined;
  const buf = typeof window !== 'undefined' ? w2ReadNextStepMlBuffer(collectionId, articleId) : null;
  return {
    capturedAt: new Date().toISOString(),
    collectionId,
    articleId,
    tabOpenMinutes,
    persistSuccessCount: persist?.successCount ?? 0,
    abandonCount: getW2DossierAbandonCount(collectionId, articleId),
    contour: getW2ContourMilestones(collectionId, articleId),
    source: 'workshop2_phase1_dossier',
    clientActorId: getW2TzMetricsClientActorId(),
    teamTag: getW2TzMetricsTeamTag(),
    ...(uid ? { appUserUid: uid } : {}),
    ...(oid ? { orgId: oid } : {}),
    ...(sku ? { sku } : {}),
    ...(buf ? { mlNextStep: mlBufferToPayload(buf) } : {}),
  };
}

/** POST одной строки метрик (stamp + ключи); ошибки не пробрасываются. */
export async function postWorkshop2DossierMetricsRow(
  row: Workshop2DossierMetricsPayload,
  ctx?: Workshop2DossierMetricsFlushContext
): Promise<void> {
  if (typeof window === 'undefined') return;
  await ensureW2MetricsStampFresh(ctx);
  const headers: Record<string, string> = { 'Content-Type': 'application/json' };
  const postKey = process.env.NEXT_PUBLIC_W2_DOSSIER_METRICS_WRITE_KEY?.trim();
  if (postKey) headers['X-W2-Metrics-Write-Key'] = postKey;
  if (cachedMetricsStamp) headers['X-W2-Metrics-Stamp'] = cachedMetricsStamp;
  try {
    await fetch('/api/production/workshop2-dossier-metrics', {
      method: 'POST',
      headers,
      body: JSON.stringify(row),
      keepalive: true,
    });
  } catch {
    /* offline / adblock */
  }
}

const lastNavFlushMs = new Map<string, number>();
const NAV_MIN_INTERVAL_MS = 400;

/**
 * Событие смены вкладки/секции после rule-based рекомендации (обучение ранжирования).
 * Throttle на пару коллекция+артикул, чтобы не засорять лог при быстром клике.
 */
export function flushW2NextStepFeedbackToServer(
  collectionId: string,
  articleId: string,
  args: {
    sku?: string | null;
    buffer: W2NextStepBuffered | null;
    mainTab: string;
    dossierSection?: string | null;
    navigationSeq: number;
  },
  ctx?: Workshop2DossierMetricsFlushContext
): void {
  if (typeof window === 'undefined' || !args.buffer) return;
  const k = `nav::${collectionId}::${articleId}`;
  const now = Date.now();
  if (now - (lastNavFlushMs.get(k) ?? 0) < NAV_MIN_INTERVAL_MS) return;
  lastNavFlushMs.set(k, now);

  const opened = getW2DossierSessionOpenedAtMs(collectionId, articleId);
  const tabOpenMinutes =
    opened != null ? Math.max(0, Math.floor((now - opened) / 60_000)) : null;
  const persist = getW2DossierPersistStats(collectionId, articleId);
  const attach = shouldAttachUserContext();
  const uid =
    attach && ctx?.appUserUid?.trim() ? clip(ctx.appUserUid, 128) : undefined;
  const oid = attach && ctx?.orgId?.trim() ? clip(ctx.orgId, 128) : undefined;
  const skuRaw = args.sku?.trim() || ctx?.sku?.trim();
  const sku = skuRaw ? clip(skuRaw, 96) : undefined;

  const recTab = args.buffer.recommendedTab;
  const recSec = args.buffer.recommendedDossierSection;
  const hitTab = args.mainTab === recTab;
  const secNorm = args.dossierSection?.trim() || undefined;
  const hitSec = !recSec || secNorm === recSec;
  const hitRecommendedWithinTwoNavs =
    args.navigationSeq >= 1 && args.navigationSeq <= 2 && hitTab && hitSec;

  const msSinceSnapshot = Math.max(0, now - args.buffer.capturedAtMs);

  const row: Workshop2DossierMetricsPayload = {
    capturedAt: new Date().toISOString(),
    collectionId,
    articleId,
    tabOpenMinutes,
    persistSuccessCount: persist?.successCount ?? 0,
    abandonCount: getW2DossierAbandonCount(collectionId, articleId),
    contour: getW2ContourMilestones(collectionId, articleId),
    source: 'workshop2_next_step_feedback',
    clientActorId: getW2TzMetricsClientActorId(),
    teamTag: getW2TzMetricsTeamTag(),
    ...(uid ? { appUserUid: uid } : {}),
    ...(oid ? { orgId: oid } : {}),
    ...(sku ? { sku } : {}),
    mlNextStep: {
      snapshotHash: args.buffer.snapshotHash,
      snapshot: args.buffer.snapshot,
      outcome: {
        mainTab: args.mainTab,
        dossierSection: secNorm,
        navigationSeq: args.navigationSeq,
        msSinceSnapshot,
        hitRecommendedTab: hitTab,
        hitRecommendedSection: Boolean(recSec) ? secNorm === recSec : true,
        hitRecommendedWithinTwoNavs,
      },
    },
  };

  void postWorkshop2DossierMetricsRow(row, ctx);
}

/** Отправить снимок (не чаще MIN_INTERVAL_MS на пару коллекция+артикул). */
export function flushW2DossierMetricsToServer(
  collectionId: string,
  articleId: string,
  ctx?: Workshop2DossierMetricsFlushContext
): void {
  if (typeof window === 'undefined') return;
  const k = `${collectionId}::${articleId}`;
  const now = Date.now();
  if (now - (lastFlushMs.get(k) ?? 0) < MIN_INTERVAL_MS) return;
  lastFlushMs.set(k, now);
  const body = buildWorkshop2DossierMetricsPayload(collectionId, articleId, ctx);
  void postWorkshop2DossierMetricsRow(body, ctx);
}
