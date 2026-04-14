/**
 * @jest-environment node
 */

/** Cross-check Order vs Article derivation naming conventions (no new rules). */
import { mockB2BOrders } from '@/lib/order-data';
import { createSeedState } from '@/lib/brand-production/seed';
import {
  articleControlInputFromArticleEntity,
  buildArticleControlOutput,
} from '@/lib/control-adapters/article-control-output';
import { buildOrderControlOutput, orderControlInputFromB2BOrder } from '@/lib/control-adapters/order-control-output';

describe('derivation conventions (order + article)', () => {
  const asOfOrder = '2024-07-20T12:00:00.000Z';
  const asOfArticle = '2026-03-15T12:00:00.000Z';

  it('derived next_action rule_id uses {domain}.derive.* prefix', () => {
    const orderOut = buildOrderControlOutput(
      orderControlInputFromB2BOrder(mockB2BOrders[2]!, asOfOrder)
    );
    expect(orderOut.next_action?.source.kind).toBe('derived');
    if (orderOut.next_action?.source.kind === 'derived') {
      expect(orderOut.next_action.source.rule_id).toMatch(/^order\.derive\./);
    }

    const { articles } = createSeedState();
    const art2 = articles.find((a) => a.id === 'art-2')!;
    const articleOut = buildArticleControlOutput(
      articleControlInputFromArticleEntity(art2, asOfArticle)
    );
    expect(articleOut.next_action?.source.kind).toBe('derived');
    if (articleOut.next_action?.source.kind === 'derived') {
      expect(articleOut.next_action.source.rule_id).toMatch(/^article\.derive\./);
    }
  });

  it('derived blocker_id uses derived:{entity_type}:{id}:{slug} pattern', () => {
    const orderOut = buildOrderControlOutput(
      orderControlInputFromB2BOrder(mockB2BOrders[2]!, asOfOrder)
    );
    expect(orderOut.blocker_summary.top_blocker_ids.length).toBeGreaterThan(0);
    for (const id of orderOut.blocker_summary.top_blocker_ids) {
      expect(id).toMatch(/^derived:order:[^:]+:[a-z0-9_]+$/);
    }

    const { articles } = createSeedState();
    const art2 = articles.find((a) => a.id === 'art-2')!;
    const articleOut = buildArticleControlOutput(
      articleControlInputFromArticleEntity(art2, asOfArticle)
    );
    expect(articleOut.blocker_summary.top_blocker_ids.length).toBeGreaterThan(0);
    for (const id of articleOut.blocker_summary.top_blocker_ids) {
      expect(id).toMatch(/^derived:article:[^:]+:[a-z0-9_]+$/);
    }
  });
});
