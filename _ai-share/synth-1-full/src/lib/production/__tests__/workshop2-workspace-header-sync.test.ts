import { describe, expect, it } from 'vitest';
import {
  calculateDossierReadiness,
  resolveDossierLifecycleState,
} from '@/lib/production/dossier-readiness-engine';
import { emptyWorkshop2DossierPhase1 } from '@/lib/production/workshop2-phase1-dossier-storage';
import { resolveRndArticleStatus } from '@/lib/production/workshop2-rnd-state-machine';
import { buildWorkshop2WorkspaceHeaderSync } from '@/lib/production/workshop2-workspace-header-sync';

describe('resolveDossierLifecycleState', () => {
  it('preserves sent_to_production on persist enrichment', () => {
    const dossier = {
      ...emptyWorkshop2DossierPhase1(),
      lifecycleState: 'sent_to_production' as const,
    };
    const readiness = calculateDossierReadiness(dossier, null);
    expect(resolveDossierLifecycleState(dossier, readiness)).toBe('sent_to_production');
  });
});

describe('resolveRndArticleStatus + header sync', () => {
  it('maps lifecycle sent_to_production to HANDED_OFF when preflight allows', () => {
    const dossier = {
      ...emptyWorkshop2DossierPhase1(),
      lifecycleState: 'sent_to_production' as const,
    };
    expect(
      resolveRndArticleStatus(dossier, null, undefined, {
        lifecycle: 'sent_to_production',
        canSendToFactory: true,
      })
    ).toBe('HANDED_OFF');
  });

  it('does not show HANDED_OFF when sent but preflight blocks', () => {
    const dossier = {
      ...emptyWorkshop2DossierPhase1(),
      lifecycleState: 'sent_to_production' as const,
    };
    expect(
      resolveRndArticleStatus(dossier, null, undefined, {
        lifecycle: 'sent_to_production',
        canSendToFactory: false,
      })
    ).toBe('TZ_HANDOFF_READY');
  });

  it('header sync surfaces lifecycle and coherence hint', () => {
    const sync = buildWorkshop2WorkspaceHeaderSync({
      dossier: {
        ...emptyWorkshop2DossierPhase1(),
        lifecycleState: 'sent_to_production',
      },
      bundle: null,
      tzPhaseStep: '3',
      pulse: {
        tzOverallPct: 80,
        preflightScore: 40,
        scoreGap: 40,
        preflightBlockerCount: 2,
        preflightWarningCount: 0,
        canSendToFactory: false,
        state: 'at_risk',
      },
      plm: { pending: 0, awaitingAck: 0 },
    });
    expect(sync.lifecycle.label).toBe('Передано в производство');
    expect(sync.rnd.label).toContain('R&D:');
    expect(sync.coherenceHintRu).toMatch(/pre-flight/i);
    expect(sync.plm.tone).toBe('ok');
  });
});
