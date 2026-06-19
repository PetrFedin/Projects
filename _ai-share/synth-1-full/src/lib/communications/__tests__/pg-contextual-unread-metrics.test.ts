import {
  buildPgUnreadCountByChat,
  pgThreadToChatId,
  totalPgUnreadFromByChat,
} from '@/lib/communications/pg-contextual-unread-metrics';
import {
  getPgChatLastSeenMessageCount,
  markPgChatSeen,
} from '@/lib/communications/pg-contextual-read-state';

describe('pg-contextual-unread-metrics', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('считает unread как messageCount − lastSeen', () => {
    const chatId = pgThreadToChatId({
      contextType: 'b2b_order',
      contextId: 'B2B-DEMO-SHOP1-SS27',
      lastMessageAt: '2026-06-10T10:00:00.000Z',
      lastMessagePreview: 'Заказ отправлен',
      messageCount: 3,
    });
    markPgChatSeen(chatId, 1);
    const by = buildPgUnreadCountByChat([
      {
        contextType: 'b2b_order',
        contextId: 'B2B-DEMO-SHOP1-SS27',
        lastMessageAt: '2026-06-10T10:00:00.000Z',
        lastMessagePreview: 'Заказ отправлен',
        messageCount: 3,
      },
    ]);
    expect(by[chatId]).toBe(2);
    expect(totalPgUnreadFromByChat(by)).toBe(2);
    expect(getPgChatLastSeenMessageCount(chatId)).toBe(1);
  });

  it('учитывает server lastSeen выше local', () => {
    const thread = {
      contextType: 'b2b_order' as const,
      contextId: 'B2B-SRV',
      lastMessageAt: '2026-06-10T10:00:00.000Z',
      lastMessagePreview: 'ok',
      messageCount: 4,
      lastSeenMessageCount: 3,
    };
    const chatId = pgThreadToChatId(thread);
    markPgChatSeen(chatId, 1);
    const by = buildPgUnreadCountByChat([thread]);
    expect(by[chatId]).toBe(1);
  });

  it('не показывает unread после полного просмотра', () => {
    const thread = {
      contextType: 'b2b_order' as const,
      contextId: 'B2B-X',
      lastMessageAt: '2026-06-10T10:00:00.000Z',
      lastMessagePreview: 'ok',
      messageCount: 2,
    };
    const chatId = pgThreadToChatId(thread);
    markPgChatSeen(chatId, 2);
    const by = buildPgUnreadCountByChat([thread]);
    expect(by[chatId]).toBeUndefined();
    expect(totalPgUnreadFromByChat(by)).toBe(0);
  });
});
