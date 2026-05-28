/**
 * Wave 41 — production depth (prod path 9.0 без staging contract / fake ACK).
 */
import { validateWorkshop2DppJsonLdForExport } from '@/lib/production/workshop2-dpp-jsonld-validator';
import { evaluateWorkshop2DppExportGate } from '@/lib/production/workshop2-dpp-export-gate';
import {
  evaluateWorkshop2SustainabilityCarbonRollup,
  persistWorkshop2SustainabilityCarbonRollupToDossier,
} from '@/lib/production/workshop2-sustainability-carbon-rollup';
import {
  listWorkshop2Fit3dVaultFilesFromDossier,
  summarizeWorkshop2Fit3dVaultFileIndex,
} from '@/lib/production/workshop2-fit3d-vault-file-index';
import { hasWorkshop2VaultGlbInIndex } from '@/lib/production/workshop2-fit3d-vault-gate';
import {
  applyWorkshop2NestingFabricWidthFromPom,
  suggestWorkshop2NestingFabricWidthFromDossier,
} from '@/lib/production/workshop2-nesting-pom-fabric-width';
import { workshop2NestingLocalHeuristicAllowed } from '@/lib/production/workshop2-nesting-prod-guard';
import { callWorkshop2NestingSimulationStub } from '@/lib/production/workshop2-nesting-request';
import {
  persistWorkshop2FactoryErpManualAckToDossier,
  buildWorkshop2FactoryErpAuditCsv,
} from '@/lib/production/workshop2-factory-erp-manual-ack';
import {
  persistWorkshop2PlmManualPartnerAckToDossier,
  buildWorkshop2PlmTransportJournalCsv,
} from '@/lib/production/workshop2-plm-manual-partner-ack';
import {
  buildWorkshop2CeilingProductionDepthReport,
  evaluateWorkshop2CeilingProductionDepth,
} from '@/lib/production/workshop2-production-depth-rating';
import { isWorkshop2StagingContractModeEnabled } from '@/lib/production/workshop2-staging-contract-mode';
import { emptyWorkshop2DossierPhase1 } from '@/lib/production/workshop2-phase1-dossier-storage';
import type { Workshop2DossierPhase1 } from '@/lib/production/workshop2-dossier-phase1.types';

function dossierWithBom(): Workshop2DossierPhase1 {
  const d = emptyWorkshop2DossierPhase1();
  d.productionModel = {
    version: 1,
    nodes: [],
    materialLines: [
      { materialName: 'Organic cotton', yieldPerUnit: 1.2, yieldUnit: 'm', recycledPct: 30 },
    ],
    measurements: [],
  } as Workshop2DossierPhase1['productionModel'];
  d.assignments = [
    {
      assignmentId: 'a-sku',
      kind: 'canonical',
      attributeId: 'sku',
      values: [{ valueId: 'v1', valueSource: 'free_text', displayLabel: 'SKU-W41' }],
    },
  ];
  return d;
}

describe('workshop2 wave41 — production depth modules', () => {
  const base = { collectionId: 'c-w41', articleId: 'a-w41' };

  it('#50 JSON-LD validator: valid BOM → no schema blocker; invalid registryId → blocker', () => {
    const dossier = dossierWithBom();
    const v = validateWorkshop2DppJsonLdForExport({ dossier, ...base });
    expect(v.state).toBe('valid');
    expect(v.previewJsonLd['@type']).toBe('Product');
    const gate = evaluateWorkshop2DppExportGate({ dossier, ...base });
    expect(gate?.id).not.toBe('dpp.jsonld.schema_invalid');

    const emptyMat = dossierWithBom();
    emptyMat.productionModel = {
      version: 1,
      nodes: [],
      materialLines: [],
      measurements: [],
    } as Workshop2DossierPhase1['productionModel'];
    const invalid = validateWorkshop2DppJsonLdForExport({ dossier: emptyMat, ...base });
    expect(invalid.state).toBe('invalid');
    expect(invalid.issues.some((i) => i.code === 'missing_composition')).toBe(true);
  });

  it('#53 carbon rollup: heuristic persist + threshold field', () => {
    const dossier = dossierWithBom();
    const rollup = evaluateWorkshop2SustainabilityCarbonRollup({ dossier, ...base });
    expect(rollup.engine).toBe('heuristic_bom_v1');
    const next = persistWorkshop2SustainabilityCarbonRollupToDossier(dossier, base);
    expect(next.sustainabilityCarbonRollupMirror?.computedAt).toBeTruthy();
    expect(next.sustainabilityLcaSnapshot?.carbonRollupEngine).toBe('heuristic_bom_v1');
  });

  it('#55 vault file index lists title + detects .glb', () => {
    const dossier = dossierWithBom();
    dossier.vaultDocuments = [
      {
        id: 'v1',
        type: 'cad',
        title: 'model.glb',
        amount: 1,
        uploadedAt: new Date().toISOString(),
      },
      { id: 'v2', type: 'pdf', title: 'techpack.pdf', amount: 1 },
    ];
    const rows = listWorkshop2Fit3dVaultFilesFromDossier(dossier);
    expect(rows).toHaveLength(2);
    expect(rows.filter((r) => r.isGlb)).toHaveLength(1);
    expect(hasWorkshop2VaultGlbInIndex(dossier)).toBe(true);
    expect(summarizeWorkshop2Fit3dVaultFileIndex(dossier).hasProductionGlb).toBe(true);
  });

  it('#63 POM fabric width import + prod stub guard', async () => {
    const dossier = dossierWithBom();
    dossier.productionModel!.measurements = [
      {
        id: 'm-fw',
        code: 'fabric_width',
        label: 'Ширина полотна',
        size: 'base',
        valueCm: 148,
      },
    ];
    const suggest = suggestWorkshop2NestingFabricWidthFromDossier(dossier);
    expect(suggest.fabricWidthCm).toBe(148);
    expect(suggest.source).toBe('pom_measurement');
    const applied = applyWorkshop2NestingFabricWidthFromPom({
      current: {},
      dossier,
    });
    expect(applied.applied).toBe(true);
    expect(applied.fabricWidthCm).toBe(148);

    const prodEnv = { NODE_ENV: 'production' };
    expect(workshop2NestingLocalHeuristicAllowed(prodEnv)).toBe(false);
    const sim = await callWorkshop2NestingSimulationStub({
      collectionId: 'c',
      articleId: 'a',
      sampleOrderId: 'so-1',
      nesting: { fabricWidthCm: 150 },
      env: prodEnv,
    });
    expect(sim.ok).toBe(false);
    expect(sim.error).toBe('nesting_stub_disabled_in_production');
  });

  it('#66 manual erpOrderId + audit CSV', () => {
    const dossier = dossierWithBom();
    dossier.factoryErpAuditMirror = {
      mirroredAt: new Date().toISOString(),
      blocksFakeSyncedUi: true,
      journalOnly: true,
      entries: [
        {
          at: new Date().toISOString(),
          poId: 'po-1',
          status: 'synced',
          erpExternalId: 'ERP-PO-99',
          displayCode: 'PO-99',
          event: 'mirror_sync',
        },
      ],
    };
    const next = persistWorkshop2FactoryErpManualAckToDossier({
      dossier,
      actor: 'test',
      erpOrderId: 'MANUAL-ERP-1',
    });
    expect(next.factoryErpManualAckMirror?.manualErpOrderId).toBe('MANUAL-ERP-1');
    expect(buildWorkshop2FactoryErpAuditCsv(next)).toContain('ERP-PO-99');
  });

  it('#78 manual partner ack + journal CSV', () => {
    const dossier = dossierWithBom();
    dossier.plmTransportJournalMirror = {
      mirroredAt: new Date().toISOString(),
      transportKind: 'outbox_journal',
      journal: [
        {
          at: new Date().toISOString(),
          actor: 'w41',
          event: 'outbox_dispatch',
          outcome: 'success',
        },
      ],
    };
    const next = persistWorkshop2PlmManualPartnerAckToDossier({
      dossier,
      actor: 'test',
      manualPartnerAckId: 'PARTNER-MANUAL-1',
    });
    expect(next.plmManualPartnerAckMirror?.labeledAs).toBe('manual_ack_id');
    expect(buildWorkshop2PlmTransportJournalCsv(next.plmTransportJournalMirror?.journal)).toContain(
      'outbox_dispatch'
    );
  });
});

describe('workshop2 wave41 — prod vs staging contract scores', () => {
  const envNoStaging: Record<string, string | undefined> = {
    WORKSHOP2_STAGING_CONTRACT_MODE: 'false',
    NODE_ENV: 'test',
  };

  it('before depth: empty dossier → 6 ceilings prod 8.9', () => {
    const report = buildWorkshop2CeilingProductionDepthReport({
      dossier: emptyWorkshop2DossierPhase1(),
      collectionId: 'c',
      articleId: 'a',
      env: envNoStaging,
    });
    expect(report.prodAtOrAbove9).toBe(1);
    expect(report.items.filter((i) => i.scoreProd < 9)).toHaveLength(5);
    expect(isWorkshop2StagingContractModeEnabled(envNoStaging)).toBe(false);
    expect(report.items.every((i) => i.scoreStagingContract === 8.9)).toBe(true);
  });

  it('after depth: filled dossier → 6 ceilings prod 9.0 (in-repo, no fake ACK)', () => {
    let dossier = dossierWithBom();
    dossier = persistWorkshop2SustainabilityCarbonRollupToDossier(dossier, {
      collectionId: 'c',
      articleId: 'a',
    });
    dossier.vaultDocuments = [
      { id: 'g', type: 'cad', title: 'fit.glb', amount: 1, uploadedAt: new Date().toISOString() },
    ];
    dossier.productionModel!.measurements = [
      { id: 'm-fw2', code: 'fw', label: 'fabric width cm', size: 'base', valueCm: 152 },
    ];
    dossier.nestingRequestSnapshot = { fabricWidthCm: 152 };
    dossier = persistWorkshop2FactoryErpManualAckToDossier({
      dossier,
      actor: 'w41',
      erpOrderId: 'ERP-W41',
    });
    dossier = persistWorkshop2PlmManualPartnerAckToDossier({
      dossier,
      actor: 'w41',
      manualPartnerAckId: 'ACK-W41',
    });
    dossier.dppExportValidation = {
      validatedAt: new Date().toISOString(),
      state: 'ready',
      schemaState: 'valid',
      issueCount: 0,
      previewAvailable: true,
    };

    const report = buildWorkshop2CeilingProductionDepthReport({
      dossier,
      collectionId: 'c',
      articleId: 'a',
      env: envNoStaging,
    });
    expect(report.prodAtOrAbove9).toBe(6);
    for (const id of [50, 53, 55, 63, 66, 78] as const) {
      const v = evaluateWorkshop2CeilingProductionDepth(id, {
        dossier,
        collectionId: 'c',
        articleId: 'a',
        env: envNoStaging,
      });
      expect(v.scoreProd).toBe(9);
      expect(v.cannotReachProd9Without).toMatch(/live|Live|CAD|registry|ERP|PLM/);
    }
  });

  it('staging contract still 9.0 when mode on (wave 40, not duplicated)', () => {
    const envStaging = {
      WORKSHOP2_STAGING_CONTRACT_MODE: 'true',
      WORKSHOP2_DPP_REGISTRY_URL: 'http://127.0.0.1:18766',
    };
    const v = evaluateWorkshop2CeilingProductionDepth(50, {
      dossier: emptyWorkshop2DossierPhase1(),
      collectionId: 'c',
      articleId: 'a',
      env: envStaging,
    });
    expect(v.scoreStagingContract).toBe(9);
  });
});
