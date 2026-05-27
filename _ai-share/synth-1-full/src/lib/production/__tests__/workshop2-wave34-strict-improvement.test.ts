/**
 * Wave 34 — strict <9 improvements: #58 floor, #28 CR, #42 routing, #4 onboarding, #10 inventory, #60 risk.
 */
import { applyWorkshop2ChangeRequestDecision } from '@/lib/production/workshop2-change-request-workflow';
import {
  buildWorkshop2ChangeRequestMirror,
  evaluateWorkshop2ChangeRequestMirrorGate,
} from '@/lib/production/workshop2-change-request-dossier-persist';
import {
  applyWorkshop2FloorBridgeSyncToDossier,
  buildWorkshop2FloorBridgeMirror,
  evaluateWorkshop2FloorBridgeSampleGate,
} from '@/lib/production/workshop2-floor-bridge-dossier-persist';
import { resolveWorkshop2FloorSampleSync } from '@/lib/production/workshop2-floor-sample-sync';
import {
  persistWorkshop2HubOnboardingStateToDossier,
  evaluateWorkshop2HubOnboardingSampleGate,
} from '@/lib/production/workshop2-hub-onboarding-dossier-persist';
import {
  evaluateWorkshop2HubInventoryHandoffGate,
  persistWorkshop2HubInventoryMirrorToDossier,
} from '@/lib/production/workshop2-hub-inventory-dossier-persist';
import { buildWorkshop2SmartRoutingMirror } from '@/lib/production/workshop2-smart-routing-dossier-persist';
import {
  buildWorkshop2SupplyRiskMirror,
  persistWorkshop2SupplyRiskSnapshotToDossier,
} from '@/lib/production/workshop2-supply-risk-sample-gate';
import { evaluateWorkshop2PendingChangeRequestHandoffGate } from '@/lib/production/workshop2-pending-change-requests';
import { emptyWorkshop2DossierPhase1 } from '@/lib/production/workshop2-phase1-dossier-storage';

const COAT_LEAF = 'catalog-apparel-g0-l0';

describe('workshop2 wave34 — #58 floor bridge reverse sync', () => {
  const prevMesUrl = process.env.WORKSHOP2_FLOOR_MES_URL;
  beforeAll(() => {
    process.env.WORKSHOP2_FLOOR_MES_URL = 'https://mes.example.test';
  });
  afterAll(() => {
    if (prevMesUrl === undefined) delete process.env.WORKSHOP2_FLOOR_MES_URL;
    else process.env.WORKSHOP2_FLOOR_MES_URL = prevMesUrl;
  });

  it('maps gold-sample tab to approved order + dossier mirror', () => {
    const resolved = resolveWorkshop2FloorSampleSync({ floorTab: 'gold-sample' });
    expect(resolved.orderStatus).toBe('approved');

    const dossier = applyWorkshop2FloorBridgeSyncToDossier(emptyWorkshop2DossierPhase1(), {
      floorTab: 'gold-sample',
      orderStatus: 'approved',
      syncedAt: '2026-05-20T12:00:00.000Z',
      source: 'floor_api',
      orderId: 'ord-1',
    });
    expect(dossier.floorBridgeMirror?.reverseSyncEnabled).toBe(true);
    expect(dossier.goldSampleStatus?.status).toBe('approved');
    expect(dossier.sampleWorkflow?.lastFloorTab).toBe('gold-sample');
    expect(evaluateWorkshop2FloorBridgeSampleGate(dossier)).toBeNull();
  });

  it('warns when floor bridge mirror missing', () => {
    const gate = evaluateWorkshop2FloorBridgeSampleGate(emptyWorkshop2DossierPhase1());
    expect(gate?.id).toBe('floor.bridge.mirror_missing');
  });
});

describe('workshop2 wave34 — #28 CR server workflow', () => {
  it('mirror blocks pending CR and enables server workflow flag', () => {
    const dossier = {
      ...emptyWorkshop2DossierPhase1(),
      changeRequests: [
        {
          id: 'cr-1',
          description: 'Change lining',
          status: 'pending',
          createdAt: '2026-05-20T10:00:00.000Z',
        },
      ],
    };
    const mirror = buildWorkshop2ChangeRequestMirror(dossier);
    expect(mirror.serverWorkflowEnabled).toBe(true);
    expect(mirror.pendingCount).toBe(1);
    expect(evaluateWorkshop2ChangeRequestMirrorGate(dossier)?.severity).toBe('blocker');
    expect(evaluateWorkshop2PendingChangeRequestHandoffGate(dossier)?.id).toBe(
      'change_requests.pending_handoff'
    );

    const applied = applyWorkshop2ChangeRequestDecision({
      dossier,
      changeRequestId: 'cr-1',
      decision: 'approved',
      decidedBy: 'lead',
    });
    expect(applied?.changeRequest?.status).toBe('approved');
  });
});

describe('workshop2 wave34 — #42 smart routing engineKind', () => {
  it('labels demo_template in mirror', () => {
    const dossier = {
      ...emptyWorkshop2DossierPhase1(),
      smartRoutingFromDemo: true,
      smartRoutingSequence: [{ id: '1', category: 'A', name: 'B', equipment: 'C', sash: 1 }],
    };
    const mirror = buildWorkshop2SmartRoutingMirror(dossier);
    expect(mirror.engineKind).toBe('demo_template');
  });
});

describe('workshop2 wave34 — #4 hub onboarding dossier-first', () => {
  beforeEach(() => {
    try {
      if (typeof localStorage !== 'undefined') {
        localStorage.removeItem('synth.w2.hubOnboarding.v1');
        localStorage.removeItem('synth.w2.hubOnboarding.workspaceOpened.v1');
      }
    } catch {
      /* node env */
    }
  });

  it('persists onboarding state to dossier with source dossier', () => {
    const dossier = persistWorkshop2HubOnboardingStateToDossier(emptyWorkshop2DossierPhase1(), {
      markCompleted: true,
      workspaceOpened: true,
      role: 'technologist',
    });
    expect(dossier.hubOnboardingState?.source).toBe('dossier');
    expect(dossier.hubOnboardingState?.done).toBe(true);
    expect(evaluateWorkshop2HubOnboardingSampleGate(dossier)).toBeNull();
  });
});

describe('workshop2 wave34 — #10 inventory handoff gate', () => {
  it('warns handoff without PG overlay', () => {
    const dossier = persistWorkshop2HubInventoryMirrorToDossier(emptyWorkshop2DossierPhase1());
    expect(evaluateWorkshop2HubInventoryHandoffGate(dossier)?.id).toBe(
      'hub.inventory.no_overlay_handoff'
    );
  });
});

describe('workshop2 wave34 — #60 supply risk heuristic mirror', () => {
  it('builds heuristic_bom mirror on persist', () => {
    const dossier = persistWorkshop2SupplyRiskSnapshotToDossier({
      ...emptyWorkshop2DossierPhase1(),
      productionModel: {
        materialLines: [{ materialName: 'Cotton', consumption: 1, unit: 'm', isPrimary: true }],
      },
    });
    expect(dossier.supplyRiskMirror?.engineKind).toBe('heuristic_bom');
    expect(buildWorkshop2SupplyRiskMirror(dossier).predictedDays).toBeGreaterThan(0);
  });
});
