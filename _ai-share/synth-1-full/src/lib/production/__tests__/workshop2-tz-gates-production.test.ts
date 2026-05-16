import { buildWorkshop2TzGateSnapshot } from '@/lib/production/workshop2-tz-gates';
import { emptyWorkshop2DossierPhase1 } from '@/lib/production/workshop2-phase1-dossier-storage';

describe('workshop2 tz gates production preflight integration', () => {
  test('includes production_preflight gate line', () => {
    const snap = buildWorkshop2TzGateSnapshot(emptyWorkshop2DossierPhase1());
    const line = snap.lines.find((l) => l.id === 'production_preflight');
    expect(line).toBeDefined();
    expect(line?.ok).toBe(false);
  });

  test('production preflight appears in blockers when dossier is empty', () => {
    const snap = buildWorkshop2TzGateSnapshot(emptyWorkshop2DossierPhase1());
    expect(snap.blockers.some((b) => b.id === 'production_preflight')).toBe(true);
  });
});
