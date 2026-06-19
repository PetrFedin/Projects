import 'server-only';

import fs from 'node:fs';
import path from 'node:path';

import type {
  ShopRepOfflineDraft,
  ShopRepOfflineDraftsConfig,
} from '@/lib/shop/shop-rep-offline-drafts-store.types';

const memory = new Map<string, ShopRepOfflineDraftsConfig>();
const STORE_FILE = path.join(process.cwd(), 'data', 'shop-rep-offline-drafts.json');
let fileHydrated = false;

function canUseDiskPersistence(): boolean {
  return process.env.NODE_ENV !== 'test';
}

function hydrateFileIfNeeded(): void {
  if (fileHydrated) return;
  fileHydrated = true;
  if (!canUseDiskPersistence()) return;
  try {
    if (!fs.existsSync(STORE_FILE)) return;
    const parsed = JSON.parse(fs.readFileSync(STORE_FILE, 'utf8')) as ShopRepOfflineDraftsConfig[];
    if (Array.isArray(parsed)) {
      for (const row of parsed) {
        if (row.repId) memory.set(row.repId.trim(), row);
      }
    }
  } catch {
    /* ignore corrupt file */
  }
}

function persistFile(): void {
  if (!canUseDiskPersistence()) return;
  try {
    fs.mkdirSync(path.dirname(STORE_FILE), true);
    fs.writeFileSync(STORE_FILE, JSON.stringify([...memory.values()], null, 2));
  } catch {
    /* best effort */
  }
}

export async function getShopRepOfflineDraftsServer(
  repId: string
): Promise<ShopRepOfflineDraftsConfig> {
  const rid = repId.trim() || 'rep-demo';
  hydrateFileIfNeeded();
  return (
    memory.get(rid) ?? {
      repId: rid,
      drafts: [],
      updatedAt: new Date().toISOString(),
    }
  );
}

export async function appendShopRepOfflineDraftServer(input: {
  repId: string;
  draft: ShopRepOfflineDraft;
}): Promise<ShopRepOfflineDraftsConfig> {
  const repId = input.repId.trim() || 'rep-demo';
  hydrateFileIfNeeded();
  const prev = memory.get(repId) ?? { repId, drafts: [], updatedAt: new Date().toISOString() };
  const next: ShopRepOfflineDraftsConfig = {
    repId,
    drafts: [...prev.drafts, input.draft],
    updatedAt: new Date().toISOString(),
  };
  memory.set(repId, next);
  persistFile();
  return next;
}

export function shopRepOfflineDraftsStorageMode(): 'file' | 'memory' {
  if (canUseDiskPersistence() && fs.existsSync(STORE_FILE)) return 'file';
  if (canUseDiskPersistence() && memory.size > 0) return 'file';
  return 'memory';
}
