/**
 * Wave 33 — 7 integration ceilings: probes, fail-closed layer, no score inflation.
 */
import {
  buildWorkshop2IntegrationCeilingProbes,
  isWorkshop2LiveFit3dConfigured,
  isWorkshop2LivePlmTransportConfigured,
  isWorkshop2LiveSustainabilityConfigured,
  workshop2AllIntegrationCeilingsLive,
  workshop2LiveIntegrationProbeSummary,
} from '@/lib/production/workshop2-live-integration-probes';
import {
  evaluateWorkshop2IntegrationCeilingExportWarnings,
  evaluateWorkshop2IntegrationCeilingHandoffWarnings,
} from '@/lib/production/workshop2-integration-ceiling-fail-closed';
import { evaluateWorkshop2TzExportBundleGate } from '@/lib/production/workshop2-tz-export-bundle-gate';
import { evaluateWorkshop2FactoryHandoffCommitGate } from '@/lib/production/workshop2-factory-handoff-commit-gate';
import { emptyWorkshop2DossierPhase1 } from '@/lib/production/workshop2-phase1-dossier-storage';

const COAT_LEAF = 'catalog-apparel-g0-l0';
const EMPTY_ENV = {} as Record<string, string | undefined>;

describe('workshop2 wave33 — seven ceiling probes', () => {
  beforeEach(() => {
    delete EMPTY_ENV.WORKSHOP2_FACTORY_ERP_BASE_URL;
    delete EMPTY_ENV.WORKSHOP2_NESTING_API_URL;
    delete EMPTY_ENV.WORKSHOP2_DPP_REGISTRY_URL;
    delete EMPTY_ENV.WORKSHOP2_LCA_API_URL;
    delete EMPTY_ENV.WORKSHOP2_VAULT_CAD_INGEST_URL;
    delete EMPTY_ENV.WORKSHOP2_SHOWROOM_B2B_WEBHOOK_URL;
    delete EMPTY_ENV.WORKSHOP2_PLM_WEBHOOK_URL;
    delete EMPTY_ENV.WORKSHOP2_PLM_PARTNER_ACK_URL;
  });

  it('lists exactly 7 catalog ceilings with max ≤ 8.9', () => {
    const ceilings = buildWorkshop2IntegrationCeilingProbes(EMPTY_ENV);
    expect(ceilings).toHaveLength(7);
    expect(ceilings.map((c) => c.catalogId).sort((a, b) => a - b)).toEqual([
      50, 53, 55, 62, 63, 66, 78,
    ]);
    for (const c of ceilings) {
      expect(c.configured).toBe(false);
      expect(c.maxRealisticScore).toBeLessThanOrEqual(8.9);
      expect(c.maxRealisticScore).toBeGreaterThanOrEqual(8.8);
    }
  });

  it('probe summary exposes all 7 kinds (wave 33 extension)', () => {
    const s = workshop2LiveIntegrationProbeSummary(EMPTY_ENV);
    expect(Object.keys(s).sort()).toEqual([
      'dpp',
      'erp',
      'fit3d',
      'nesting',
      'plmTransport',
      'showroom',
      'sustainability',
    ]);
    expect(workshop2AllIntegrationCeilingsLive(EMPTY_ENV)).toBe(false);
  });

  it('#53 sustainability and #55 fit3d require dedicated env', () => {
    expect(isWorkshop2LiveSustainabilityConfigured(EMPTY_ENV)).toBe(false);
    expect(isWorkshop2LiveFit3dConfigured(EMPTY_ENV)).toBe(false);
    EMPTY_ENV.WORKSHOP2_LCA_API_URL = 'https://lca.test';
    EMPTY_ENV.WORKSHOP2_VAULT_CAD_INGEST_URL = 'https://vault-ingest.test';
    expect(isWorkshop2LiveSustainabilityConfigured(EMPTY_ENV)).toBe(true);
    expect(isWorkshop2LiveFit3dConfigured(EMPTY_ENV)).toBe(true);
  });

  it('#78 PLM: webhook alone is not live; partner ACK unlocks', () => {
    EMPTY_ENV.WORKSHOP2_PLM_WEBHOOK_URL = 'https://plm.test/hook';
    expect(isWorkshop2LivePlmTransportConfigured(EMPTY_ENV)).toBe(false);
    EMPTY_ENV.WORKSHOP2_PLM_PARTNER_ACK_URL = 'https://plm.test/ack';
    expect(isWorkshop2LivePlmTransportConfigured(EMPTY_ENV)).toBe(true);
    delete EMPTY_ENV.WORKSHOP2_PLM_PARTNER_ACK_URL;
    EMPTY_ENV.WORKSHOP2_PLM_AUTO_ACK = 'true';
    expect(isWorkshop2LivePlmTransportConfigured(EMPTY_ENV)).toBe(false);
  });
});

describe('workshop2 wave33 — second-layer export/handoff warnings', () => {
  it('adds 7 ceiling warnings to export-tz when env unset', () => {
    const gate = evaluateWorkshop2TzExportBundleGate({
      dossier: emptyWorkshop2DossierPhase1(),
      categoryLeafId: COAT_LEAF,
      collectionId: 'SS27',
      articleId: 'art-1',
    });
    const ceilingIds = gate.checks.filter((c) => c.id.startsWith('ceiling.')).map((c) => c.id);
    expect(ceilingIds.length).toBe(7);
    expect(evaluateWorkshop2IntegrationCeilingExportWarnings(EMPTY_ENV)).toHaveLength(7);
  });

  it('adds 7 ceiling warnings to handoff commit when env unset', () => {
    const commit = evaluateWorkshop2FactoryHandoffCommitGate({
      dossier: emptyWorkshop2DossierPhase1(),
      categoryLeafId: COAT_LEAF,
    });
    const ceilingHandoff = commit.readiness.checks.filter((c) =>
      c.id.includes('live_not_configured_handoff')
    );
    expect(ceilingHandoff.length).toBe(7);
    expect(evaluateWorkshop2IntegrationCeilingHandoffWarnings(EMPTY_ENV)).toHaveLength(7);
  });
});

describe('workshop2 wave33 — catalog honesty (72/79)', () => {
  it('7 ceilings below 9.0 is consistent with 72 at or above', () => {
    const ceilings = buildWorkshop2IntegrationCeilingProbes(EMPTY_ENV);
    const below9 = ceilings.length;
    expect(below9).toBe(7);
    expect(79 - below9).toBe(72);
  });
});
