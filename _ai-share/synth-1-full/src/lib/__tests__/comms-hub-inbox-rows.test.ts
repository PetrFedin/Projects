import { mergeCommsHubInboxThreadRows } from '@/lib/communications/comms-hub-inbox-rows';

describe('comms-hub-inbox-rows', () => {
  it('добавляет пустые треды по заказам очереди без PG-сообщений (hub merge)', () => {
    const merged = mergeCommsHubInboxThreadRows(
      [
        {
          contextType: 'b2b_order',
          contextId: 'B2B-DEMO-SHOP1-SS27',
          lastMessageAt: '2026-06-01T10:00:00.000Z',
          lastMessagePreview: 'Готово',
          messageCount: 1,
        },
      ],
      ['B2B-DEMO-SHOP1-SS27', 'B2B-DEMO-SHOP1-FW27'],
      'SS27'
    );
    expect(merged).toHaveLength(2);
    expect(merged[0]?.contextId).toBe('B2B-DEMO-SHOP1-SS27');
    expect(merged[1]?.contextId).toBe('B2B-DEMO-SHOP1-FW27');
    expect(merged[1]?.lastMessagePreview).toContain('Нет сообщений');
  });
});
