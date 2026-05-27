/**
 * Wave 10 P0: market=ru не отключает hub, 8 w2pane, core API flows.
 */
import {
  auditWorkshop2RuCoreNotDisabled,
  WORKSHOP2_CORE_ARTICLE_PANES,
} from '@/lib/production/workshop2-ru-core-routes-audit';
import {
  isWorkshop2IntegrationEnabledForMarket,
  listWorkshop2GlobalOnlyIntegrationIds,
} from '@/lib/production/workshop2-market-profile';
import {
  parseWorkshop2ArticlePaneParam,
  workshop2ArticleHref,
} from '@/lib/production/workshop2-url';

describe('workshop2 ru core not disabled', () => {
  it('audit passes for ru market', () => {
    const a = auditWorkshop2RuCoreNotDisabled({ WORKSHOP2_MARKET: 'ru' });
    expect(a.ok).toBe(true);
    expect(a.panesAllowed.length).toBeGreaterThanOrEqual(8);
    expect(a.globalOnlyHidden).toEqual(listWorkshop2GlobalOnlyIntegrationIds());
  });

  it('all core panes parse for ru routes', () => {
    for (const pane of WORKSHOP2_CORE_ARTICLE_PANES) {
      expect(parseWorkshop2ArticlePaneParam(pane)).not.toBeNull();
      const href = workshop2ArticleHref('SS27', 'demo-01', { w2pane: pane });
      expect(href).toContain('w2pane=');
    }
  });

  it('global market re-enables joor', () => {
    expect(isWorkshop2IntegrationEnabledForMarket('joor', { WORKSHOP2_MARKET: 'global' })).toBe(
      true
    );
    expect(isWorkshop2IntegrationEnabledForMarket('joor', { WORKSHOP2_MARKET: 'ru' })).toBe(false);
    expect(isWorkshop2IntegrationEnabledForMarket('moysklad', { WORKSHOP2_MARKET: 'ru' })).toBe(
      true
    );
  });

  it('core API patterns documented', () => {
    const a = auditWorkshop2RuCoreNotDisabled({});
    expect(a.coreApiPatterns.some((p) => p.includes('sample-order'))).toBe(true);
    expect(a.coreApiPatterns.some((p) => p.includes('handoff'))).toBe(true);
  });
});
