/**
 * Типизированный клиент REST для workshop2 (слой `/api/workshop2/articles/...`).
 * Для merge/версий/экспорта по-прежнему используйте `workshop2-server-dossier-client`.
 */

import type { Workshop2DossierPhase1 } from '@/lib/production/workshop2-dossier-phase1.types';
import { buildWorkshop2ApiRequestHeaders } from '@/lib/production/workshop2-api-client-headers';

export type Workshop2ApiDossierRecord = {
  collectionId: string;
  articleId: string;
  version: number;
  updatedAt: string;
  dossier: Workshop2DossierPhase1;
};

export type Workshop2ApiEventRecord = {
  id: string;
  collectionId: string;
  articleId: string;
  version: number;
  eventType: string;
  eventPayload: Record<string, unknown>;
  createdAt: string;
};

export type Workshop2ApiLoadResult =
  | { ok: true; data: Workshop2ApiDossierRecord }
  | { ok: false; reason: 'not_found' | 'network_or_server_error' | `http_${number}` };

export type Workshop2ApiPostEventResult =
  | { ok: true; data: { id: string; version: number } }
  | {
      ok: false;
      reason: 'not_found' | 'invalid_payload' | 'network_or_server_error' | `http_${number}`;
    };

export type Workshop2ApiSaveResult =
  | {
      ok: true;
      data: {
        version: number;
        updatedAt: string;
        storeMode?: string;
        messageRu?: string;
      };
    }
  | {
      ok: false;
      reason: 'version_conflict' | 'invalid_payload' | 'network_or_server_error' | `http_${number}`;
      currentVersion?: number;
      conflictFieldsRu?: string[];
    };

function dossierPath(collectionId: string, articleId: string): string {
  return `/api/workshop2/articles/${encodeURIComponent(collectionId)}/${encodeURIComponent(articleId)}/dossier`;
}

function eventsPath(collectionId: string, articleId: string): string {
  return `/api/workshop2/articles/${encodeURIComponent(collectionId)}/${encodeURIComponent(articleId)}/events`;
}

export type Workshop2BatchReadinessRow = {
  collectionId: string;
  articleId: string;
  found: boolean;
  tzOverallPct: number;
  preflightScore: number;
  version?: number;
  updatedAt?: string;
  developmentPath?: {
    labelRu: string;
    hintRu: string;
    criticalPathReady: boolean;
    stepsDone: number;
    stepsTotal: number;
  };
  goldSampleApproved?: boolean;
};

/** POST batch readiness для хаба (PG / file store). */
export async function fetchWorkshop2DossierReadinessBatch(
  items: {
    collectionId: string;
    articleId: string;
    categoryLeafId?: string;
    articleSkuDraft?: string;
    articleNameDraft?: string;
  }[]
): Promise<
  | { ok: true; items: Workshop2BatchReadinessRow[]; postgres: boolean }
  | { ok: false; reason: 'network_or_server_error' | `http_${number}` }
> {
  if (!items.length) return { ok: true, items: [], postgres: false };
  try {
    const res = await fetch('/api/workshop2/articles/dossiers/batch', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...buildWorkshop2ApiRequestHeaders(),
      },
      body: JSON.stringify({ items }),
    });
    if (!res.ok) return { ok: false, reason: `http_${res.status}` };
    const json = (await res.json()) as {
      ok?: boolean;
      items?: Workshop2BatchReadinessRow[];
      postgres?: boolean;
    };
    if (json.ok !== true || !Array.isArray(json.items)) {
      return { ok: false, reason: 'network_or_server_error' };
    }
    return { ok: true, items: json.items, postgres: Boolean(json.postgres) };
  } catch {
    return { ok: false, reason: 'network_or_server_error' };
  }
}

/** GET досье с сервера (file/Postgres store на бэкенде). */
export async function loadWorkshop2DossierFromApi(
  collectionId: string,
  articleId: string
): Promise<Workshop2ApiLoadResult> {
  try {
    const res = await fetch(dossierPath(collectionId, articleId), {
      method: 'GET',
      headers: buildWorkshop2ApiRequestHeaders(),
    });
    if (res.status === 404) return { ok: false, reason: 'not_found' };
    if (!res.ok) return { ok: false, reason: `http_${res.status}` };
    const json = (await res.json()) as {
      ok?: boolean;
      collectionId?: string;
      articleId?: string;
      version?: number;
      updatedAt?: string;
      dossier?: Workshop2DossierPhase1;
    };
    if (
      json.ok !== true ||
      typeof json.version !== 'number' ||
      typeof json.updatedAt !== 'string' ||
      !json.dossier ||
      !Array.isArray(json.dossier.assignments)
    ) {
      return { ok: false, reason: 'network_or_server_error' };
    }
    return {
      ok: true,
      data: {
        collectionId: json.collectionId ?? collectionId,
        articleId: json.articleId ?? articleId,
        version: json.version,
        updatedAt: json.updatedAt,
        dossier: json.dossier,
      },
    };
  } catch {
    return { ok: false, reason: 'network_or_server_error' };
  }
}

/** PUT досье; при offline — вызывающий код пишет в localStorage. */
export async function saveWorkshop2DossierToApi(input: {
  collectionId: string;
  articleId: string;
  dossier: Workshop2DossierPhase1;
  baseVersion?: number;
}): Promise<Workshop2ApiSaveResult> {
  try {
    const res = await fetch(dossierPath(input.collectionId, input.articleId), {
      method: 'PUT',
      headers: buildWorkshop2ApiRequestHeaders(),
      body: JSON.stringify({
        dossier: input.dossier,
        ...(typeof input.baseVersion === 'number' ? { baseVersion: input.baseVersion } : {}),
      }),
    });
    const json = (await res.json()) as {
      ok?: boolean;
      error?: string;
      version?: number;
      updatedAt?: string;
      currentVersion?: number;
      storeMode?: string;
      messageRu?: string;
      conflictFieldsRu?: string[];
    };
    if (res.status === 409 && json.error === 'version_conflict') {
      return {
        ok: false,
        reason: 'version_conflict',
        currentVersion: json.currentVersion,
        conflictFieldsRu: json.conflictFieldsRu,
      };
    }
    if (res.status === 400) return { ok: false, reason: 'invalid_payload' };
    if (!res.ok) return { ok: false, reason: `http_${res.status}` };
    if (
      json.ok !== true ||
      typeof json.version !== 'number' ||
      typeof json.updatedAt !== 'string'
    ) {
      return { ok: false, reason: 'network_or_server_error' };
    }
    return {
      ok: true,
      data: {
        version: json.version,
        updatedAt: json.updatedAt,
        storeMode: json.storeMode,
        messageRu: json.messageRu,
      },
    };
  } catch {
    return { ok: false, reason: 'network_or_server_error' };
  }
}

/** POST доменного события в серверный audit log (без смены версии досье). */
export async function postWorkshop2Event(input: {
  collectionId: string;
  articleId: string;
  eventType: string;
  eventPayload?: Record<string, unknown>;
}): Promise<Workshop2ApiPostEventResult> {
  try {
    const res = await fetch(eventsPath(input.collectionId, input.articleId), {
      method: 'POST',
      headers: buildWorkshop2ApiRequestHeaders(),
      body: JSON.stringify({
        eventType: input.eventType,
        eventPayload: input.eventPayload ?? {},
      }),
    });
    if (res.status === 404) return { ok: false, reason: 'not_found' };
    if (res.status === 400) return { ok: false, reason: 'invalid_payload' };
    if (!res.ok) return { ok: false, reason: `http_${res.status}` };
    const json = (await res.json()) as { ok?: boolean; id?: string; version?: number };
    if (json.ok !== true || typeof json.id !== 'string' || typeof json.version !== 'number') {
      return { ok: false, reason: 'network_or_server_error' };
    }
    return { ok: true, data: { id: json.id, version: json.version } };
  } catch {
    return { ok: false, reason: 'network_or_server_error' };
  }
}

/** @alias postWorkshop2Event */
export const postWorkshop2DossierEventToApi = postWorkshop2Event;

/** Журнал событий серверного store (аудит / будущий realtime). */
export async function listWorkshop2DossierEventsFromApi(input: {
  collectionId: string;
  articleId: string;
  limit?: number;
  eventType?: string;
}): Promise<
  | { ok: true; events: Workshop2ApiEventRecord[] }
  | { ok: false; reason: 'not_found' | 'network_or_server_error' | `http_${number}` }
> {
  try {
    const q = new URLSearchParams();
    if (typeof input.limit === 'number') q.set('limit', String(input.limit));
    if (input.eventType?.trim()) q.set('eventType', input.eventType.trim());
    const suffix = q.size ? `?${q.toString()}` : '';
    const res = await fetch(`${eventsPath(input.collectionId, input.articleId)}${suffix}`, {
      method: 'GET',
      headers: buildWorkshop2ApiRequestHeaders(),
    });
    if (res.status === 404) return { ok: false, reason: 'not_found' };
    if (!res.ok) return { ok: false, reason: `http_${res.status}` };
    const json = (await res.json()) as { ok?: boolean; events?: Workshop2ApiEventRecord[] };
    if (json.ok !== true || !Array.isArray(json.events)) {
      return { ok: false, reason: 'network_or_server_error' };
    }
    return { ok: true, events: json.events };
  } catch {
    return { ok: false, reason: 'network_or_server_error' };
  }
}

export type Workshop2ChangeRequestPatchResult =
  | {
      ok: true;
      changeRequest: import('@/lib/production/workshop2-dossier-phase1.types').Workshop2ChangeRequest;
      version: number;
    }
  | {
      ok: false;
      reason:
        | 'not_found'
        | 'change_request_not_found'
        | 'version_conflict'
        | 'invalid_payload'
        | 'network_or_server_error'
        | `http_${number}`;
      currentVersion?: number;
    };

/** PATCH approve/reject change request → PG dossier. */
export async function patchWorkshop2ChangeRequestDecision(input: {
  collectionId: string;
  articleId: string;
  changeRequestId: string;
  decision: 'approved' | 'rejected';
  decidedBy?: string;
}): Promise<Workshop2ChangeRequestPatchResult> {
  try {
    const res = await fetch(
      `/api/workshop2/articles/${encodeURIComponent(input.collectionId)}/${encodeURIComponent(input.articleId)}/change-requests/${encodeURIComponent(input.changeRequestId)}`,
      {
        method: 'PATCH',
        headers: buildWorkshop2ApiRequestHeaders(),
        body: JSON.stringify({
          decision: input.decision,
          ...(input.decidedBy ? { decidedBy: input.decidedBy } : {}),
        }),
      }
    );
    const json = (await res.json()) as {
      ok?: boolean;
      error?: string;
      changeRequest?: import('@/lib/production/workshop2-dossier-phase1.types').Workshop2ChangeRequest;
      version?: number;
      currentVersion?: number;
    };
    if (res.status === 404) {
      return {
        ok: false,
        reason:
          json.error === 'change_request_not_found' ? 'change_request_not_found' : 'not_found',
      };
    }
    if (res.status === 409 && json.error === 'version_conflict') {
      return { ok: false, reason: 'version_conflict', currentVersion: json.currentVersion };
    }
    if (res.status === 400) return { ok: false, reason: 'invalid_payload' };
    if (!res.ok) return { ok: false, reason: `http_${res.status}` };
    if (json.ok !== true || !json.changeRequest || typeof json.version !== 'number') {
      return { ok: false, reason: 'network_or_server_error' };
    }
    return { ok: true, changeRequest: json.changeRequest, version: json.version };
  } catch {
    return { ok: false, reason: 'network_or_server_error' };
  }
}

export type Workshop2ChangeRequestCreateResult =
  | {
      ok: true;
      changeRequest: import('@/lib/production/workshop2-dossier-phase1.types').Workshop2ChangeRequest;
      version: number;
    }
  | {
      ok: false;
      reason:
        | 'not_found'
        | 'version_conflict'
        | 'invalid_payload'
        | 'network_or_server_error'
        | `http_${number}`;
      currentVersion?: number;
    };

/** POST create change request → PG dossier (wave 34). */
export async function postWorkshop2ChangeRequest(input: {
  collectionId: string;
  articleId: string;
  description: string;
  priority?: 'Low' | 'Medium' | 'High';
  targetNode?: string;
  requestedBy?: string;
}): Promise<Workshop2ChangeRequestCreateResult> {
  try {
    const res = await fetch(
      `/api/workshop2/articles/${encodeURIComponent(input.collectionId)}/${encodeURIComponent(input.articleId)}/change-requests`,
      {
        method: 'POST',
        headers: buildWorkshop2ApiRequestHeaders(),
        body: JSON.stringify({
          description: input.description,
          priority: input.priority,
          targetNode: input.targetNode,
          requestedBy: input.requestedBy,
        }),
      }
    );
    const json = (await res.json()) as {
      ok?: boolean;
      error?: string;
      changeRequest?: import('@/lib/production/workshop2-dossier-phase1.types').Workshop2ChangeRequest;
      version?: number;
      currentVersion?: number;
    };
    if (res.status === 404) return { ok: false, reason: 'not_found' };
    if (res.status === 409) {
      return { ok: false, reason: 'version_conflict', currentVersion: json.currentVersion };
    }
    if (res.status === 400) return { ok: false, reason: 'invalid_payload' };
    if (!res.ok) return { ok: false, reason: `http_${res.status}` };
    if (json.ok !== true || !json.changeRequest || typeof json.version !== 'number') {
      return { ok: false, reason: 'network_or_server_error' };
    }
    return { ok: true, changeRequest: json.changeRequest, version: json.version };
  } catch {
    return { ok: false, reason: 'network_or_server_error' };
  }
}

export type Workshop2FloorSampleSyncResult =
  | {
      ok: true;
      order: { id: string; status: string };
      resolved: { orderStatus: string; movementStatus: string };
      dossierVersion?: number;
    }
  | {
      ok: false;
      reason:
        | 'sample_order_not_found'
        | 'invalid_payload'
        | 'network_or_server_error'
        | `http_${number}`;
    };

/** POST floor → sample order + floorBridgeMirror (wave 34 #58). */
export async function postWorkshop2FloorSampleSync(input: {
  collectionId: string;
  articleId: string;
  floorTab: string;
  orderId?: string;
  actor?: string;
}): Promise<Workshop2FloorSampleSyncResult> {
  try {
    const res = await fetch(
      `/api/workshop2/articles/${encodeURIComponent(input.collectionId)}/${encodeURIComponent(input.articleId)}/floor/sample-status`,
      {
        method: 'POST',
        headers: buildWorkshop2ApiRequestHeaders(),
        body: JSON.stringify({
          floorTab: input.floorTab,
          orderId: input.orderId,
          actor: input.actor,
        }),
      }
    );
    const json = (await res.json()) as {
      ok?: boolean;
      error?: string;
      order?: { id: string; status: string };
      resolved?: { orderStatus: string; movementStatus: string };
      dossierVersion?: number;
    };
    if (res.status === 404) {
      return {
        ok: false,
        reason:
          json.error === 'sample_order_not_found'
            ? 'sample_order_not_found'
            : 'network_or_server_error',
      };
    }
    if (res.status === 400) return { ok: false, reason: 'invalid_payload' };
    if (!res.ok) return { ok: false, reason: `http_${res.status}` };
    if (json.ok !== true || !json.order || !json.resolved) {
      return { ok: false, reason: 'network_or_server_error' };
    }
    return {
      ok: true,
      order: json.order,
      resolved: json.resolved,
      dossierVersion: json.dossierVersion,
    };
  } catch {
    return { ok: false, reason: 'network_or_server_error' };
  }
}

type Workshop2MirrorSyncResult =
  | {
      ok: true;
      dossierVersion?: number;
      dossier?: import('@/lib/production/workshop2-dossier-phase1.types').Workshop2DossierPhase1;
    }
  | { ok: false; reason: 'dossier_not_found' | 'network_or_server_error' | `http_${number}` };

async function postWorkshop2ArticleMirrorSync(
  pathSuffix: string,
  collectionId: string,
  articleId: string,
  body?: Record<string, unknown>
): Promise<Workshop2MirrorSyncResult> {
  try {
    const res = await fetch(
      `/api/workshop2/articles/${encodeURIComponent(collectionId)}/${encodeURIComponent(articleId)}/${pathSuffix}`,
      {
        method: 'POST',
        headers: buildWorkshop2ApiRequestHeaders(),
        body: body ? JSON.stringify(body) : undefined,
      }
    );
    const json = (await res.json()) as {
      ok?: boolean;
      dossierVersion?: number;
      dossier?: import('@/lib/production/workshop2-dossier-phase1.types').Workshop2DossierPhase1;
    };
    if (res.status === 404) return { ok: false, reason: 'dossier_not_found' };
    if (!res.ok) return { ok: false, reason: `http_${res.status}` };
    if (json.ok !== true) return { ok: false, reason: 'network_or_server_error' };
    return { ok: true, dossierVersion: json.dossierVersion, dossier: json.dossier };
  } catch {
    return { ok: false, reason: 'network_or_server_error' };
  }
}

/** Wave 35 #1 — server PG rollup → dossier. */
export function postWorkshop2HubRollupMirrorSync(
  collectionId: string,
  articleId: string
): Promise<Workshop2MirrorSyncResult> {
  return postWorkshop2ArticleMirrorSync('hub/rollup-mirror', collectionId, articleId);
}

/** Wave 35 #8 — PG events → activity mirror. */
export function postWorkshop2HubActivityMirrorSync(
  collectionId: string,
  articleId: string,
  limit = 25
): Promise<Workshop2MirrorSyncResult> {
  return postWorkshop2ArticleMirrorSync('hub/activity-mirror', collectionId, articleId, {
    limit,
  });
}

/** Wave 35 #40 — Vault CAD → cad mirror. */
export function postWorkshop2CadVaultMirrorSync(
  collectionId: string,
  articleId: string,
  proprietaryDemoParseActive?: boolean
): Promise<Workshop2MirrorSyncResult> {
  return postWorkshop2ArticleMirrorSync('vault/cad-mirror-sync', collectionId, articleId, {
    proprietaryDemoParseActive,
  });
}

/** Wave 35 #47 — PO ERP audit → dossier. */
export function postWorkshop2PurchaseOrderErpMirrorSync(
  collectionId: string,
  articleId: string
): Promise<Workshop2MirrorSyncResult> {
  return postWorkshop2ArticleMirrorSync('purchase-orders/erp-mirror-sync', collectionId, articleId);
}

/** Wave 35 #65 — logistics journal → dossier. */
export function postWorkshop2LogisticsMirrorSync(
  collectionId: string,
  articleId: string
): Promise<Workshop2MirrorSyncResult> {
  return postWorkshop2ArticleMirrorSync('logistics/mirror-sync', collectionId, articleId);
}

/** Wave 36 #75 — PG vault list → vaultPanelMirror. */
export function postWorkshop2VaultPanelMirrorSync(
  collectionId: string,
  articleId: string
): Promise<Workshop2MirrorSyncResult> {
  return postWorkshop2ArticleMirrorSync('vault/panel-mirror-sync', collectionId, articleId);
}
