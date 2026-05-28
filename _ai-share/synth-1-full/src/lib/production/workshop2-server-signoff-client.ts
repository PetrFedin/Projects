import type {
  Workshop2DossierPhase1,
  Workshop2TzSignoffSectionKey,
} from '@/lib/production/workshop2-dossier-phase1.types';

export async function commitWorkshop2SectionSignoffOnServer(input: {
  collectionId: string;
  articleId: string;
  articleSku: string;
  section: Workshop2TzSignoffSectionKey;
  role: 'brand' | 'tech';
  signerLabel: string;
  signerOrganization: string;
}): Promise<
  | { ok: true; data: { version: number; updatedAt: string; dossier: Workshop2DossierPhase1 } }
  | { ok: false; reason: string; sectionErrors?: string[] }
> {
  try {
    const res = await fetch('/api/brand/workshop2/phase1-dossier/section-signoff/commit', {
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
      data: { version: json.version, updatedAt: json.updatedAt, dossier: json.dossier },
    };
  } catch {
    return { ok: false, reason: 'network_or_server_error' };
  }
}
