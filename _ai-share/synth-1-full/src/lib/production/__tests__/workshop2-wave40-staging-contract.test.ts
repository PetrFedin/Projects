/**
 * Wave 40 — staging contract path: localhost mock ACK → PG journal (strict 9.0 when mode on).
 */
import { postWorkshop2DppRegistryStaging } from '@/lib/production/workshop2-dpp-registry-staging';
import { buildWorkshop2DppExportBlock } from '@/lib/production/workshop2-dpp-export';
import { attemptWorkshop2SustainabilityStaging } from '@/lib/production/workshop2-sustainability-staging';
import { attemptWorkshop2Fit3dStagingProbe } from '@/lib/production/workshop2-fit3d-staging';
import { attemptWorkshop2FactoryErpStaging } from '@/lib/production/workshop2-factory-erp-staging';
import {
  attemptWorkshop2PlmPartnerAckStaging,
  recordWorkshop2PlmWebhookReceipt,
} from '@/lib/production/workshop2-plm-transport-journal';
import { runWorkshop2NestingStagingWithJournal } from '@/lib/production/workshop2-nesting-staging-journal';
import { buildWorkshop2IntegrationCeilingProbes } from '@/lib/production/workshop2-live-integration-probes';
import {
  evaluateWorkshop2DppRegistryWritebackBlocked,
  evaluateWorkshop2IntegrationCeilingHandoffWarnings,
} from '@/lib/production/workshop2-integration-ceiling-fail-closed';
import {
  hasWorkshop2CeilingStagingContractAckInDossier,
  WORKSHOP2_STAGING_MOCK_DEFAULT_BASE,
} from '@/lib/production/workshop2-staging-contract-mode';
import type { Workshop2CeilingFetchFn } from '@/lib/production/workshop2-ceiling-staging-core';
import { emptyWorkshop2DossierPhase1 } from '@/lib/production/workshop2-phase1-dossier-storage';

const MOCK_BASE = WORKSHOP2_STAGING_MOCK_DEFAULT_BASE;

const ENV: Record<string, string | undefined> = {
  WORKSHOP2_STAGING_CONTRACT_MODE: 'true',
  WORKSHOP2_DPP_REGISTRY_URL: MOCK_BASE,
  WORKSHOP2_LCA_API_URL: MOCK_BASE,
  WORKSHOP2_VAULT_CAD_INGEST_URL: MOCK_BASE,
  WORKSHOP2_NESTING_API_URL: MOCK_BASE,
  WORKSHOP2_FACTORY_ERP_BASE_URL: MOCK_BASE,
  WORKSHOP2_PLM_WEBHOOK_URL: `${MOCK_BASE}/webhook`,
  WORKSHOP2_PLM_PARTNER_ACK_URL: MOCK_BASE,
};

function mockFetchStagingOk(body: Record<string, unknown>): Workshop2CeilingFetchFn {
  return (async () =>
    ({
      ok: true,
      status: 200,
      json: async () => body,
    }) as Response) as Workshop2CeilingFetchFn;
}

function mockFetch500(): Workshop2CeilingFetchFn {
  return (async () =>
    ({
      ok: false,
      status: 500,
      json: async () => ({ error: 'server_error' }),
    }) as Response) as Workshop2CeilingFetchFn;
}

describe('workshop2 wave40 — staging contract (6 ceilings)', () => {
  beforeEach(() => {
    Object.assign(process.env, ENV);
  });

  afterEach(() => {
    for (const k of Object.keys(ENV)) {
      delete process.env[k];
    }
  });

  it('probes: staging contract mode → maxRealisticScore 9.0 for six ceilings', () => {
    const ceilings = buildWorkshop2IntegrationCeilingProbes(ENV).filter((c) =>
      [50, 53, 55, 63, 66, 78].includes(c.catalogId)
    );
    expect(ceilings).toHaveLength(6);
    for (const c of ceilings) {
      expect(c.stagingContractMode).toBe(true);
      expect(c.maxRealisticScore).toBe(9);
      expect(c.prodLiveNoteRu).toMatch(/prod live/i);
    }
  });

  it('sample-order: DPP writeback blocker off when staging contract mode', () => {
    expect(evaluateWorkshop2DppRegistryWritebackBlocked(ENV)).toBeNull();
  });

  it('#50 DPP: localhost ACK → partnerAckRecorded + ackAt in journal', async () => {
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
      actor: 'w40-dpp',
      env: ENV,
      fetchImpl: mockFetchStagingOk({ registryAckId: 'DPP-STG-TEST-1' }),
    });
    expect(res.ok).toBe(true);
    expect(res.dossier.dppRegistryDraftMirror?.partnerAckRecorded).toBe(true);
    expect(res.dossier.dppRegistryDraftMirror?.partnerAckId).toBe('DPP-STG-TEST-1');
    expect(res.dossier.dppRegistryDraftMirror?.journal.at(-1)?.ackAt).toBeTruthy();
    expect(res.dossier.dppRegistryDraftMirror?.registryId).toBeNull();
    expect(hasWorkshop2CeilingStagingContractAckInDossier(res.dossier, 50)).toBe(true);
  });

  it('#53 LCA: staging contract ACK in mirror', async () => {
    const dossier = emptyWorkshop2DossierPhase1();
    dossier.productionModel = {
      materialLines: [{ materialName: 'Wool', yieldPerUnit: 1, yieldUnit: 'm' }],
    };
    const res = await attemptWorkshop2SustainabilityStaging({
      dossier,
      collectionId: 'c',
      articleId: 'a',
      actor: 'w40-lca',
      env: ENV,
      fetchImpl: mockFetchStagingOk({ registryAckId: 'LCA-STG-TEST-1' }),
    });
    expect(res.ok).toBe(true);
    expect(res.dossier.sustainabilityStagingMirror?.partnerAckRecorded).toBe(true);
    expect(res.dossier.sustainabilityStagingMirror?.partnerAckId).toBe('LCA-STG-TEST-1');
  });

  it('#55 Fit3D: GET health ACK from JSON', async () => {
    const res = await attemptWorkshop2Fit3dStagingProbe({
      dossier: emptyWorkshop2DossierPhase1(),
      actor: 'w40-fit3d',
      env: ENV,
      fetchImpl: mockFetchStagingOk({ pipelineAckId: 'FIT3D-STG-TEST-1' }),
    });
    expect(res.ok).toBe(true);
    expect(res.dossier.fit3dStagingMirror?.partnerAckRecorded).toBe(true);
    expect(res.dossier.fit3dStagingMirror?.partnerAckId).toBe('FIT3D-STG-TEST-1');
  });

  it('#63 Nesting: external_api simulate ACK', async () => {
    const res = await runWorkshop2NestingStagingWithJournal({
      dossier: emptyWorkshop2DossierPhase1(),
      collectionId: 'c',
      articleId: 'a',
      sampleOrderId: 'so-w40',
      nesting: { fabricWidthCm: 150 },
      actor: 'w40-nest',
      env: ENV,
      fetchImpl: mockFetchStagingOk({
        estimatedYieldPct: 82,
        nestingAckId: 'NEST-STG-TEST-1',
      }),
    });
    expect(res.ok).toBe(true);
    expect(res.source).toBe('external_api');
    expect(res.dossier.nestingStagingMirror?.partnerAckRecorded).toBe(true);
    expect(res.dossier.nestingStagingMirror?.partnerAckId).toBe('NEST-STG-TEST-1');
  });

  it('#66 ERP: erpOrderIdAckInPg true on staging contract', async () => {
    const res = await attemptWorkshop2FactoryErpStaging({
      dossier: emptyWorkshop2DossierPhase1(),
      purchaseOrders: [],
      erpConfigured: true,
      actor: 'w40-erp',
      collectionId: 'c',
      articleId: 'a',
      env: ENV,
      fetchImpl: mockFetchStagingOk({ erpOrderId: 'ERP-STG-TEST-1' }),
    });
    expect(res.ok).toBe(true);
    expect(res.dossier.factoryErpStagingMirror?.erpOrderIdAckInPg).toBe(true);
    expect(res.dossier.factoryErpStagingMirror?.partnerAckId).toBe('ERP-STG-TEST-1');
  });

  it('#78 PLM: partner ACK staging contract', async () => {
    let dossier = recordWorkshop2PlmWebhookReceipt({
      dossier: emptyWorkshop2DossierPhase1(),
      actor: 'w40-plm',
      eventId: 'evt-w40',
    });
    const res = await attemptWorkshop2PlmPartnerAckStaging({
      dossier,
      actor: 'w40-plm-ack',
      outboxEventId: 'evt-w40',
      env: ENV,
      fetchImpl: mockFetchStagingOk({ ackId: 'PLM-STG-TEST-1' }),
    });
    expect(res.ok).toBe(true);
    expect(res.dossier.plmTransportJournalMirror?.partnerAckRecorded).toBe(true);
    expect(res.dossier.plmTransportJournalMirror?.partnerAckId).toBe('PLM-STG-TEST-1');
    expect(res.dossier.plmTransportJournalMirror?.transportKind).toBe('staging_contract');
  });

  it('fail-closed: HTTP 500 never records partner ACK', async () => {
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
      actor: 'w40-fail',
      env: ENV,
      fetchImpl: mockFetch500(),
    });
    expect(res.ok).toBe(false);
    expect(res.dossier.dppRegistryDraftMirror?.partnerAckRecorded).toBe(false);
  });

  it('handoff: DPP ceiling warning suppressed when dossier has staging contract ACK', () => {
    const envBare = { WORKSHOP2_STAGING_CONTRACT_MODE: 'true' };
    const dossier = emptyWorkshop2DossierPhase1();
    dossier.dppRegistryDraftMirror = {
      draftedAt: new Date().toISOString(),
      mirroredAt: new Date().toISOString(),
      lastActor: 't',
      passportId: 'p1',
      registryId: null,
      scheme: 'eu',
      exportReady: true,
      stagingMode: 'posted',
      partnerAckRecorded: true,
      partnerAckId: 'DPP-STG-X',
      ackAt: new Date().toISOString(),
      stagingContractMode: true,
      journal: [
        {
          at: new Date().toISOString(),
          actor: 't',
          event: 'dpp_registry_staging',
          outcome: 'success',
          partnerAckRecorded: true,
          ackId: 'DPP-STG-X',
          ackAt: new Date().toISOString(),
        },
      ],
    };
    const warnings = evaluateWorkshop2IntegrationCeilingHandoffWarnings(envBare, dossier);
    expect(warnings.some((w) => w.id.includes('dpp'))).toBe(false);
    expect(hasWorkshop2CeilingStagingContractAckInDossier(dossier, 50)).toBe(true);
  });
});
