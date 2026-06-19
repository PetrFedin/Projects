/**
 * Wave 23 — B2B full JOOR/NuOrder parity (+15 tests).
 */
import fs from 'node:fs';
import path from 'node:path';

import { emptyWorkshop2DossierPhase1 } from '@/lib/production/workshop2-phase1-dossier-storage';
import { buildWorkshop2Ss27MenCoat01FullTzDemoDossier } from '@/lib/production/workshop2-ss27-demo-full-tz-dossier';
import { findHandbookLeafById } from '@/lib/production/category-handbook-leaves';
import {
  buildWorkshop2B2bCatalogMatrix,
  buildWorkshop2B2bCampaign,
} from '@/lib/production/workshop2-b2b-campaign-hub';
import {
  WORKSHOP2_B2B_CAMPAIGN_CONTEXT_TYPE,
  workshop2B2bCampaignContextId,
} from '@/lib/production/workshop2-b2b-order-lifecycle';
import {
  acceptWorkshop2B2bBuyerInviteToken,
  buildWorkshop2B2bOrderExport1cPayload,
  clearWorkshop2B2bCartMemoryForTests,
  createWorkshop2B2bBuyerInviteToken,
  evaluateWorkshop2B2bCartSubmitDevelopmentGate,
  getWorkshop2B2bCartSession,
  mergeWorkshop2B2bCartToOrder,
  parseWorkshop2B2bCompareArticleIds,
  resolveWorkshop2B2bBestWholesalePriceRub,
  summarizeWorkshop2B2bWorkspaceHeaderRu,
  upsertWorkshop2B2bCartLine,
  validateWorkshop2B2bPrebookDeliveryDate,
  buildWorkshop2B2bLinesheetVersionLabel,
} from '@/lib/production/workshop2-b2b-wave23-parity';
import { buildWorkshop2Wave23B2bFullParityProbe } from '@/lib/production/workshop2-live-integration-probes';
import { attemptWorkshop2MarkingHonestSignHttpPost } from '@/lib/production/workshop2-marking-honest-sign';
import {
  clearWorkshop2B2bOrdersMemoryForTests,
  putWorkshop2B2bOrder,
} from '@/lib/server/workshop2-b2b-orders-repository';

describe('workshop2 wave23 b2b — qty breaks & version label', () => {
  it('resolves best wholesale price from qtyBreaks', () => {
    expect(
      resolveWorkshop2B2bBestWholesalePriceRub({
        totalQty: 50,
        basePriceRub: 5000,
        qtyBreaks: [
          { minQty: 10, priceRub: 4500 },
          { minQty: 40, priceRub: 4200 },
        ],
      })
    ).toBe(4200);
  });

  it('builds version label Early Bird v2', () => {
    expect(
      buildWorkshop2B2bLinesheetVersionLabel({
        campaignName: 'Early Bird',
        version: 2,
        supersedesId: 'camp-v1',
      })
    ).toContain('v2');
  });

  it('matrix exposes bestPriceRub when qtyBreaks in linesheet', () => {
    const leaf = findHandbookLeafById('catalog-apparel-g0-l0');
    const dossier = buildWorkshop2Ss27MenCoat01FullTzDemoDossier(leaf, 'w23');
    dossier.b2bIntegrationDraft = {
      ...dossier.b2bIntegrationDraft,
      qtyBreaks: [{ minQty: 10, priceRub: 4000 }],
    };
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
        qtyBreaks: [{ minQty: 10, priceRub: 4000 }],
      },
    });
    expect(matrix.cells[0]?.bestPriceRub).toBe(4000);
  });
});

describe('workshop2 wave23 b2b — multi-style cart', () => {
  beforeEach(() => clearWorkshop2B2bCartMemoryForTests());

  it('upserts lines for multiple articleIds in one session', () => {
    const session = upsertWorkshop2B2bCartLine({
      sessionId: 'sess-1',
      line: {
        collectionId: 'SS27',
        articleId: 'a1',
        colorCode: 'BLK',
        size: 'M',
        qty: 5,
        wholesalePriceRub: 1000,
      },
    });
    upsertWorkshop2B2bCartLine({
      sessionId: 'sess-1',
      line: {
        collectionId: 'SS27',
        articleId: 'a2',
        colorCode: 'WHT',
        size: 'L',
        qty: 3,
        wholesalePriceRub: 2000,
        lineNote: 'Срочно',
      },
    });
    const merged = getWorkshop2B2bCartSession('sess-1');
    expect(merged?.lines).toHaveLength(2);
    expect(merged?.lines.some((l) => l.lineNote === 'Срочно')).toBe(true);
  });

  it('checkout merge builds multi-article order', () => {
    upsertWorkshop2B2bCartLine({
      sessionId: 'sess-2',
      line: {
        collectionId: 'SS27',
        articleId: 'a1',
        colorCode: 'X',
        size: 'S',
        qty: 2,
        wholesalePriceRub: 100,
      },
    });
    upsertWorkshop2B2bCartLine({
      sessionId: 'sess-2',
      line: {
        collectionId: 'SS27',
        articleId: 'a2',
        colorCode: 'Y',
        size: 'M',
        qty: 1,
        wholesalePriceRub: 200,
      },
    });
    const order = mergeWorkshop2B2bCartToOrder({
      session: getWorkshop2B2bCartSession('sess-2')!,
      orderId: 'B2B-MULTI',
    });
    expect(order.lines).toHaveLength(2);
    expect(order.totalRub).toBe(400);
  });
});

describe('workshop2 wave23 b2b — prebook validation', () => {
  it('rejects delivery date outside preorder window', () => {
    const bad = validateWorkshop2B2bPrebookDeliveryDate({
      deliveryDate: '2026-01-01',
      preorderWindow: { startDate: '2026-06-01', endDate: '2026-08-31' },
    });
    expect(bad.ok).toBe(false);
  });

  it('accepts date inside window', () => {
    const ok = validateWorkshop2B2bPrebookDeliveryDate({
      deliveryDate: '2026-07-15',
      preorderWindow: { startDate: '2026-06-01', endDate: '2026-08-31' },
    });
    expect(ok.ok).toBe(true);
  });
});

describe('workshop2 wave23 b2b — compare & invites', () => {
  beforeEach(() => clearWorkshop2B2bCartMemoryForTests());

  it('parseWorkshop2B2bCompareArticleIds caps at 3', () => {
    expect(parseWorkshop2B2bCompareArticleIds('a1,a2,a3,a4')).toEqual(['a1', 'a2', 'a3']);
  });

  it('invite token flow sets partner session', () => {
    const { token } = createWorkshop2B2bBuyerInviteToken({
      buyerEmail: 'buyer@test.ru',
      tier: 'vip',
    });
    const accepted = acceptWorkshop2B2bBuyerInviteToken(token);
    expect(accepted.ok).toBe(true);
    if (accepted.ok) {
      expect(accepted.tier).toBe('vip');
      expect(getWorkshop2B2bCartSession(accepted.sessionId)?.buyerId).toBe('buyer@test.ru');
    }
  });
});

describe('workshop2 wave23 b2b — development gate & export', () => {
  const prevDb = process.env.WORKSHOP2_DATABASE_URL;

  beforeEach(() => {
    delete process.env.WORKSHOP2_DATABASE_URL;
    delete process.env.WORKSHOP2_DOSSIER_DATABASE_URL;
    clearWorkshop2B2bOrdersMemoryForTests();
  });

  afterEach(() => {
    if (prevDb) process.env.WORKSHOP2_DATABASE_URL = prevDb;
    else delete process.env.WORKSHOP2_DATABASE_URL;
  });

  it('blocks cart submit on empty dossier', () => {
    const gate = evaluateWorkshop2B2bCartSubmitDevelopmentGate({
      dossier: emptyWorkshop2DossierPhase1(),
      articleId: 'x',
    });
    expect(gate.allowed).toBe(false);
  });

  it('buildWorkshop2B2bOrderExport1cPayload includes commerceMl', async () => {
    const leaf = findHandbookLeafById('catalog-apparel-g0-l0');
    const dossier = buildWorkshop2Ss27MenCoat01FullTzDemoDossier(leaf, 'w23-export');
    const now = new Date().toISOString();
    await putWorkshop2B2bOrder({
      id: 'B2B-EXP',
      status: 'draft',
      tier: 'standard',
      totalRub: 1000,
      lines: [
        {
          collectionId: 'SS27',
          articleId: 'demo-ss27-01',
          colorCode: 'BLK',
          size: 'M',
          qty: 1,
          wholesalePriceRub: 1000,
        },
      ],
      createdAt: now,
      updatedAt: now,
    });
    const map = new Map([['demo-ss27-01', dossier]]);
    const exp = buildWorkshop2B2bOrderExport1cPayload({
      order: {
        id: 'B2B-EXP',
        status: 'draft',
        tier: 'standard',
        totalRub: 1000,
        lines: [
          {
            collectionId: 'SS27',
            articleId: 'demo-ss27-01',
            colorCode: 'BLK',
            size: 'M',
            qty: 1,
            wholesalePriceRub: 1000,
          },
        ],
        createdAt: now,
        updatedAt: now,
      },
      dossierByArticle: map,
    });
    expect(exp.lines.length).toBe(1);
    expect(exp.commerceMl).toContain('КоммерческаяИнформация');
  });
});

describe('workshop2 wave23 b2b — horizontal links', () => {
  it('campaign chat context id', () => {
    expect(WORKSHOP2_B2B_CAMPAIGN_CONTEXT_TYPE).toBe('b2b_campaign');
    expect(workshop2B2bCampaignContextId('SS27', 'demo-ss27-01')).toBe('SS27::demo-ss27-01');
  });

  it('workspace header summary ru', () => {
    expect(summarizeWorkshop2B2bWorkspaceHeaderRu({ orderCount: 2, totalRub: 150000 })).toContain(
      '2'
    );
    expect(summarizeWorkshop2B2bWorkspaceHeaderRu({ orderCount: 2, totalRub: 150000 })).toContain(
      '₽'
    );
  });

  it('buildWorkshop2Wave23B2bFullParityProbe', () => {
    const probe = buildWorkshop2Wave23B2bFullParityProbe({ WORKSHOP2_MARKET: 'ru' });
    expect(probe.checks.some((c) => c.id === 'b2b_multi_style_cart_api')).toBe(true);
    expect(probe.checks.length).toBeGreaterThanOrEqual(20);
  });

  it('marking http attempt fail-closed on bad url', async () => {
    const r = await attemptWorkshop2MarkingHonestSignHttpPost({
      apiUrl: 'http://127.0.0.1:1/not-a-real-marking-api',
      payload: {
        gtin: '4600000000000',
        markingOrderId: 'm1',
        collectionId: 'SS27',
        articleId: 'demo-ss27-01',
      },
    });
    expect(r.attempted).toBe(true);
    expect(r.ok).toBe(false);
  });

  it('scripts and parity matrix exist', () => {
    const root = process.cwd();
    expect(fs.existsSync(path.join(root, 'scripts/workshop2-mes-mock-server.mjs'))).toBe(true);
    expect(fs.existsSync(path.join(root, '.planning/workshop2-b2b-joor-parity-matrix.md'))).toBe(
      true
    );
  });
});

describe('workshop2 wave23 b2b — campaign version in hub', () => {
  it('buildWorkshop2B2bCampaign includes versionLabel', () => {
    const leaf = findHandbookLeafById('catalog-apparel-g0-l0');
    const dossier = buildWorkshop2Ss27MenCoat01FullTzDemoDossier(leaf, 'w23-ver');
    const campaign = buildWorkshop2B2bCampaign({
      collectionId: 'SS27',
      articleId: 'demo-ss27-01',
      dossier,
      campaign: {
        collectionId: 'SS27',
        articleId: 'demo-ss27-01',
        campaignName: 'Early Bird',
        published: true,
        version: 2,
        supersedesId: 'v1',
        updatedAt: new Date().toISOString(),
      },
    });
    expect(campaign.versionLabel).toContain('v2');
  });
});
