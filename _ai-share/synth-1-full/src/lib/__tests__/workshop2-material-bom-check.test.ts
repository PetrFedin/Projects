import {
  buildMaterialBomHubModel,
  buildMaterialCategoryNotes,
} from '@/lib/production/workshop2-material-bom-check';
import { W2_MATERIAL_SUBPAGE_ANCHORS } from '@/lib/production/workshop2-material-bom-anchors';

describe('workshop2-material-bom-check', () => {
  it('gate-mat points to mat anchor', () => {
    const m = buildMaterialBomHubModel({
      matRequired: true,
      matHandbookLineCount: 0,
      linkedMatComposition: false,
      compositionPctSum: null,
      materialSectionPct: 100,
    });
    expect(m.gateItems.some((g) => g.id === 'gate-mat')).toBe(true);
    const g = m.gateItems.find((x) => x.id === 'gate-mat');
    expect(g?.anchorId).toBe(W2_MATERIAL_SUBPAGE_ANCHORS.mat);
  });

  it('gate-comp points to composition anchor', () => {
    const m = buildMaterialBomHubModel({
      matRequired: false,
      matHandbookLineCount: 1,
      linkedMatComposition: true,
      compositionPctSum: 90,
      materialSectionPct: 100,
    });
    const g = m.gateItems.find((x) => x.id === 'gate-comp');
    expect(g?.anchorId).toBe(W2_MATERIAL_SUBPAGE_ANCHORS.composition);
  });

  it('gate-section points to catalog anchor', () => {
    const m = buildMaterialBomHubModel({
      matRequired: false,
      matHandbookLineCount: 1,
      linkedMatComposition: false,
      compositionPctSum: null,
      materialSectionPct: 40,
    });
    const g = m.gateItems.find((x) => x.id === 'gate-section');
    expect(g?.anchorId).toBe(W2_MATERIAL_SUBPAGE_ANCHORS.catalog);
  });

  it('buildMaterialCategoryNotes includes tail for unknown L2', () => {
    const n = buildMaterialCategoryNotes('Тестовая категория');
    expect(n.length).toBeGreaterThanOrEqual(2);
    expect(n.some((l) => l.includes('BOM-ref'))).toBe(true);
  });
});
