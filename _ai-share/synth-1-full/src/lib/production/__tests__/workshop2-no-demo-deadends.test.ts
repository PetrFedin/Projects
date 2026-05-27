/** @jest-environment node */

import { POST as erpSyncPost } from '@/app/api/production/erp/sync/route';
import { POST as reqPost } from '@/app/api/brand/workshop2/phase1-dossier/requisitions/route';
import {
  evaluateWorkshop2ShowroomLocalPublishedUi,
  formatWorkshop2DataModeBadgeLabel,
  isWorkshop2NestingSimulationUiSuccessAllowed,
  isWorkshop2ProductionErpDialogSyncSuccess,
  isWorkshop2SmartRoutingDemoBlockedInProduction,
  parseWorkshop2LegacyRequisitionResponse,
  resolveWorkshop2SmartRoutingProductionEngineKind,
  shouldRenderWorkshop2DataModeBadgeInPanel,
  shouldShowWorkshop2SmartRoutingDemoWarning,
  shouldShowWorkshop2VendorBiddingPlaceholder,
  summarizeWorkshop2MatchmakerSyncUi,
  summarizeWorkshop2ProductionErpDialogSyncOutcome,
} from '@/lib/production/workshop2-no-demo-deadends';
import { callWorkshop2NestingSimulationStub } from '@/lib/production/workshop2-nesting-request';
import { emptyWorkshop2DossierPhase1 } from '@/lib/production/workshop2-phase1-dossier-storage';
import {
  buildWorkshop2WarehouseStockDeepLinks,
  resolveWorkshop2WarehouseStockArticleSegments,
} from '@/lib/production/workshop2-warehouse-stock-deep-links';
import { workshop2ArticleHref } from '@/lib/production/workshop2-url';

describe('workshop2 no-demo dead-ends', () => {
  const prodEnv = { NODE_ENV: 'production' } as NodeJS.ProcessEnv;

  describe('#1 smart routing', () => {
    it('WORKSHOP2_SMART_ROUTING_DEMO default OFF in production', () => {
      delete process.env.WORKSHOP2_SMART_ROUTING_DEMO;
      expect(isWorkshop2SmartRoutingDemoBlockedInProduction(prodEnv)).toBe(true);
    });

    it('demo_template blocked in production without dev flag', () => {
      delete process.env.WORKSHOP2_SMART_ROUTING_DEMO;
      const dossier = {
        ...emptyWorkshop2DossierPhase1(),
        smartRoutingFromDemo: true,
        smartRoutingSequence: [
          { id: '1', category: 'Монтаж', name: 'Шов', equipment: 'M', sash: 1 },
        ],
      };
      expect(shouldShowWorkshop2SmartRoutingDemoWarning({ dossier, env: prodEnv })).toBe(true);
      expect(resolveWorkshop2SmartRoutingProductionEngineKind({ dossier, env: prodEnv })).toBe(
        'empty'
      );
    });

    it('demo_template allowed when WORKSHOP2_SMART_ROUTING_DEMO=1', () => {
      const env = { ...prodEnv, WORKSHOP2_SMART_ROUTING_DEMO: '1' } as NodeJS.ProcessEnv;
      const dossier = {
        ...emptyWorkshop2DossierPhase1(),
        smartRoutingFromDemo: true,
        smartRoutingSequence: [
          { id: '1', category: 'Монтаж', name: 'Шов', equipment: 'M', sash: 1 },
        ],
      };
      expect(isWorkshop2SmartRoutingDemoBlockedInProduction(env)).toBe(false);
      expect(resolveWorkshop2SmartRoutingProductionEngineKind({ dossier, env })).toBe(
        'demo_template'
      );
    });
  });

  describe('#2 nesting simulate', () => {
    it('production without NESTING_API_URL → UI success blocked', async () => {
      delete process.env.WORKSHOP2_NESTING_API_URL;
      const res = await callWorkshop2NestingSimulationStub({
        collectionId: 'SS27',
        articleId: 'demo-ss27-01',
        sampleOrderId: 'so-1',
        nesting: { fabricWidthCm: 150 },
        env: { NODE_ENV: 'production' },
      });
      expect(res.ok).toBe(false);
      expect(res.error).toBe('nesting_stub_disabled_in_production');
      expect(isWorkshop2NestingSimulationUiSuccessAllowed(res)).toBe(false);
    });
  });

  describe('#3 showroom B2B local published', () => {
    it('local published without PG campaign = blocked link', () => {
      const ui = evaluateWorkshop2ShowroomLocalPublishedUi({
        localPublished: true,
        hasPersistedCampaign: false,
        dataMode: 'http',
      });
      expect(ui.showPublicLink).toBe(false);
      expect(ui.vitrineLabel).toBe('Local (не PG)');
      expect(ui.blockedReasonRu).toMatch(/PG/);
    });

    it('PG campaign allows public link', () => {
      const ui = evaluateWorkshop2ShowroomLocalPublishedUi({
        localPublished: true,
        hasPersistedCampaign: true,
        dataMode: 'http',
      });
      expect(ui.showPublicLink).toBe(true);
      expect(ui.vitrineLabel).toBe('Опубликован (PG)');
    });
  });

  describe('#4 B2B/ERP integrations dialog', () => {
    it('success only when configured===true', () => {
      expect(
        isWorkshop2ProductionErpDialogSyncSuccess({ success: true, configured: false, noOp: true })
      ).toBe(false);
      expect(isWorkshop2ProductionErpDialogSyncSuccess({ success: true, configured: true })).toBe(
        true
      );
    });

    it('ERP sync route returns configured:false without env', async () => {
      delete process.env.ERP_1C_URL;
      const res = await erpSyncPost(
        new Request('http://localhost/api/production/erp/sync', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ provider: '1c', scope: 'all' }),
        })
      );
      const json = (await res.json()) as { success?: boolean; configured?: boolean };
      expect(json.configured).toBe(false);
      expect(json.success).toBe(false);
      const outcome = summarizeWorkshop2ProductionErpDialogSyncOutcome(json);
      expect(outcome.destructive).toBe(true);
    });
  });

  describe('#5 vendor bidding panel', () => {
    it('placeholder without articleId', () => {
      expect(shouldShowWorkshop2VendorBiddingPlaceholder({ articleId: '', bidsCount: 3 })).toBe(
        true
      );
    });

    it('placeholder with fake bids (no dossier link)', () => {
      expect(
        shouldShowWorkshop2VendorBiddingPlaceholder({
          articleId: 'demo-ss27-01',
          bidsCount: 2,
          hasDossierBidLink: false,
        })
      ).toBe(true);
    });
  });

  describe('#6 warehouse stock deep links', () => {
    it('SS27 → real w2pane=stock hrefs per article', () => {
      const links = buildWorkshop2WarehouseStockDeepLinks({
        collections: [{ id: 'SS27', name: 'SS27' }],
      });
      expect(links.length).toBeGreaterThanOrEqual(3);
      for (const link of links) {
        expect(link.href).toContain('w2pane=stock');
        expect(link.href).toContain('/workshop2/c/SS27/a/');
      }
      expect(links[0]?.href).toBe(
        workshop2ArticleHref('SS27', 'demo-ss27-01', { w2pane: 'stock' })
      );
    });

    it('unknown collection falls back to collection hub', () => {
      const segments = resolveWorkshop2WarehouseStockArticleSegments({ collectionId: 'FW26-Main' });
      expect(segments).toEqual([]);
      const links = buildWorkshop2WarehouseStockDeepLinks({
        collections: [{ id: 'FW26-Main', name: 'FW26' }],
      });
      expect(links[0]?.kind).toBe('collection_hub');
    });
  });

  describe('#7 matchmaker sync label', () => {
    it('no synced label without dossier mirror', () => {
      const ui = summarizeWorkshop2MatchmakerSyncUi({
        hasMatchmakerResult: true,
        hasMatchmakerMirror: false,
        lastRunAt: new Date().toISOString(),
      });
      expect(ui.mirrorInPg).toBe(false);
      expect(ui.label).toMatch(/mirror не в PG/i);
      expect(ui.label).not.toMatch(/synced/i);
    });

    it('mirror in PG → emerald label', () => {
      const ui = summarizeWorkshop2MatchmakerSyncUi({
        hasMatchmakerResult: true,
        hasMatchmakerMirror: true,
        lastRunAt: '2026-05-20T12:00:00.000Z',
      });
      expect(ui.mirrorInPg).toBe(true);
      expect(ui.tone).toBe('emerald');
    });
  });

  describe('#8 requisitions legacy 410', () => {
    it('POST without collectionId/articleId → 410 + migration message', async () => {
      const res = await reqPost(
        new Request('http://localhost/api/requisitions', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ quantity: 100 }),
        })
      );
      expect(res.status).toBe(410);
      const json = (await res.json()) as Record<string, unknown>;
      const parsed = parseWorkshop2LegacyRequisitionResponse({ status: res.status, body: json });
      expect(parsed.isLegacy).toBe(true);
      expect(parsed.messageRu).toMatch(/sample-material-request/);
    });

    it('POST with ids → 308 redirect hint', async () => {
      const res = await reqPost(
        new Request('http://localhost/api/requisitions', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ collectionId: 'SS27', articleId: 'demo-ss27-01' }),
        })
      );
      expect(res.status).toBe(308);
      const json = (await res.json()) as Record<string, unknown>;
      const parsed = parseWorkshop2LegacyRequisitionResponse({ status: res.status, body: json });
      expect(parsed.canonicalPath).toContain('sample-material-request');
    });
  });

  describe('#9 dataMode badge', () => {
    it('panel chrome must not render dataMode badge', () => {
      expect(shouldRenderWorkshop2DataModeBadgeInPanel()).toBe(false);
    });

    it('formats API/local labels', () => {
      expect(formatWorkshop2DataModeBadgeLabel('http')).toBe('API');
      expect(formatWorkshop2DataModeBadgeLabel('local')).toBe('local');
    });
  });
});
