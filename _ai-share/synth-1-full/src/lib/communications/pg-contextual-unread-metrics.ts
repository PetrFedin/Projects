import type { BrandPgThreadRow } from '@/lib/brand/brand-messages-pg-threads';
import { pgChatUnreadCount } from './pg-contextual-read-state';

export function pgThreadToChatId(thread: BrandPgThreadRow): string {
  return `w2ctx:${thread.contextType}:${thread.contextId}`;
}

export function buildPgUnreadCountByChat(threads: BrandPgThreadRow[]): Record<string, number> {
  const out: Record<string, number> = {};
  for (const t of threads) {
    const chatId = pgThreadToChatId(t);
    const unread = pgChatUnreadCount(chatId, t.messageCount, t.lastSeenMessageCount);
    if (unread > 0) out[chatId] = unread;
  }
  return out;
}

export function totalPgUnreadFromByChat(by: Record<string, number>): number {
  return Object.values(by).reduce((a, n) => a + n, 0);
}
