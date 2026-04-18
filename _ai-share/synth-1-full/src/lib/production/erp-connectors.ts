/**
 * Real ERP connectors — 1С, SAP, МойСклад, custom API
 */

import type { ErpProvider } from './erp-integration';

const ERP_API = process.env.NEXT_PUBLIC_ERP_API_URL || '/api/production/erp';

export interface ErpConnectorConfig {
  provider: ErpProvider;
  endpoint?: string;
  login?: string;
  password?: string;
  base?: string;
}

export async function syncErp(
  provider: ErpProvider,
  config: ErpConnectorConfig
): Promise<{ ok: boolean; lastSync?: string; error?: string }> {
  try {
    const res = await fetch(`${ERP_API}/sync`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ provider, ...config }),
    });
    if (!res.ok) throw new Error(await res.text());
    const data = await res.json();
    return { ok: true, lastSync: data.lastSync };
  } catch (e) {
    return { ok: false, error: e instanceof Error ? e.message : 'Sync failed' };
  }
}
