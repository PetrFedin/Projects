import type { BrandPgThreadRow } from '@/lib/brand/brand-messages-pg-threads';
import { buildPgUnreadCountByChat, pgThreadToChatId } from '@/lib/communications/pg-contextual-unread-metrics';

export function filterPgContextualThreadsForOrder(
  threads: readonly BrandPgThreadRow[],
  orderId: string,
  orderScoped: boolean
): BrandPgThreadRow[] {
  const oid = orderId.trim();
  if (!orderScoped || !oid) return [...threads];
  return threads.filter((t) => t.contextType === 'b2b_order' && t.contextId.trim() === oid);
}

export function summarizePgContextualUnreadForOrder(input: {
  threads: readonly BrandPgThreadRow[];
  orderId: string;
  orderScoped?: boolean;
}): {
  totalUnread: number;
  unreadThreads: Array<{ chatId: string; unread: number }>;
} {
  const scoped = filterPgContextualThreadsForOrder(
    input.threads,
    input.orderId,
    input.orderScoped ?? true
  );
  const unreadByChat = buildPgUnreadCountByChat(scoped);
  const unreadThreads = scoped
    .map((t) => ({
      chatId: pgThreadToChatId(t),
      unread: unreadByChat[pgThreadToChatId(t)] ?? 0,
    }))
    .filter((row) => row.unread > 0);
  const totalUnread = unreadThreads.reduce((sum, row) => sum + row.unread, 0);
  return { totalUnread, unreadThreads };
}
