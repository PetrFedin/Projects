/**
 * Block C / Wave 45 (#4, #10): PG-first hub onboarding + inventory.
 * localStorage — read-on-miss cache only; при online PG выигрывает при конфликте.
 */
import type { Workshop2DossierPhase1 } from '@/lib/production/workshop2-dossier-phase1.types';
import {
  isWorkshop2HubOnboardingDone,
  isWorkshop2HubWorkspaceOpened,
  loadWorkshop2HubOnboardingRole,
} from '@/lib/production/workshop2-hub-onboarding-storage';
import { detectWorkshop2HubInventoryOverlayDrift } from '@/lib/production/workshop2-hub-inventory-pg-overlay';
import {
  removeWorkshop2Phase1Dossier,
  workshop2Phase1DossierStorageKey,
} from '@/lib/production/workshop2-phase1-dossier-storage';

export type Workshop2HubPgOnlyBackendStatus = 'server' | 'offline' | 'local_only';

/** Wave 4 #11: server PG-only — read/write только PG; localStorage read-on-miss cache. */
export function isWorkshop2PgOnlyMode(env?: Record<string, string | undefined>): boolean {
  const server = String(env?.WORKSHOP2_PG_ONLY ?? process.env.WORKSHOP2_PG_ONLY ?? '')
    .trim()
    .toLowerCase();
  if (server === 'true' || server === '1') return true;
  const client = String(
    env?.NEXT_PUBLIC_WORKSHOP2_PG_ONLY ?? process.env.NEXT_PUBLIC_WORKSHOP2_PG_ONLY ?? ''
  ).trim();
  return client === '1' || client.toLowerCase() === 'true';
}

export function isWorkshop2HubPgServerAvailable(status: Workshop2HubPgOnlyBackendStatus): boolean {
  return status === 'server';
}

/** Онбординг: dossier PG → иначе LS read-on-miss (не primary write). */
export function resolveWorkshop2HubOnboardingStatePgFirst(
  dossier: Workshop2DossierPhase1,
  opts?: { backendStatus?: Workshop2HubPgOnlyBackendStatus }
): NonNullable<Workshop2DossierPhase1['hubOnboardingState']> {
  const backendStatus = opts?.backendStatus ?? 'server';
  const fromDossier = dossier.hubOnboardingState;
  if (fromDossier?.source === 'dossier') {
    return fromDossier;
  }
  if (isWorkshop2HubPgServerAvailable(backendStatus) && fromDossier) {
    return { ...fromDossier, source: 'dossier' };
  }
  const lsDone = isWorkshop2HubOnboardingDone();
  const lsWorkspace = isWorkshop2HubWorkspaceOpened();
  if (!fromDossier && !lsDone && !lsWorkspace) {
    return {
      done: false,
      workspaceOpened: false,
      role: loadWorkshop2HubOnboardingRole(),
      source: 'browser_storage',
    };
  }
  return {
    done: fromDossier?.done ?? lsDone,
    workspaceOpened: fromDossier?.workspaceOpened ?? lsWorkspace,
    role: fromDossier?.role ?? loadWorkshop2HubOnboardingRole(),
    completedAt: fromDossier?.completedAt,
    source: fromDossier?.source ?? 'browser_storage',
  };
}

/** Drift: LS cache явно расходится с PG hubOnboardingState (только если LS key есть). */
export function detectWorkshop2HubOnboardingDrift(dossier: Workshop2DossierPhase1): boolean {
  const pg = dossier.hubOnboardingState;
  if (pg?.source !== 'dossier') return false;
  if (typeof localStorage === 'undefined') return false;
  let lsDone: boolean | null = null;
  let lsWorkspace: boolean | null = null;
  try {
    const raw = localStorage.getItem('synth.w2.hubOnboarding.v1');
    if (raw === null) return false;
    lsDone = raw === 'done';
    lsWorkspace = localStorage.getItem('synth.w2.hubOnboarding.workspaceOpened.v1') === '1';
  } catch {
    return false;
  }
  if (lsDone !== pg.done) return true;
  if (lsWorkspace !== null && lsWorkspace !== pg.workspaceOpened) return true;
  return false;
}

export function buildWorkshop2HubOnboardingMirrorPgFirst(
  dossier: Workshop2DossierPhase1,
  opts?: { backendStatus?: Workshop2HubPgOnlyBackendStatus }
): NonNullable<Workshop2DossierPhase1['hubOnboardingMirror']> {
  const state = resolveWorkshop2HubOnboardingStatePgFirst(dossier, opts);
  const driftDetected = detectWorkshop2HubOnboardingDrift(dossier);
  const pgPrimary = state.source === 'dossier';
  const blockerSampleOrder = !state.done;

  let hintRu: string | undefined;
  if (driftDetected) {
    hintRu = 'Drift онбординга local↔PG — откройте артикул после синхронизации с сервером.';
  } else if (blockerSampleOrder) {
    hintRu = 'Онбординг хаба не завершён — пройдите чеклист перед заказом образца.';
  } else if (pgPrimary) {
    hintRu = 'Онбординг зафиксирован в PG досье (server-first).';
  }

  return {
    mirroredAt: new Date().toISOString(),
    done: state.done,
    workspaceOpened: state.workspaceOpened,
    role: state.role,
    source: state.source,
    driftDetected,
    pgPrimary,
    blockerSampleOrder,
    hintRu,
  };
}

/** После успешного PG PUT inventory/onboarding — сбросить LS-кэш досье (read-on-miss). */
export function invalidateWorkshop2HubLocalDossierCacheEntry(input: {
  collectionId: string;
  articleId: string;
}): void {
  removeWorkshop2Phase1Dossier(input.collectionId, input.articleId);
}

export function summarizeWorkshop2HubInventoryDriftBatch(input: {
  localMap: Record<string, Workshop2DossierPhase1>;
  mergedMap: Record<string, Workshop2DossierPhase1>;
  articles: { collectionId: string; articleId: string }[];
}): { overlaidCount: number; driftCount: number } {
  let overlaidCount = 0;
  let driftCount = 0;
  for (const { collectionId, articleId } of input.articles) {
    const key = workshop2Phase1DossierStorageKey(collectionId, articleId);
    const local = input.localMap[key];
    const merged = input.mergedMap[key];
    if (!merged?.hubPgOverlayAt) continue;
    overlaidCount += 1;
    if (local && detectWorkshop2HubInventoryOverlayDrift({ local, merged })) {
      driftCount += 1;
    }
  }
  return { overlaidCount, driftCount };
}

/** Wave F (#10): inventory mirror — LS только после PG ACK или явный offline/local_only. */
export function evaluateWorkshop2HubInventoryMirrorPersistOutcome(input: {
  backendStatus: Workshop2HubPgOnlyBackendStatus;
  apiOk: boolean;
  apiReason?: string;
}): {
  ok: boolean;
  silentLocalSuccess: boolean;
  messageRu: string;
  httpStatusHint?: 503 | 409;
} {
  if (input.apiOk) {
    return {
      ok: true,
      silentLocalSuccess: false,
      messageRu: 'hubInventoryMirror записан в PG.',
    };
  }
  if (isWorkshop2HubPgServerAvailable(input.backendStatus)) {
    return {
      ok: false,
      silentLocalSuccess: false,
      messageRu:
        input.apiReason === 'postgres_disabled'
          ? 'PostgreSQL недоступен — inventory mirror не записан (fail-closed, без LS).'
          : `PG PUT не выполнен: ${input.apiReason ?? 'offline'} — inventory mirror не в local cache.`,
      httpStatusHint: input.apiReason === 'postgres_disabled' ? 503 : 409,
    };
  }
  return {
    ok: false,
    silentLocalSuccess: false,
    messageRu:
      'Сервер offline — inventory mirror только после восстановления PG (read-on-miss cache без primary write).',
    httpStatusHint: 503,
  };
}

export function summarizeWorkshop2HubPgOnlyBanner(input: {
  backendStatus: Workshop2HubPgOnlyBackendStatus;
  onboardingDrift?: boolean;
  inventoryDriftCount?: number;
  pgOnlyMode?: boolean;
  postgresConfigured?: boolean;
}): { messageRu: string; setupHref: string } | null {
  if (input.pgOnlyMode && !input.postgresConfigured) {
    return {
      messageRu:
        'WORKSHOP2_PG_ONLY активен, но PostgreSQL не подключён — досье не сохранится в PG.',
      setupHref: '/brand/production/workshop2/setup',
    };
  }
  // offline — только Workshop2BackendStatusBanner на hub page (§4.20 dedup)
  if (input.backendStatus === 'offline') {
    return null;
  }
  if (input.onboardingDrift) {
    return {
      messageRu: 'Drift онбординга local↔PG — завершите онбординг в workspace для записи в PG.',
      setupHref: '/brand/production/workshop2/setup',
    };
  }
  if ((input.inventoryDriftCount ?? 0) > 0) {
    return {
      messageRu: `Drift inventory: ${input.inventoryDriftCount} карточек — сохраните инвентарь в досье (workspace).`,
      setupHref: '/brand/production/workshop2/setup',
    };
  }
  return null;
}

/** Wave 5: PG-only — server read paths не используют file/memory fallback. */
export function shouldWorkshop2PgOnlySkipFileFallback(
  env?: Record<string, string | undefined>
): boolean {
  return isWorkshop2PgOnlyMode(env);
}

export type Workshop2PgOnlyReadSurface = 'hub_dossier' | 'contextual_messages' | 'brand_calendar';

export function shouldWorkshop2PgOnlyPreferServerRead(
  surface: Workshop2PgOnlyReadSurface,
  env?: Record<string, string | undefined>
): boolean {
  if (!isWorkshop2PgOnlyMode(env)) return false;
  return (
    surface === 'hub_dossier' || surface === 'contextual_messages' || surface === 'brand_calendar'
  );
}

/** Клиент: contextual chat last-read остаётся в LS; сообщения — только через API/PG. */
export function summarizeWorkshop2PgOnlyReadPolicyHintRu(
  surface: Workshop2PgOnlyReadSurface,
  env?: Record<string, string | undefined>
): string | null {
  if (!isWorkshop2PgOnlyMode(env)) return null;
  switch (surface) {
    case 'contextual_messages':
      return 'PG-only: чат читается только из PostgreSQL (без file-store fallback).';
    case 'brand_calendar':
      return 'PG-only: события календаря Workshop2 — только из PostgreSQL.';
    case 'hub_dossier':
      return 'PG-only: досье хаба — PG primary, localStorage read-on-miss без primary write.';
    default:
      return null;
  }
}
