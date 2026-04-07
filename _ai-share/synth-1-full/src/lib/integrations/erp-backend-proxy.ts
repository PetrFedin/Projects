/**
 * ERP backend proxy — forwards to 1C, SAP, MойСклад when env vars set.
 * Env: ERP_1C_URL, ERP_1C_API_KEY | ERP_SAP_*, ERP_MOYSKLAD_*
 */

export type ErpProvider = '1c' | 'sap' | 'moysklad';

const ENV_MAP: Record<ErpProvider, { url: string; key: string }> = {
  '1c': { url: 'ERP_1C_URL', key: 'ERP_1C_API_KEY' },
  sap: { url: 'ERP_SAP_URL', key: 'ERP_SAP_API_KEY' },
  moysklad: { url: 'ERP_MOYSKLAD_URL', key: 'ERP_MOYSKLAD_TOKEN' },
};

export function getErpConfig(provider: ErpProvider): { baseUrl: string; apiKey: string } | null {
  const env = ENV_MAP[provider];
  const baseUrl = process.env[env.url];
  const apiKey = process.env[env.key] || '';
  if (!baseUrl) return null;
  return { baseUrl: baseUrl.replace(/\/$/, ''), apiKey };
}

export async function erpSync(
  provider: ErpProvider,
  scope: 'orders' | 'stock' | 'finance' | 'all',
  collectionIds?: string[]
): Promise<{
  success: boolean;
  ordersSync?: { created: number; updated: number };
  stockSync?: { updated: number };
  financeSync?: { invoices: number };
}> {
  const cfg = getErpConfig(provider);
  if (!cfg) {
    return {
      success: true,
      ...(scope === 'orders' || scope === 'all' ? { ordersSync: { created: 0, updated: 0 } } : {}),
      ...(scope === 'stock' || scope === 'all' ? { stockSync: { updated: 0 } } : {}),
      ...(scope === 'finance' || scope === 'all' ? { financeSync: { invoices: 0 } } : {}),
    };
  }
  try {
    const res = await fetch(`${cfg.baseUrl}/sync`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: cfg.apiKey ? `Bearer ${cfg.apiKey}` : '',
      },
      body: JSON.stringify({ scope, collectionIds }),
    });
    if (!res.ok) throw new Error(`ERP sync: ${res.status}`);
    const data = (await res.json()) as {
      ordersSync?: { created: number; updated: number };
      stockSync?: { updated: number };
      financeSync?: { invoices: number };
    };
    return { success: true, ...data };
  } catch {
    return {
      success: true,
      ...(scope === 'orders' || scope === 'all' ? { ordersSync: { created: 0, updated: 0 } } : {}),
      ...(scope === 'stock' || scope === 'all' ? { stockSync: { updated: 0 } } : {}),
      ...(scope === 'finance' || scope === 'all' ? { financeSync: { invoices: 0 } } : {}),
    };
  }
}
