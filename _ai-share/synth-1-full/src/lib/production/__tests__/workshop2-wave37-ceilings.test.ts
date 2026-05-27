/**
 * Wave 37 — ceilings: PG journal showroom, ERP audit, nesting external_api, DPP draft, Fit3D vault, certified LCA.
 */
import {
  buildWorkshop2ShowroomB2bMirror,
  evaluateWorkshop2ShowroomB2bHandoffGate,
  persistWorkshop2ShowroomB2bMirrorToDossier,
} from '@/lib/production/workshop2-showroom-b2b-journal';
import {
  buildWorkshop2FactoryErpAuditMirror,
  workshop2FactoryErpUiMayShowSynced,
} from '@/lib/production/workshop2-factory-erp-audit-trail';
import { callWorkshop2NestingSimulationStub } from '@/lib/production/workshop2-nesting-request';
import {
  buildWorkshop2DppRegistryDraftMirror,
  postWorkshop2DppRegistryStaging,
  resolveWorkshop2DppRegistryUrl,
} from '@/lib/production/workshop2-dpp-registry-staging';
import { buildWorkshop2DppExportBlock } from '@/lib/production/workshop2-dpp-export';
import {
  evaluateWorkshop2Fit3dVaultGlbGate,
  hasWorkshop2VaultGlbInIndex,
  listWorkshop2VaultGlbIndex,
} from '@/lib/production/workshop2-fit3d-vault-gate';
import {
  persistWorkshop2SustainabilityCertifiedToDossier,
  evaluateWorkshop2SustainabilityCertifiedExportGate,
} from '@/lib/production/workshop2-sustainability-certified-persist';
import { emptyWorkshop2DossierPhase1 } from '@/lib/production/workshop2-phase1-dossier-storage';

describe('workshop2 wave37 ceilings', () => {
  const ENV: Record<string, string | undefined> = {};

  beforeEach(() => {
    delete ENV.WORKSHOP2_NESTING_API_URL;
    delete ENV.WORKSHOP2_DPP_REGISTRY_URL;
    delete process.env.WORKSHOP2_NESTING_API_URL;
    delete process.env.WORKSHOP2_DPP_REGISTRY_URL;
  });

  it('#62 showroom PG journal mirror — no fake webhook ACK', () => {
    const mirror = buildWorkshop2ShowroomB2bMirror({
      campaign: {
        collectionId: 'ss27',
        articleId: 'a1',
        campaignName: 'test',
        published: true,
        updatedAt: new Date().toISOString(),
      },
      env: ENV,
    });
    expect(mirror.publishMode).toBe('pg_journal');
    expect(mirror.pgPublished).toBe(true);
    expect(mirror.liveWebhookAckSimulated).toBe(false);
    const dossier = persistWorkshop2ShowroomB2bMirrorToDossier(
      emptyWorkshop2DossierPhase1(),
      mirror
    );
    expect(evaluateWorkshop2ShowroomB2bHandoffGate({ dossier })).toBeNull();
  });

  it('#62 handoff warns when showroom mirror missing or unpublished', () => {
    const missing = evaluateWorkshop2ShowroomB2bHandoffGate({
      dossier: emptyWorkshop2DossierPhase1(),
    });
    expect(missing?.severity).toBe('warning');
    const unpublished = evaluateWorkshop2ShowroomB2bHandoffGate({
      dossier: persistWorkshop2ShowroomB2bMirrorToDossier(
        emptyWorkshop2DossierPhase1(),
        buildWorkshop2ShowroomB2bMirror({
          campaign: {
            collectionId: 'c',
            articleId: 'a',
            campaignName: 'x',
            published: false,
            updatedAt: new Date().toISOString(),
          },
        })
      ),
    });
    expect(unpublished?.id).toBe('showroom.b2b.not_published_pg');
  });

  it('#66 ERP audit blocks fake synced UI label', () => {
    const audit = buildWorkshop2FactoryErpAuditMirror({
      purchaseOrders: [{ id: 'po1', status: 'synced', erpExternalId: null }],
      erpConfigured: true,
    });
    expect(audit.blocksFakeSyncedUi).toBe(true);
    expect(audit.journalOnly).toBe(true);
    expect(
      workshop2FactoryErpUiMayShowSynced({
        status: 'synced',
        erpExternalId: null,
        erpConfigured: true,
      })
    ).toBe(false);
    expect(
      workshop2FactoryErpUiMayShowSynced({
        status: 'synced',
        erpExternalId: 'ERP-99',
        erpConfigured: true,
      })
    ).toBe(true);
  });

  it('#63 nesting: local heuristic without URL; external_api fail-closed', async () => {
    const base = {
      collectionId: 'c',
      articleId: 'a',
      sampleOrderId: 'so1',
      nesting: { fabricWidthCm: 150 },
    };
    const local = await callWorkshop2NestingSimulationStub(base);
    expect(local.ok).toBe(true);
    expect(local.source).toBe('local_heuristic');

    process.env.WORKSHOP2_NESTING_API_URL = 'http://127.0.0.1:9';
    const ext = await callWorkshop2NestingSimulationStub(base);
    expect(ext.ok).toBe(false);
    expect(ext.source).toBe('external_api');
    expect(ext.simulation).toBeUndefined();
    expect(ext.error).toBeTruthy();
  });

  it('#50 DPP registry draft — registryId null; staging skipped without URL', async () => {
    const dossier = emptyWorkshop2DossierPhase1();
    dossier.productionModel = {
      materialLines: [{ materialName: 'Хлопок', yieldPerUnit: 1, yieldUnit: 'м' }],
    };
    const block = buildWorkshop2DppExportBlock({
      dossier,
      collectionId: 'c',
      articleId: 'a',
    });
    const mirror = buildWorkshop2DppRegistryDraftMirror({
      block,
      actor: 'test',
      journal: [],
      env: ENV,
    });
    expect(mirror.registryId).toBeNull();
    expect(mirror.stagingMode).toBe('none');
    const post = await postWorkshop2DppRegistryStaging({
      dossier,
      block,
      actor: 'test',
      env: ENV,
    });
    expect(post.ok).toBe(false);
    expect(post.skipped).toBe(true);
    ENV.WORKSHOP2_DPP_REGISTRY_URL = 'http://127.0.0.1:9';
    expect(resolveWorkshop2DppRegistryUrl(ENV)).toContain('127.0.0.1');
  });

  it('#55 Fit3D vault glb index gate in production', () => {
    const docs = listWorkshop2VaultGlbIndex([
      { documentId: 'd1', storagePath: '/vault/model.glb' },
      { documentId: 'd2', storagePath: '/vault/readme.pdf' },
    ]);
    expect(docs).toHaveLength(1);
    const dossier = emptyWorkshop2DossierPhase1();
    dossier.vaultDocuments = [
      { id: 'd1', type: 'other', title: 'glb', storagePath: '/vault/m.glb' } as never,
    ];
    expect(hasWorkshop2VaultGlbInIndex(dossier)).toBe(true);
    const blocker = evaluateWorkshop2Fit3dVaultGlbGate({
      dossier: emptyWorkshop2DossierPhase1(),
      nodeEnv: 'production',
    });
    expect(blocker?.severity).toBe('blocker');
  });

  it('#53 sustainability certified fields — export warning only', () => {
    const dossier = emptyWorkshop2DossierPhase1();
    dossier.productionModel = {
      materialLines: [{ materialName: 'Wool', yieldPerUnit: 1, yieldUnit: 'м' }],
      ecoAttributes: { certificationBody: 'GOTS', certificationRef: 'REF-1' },
    };
    const next = persistWorkshop2SustainabilityCertifiedToDossier(dossier, {
      collectionId: 'c',
      articleId: 'a',
    });
    expect(next.sustainabilityLcaSnapshot?.certifiedSource).toBe('dossier_bom');
    const warn = evaluateWorkshop2SustainabilityCertifiedExportGate({
      dossier: next,
      collectionId: 'c',
      articleId: 'a',
    });
    expect(warn?.severity).toBe('warning');
  });
});
