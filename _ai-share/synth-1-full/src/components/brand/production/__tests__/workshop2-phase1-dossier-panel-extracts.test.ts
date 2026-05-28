import type { AttributeCatalogAttribute } from '@/lib/production/attribute-catalog.types';
import type { ResolvedPhase1AttributeRow } from '@/lib/production/attribute-catalog';
import {
  w2ConstructionOmitTechPackForAside,
  w2ConstructionRowsDrapeThenPattern,
} from '../workshop2-phase1-dossier-panel-construction-layout';
import {
  formatSignoffWhoWhen,
  passportManualFieldLabelClass,
  workshopGroupSectionTitle,
} from '../workshop2-phase1-dossier-panel-signoff-format';
import { w2TzAttributeDisplayName } from '../workshop2-phase1-dossier-panel-w2-tz-labels';

function mkRow(attributeId: string, name?: string): ResolvedPhase1AttributeRow {
  return {
    attribute: { attributeId, name: name ?? attributeId } as AttributeCatalogAttribute,
    group: undefined,
  };
}

describe('workshop2-phase1-dossier-panel construction layout', () => {
  it('w2ConstructionOmitTechPackForAside removes techPackRef', () => {
    const rows = [mkRow('a'), mkRow('techPackRef'), mkRow('b')];
    const out = w2ConstructionOmitTechPackForAside(rows);
    expect(out.map((r) => r.attribute.attributeId)).toEqual(['a', 'b']);
  });

  it('w2ConstructionRowsDrapeThenPattern pairs drape then pattern when both present', () => {
    const rows = [
      mkRow('garmentLengthApparelOptions'),
      mkRow('patternOptionsByCategory'),
      mkRow('draperyOptionsByCategory'),
    ];
    const out = w2ConstructionRowsDrapeThenPattern(rows);
    const ids = out.map((r) => r.attribute.attributeId);
    expect(ids.indexOf('draperyOptionsByCategory')).toBeLessThan(
      ids.indexOf('patternOptionsByCategory')
    );
    expect(ids).toHaveLength(3);
  });

  it('w2ConstructionRowsDrapeThenPattern is noop without both', () => {
    const rows = [mkRow('a'), mkRow('b')];
    expect(w2ConstructionRowsDrapeThenPattern(rows)).toEqual(rows);
  });
});

describe('workshop2-phase1-dossier-panel signoff format', () => {
  it('formatSignoffWhoWhen formats with short date', () => {
    const s = formatSignoffWhoWhen({
      by: 'User',
      at: '2024-06-01T12:00:00.000Z',
      byOrganization: 'Org',
    });
    expect(s).toContain('User');
    expect(s).toContain('Org');
  });

  it('passportManualFieldLabelClass reflects filled state', () => {
    expect(passportManualFieldLabelClass(true)).toContain('text-text-primary');
    expect(passportManualFieldLabelClass(false)).toContain('text-red-600');
  });

  it('workshopGroupSectionTitle is identity', () => {
    expect(workshopGroupSectionTitle('Группа')).toBe('Группа');
  });
});

describe('workshop2-phase1-dossier-panel w2 tz labels', () => {
  it('w2TzAttributeDisplayName uses override map', () => {
    const attr = {
      attributeId: 'garmentLengthApparelOptions',
      name: 'X',
    } as AttributeCatalogAttribute;
    expect(w2TzAttributeDisplayName(attr)).toBe('Длина изделия');
  });

  it('w2TzAttributeDisplayName strips construction prefix noise', () => {
    const attr = {
      attributeId: 'customId',
      name: 'Конструкция · Ширина',
    } as AttributeCatalogAttribute;
    expect(w2TzAttributeDisplayName(attr)).not.toMatch(/^\s*Конструкция/);
  });
});
