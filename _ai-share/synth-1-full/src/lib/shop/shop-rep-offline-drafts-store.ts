import type {
  ShopRepOfflineDraft,
  ShopRepOfflineDraftsConfig,
} from '@/lib/shop/shop-rep-offline-drafts-store.types';

export type { ShopRepOfflineDraft, ShopRepOfflineDraftsConfig };

const STORAGE_KEY = 'shop_rep_offline_drafts_v1';
const DEFAULT_REP = 'rep-demo';

function loadLocal(repId = DEFAULT_REP): ShopRepOfflineDraftsConfig | null {
  if (typeof window === 'undefined') return null;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as ShopRepOfflineDraftsConfig;
    if (parsed.repId !== repId) return null;
    return parsed;
  } catch {
    return null;
  }
}

function saveLocal(config: ShopRepOfflineDraftsConfig): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(config));
}

export async function fetchShopRepOfflineDrafts(
  repId = DEFAULT_REP
): Promise<{ config: ShopRepOfflineDraftsConfig; storageMode?: string }> {
  const res = await fetch(
    `/api/shop/b2b/rep/offline-drafts?repId=${encodeURIComponent(repId)}`,
    { cache: 'no-store' }
  );
  const json = (await res.json()) as {
    ok?: boolean;
    config?: ShopRepOfflineDraftsConfig | null;
    storageMode?: string;
  };
  if (!res.ok || !json.ok) {
    const local = loadLocal(repId);
    return {
      config: local ?? { repId, drafts: [], updatedAt: new Date().toISOString() },
      storageMode: 'memory',
    };
  }
  const config =
    json.config ?? { repId, drafts: [], updatedAt: new Date().toISOString() };
  saveLocal(config);
  return { config, storageMode: json.storageMode };
}

export async function appendShopRepOfflineDraft(input: {
  repId?: string;
  campaignId: string;
  payload?: Record<string, unknown>;
}): Promise<{ config: ShopRepOfflineDraftsConfig; storageMode?: string }> {
  const repId = input.repId?.trim() || DEFAULT_REP;
  const draft: ShopRepOfflineDraft = {
    id: `draft-${Date.now()}`,
    repId,
    campaignId: input.campaignId,
    payload: input.payload ?? {},
    createdAt: new Date().toISOString(),
  };

  const res = await fetch('/api/shop/b2b/rep/offline-drafts', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ repId, draft }),
  });
  const json = (await res.json()) as {
    ok?: boolean;
    config?: ShopRepOfflineDraftsConfig;
    storageMode?: string;
  };
  if (!res.ok || !json.ok || !json.config) {
    const local = loadLocal(repId) ?? { repId, drafts: [], updatedAt: new Date().toISOString() };
    const next = {
      ...local,
      drafts: [...local.drafts, draft],
      updatedAt: new Date().toISOString(),
    };
    saveLocal(next);
    return { config: next, storageMode: 'memory' };
  }
  saveLocal(json.config);
  return { config: json.config, storageMode: json.storageMode };
}
