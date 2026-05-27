/**
 * Wave 36 — #75 vault strict 9.0 + journal second-layer ceilings (#63, #66).
 */
import { emptyWorkshop2DossierPhase1 } from '@/lib/production/workshop2-phase1-dossier-storage';
import {
  buildWorkshop2VaultPanelMirror,
  evaluateWorkshop2VaultPanelExportGate,
  evaluateWorkshop2VaultPanelHandoffGate,
} from '@/lib/production/workshop2-vault-panel-dossier-persist';
import {
  evaluateWorkshop2VaultPresignProdGuard,
  isWorkshop2VaultS3ConfiguredFromEnv,
} from '@/lib/production/workshop2-vault-presign-prod-guard';
import {
  buildWorkshop2VaultVirusScanMetadataPatch,
  evaluateWorkshop2VaultVirusScanHandoffGate,
  runWorkshop2VaultVirusScanStub,
} from '@/lib/production/workshop2-vault-virus-scan';
import {
  evaluateWorkshop2ErpJournalSecondLayerExport,
  evaluateWorkshop2NestingJournalSecondLayerHandoff,
} from '@/lib/production/workshop2-journal-mode-second-layer';
import { evaluateWorkshop2TzExportBundleGate } from '@/lib/production/workshop2-tz-export-bundle-gate';
import { evaluateWorkshop2FactoryHandoffCommitGate } from '@/lib/production/workshop2-factory-handoff-commit-gate';
import { buildWorkshop2PurchaseOrderErpMirror } from '@/lib/production/workshop2-purchase-order-erp-dossier-persist';
import { evaluateWorkshop2SampleOrderGate } from '@/lib/production/workshop2-sample-order-gate';

const COAT_LEAF = 'coat-outer-leaf';

describe('workshop2 wave36 — #75 vault S3 prod guard + virus scan', () => {
  it('blocks presign in production without S3 env', () => {
    const guard = evaluateWorkshop2VaultPresignProdGuard({ NODE_ENV: 'production' });
    expect(guard.allowed).toBe(false);
    expect(guard.s3PresignGuard).toBe('prod_blocked');
  });

  it('allows presign in development without S3', () => {
    const guard = evaluateWorkshop2VaultPresignProdGuard({ NODE_ENV: 'development' });
    expect(guard.allowed).toBe(true);
  });

  it('virus scan pending blocks handoff (fail-closed)', () => {
    const mirror = buildWorkshop2VaultPanelMirror({
      backendMode: 'server',
      vaultDocuments: [
        {
          storagePath: 'workshop2-vault/c/a/doc.pdf',
          metadata: buildWorkshop2VaultVirusScanMetadataPatch('pending'),
        },
      ],
      s3Configured: true,
      pgIndexedOk: true,
    });
    const dossier = { ...emptyWorkshop2DossierPhase1(), vaultPanelMirror: mirror };
    expect(evaluateWorkshop2VaultVirusScanHandoffGate({ dossier })?.id).toBe('vault.virus.pending');
    expect(evaluateWorkshop2VaultPanelHandoffGate(dossier)?.severity).toBe('blocker');
  });

  it('orphan presign awaiting_upload blocks handoff', () => {
    const mirror = buildWorkshop2VaultPanelMirror({
      backendMode: 'server',
      vaultDocuments: [
        {
          storagePath: undefined,
          metadata: {
            presignIssuedAt: '2026-05-20T10:00:00.000Z',
            virusScanStatus: 'awaiting_upload',
          },
        },
      ],
      s3Configured: true,
    });
    const dossier = { ...emptyWorkshop2DossierPhase1(), vaultPanelMirror: mirror };
    expect(evaluateWorkshop2VaultVirusScanHandoffGate({ dossier })?.id).toBe(
      'vault.presign.orphan'
    );
  });

  it('stub auto-clean for tests enables ready mirror', async () => {
    const status = await runWorkshop2VaultVirusScanStub({
      documentId: 'd1',
      storagePath: 'k/doc.pdf',
      env: { WORKSHOP2_VIRUS_SCAN_STUB_AUTO_CLEAN: 'true' },
    });
    expect(status).toBe('clean');
    const mirror = buildWorkshop2VaultPanelMirror({
      backendMode: 'server',
      vaultDocuments: [
        {
          storagePath: 'k/doc.pdf',
          metadata: buildWorkshop2VaultVirusScanMetadataPatch('clean'),
        },
        {
          storagePath: 'k/doc2.pdf',
          metadata: buildWorkshop2VaultVirusScanMetadataPatch('clean'),
        },
      ],
      s3Configured: true,
      pgIndexedOk: true,
    });
    expect(mirror.handoffVaultOk).toBe(true);
    expect(mirror.virusScanPendingCount).toBe(0);
  });

  it('export-tz vault gate wired (mirror missing warning)', () => {
    const gate = evaluateWorkshop2VaultPanelExportGate(emptyWorkshop2DossierPhase1());
    expect(gate?.id).toBe('export.vault.mirror_missing');
  });

  it('sample-order gate has no moysklad vault blocker', () => {
    const gate = evaluateWorkshop2SampleOrderGate({
      dossier: emptyWorkshop2DossierPhase1(),
      categoryLeafId: COAT_LEAF,
      vaultFileCount: 0,
    });
    expect(gate.readiness.checks.some((c) => c.id.includes('moysklad'))).toBe(false);
  });
});

describe('workshop2 wave36 — journal second layer (#63 #66 ceilings stay ≤8.9)', () => {
  it('nesting journal warning on handoff when snapshot without live API', () => {
    const dossier = {
      ...emptyWorkshop2DossierPhase1(),
      nestingRequestSnapshot: { fabricWidthCm: 150 },
    };
    const check = evaluateWorkshop2NestingJournalSecondLayerHandoff(dossier, {});
    expect(check?.severity).toBe('warning');
    expect(check?.id).toBe('ceiling.nesting.journal_second_layer_handoff');
  });

  it('erp journal warning on export when mirror journal_only', () => {
    const mirror = buildWorkshop2PurchaseOrderErpMirror({
      purchaseOrders: [{ id: 'po-1', status: 'draft' }],
      erpConfigured: false,
    });
    const check = evaluateWorkshop2ErpJournalSecondLayerExport(
      { ...emptyWorkshop2DossierPhase1(), purchaseOrderErpMirror: mirror },
      {}
    );
    expect(check?.id).toBe('ceiling.erp.journal_second_layer_export');
  });

  it('export-tz includes vault + journal second-layer checks', () => {
    const gate = evaluateWorkshop2TzExportBundleGate({
      dossier: {
        ...emptyWorkshop2DossierPhase1(),
        nestingRequestSnapshot: { fabricWidthCm: 140 },
      },
      categoryLeafId: COAT_LEAF,
      collectionId: 'SS27',
      articleId: 'a1',
    });
    expect(gate.checks.some((c) => c.id === 'export.vault.mirror_missing')).toBe(true);
    expect(gate.checks.some((c) => c.id === 'ceiling.nesting.journal_second_layer_export')).toBe(
      true
    );
  });

  it('S3 configured probe from env', () => {
    expect(
      isWorkshop2VaultS3ConfiguredFromEnv({
        WORKSHOP2_S3_BUCKET: 'b',
        WORKSHOP2_S3_REGION: 'r',
        WORKSHOP2_S3_ACCESS_KEY_ID: 'k',
        WORKSHOP2_S3_SECRET_ACCESS_KEY: 's',
      })
    ).toBe(true);
  });
});

describe('workshop2 wave36 — handoff commit vault virus integration', () => {
  it('pending virus in mirror blocks factory handoff commit', () => {
    const mirror = buildWorkshop2VaultPanelMirror({
      backendMode: 'server',
      vaultDocuments: [
        {
          storagePath: 'p/f.pdf',
          metadata: buildWorkshop2VaultVirusScanMetadataPatch('pending'),
        },
        { storagePath: 'p/g.pdf', metadata: buildWorkshop2VaultVirusScanMetadataPatch('clean') },
      ],
      s3Configured: true,
    });
    const commit = evaluateWorkshop2FactoryHandoffCommitGate({
      dossier: { ...emptyWorkshop2DossierPhase1(), vaultPanelMirror: mirror },
      categoryLeafId: COAT_LEAF,
    });
    expect(
      commit.readiness.checks.some(
        (c) => c.id === 'vault.virus.pending' && c.severity === 'blocker'
      )
    ).toBe(true);
  });
});
