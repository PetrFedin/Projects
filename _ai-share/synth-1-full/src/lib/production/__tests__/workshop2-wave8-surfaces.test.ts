import { emptyWorkshop2DossierPhase1 } from '@/lib/production/workshop2-phase1-dossier-storage';
import { evaluateWorkshop2HandoffPdfExportReadiness } from '@/lib/production/workshop2-handoff-pdf-export-readiness';
import { summarizeWorkshop2LabDipStatus } from '@/lib/production/workshop2-lab-dip-status';
import { buildWorkshop2LabDipsFromDossier } from '@/lib/production/workshop2-lab-dip-from-dossier';
import { summarizeWorkshop2ReleaseRoutingStatus } from '@/lib/production/workshop2-release-routing-status';
import { summarizeWorkshop2StockBundleStatus } from '@/lib/production/workshop2-stock-bundle-status';
import {
  resolveWorkshop2TaMilestones,
  summarizeWorkshop2TaMilestonesStatus,
} from '@/lib/production/workshop2-ta-milestones-status';

describe('workshop2 wave8 — T&A milestones', () => {
  it('resolves empty when no dossier milestones', () => {
    const r = resolveWorkshop2TaMilestones({ dossier: emptyWorkshop2DossierPhase1() });
    expect(r.source).toBe('empty');
    expect(r.milestones).toHaveLength(0);
  });

  it('flags at_risk when delayed', () => {
    const s = summarizeWorkshop2TaMilestonesStatus({
      dossier: {
        ...emptyWorkshop2DossierPhase1(),
        taMilestones: [
          {
            id: 'm1',
            title: 'PO',
            targetDate: '2020-01-01',
            actualDate: null,
            status: 'delayed',
          },
        ],
      },
    });
    expect(s.state).toBe('at_risk');
  });
});

describe('workshop2 wave8 — lab dips', () => {
  it('empty colorway hint', () => {
    const s = summarizeWorkshop2LabDipStatus(emptyWorkshop2DossierPhase1());
    expect(s?.state).toBe('empty');
  });

  it('builds dips from dossier colorway', () => {
    const d = {
      ...emptyWorkshop2DossierPhase1(),
      assignments: [
        {
          kind: 'canonical' as const,
          attributeId: 'color',
          values: [{ displayLabel: 'Navy' }],
        },
      ],
      colorLabDipStatuses: { NAV: 'approved' },
    };
    const dips = buildWorkshop2LabDipsFromDossier(d);
    expect(dips.length).toBeGreaterThan(0);
  });
});

describe('workshop2 wave8 — release routing', () => {
  it('empty without routing', () => {
    const s = summarizeWorkshop2ReleaseRoutingStatus({
      dossier: emptyWorkshop2DossierPhase1(),
    });
    expect(s.routingSource).toBe('empty');
    expect(s.hintRu).toMatch(/routingSteps|маршрут/i);
  });
});

describe('workshop2 wave8 — stock bundle', () => {
  it('negative balance warning', () => {
    const s = summarizeWorkshop2StockBundleStatus({
      stock: {
        movements: [{ id: '1', kind: 'out', qty: 10, unitCostRub: 100, at: '2026-01-01' }],
      },
    });
    expect(s.negativeBalance).toBe(true);
    expect(s.hintRu).toMatch(/Отрицательный/i);
  });
});

describe('workshop2 wave8 — handoff PDF readiness', () => {
  it('blocked without sketch image', () => {
    const r = evaluateWorkshop2HandoffPdfExportReadiness({
      dossier: emptyWorkshop2DossierPhase1(),
    });
    expect(r.state).toBe('blocked');
    expect(r.hasSketchImage).toBe(false);
  });

  it('ready with canon sketch', () => {
    const r = evaluateWorkshop2HandoffPdfExportReadiness({
      dossier: {
        ...emptyWorkshop2DossierPhase1(),
        categorySketchImageDataUrl: 'data:image/png;base64,xx',
        designerIntent: { mood: 'x', bullets: ['a'] },
        assignments: [
          {
            kind: 'canonical' as const,
            attributeId: 'color',
            values: [{ displayLabel: 'Black' }],
          },
        ],
      },
    });
    expect(r.hasSketchImage).toBe(true);
  });
});
