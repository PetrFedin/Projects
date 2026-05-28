/**
 * localStorage keys for collapsible attribute-group UI in Workshop2 phase-1 dossier.
 * Extracted from {@link Workshop2Phase1DossierPanel} — keep behavior in sync when changing persistence.
 */

export const WORKSHOP_ATTR_GROUP_UI_LS_KEY = 'w2-dossier-attr-group-ui-v2';
export const WORKSHOP_BRANCH_LEVELS_DETAILS_LS_KEY = 'w2-dossier-branch-levels-details-open';
export const WORKSHOP_ATTR_GROUP_UI_LS_LEGACY = 'w2-dossier-collapsed-attr-groups-v1';

export function persistWorkshopAttrGroupUi(pinned: Set<string>, collapsed: Set<string>): void {
  const collapsedPersisted = [...collapsed].filter((k) => pinned.has(k));
  try {
    localStorage.setItem(
      WORKSHOP_ATTR_GROUP_UI_LS_KEY,
      JSON.stringify({ pinned: [...pinned], collapsed: collapsedPersisted })
    );
  } catch {
    /* ignore */
  }
}

export function loadWorkshopAttrGroupUi(): { pinned: Set<string>; collapsed: Set<string> } {
  try {
    const v2 = localStorage.getItem(WORKSHOP_ATTR_GROUP_UI_LS_KEY);
    if (v2) {
      const o = JSON.parse(v2) as { pinned?: unknown; collapsed?: unknown };
      const pinned =
        Array.isArray(o.pinned) && o.pinned.every((x) => typeof x === 'string')
          ? (o.pinned as string[])
          : [];
      const collapsed =
        Array.isArray(o.collapsed) && o.collapsed.every((x) => typeof x === 'string')
          ? (o.collapsed as string[])
          : [];
      return { pinned: new Set(pinned), collapsed: new Set(collapsed) };
    }
    const leg = localStorage.getItem(WORKSHOP_ATTR_GROUP_UI_LS_LEGACY);
    if (leg) {
      const arr = JSON.parse(leg) as unknown;
      if (Array.isArray(arr) && arr.every((x) => typeof x === 'string')) {
        const s = arr as string[];
        return { pinned: new Set(s), collapsed: new Set(s) };
      }
    }
  } catch {
    /* ignore */
  }
  return { pinned: new Set(), collapsed: new Set() };
}
