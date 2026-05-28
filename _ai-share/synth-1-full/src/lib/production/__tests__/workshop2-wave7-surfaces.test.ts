import { emptyWorkshop2DossierPhase1 } from '@/lib/production/workshop2-phase1-dossier-storage';
import { summarizeWorkshop2AssignmentSignoffChecklist } from '@/lib/production/workshop2-assignment-signoff-checklist';
import { summarizeWorkshop2FactoryHandoffBundleStatus } from '@/lib/production/workshop2-factory-handoff-bundle-status';
import { summarizeWorkshop2PomTableStatus } from '@/lib/production/workshop2-pom-table-status';
import { evaluateWorkshop2SketchCoverage } from '@/lib/production/workshop2-sketch-coverage';
import { summarizeWorkshop2SupplyBundleStatus } from '@/lib/production/workshop2-supply-bundle-status';
import { evaluateWorkshop2TechPackVisualGateSummary } from '@/lib/production/workshop2-tech-pack-visual-gate-summary';
import {
  cadParseDerivedMaterialLines,
  parseCadFile,
  type CadParseResult,
} from '@/lib/production/cad-parser';

describe('workshop2 wave7 — POM table status', () => {
  it('flags empty POM', () => {
    const s = summarizeWorkshop2PomTableStatus(emptyWorkshop2DossierPhase1());
    expect(s.state).toBe('empty');
    expect(s.hintRu).toMatch(/пуст/i);
  });

  it('ready when rows and per-size filled', () => {
    const d = {
      ...emptyWorkshop2DossierPhase1(),
      sampleBasePerSizeDimensions: { M: { Длина: '72' } },
      productionModel: {
        version: 1 as const,
        nodes: [],
        materialLines: [],
        trimLines: [],
        operations: [],
        measurements: [{ id: 'm1', code: 'POM-01', label: 'Длина', size: 'M' }],
      },
    };
    const s = summarizeWorkshop2PomTableStatus(d);
    expect(s.state).toBe('ready');
  });
});

describe('workshop2 wave7 — sketch coverage', () => {
  it('returns null without dossier', () => {
    expect(evaluateWorkshop2SketchCoverage(null, 'leaf')).toBeNull();
  });

  it('warns when no sketch image', () => {
    const s = evaluateWorkshop2SketchCoverage(emptyWorkshop2DossierPhase1(), 'leaf-1');
    expect(s?.state).toBe('empty');
    expect(s?.hintRu).toMatch(/изображения/i);
  });
});

describe('workshop2 wave7 — tech pack visual gate', () => {
  it('empty attachments hint', () => {
    const s = evaluateWorkshop2TechPackVisualGateSummary(emptyWorkshop2DossierPhase1());
    expect(s?.attachmentCount).toBe(0);
    expect(s?.hintRu).toMatch(/вложений/i);
  });
});

describe('workshop2 wave7 — assignment signoff checklist', () => {
  it('lists missing section signoffs', () => {
    const s = summarizeWorkshop2AssignmentSignoffChecklist(emptyWorkshop2DossierPhase1());
    expect(s?.sectionsSigned).toBe(0);
    expect(s?.hintRu).toMatch(/Не подписаны/i);
  });
});

describe('workshop2 wave7 — factory handoff bundle', () => {
  it('none when no handoffs', () => {
    const s = summarizeWorkshop2FactoryHandoffBundleStatus(emptyWorkshop2DossierPhase1());
    expect(s?.state).toBe('none');
  });

  it('dispatched when brand sent without factory ack', () => {
    const d = {
      ...emptyWorkshop2DossierPhase1(),
      techPackFactoryHandoffs: [
        {
          handoffId: 'h1',
          createdAt: '2026-05-19T10:00:00.000Z',
          createdBy: 'brand',
          channel: 'email' as const,
          status: 'sent' as const,
          brandDispatchedAt: '2026-05-19T11:00:00.000Z',
        },
      ],
    };
    const s = summarizeWorkshop2FactoryHandoffBundleStatus(d);
    expect(s?.state).toBe('dispatched');
    expect(s?.pendingAckCount).toBe(1);
  });
});

describe('workshop2 wave7 — supply bundle', () => {
  it('empty supply lines', () => {
    const s = summarizeWorkshop2SupplyBundleStatus({ supply: { lines: [] } });
    expect(s.state).toBe('empty');
  });

  it('detects unlinked line labels', () => {
    const s = summarizeWorkshop2SupplyBundleStatus({
      supply: {
        lines: [{ id: '1', label: 'Неизвестный материал XYZ', status: 'draft', qty: 10 }],
      },
      dossier: emptyWorkshop2DossierPhase1(),
    });
    expect(s.unlinkedLineCount).toBe(1);
    expect(s.hintRu).toMatch(/не сопоставлены/i);
  });
});

describe('workshop2 wave7 — cad parser derived lines', () => {
  it('cadParseDerivedMaterialLines reads derivedMaterialLines', () => {
    const result: CadParseResult = {
      patterns: [],
      seamLengthsTotalMeters: 1,
      derivedMaterialLines: [
        {
          id: 'a',
          nodeId: 'n',
          role: 'main',
          materialName: 'Ткань',
          unit: 'm2',
          consumption: 1,
        },
      ],
      mockMaterialLines: [],
      sourceKind: 'dxf',
    };
    expect(cadParseDerivedMaterialLines(result)).toHaveLength(1);
  });

  it('proprietary parse sets sourceKind proprietary_demo', async () => {
    const file = {
      name: 'model.zprj',
      text: async () => '',
    } as unknown as File;
    const parsed = await parseCadFile(file);
    expect(parsed.sourceKind).toBe('proprietary_demo');
    expect(parsed.derivedMaterialLines.length).toBeGreaterThan(0);
  });
});
