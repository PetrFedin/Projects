import {
  buildPgB2bOrderChatId,
  mapBrandPgThreadsToChats,
} from '@/lib/brand/brand-messages-pg-threads';
import { mergePlatformCoreB2bInboxChats } from '@/lib/platform-core-b2b-inbox-merge';

describe('platform-core-b2b-inbox-merge', () => {
  it('добавляет placeholder по заказам без тредов (legacy)', () => {
    const pgChats = mapBrandPgThreadsToChats([
      {
        contextType: 'b2b_order',
        contextId: 'B2B-DEMO-SHOP1-SS27',
        lastMessageAt: '2026-06-01T10:00:00.000Z',
        lastMessagePreview: 'Заказ подтверждён',
        messageCount: 2,
      },
    ]);
    const merged = mergePlatformCoreB2bInboxChats(pgChats, [
      'B2B-DEMO-SHOP1-SS27',
      'B2B-DEMO-SHOP1-FW27',
    ]);
    expect(merged).toHaveLength(2);
    expect(merged[0]?.id).toBe(buildPgB2bOrderChatId('B2B-DEMO-SHOP1-SS27'));
    expect(merged[1]?.id).toBe(buildPgB2bOrderChatId('B2B-DEMO-SHOP1-FW27'));
    expect(merged[1]?.title).toContain('B2B-DEMO-SHOP1-FW27');
    expect(merged[1]?.subtitle).toContain('Начните переписку');
  });

  it('core: только PG-треды без synthetic placeholder', () => {
    const pgChats = mapBrandPgThreadsToChats([
      {
        contextType: 'b2b_order',
        contextId: 'B2B-DEMO-SHOP1-SS27',
        lastMessageAt: '2026-06-01T10:00:00.000Z',
        lastMessagePreview: 'Готово',
        messageCount: 1,
      },
    ]);
    const merged = mergePlatformCoreB2bInboxChats(
      pgChats,
      ['B2B-DEMO-SHOP1-SS27', 'B2B-DEMO-SHOP1-FW27'],
      { placeholders: false }
    );
    expect(merged).toHaveLength(1);
    expect(merged[0]?.id).toBe(buildPgB2bOrderChatId('B2B-DEMO-SHOP1-SS27'));
  });
});
