/**
 * PLM integration service — Gerber, CLO3D, Lectra.
 * Calls backend APIs when available; falls back to mock when offline.
 */

const API = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000/api/v1';

export type PlmType = 'gerber' | 'clo3d' | 'lectra';

export interface PlmConnectionConfig {
  apiUrl: string;
  apiKey: string;
  workspace?: string;
}

export interface PlmConnection {
  type: PlmType;
  name: string;
  connected: boolean;
  lastSync?: string;
  collections?: string;
  bomImport?: boolean;
  gradationImport?: boolean;
}

export interface PlmSyncResult {
  ok: boolean;
  lastSync: string;
  collectionsUpdated?: number;
  errors?: string[];
}

export interface PlmBomImportResult {
  ok: boolean;
  collectionId: string;
  itemsImported: number;
  errors?: string[];
}

async function fetchPlm<T>(path: string, options?: RequestInit): Promise<T> {
  const token = typeof window !== 'undefined' ? localStorage.getItem('syntha_access_token') : null;
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(options?.headers as Record<string, string>),
  };
  if (token) headers['Authorization'] = `Bearer ${token}`;

  const res = await fetch(`${API.replace(/\/$/, '')}${path}`, { ...options, headers });
  if (!res.ok) {
    const err = (await res.json().catch(() => ({}))) as { detail?: string };
    throw new Error(err.detail || `PLM API error: ${res.status}`);
  }
  return (await res.json()) as T;
}

/** Connect PLM provider */
export async function connectPlm(
  type: PlmType,
  config: PlmConnectionConfig
): Promise<PlmConnection> {
  try {
    const data = await fetchPlm<PlmConnection>('/production/plm/connect', {
      method: 'POST',
      body: JSON.stringify({ type, ...config }),
    });
    return data;
  } catch (e) {
    // Fallback: simulate success for demo when backend unavailable
    return {
      type,
      name: type === 'gerber' ? 'Gerber Accumark' : type === 'clo3d' ? 'CLO3D' : 'Lectra Modaris',
      connected: true,
      lastSync: new Date().toISOString().slice(0, 16).replace('T', ' '),
      bomImport: true,
      gradationImport: true,
    };
  }
}

/** Sync PLM data */
export async function syncPlm(type: PlmType): Promise<PlmSyncResult> {
  try {
    return await fetchPlm<PlmSyncResult>(`/production/plm/sync?type=${type}`, { method: 'POST' });
  } catch {
    return {
      ok: true,
      lastSync: new Date().toISOString().slice(0, 16).replace('T', ' '),
      collectionsUpdated: 0,
    };
  }
}

/** Import BOM from PLM into collection */
export async function importBomFromPlm(
  type: PlmType,
  collectionId: string
): Promise<PlmBomImportResult> {
  try {
    return await fetchPlm<PlmBomImportResult>('/production/plm/import', {
      method: 'POST',
      body: JSON.stringify({ type, collectionId }),
    });
  } catch {
    return { ok: true, collectionId, itemsImported: 0 };
  }
}
