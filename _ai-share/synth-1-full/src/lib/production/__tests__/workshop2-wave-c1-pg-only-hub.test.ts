/**
 * Block C — PG-only hub onboarding/inventory (#4, #10).
 */
import {
  detectWorkshop2HubOnboardingDrift,
  evaluateWorkshop2HubInventoryMirrorPersistOutcome,
  resolveWorkshop2HubOnboardingStatePgFirst,
  summarizeWorkshop2HubPgOnlyBanner,
  summarizeWorkshop2HubInventoryDriftBatch,
} from '@/lib/production/workshop2-hub-pg-only-policy';
import {
  persistWorkshop2HubOnboardingStateToDossier,
  evaluateWorkshop2HubOnboardingSampleGate,
} from '@/lib/production/workshop2-hub-onboarding-dossier-persist';
import { stampWorkshop2HubPgOverlayOnDossier } from '@/lib/production/workshop2-hub-inventory-pg-overlay';
import { persistWorkshop2HubInventoryMirrorToDossier } from '@/lib/production/workshop2-hub-inventory-dossier-persist';
import {
  emptyWorkshop2DossierPhase1,
  workshop2Phase1DossierStorageKey,
} from '@/lib/production/workshop2-phase1-dossier-storage';

describe('workshop2 wave-c1 — PG-only hub', () => {
  it('PG dossier wins over browser_storage when server online', () => {
    const dossier = {
      ...emptyWorkshop2DossierPhase1(),
      hubOnboardingState: {
        done: true,
        workspaceOpened: true,
        role: 'manager' as const,
        source: 'dossier' as const,
        completedAt: '2026-05-21T00:00:00.000Z',
      },
    };
    const state = resolveWorkshop2HubOnboardingStatePgFirst(dossier, {
      backendStatus: 'server',
    });
    expect(state.source).toBe('dossier');
    expect(state.done).toBe(true);
  });

  it('offline backend dedup — FlatHub banner null (hub uses BackendStatusBanner)', () => {
    expect(summarizeWorkshop2HubPgOnlyBanner({ backendStatus: 'offline' })).toBeNull();
  });

  it('onboarding drift blocks sample gate', () => {
    const dossier = persistWorkshop2HubOnboardingStateToDossier(emptyWorkshop2DossierPhase1(), {
      markCompleted: true,
    });
    const withDrift = {
      ...dossier,
      hubOnboardingMirror: {
        ...dossier.hubOnboardingMirror!,
        driftDetected: true,
        hintRu: 'Drift test',
      },
    };
    expect(evaluateWorkshop2HubOnboardingSampleGate(withDrift)?.id).toBe('hub.onboarding.drift');
  });

  it('inventory drift batch counts overlay mismatch', () => {
    const key = workshop2Phase1DossierStorageKey('SS27', 'a1');
    const local = {
      ...stampWorkshop2HubPgOverlayOnDossier(emptyWorkshop2DossierPhase1(), {
        collectionId: 'SS27',
        articleId: 'a1',
        serverVersion: 1,
      }),
      hubPgOverlayAt: '2026-05-20T10:00:00.000Z',
    };
    const merged = {
      ...stampWorkshop2HubPgOverlayOnDossier(emptyWorkshop2DossierPhase1(), {
        collectionId: 'SS27',
        articleId: 'a1',
        serverVersion: 2,
      }),
      hubPgOverlayAt: '2026-05-21T12:00:00.000Z',
    };
    const batch = summarizeWorkshop2HubInventoryDriftBatch({
      localMap: { [key]: local },
      mergedMap: { [key]: merged },
      articles: [{ collectionId: 'SS27', articleId: 'a1' }],
    });
    expect(batch.overlaidCount).toBe(1);
    expect(batch.driftCount).toBe(1);
  });

  it('hubInventoryMirror marks drift for sample gate', () => {
    const overlay = stampWorkshop2HubPgOverlayOnDossier(emptyWorkshop2DossierPhase1());
    const dossier = persistWorkshop2HubInventoryMirrorToDossier(overlay, {
      driftDetected: true,
    });
    expect(dossier.hubInventoryMirror?.driftDetected).toBe(true);
  });

  it('inventory mirror persist fail-closed on server without PG', () => {
    const out = evaluateWorkshop2HubInventoryMirrorPersistOutcome({
      backendStatus: 'server',
      apiOk: false,
      apiReason: 'version_conflict',
    });
    expect(out.silentLocalSuccess).toBe(false);
    expect(out.ok).toBe(false);
  });

  it('detectWorkshop2HubOnboardingDrift is false when only PG state', () => {
    const dossier = persistWorkshop2HubOnboardingStateToDossier(emptyWorkshop2DossierPhase1(), {
      markCompleted: true,
    });
    expect(detectWorkshop2HubOnboardingDrift(dossier)).toBe(false);
  });
});
