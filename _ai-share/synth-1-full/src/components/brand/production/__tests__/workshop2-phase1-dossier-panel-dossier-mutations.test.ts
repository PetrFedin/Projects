import { emptyWorkshop2DossierPhase1 } from '@/lib/production/workshop2-phase1-dossier-storage';
import {
  clampSampleBasePieceQtyToCap,
  sumSampleBasePieceQtyForPids,
  upsertCanonicalDual,
  upsertCanonicalMultiHandbookAndFree,
} from '../workshop2-phase1-dossier-panel-dossier-mutations';

describe('workshop2-phase1-dossier-panel-dossier-mutations', () => {
  it('sumSampleBasePieceQtyForPids sums positive finite ints for known pids', () => {
    expect(sumSampleBasePieceQtyForPids(undefined, new Set(['a']))).toBe(0);
    expect(sumSampleBasePieceQtyForPids({ a: 2, b: 3, c: 1.7 }, new Set(['a', 'c']))).toBe(3);
  });

  it('clampSampleBasePieceQtyToCap keeps largest rows first under cap', () => {
    expect(clampSampleBasePieceQtyToCap({ s: 5, m: 3, l: 2 }, 6)).toEqual({ s: 5, m: 1 });
  });

  it('upsertCanonicalMultiHandbookAndFree dedupes parameter ids', () => {
    const spy = jest.spyOn(globalThis.crypto, 'randomUUID').mockReturnValue('uuid-fixed');
    const base = emptyWorkshop2DossierPhase1();
    const next = upsertCanonicalMultiHandbookAndFree(
      base,
      'x',
      [{ parameterId: 'p1', displayLabel: 'A' }],
      ''
    );
    expect(next.assignments).toHaveLength(1);
    expect(next.assignments[0]?.values).toHaveLength(1);
    spy.mockRestore();
  });

  it('upsertCanonicalDual clears assignment when both empty', () => {
    const spy = jest.spyOn(globalThis.crypto, 'randomUUID').mockReturnValue('u');
    let d = emptyWorkshop2DossierPhase1();
    d = upsertCanonicalDual(d, 'color', { parameterId: 'p', displayLabel: 'L' }, '');
    expect(d.assignments.some((a) => a.attributeId === 'color')).toBe(true);
    d = upsertCanonicalDual(d, 'color', null, '');
    expect(d.assignments.some((a) => a.attributeId === 'color')).toBe(false);
    spy.mockRestore();
  });
});
