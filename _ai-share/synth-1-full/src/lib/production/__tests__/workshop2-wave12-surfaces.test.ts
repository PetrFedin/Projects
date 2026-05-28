/**
 * Wave 12: verification closes (#14,#15,#24) + critical sample path status.
 */
import { emptyWorkshop2DossierPhase1 } from '@/lib/production/workshop2-phase1-dossier-storage';
import { mergeWorkshop2DossierWithServerWinsPolicy } from '@/lib/production/workshop2-dossier-version-merge-policy';
import { readWorkshop2PomOnCreatePolicyDefault } from '@/lib/production/workshop2-pom-create-policy';
import {
  resolveWorkshop2UpdatedBy,
  workshop2RequiresJwtActorForPut,
} from '@/lib/server/workshop2-api-context';
import { summarizeWorkshop2GoldSampleStatus } from '@/lib/production/workshop2-gold-sample-status';
import { summarizeWorkshop2SampleIntakeStatus } from '@/lib/production/workshop2-sample-intake-status';
import { summarizeWorkshop2SampleMovementStatus } from '@/lib/production/workshop2-sample-movement-status';
import { summarizeWorkshop2SampleOrderStatus } from '@/lib/production/workshop2-sample-order-status';
import { evaluateWorkshop2SampleOrderGate } from '@/lib/production/workshop2-sample-order-gate';

describe('workshop2 wave12 — verification #14 POM opt-in', () => {
  it('policy default from env', () => {
    process.env.WORKSHOP2_POM_ON_CREATE_DEFAULT = 'true';
    expect(readWorkshop2PomOnCreatePolicyDefault()).toBe(true);
    delete process.env.WORKSHOP2_POM_ON_CREATE_DEFAULT;
  });
});

describe('workshop2 wave12 — verification #15 PUT dossier JWT', () => {
  it('production requires JWT actor', () => {
    process.env.NODE_ENV = 'production';
    expect(workshop2RequiresJwtActorForPut()).toBe(true);
    process.env.NODE_ENV = 'test';
  });

  it('JWT actor wins over spoofed header', () => {
    const req = {
      headers: { get: () => 'spoofed' },
    } as unknown as import('next/server').NextRequest;
    expect(
      resolveWorkshop2UpdatedBy(req, 'body', {
        actorId: 'jwt',
        actorLabel: 'JWT',
        roles: [],
      })
    ).toBe('JWT');
  });
});

describe('workshop2 wave12 — verification #24 version conflict', () => {
  it('server-wins on goldSampleStatus', () => {
    const server = {
      ...emptyWorkshop2DossierPhase1(),
      goldSampleStatus: { status: 'approved' as const },
    };
    const local = {
      ...emptyWorkshop2DossierPhase1(),
      goldSampleStatus: { status: 'pending' as const },
    };
    const merged = mergeWorkshop2DossierWithServerWinsPolicy(server, local);
    expect(merged.goldSampleStatus?.status).toBe('approved');
  });
});

describe('workshop2 wave12 — #56 sample order', () => {
  it('blocked without vault', () => {
    const gate = evaluateWorkshop2SampleOrderGate({
      dossier: emptyWorkshop2DossierPhase1(),
      vaultFileCount: 0,
      minTzOverallPct: 0,
    });
    const s = summarizeWorkshop2SampleOrderStatus({
      handoffInput: {
        dossier: emptyWorkshop2DossierPhase1(),
        vaultFileCount: 0,
        minTzOverallPct: 0,
      },
      activeOrderCount: 0,
      pgBacked: true,
      gateFromApi: gate,
    });
    expect(s.state).toBe('blocked');
    expect(s.gateAllowed).toBe(false);
  });
});

describe('workshop2 wave12 — #57 gold sample', () => {
  it('intake hint when not approved', () => {
    const s = summarizeWorkshop2GoldSampleStatus({
      gold: { status: 'pending' },
      hasActiveSampleOrder: true,
    });
    expect(s.approved).toBe(false);
    expect(s.hintRu).toMatch(/intake|утвердите/i);
  });
});

describe('workshop2 wave12 — #72 sample intake', () => {
  it('blocked without gold', () => {
    const s = summarizeWorkshop2SampleIntakeStatus(emptyWorkshop2DossierPhase1());
    expect(s.state).not.toBe('ready');
    expect(s.goldApproved).toBe(false);
  });
});

describe('workshop2 wave12 — #74 movement', () => {
  it('no order state', () => {
    const s = summarizeWorkshop2SampleMovementStatus({
      hasSampleOrder: false,
      movement: 'created',
      movementLogEntries: 0,
    });
    expect(s.state).toBe('no_order');
  });
});
