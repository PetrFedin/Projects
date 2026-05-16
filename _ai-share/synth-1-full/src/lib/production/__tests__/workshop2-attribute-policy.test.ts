import {
  resolveAttributeIdsForLeaf,
  resolvePhase1AttributeRows,
} from '@/lib/production/attribute-catalog';
import {
  W2_POLICY_SUPPRESSED_ATTR_IDS,
  workshop2LeafPolicyPackageEnabled,
} from '@/lib/production/workshop2-attribute-policy';
import { resolveRowsForFinalTzExport } from '@/lib/production/workshop2-final-tz-spec-export';
import { buildWorkshop2PassportAttributeGapReport } from '@/lib/production/workshop2-passport-gap-report';
import { emptyWorkshop2DossierPhase1 } from '@/lib/production/workshop2-phase1-dossier-storage';

const REDUNDANT_WHEN_MAT_COMPOSITION_LINKED = new Set([
  'fabricCompositionPresetOptions',
  'fabricCompositionDetailClassOptions',
]);

describe('workshop2-attribute-policy soft rollout', () => {
  test('leaf-specific suppression affects resolved attribute ids', () => {
    const leafId = 'catalog-apparel-g0-l3'; // Одежда › Верхняя одежда › Пуховики
    expect(workshop2LeafPolicyPackageEnabled({ leafId, audienceId: 'catalog' })).toBe(true);
    const ids = resolveAttributeIdsForLeaf(leafId, 1);
    expect(ids).not.toContain('draperyOptionsByCategory');
  });

  test('phase1 UI rows and final export rows stay aligned', () => {
    const leafId = 'catalog-apparel-g0-l3';
    const ids = resolveAttributeIdsForLeaf(leafId, 1);
    const linked = ids.includes('mat') && ids.includes('composition');
    const uiRows = resolvePhase1AttributeRows(leafId)
      .filter((r) => {
        const id = r.attribute.attributeId;
        if (linked && id === 'composition') return false;
        if (linked && REDUNDANT_WHEN_MAT_COMPOSITION_LINKED.has(id)) return false;
        return true;
      })
      .map((r) => r.attribute.attributeId)
      .sort();

    const exportRows = resolveRowsForFinalTzExport({
      articleSku: 'SKU-TEST',
      articleName: 'Test',
      pathLabel: 'Одежда › Верхняя одежда › Пуховики',
      l2Name: 'Верхняя одежда',
      tzPhase: '1',
      categoryLeafId: leafId,
      measurementsLeaf: null,
      preflightOk: false,
      preflightIssueCount: 0,
      sectionSignoffsFull: 0,
      gateLifecycleState: 'draft',
    })
      .map((r) => r.attribute.attributeId)
      .sort();

    expect(exportRows).toEqual(uiRows);
  });

  test('passport gap-report excludes suppressed attribute ids', () => {
    const leafId = 'catalog-apparel-g0-l3';
    const report = buildWorkshop2PassportAttributeGapReport(
      leafId,
      emptyWorkshop2DossierPhase1(),
      '1'
    );
    for (const line of report.linesOnLeaf) {
      expect(W2_POLICY_SUPPRESSED_ATTR_IDS.has(line.attributeId)).toBe(false);
    }
  });
});

