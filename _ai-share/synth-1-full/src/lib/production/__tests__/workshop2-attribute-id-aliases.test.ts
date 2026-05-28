import {
  resolveAttributeIdsForLeaf,
  resolvePhase1AttributeRows,
} from '@/lib/production/attribute-catalog';
import {
  dossierHasCanonicalValueForAttributeId,
  resolveWorkshop2CatalogAttributeId,
  resolveWorkshop2CatalogAttributeIdsForInfoPickKey,
} from '@/lib/production/workshop2-attribute-id-aliases';
import { findOrphanCanonicalAssignments } from '@/lib/production/workshop2-dossier-orphan-assignments';
import { buildColorwayRowsFromDossier } from '@/lib/production/workshop2-colorway-palette';
import type { Workshop2DossierPhase1 } from '@/lib/production/workshop2-dossier-phase1.types';

describe('workshop2-attribute-id-aliases', () => {
  const footwearLeaf = 'catalog-shoes-g0-l0';

  it('footwear leaf includes mat in phase1 rows', () => {
    const ids = resolveAttributeIdsForLeaf(footwearLeaf, 1);
    expect(ids).toContain('mat');
    const rows = resolvePhase1AttributeRows(footwearLeaf);
    expect(rows.some((r) => r.attribute.attributeId === 'mat')).toBe(true);
  });

  it('resolves info-pick shoe upper material to mat', () => {
    expect(resolveWorkshop2CatalogAttributeId('shoeUpperMaterialOptions')).toBe('mat');
    expect(resolveWorkshop2CatalogAttributeId('materialOptions')).toBe('mat');
    expect(resolveWorkshop2CatalogAttributeId('heelHeightOptions')).toBe('shoe-heel-shape');
  });

  it('dossierHasCanonicalValueForAttributeId follows aliases', () => {
    const dossier: Workshop2DossierPhase1 = {
      schemaVersion: 1,
      assignments: [
        {
          assignmentId: 'a1',
          kind: 'canonical',
          attributeId: 'mat',
          values: [
            {
              valueId: 'v1',
              valueSource: 'free_text',
              displayLabel: 'Кожа',
              text: 'Кожа',
            },
          ],
        },
      ],
    };
    expect(dossierHasCanonicalValueForAttributeId(dossier, 'shoeUpperMaterialOptions')).toBe(true);
    expect(resolveWorkshop2CatalogAttributeIdsForInfoPickKey('shoeUpperMaterialOptions')).toContain(
      'mat'
    );
  });

  it('findOrphanCanonicalAssignments flags attrs outside new leaf', () => {
    const dossier: Workshop2DossierPhase1 = {
      schemaVersion: 1,
      assignments: [
        {
          assignmentId: 'coat-only',
          kind: 'canonical',
          attributeId: 'insulationLevelOptions',
          values: [
            {
              valueId: 'v1',
              valueSource: 'free_text',
              displayLabel: 'High',
              text: 'High',
            },
          ],
        },
      ],
    };
    const orphans = findOrphanCanonicalAssignments(dossier, footwearLeaf);
    expect(orphans.some((o) => o.attributeId === 'insulationLevelOptions')).toBe(true);
  });

  it('buildColorwayRowsFromDossier assigns palette codes', () => {
    const dossier: Workshop2DossierPhase1 = {
      schemaVersion: 1,
      assignments: [
        {
          assignmentId: 'c1',
          kind: 'canonical',
          attributeId: 'primaryColorFamilyOptions',
          values: [
            {
              valueId: 'v1',
              valueSource: 'free_text',
              displayLabel: 'Чёрный',
              text: 'Чёрный',
            },
          ],
        },
      ],
    };
    const rows = buildColorwayRowsFromDossier(dossier);
    expect(rows[0]?.paletteCode).toBe('BLK');
  });
});
