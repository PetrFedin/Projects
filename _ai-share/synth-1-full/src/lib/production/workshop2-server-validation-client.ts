import type { Workshop2DossierPhase1 } from '@/lib/production/workshop2-dossier-phase1.types';
import type { Workshop2TzGateLine } from '@/lib/production/workshop2-tz-gates';
import type { Workshop2TzPreflightIssue } from '@/lib/production/workshop2-tz-trace';

export type Workshop2ServerValidateResponse = {
  ok: boolean;
  mode: 'server_validate_only';
  gate: {
    state: string;
    blockers: Workshop2TzGateLine[];
    firstUnmet: Workshop2TzGateLine | null;
    sectionMinimumErrors: Partial<Record<'general' | 'material' | 'construction', string[]>>;
    sectionSignoffsFull: number;
    hasHandoffMarks: boolean;
  };
  preflight: {
    ok: boolean;
    issues: Workshop2TzPreflightIssue[];
  };
  error?: string;
};

export async function validateWorkshop2DossierOnServer(
  dossier: Workshop2DossierPhase1
): Promise<{ ok: true; data: Workshop2ServerValidateResponse } | { ok: false; reason: string }> {
  try {
    const res = await fetch('/api/brand/workshop2/phase1-dossier', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify(dossier),
    });
    if (!res.ok) return { ok: false, reason: `http_${res.status}` };
    const json = (await res.json()) as Workshop2ServerValidateResponse;
    if (!json.ok) return { ok: false, reason: json.error?.trim() || 'invalid_server_response' };
    return { ok: true, data: json };
  } catch {
    return { ok: false, reason: 'network_or_server_error' };
  }
}
