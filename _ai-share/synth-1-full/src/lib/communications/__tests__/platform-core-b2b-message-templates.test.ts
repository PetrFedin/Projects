import {
  resolvePlatformCoreB2bMessageTemplates,
  PLATFORM_CORE_B2B_MESSAGE_TEMPLATES,
} from '@/lib/communications/platform-core-b2b-message-templates';

describe('platform-core-b2b-message-templates', () => {
  it('возвращает шаблоны заказа при orderId', () => {
    const rows = resolvePlatformCoreB2bMessageTemplates({ orderId: 'B2B-DEMO' });
    expect(rows.length).toBeGreaterThan(0);
    expect(rows.every((r) => r.context === 'b2b_order')).toBe(true);
    const ship = rows.find((r) => r.id === 'ship-window');
    expect(ship?.buildBody({ orderId: 'B2B-DEMO' })).toContain('B2B-DEMO');
  });

  it('возвращает шаблоны артикула при collection+article', () => {
    const rows = resolvePlatformCoreB2bMessageTemplates({
      collectionId: 'SS27',
      articleId: 'demo-ss27-01',
    });
    expect(rows.every((r) => r.context === 'workshop2_article')).toBe(true);
  });

  it('пусто без контекста', () => {
    expect(resolvePlatformCoreB2bMessageTemplates({})).toEqual([]);
  });

  it('есть «Уточнить отгрузку»', () => {
    expect(PLATFORM_CORE_B2B_MESSAGE_TEMPLATES.some((t) => t.id === 'ship-window')).toBe(true);
  });
});
