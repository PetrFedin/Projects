/**
 * @jest-environment node
 */
import {
  buildPassportHubModel,
  passportCatalogRowRequiredForTzPhase,
} from '@/lib/production/workshop2-passport-check';
import type { ResolvedPhase1AttributeRow } from '@/lib/production/attribute-catalog';
import type { Workshop2DossierPhase1 } from '@/lib/production/workshop2-dossier-phase1.types';
import type { HandbookCategoryLeaf } from '@/lib/production/category-handbook-leaves';

function row(id: string, r1: boolean, r2: boolean): ResolvedPhase1AttributeRow {
  return {
    attribute: {
      attributeId: id,
      groupId: 'g',
      name: id,
      type: 'text',
      sortOrder: 0,
      parameters: [],
      allowFreeText: true,
      allowMultipleDistinct: false,
      requiredForPhase1: r1,
      requiredForPhase2: r2,
    },
    group: { groupId: 'g', label: 'G' },
  } as ResolvedPhase1AttributeRow;
}

const leaf = { leafId: 'l1', pathLabel: 'A / B / C' } as HandbookCategoryLeaf;

const dossierBase = (): Workshop2DossierPhase1 =>
  ({
    assignments: [],
    passportProductionBrief: {
      articleCardOwnerName: 'Owner',
      plannedLaunchType: 'own_floor',
      targetSampleOrPilotDate: '2030-01-01',
      deadlineCriticality: 'flexible',
    },
    selectedAudienceId: 'aud',
  }) as Workshop2DossierPhase1;

describe('workshop2-passport-check', () => {
  it('passportCatalogRowRequiredForTzPhase uses phase2 flag on step 2', () => {
    const r = row('x', true, false);
    expect(passportCatalogRowRequiredForTzPhase(r, '1')).toBe(true);
    expect(passportCatalogRowRequiredForTzPhase(r, '2')).toBe(false);
    const r2 = row('y', false, true);
    expect(passportCatalogRowRequiredForTzPhase(r2, '1')).toBe(false);
    expect(passportCatalogRowRequiredForTzPhase(r2, '2')).toBe(true);
  });

  it('buildPassportHubModel applies phase2 required rows for tzPhase 2', () => {
    const d = dossierBase();
    d.assignments = [];
    const startRows = [row('onlyP2', false, true)];
    const m = buildPassportHubModel(d, 'SKU', 'Name', 'aud', leaf, startRows, [], '2');
    expect(m.gateItems.some((g) => g.id === 'pg-start-onlyP2')).toBe(true);
    const mOk = buildPassportHubModel(
      {
        ...d,
        assignments: [
          {
            assignmentId: 'a1',
            kind: 'canonical',
            attributeId: 'onlyP2',
            values: [
              {
                valueId: 'v1',
                valueSource: 'free_text',
                text: 'x',
                displayLabel: 'x',
              },
            ],
          },
        ],
      },
      'SKU',
      'Name',
      'aud',
      leaf,
      startRows,
      [],
      '2'
    );
    expect(mOk.gateItems.some((g) => g.id === 'pg-start-onlyP2')).toBe(false);
  });
});
