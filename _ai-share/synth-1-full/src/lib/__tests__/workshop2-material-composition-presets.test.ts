/**
 * @jest-environment node
 */
import {
  fetchMaterialCompositionPresetsCatalog,
  presetMatchesMaterialCompositionContext,
  resolveMaterialCompositionPresets,
  WORKSHOP2_MATERIAL_COMPOSITION_PRESETS_CATALOG,
  type Workshop2MaterialCompositionPreset,
} from '@/lib/production/workshop2-material-composition-presets';

describe('workshop2-material-composition-presets', () => {
  it('catalog loads from JSON', () => {
    expect(WORKSHOP2_MATERIAL_COMPOSITION_PRESETS_CATALOG.length).toBeGreaterThan(0);
    expect(WORKSHOP2_MATERIAL_COMPOSITION_PRESETS_CATALOG.some((p) => p.id === 'coat-wool')).toBe(
      true
    );
  });

  it('fetchMaterialCompositionPresetsCatalog resolves without network', async () => {
    const rows = await fetchMaterialCompositionPresetsCatalog('catalog-apparel-g0-l0');
    expect(rows.length).toBe(WORKSHOP2_MATERIAL_COMPOSITION_PRESETS_CATALOG.length);
  });

  it('L3 Пальто: шерстяное + общие по L2, без пуховика', () => {
    const ctx = { leafId: 'catalog-apparel-g0-l0', l2Name: 'Верхняя одежда', l3Name: 'Пальто' };
    const r = resolveMaterialCompositionPresets(ctx);
    const ids = r.map((p) => p.id);
    expect(ids).toContain('coat-wool');
    expect(ids).toContain('outer-softshell');
    expect(ids).not.toContain('puffer-nylon');
  });

  it('L3 Пуховики: нейлон + общие, без пальтового', () => {
    const ctx = { leafId: 'catalog-apparel-g0-l3', l2Name: 'Верхняя одежда', l3Name: 'Пуховики' };
    const r = resolveMaterialCompositionPresets(ctx);
    const ids = r.map((p) => p.id);
    expect(ids).toContain('puffer-nylon');
    expect(ids).toContain('outer-fleece-poly');
    expect(ids).not.toContain('coat-wool');
  });

  it('leafIdMatch beats L3 when present', () => {
    const narrow: Workshop2MaterialCompositionPreset = {
      id: 'leaf-only',
      label: 'Только лист',
      l2Match: ['Верхняя одежда'],
      leafIdMatch: ['x-leaf-1'],
      rows: [{ parameterId: 'cotton', label: 'Хлопок', pct: 100 }],
    };
    const catalog = [...WORKSHOP2_MATERIAL_COMPOSITION_PRESETS_CATALOG, narrow];
    const r = resolveMaterialCompositionPresets(
      { leafId: 'x-leaf-1', l2Name: 'Верхняя одежда', l3Name: 'Пуховики' },
      catalog
    );
    expect(r.some((p) => p.id === 'leaf-only')).toBe(true);
    expect(
      presetMatchesMaterialCompositionContext(narrow, {
        leafId: 'x-leaf-1',
        l2Name: 'Верхняя одежда',
      })
    ).toBe(true);
  });
});
