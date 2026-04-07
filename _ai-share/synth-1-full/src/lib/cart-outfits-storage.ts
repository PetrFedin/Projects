import type { CartOutfitLineRef, Product, SavedCartOutfit } from '@/lib/types';

export const OUTFITS_STORAGE_KEY_V1 = 'syntha_saved_cart_outfits_v1';
export const OUTFITS_STORAGE_KEY_V2 = 'syntha_saved_cart_outfits_v2';
export const ACTIVE_OUTFIT_STORAGE_KEY = 'syntha_active_cart_outfit_id_v1';

export const OUTFITS_SCHEMA_VERSION = 2;

function enrichRefs(refs: CartOutfitLineRef[], catalog: Product[]): CartOutfitLineRef[] {
  return refs.map((r) => {
    const p = catalog.find((x) => x.id === r.productId);
    return {
      ...r,
      slug: r.slug ?? p?.slug,
      snapshotPriceRub: r.snapshotPriceRub ?? p?.price,
    };
  });
}

/** Нормализация массива образов после чтения JSON. */
export function normalizeOutfitsList(raw: unknown, catalog: Product[]): SavedCartOutfit[] {
  if (!Array.isArray(raw)) return [];
  const out: SavedCartOutfit[] = [];
  for (const o of raw) {
    if (!o || typeof o !== 'object') continue;
    const rec = o as Partial<SavedCartOutfit>;
    if (!rec.id || !rec.name || !Array.isArray(rec.lineRefs)) continue;
    out.push({
      id: rec.id,
      name: rec.name,
      createdAt: rec.createdAt || new Date().toISOString(),
      updatedAt: rec.updatedAt,
      lineRefs: enrichRefs(rec.lineRefs as CartOutfitLineRef[], catalog),
      coverImageUrl: rec.coverImageUrl,
      schemaVersion: rec.schemaVersion ?? OUTFITS_SCHEMA_VERSION,
      source: rec.source,
      promoOutfitId: rec.promoOutfitId,
    });
  }
  return out;
}

/** Читает v2 или мигрирует v1 → v2 в localStorage (только гость). */
export function readGuestOutfitsFromLocalStorage(catalog: Product[]): SavedCartOutfit[] {
  if (typeof window === 'undefined') return [];
  try {
    const v2 = window.localStorage.getItem(OUTFITS_STORAGE_KEY_V2);
    if (v2) {
      return normalizeOutfitsList(JSON.parse(v2), catalog);
    }
    const v1 = window.localStorage.getItem(OUTFITS_STORAGE_KEY_V1);
    if (v1) {
      const migrated = normalizeOutfitsList(JSON.parse(v1), catalog).map((o) => ({
        ...o,
        schemaVersion: OUTFITS_SCHEMA_VERSION,
        lineRefs: enrichRefs(o.lineRefs, catalog),
      }));
      window.localStorage.setItem(OUTFITS_STORAGE_KEY_V2, JSON.stringify(migrated));
      window.localStorage.removeItem(OUTFITS_STORAGE_KEY_V1);
      return migrated;
    }
  } catch {}
  return [];
}

export function writeGuestOutfitsToLocalStorage(outfits: SavedCartOutfit[]): void {
  if (typeof window === 'undefined') return;
  try {
    window.localStorage.setItem(OUTFITS_STORAGE_KEY_V2, JSON.stringify(outfits));
  } catch {}
}
