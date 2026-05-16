import type {
  Workshop2ContractorsPayload,
  Workshop2SewingPlanReferencePayload,
} from '@/lib/production/workshop2-sewing-plan-reference-types';

export type Workshop2RfReferencePayload = Pick<Workshop2SewingPlanReferencePayload, 'rfSubjects' | 'source'>;

export async function loadWorkshop2PassportSewingSources(
  fetchImpl: typeof fetch
): Promise<{ refPayload: Workshop2RfReferencePayload | null; contractorsPayload: Workshop2ContractorsPayload | null }> {
  try {
    const [refRes, contractorsRes] = await Promise.all([
      fetchImpl('/api/brand/sewing-plan-reference'),
      fetchImpl('/api/brand/sewing-contractors'),
    ]);

    let refPayload: Workshop2RfReferencePayload | null = null;
    if (refRes.ok) {
      const raw = (await refRes.json()) as unknown;
      if (raw && typeof raw === 'object') {
        const j = raw as Workshop2RfReferencePayload;
        if (Array.isArray(j.rfSubjects)) refPayload = j;
      }
    }

    let contractorsPayload: Workshop2ContractorsPayload | null = null;
    if (contractorsRes.ok) {
      const raw = (await contractorsRes.json()) as unknown;
      if (raw && typeof raw === 'object') {
        const j = raw as Workshop2ContractorsPayload;
        if (Array.isArray(j.partners) && j.source && typeof j.source === 'object') {
          contractorsPayload = j;
        }
      }
    }

    return { refPayload, contractorsPayload };
  } catch {
    return { refPayload: null, contractorsPayload: null };
  }
}
