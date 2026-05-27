import { evaluateWorkshop2HandoffReadiness } from '@/lib/production/workshop2-handoff-readiness';
import type { Workshop2DossierPhase1 } from '@/lib/production/workshop2-dossier-phase1.types';

describe('workshop2-handoff-readiness', () => {
  const base: Workshop2DossierPhase1 = {
    schemaVersion: 1,
    assignments: [],
    categoryBindings: [{ categoryLeafId: 'catalog-apparel-g0-l0' }],
    sampleBasePerSizeDimensions: { M: { Длина: '100' } },
  };

  it('blocks when vault files below minimum', () => {
    const r = evaluateWorkshop2HandoffReadiness({
      dossier: base,
      categoryLeafId: 'catalog-apparel-g0-l0',
      vaultFileCount: 0,
      minVaultFiles: 1,
    });
    expect(r.ready).toBe(false);
    expect(r.checks.some((c) => c.id === 'vault.files.min')).toBe(true);
  });

  it('ready when vault and tz thresholds met', () => {
    const r = evaluateWorkshop2HandoffReadiness({
      dossier: base,
      categoryLeafId: 'catalog-apparel-g0-l0',
      vaultFileCount: 2,
      minVaultFiles: 1,
      minTzOverallPct: 0,
    });
    expect(r.ready).toBe(true);
    expect(r.vaultFileCount).toBe(2);
    expect(r.score10).toBeGreaterThanOrEqual(9);
  });
});
