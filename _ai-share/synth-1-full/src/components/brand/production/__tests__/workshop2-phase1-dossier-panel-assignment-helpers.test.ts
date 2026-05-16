import type { AttributeCatalogAttribute } from '@/lib/production/attribute-catalog.types';
import type { Workshop2Phase1AttributeAssignment } from '@/lib/production/workshop2-dossier-phase1.types';
import {
  canonicalPhaseAssignmentFilled,
  partitionHandbookAndFree,
  partitionValues,
} from '../workshop2-phase1-dossier-panel-assignment-helpers';

describe('workshop2-phase1-dossier-panel-assignment-helpers', () => {
  it('partitionHandbookAndFree returns empty for undefined', () => {
    expect(partitionHandbookAndFree(undefined)).toEqual({ hbs: [], ft: undefined });
  });

  it('partitionHandbookAndFree splits handbook rows and free text', () => {
    const a: Workshop2Phase1AttributeAssignment = {
      assignmentId: '1',
      kind: 'canonical',
      attributeId: 'x',
      values: [
        {
          valueId: 'v1',
          valueSource: 'handbook_parameter',
          parameterId: 'p1',
          displayLabel: 'L1',
        },
        { valueId: 'v2', valueSource: 'free_text', text: 'note', displayLabel: 'note' },
      ],
    };
    const { hbs, ft } = partitionHandbookAndFree(a);
    expect(hbs).toHaveLength(1);
    expect(hbs[0]?.parameterId).toBe('p1');
    expect(ft?.text).toBe('note');
  });

  it('partitionValues exposes first handbook + free', () => {
    const a: Workshop2Phase1AttributeAssignment = {
      assignmentId: '1',
      kind: 'canonical',
      attributeId: 'x',
      values: [
        {
          valueId: 'v1',
          valueSource: 'handbook_parameter',
          parameterId: 'p1',
          displayLabel: 'L1',
        },
        { valueId: 'v2', valueSource: 'free_text', text: 't', displayLabel: 't' },
      ],
    };
    const { hb, ft } = partitionValues(a);
    expect(hb?.parameterId).toBe('p1');
    expect(ft?.text).toBe('t');
  });

  it('canonicalPhaseAssignmentFilled respects text-only attribute', () => {
    const attr = {
      type: 'text',
      parameters: [],
      allowMultipleDistinct: false,
      allowFreeText: true,
    } as AttributeCatalogAttribute;
    const filled: Workshop2Phase1AttributeAssignment = {
      assignmentId: '1',
      kind: 'canonical',
      attributeId: 't',
      values: [{ valueId: 'v', valueSource: 'free_text', text: 'ok', displayLabel: 'ok' }],
    };
    expect(canonicalPhaseAssignmentFilled(filled, attr)).toBe(true);
    expect(
      canonicalPhaseAssignmentFilled(
        { ...filled, values: [{ valueId: 'v', valueSource: 'free_text', text: '  ', displayLabel: '' }] },
        attr
      )
    ).toBe(false);
  });
});
