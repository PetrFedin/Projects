/**
 * Wave 4 P2 #11: unread badge для contextual chat workspace header.
 */
import type { Workshop2ContextualMessageRecord } from '@/lib/server/workshop2-contextual-messages-repository';

const STORAGE_PREFIX = 'synth.w2.chat.lastRead.';

export function workshop2ContextualChatLastReadStorageKey(contextId: string): string {
  return `${STORAGE_PREFIX}${contextId.trim()}`;
}

export function readWorkshop2ContextualChatLastReadAt(contextId: string): string | null {
  if (typeof localStorage === 'undefined') return null;
  try {
    return localStorage.getItem(workshop2ContextualChatLastReadStorageKey(contextId));
  } catch {
    return null;
  }
}

export function writeWorkshop2ContextualChatLastReadAt(
  contextId: string,
  iso: string = new Date().toISOString()
): void {
  if (typeof localStorage === 'undefined') return;
  try {
    localStorage.setItem(workshop2ContextualChatLastReadStorageKey(contextId), iso);
  } catch {
    /* best-effort */
  }
}

export function countWorkshop2ContextualChatUnread(
  messages: Workshop2ContextualMessageRecord[],
  lastReadAt: string | null
): number {
  if (!lastReadAt) return messages.length;
  return messages.filter((m) => m.createdAt > lastReadAt).length;
}
