/**
 * Real PLM connectors — Gerber, CLO3D, Lectra
 * Uses backend API when available, env for endpoint config
 */

import type { PlmProvider } from './plm-integration';

const PLM_API = process.env.NEXT_PUBLIC_PLM_API_URL || '/api/production/plm';

export interface PlmConnectorConfig {
  provider: PlmProvider;
  apiUrl?: string;
  apiKey?: string;
  workspace?: string;
}

export async function syncPlm(
  provider: PlmProvider,
  config: PlmConnectorConfig
): Promise<{ ok: boolean; lastSync?: string; error?: string }> {
  try {
    const res = await fetch(`${PLM_API}/sync`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...config, provider }),
    });
    if (!res.ok) throw new Error(await res.text());
    const data = (await res.json()) as { lastSync?: string };
    return { ok: true, lastSync: data.lastSync };
  } catch (e) {
    return { ok: false, error: e instanceof Error ? e.message : 'Sync failed' };
  }
}

export async function importBomFromPlm(
  provider: PlmProvider,
  collectionId: string,
  options?: { skuId?: string; rawXml?: string }
): Promise<{ success: boolean; bomItems?: unknown[]; gradations?: unknown[]; errors?: string[] }> {
  try {
    const res = await fetch(`${PLM_API}/import`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ provider, collectionId, ...options }),
    });
    const data = (await res.json()) as {
      success: boolean;
      bomItems?: unknown[];
      gradations?: unknown[];
      errors?: string[];
    };
    return data;
  } catch (e) {
    return { success: false, errors: [e instanceof Error ? e.message : 'Import failed'] };
  }
}
