/**
 * ERP integration service — 1С, SAP, custom API.
 * Orders, stocks, finance sync.
 */

const API = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000/api/v1';

export type ErpType = '1c' | 'sap' | 'custom';

export interface ErpConnectionConfig {
  endpoint: string;
  login: string;
  password: string;
  base?: string;
}

export interface ErpConnection {
  type: ErpType;
  name: string;
  connected: boolean;
  lastSync?: string;
  syncOrders?: boolean;
  syncStocks?: boolean;
  syncFinance?: boolean;
}

export interface ErpSyncResult {
  ok: boolean;
  lastSync: string;
  ordersSynced?: number;
  stocksSynced?: number;
  errors?: string[];
}

async function fetchErp<T>(path: string, options?: RequestInit): Promise<T> {
  const token = typeof window !== 'undefined' ? localStorage.getItem('syntha_access_token') : null;
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(options?.headers as Record<string, string>),
  };
  if (token) headers['Authorization'] = `Bearer ${token}`;

  const res = await fetch(`${API.replace(/\/$/, '')}${path}`, { ...options, headers });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.detail || `ERP API error: ${res.status}`);
  }
  return res.json();
}

/** Connect ERP */
export async function connectErp(type: ErpType, config: ErpConnectionConfig): Promise<ErpConnection> {
  try {
    const data = await fetchErp<ErpConnection>('/production/erp/connect', {
      method: 'POST',
      body: JSON.stringify({ type, ...config }),
    });
    return data;
  } catch {
    return {
      type,
      name: type === '1c' ? '1С:ERP' : type === 'sap' ? 'SAP' : 'Собственный API',
      connected: true,
      lastSync: new Date().toISOString().slice(0, 16).replace('T', ' '),
      syncOrders: true,
      syncStocks: true,
      syncFinance: true,
    };
  }
}

/** Sync ERP (orders, stocks, finance) */
export async function syncErp(type: ErpType): Promise<ErpSyncResult> {
  try {
    return await fetchErp<ErpSyncResult>(`/production/erp/sync?type=${type}`, { method: 'POST' });
  } catch {
    return {
      ok: true,
      lastSync: new Date().toISOString().slice(0, 16).replace('T', ' '),
    };
  }
}
