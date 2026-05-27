/**
 * Локальные комментарии по блокам ТЗ / атрибутам (ключ — id блока или attributeId).
 * Общий контракт для карточки артикула и панели фазы 1.
 */
export type Workshop2TzAttrComment = {
  id: string;
  text: string;
  by: string;
  at: string;
  status?: 'open' | 'resolved';
  severity?: 'normal' | 'critical';
  assignee?: string;
  dueAt?: string;
  visibility?: 'internal' | 'factory';
};

export function w2AttrCommentsStorageKey(collectionId: string, articleId: string): string {
  return `w2-attr-comments:v1:${collectionId}:${articleId}`;
}

export function loadW2AttrCommentsMap(
  collectionId: string,
  articleId: string
): Record<string, Workshop2TzAttrComment[]> {
  if (typeof window === 'undefined') return {};
  try {
    const raw = window.localStorage.getItem(w2AttrCommentsStorageKey(collectionId, articleId));
    if (!raw) return {};
    const parsed = JSON.parse(raw) as Record<string, Workshop2TzAttrComment[]>;
    if (!parsed || typeof parsed !== 'object') return {};
    const normalized: Record<string, Workshop2TzAttrComment[]> = {};
    for (const [attrId, rows] of Object.entries(parsed)) {
      normalized[attrId] = (rows ?? []).map((r) => ({
        ...r,
        status: r.status === 'resolved' ? 'resolved' : 'open',
        severity: r.severity === 'critical' ? 'critical' : 'normal',
      }));
    }
    return normalized;
  } catch {
    return {};
  }
}

export function saveW2AttrCommentsMap(
  collectionId: string,
  articleId: string,
  map: Record<string, Workshop2TzAttrComment[]>
): boolean {
  if (typeof window === 'undefined') return true;
  try {
    window.localStorage.setItem(
      w2AttrCommentsStorageKey(collectionId, articleId),
      JSON.stringify(map)
    );
    return true;
  } catch {
    return false;
  }
}
