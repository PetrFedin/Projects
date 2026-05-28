import { summarizeWorkshop2DossierFieldDiff } from '@/lib/production/workshop2-dossier-field-diff';
import type { Workshop2DossierPhase1 } from '@/lib/production/workshop2-dossier-phase1.types';

describe('workshop2-dossier-field-diff', () => {
  const base: Workshop2DossierPhase1 = {
    schemaVersion: 1,
    assignments: [
      {
        assignmentId: 'a1',
        kind: 'canonical',
        attributeId: 'mat',
        values: [{ valueId: 'v1', valueSource: 'free_text', displayLabel: 'A', text: 'A' }],
      },
    ],
    brandNotes: 'old',
  };

  it('counts changed assignment and scalar fields', () => {
    const remote: Workshop2DossierPhase1 = {
      ...base,
      brandNotes: 'new',
      assignments: [
        {
          assignmentId: 'a1',
          kind: 'canonical',
          attributeId: 'mat',
          values: [{ valueId: 'v1', valueSource: 'free_text', displayLabel: 'B', text: 'B' }],
        },
      ],
    };
    const diff = summarizeWorkshop2DossierFieldDiff(base, remote);
    expect(diff.changedFieldsCount).toBeGreaterThanOrEqual(2);
    expect(diff.summaryRu).toMatch(/пол/i);
  });

  it('returns zero when identical', () => {
    const diff = summarizeWorkshop2DossierFieldDiff(base, { ...base });
    expect(diff.changedFieldsCount).toBe(0);
  });
});
