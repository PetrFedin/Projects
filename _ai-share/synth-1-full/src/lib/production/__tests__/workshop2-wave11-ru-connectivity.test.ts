/**
 * Wave 11 RU — connectivity, dead-ends fixed, probes, supply batch, linkedPaths.
 */
import { emptyWorkshop2DossierPhase1 } from '@/lib/production/workshop2-phase1-dossier-storage';
import { resolveRetailPartnerIdForB2bSession } from '@/lib/b2b/resolve-retail-partner-id';
import {
  resolveShowroomLookbookWorkspaceHref,
  resolveShowroomWorkspaceArticleId,
} from '@/lib/b2b/showroom-workspace-deep-links';
import {
  buildWorkshop2DossierLinkedPaths,
  workshop2ArticleContextDescriptor,
} from '@/lib/production/workshop2-dossier-linked-paths';
import { summarizeWorkshop2RuStatusStrip } from '@/lib/production/workshop2-ru-status-strip-summary';
import { buildWorkshop2CollectionHubSummary } from '@/lib/production/workshop2-hub-summary';
import { applyWorkshop2SupplyBatchPatchOnDossier } from '@/lib/production/workshop2-supply-batch-patch';
import {
  filterWorkshop2BrandNavGroupsForMarket,
  shouldHideBrandNavLinkForWorkshop2Market,
} from '@/lib/production/workshop2-brand-nav-market-filter';
import { buildWorkshop2InvestorReadinessReport } from '@/lib/production/workshop2-investor-readiness';
import { buildWorkshop2Wave11RuConnectivityProbe } from '@/lib/production/workshop2-live-integration-probes';
import { appendWorkshop2VendorBidToDossier } from '@/lib/production/workshop2-vendor-bids';
import { formatWorkshop2RubCurrency } from '@/lib/production/workshop2-rub-currency';
import {
  listWorkshop2ContextualMessageThreads,
  clearWorkshop2ContextualMessagesMemoryForTests,
  appendWorkshop2ContextualMessage,
} from '@/lib/server/workshop2-contextual-messages-repository';

describe('workshop2 wave11 — retail partner resolver', () => {
  it('defaults to retail_msk_1 without session', () => {
    expect(resolveRetailPartnerIdForB2bSession()).toBe('retail_msk_1');
  });

  it('uses explicit partner override', () => {
    expect(resolveRetailPartnerIdForB2bSession({ explicitPartnerId: 'retail_spb_1' })).toBe(
      'retail_spb_1'
    );
  });

  it('prefers active org from territory map when provided', () => {
    expect(resolveRetailPartnerIdForB2bSession({ activeOrganizationId: 'retail_msk_1' })).toBe(
      'retail_msk_1'
    );
  });
});

describe('workshop2 wave11 — showroom workspace deep links', () => {
  it('maps SS27 collection to demo article', () => {
    expect(resolveShowroomWorkspaceArticleId({ collectionId: 'SS27', id: 'lb-ss27' })).toBe(
      'demo-ss27-01'
    );
  });

  it('builds workspace href', () => {
    const href = resolveShowroomLookbookWorkspaceHref({
      id: 'lb-ss27',
      collectionId: 'SS27',
    });
    expect(href).toContain('/brand/production/workshop2/c/SS27/a/demo-ss27-01');
  });
});

describe('workshop2 wave11 — dossier linkedPaths', () => {
  it('returns chat floor marking paths', () => {
    const paths = buildWorkshop2DossierLinkedPaths({
      collectionId: 'SS27',
      articleId: 'demo-ss27-01',
    });
    expect(paths.workspace).toContain('demo-ss27-01');
    expect(paths.floor).toContain('floorTab');
    expect(paths.markingCsv).toContain('marking/export-csv');
    expect(paths.chat).toContain('workshop2');
  });

  it('includes schet-offerta when marketplace order id present', () => {
    const paths = buildWorkshop2DossierLinkedPaths({
      collectionId: 'SS27',
      articleId: 'demo-ss27-01',
      dossier: {
        ...emptyWorkshop2DossierPhase1(),
        b2bIntegrationDraft: { lastMarketplaceOrderId: 'ord-42' },
      },
    });
    expect(paths.schetOfferta).toContain('ord-42');
    expect(paths.b2bShowroom).toMatch(/showroom/i);
  });
});

describe('workshop2 wave11 — ru status strip', () => {
  it('summarizes from dossier', () => {
    const d = {
      ...emptyWorkshop2DossierPhase1(),
      passportProductionBrief: { targetFob: 12_000, markingRequired: true },
    };
    const s = summarizeWorkshop2RuStatusStrip(d);
    expect(s?.totalRubLabel).toMatch(/₽/);
    expect(typeof s?.gateBlockerCount).toBe('number');
  });
});

describe('workshop2 wave11 — hub summary', () => {
  it('batch mini status per article', () => {
    const summary = buildWorkshop2CollectionHubSummary({
      collectionId: 'SS27',
      articles: [{ articleId: 'a1', dossier: emptyWorkshop2DossierPhase1() }],
    });
    expect(summary.articles).toHaveLength(1);
    expect(summary.articles[0]?.workspaceHref).toContain('SS27');
  });
});

describe('workshop2 wave11 — supply batch patch', () => {
  it('chains lab dip costing vendor winner mirrors', () => {
    let d = emptyWorkshop2DossierPhase1();
    const withBid = appendWorkshop2VendorBidToDossier({
      dossier: d,
      bid: {
        vendorId: 'v1',
        vendorName: 'Vendor A',
        cmtPrice: 100,
        currency: 'RUB',
        leadTimeDays: 14,
        moq: 50,
      },
    }).dossier;
    const batch = applyWorkshop2SupplyBatchPatchOnDossier({
      dossier: withBid,
      supply: { lines: [], updatedAt: new Date().toISOString() },
    });
    expect(batch.applied).toContain('labDipMirror');
    expect(batch.applied).toContain('costingRub');
    expect(batch.applied).toContain('vendorBidsMirror');
    expect(batch.dossier.vendorBidsMirror?.lowestVendorId).toBe('v1');
  });
});

describe('workshop2 wave11 — brand nav market filter', () => {
  it('hides JOOR pay link in ru', () => {
    expect(
      shouldHideBrandNavLinkForWorkshop2Market('shop-b2b-payment', { WORKSHOP2_MARKET: 'ru' })
    ).toBe(true);
    expect(
      shouldHideBrandNavLinkForWorkshop2Market('shop-b2b-payment', { WORKSHOP2_MARKET: 'global' })
    ).toBe(false);
  });

  it('filters nav groups', () => {
    const mockNavGroups = [
      {
        id: 'b2b',
        label: 'B2B',
        clusterId: 'syntha-cores',
        icon: null,
        scope: 'shared',
        links: [
          {
            label: 'JOOR Pay',
            value: 'shop-b2b-payment',
            icon: null,
            href: '/pay',
            description: '',
          },
          {
            label: 'Showroom',
            value: 'shop-b2b-showroom',
            icon: null,
            href: '/showroom',
            description: '',
          },
        ],
      },
    ] as Parameters<typeof filterWorkshop2BrandNavGroupsForMarket>[0];
    const filtered = filterWorkshop2BrandNavGroupsForMarket(mockNavGroups, {
      WORKSHOP2_MARKET: 'ru',
    });
    const values = filtered.flatMap((g) => g.links.map((l) => l.value));
    expect(values).not.toContain('shop-b2b-payment');
    expect(values).toContain('shop-b2b-showroom');
  });
});

describe('workshop2 wave11 — investor readiness ru', () => {
  it('filters global-only reason strings in ru market', () => {
    const report = buildWorkshop2InvestorReadinessReport({
      env: {
        WORKSHOP2_MARKET: 'ru',
        WORKSHOP2_UNIT_TESTS_PASSING: 'true',
      },
      ss27Dossiers: [emptyWorkshop2DossierPhase1()],
    });
    expect(report.reasons.some((r) => /shopify/i.test(r))).toBe(false);
  });
});

describe('workshop2 wave11 — contextual threads aggregate', () => {
  beforeEach(() => {
    clearWorkshop2ContextualMessagesMemoryForTests();
  });

  it('groups threads in memory store', async () => {
    await appendWorkshop2ContextualMessage({
      contextType: 'workshop2_article',
      contextId: 'SS27:demo-ss27-01',
      message: 'Привет из PG',
    });
    const threads = await listWorkshop2ContextualMessageThreads({
      contextType: 'workshop2_article',
    });
    expect(threads.length).toBe(1);
    expect(threads[0]?.collectionId).toBe('SS27');
    expect(threads[0]?.articleId).toBe('demo-ss27-01');
  });
});

describe('workshop2 wave11 — wave11RuConnectivity probe', () => {
  it('reports deadEndsFixed count', () => {
    const probe = buildWorkshop2Wave11RuConnectivityProbe({ WORKSHOP2_MARKET: 'ru' });
    expect(probe.deadEndsFixed).toBeGreaterThanOrEqual(10);
    expect(probe.checks.some((c) => c.id === 'brand_messages_threads' && c.ok)).toBe(true);
  });
});

describe('workshop2 wave11 — rub currency no stray USD in helper', () => {
  it('formats rub not dollar', () => {
    expect(formatWorkshop2RubCurrency(1000)).not.toContain('$');
    expect(formatWorkshop2RubCurrency(1000)).toContain('₽');
  });

  it('handles zero and large amounts', () => {
    expect(formatWorkshop2RubCurrency(0)).toContain('₽');
    expect(formatWorkshop2RubCurrency(1_500_000)).not.toContain('USD');
  });
});

describe('workshop2 wave11 — article context descriptor', () => {
  it('builds workshop2_article context id', () => {
    const d = workshop2ArticleContextDescriptor('SS27', 'demo-ss27-01');
    expect(d.contextType).toBe('workshop2_article');
    expect(d.contextId).toBe('SS27:demo-ss27-01');
  });
});

describe('workshop2 wave11 — supply batch applied fields', () => {
  it('always mirrors supply ops even without supply payload', () => {
    const batch = applyWorkshop2SupplyBatchPatchOnDossier({
      dossier: emptyWorkshop2DossierPhase1(),
    });
    expect(batch.applied).toContain('supplyOpsMirror');
  });
});
