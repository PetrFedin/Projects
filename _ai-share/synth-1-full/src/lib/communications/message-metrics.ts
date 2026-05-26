import type { ChatMessage } from '@/lib/types';
import { isMessageRead } from './message-read-state';

const SELF_IDS = new Set(['user_petr', 'Petr']);

function isOthersMessage(m: ChatMessage, currentUserId: string): boolean {
  if (m.isSystem || m.type === 'system') return false;
  if (SELF_IDS.has(m.user) || m.user === currentUserId) return false;
  return true;
}

export function unreadCountForChatMessages(
  chatId: string,
  messages: ChatMessage[] | undefined,
  currentUserId: string
): number {
  if (!messages?.length) return 0;
  return messages.filter(
    (m) => isOthersMessage(m, currentUserId) && !isMessageRead(chatId, m.id)
  ).length;
}

export function buildUnreadCountByChat(
  histories: Record<string, ChatMessage[]>,
  currentUserId: string
): Record<string, number> {
  const out: Record<string, number> = {};
  for (const chatId of Object.keys(histories)) {
    out[chatId] = unreadCountForChatMessages(chatId, histories[chatId], currentUserId);
  }
  return out;
}

export function totalUnreadFromByChat(by: Record<string, number>): number {
  return Object.values(by).reduce((a, n) => a + n, 0);
}
