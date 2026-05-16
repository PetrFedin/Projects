import type { Workshop2DossierPhase1 } from '@/lib/production/workshop2-dossier-phase1.types';
import type { Workshop2FinalTzSpecExportContext } from '@/lib/production/workshop2-final-tz-spec-export';
import type { Workshop2FinalExportSnapshotMeta } from '@/lib/production/workshop2-dossier-phase1.types';

export type Workshop2ServerAuditEvent = {
  id: string;
  collectionId: string;
  articleId: string;
  version: number;
  eventType: string;
  eventPayload: Record<string, unknown>;
  createdAt: string;
};

export type Workshop2ServerDossierVersion = {
  id: string;
  collectionId: string;
  articleId: string;
  version: number;
  createdAt: string;
  updatedBy?: string;
  updatedAt?: string;
};

export type Workshop2ServerDossierLoadResult =
  | {
      ok: true;
      data: {
        collectionId: string;
        articleId: string;
        version: number;
        updatedAt: string;
        dossier: Workshop2DossierPhase1;
      };
    }
  | { ok: false; reason: 'not_found' | 'network_or_server_error' | `http_${number}` };

export type Workshop2ServerDossierSaveResult =
  | { ok: true; data: { version: number; updatedAt: string } }
  | {
      ok: false;
      reason: 'version_conflict' | 'invalid_server_response' | 'network_or_server_error' | `http_${number}`;
      currentVersion?: number;
    };

export async function mergeWorkshop2DossierOnServer(input: {
  collectionId: string;
  articleId: string;
  localDossier: Workshop2DossierPhase1;
}): Promise<
  | {
      ok: true;
      data: {
        version: number;
        updatedAt: string;
        dossier: Workshop2DossierPhase1;
        mergeReport?: {
          mode: 'auto';
          conflictingFields: string[];
          manualReviewRequired: boolean;
          criticalConflicts: string[];
        };
      };
    }
  | { ok: false; reason: 'not_found' | 'version_conflict' | 'invalid_server_response' | 'network_or_server_error' | `http_${number}` }
> {
  try {
    const res = await fetch('/api/brand/workshop2/phase1-dossier/merge', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify(input),
    });
    const json = (await res.json()) as {
      ok?: boolean;
      error?: string;
      version?: number;
      updatedAt?: string;
      dossier?: Workshop2DossierPhase1;
      mergeReport?: {
        mode?: 'auto';
        conflictingFields?: string[];
        manualReviewRequired?: boolean;
        criticalConflicts?: string[];
      };
    };
    if (res.status === 404 && json.error === 'not_found') return { ok: false, reason: 'not_found' };
    if (res.status === 409 && json.error === 'version_conflict') return { ok: false, reason: 'version_conflict' };
    if (!res.ok) return { ok: false, reason: `http_${res.status}` };
    if (
      json.ok !== true ||
      typeof json.version !== 'number' ||
      typeof json.updatedAt !== 'string' ||
      !json.dossier ||
      !Array.isArray(json.dossier.assignments)
    ) {
      return { ok: false, reason: 'invalid_server_response' };
    }
    return {
      ok: true,
      data: {
        version: json.version,
        updatedAt: json.updatedAt,
        dossier: json.dossier,
        ...(json.mergeReport
          ? {
              mergeReport: {
                mode: 'auto' as const,
                conflictingFields: Array.isArray(json.mergeReport.conflictingFields)
                  ? json.mergeReport.conflictingFields
                  : [],
                manualReviewRequired: json.mergeReport.manualReviewRequired === true,
                criticalConflicts: Array.isArray(json.mergeReport.criticalConflicts)
                  ? json.mergeReport.criticalConflicts
                  : [],
              },
            }
          : {}),
      },
    };
  } catch {
    return { ok: false, reason: 'network_or_server_error' };
  }
}

export async function resolveWorkshop2DossierMergeOnServer(input: {
  collectionId: string;
  articleId: string;
  actorLabel: string;
  localDossier: Workshop2DossierPhase1;
  resolutions: Record<string, 'server' | 'local'>;
}): Promise<
  | {
      ok: true;
      data: {
        version: number;
        updatedAt: string;
        dossier: Workshop2DossierPhase1;
        mergeReport?: {
          mode: 'manual';
          conflictingFields: string[];
          resolvedBy: string;
          resolvedAt: string;
        };
      };
    }
  | { ok: false; reason: 'not_found' | 'version_conflict' | 'unresolved_fields' | 'invalid_server_response' | 'network_or_server_error' | `http_${number}` }
> {
  try {
    const res = await fetch('/api/brand/workshop2/phase1-dossier/merge/resolve', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify(input),
    });
    const json = (await res.json()) as {
      ok?: boolean;
      error?: string;
      version?: number;
      updatedAt?: string;
      dossier?: Workshop2DossierPhase1;
      mergeReport?: {
        mode?: 'manual';
        conflictingFields?: string[];
        resolvedBy?: string;
        resolvedAt?: string;
      };
    };
    if (res.status === 404 && json.error === 'not_found') return { ok: false, reason: 'not_found' };
    if (res.status === 409 && json.error === 'version_conflict') return { ok: false, reason: 'version_conflict' };
    if (res.status === 400 && json.error === 'unresolved_fields') return { ok: false, reason: 'unresolved_fields' };
    if (!res.ok) return { ok: false, reason: `http_${res.status}` };
    if (
      json.ok !== true ||
      typeof json.version !== 'number' ||
      typeof json.updatedAt !== 'string' ||
      !json.dossier ||
      !Array.isArray(json.dossier.assignments)
    ) {
      return { ok: false, reason: 'invalid_server_response' };
    }
    return {
      ok: true,
      data: {
        version: json.version,
        updatedAt: json.updatedAt,
        dossier: json.dossier,
        ...(json.mergeReport
          ? {
              mergeReport: {
                mode: 'manual' as const,
                conflictingFields: Array.isArray(json.mergeReport.conflictingFields)
                  ? json.mergeReport.conflictingFields
                  : [],
                resolvedBy: String(json.mergeReport.resolvedBy ?? ''),
                resolvedAt: String(json.mergeReport.resolvedAt ?? ''),
              },
            }
          : {}),
      },
    };
  } catch {
    return { ok: false, reason: 'network_or_server_error' };
  }
}

export async function loadWorkshop2DossierFromServer(
  collectionId: string,
  articleId: string
): Promise<Workshop2ServerDossierLoadResult> {
  try {
    const q = new URLSearchParams({ collectionId, articleId });
    const res = await fetch(`/api/brand/workshop2/phase1-dossier?${q.toString()}`, { method: 'GET' });
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
      typeof json.collectionId !== 'string' ||
      typeof json.articleId !== 'string' ||
      typeof json.version !== 'number' ||
      typeof json.updatedAt !== 'string' ||
      !json.dossier ||
      !Array.isArray((json.dossier as Workshop2DossierPhase1).assignments)
    ) {
      return { ok: false, reason: 'network_or_server_error' };
    }
    return {
      ok: true,
      data: {
        collectionId: json.collectionId,
        articleId: json.articleId,
        version: json.version,
        updatedAt: json.updatedAt,
        dossier: json.dossier,
      },
    };
  } catch {
    return { ok: false, reason: 'network_or_server_error' };
  }
}

export async function saveWorkshop2DossierToServer(input: {
  collectionId: string;
  articleId: string;
  dossier: Workshop2DossierPhase1;
  baseVersion?: number;
}): Promise<Workshop2ServerDossierSaveResult> {
  try {
    const res = await fetch('/api/brand/workshop2/phase1-dossier', {
      method: 'PUT',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify(input),
    });
    const json = (await res.json()) as {
      ok?: boolean;
      error?: string;
      version?: number;
      updatedAt?: string;
      currentVersion?: number;
    };
    if (res.status === 409 && json.error === 'version_conflict') {
      return { ok: false, reason: 'version_conflict', currentVersion: json.currentVersion };
    }
    if (!res.ok) return { ok: false, reason: `http_${res.status}` };
    if (json.ok !== true || typeof json.version !== 'number' || typeof json.updatedAt !== 'string') {
      return { ok: false, reason: 'invalid_server_response' };
    }
    return { ok: true, data: { version: json.version, updatedAt: json.updatedAt } };
  } catch {
    return { ok: false, reason: 'network_or_server_error' };
  }
}

export async function createWorkshop2FinalExportSnapshotOnServer(input: {
  collectionId: string;
  articleId: string;
  actorLabel: string;
  exportContext?: Omit<Workshop2FinalTzSpecExportContext, 'measurementsLeaf'>;
}): Promise<
  | { ok: true; data: { snapshotId: string; version: number; updatedAt: string; dossier: Workshop2DossierPhase1 } }
  | { ok: false; reason: 'not_found' | 'version_conflict' | 'invalid_server_response' | 'network_or_server_error' | `http_${number}` }
> {
  try {
    const res = await fetch('/api/brand/workshop2/phase1-dossier/final-export-snapshot', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify(input),
    });
    const json = (await res.json()) as {
      ok?: boolean;
      error?: string;
      snapshotId?: string;
      version?: number;
      updatedAt?: string;
      dossier?: Workshop2DossierPhase1;
    };
    if (res.status === 404 && json.error === 'not_found') return { ok: false, reason: 'not_found' };
    if (res.status === 409 && json.error === 'version_conflict') return { ok: false, reason: 'version_conflict' };
    if (!res.ok) return { ok: false, reason: `http_${res.status}` };
    if (
      json.ok !== true ||
      typeof json.snapshotId !== 'string' ||
      typeof json.version !== 'number' ||
      typeof json.updatedAt !== 'string' ||
      !json.dossier ||
      !Array.isArray(json.dossier.assignments)
    ) {
      return { ok: false, reason: 'invalid_server_response' };
    }
    return {
      ok: true,
      data: {
        snapshotId: json.snapshotId,
        version: json.version,
        updatedAt: json.updatedAt,
        dossier: json.dossier,
      },
    };
  } catch {
    return { ok: false, reason: 'network_or_server_error' };
  }
}

export async function buildWorkshop2FinalExportHtmlFromSnapshotOnServer(input: {
  collectionId: string;
  articleId: string;
  snapshotId: string;
}): Promise<{ ok: true; html: string } | { ok: false; reason: 'not_found' | 'snapshot_not_found' | 'snapshot_context_missing' | 'invalid_server_response' | 'network_or_server_error' | `http_${number}` }> {
  try {
    const res = await fetch('/api/brand/workshop2/phase1-dossier/final-export-document', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify(input),
    });
    const json = (await res.json()) as { ok?: boolean; error?: string; html?: string };
    if (res.status === 404 && json.error === 'not_found') return { ok: false, reason: 'not_found' };
    if (res.status === 404 && json.error === 'snapshot_not_found') return { ok: false, reason: 'snapshot_not_found' };
    if (res.status === 409 && json.error === 'snapshot_context_missing') return { ok: false, reason: 'snapshot_context_missing' };
    if (!res.ok) return { ok: false, reason: `http_${res.status}` };
    if (json.ok !== true || typeof json.html !== 'string') return { ok: false, reason: 'invalid_server_response' };
    return { ok: true, html: json.html };
  } catch {
    return { ok: false, reason: 'network_or_server_error' };
  }
}

export async function listWorkshop2FinalExportSnapshotsOnServer(input: {
  collectionId: string;
  articleId: string;
  limit?: number;
}): Promise<{ ok: true; snapshots: Workshop2FinalExportSnapshotMeta[] } | { ok: false; reason: 'not_found' | 'invalid_server_response' | 'network_or_server_error' | `http_${number}` }> {
  try {
    const q = new URLSearchParams({
      collectionId: input.collectionId,
      articleId: input.articleId,
      ...(typeof input.limit === 'number' ? { limit: String(input.limit) } : {}),
    });
    const res = await fetch(`/api/brand/workshop2/phase1-dossier/final-export-snapshot?${q.toString()}`, {
      method: 'GET',
    });
    const json = (await res.json()) as { ok?: boolean; error?: string; snapshots?: Workshop2FinalExportSnapshotMeta[] };
    if (res.status === 404 && json.error === 'not_found') return { ok: false, reason: 'not_found' };
    if (!res.ok) return { ok: false, reason: `http_${res.status}` };
    if (json.ok !== true || !Array.isArray(json.snapshots)) return { ok: false, reason: 'invalid_server_response' };
    return { ok: true, snapshots: json.snapshots };
  } catch {
    return { ok: false, reason: 'network_or_server_error' };
  }
}

export async function getWorkshop2FinalExportSnapshotMetaOnServer(input: {
  collectionId: string;
  articleId: string;
  snapshotId: string;
}): Promise<{ ok: true; snapshot: Workshop2FinalExportSnapshotMeta } | { ok: false; reason: 'not_found' | 'snapshot_not_found' | 'invalid_server_response' | 'network_or_server_error' | `http_${number}` }> {
  try {
    const q = new URLSearchParams({
      collectionId: input.collectionId,
      articleId: input.articleId,
    });
    const res = await fetch(
      `/api/brand/workshop2/phase1-dossier/final-export-snapshot/${encodeURIComponent(input.snapshotId)}?${q.toString()}`,
      { method: 'GET' }
    );
    const json = (await res.json()) as { ok?: boolean; error?: string; snapshot?: Workshop2FinalExportSnapshotMeta };
    if (res.status === 404 && json.error === 'not_found') return { ok: false, reason: 'not_found' };
    if (res.status === 404 && json.error === 'snapshot_not_found')
      return { ok: false, reason: 'snapshot_not_found' };
    if (!res.ok) return { ok: false, reason: `http_${res.status}` };
    if (json.ok !== true || !json.snapshot || typeof json.snapshot.snapshotId !== 'string') {
      return { ok: false, reason: 'invalid_server_response' };
    }
    return { ok: true, snapshot: json.snapshot };
  } catch {
    return { ok: false, reason: 'network_or_server_error' };
  }
}

export async function listWorkshop2DossierEventsOnServer(input: {
  collectionId: string;
  articleId: string;
  limit?: number;
}): Promise<{ ok: true; events: Workshop2ServerAuditEvent[] } | { ok: false; reason: 'not_found' | 'invalid_server_response' | 'network_or_server_error' | `http_${number}` }> {
  try {
    const q = new URLSearchParams({
      collectionId: input.collectionId,
      articleId: input.articleId,
      ...(typeof input.limit === 'number' ? { limit: String(input.limit) } : {}),
    });
    const res = await fetch(`/api/brand/workshop2/phase1-dossier/events?${q.toString()}`, {
      method: 'GET',
    });
    const json = (await res.json()) as { ok?: boolean; error?: string; events?: Workshop2ServerAuditEvent[] };
    if (res.status === 404 && json.error === 'not_found') return { ok: false, reason: 'not_found' };
    if (!res.ok) return { ok: false, reason: `http_${res.status}` };
    if (json.ok !== true || !Array.isArray(json.events)) return { ok: false, reason: 'invalid_server_response' };
    return { ok: true, events: json.events };
  } catch {
    return { ok: false, reason: 'network_or_server_error' };
  }
}

export async function listWorkshop2DossierVersionsOnServer(input: {
  collectionId: string;
  articleId: string;
  limit?: number;
}): Promise<{ ok: true; versions: Workshop2ServerDossierVersion[] } | { ok: false; reason: 'not_found' | 'invalid_server_response' | 'network_or_server_error' | `http_${number}` }> {
  try {
    const q = new URLSearchParams({
      collectionId: input.collectionId,
      articleId: input.articleId,
      ...(typeof input.limit === 'number' ? { limit: String(input.limit) } : {}),
    });
    const res = await fetch(`/api/brand/workshop2/phase1-dossier/versions?${q.toString()}`, {
      method: 'GET',
    });
    const json = (await res.json()) as { ok?: boolean; error?: string; versions?: Workshop2ServerDossierVersion[] };
    if (res.status === 404 && json.error === 'not_found') return { ok: false, reason: 'not_found' };
    if (!res.ok) return { ok: false, reason: `http_${res.status}` };
    if (json.ok !== true || !Array.isArray(json.versions))
      return { ok: false, reason: 'invalid_server_response' };
    return { ok: true, versions: json.versions };
  } catch {
    return { ok: false, reason: 'network_or_server_error' };
  }
}
