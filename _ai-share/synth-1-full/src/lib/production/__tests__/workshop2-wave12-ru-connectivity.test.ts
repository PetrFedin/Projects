/**
 * Wave 12 RU — SS27 journey, linkedPaths+, marking gate, B2B links, probes, setup RU strip.
 */
import { emptyWorkshop2DossierPhase1 } from '@/lib/production/workshop2-phase1-dossier-storage';
import {
  buildWorkshop2Ss27RuJourneySteps,
  resolveWorkshop2Ss27RuJourneyActiveStep,
  buildWorkshop2InspectorUrlForArticle,
  WORKSHOP2_SS27_COLLECTION_ID,
} from '@/lib/production/workshop2-ru-journey-ss27';
import { buildWorkshop2DossierLinkedPaths } from '@/lib/production/workshop2-dossier-linked-paths';
import {
  evaluateWorkshop2RuMarkingSampleOrderGate,
  workshop2RuMarkingSampleOrderHintRu,
} from '@/lib/production/workshop2-marking-sample-order-gate';
import {
  resolveB2bLineWorkshop2WorkspaceHref,
  buildWorkshop2SchetOffertaApiHref,
} from '@/lib/production/workshop2-b2b-order-workshop2-link';
import {
  buildWorkshop2SetupRuIntegrationRows,
  summarizeWorkshop2SetupRuIntegrationsOneLiner,
} from '@/lib/production/workshop2-setup-ru-integrations-summary';
import { buildWorkshop2Wave12RuConnectivityProbe } from '@/lib/production/workshop2-live-integration-probes';
import { formatWorkshop2RubCurrency } from '@/lib/production/workshop2-ru-index';

describe('workshop2 wave12 — SS27 journey steps', () => {
  it('returns five ordered steps for SS27', () => {
    const steps = buildWorkshop2Ss27RuJourneySteps({
      collectionId: WORKSHOP2_SS27_COLLECTION_ID,
      articleId: 'demo-ss27-01',
    });
    expect(steps).toHaveLength(5);
    expect(steps.map((s) => s.order)).toEqual([1, 2, 3, 4, 5]);
    expect(steps[0].id).toBe('collection');
    expect(steps[4].id).toBe('floor');
  });

  it('marks sample step done when activeSampleOrderId present', () => {
    const d = emptyWorkshop2DossierPhase1();
    d.sampleWorkflow = { activeSampleOrderId: 'ord-1' };
    const steps = buildWorkshop2Ss27RuJourneySteps({
      collectionId: WORKSHOP2_SS27_COLLECTION_ID,
      articleId: 'demo-ss27-01',
      dossier: d,
    });
    expect(steps.find((s) => s.id === 'sample')?.status).toBe('done');
  });

  it('resolves active step when TZ not ready and no sample', () => {
    const steps = buildWorkshop2Ss27RuJourneySteps({
      collectionId: WORKSHOP2_SS27_COLLECTION_ID,
      articleId: 'demo-ss27-01',
    });
    expect(resolveWorkshop2Ss27RuJourneyActiveStep(steps)).toBe('workspace');
  });

  it('builds inspector URL when sample order id exists', () => {
    const href = buildWorkshop2InspectorUrlForArticle({
      collectionId: WORKSHOP2_SS27_COLLECTION_ID,
      articleId: 'demo-ss27-01',
      sampleOrderId: 'sample-abc',
    });
    expect(href).toMatch(/inspector/);
    expect(href).toMatch(/sample-abc/);
  });

  it('returns null inspector URL without order', () => {
    expect(
      buildWorkshop2InspectorUrlForArticle({
        collectionId: WORKSHOP2_SS27_COLLECTION_ID,
        articleId: 'x',
        sampleOrderId: null,
      })
    ).toBeNull();
  });
});

describe('workshop2 wave12 — dossier linkedPaths', () => {
  it('includes ruJourneyStep, inspectorUrl, edoStatus', () => {
    const d = emptyWorkshop2DossierPhase1();
    d.sampleWorkflow = { activeSampleOrderId: 'ord-9' };
    d.edoSignoffMirror = { edoStatus: 'signed', provider: 'mock', signedAt: '2026-01-01' };
    const paths = buildWorkshop2DossierLinkedPaths({
      collectionId: WORKSHOP2_SS27_COLLECTION_ID,
      articleId: 'demo-ss27-01',
      dossier: d,
    });
    expect(paths.inspectorUrl).toMatch(/inspector/);
    expect(paths.edoStatus).toBe('signed');
    expect(paths.ruJourneyStep).toBeTruthy();
    expect(paths.workspace).toMatch(/SS27/);
  });
});

describe('workshop2 wave12 — marking sample gate RU', () => {
  it('blocks when marking required without gtin on ru market', () => {
    const d = emptyWorkshop2DossierPhase1();
    d.passportProductionBrief = { ...(d.passportProductionBrief ?? {}), markingRequired: true };
    const gate = evaluateWorkshop2RuMarkingSampleOrderGate(d, { WORKSHOP2_MARKET: 'ru' });
    expect(gate?.severity).toBe('blocker');
    expect(workshop2RuMarkingSampleOrderHintRu(d)).toMatch(/GTIN/i);
  });

  it('skips gate when gtin present', () => {
    const d = emptyWorkshop2DossierPhase1();
    d.passportProductionBrief = {
      ...(d.passportProductionBrief ?? {}),
      markingRequired: true,
      gtin: '4601234567890',
    };
    expect(evaluateWorkshop2RuMarkingSampleOrderGate(d, { WORKSHOP2_MARKET: 'ru' })).toBeNull();
  });
});

describe('workshop2 wave12 — B2B workshop2 links', () => {
  it('resolves workspace href from SS27 season line', () => {
    const href = resolveB2bLineWorkshop2WorkspaceHref({
      id: 'demo-ss27-01',
      season: 'SS27',
    });
    expect(href).toMatch(/SS27/);
    expect(href).toMatch(/demo-ss27-01/);
  });

  it('builds schet-offerta API href', () => {
    expect(buildWorkshop2SchetOffertaApiHref('B2B-100')).toBe(
      '/api/shop/b2b/orders/B2B-100/schet-offerta.pdf'
    );
  });
});

describe('workshop2 wave12 — setup RU integrations', () => {
  it('returns ru-integrations row', () => {
    const rows = buildWorkshop2SetupRuIntegrationRows({ WORKSHOP2_MARKET: 'ru' });
    expect(rows[0]?.id).toBe('ru-integrations');
    expect(rows[0]?.detailRu).toMatch(/probes/i);
  });

  it('summarizes one-liner', () => {
    expect(summarizeWorkshop2SetupRuIntegrationsOneLiner()).toMatch(/Интеграции РФ/i);
  });
});

describe('workshop2 wave12 — connectivity probe', () => {
  it('exposes journeySteps and ≥10 checks', () => {
    const probe = buildWorkshop2Wave12RuConnectivityProbe({ WORKSHOP2_MARKET: 'ru' });
    expect(probe.journeySteps).toBe(5);
    expect(probe.checks.length).toBeGreaterThanOrEqual(10);
    expect(probe.checks.every((c) => c.ok)).toBe(true);
  });
});

describe('workshop2 wave12 — ru-index barrel', () => {
  it('re-exports rub formatter', () => {
    expect(formatWorkshop2RubCurrency(1000)).toMatch(/₽/);
  });
});
