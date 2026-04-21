/**
 * Collections API — интеграция с /collections (drops, color-stories, merchandise-grid)
 * При `NEXT_PUBLIC_USE_FASTAPI !== 'true'` — только демо-ответы, без сетевых вызовов.
 */

import { DEMO_DROPS } from '@/lib/demo-data';
import { USE_FASTAPI } from '@/lib/syntha-api-mode';

const API_BASE = (process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000/api/v1').replace(
  /\/$/,
  ''
);

function getAuthHeaders(): Record<string, string> {
  const token = typeof window !== 'undefined' ? localStorage.getItem('syntha_access_token') : null;
  const h: Record<string, string> = { 'Content-Type': 'application/json' };
  if (token) h['Authorization'] = `Bearer ${token}`;
  return h;
}

export interface CreateDropPayload {
  season: string;
  drop_name: string;
  scheduled_date: string; // ISO
  sku_list_json: Record<string, unknown>;
  status?: string;
}

export interface CreateColorStoryPayload {
  collection_name: string;
  palette_json: Record<string, unknown>;
}

export interface CreateMerchandiseGridPayload {
  total_budget: number;
  category_split_json: Record<string, number>;
  target_units: number;
}

export async function createDrop(
  payload: CreateDropPayload
): Promise<{ id: number; status: string }> {
  if (!USE_FASTAPI) {
    return { id: Date.now() % 1_000_000_000, status: 'local_demo' };
  }
  const res = await fetch(`${API_BASE}/collections/drops`, {
    method: 'POST',
    headers: getAuthHeaders(),
    body: JSON.stringify({
      ...payload,
      scheduled_date: payload.scheduled_date,
    }),
  });
  if (!res.ok) {
    const err = (await res.json().catch(() => ({}))) as { detail?: string };
    throw new Error(err.detail || `Failed to create drop: ${res.status}`);
  }
  const json = (await res.json()) as { data?: { id: number; status: string } } & Record<string, unknown>;
  return json.data ?? (json as { id: number; status: string });
}

export async function createColorStory(
  payload: CreateColorStoryPayload
): Promise<{ id: number; collection_name: string }> {
  if (!USE_FASTAPI) {
    return { id: Date.now() % 1_000_000_000, collection_name: payload.collection_name };
  }
  const res = await fetch(`${API_BASE}/collections/color-stories`, {
    method: 'POST',
    headers: getAuthHeaders(),
    body: JSON.stringify(payload),
  });
  if (!res.ok) {
    const err = (await res.json().catch(() => ({}))) as { detail?: string };
    throw new Error(err.detail || `Failed to create color story: ${res.status}`);
  }
  const json = (await res.json()) as {
    data?: { id: number; collection_name: string };
  } & Record<string, unknown>;
  return json.data ?? (json as { id: number; collection_name: string });
}

export async function saveMerchandiseGrid(
  season: string,
  payload: CreateMerchandiseGridPayload
): Promise<{ id: number; status: string }> {
  if (!USE_FASTAPI) {
    return { id: 1, status: 'local_demo' };
  }
  const res = await fetch(
    `${API_BASE}/collections/merchandise-grid/${encodeURIComponent(season)}`,
    {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(payload),
    }
  );
  if (!res.ok) {
    const err = (await res.json().catch(() => ({}))) as { detail?: string };
    throw new Error(err.detail || `Failed to save merchandise grid: ${res.status}`);
  }
  const json = (await res.json()) as { data?: { id: number; status: string } } & Record<string, unknown>;
  return json.data ?? (json as { id: number; status: string });
}

export async function getDrops(
  season?: string
): Promise<
  Array<{ id: number; drop_name: string; season: string; status: string; scheduled_date: string }>
> {
  if (!USE_FASTAPI) {
    return getDemoDrops(season);
  }
  try {
    const q = season ? `?season=${encodeURIComponent(season)}` : '';
    const res = await fetch(`${API_BASE}/collections/drops${q}`, { headers: getAuthHeaders() });
    if (!res.ok) return getDemoDrops(season);
    const json = (await res.json()) as { data?: unknown } & Record<string, unknown>;
    const data = json.data ?? json;
    return Array.isArray(data)
      ? (data as Array<{
          id: number;
          drop_name: string;
          season: string;
          status: string;
          scheduled_date: string;
        }>)
      : getDemoDrops(season);
  } catch {
    return getDemoDrops(season);
  }
}

function getDemoDrops(season?: string): Array<{
  id: number;
  drop_name: string;
  season: string;
  status: string;
  scheduled_date: string;
}> {
  if (season) return DEMO_DROPS.filter((d) => d.season === season);
  return [...DEMO_DROPS];
}
