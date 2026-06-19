/**
 * Client visited-state for comms section-groups (per order × pillar × section).
 * Complements chat-level read receipts — section chip hides after user opened ?section= deep-link.
 */
const STORAGE_KEY = 'syntha_pg_ctx_section_visit_v1';

type Stored = Record<string, true>;

const listeners = new Set<() => void>();

function load(): Stored {
  if (typeof window === 'undefined') return {};
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as Stored) : {};
  } catch {
    return {};
  }
}

function save(data: Stored): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
}

function emit(): void {
  listeners.forEach((cb) => cb());
}

export function subscribePgSectionVisitState(cb: () => void): () => void {
  listeners.add(cb);
  return () => listeners.delete(cb);
}

export function buildPgSectionVisitKey(
  orderId: string,
  pillarId: string,
  sectionId: string
): string {
  return `${orderId.trim()}::${pillarId.trim()}/${sectionId.trim()}`;
}

export function markPgSectionVisited(
  orderId: string,
  pillarId: string,
  sectionId: string,
  readerId?: string
): void {
  const key = buildPgSectionVisitKey(orderId, pillarId, sectionId);
  if (!key || key.includes('::/')) return;
  const data = load();
  if (data[key]) {
    syncPgSectionReadToServer(orderId, pillarId, sectionId, readerId);
    return;
  }
  data[key] = true;
  save(data);
  emit();
  syncPgSectionReadToServer(orderId, pillarId, sectionId, readerId);
}

function syncPgSectionReadToServer(
  orderId: string,
  pillarId: string,
  sectionId: string,
  readerId?: string
): void {
  if (!readerId?.trim() || typeof window === 'undefined') return;
  void fetch('/api/messages/contextual/section-read-state', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-w2-actor-id': readerId.trim(),
    },
    body: JSON.stringify({ orderId, pillarId, sectionId, readerId: readerId.trim() }),
  }).catch(() => {
    /* best-effort */
  });
}

export function isPgSectionVisited(
  orderId: string,
  pillarId: string,
  sectionId: string,
  serverVisitedKeys?: ReadonlySet<string>
): boolean {
  const key = buildPgSectionVisitKey(orderId, pillarId, sectionId);
  if (serverVisitedKeys?.has(key)) return true;
  return load()[key] === true;
}

/** Test-only reset. */
export function clearPgSectionVisitStateForTests(): void {
  if (typeof window === 'undefined') return;
  localStorage.removeItem(STORAGE_KEY);
  emit();
}
