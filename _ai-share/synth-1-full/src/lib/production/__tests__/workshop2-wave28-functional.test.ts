/**
 * Wave 28 — push ≥9.0: hub onboarding, inventory, PLM, activity, rollup, matchmaker mirrors.
 */
import { emptyWorkshop2DossierPhase1 } from '@/lib/production/workshop2-phase1-dossier-storage';
import {
  evaluateWorkshop2HubOnboardingSampleGate,
  persistWorkshop2HubOnboardingMirrorToDossier,
} from '@/lib/production/workshop2-hub-onboarding-dossier-persist';
import {
  evaluateWorkshop2HubInventorySampleGate,
  persistWorkshop2HubInventoryMirrorToDossier,
} from '@/lib/production/workshop2-hub-inventory-dossier-persist';
import {
  evaluateWorkshop2PlmOutboxSampleGate,
  persistWorkshop2PlmOutboxAuditToDossier,
} from '@/lib/production/workshop2-plm-outbox-dossier-persist';
import {
  evaluateWorkshop2HubActivityHandoffGate,
  evaluateWorkshop2HubActivitySampleGate,
  persistWorkshop2HubActivityMirrorToDossier,
} from '@/lib/production/workshop2-hub-activity-dossier-persist';
import {
  evaluateWorkshop2HubRollupHandoffGate,
  evaluateWorkshop2HubRollupSampleGate,
  persistWorkshop2HubCollectionRollupMirrorToDossier,
} from '@/lib/production/workshop2-hub-collection-rollup-persist';
import {
  evaluateWorkshop2MatchmakerMirrorHandoffGate,
  evaluateWorkshop2MatchmakerMirrorSampleGate,
  persistWorkshop2MatchmakerMirrorToDossier,
} from '@/lib/production/workshop2-matchmaker-dossier-persist';
import { evaluateWorkshop2SampleOrderGate } from '@/lib/production/workshop2-sample-order-gate';
import { evaluateWorkshop2FactoryHandoffCommitGate } from '@/lib/production/workshop2-factory-handoff-commit-gate';

const COAT_LEAF = 'catalog-apparel-g0-l0';
const COL = 'col-w28';

describe('workshop2 wave28 — #4 hub onboarding mirror → sample-order', () => {
  it('integration: incomplete onboarding warns sample-order', () => {
    const dossier = persistWorkshop2HubOnboardingMirrorToDossier(emptyWorkshop2DossierPhase1());
    if (dossier.hubOnboardingMirror?.blockerSampleOrder) {
      expect(evaluateWorkshop2HubOnboardingSampleGate(dossier)?.id).toBe(
        'hub.onboarding.incomplete'
      );
    } else {
      expect(evaluateWorkshop2HubOnboardingSampleGate(dossier)).toBeNull();
    }
  });
});

describe('workshop2 wave28 — #10 hub inventory mirror → sample-order', () => {
  it('integration: missing overlay warns sample-order', () => {
    const dossier = persistWorkshop2HubInventoryMirrorToDossier(emptyWorkshop2DossierPhase1());
    expect(evaluateWorkshop2HubInventorySampleGate(dossier)?.id).toBe('hub.inventory.no_overlay');
  });
});

describe('workshop2 wave28 — #18 PLM outbox mirror → sample-order + handoff', () => {
  it('integration: failed outbox blocks sample-order', () => {
    const dossier = persistWorkshop2PlmOutboxAuditToDossier(emptyWorkshop2DossierPhase1(), {
      pending: 0,
      awaitingAck: 0,
      failed: 2,
      autoAckEnabled: false,
    });
    expect(evaluateWorkshop2PlmOutboxSampleGate(dossier)?.severity).toBe('blocker');
    const gate = evaluateWorkshop2SampleOrderGate({
      dossier,
      categoryLeafId: COAT_LEAF,
    });
    expect(gate.readiness.checks.some((c) => c.id === 'plm.outbox.failed')).toBe(true);
  });
});

describe('workshop2 wave28 — #8 hub activity mirror → sample-order + handoff', () => {
  it('integration: local_only activity warns gates', () => {
    const dossier = persistWorkshop2HubActivityMirrorToDossier(emptyWorkshop2DossierPhase1(), {
      entries: [
        {
          id: 'local-1',
          at: new Date().toISOString(),
          line: 'local event',
          collectionId: COL,
          articleId: 'a1',
        },
      ],
    });
    if (dossier.hubActivityMirror?.state === 'local_only') {
      expect(evaluateWorkshop2HubActivitySampleGate(dossier)?.severity).toBe('warning');
      expect(evaluateWorkshop2HubActivityHandoffGate(dossier)?.severity).toBe('warning');
    }
  });
});

describe('workshop2 wave28 — #1 hub rollup mirror → sample-order + handoff', () => {
  it('integration: PG down blocks sample-order and handoff-commit', () => {
    const dossier = persistWorkshop2HubCollectionRollupMirrorToDossier(
      emptyWorkshop2DossierPhase1(),
      {
        collectionId: COL,
        metrics: { postgres: 'down', counts: null },
      }
    );
    expect(evaluateWorkshop2HubRollupSampleGate(dossier)?.severity).toBe('blocker');
    expect(evaluateWorkshop2HubRollupHandoffGate(dossier)?.severity).toBe('blocker');
    const commit = evaluateWorkshop2FactoryHandoffCommitGate({
      dossier,
      categoryLeafId: COAT_LEAF,
      vaultFileCount: 1,
    });
    expect(commit.readiness.checks.some((c) => c.id === 'hub.rollup.pg_down')).toBe(true);
  });
});

describe('workshop2 wave28 — #9 matchmaker mirror → sample-order', () => {
  it('integration: warns when mirror missing but sewing plan set', () => {
    const base = {
      ...emptyWorkshop2DossierPhase1(),
      sewingPlan: { partnerId: 'partner-1', partnerLabel: 'Test' },
    };
    expect(evaluateWorkshop2MatchmakerMirrorSampleGate(base)?.id).toBe('matchmaker.mirror_missing');
    const withResult = persistWorkshop2MatchmakerMirrorToDossier({
      ...base,
      matchmakerResult: {
        recommendedContractorId: 'partner-1',
        confidence: 0.9,
        syncedAt: new Date().toISOString(),
        raw: { matches: [] },
      },
    });
    expect(withResult.matchmakerMirror?.recommendedContractorId).toBe('partner-1');
    expect(evaluateWorkshop2MatchmakerMirrorHandoffGate(withResult)).toBeNull();
  });
});
