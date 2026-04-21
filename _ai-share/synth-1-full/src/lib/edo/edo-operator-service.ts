/**
 * EDO operator integration — Diadoc, Taxcom, СБИС
 * Real operator API stubs; wire to backend /edo/* when ready
 */

export type EdoOperator = 'diadoc' | 'taxcom' | 'sbis';

export interface EdoOperatorConfig {
  operator: EdoOperator;
  apiKey?: string;
  orgId?: string;
  endpoint?: string;
}

const OPERATOR_NAMES: Record<EdoOperator, string> = {
  diadoc: 'Диадок',
  taxcom: 'Тиан-ЭДО (Такском)',
  sbis: 'СБИС ЭДО',
};

export function getEdoOperatorLabel(op: EdoOperator): string {
  return OPERATOR_NAMES[op] ?? op;
}

export async function fetchEdoDocuments(config?: EdoOperatorConfig): Promise<EDODoc[]> {
  try {
    const apiBase = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000/api/v1';
    const res = await fetch(`${apiBase}/compliance/edo/documents`, {
      headers: {
        Authorization: `Bearer ${typeof window !== 'undefined' ? localStorage.getItem('syntha_access_token') : ''}`,
      },
    });
    if (res.ok) {
      const json = (await res.json()) as { data?: unknown } & Record<string, unknown>;
      const data = json?.data ?? json;
      return Array.isArray(data) ? (data as EDODoc[]) : [];
    }
    return [];
  } catch {
    return [];
  }
}

export async function signEdoDocument(
  docId: string | number,
  config?: EdoOperatorConfig
): Promise<{ ok: boolean; error?: string }> {
  try {
    const apiBase = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000/api/v1';
    const res = await fetch(`${apiBase}/compliance/edo/${docId}/sign`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${typeof window !== 'undefined' ? localStorage.getItem('syntha_access_token') : ''}`,
      },
    });
    if (!res.ok) throw new Error(await res.text());
    return { ok: true };
  } catch (e) {
    return { ok: false, error: e instanceof Error ? e.message : 'Sign failed' };
  }
}

export interface EDODoc {
  id: string | number;
  number?: string;
  type?: string;
  status: string;
  total?: number;
  partner?: string;
  date?: string;
}
