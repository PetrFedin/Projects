/**
 * Wave 28: маппинг PG contextual threads → Chat list для /brand/messages (RU, без demo).
 */
import type { Chat } from '@/lib/types';

export type BrandPgThreadRow = {
  contextType: string;
  contextId: string;
  lastMessageAt: string;
  lastMessagePreview: string;
  messageCount: number;
  collectionId?: string;
  articleId?: string;
  workspaceHref?: string;
};

export function mapBrandPgThreadsToChats(threads: BrandPgThreadRow[]): Chat[] {
  return threads.map((t) => {
    const cid = t.collectionId?.trim() ?? '';
    const aid = t.articleId?.trim() ?? '';
    const isOrder = t.contextType === 'b2b_order';
    const title = isOrder
      ? `B2B заказ · ${t.contextId}`
      : cid && aid
        ? `${cid} · ${aid}`
        : t.contextId;
    const at = t.lastMessageAt ? new Date(t.lastMessageAt) : null;
    const time =
      at && !Number.isNaN(at.getTime())
        ? at.toLocaleString('ru-RU', {
            day: '2-digit',
            month: '2-digit',
            hour: '2-digit',
            minute: '2-digit',
          })
        : undefined;
    return {
      id: `w2ctx:${t.contextType}:${t.contextId}`,
      title,
      subtitle: isOrder
        ? t.lastMessagePreview?.slice(0, 120) || 'Переписка по заказу B2B'
        : t.lastMessagePreview?.slice(0, 120) || 'Контекстный чат артикула',
      time,
      participantsCount: Math.max(1, t.messageCount),
      type: isOrder ? 'b2b' : 'production',
      linkCollectionId: cid || undefined,
      isPinned: false,
    } satisfies Chat;
  });
}

export function isBrandPgContextChatId(chatId: string): boolean {
  return chatId.startsWith('w2ctx:');
}
