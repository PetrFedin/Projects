/**
 * @jest-environment node
 */
import {
  buildWorkshop2ExternalReadOnlyParams,
  filterPassportCriticalAuditLines,
  nineGapBacklogByArea,
  W2_NINE_GAP_CONSTRUCTION_ROADMAP,
  W2_NINE_GAP_MATERIAL_BOM_ROADMAP,
  W2_NINE_GAP_VISUAL_SKETCH_ROADMAP,
  formatBomSampleDeltaGuidePlainText,
  formatCostingHintsGuidePlainText,
  formatFactoryBomCsvHeaderRow,
  formatMaterialAlternativeStatusFlowPlainText,
  formatSketchPinLinkFieldsPlainText,
  getVisualHandoffTargetsForProfile,
  validateSketchPinRequiredLinks,
  W2_BOM_COSTING_HINT_FIELDS,
  W2_BOM_SAMPLE_DELTA_KIND_LABELS,
} from '@/lib/production/workshop2-dossier-nine-gap-infrastructure';
import {
  WORKSHOP2_ARTICLE_PANE_PARAM,
  WORKSHOP2_DOSSIER_SECTION_PARAM,
  WORKSHOP2_DOSSIER_VIEW_PARAM,
  WORKSHOP2_STEP_PARAM,
} from '@/lib/production/workshop2-url';
import { SKETCH_FLOOR_QUERY_PARAM } from '@/lib/production/sketch-floor-url';

describe('workshop2-dossier-nine-gap-infrastructure', () => {
  it('passport roadmap backlog order: audit, dense view, then read-only', () => {
    const ids = nineGapBacklogByArea('passport').map((x) => x.id);
    expect(ids).toEqual(['passport-audit', 'passport-dense', 'passport-readonly']);
  });

  it('visual+sketch roadmap: five items in spec order', () => {
    expect(W2_NINE_GAP_VISUAL_SKETCH_ROADMAP.map((x) => x.id)).toEqual([
      'sketch-links',
      'sketch-templates',
      'visual-canon',
      'visual-handoff',
      'sketch-print',
    ]);
    expect(W2_NINE_GAP_VISUAL_SKETCH_ROADMAP).toHaveLength(5);
  });

  it('material+bom roadmap: six items in spec order', () => {
    expect(W2_NINE_GAP_MATERIAL_BOM_ROADMAP.map((x) => x.id)).toEqual([
      'bom-delta',
      'bom-factory-export',
      'material-alt',
      'material-compliance',
      'bom-costing',
      'bom-norms',
    ]);
    expect(W2_NINE_GAP_MATERIAL_BOM_ROADMAP).toHaveLength(6);
  });

  it('construction roadmap: four items in spec order', () => {
    expect(W2_NINE_GAP_CONSTRUCTION_ROADMAP.map((x) => x.id)).toEqual([
      'construction-bom-measurements',
      'construction-sketch-trace',
      'construction-export',
      'construction-signoff',
    ]);
    expect(W2_NINE_GAP_CONSTRUCTION_ROADMAP).toHaveLength(4);
  });

  it('filterPassportCriticalAuditLines', () => {
    expect(filterPassportCriticalAuditLines(['Аудитория (сегмент)', 'Пусто'])).toEqual([
      'Аудитория (сегмент)',
    ]);
    expect(filterPassportCriticalAuditLines([])).toEqual([]);
  });

  it('buildWorkshop2ExternalReadOnlyParams', () => {
    const p = buildWorkshop2ExternalReadOnlyParams({
      view: 'factory',
      sketchFloor: true,
      w2step: '1',
      w2sec: 'visuals',
      w2pane: 'tz',
    });
    expect(p.get(WORKSHOP2_DOSSIER_VIEW_PARAM)).toBe('factory');
    expect(p.get(SKETCH_FLOOR_QUERY_PARAM)).toBe('1');
    expect(p.get(WORKSHOP2_STEP_PARAM)).toBe('1');
    expect(p.get(WORKSHOP2_DOSSIER_SECTION_PARAM)).toBe('visuals');
    expect(p.get(WORKSHOP2_ARTICLE_PANE_PARAM)).toBe('tz');
  });

  it('getVisualHandoffTargetsForProfile narrows tabs', () => {
    const qc = getVisualHandoffTargetsForProfile('qc');
    expect(qc.every((t) => t.tab === 'qc' || t.tab === 'fit')).toBe(true);
    const supply = getVisualHandoffTargetsForProfile('supply');
    expect(supply.some((t) => t.tab === 'supply')).toBe(true);
  });

  it('production handoff: посадка (fit) и ОТК (qc), без снабжения', () => {
    const p = getVisualHandoffTargetsForProfile('production');
    expect(p.map((t) => t.tab)).toEqual(['fit', 'qc']);
  });

  it('validateSketchPinRequiredLinks', () => {
    expect(
      validateSketchPinRequiredLinks(
        { annotationType: 'material', linkedBomLineRef: '', linkedMaterialNote: '' },
        'strict'
      ).ok
    ).toBe(false);
    expect(
      validateSketchPinRequiredLinks(
        { annotationType: 'material', linkedBomLineRef: 'L1', linkedMaterialNote: '' },
        'strict'
      ).ok
    ).toBe(true);
    expect(
      validateSketchPinRequiredLinks(
        { annotationType: 'qc', linkedQcZoneId: '', mesDefectCode: '' },
        'qc'
      ).ok
    ).toBe(false);
  });

  it('formatFactoryBomCsvHeaderRow', () => {
    expect(formatFactoryBomCsvHeaderRow(';')).toContain(';');
  });

  it('W2_BOM_SAMPLE_DELTA_KIND_LABELS covers kinds', () => {
    expect(W2_BOM_SAMPLE_DELTA_KIND_LABELS.tz_baseline).toContain('ТЗ');
    expect(Object.keys(W2_BOM_SAMPLE_DELTA_KIND_LABELS)).toHaveLength(3);
  });

  it('formatBomSampleDeltaGuidePlainText and formatMaterialAlternativeStatusFlowPlainText', () => {
    expect(formatBomSampleDeltaGuidePlainText()).toContain('tz_baseline');
    expect(formatMaterialAlternativeStatusFlowPlainText()).toContain('предложена');
  });

  it('sketch link fields and costing guide plain text', () => {
    expect(formatSketchPinLinkFieldsPlainText()).toContain('linkedBomLineRef');
    expect(W2_BOM_COSTING_HINT_FIELDS).toHaveLength(4);
    expect(formatCostingHintsGuidePlainText()).toContain('mergeCostingHintsByLineRef');
  });
});
