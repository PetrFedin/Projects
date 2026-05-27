/**
 * P1 integration: TZ ZIP 409 copy, handoff-readiness API parity with sample-order gate.
 */
import { emptyWorkshop2DossierPhase1 } from '@/lib/production/workshop2-phase1-dossier-storage';
import {
  buildWorkshop2HandoffReadinessApiPayload,
  WORKSHOP2_HANDOFF_READINESS_GATE_SCOPE,
} from '@/lib/production/workshop2-handoff-readiness-api';
import { evaluateWorkshop2SampleOrderGate } from '@/lib/production/workshop2-sample-order-gate';
import { describeWorkshop2TzExportBundleFailure } from '@/lib/production/workshop2-tz-export-api-client';
import { formatWorkshop2GateChecksForUi } from '@/lib/production/workshop2-api-gate-messages';

describe('workshop2 P1 — handoff-readiness API parity', () => {
  it('uses sample_order gate scope and matches evaluateWorkshop2SampleOrderGate', () => {
    const dossier = emptyWorkshop2DossierPhase1();
    const gate = evaluateWorkshop2SampleOrderGate({ dossier, vaultFileCount: 0 });
    const payload = buildWorkshop2HandoffReadinessApiPayload({
      dossier,
      vaultFileCount: 0,
    });
    expect(payload.gateScope).toBe(WORKSHOP2_HANDOFF_READINESS_GATE_SCOPE);
    expect(payload.allowed).toBe(gate.allowed);
    expect(payload.ready).toBe(gate.readiness.ready);
    expect(payload.checks.length).toBeGreaterThanOrEqual(
      gate.readiness.checks.filter((c) => c.id === 'vault.files.min').length
    );
  });
});

describe('workshop2 P1 — TZ export failure copy', () => {
  it('formats export_tz_bundle_blocked checks for toast', () => {
    const msg = describeWorkshop2TzExportBundleFailure({
      ok: false,
      status: 409,
      checks: [{ severity: 'blocker', messageRu: 'Нет tech pack' }],
    });
    expect(msg).toBe('Нет tech pack');
  });

  it('reuses gate message formatter', () => {
    expect(
      formatWorkshop2GateChecksForUi(
        [{ severity: 'blocker', messageRu: 'Скетч не готов' }],
        'fallback'
      )
    ).toBe('Скетч не готов');
  });
});
