import { REPLENISHMENT_RULE_PRESET_IDS } from '@/lib/shop/shop-replenishment-rules-presets';
import type { ShopReplenishmentRulesConfig } from '@/lib/shop/shop-replenishment-rules-store.types';
export type { ShopReplenishmentRulesConfig } from '@/lib/shop/shop-replenishment-rules-store.types';

const STORAGE_KEY = 'shop_replenishment_rules_v1';
const DEFAULT_BUYER = 'shop1';

export function loadShopReplenishmentRulesLocal(
  buyerId = DEFAULT_BUYER
): ShopReplenishmentRulesConfig | null {
  if (typeof window === 'undefined') return null;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as ShopReplenishmentRulesConfig;
    if (parsed.buyerId !== buyerId) return null;
    return parsed;
  } catch {
    return null;
  }
}

export function saveShopReplenishmentRulesLocal(config: ShopReplenishmentRulesConfig): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(config));
}

export async function fetchShopReplenishmentRules(
  buyerId = DEFAULT_BUYER
): Promise<ShopReplenishmentRulesConfig | null> {
  const res = await fetch(
    `/api/shop/b2b/replenishment/rules?buyerId=${encodeURIComponent(buyerId)}`,
    { cache: 'no-store' }
  );
  const json = (await res.json()) as { ok?: boolean; config?: ShopReplenishmentRulesConfig | null };
  if (!res.ok || !json.ok) return loadShopReplenishmentRulesLocal(buyerId);
  if (json.config) saveShopReplenishmentRulesLocal(json.config);
  return json.config ?? loadShopReplenishmentRulesLocal(buyerId);
}

export async function persistShopReplenishmentRules(input: {
  buyerId?: string;
  activePresetId: string;
}): Promise<{ config: ShopReplenishmentRulesConfig; storageMode?: string }> {
  const buyerId = input.buyerId?.trim() || DEFAULT_BUYER;
  const activePresetId = REPLENISHMENT_RULE_PRESET_IDS.has(input.activePresetId)
    ? input.activePresetId
    : 'basic-low-sold';
  const config: ShopReplenishmentRulesConfig = {
    activePresetId,
    updatedAt: new Date().toISOString(),
    buyerId,
  };

  const res = await fetch('/api/shop/b2b/replenishment/rules', {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(config),
  });
  const json = (await res.json()) as {
    ok?: boolean;
    config?: ShopReplenishmentRulesConfig;
    storageMode?: string;
  };
  const saved = json.ok && json.config ? json.config : config;
  saveShopReplenishmentRulesLocal(saved);
  return { config: saved, storageMode: json.storageMode };
}
