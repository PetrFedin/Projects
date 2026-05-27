/** @jest-environment node */

/**
 * Wave W — activity journal honesty, handoff API chip parity, sample movement link,
 * chunk boundaries all tabs, dossier skeleton, demo-ss27-04 bootstrap, middleware loop,
 * health internalWms flags.
 */

import fs from 'fs';
import path from 'path';
import { GET as healthGet } from '@/app/api/workshop2/health/route';
import {
  WORKSHOP2_FILE_STORE_DEMO_ARTICLES,
  buildWorkshop2FileStoreDemoDossier,
} from '@/lib/production/workshop2-file-store-demo-bootstrap';
import { WORKSHOP2_HUB_ONBOARDING_DEMO_ARTICLE_ID } from '@/lib/production/workshop2-hub-onboarding-create-flow';
import {
  buildWorkshop2LegacyArticleRedirectPath,
  parseWorkshop2LegacyArticlePath,
} from '@/lib/production/workshop2-legacy-article-url';
import { workshop2ArticlePath } from '@/lib/production/workshop2-url';
import {
  isWorkshop2HubActivityServerEventHonest,
  mergeWorkshop2HubActivitySources,
} from '@/lib/production/workshop2-hub-activity-merge';
import { summarizeWorkshop2WorkspaceHandoffFromApiPayload } from '@/lib/production/workshop2-workspace-handoff-api-parity';
import { summarizeWorkshop2WorkspaceHandoffChecklistStatus } from '@/lib/production/workshop2-workspace-handoff-checklist-status';
import { emptyWorkshop2DossierPhase1 } from '@/lib/production/workshop2-phase1-dossier-storage';
import { buildWorkshop2HandoffReadinessApiPayload } from '@/lib/production/workshop2-handoff-readiness-api';
import { getWorkshop2ServerDossierRecord } from '@/lib/server/workshop2-phase1-dossier-server-store';

const ROOT = path.join(process.cwd(), 'src/components/brand/production');

describe('workshop2 wave-w must-close', () => {
  it('hub activity merge skips synthetic server events (no fake PG audit)', () => {
    expect(
      isWorkshop2HubActivityServerEventHonest({
        id: '1',
        collectionId: 'SS27',
        articleId: 'demo-ss27-01',
        eventType: 'fake_audit',
        createdAt: new Date().toISOString(),
      })
    ).toBe(false);
    const merged = mergeWorkshop2HubActivitySources(
      [],
      [
        {
          id: 'real-1',
          collectionId: 'SS27',
          articleId: 'demo-ss27-01',
          eventType: 'dossier_saved',
          createdAt: new Date().toISOString(),
        },
        {
          id: 'fake-1',
          collectionId: 'SS27',
          articleId: 'demo-ss27-01',
          eventType: 'synthetic_event',
          createdAt: new Date().toISOString(),
        },
      ]
    );
    expect(merged).toHaveLength(1);
    expect(merged[0]?.id).toBe('srv-real-1');
  });

  it('workspace handoff chip uses API payload parity (allowed + score10)', () => {
    const dossier = buildWorkshop2FileStoreDemoDossier({
      collectionId: 'SS27',
      articleId: 'demo-ss27-01',
    })!;
    const apiPayload = buildWorkshop2HandoffReadinessApiPayload({
      dossier,
      vaultFileCount: 2,
      categoryLeafId: 'catalog-apparel-g0-l0',
    });
    const fromApi = summarizeWorkshop2WorkspaceHandoffFromApiPayload(apiPayload);
    const local = summarizeWorkshop2WorkspaceHandoffChecklistStatus({
      dossier,
      categoryLeafId: 'catalog-apparel-g0-l0',
      vaultFileCount: 2,
    });
    expect(fromApi.handoff.score10).toBe(apiPayload.score10);
    expect(fromApi.hintRu).toBeTruthy();
    if (apiPayload.allowed === false) {
      expect(fromApi.state).not.toBe('ready');
    }
    expect(local.handoff.score10).toBeDefined();
  });

  it('Workshop2ArticleWorkspace fetches handoff-readiness for header chip', () => {
    const ws = fs.readFileSync(path.join(ROOT, 'Workshop2ArticleWorkspace.tsx'), 'utf8');
    expect(ws).toMatch(/fetchWorkshop2HandoffReadiness/);
    expect(ws).toMatch(/summarizeWorkshop2WorkspaceHandoffFromApiPayload/);
    expect(ws).toMatch(/Workshop2ArticleWorkspaceDossierSkeleton/);
    expect(ws).toMatch(/dossierFetchPending/);
  });

  it('sample panel wires movement deep link + handoff allowed from API', () => {
    const sample = fs.readFileSync(path.join(ROOT, 'Workshop2ArticleSamplePanel.tsx'), 'utf8');
    expect(sample).toMatch(/workshop2-sample-movement-deep-link/);
    expect(sample).toMatch(/w2pane: 'stock'/);
    expect(sample).toMatch(/r\.allowed !== false/);
    expect(sample).toMatch(/workshop2-sample-create-order/);
  });

  it('all lazy tab panels wrapped in Workshop2TabPanelChunkBoundary', () => {
    const tabs = fs.readFileSync(path.join(ROOT, 'Workshop2ArticleWorkspaceTabPanels.tsx'), 'utf8');
    for (const label of ['Снабжение', 'Примерка', 'План', 'Выпуск', 'ОТК', 'Склад', 'Документы']) {
      expect(tabs).toMatch(new RegExp(`tabLabelRu="${label}"`));
    }
    const boundaryCount = (tabs.match(/Workshop2TabPanelChunkBoundary/g) ?? []).length;
    expect(boundaryCount).toBeGreaterThanOrEqual(7);
  });

  it('plan PO ERP subsection uses PanelChrome + ceiling block', () => {
    const erp = fs.readFileSync(path.join(ROOT, 'Workshop2PurchaseOrdersErpPanel.tsx'), 'utf8');
    expect(erp).toMatch(/Workshop2OperationalPanelChrome/);
    expect(erp).toMatch(/Workshop2CeilingIntegrationBlock/);
    expect(erp).toMatch(/catalogId=\{66\}/);
    const plan = fs.readFileSync(
      path.join(ROOT, 'workshop2-article-workspace-plan-po-panel.tsx'),
      'utf8'
    );
    expect(plan).toMatch(/Workshop2OperationalPanelChrome/);
    expect(plan).toMatch(/Workshop2B2BIntegrationPanel/);
  });

  it('QC panel inspector deep link + AQL cross-ref + honest scorecard empty state', () => {
    const qc = fs.readFileSync(path.join(ROOT, 'workshop2-article-workspace-qc-panel.tsx'), 'utf8');
    expect(qc).toMatch(/workshop2-qc-inspector-deep-link/);
    expect(qc).toMatch(/workshop2-qc-aql-cross-ref/);
    expect(qc).toMatch(/supplierId в PO плана/);
    const scorecard = fs.readFileSync(path.join(ROOT, 'supplier-qc-scorecard.tsx'), 'utf8');
    expect(scorecard).toMatch(/formatWorkshop2PersistToastTitle/);
  });

  it('hub history dialog loads from API + honest local clear', () => {
    const hub = fs.readFileSync(path.join(ROOT, 'Workshop2TabContent.tsx'), 'utf8');
    expect(hub).toMatch(/fetchWorkshop2HubServerActivityBatch/);
    expect(hub).toMatch(/workshop2-hub-history-dialog/);
    expect(hub).toMatch(/Очистить local журнал/);
    expect(hub).toMatch(/formatWorkshop2HubActivityDetailRu/);
  });

  it('legacy middleware redirect has no loop on canonical path', () => {
    const legacy = '/brand/production/workshop2/SS27/demo-ss27-01';
    const match = parseWorkshop2LegacyArticlePath(legacy)!;
    const canonical = buildWorkshop2LegacyArticleRedirectPath(match, '?w2pane=tz');
    expect(canonical).toBe(`${workshop2ArticlePath('SS27', 'demo-ss27-01')}?w2pane=tz`);
    expect(
      parseWorkshop2LegacyArticlePath(workshop2ArticlePath('SS27', 'demo-ss27-01'))
    ).toBeNull();
    const mw = fs.readFileSync(path.join(process.cwd(), 'src/middleware.ts'), 'utf8');
    expect(mw).toMatch(/parseWorkshop2LegacyArticlePath/);
    expect(mw).not.toMatch(/workshop2ArticlePath/);
  });

  it('GET /api/workshop2/health exposes storeMode, postgres, internalWms', async () => {
    const res = await healthGet();
    expect(res.status).toBeLessThan(600);
    const json = (await res.json()) as {
      storeMode?: string;
      postgres?: string;
      internalWms?: string;
    };
    expect(json.storeMode).toMatch(/server_/);
    expect(['ok', 'down', 'disabled']).toContain(json.postgres);
    expect(['enabled', 'disabled']).toContain(json.internalWms);
  });

  it('file-store bootstrap includes demo-ss27-04 dossier + hub card seed', () => {
    const ids = WORKSHOP2_FILE_STORE_DEMO_ARTICLES.map((a) => a.articleId);
    expect(ids).toContain(WORKSHOP2_HUB_ONBOARDING_DEMO_ARTICLE_ID);
    const dossier = buildWorkshop2FileStoreDemoDossier({
      collectionId: 'SS27',
      articleId: WORKSHOP2_HUB_ONBOARDING_DEMO_ARTICLE_ID,
    });
    expect(dossier?.hubOnboardingState?.done).toBe(true);
    const orderData = fs.readFileSync(path.join(process.cwd(), 'src/lib/order-data.ts'), 'utf8');
    expect(orderData).toMatch(/demo-ss27-04/);
  });

  it('demo-ss27-04 GET dossier auto-seeds in file-store', async () => {
    const record = await getWorkshop2ServerDossierRecord(
      'SS27',
      WORKSHOP2_HUB_ONBOARDING_DEMO_ARTICLE_ID
    );
    expect(record).not.toBeNull();
    expect(record?.dossier.hubOnboardingState?.done).toBe(true);
  });
});
