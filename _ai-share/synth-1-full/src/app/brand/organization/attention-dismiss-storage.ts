/**
 * Persist dismissed «Требует внимания» items per brand (browser localStorage).
 * Server-side sync можно добавить позже тем же контрактом id-снимков.
 */

const STORAGE_PREFIX = 'fashion-org-attention-dismiss:v1:';

export type AttentionDismissSlice = {
  certificates: { id: string }[];
  profile: { id: string }[];
  tasks: { id: string }[];
  integrationIssues: string[];
};

export type AttentionDismissRecord = {
  v: 1;
  certificateIds: string[];
  profileIds: string[];
  taskIds: string[];
};

export function emptyAttentionDismissRecord(): AttentionDismissRecord {
  return { v: 1, certificateIds: [], profileIds: [], taskIds: [] };
}

function keyForBrand(brandId: string): string {
  return `${STORAGE_PREFIX}${encodeURIComponent(brandId)}`;
}

export function loadAttentionDismiss(brandId: string): AttentionDismissRecord | null {
  if (typeof window === 'undefined' || !brandId) return null;
  try {
    const raw = window.localStorage.getItem(keyForBrand(brandId));
    if (!raw) return null;
    const parsed = JSON.parse(raw) as Partial<AttentionDismissRecord>;
    if (parsed?.v !== 1) return null;
    return {
      v: 1,
      certificateIds: Array.isArray(parsed.certificateIds)
        ? parsed.certificateIds.filter((x): x is string => typeof x === 'string')
        : [],
      profileIds: Array.isArray(parsed.profileIds)
        ? parsed.profileIds.filter((x): x is string => typeof x === 'string')
        : [],
      taskIds: Array.isArray(parsed.taskIds)
        ? parsed.taskIds.filter((x): x is string => typeof x === 'string')
        : [],
    };
  } catch {
    return null;
  }
}

export function saveAttentionDismiss(brandId: string, record: AttentionDismissRecord): void {
  if (typeof window === 'undefined' || !brandId) return;
  try {
    window.localStorage.setItem(keyForBrand(brandId), JSON.stringify(record));
  } catch {
    // quota / private mode — UI всё равно обновлён в памяти
  }
}

export function appendDismissedAlertId(
  brandId: string,
  bucket: keyof Pick<AttentionDismissRecord, 'certificateIds' | 'profileIds' | 'taskIds'>,
  id: string
): void {
  if (!brandId || !id) return;
  const cur = loadAttentionDismiss(brandId) ?? emptyAttentionDismissRecord();
  if (cur[bucket].includes(id)) return;
  cur[bucket] = [...cur[bucket], id];
  saveAttentionDismiss(brandId, cur);
}

export function applyAttentionDismissFilters<T extends AttentionDismissSlice>(
  state: T,
  dismissed: AttentionDismissRecord | null
): T {
  if (!dismissed) return state;
  const c = new Set(dismissed.certificateIds);
  const p = new Set(dismissed.profileIds);
  const t = new Set(dismissed.taskIds);
  return {
    ...state,
    certificates: state.certificates.filter((x) => !c.has(x.id)),
    profile: state.profile.filter((x) => !p.has(x.id)),
    tasks: state.tasks.filter((x) => !t.has(x.id)),
  };
}
