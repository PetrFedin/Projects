import { emptyWorkshop2DossierPhase1 } from '@/lib/production/workshop2-phase1-dossier-storage';
import { getAqlPlan } from '@/lib/production/aql-standards';
import { summarizeWorkshop2AqlInspectionStatus } from '@/lib/production/workshop2-aql-inspection-status';
import { summarizeWorkshop2BomNodesStatus } from '@/lib/production/workshop2-bom-nodes-status';
import { summarizeWorkshop2GradingStatus } from '@/lib/production/workshop2-grading-status';
import { summarizeWorkshop2InspectorReportStatus } from '@/lib/production/workshop2-inspector-report-status';
import { summarizeWorkshop2QcPanelStatus } from '@/lib/production/workshop2-qc-panel-status';
import { summarizeWorkshop2SampleEconomicsRollupStatus } from '@/lib/production/workshop2-sample-economics-rollup-status';
import { ensureWorkshop2ProductionModel } from '@/lib/production/workshop2-production-model-from-dossier';

describe('workshop2 wave10 — BOM nodes', () => {
  it('empty without material lines', () => {
    const s = summarizeWorkshop2BomNodesStatus(emptyWorkshop2DossierPhase1());
    expect(s.state).toBe('empty');
    expect(s.hintRu).toMatch(/BOM пуст/i);
  });

  it('warns orphan nodeId', () => {
    const d = {
      ...emptyWorkshop2DossierPhase1(),
      productionModel: {
        ...ensureWorkshop2ProductionModel(emptyWorkshop2DossierPhase1()),
        materialLines: [
          {
            id: 'm1',
            nodeId: 'missing',
            role: 'main',
            materialName: 'Shell',
            yieldPerUnit: 1,
            isPrimary: true,
          },
        ],
      },
    };
    const s = summarizeWorkshop2BomNodesStatus(d);
    expect(s.orphanMaterialLineCount).toBe(1);
  });
});

describe('workshop2 wave10 — grading', () => {
  it('empty without rules', () => {
    const s = summarizeWorkshop2GradingStatus(emptyWorkshop2DossierPhase1());
    expect(s.state).toBe('empty');
  });
});

describe('workshop2 wave10 — sample economics rollup', () => {
  it('empty FOB hint', () => {
    const s = summarizeWorkshop2SampleEconomicsRollupStatus({
      dossier: emptyWorkshop2DossierPhase1(),
    });
    expect(s.estimatedFob).toBe(0);
    expect(s.hintRu).toMatch(/rollup = 0/i);
  });
});

describe('workshop2 wave10 — QC panel', () => {
  it('needs sample order for inspector', () => {
    const s = summarizeWorkshop2QcPanelStatus({
      batchCount: 1,
      pendingBatchCount: 1,
      hasSampleOrder: false,
      hasInspectorLink: false,
      supplierResolved: true,
    });
    expect(s.hintRu).toMatch(/sample-order/i);
  });
});

describe('workshop2 wave10 — inspector report', () => {
  it('error save state', () => {
    const s = summarizeWorkshop2InspectorReportStatus({
      totalItems: 5,
      checkedCount: 3,
      requiredDone: 2,
      requiredTotal: 3,
      saveState: 'error',
    });
    expect(s.state).toBe('at_risk');
    expect(s.hintRu).toMatch(/offline|PG/i);
  });
});

describe('workshop2 wave10 — AQL', () => {
  it('fail when critical', () => {
    const plan = getAqlPlan(1000, '2.5');
    const s = summarizeWorkshop2AqlInspectionStatus({
      batchCount: 1,
      orderQty: 1000,
      qtySource: 'batch',
      majorPlan: plan,
      criticalFound: 1,
      majorFound: 0,
      minorFound: 0,
      minorRejectLimit: plan.rejectLimit,
    });
    expect(s.isFail).toBe(true);
    expect(s.state).toBe('fail');
  });
});
