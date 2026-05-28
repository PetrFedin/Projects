import { compositionLabelCareSymbolIdsAfterToggle } from '@/lib/production/workshop2-composition-label-constructor';
import {
  buildCompositionLabelTzSnapshot,
  compositionLabelDraftDisplayLines,
  compositionLabelDraftPreviewLines,
  compositionLabelSpecMissingSections,
} from '@/lib/production/workshop2-composition-label-from-tz';
import type { Workshop2DossierPhase1 } from '@/lib/production/workshop2-dossier-phase1.types';

function baseDossier(): Workshop2DossierPhase1 {
  return {
    schemaVersion: 1,
    assignments: [],
  };
}

describe('workshop2-composition-label-from-tz', () => {
  it('detects missing dimensions and physical material', () => {
    const needs = compositionLabelSpecMissingSections(baseDossier(), {
      includeFiberCompositionFromTz: false,
    });
    expect(needs).toContain('dimensions');
    expect(needs).toContain('physical');
  });

  it('builds fiber lines from mat handbook parameters', () => {
    const dossier: Workshop2DossierPhase1 = {
      ...baseDossier(),
      assignments: [
        {
          assignmentId: 'as-mat',
          kind: 'canonical',
          attributeId: 'mat',
          values: [
            {
              valueId: 'v1',
              valueSource: 'handbook_parameter',
              parameterId: 'p-wool',
              displayLabel: 'Шерсть 72%',
            },
            {
              valueId: 'v2',
              valueSource: 'handbook_parameter',
              parameterId: 'p-poly',
              displayLabel: 'Полиэстер 28%',
            },
          ],
        },
      ],
    };
    const snap = buildCompositionLabelTzSnapshot(dossier);
    expect(snap.hasMatData).toBe(true);
    expect(snap.fiberLines.join('|')).toContain('72%');
    const needs = compositionLabelSpecMissingSections(dossier, {
      labelWidthMm: '40',
      labelHeightMm: '15',
      physicalMaterial: 'satin',
      includeFiberCompositionFromTz: true,
    });
    expect(needs).not.toContain('fiber_tz_gap');
  });

  it('flags care gap when TZ empty and no manual care', () => {
    const needs = compositionLabelSpecMissingSections(baseDossier(), {
      labelWidthMm: '1',
      labelHeightMm: '1',
      physicalMaterial: 'nylon',
      includeCareSymbolsFromTz: true,
    });
    expect(needs).toContain('care_tz_gap');
  });

  it('care gap cleared by explicit care symbols', () => {
    const needs = compositionLabelSpecMissingSections(baseDossier(), {
      labelWidthMm: '1',
      labelHeightMm: '1',
      physicalMaterial: 'nylon',
      includeCareSymbolsFromTz: true,
      careSymbolIds: ['wash_30'],
    });
    expect(needs).not.toContain('care_tz_gap');
  });

  it('fiber tz gap cleared by constructor fiber rows', () => {
    const needs = compositionLabelSpecMissingSections(baseDossier(), {
      labelWidthMm: '1',
      labelHeightMm: '1',
      physicalMaterial: 'nylon',
      includeFiberCompositionFromTz: true,
      constructorFiberRows: [{ fiberId: 'cotton', percent: 100 }],
    });
    expect(needs).not.toContain('fiber_tz_gap');
  });

  it('flags fiber constructor sum when not 100%', () => {
    const needs = compositionLabelSpecMissingSections(baseDossier(), {
      labelWidthMm: '1',
      labelHeightMm: '1',
      physicalMaterial: 'nylon',
      constructorFiberRows: [{ fiberId: 'cotton', percent: 90 }],
    });
    expect(needs).toContain('fiber_constructor_sum');
  });

  it('care symbol toggle replaces others in same ISO group', () => {
    expect(compositionLabelCareSymbolIdsAfterToggle(['wash_30'], 'wash_40', true)).toEqual([
      'wash_40',
    ]);
    expect(
      compositionLabelCareSymbolIdsAfterToggle(['wash_30', 'bleach_no'], 'wash_hand', true)
    ).toEqual(['bleach_no', 'wash_hand']);
  });

  it('draft preview mentions supplement care text', () => {
    const lines = compositionLabelDraftPreviewLines(baseDossier(), {
      includeCareSymbolsFromTz: false,
      careInstructionsSupplement: 'Только химчистка',
    });
    expect(lines.some((l) => l.includes('Только химчистка'))).toBe(true);
  });

  it('draft display uses manual lines when draftTextManual is non-empty', () => {
    const auto = ['a', 'b'];
    expect(compositionLabelDraftDisplayLines({}, auto)).toEqual(auto);
    expect(compositionLabelDraftDisplayLines({ draftTextManual: '  x\ny  ' }, auto)).toEqual([
      '  x',
      'y  ',
    ]);
  });
});
