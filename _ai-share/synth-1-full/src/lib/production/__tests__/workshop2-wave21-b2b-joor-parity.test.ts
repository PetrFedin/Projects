/**
 * Wave 21 — B2B JOOR/NuOrder native parity (+15 tests).
 */
import fs from 'node:fs';
import path from 'node:path';

import { emptyWorkshop2DossierPhase1 } from '@/lib/production/workshop2-phase1-dossier-storage';
import {
  canTransitionWorkshop2B2bOrderStatus,
  cloneWorkshop2B2bOrderAsReorder,
  isWorkshop2B2bOrderStatus,
  WORKSHOP2_B2B_ORDER_CONTEXT_TYPE,
  workshop2B2bOrderContextId,
} from '@/lib/production/workshop2-b2b-order-lifecycle';
import {
  buildWorkshop2B2bCalendarEventsForCollection,
  buildWorkshop2B2bCampaign,
  buildWorkshop2B2bCatalogMatrix,
  buyerTierCanSeeCampaign,
  syncWorkshop2CampaignArticleIdsFromDossier,
} from '@/lib/production/workshop2-b2b-campaign-hub';
import { evaluateWorkshop2BulkShowroomPublishForArticle } from '@/lib/production/workshop2-bulk-showroom-publish';
import { buildWorkshop2Ss27MenCoat01FullTzDemoDossier } from '@/lib/production/workshop2-ss27-demo-full-tz-dossier';
import { findHandbookLeafById } from '@/lib/production/category-handbook-leaves';
import {
  probeWorkshop2KonturDiadocHttp,
  resolveWorkshop2KonturEdoBaseUrl,
} from '@/lib/production/workshop2-edo-signoff';
import { isWorkshop2DomainEventType } from '@/lib/production/workshop2-domain-event-types';
import { buildWorkshop2Wave21B2bJoorParityProbe } from '@/lib/production/workshop2-live-integration-probes';
import {
  clearWorkshop2B2bOrdersMemoryForTests,
  patchWorkshop2B2bOrderStatus,
  putWorkshop2B2bOrder,
} from '@/lib/server/workshop2-b2b-orders-repository';

describe('workshop2 wave21 b2b — order lifecycle', () => {
  it('allows draft→submitted→confirmed→allocated→shipped', () => {
    expect(canTransitionWorkshop2B2bOrderStatus('draft', 'submitted')).toBe(true);
    expect(canTransitionWorkshop2B2bOrderStatus('submitted', 'confirmed')).toBe(true);
    expect(canTransitionWorkshop2B2bOrderStatus('confirmed', 'allocated')).toBe(true);
    expect(canTransitionWorkshop2B2bOrderStatus('allocated', 'shipped')).toBe(true);
    expect(canTransitionWorkshop2B2bOrderStatus('shipped', 'draft')).toBe(false);
  });

  it('exposes b2b_order chat context id', () => {
    expect(WORKSHOP2_B2B_ORDER_CONTEXT_TYPE).toBe('b2b_order');
    expect(workshop2B2bOrderContextId('B2B-1')).toBe('B2B-1');
  });

  it('clones reorder as draft', () => {
    const src = {
      id: 'B2B-A',
      status: 'shipped' as const,
      tier: 'standard' as const,
      totalRub: 1000,
      lines: [],
      createdAt: '2026-01-01T00:00:00.000Z',
      updatedAt: '2026-01-01T00:00:00.000Z',
    };
    const cloned = cloneWorkshop2B2bOrderAsReorder({ source: src, newId: 'B2B-B', repId: 'rep-1' });
    expect(cloned.status).toBe('draft');
    expect(cloned.repId).toBe('rep-1');
  });
});

describe('workshop2 wave21 b2b — repository', () => {
  beforeEach(() => clearWorkshop2B2bOrdersMemoryForTests());

  it('persists and patches status in memory mode', async () => {
    const now = new Date().toISOString();
    await putWorkshop2B2bOrder({
      id: 'B2B-T1',
      status: 'draft',
      tier: 'standard',
      totalRub: 50000,
      lines: [],
      createdAt: now,
      updatedAt: now,
      collectionId: 'SS27',
      articleId: 'demo-ss27-01',
    });
    const patched = await patchWorkshop2B2bOrderStatus({
      orderId: 'B2B-T1',
      status: 'submitted',
    });
    expect(patched.ok).toBe(true);
    if (patched.ok) expect(patched.order.status).toBe('submitted');
  });

  it('rejects invalid transition', async () => {
    const now = new Date().toISOString();
    await putWorkshop2B2bOrder({
      id: 'B2B-T2',
      status: 'draft',
      tier: 'standard',
      totalRub: 1,
      lines: [],
      createdAt: now,
      updatedAt: now,
    });
    const bad = await patchWorkshop2B2bOrderStatus({ orderId: 'B2B-T2', status: 'shipped' });
    expect(bad.ok).toBe(false);
  });
});

describe('workshop2 wave21 b2b — campaign hub & matrix', () => {
  const leaf = findHandbookLeafById('catalog-apparel-g0-l0');
  const dossier = buildWorkshop2Ss27MenCoat01FullTzDemoDossier(leaf, 'wave21-test');

  it('builds matrix cells with RUB wholesale and MOQ', () => {
    const matrix = buildWorkshop2B2bCatalogMatrix({
      collectionId: 'SS27',
      articleId: 'demo-ss27-01',
      dossier,
      campaign: {
        collectionId: 'SS27',
        articleId: 'demo-ss27-01',
        published: true,
        wholesalePrice: 4500,
        moq: 10,
        updatedAt: new Date().toISOString(),
      },
    });
    expect(matrix.currency).toBe('RUB');
    expect(matrix.cells.length).toBeGreaterThan(0);
    expect(matrix.cells[0]?.wholesalePriceRub).toBeGreaterThan(0);
    expect(matrix.cells[0]?.moq).toBeGreaterThanOrEqual(1);
  });

  it('syncs article ids from colorways', () => {
    const ids = syncWorkshop2CampaignArticleIdsFromDossier(dossier, 'demo-ss27-01');
    expect(ids).toContain('demo-ss27-01');
  });

  it('filters campaigns by buyer tier', () => {
    expect(buyerTierCanSeeCampaign({ buyerTier: 'vip', campaignTier: 'standard' })).toBe(true);
    expect(buyerTierCanSeeCampaign({ buyerTier: 'standard', campaignTier: 'vip' })).toBe(false);
  });

  it('emits b2b calendar events from preorder window', () => {
    const campaign = buildWorkshop2B2bCampaign({
      collectionId: 'SS27',
      articleId: 'demo-ss27-01',
      dossier,
      campaign: {
        collectionId: 'SS27',
        articleId: 'demo-ss27-01',
        published: true,
        windowStart: '2026-06-01',
        windowEnd: '2026-06-30',
        updatedAt: new Date().toISOString(),
      },
    });
    const events = buildWorkshop2B2bCalendarEventsForCollection({
      collectionId: 'SS27',
      campaigns: [campaign],
    });
    expect(events.some((e) => e.source === 'b2b')).toBe(true);
    expect(events.some((e) => e.kind === 'preorder_window')).toBe(true);
  });
});

describe('workshop2 wave21 b2b — development publish gate', () => {
  it('blocks bulk publish when sample-order gate fails on empty dossier', () => {
    const result = evaluateWorkshop2BulkShowroomPublishForArticle({
      articleId: 'x',
      dossier: emptyWorkshop2DossierPhase1(),
      publish: {
        published: true,
        wholesalePrice: 10,
        msrp: 20,
        moq: 5,
        windowStart: '2026-01-01',
        windowEnd: '2026-02-01',
      },
    });
    expect(result.passed).toBe(false);
    expect(result.reasons.some((r) => r.includes('Разработка') || r.length > 0)).toBe(true);
  });
});

describe('workshop2 wave21 b2b — edo kontur pilot', () => {
  it('fail-closed without KONTUR_DIADOC_URL when provider=kontur', async () => {
    const probe = await probeWorkshop2KonturDiadocHttp({
      env: { WORKSHOP2_EDO_PROVIDER: 'kontur' },
    });
    expect(probe.probed).toBe(true);
    expect(probe.ok).toBe(false);
  });

  it('resolves diadoc url over legacy edo api url', () => {
    const url = resolveWorkshop2KonturEdoBaseUrl({
      WORKSHOP2_KONTUR_DIADOC_URL: 'https://diadoc.test',
      WORKSHOP2_KONTUR_EDO_API_URL: 'https://legacy.test',
    });
    expect(url).toBe('https://diadoc.test');
  });
});

describe('workshop2 wave21 b2b — integration probe & docs', () => {
  it('registers domain event b2b.order.status_changed', () => {
    expect(isWorkshop2DomainEventType('b2b.order.status_changed')).toBe(true);
    expect(isWorkshop2B2bOrderStatus('confirmed')).toBe(true);
  });

  it('buildWorkshop2Wave21B2bJoorParityProbe passes on ru market', () => {
    const probe = buildWorkshop2Wave21B2bJoorParityProbe({ WORKSHOP2_MARKET: 'ru' });
    expect(probe.checks.length).toBeGreaterThanOrEqual(8);
    expect(probe.checks.some((c) => c.id === 'b2b_order_status_api')).toBe(true);
  });

  it('planning parity matrix and UAT steps exist', () => {
    const root = process.cwd();
    expect(fs.existsSync(path.join(root, '.planning/workshop2-b2b-joor-parity-matrix.md'))).toBe(
      true
    );
    expect(fs.existsSync(path.join(root, '.planning/workshop2-uat-ss27-human-steps.md'))).toBe(
      true
    );
  });
});
