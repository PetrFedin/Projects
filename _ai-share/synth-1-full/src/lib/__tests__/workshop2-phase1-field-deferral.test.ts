/**
 * @jest-environment node
 */
import { emptyWorkshop2DossierPhase1 } from '@/lib/production/workshop2-phase1-dossier-storage';
import {
  applyWorkshop2DeferLaterToggle,
  defaultWorkshop2Phase1DeferredFieldKeys,
  isWorkshop2DeferLaterChecked,
} from '@/lib/production/workshop2-phase1-field-deferral';
import { W2_BRIEF_DEFER_TARGET_RETAIL_PRICE } from '@/components/brand/production/workshop2-phase1-dossier-panel-dossier-constants';
import { calculateWorkshopTzSectionCompletion } from '@/lib/production/workshop2-tz-section-readiness';
import type { ResolvedPhase1AttributeRow } from '@/lib/production/attribute-catalog';
import type { Workshop2DossierPhase1 } from '@/lib/production/workshop2-dossier-phase1.types';

function row(id: string, requiredForPhase1?: boolean): ResolvedPhase1AttributeRow {
  return {
    attribute: {
      attributeId: id,
      name: id,
      type: 'text',
      groupId: 'general',
      parameters: [],
      allowFreeText: true,
      requiredForPhase1,
    },
    group: { groupId: 'general', name: 'General' },
  } as ResolvedPhase1AttributeRow;
}

describe('workshop2-phase1-field-deferral', () => {
  it('seeds empty dossier with default deferred keys', () => {
    const d = emptyWorkshop2DossierPhase1();
    expect(d.deferredAttrIds).toEqual(defaultWorkshop2Phase1DeferredFieldKeys());
    expect(d.deferredAttrIds).toContain(W2_BRIEF_DEFER_TARGET_RETAIL_PRICE);
  });

  it('optional catalog row is later by default on phase 1', () => {
    const d = emptyWorkshop2DossierPhase1();
    expect(
      isWorkshop2DeferLaterChecked('styleOccasionOptions', d, { requiredForPhase1: false })
    ).toBe(true);
  });

  it('toggle off optional field adds fillNowAttrIds', () => {
    const base = emptyWorkshop2DossierPhase1();
    const next = applyWorkshop2DeferLaterToggle(base, 'styleOccasionOptions', {
      requiredForPhase1: false,
    });
    expect(
      isWorkshop2DeferLaterChecked('styleOccasionOptions', next, { requiredForPhase1: false })
    ).toBe(false);
    expect(next.fillNowAttrIds).toContain('styleOccasionOptions');
  });
});

describe('readiness with deferred optional fields', () => {
  const requiredSku = row('sku', true);
  const optionalNote = row('styleOccasionOptions', false);

  it('excludes optional rows from general denominator unless fillNow', () => {
    const withDefaults = emptyWorkshop2DossierPhase1();
    const fillNowDossier: Workshop2DossierPhase1 = {
      ...withDefaults,
      fillNowAttrIds: ['styleOccasionOptions'],
    };

    const rows = [requiredSku, optionalNote];
    const defaultReadiness = calculateWorkshopTzSectionCompletion('general', withDefaults, rows, {
      tzPhase: '1',
    });
    const fillNowReadiness = calculateWorkshopTzSectionCompletion('general', fillNowDossier, rows, {
      tzPhase: '1',
    });

    expect(fillNowReadiness.total).toBeGreaterThan(defaultReadiness.total);
    expect(defaultReadiness.total).toBe(3);
    expect(fillNowReadiness.total).toBe(4);
  });

  it('empty pricing fields do not reduce pct when default deferred keys present', () => {
    const dossier = emptyWorkshop2DossierPhase1();
    const rows = [requiredSku];
    const general = calculateWorkshopTzSectionCompletion('general', dossier, rows, {
      tzPhase: '1',
    });
    expect(general.total).toBe(3);
    expect(isWorkshop2DeferLaterChecked(W2_BRIEF_DEFER_TARGET_RETAIL_PRICE, dossier)).toBe(true);
  });
});
