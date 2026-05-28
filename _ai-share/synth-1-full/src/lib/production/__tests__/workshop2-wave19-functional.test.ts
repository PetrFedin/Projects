/**
 * Wave 19 — PG persist, gates, hub overlay, overview/layout/stock prep (integration notes in names).
 */
import { emptyWorkshop2DossierPhase1 } from '@/lib/production/workshop2-phase1-dossier-storage';
import {
  buildWorkshop2HubOnboardingMirrorFromBrowser,
  persistWorkshop2HubOnboardingMirrorToDossier,
} from '@/lib/production/workshop2-hub-onboarding-dossier-persist';
import {
  detectWorkshop2HubInventoryOverlayDrift,
  stampWorkshop2HubPgOverlayOnDossier,
  summarizeWorkshop2HubInventoryOverlayBatch,
} from '@/lib/production/workshop2-hub-inventory-pg-overlay';
import {
  buildWorkshop2OverviewPersistSnapshot,
  persistWorkshop2OverviewSnapshotToDossier,
} from '@/lib/production/workshop2-overview-dossier-persist';
import {
  countWorkshop2VaultDocumentsForRelatedStrip,
  formatWorkshop2RelatedVaultLinkLabel,
} from '@/lib/production/workshop2-related-vault-enrichment';
import {
  persistWorkshop2DossierLayoutToDossier,
  resolveWorkshop2DossierLayoutPreference,
} from '@/lib/production/workshop2-dossier-layout-mode';
import {
  buildWorkshop2StockWmsLedgerFromBundle,
  evaluateWorkshop2StockWmsLedgerGate,
  persistWorkshop2StockWmsLedgerToDossier,
} from '@/lib/production/workshop2-stock-wms-ledger-persist';
import { evaluateWorkshop2SampleOrderGate } from '@/lib/production/workshop2-sample-order-gate';

describe('workshop2 wave19 — #4 hub onboarding mirror → dossier PG', () => {
  it('integration: mirrors browser onboarding flags into dossier', () => {
    const dossier = emptyWorkshop2DossierPhase1();
    const mirror = buildWorkshop2HubOnboardingMirrorFromBrowser();
    expect(mirror.source).toBe('browser_storage');
    const next = persistWorkshop2HubOnboardingMirrorToDossier(dossier);
    expect(next.hubOnboardingMirror?.mirroredAt).toBeTruthy();
    expect(typeof next.hubOnboardingMirror?.done).toBe('boolean');
  });
});

describe('workshop2 wave19 — #10 hub PG overlay audit timestamps', () => {
  it('integration: stamps hubPgOverlayAt on dossier after API merge', () => {
    const dossier = emptyWorkshop2DossierPhase1();
    const stamped = stampWorkshop2HubPgOverlayOnDossier(dossier, {
      collectionId: 'SS27',
      articleId: 'a1',
      serverVersion: 3,
    });
    expect(stamped.hubPgOverlayAt).toBeTruthy();
    expect(stamped.hubPgOverlayMeta?.serverVersion).toBe(3);
  });

  it('integration: detects drift between local and merged overlay', () => {
    const local = emptyWorkshop2DossierPhase1();
    const merged = stampWorkshop2HubPgOverlayOnDossier(local, {
      collectionId: 'SS27',
      articleId: 'a1',
    });
    expect(detectWorkshop2HubInventoryOverlayDrift({ local, merged })).toBe(true);
    const batch = summarizeWorkshop2HubInventoryOverlayBatch({
      localMap: { 'SS27::a1': local },
      mergedMap: { 'SS27::a1': merged },
      articles: [{ collectionId: 'SS27', articleId: 'a1' }],
    });
    expect(batch.overlaidCount).toBe(1);
    expect(batch.driftCount).toBe(1);
  });
});

describe('workshop2 wave19 — #21 overview snapshot persist', () => {
  it('integration: builds overviewPersistedSnapshot from readiness model', () => {
    const dossier = emptyWorkshop2DossierPhase1();
    const snap = buildWorkshop2OverviewPersistSnapshot({
      dossier,
      collectionId: 'SS27',
      articleId: 'a1',
    });
    expect(snap.persistedAt).toBeTruthy();
    expect(typeof snap.tzOverallPct).toBe('number');
    const next = persistWorkshop2OverviewSnapshotToDossier(dossier, {
      collectionId: 'SS27',
      articleId: 'a1',
    });
    expect(next.overviewPersistedSnapshot?.primaryTab).toBeTruthy();
  });
});

describe('workshop2 wave19 — #23 related strip vault count', () => {
  it('integration: vault label includes doc count from dossier', () => {
    const dossier = {
      ...emptyWorkshop2DossierPhase1(),
      vaultDocuments: [
        { id: 'v1', type: 'other', title: 'A' },
        { id: 'v2', type: 'other', title: 'B' },
      ],
    };
    expect(countWorkshop2VaultDocumentsForRelatedStrip(dossier)).toBe(2);
    expect(formatWorkshop2RelatedVaultLinkLabel(2)).toBe('Документы (2)');
    expect(formatWorkshop2RelatedVaultLinkLabel(0)).toBe('Документы');
  });
});

describe('workshop2 wave19 — #25 dossier layout server default', () => {
  it('integration: URL wins over dossier PG layout', () => {
    const dossier = persistWorkshop2DossierLayoutToDossier(emptyWorkshop2DossierPhase1(), 'dense');
    expect(resolveWorkshop2DossierLayoutPreference({ urlParam: 'full', dossier })).toBe('full');
  });

  it('integration: dossier dense when URL empty', () => {
    const dossier = persistWorkshop2DossierLayoutToDossier(emptyWorkshop2DossierPhase1(), 'dense');
    expect(resolveWorkshop2DossierLayoutPreference({ dossier })).toBe('dense');
    expect(dossier.dossierLayoutPersistedAt).toBeTruthy();
  });
});

describe('workshop2 wave19 — #71 stock WMS ledger + sample-order gate chain', () => {
  it('integration: ledger draft from bundle movements', () => {
    const ledger = buildWorkshop2StockWmsLedgerFromBundle({
      stock: {
        movements: [
          {
            id: 'm1',
            kind: 'out',
            qty: 5,
            at: '2026-01-01T00:00:00.000Z',
            label: 'out',
            unitCostRub: 1,
          },
        ],
        onHandNote: '',
      },
    });
    expect(ledger.wmsSyncStatus).toBe('draft_local');
    expect(ledger.movementCount).toBe(1);
  });

  it('integration: sample-order gate warns on stale negative ledger', () => {
    const base = persistWorkshop2StockWmsLedgerToDossier(emptyWorkshop2DossierPhase1(), {
      stock: {
        movements: [
          {
            id: 'm1',
            kind: 'out',
            qty: 10,
            at: '2020-01-01T00:00:00.000Z',
            label: 'old',
            unitCostRub: 1,
          },
        ],
        onHandNote: '',
      },
    });
    const dossier: typeof base = {
      ...base,
      stockWmsLedger: {
        ...base.stockWmsLedger!,
        ledgerAt: '2020-01-01T00:00:00.000Z',
        qtyOnHand: -10,
        negativeBalance: true,
      },
    };
    const check = evaluateWorkshop2StockWmsLedgerGate({ dossier });
    expect(check?.id).toBe('stock.wms.negative_unaudited');
    const gate = evaluateWorkshop2SampleOrderGate({
      dossier,
      categoryLeafId: 'leaf-1',
    });
    expect(gate.readiness.checks.some((c) => c.id === 'stock.wms.negative_unaudited')).toBe(true);
  });
});
