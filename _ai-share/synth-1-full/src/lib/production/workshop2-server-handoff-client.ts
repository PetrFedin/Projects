import type {
  Workshop2DossierPhase1,
  Workshop2FactoryHandoffChannel,
} from '@/lib/production/workshop2-dossier-phase1.types';
import type { Workshop2DossierHandoffB2bSyncResult } from '@/lib/server/workshop2-b2b-production-handoff';

export async function commitWorkshop2HandoffOnServer(input: {
  collectionId: string;
  articleId: string;
  actorLabel: string;
  revisionLabel: string;
  windowNote?: string;
  contactLabel?: string;
  channel: Workshop2FactoryHandoffChannel;
  attachmentIds: string[];
  brandDispatched: { at: string; by: string };
  factoryReceived: { at: string; by: string };
  orderId?: string;
  factoryId?: string;
}): Promise<
  | {
      ok: true;
      data: {
        version: number;
        updatedAt: string;
        dossier: Workshop2DossierPhase1;
        b2bSync?: Workshop2DossierHandoffB2bSyncResult;
      };
    }
  | { ok: false; reason: string; sectionErrors?: string[] }
> {
  try {
    const res = await fetch('/api/brand/workshop2/phase1-dossier/handoff/commit', {
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
      sectionErrors?: string[];
      b2bSync?: Workshop2DossierHandoffB2bSyncResult;
    };
    if (!res.ok) {
      return {
        ok: false,
        reason: json.error?.trim() || `http_${res.status}`,
        sectionErrors: Array.isArray(json.sectionErrors) ? json.sectionErrors : undefined,
      };
    }
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
        b2bSync: json.b2bSync,
      },
    };
  } catch {
    return { ok: false, reason: 'network_or_server_error' };
  }
}
