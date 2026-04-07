/**
 * @jest-environment node
 */
import {
  calculateWorkshopTzSectionCompletion,
  getWorkshopTzSectionForAttribute,
} from '@/lib/production/workshop2-tz-section-readiness';
import type { Workshop2DossierPhase1 } from '@/lib/production/workshop2-dossier-phase1.types';

const emptyDossier = (): Workshop2DossierPhase1 =>
  ({
    assignments: [],
    categorySketchAnnotations: [],
    visualReferences: [],
  }) as Workshop2DossierPhase1;

describe('workshop2-tz-section-readiness', () => {
  it('maps mat to material section', () => {
    expect(getWorkshopTzSectionForAttribute('mat')).toBe('material');
  });

  it('phase 2+ with no material rows in set yields 100% (nothing to fill on this step)', () => {
    const d = emptyDossier();
    const r = calculateWorkshopTzSectionCompletion('material', d, [], { tzPhase: '2' });
    expect(r).toEqual({ done: 1, total: 1, pct: 100 });
  });

  it('phase 1 empty material rows still uses denominator 1', () => {
    const d = emptyDossier();
    const r = calculateWorkshopTzSectionCompletion('material', d, [], { tzPhase: '1' });
    expect(r).toEqual({ done: 0, total: 1, pct: 0 });
  });

  it('construction counts dimension gate on phase 2 even when catalog row set is empty', () => {
    const d = emptyDossier();
    const r = calculateWorkshopTzSectionCompletion('construction', d, [], { tzPhase: '2' });
    expect(r.done).toBe(0);
    expect(r.total).toBe(2);
    expect(r.pct).toBe(0);
  });
});
