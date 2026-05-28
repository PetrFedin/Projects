/**
 * v0 persistence for brand read-only control **visibility toggles** (hide augmentations, not SoT).
 * Delivery / inbox / bus — out of scope; see `control-signal-visibility.ts`.
 */
/** Same key for `storage` event sync across tabs. */
export const BRAND_CONTROL_UI_PREFS_STORAGE_KEY = 'syntha_brand_control_signal_ui_v1';

export type BrandControlSignalUiPrefs = {
  /** Order rows: chips + next line (LIST_SUPPRESS_ORDER_CONTROL_SIGNALS when true). */
  hideOrderControlAugmentations?: boolean;
  /** Article rows in control-center. */
  hideArticleControlAugmentations?: boolean;
};

export function readBrandControlSignalUiPrefs(): BrandControlSignalUiPrefs {
  if (typeof window === 'undefined') return {};
  try {
    const raw = localStorage.getItem(BRAND_CONTROL_UI_PREFS_STORAGE_KEY);
    if (!raw?.trim()) return {};
    const o = JSON.parse(raw) as unknown;
    if (!o || typeof o !== 'object' || Array.isArray(o)) return {};
    return o as BrandControlSignalUiPrefs;
  } catch {
    return {};
  }
}

/** Fired on same tab after prefs write so all listeners refresh without relying on `storage`. */
export const BRAND_CONTROL_UI_PREFS_CHANGED_EVENT = 'syntha:brand_control_ui_prefs_changed';

export function writeBrandControlSignalUiPrefs(next: BrandControlSignalUiPrefs): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(BRAND_CONTROL_UI_PREFS_STORAGE_KEY, JSON.stringify(next));
    window.dispatchEvent(new Event(BRAND_CONTROL_UI_PREFS_CHANGED_EVENT));
  } catch {
    /* quota / private mode */
  }
}

export function patchBrandControlSignalUiPrefs(
  patch: Partial<BrandControlSignalUiPrefs>
): BrandControlSignalUiPrefs {
  const merged = { ...readBrandControlSignalUiPrefs(), ...patch };
  writeBrandControlSignalUiPrefs(merged);
  return merged;
}
