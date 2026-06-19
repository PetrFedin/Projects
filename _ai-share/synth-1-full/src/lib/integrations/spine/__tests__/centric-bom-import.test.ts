import { detectCentricBomConflicts } from '../centric-bom-import.service';

describe('centric-bom-import', () => {
  it('detects missing and consumption mismatches', () => {
    const conflicts = detectCentricBomConflicts(
      [
        { materialName: 'Main fabric SS27', consumption: 2 },
        { materialName: 'Centric-only trim', consumption: 1 },
      ],
      [
        {
          id: '1',
          nodeId: 'n1',
          role: 'shell',
          materialName: 'Main fabric SS27',
          consumption: 1.5,
        },
        {
          id: '2',
          nodeId: 'n2',
          role: 'lining',
          materialName: 'Syntha-only lining',
          consumption: 1,
        },
      ]
    );
    expect(conflicts.some((c) => c.kind === 'missing_in_syntha')).toBe(true);
    expect(conflicts.some((c) => c.kind === 'missing_in_centric')).toBe(true);
    expect(conflicts.some((c) => c.kind === 'consumption_mismatch')).toBe(true);
  });
});
