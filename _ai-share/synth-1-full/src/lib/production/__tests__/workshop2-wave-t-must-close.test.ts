/** @jest-environment node */

/**
 * Wave T — handoff commit gate UI, release/logistics/T&A honesty, B2B fail-closed, smart routing prod.
 */

import fs from 'fs';
import path from 'path';
import { buildWorkshop2FileStoreDemoDossier } from '@/lib/production/workshop2-file-store-demo-bootstrap';
import { evaluateWorkshop2FactoryHandoffCommitGate } from '@/lib/production/workshop2-factory-handoff-commit-gate';
import { evaluateWorkshop2ShowroomPublishGate } from '@/lib/production/workshop2-showroom-publish-gate';
import {
  evaluateWorkshop2ShowroomLocalPublishedUi,
  isWorkshop2SmartRoutingDemoBlockedInProduction,
  resolveWorkshop2SmartRoutingProductionEngineKind,
} from '@/lib/production/workshop2-no-demo-deadends';
import { summarizeWorkshop2ReleaseRoutingPanelDisplay } from '@/lib/production/workshop2-release-routing-status';
import { summarizeWorkshop2LogisticsPanelTrackingUi } from '@/lib/production/workshop2-logistics-dossier-persist';
import {
  resolveWorkshop2TaMilestones,
  summarizeWorkshop2TaMilestonesStatus,
} from '@/lib/production/workshop2-ta-milestones-status';
import { emptyWorkshop2DossierPhase1 } from '@/lib/production/workshop2-phase1-dossier-storage';

const ROOT = path.join(process.cwd(), 'src/components/brand/production');

describe('workshop2 wave-t must-close', () => {
  it('factory handoff assignment panel wires full gate checks block', () => {
    const src = fs.readFileSync(
      path.join(ROOT, 'workshop2-phase1-dossier-panel-section-body-assignment.tsx'),
      'utf8'
    );
    expect(src).toMatch(/workshop2-factory-handoff-gate-checks/);
    expect(src).toMatch(/Workshop2GateChecksBlock/);
    expect(src).toMatch(/workshop2-factory-handoff-probe-gate/);
    expect(src).toMatch(/evaluateWorkshop2FactoryHandoffCommitGate/);
  });

  it('release routing panel display downgrades ready without PG mirror', () => {
    const dossier = {
      ...buildWorkshop2FileStoreDemoDossier({
        collectionId: 'SS27',
        articleId: 'demo-ss27-02',
      })!,
      smartRoutingSequence: [{ id: '1', category: 'Монтаж', name: 'Шов', equipment: 'M', sash: 1 }],
    };
    const live = summarizeWorkshop2ReleaseRoutingPanelDisplay({
      dossier,
      release: {
        operations: [{ id: 'op-1', name: 'Шов', sash: 1, costPerUnit: 10, status: 'pending' }],
      },
    });
    expect(live.mirrorInPg).toBe(false);
    expect(live.state).not.toBe('ready');
    expect(live.hintRu).toMatch(/PG|mirror/i);
  });

  it('release routing panel wires honest status banner + PG chip', () => {
    const releaseSrc = fs.readFileSync(
      path.join(ROOT, 'workshop2-article-workspace-release-panel.tsx'),
      'utf8'
    );
    expect(releaseSrc).toMatch(/summarizeWorkshop2ReleaseRoutingPanelDisplay/);
    expect(releaseSrc).toMatch(
      /Workshop2ReleaseRoutingStatusBanner|Workshop2ReleaseStatusCollapsible/
    );
    expect(releaseSrc).toMatch(/Workshop2ReleaseStatusCollapsible/);
    expect(releaseSrc).toMatch(/workshop2-release-production-strip/);
    expect(releaseSrc).toMatch(/Workshop2ReleaseSubNav/);
    expect(releaseSrc).toMatch(/fetchWorkshop2SampleOrders/);

    const bannerSrc = fs.readFileSync(
      path.join(ROOT, 'workshop2-panel-status-banners.tsx'),
      'utf8'
    );
    expect(bannerSrc).toMatch(/data-testid="release-routing-pg-chip"/);
    expect(bannerSrc).toMatch(/releaseRoutingMirror в PG|сохраните mirror routingSteps/i);
  });

  it('logistics panel uses mirror tracking ui + PG chip', () => {
    const ui = summarizeWorkshop2LogisticsPanelTrackingUi({
      dossier: emptyWorkshop2DossierPhase1(),
      hasActiveShipment: false,
    });
    expect(ui.trackingActive).toBe(false);
    expect(ui.statusLabelRu).toMatch(/Нет отгрузки|mirror/i);

    const src = fs.readFileSync(path.join(ROOT, 'Workshop2LogisticsPanel.tsx'), 'utf8');
    expect(src).toMatch(/summarizeWorkshop2LogisticsPanelTrackingUi/);
    expect(src).toMatch(/workshop2-logistics-pg-chip/);
    expect(src).not.toMatch(/Трекинг активен/);
  });

  it('T&A resolves milestones from dossier before bundle', () => {
    const resolved = resolveWorkshop2TaMilestones({
      dossier: {
        ...emptyWorkshop2DossierPhase1(),
        taMilestones: [
          {
            id: 'm-d',
            title: 'Dossier PO',
            targetDate: '2026-06-01',
            actualDate: null,
            status: 'pending',
          },
        ],
      },
      bundleTa: {
        milestones: [
          {
            id: 'm-b',
            title: 'Bundle only',
            targetDate: '2026-07-01',
            actualDate: null,
            status: 'completed',
          },
        ],
      },
    });
    expect(resolved.source).toBe('dossier');
    expect(resolved.milestones[0]?.title).toBe('Dossier PO');
  });

  it('T&A panel wires mirror PG chip + status banner', () => {
    const src = fs.readFileSync(path.join(ROOT, 'Workshop2TimeAndActionPanel.tsx'), 'utf8');
    expect(src).toMatch(/Workshop2TaMilestonesStatusBanner/);
    expect(src).toMatch(/workshop2-ta-milestones-pg-chip/);
    const status = summarizeWorkshop2TaMilestonesStatus({
      dossier: {
        ...emptyWorkshop2DossierPhase1(),
        taMilestonesMirror: {
          mirroredAt: '2026-05-23T00:00:00.000Z',
          milestoneCount: 0,
          source: 'empty',
          blockerSampleOrder: true,
          hintRu: 'Нет milestones',
        },
      },
    });
    expect(status.hintRu).toMatch(/milestones|T&A|mirror/i);
  });

  it('B2B publish fail-closed without PG journal', () => {
    const ui = evaluateWorkshop2ShowroomLocalPublishedUi({
      localPublished: true,
      hasPersistedCampaign: false,
      dataMode: 'http',
    });
    expect(ui.vitrineLabel).toBe('Local (не PG)');
    expect(ui.showPublicLink).toBe(false);

    const gate = evaluateWorkshop2ShowroomPublishGate({
      published: true,
      wholesalePrice: 0,
      msrp: 110,
      moq: 50,
      windowStart: '2026-06-01',
      windowEnd: '2026-06-30',
    });
    expect(gate.allowed).toBe(false);

    const src = fs.readFileSync(path.join(ROOT, 'Workshop2B2BIntegrationPanel.tsx'), 'utf8');
    expect(src).toMatch(/workshop2-b2b-publish-gate-checks/);
    expect(src).toMatch(/workshop2-b2b-local-published-blocked/);
  });

  it('smart routing demo blocked in production (no-demo-deadends)', () => {
    delete process.env.WORKSHOP2_SMART_ROUTING_DEMO;
    expect(isWorkshop2SmartRoutingDemoBlockedInProduction({ NODE_ENV: 'production' })).toBe(true);
    const dossier = {
      ...emptyWorkshop2DossierPhase1(),
      smartRoutingFromDemo: true,
      smartRoutingSequence: [{ id: '1', category: 'M', name: 'Op', equipment: 'M', sash: 1 }],
    };
    expect(
      resolveWorkshop2SmartRoutingProductionEngineKind({ dossier, env: { NODE_ENV: 'production' } })
    ).toBe('empty');

    const src = fs.readFileSync(path.join(ROOT, 'Workshop2SmartRoutingPanel.tsx'), 'utf8');
    expect(src).toMatch(/isWorkshop2SmartRoutingDemoAllowed/);
  });

  it('demo-ss27-02 handoff commit gate returns checks when gold path incomplete', () => {
    const dossier = buildWorkshop2FileStoreDemoDossier({
      collectionId: 'SS27',
      articleId: 'demo-ss27-02',
    })!;
    const gate = evaluateWorkshop2FactoryHandoffCommitGate({
      dossier,
      categoryLeafId: 'catalog-apparel-g2-l0',
      vaultFileCount: 0,
    });
    expect(gate.allowed).toBe(false);
    expect(gate.readiness.checks.length).toBeGreaterThan(1);
  });
});
