/**
 * Client-side read receipts for brand messages (demo); keeps unread counts consistent across hub chrome.
 */
const STORAGE_KEY = 'syntha_brand_msg_read_v1';

type Stored = Record<string, number[]>;

function load(): Stored {
  if (typeof window === 'undefined') return {};
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as Stored) : {};
  } catch {
    return {};
  }
}

function save(data: Stored) {
  if (typeof window === 'undefined') return;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
}

const listeners = new Set<() => void>();

export function subscribeMessageReadState(cb: () => void): () => void {
  listeners.add(cb);
  return () => listeners.delete(cb);
}

function emit() {
  listeners.forEach((cb) => cb());
}

export function getReadMessageIds(chatId: string): Set<number> {
  const ids = load()[chatId] ?? [];
  return new Set(ids);
}

/** Mark message ids as read for a chat (merge). */
export function markMessagesRead(chatId: string, messageIds: number[]) {
  if (!messageIds.length) return;
  const data = load();
  const prev = new Set(data[chatId] ?? []);
  let changed = false;
  for (const id of messageIds) {
    if (!prev.has(id)) {
      prev.add(id);
      changed = true;
    }
  }
  if (!changed) return;
  data[chatId] = [...prev];
  save(data);
  emit();
}

export function isMessageRead(chatId: string, messageId: number): boolean {
  return getReadMessageIds(chatId).has(messageId);
}
