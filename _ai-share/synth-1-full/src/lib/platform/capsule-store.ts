import type { Product } from '@/lib/types';
import type { CapsuleExportV1 } from './types';
import { CAPSULE_EXPORT_VERSION } from './types';

export const CAPSULE_STORAGE_KEY = 'synth.capsule.look.v1';

export type CapsulePersisted = {
  name: string;
  ids: (string | undefined)[];
  ts: number;
};

export function loadCapsuleFromStorage(): CapsulePersisted | null {
  if (typeof window === 'undefined') return null;
  try {
    const raw = localStorage.getItem(CAPSULE_STORAGE_KEY);
    if (!raw) return null;
    const p = JSON.parse(raw) as { name?: string; ids?: string[]; ts?: number };
    if (!p?.name || !Array.isArray(p.ids)) return null;
    return { name: p.name, ids: p.ids, ts: p.ts ?? Date.now() };
  } catch {
    return null;
  }
}

export function saveCapsuleToStorage(name: string, slots: (Product | null)[]) {
  if (typeof window === 'undefined') return;
  const ids = slots.map((s) => (s ? String(s.id) : undefined));
  localStorage.setItem(CAPSULE_STORAGE_KEY, JSON.stringify({ name, ids, ts: Date.now() }));
}

export function resolveCapsuleSlots(
  catalog: Product[],
  ids: (string | undefined)[]
): (Product | null)[] {
  const byId = new Map(catalog.map((p) => [String(p.id), p]));
  return [0, 1, 2].map((i) => {
    const id = ids[i];
    if (!id) return null;
    return byId.get(id) ?? null;
  });
}

export function toCapsuleExport(name: string, slots: (Product | null)[]): CapsuleExportV1 {
  return {
    version: CAPSULE_EXPORT_VERSION,
    exportedAt: Date.now(),
    name,
    productIds: slots.map((s) => (s ? String(s.id) : null)),
  };
}

export function parseCapsuleImport(raw: unknown): CapsuleExportV1 | null {
  if (!raw || typeof raw !== 'object') return null;
  const o = raw as Partial<CapsuleExportV1>;
  if (
    o.version !== CAPSULE_EXPORT_VERSION ||
    typeof o.name !== 'string' ||
    !Array.isArray(o.productIds)
  )
    return null;
  return {
    version: CAPSULE_EXPORT_VERSION,
    exportedAt: typeof o.exportedAt === 'number' ? o.exportedAt : Date.now(),
    name: o.name,
    productIds: o.productIds.slice(0, 3),
  };
}
