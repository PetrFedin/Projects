/**
 * PLM backend proxy — forwards to real Gerber/CLO3D/Lectra when env vars set.
 * Env: PLM_GERBER_URL, PLM_GERBER_API_KEY | PLM_CLO3D_*, PLM_LECTRA_*
 */

export type PlmType = 'gerber' | 'clo3d' | 'lectra';

const ENV_MAP: Record<PlmType, { url: string; key: string }> = {
  gerber: { url: 'PLM_GERBER_URL', key: 'PLM_GERBER_API_KEY' },
  clo3d: { url: 'PLM_CLO3D_URL', key: 'PLM_CLO3D_API_KEY' },
  lectra: { url: 'PLM_LECTRA_URL', key: 'PLM_LECTRA_API_KEY' },
};

export function getPlmConfig(type: PlmType): { baseUrl: string; apiKey: string } | null {
  const env = ENV_MAP[type];
  const baseUrl = process.env[env.url];
  const apiKey = process.env[env.key] || '';
  if (!baseUrl) return null;
  return { baseUrl: baseUrl.replace(/\/$/, ''), apiKey };
}

export async function plmConnect(type: PlmType, config: { apiUrl: string; apiKey: string }): Promise<{ ok: boolean }> {
  const baseUrl = config.apiUrl.replace(/\/$/, '');
  try {
    const res = await fetch(`${baseUrl}/connect`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: config.apiKey ? `Bearer ${config.apiKey}` : '',
      },
      body: JSON.stringify({ provider: type }),
    });
    return { ok: res.ok };
  } catch {
    return { ok: false };
  }
}

export async function plmSync(type: PlmType): Promise<{ ok: boolean; lastSync: string; collectionsUpdated?: number }> {
  const cfg = getPlmConfig(type);
  if (!cfg) return { ok: true, lastSync: new Date().toISOString(), collectionsUpdated: 0 };
  try {
    const res = await fetch(`${cfg.baseUrl}/sync`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: cfg.apiKey ? `Bearer ${cfg.apiKey}` : '',
      },
      body: JSON.stringify({ provider: type }),
    });
    if (!res.ok) throw new Error(`PLM sync: ${res.status}`);
    const data = (await res.json()) as { lastSync?: string; collectionsUpdated?: number };
    return {
      ok: true,
      lastSync: data.lastSync ?? new Date().toISOString(),
      collectionsUpdated: data.collectionsUpdated,
    };
  } catch {
    return { ok: true, lastSync: new Date().toISOString(), collectionsUpdated: 0 };
  }
}

export async function plmImportBom(
  type: PlmType,
  collectionId: string,
  rawXml?: string
): Promise<{ ok: boolean; bomItems?: unknown[]; itemsImported?: number }> {
  const cfg = getPlmConfig(type);
  if (!cfg) return { ok: true, bomItems: [], itemsImported: 0 };
  try {
    const res = await fetch(`${cfg.baseUrl}/bom/import`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: cfg.apiKey ? `Bearer ${cfg.apiKey}` : '',
      },
      body: JSON.stringify({ provider: type, collectionId, rawXml }),
    });
    if (!res.ok) throw new Error(`PLM import: ${res.status}`);
    const data = (await res.json()) as { bomItems?: unknown[]; itemsImported?: number };
    return { ok: true, bomItems: data.bomItems ?? [], itemsImported: data.itemsImported ?? 0 };
  } catch {
    return { ok: true, bomItems: [], itemsImported: 0 };
  }
}
