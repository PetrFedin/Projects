import {
  buildPgB2bOrderChatId,
  buildPlaceholderB2bOrderChat,
} from '@/lib/brand/brand-messages-pg-threads';
import type { Chat } from '@/lib/types';

/** PG-треды + опционально placeholder-чаты по заказам без сообщений (legacy inbox). */
export function mergePlatformCoreB2bInboxChats(
  pgChats: readonly Chat[],
  orderIds: readonly string[],
  options?: { placeholders?: boolean }
): Chat[] {
  const includePlaceholders = options?.placeholders !== false;
  if (!includePlaceholders) return [...pgChats];

  const seen = new Set(pgChats.map((c) => c.id));
  const placeholders: Chat[] = [];
  for (const raw of orderIds) {
    const orderId = raw.trim();
    if (!orderId) continue;
    const chatId = buildPgB2bOrderChatId(orderId);
    if (seen.has(chatId)) continue;
    seen.add(chatId);
    placeholders.push(buildPlaceholderB2bOrderChat(orderId));
  }
  return [...pgChats, ...placeholders];
}
