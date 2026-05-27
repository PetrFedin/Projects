/**
 * Wave 38 — six ceilings: staging journal + fail-closed on HTTP 500 (mocked fetch).
 */
import {
  postWorkshop2DppRegistryStaging,
  buildWorkshop2DppRegistryDraftMirror,
} from '@/lib/production/workshop2-dpp-registry-staging';
import { buildWorkshop2DppExportBlock } from '@/lib/production/workshop2-dpp-export';
import { attemptWorkshop2SustainabilityStaging } from '@/lib/production/workshop2-sustainability-staging';
import { attemptWorkshop2Fit3dStagingProbe } from '@/lib/production/workshop2-fit3d-staging';
import { attemptWorkshop2FactoryErpStaging } from '@/lib/production/workshop2-factory-erp-staging';
import {
  attemptWorkshop2PlmPartnerAckStaging,
  recordWorkshop2PlmWebhookReceipt,
} from '@/lib/production/workshop2-plm-transport-journal';
import { callWorkshop2NestingSimulationStub } from '@/lib/production/workshop2-nesting-request';
import { buildWorkshop2IntegrationCeilingProbes } from '@/lib/production/workshop2-live-integration-probes';
import { emptyWorkshop2DossierPhase1 } from '@/lib/production/workshop2-phase1-dossier-storage';

const ENV: Record<string, string | undefined> = {};

/** jsdom lacks global Response — minimal stub for fail-closed HTTP tests. */
function mockHttpResponse(status: number): Response {
  return {
    ok: status >= 200 && status < 300,
    status,
    json: async () => ({ error: 'server_error' }),
  } as Response;
}

function mockFetch500(): typeof fetch {
  return (async () => mockHttpResponse(500)) as typeof fetch;
}

describe('workshop2 wave38 ceilings — staging fail-closed', () => {
  const originalFetch = global.fetch;

  afterEach(() => {
    global.fetch = originalFetch;
    delete ENV.WORKSHOP2_DPP_REGISTRY_URL;
    delete ENV.WORKSHOP2_LCA_API_URL;
    delete ENV.WORKSHOP2_VAULT_CAD_INGEST_URL;
    delete ENV.WORKSHOP2_FACTORY_ERP_BASE_URL;
    delete ENV.WORKSHOP2_NESTING_API_URL;
    delete ENV.WORKSHOP2_PLM_PARTNER_ACK_URL;
    delete process.env.WORKSHOP2_DPP_REGISTRY_URL;
    delete process.env.WORKSHOP2_LCA_API_URL;
    delete process.env.WORKSHOP2_NESTING_API_URL;
  });

  it('probes: six ceilings maxRealisticScore 8.9 (wave 38)', () => {
    const ceilings = buildWorkshop2IntegrationCeilingProbes(ENV).filter((c) =>
      [50, 53, 55, 63, 66, 78].includes(c.catalogId)
    );
    expect(ceilings).toHaveLength(6);
    for (const c of ceilings) {
      expect(c.maxRealisticScore).toBe(8.9);
    }
  });

  it('#50 DPP staging: HTTP 500 → failed journal, registryId null', async () => {
    ENV.WORKSHOP2_DPP_REGISTRY_URL = 'https://dpp.registry.test';
    process.env.WORKSHOP2_DPP_REGISTRY_URL = ENV.WORKSHOP2_DPP_REGISTRY_URL;
    const dossier = emptyWorkshop2DossierPhase1();
    dossier.productionModel = {
      materialLines: [{ materialName: 'Cotton', yieldPerUnit: 1, yieldUnit: 'm' }],
    };
    const block = buildWorkshop2DppExportBlock({
      dossier,
      collectionId: 'c',
      articleId: 'a',
    });
    const res = await postWorkshop2DppRegistryStaging({
      dossier,
      block,
      actor: 'tester',
      env: ENV,
      fetchImpl: mockFetch500(),
    });
    expect(res.ok).toBe(false);
    expect(res.httpStatus).toBe(500);
    expect(res.error).toMatch(/http_500/);
    expect(res.dossier.dppRegistryDraftMirror?.registryId).toBeNull();
    expect(res.dossier.dppRegistryDraftMirror?.journal.at(-1)?.outcome).toBe('failed');
    expect(res.dossier.dppRegistryDraftMirror?.journal.at(-1)?.actor).toBe('tester');
  });

  it('#53 LCA staging: HTTP 500 → failed', async () => {
    ENV.WORKSHOP2_LCA_API_URL = 'https://lca.test';
    process.env.WORKSHOP2_LCA_API_URL = ENV.WORKSHOP2_LCA_API_URL;
    const dossier = emptyWorkshop2DossierPhase1();
    dossier.productionModel = {
      materialLines: [{ materialName: 'Wool', yieldPerUnit: 1, yieldUnit: 'm' }],
    };
    const res = await attemptWorkshop2SustainabilityStaging({
      dossier,
      collectionId: 'c',
      articleId: 'a',
      actor: 'eco-1',
      env: ENV,
      fetchImpl: mockFetch500(),
    });
    expect(res.ok).toBe(false);
    expect(res.dossier.sustainabilityStagingMirror?.registryAckRecorded).toBe(false);
    expect(res.dossier.sustainabilityStagingMirror?.journal.at(-1)?.outcome).toBe('failed');
  });

  it('#55 Fit3D probe: HTTP 500 → failed', async () => {
    ENV.WORKSHOP2_VAULT_CAD_INGEST_URL = 'https://vault-ingest.test';
    process.env.WORKSHOP2_VAULT_CAD_INGEST_URL = ENV.WORKSHOP2_VAULT_CAD_INGEST_URL;
    const res = await attemptWorkshop2Fit3dStagingProbe({
      dossier: emptyWorkshop2DossierPhase1(),
      actor: 'fit3d-1',
      env: ENV,
      fetchImpl: mockFetch500(),
    });
    expect(res.ok).toBe(false);
    expect(res.dossier.fit3dStagingMirror?.journal.at(-1)?.outcome).toBe('failed');
  });

  it('#63 Nesting: external_api HTTP fail → ok false, no local mask', async () => {
    process.env.WORKSHOP2_NESTING_API_URL = 'http://nesting.test';
    global.fetch = mockFetch500();
    const res = await callWorkshop2NestingSimulationStub({
      collectionId: 'c',
      articleId: 'a',
      sampleOrderId: 'so1',
      nesting: { fabricWidthCm: 150 },
    });
    expect(res.ok).toBe(false);
    expect(res.source).toBe('external_api');
    expect(res.simulation).toBeUndefined();
  });

  it('#66 ERP staging: HTTP 500 → failed, erpOrderIdAckInPg false', async () => {
    ENV.WORKSHOP2_FACTORY_ERP_BASE_URL = 'https://erp.factory.test';
    process.env.WORKSHOP2_FACTORY_ERP_BASE_URL = ENV.WORKSHOP2_FACTORY_ERP_BASE_URL;
    const res = await attemptWorkshop2FactoryErpStaging({
      dossier: emptyWorkshop2DossierPhase1(),
      purchaseOrders: [],
      erpConfigured: true,
      actor: 'erp-1',
      collectionId: 'c',
      articleId: 'a',
      env: ENV,
      fetchImpl: mockFetch500(),
    });
    expect(res.ok).toBe(false);
    expect(res.dossier.factoryErpStagingMirror?.erpOrderIdAckInPg).toBe(false);
    expect(res.dossier.factoryErpStagingMirror?.journal.at(-1)?.outcome).toBe('failed');
  });

  it('#78 PLM webhook receipt: partnerAckRecorded false; ACK 500 → failed', async () => {
    let dossier = emptyWorkshop2DossierPhase1();
    dossier = recordWorkshop2PlmWebhookReceipt({
      dossier,
      actor: 'plm-hook',
      eventId: 'evt-1',
    });
    expect(dossier.plmTransportJournalMirror?.partnerAckRecorded).toBe(false);
    ENV.WORKSHOP2_PLM_WEBHOOK_URL = 'https://plm.test';
    ENV.WORKSHOP2_PLM_PARTNER_ACK_URL = 'https://plm-ack.test';
    process.env.WORKSHOP2_PLM_WEBHOOK_URL = ENV.WORKSHOP2_PLM_WEBHOOK_URL;
    process.env.WORKSHOP2_PLM_PARTNER_ACK_URL = ENV.WORKSHOP2_PLM_PARTNER_ACK_URL;
    const ack = await attemptWorkshop2PlmPartnerAckStaging({
      dossier,
      actor: 'plm-ack',
      outboxEventId: 'evt-1',
      env: ENV,
      fetchImpl: mockFetch500(),
    });
    expect(ack.ok).toBe(false);
    expect(ack.dossier.plmTransportJournalMirror?.partnerAckRecorded).toBe(false);
    expect(ack.dossier.plmTransportJournalMirror?.journal.at(-1)?.outcome).toBe('failed');
  });

  it('DPP mirror builder requires actor + journal (wave 38 contract)', () => {
    const block = buildWorkshop2DppExportBlock({
      dossier: emptyWorkshop2DossierPhase1(),
      collectionId: 'c',
      articleId: 'a',
    });
    const mirror = buildWorkshop2DppRegistryDraftMirror({
      block,
      actor: 'u1',
      journal: [],
      env: ENV,
    });
    expect(mirror.lastActor).toBe('u1');
    expect(mirror.journal).toEqual([]);
  });
});
