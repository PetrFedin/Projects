/**
 * M3/M9: transitions + factory queue + plan-fact unit tests.
 */
import {
  getNextWorkshop2SampleOrderStatus,
  listAllowedWorkshop2SampleOrderTransitions,
  validateWorkshop2SampleOrderTransition,
} from '@/lib/production/workshop2-sample-order-transitions';
import {
  parseWorkshop2FactorySampleQueueStatusFilter,
  isWorkshop2FactorySampleQueueItemOverdue,
} from '@/lib/production/workshop2-factory-sample-queue';
import { summarizeWorkshop2ReleaseOperationsPlanFact } from '@/lib/production/workshop2-release-operations-plan-fact';
import { buildWorkshop2ReleaseOperationsSyncAudit } from '@/lib/production/workshop2-release-operations-sync-audit';
import {
  getNextWorkshop2CutTicketStatus,
  validateWorkshop2CutTicketTransition,
} from '@/lib/production/workshop2-cut-ticket-status-machine';
import { resolveWorkshop2QcAqlOrderQtyFromSampleOrder } from '@/lib/production/workshop2-qc-sample-order-binding';
import {
  appendWorkshop2QcAutoChangeRequest,
  shouldAutoDraftWorkshop2QcChangeRequest,
} from '@/lib/production/workshop2-qc-defect-change-request';
import { buildWorkshop2FactoryTzBundlePreview } from '@/lib/production/workshop2-factory-tz-bundle-preview';
import { applyWorkshop2MesQcDefectToDossier } from '@/lib/production/workshop2-mes-qc-ingest';
import { syncWorkshop2QcPanelMirrorAfterInspectorPut } from '@/lib/production/workshop2-qc-panel-dossier-persist';
import { evaluateWorkshop2FitGoldApprovalGate } from '@/lib/production/workshop2-fit-gold-approval-gate';
import {
  applyWorkshop2TaMilestonesActualFromDomainEvents,
  workshop2TaMilestoneGanttProgressPct,
  type Workshop2TaPlanFactMilestoneRow,
} from '@/lib/production/workshop2-ta-plan-fact';
import {
  appendWorkshop2CutTicket,
  advanceWorkshop2CutTicketStatus,
} from '@/lib/production/workshop2-supply-ops-dossier-persist';
import { buildWorkshop2ProductionAnalyticsSnapshot } from '@/lib/production/workshop2-production-analytics';
import { buildWorkshop2ProductionSparklineSeries } from '@/lib/production/workshop2-production-sparkline';
import { emptyWorkshop2DossierPhase1 } from '@/lib/production/workshop2-phase1-dossier-storage';
import {
  clearWorkshop2SampleOrdersMemoryForTests,
  createWorkshop2SampleOrder,
  listWorkshop2SampleOrdersByContractorId,
  transitionWorkshop2SampleOrder,
} from '@/lib/server/workshop2-sample-order-repository';

describe('workshop2 sample order transitions', () => {
  it('allows happy-path draft → sent → in_progress', () => {
    expect(validateWorkshop2SampleOrderTransition('draft', 'sent').allowed).toBe(true);
    expect(validateWorkshop2SampleOrderTransition('sent', 'in_progress').allowed).toBe(true);
    expect(getNextWorkshop2SampleOrderStatus('draft')).toBe('sent');
  });

  it('rejects skip draft → received', () => {
    const t = validateWorkshop2SampleOrderTransition('draft', 'received');
    expect(t.allowed).toBe(false);
    expect(t.messageRu).toMatch(/запрещён/i);
  });

  it('lists allowed targets from in_progress', () => {
    expect(listAllowedWorkshop2SampleOrderTransitions('in_progress')).toEqual([
      'received',
      'cancelled',
    ]);
  });
});

describe('workshop2 factory sample queue helpers', () => {
  it('parses status filter csv', () => {
    expect(parseWorkshop2FactorySampleQueueStatusFilter('draft,sent')).toEqual(['draft', 'sent']);
    expect(parseWorkshop2FactorySampleQueueStatusFilter('invalid')).toBeUndefined();
  });

  it('detects overdue non-terminal orders', () => {
    expect(
      isWorkshop2FactorySampleQueueItemOverdue({
        dueDate: '2020-01-01',
        status: 'sent',
        now: new Date('2026-05-26'),
      })
    ).toBe(true);
    expect(
      isWorkshop2FactorySampleQueueItemOverdue({
        dueDate: '2020-01-01',
        status: 'approved',
        now: new Date('2026-05-26'),
      })
    ).toBe(false);
  });
});

describe('workshop2 release operations plan-fact', () => {
  it('computes progress and SASH totals', () => {
    const summary = summarizeWorkshop2ReleaseOperationsPlanFact([
      { id: '1', name: 'A', sash: 10, costPerUnit: 1, status: 'completed' },
      { id: '2', name: 'B', sash: 8, costPerUnit: 1, status: 'in_progress' },
      { id: '3', name: 'C', sash: 4, costPerUnit: 1, status: 'pending' },
    ]);
    expect(summary.completedCount).toBe(1);
    expect(summary.totalCount).toBe(3);
    expect(summary.progressPct).toBe(33);
    expect(summary.totalPlannedSash).toBe(22);
    expect(summary.totalActualSash).toBe(14);
  });
});

describe('workshop2 sample order repository transitions (memory)', () => {
  beforeEach(() => {
    clearWorkshop2SampleOrdersMemoryForTests();
  });

  it('transitionWorkshop2SampleOrder updates status and history', async () => {
    const order = await createWorkshop2SampleOrder({
      collectionId: 'SS27',
      articleId: 'demo-test-01',
      contractorId: 'fact-1',
      status: 'draft',
    });
    const next = await transitionWorkshop2SampleOrder({
      id: order.id,
      collectionId: 'SS27',
      articleId: 'demo-test-01',
      toStatus: 'sent',
      actor: 'unit-test',
      note: 'Отправлен в цех',
    });
    expect(next?.status).toBe('sent');
    expect(next?.statusHistory.at(-1)?.note).toBe('Отправлен в цех');
  });

  it('listWorkshop2SampleOrdersByContractorId filters by contractor', async () => {
    await createWorkshop2SampleOrder({
      collectionId: 'SS27',
      articleId: 'demo-test-02',
      contractorId: 'fact-1',
    });
    await createWorkshop2SampleOrder({
      collectionId: 'SS27',
      articleId: 'demo-test-03',
      contractorId: 'fact-2',
    });
    const queue = await listWorkshop2SampleOrdersByContractorId({ contractorId: 'fact-1' });
    expect(queue.every((o) => o.contractorId === 'fact-1')).toBe(true);
    expect(queue.length).toBeGreaterThanOrEqual(1);
  });
});

describe('workshop2 release operations sync audit', () => {
  it('merge keeps active and adds pending from TZ', () => {
    const audit = buildWorkshop2ReleaseOperationsSyncAudit({
      tzOperations: [
        { id: 't1', name: 'Сшив', sash: 5, operationType: 'sew' },
        { id: 't2', name: 'ОТК', sash: 2, operationType: 'qc' },
      ],
      releaseOperations: [{ id: 'r1', name: 'Сшив', sash: 5, status: 'in_progress' }],
      mode: 'merge',
    });
    expect(audit.summaryRu).toMatch(/Мягкое слияние/);
    expect(audit.logSummaries[0]).toMatch(/Smart Merge/);
  });
});

describe('workshop2 cut ticket status machine', () => {
  it('happy path draft → issued → cut', () => {
    expect(getNextWorkshop2CutTicketStatus('draft')).toBe('issued');
    expect(validateWorkshop2CutTicketTransition('issued', 'cut').allowed).toBe(true);
  });
});

describe('workshop2 cut ticket dossier persist', () => {
  it('append and advance cut ticket updates supplyOpsMirror', () => {
    const withTicket = appendWorkshop2CutTicket(emptyWorkshop2DossierPhase1(), {
      ticketNo: 'CT-99',
      qty: 2,
      status: 'draft',
    });
    expect(withTicket.cutTickets?.length).toBe(1);
    const advanced = advanceWorkshop2CutTicketStatus(withTicket, withTicket.cutTickets![0]!.id);
    expect(advanced.ok).toBe(true);
    expect(advanced.dossier.cutTickets?.[0]?.status).toBe('issued');
  });
});

describe('workshop2 ta gantt-lite progress', () => {
  it('overdue milestone gets high progress bar weight', () => {
    const row: Workshop2TaPlanFactMilestoneRow = {
      id: 'm1',
      title: 'PO',
      targetDate: '2020-01-01',
      actualDate: null,
      status: 'pending',
      isOverdue: true,
      isDelayed: false,
    };
    expect(workshop2TaMilestoneGanttProgressPct(row)).toBe(85);
  });
});

describe('workshop2 qc sample order binding', () => {
  it('uses quantity from active order', () => {
    const r = resolveWorkshop2QcAqlOrderQtyFromSampleOrder({
      id: 'o1',
      status: 'in_progress',
      quantity: 120,
    });
    expect(r.orderQty).toBe(120);
    expect(r.qtySource).toBe('sample_order');
  });
});

describe('workshop2 qc auto change request', () => {
  it('drafts CR for critical defects', () => {
    expect(shouldAutoDraftWorkshop2QcChangeRequest('critical')).toBe(true);
    const d = appendWorkshop2QcAutoChangeRequest(emptyWorkshop2DossierPhase1(), {
      defectCode: 'D1',
      severity: 'critical',
      source: 'mes',
    });
    expect(d.changeRequests?.length).toBe(1);
    expect(d.changeRequestMirror?.pendingCount).toBe(1);
  });
});

describe('workshop2 factory tz bundle preview', () => {
  it('builds excerpt from order + dossier', () => {
    const preview = buildWorkshop2FactoryTzBundlePreview({
      order: {
        id: 'ord-1',
        collectionId: 'SS27',
        articleId: 'art-1',
        status: 'sent',
        movementStatus: 'none',
        movementLog: [],
        statusHistory: [],
        quantity: 3,
        sizes: {},
        createdAt: '2026-01-01',
        updatedAt: '2026-01-02',
        nestingRequest: { version: 1 },
      },
      dossier: emptyWorkshop2DossierPhase1(),
      articleLabelRu: 'Пальто',
    });
    expect(preview.orderId).toBe('ord-1');
    expect(preview.articleLabelRu).toBe('Пальто');
  });
});

describe('workshop2 mes qc ingest dossier mirror', () => {
  it('increments qcPanelMirror batchCount on major defect', () => {
    const next = applyWorkshop2MesQcDefectToDossier({
      dossier: emptyWorkshop2DossierPhase1(),
      defect: { defectCode: 'STITCH', severity: 'major', defectLabel: 'Кривой шов' },
    });
    expect(next.qcPanelMirror?.batchCount).toBe(1);
    expect(next.qcPanelMirror?.failedBatchCount).toBe(1);
    expect(next.qcAqlInspectionLog?.length).toBe(1);
  });
});

describe('workshop2 inspector mirror after put', () => {
  it('syncWorkshop2QcPanelMirrorAfterInspectorPut sets hasInspectorLink', () => {
    const next = syncWorkshop2QcPanelMirrorAfterInspectorPut({
      dossier: emptyWorkshop2DossierPhase1(),
      sampleOrderId: 'so-1',
    });
    expect(next.qcPanelMirror?.hasInspectorLink).toBe(true);
    expect(next.qcPanelMirror?.hasSampleOrder).toBe(true);
    expect(next.qcPanelMirror?.activeSampleOrderId).toBe('so-1');
  });
});

describe('workshop2 fit gold approval gate chain', () => {
  it('blocks gold without approved session and inspector mirror offline', () => {
    const dossier = {
      ...emptyWorkshop2DossierPhase1(),
      inspectorReportMirror: {
        mirroredAt: new Date().toISOString(),
        sampleOrderId: 'so-1',
        totalItems: 5,
        checkedCount: 5,
        requiredDone: 5,
        requiredTotal: 5,
        pgSynced: false,
        offlineOnly: true,
        reportState: 'at_risk' as const,
        blockerSampleOrder: true,
        blockerHandoff: true,
        hintRu: 'offline',
      },
    };
    const gate = evaluateWorkshop2FitGoldApprovalGate({
      dossier,
      fitGold: {
        goldApproved: false,
        sessions: [
          {
            id: 's1',
            sampleType: 'proto',
            status: 'pending',
            dateStr: '2026-05-01',
            measurementsDelta: {},
            comments: [],
          },
        ],
      },
      hasActiveSampleOrder: true,
    });
    expect(gate.allowed).toBe(false);
    expect(gate.checks.some((c) => c.id === 'fit.gold.no_approved_session')).toBe(true);
  });
});

describe('workshop2 ta plan-fact from domain events', () => {
  it('sets actualDate on PO milestone when sample sent', () => {
    const milestones = [
      {
        id: 'm1',
        title: 'Размещение заказа (PO)',
        targetDate: '2026-06-01',
        actualDate: null as string | null,
        status: 'pending' as const,
      },
    ];
    const updated = applyWorkshop2TaMilestonesActualFromDomainEvents({
      milestones,
      events: [
        {
          id: 'e1',
          type: 'sample_order.status_changed',
          collectionId: 'SS27',
          articleId: 'a1',
          payload: { status: 'sent' },
          createdAt: '2026-05-20T10:00:00.000Z',
        },
      ],
    });
    expect(updated[0]?.actualDate).toBe('2026-05-20');
  });
});

describe('workshop2 production analytics snapshot', () => {
  it('computes rework rate from qc defects', () => {
    const snap = buildWorkshop2ProductionAnalyticsSnapshot({
      collectionId: 'SS27',
      articleId: 'a1',
      qcDefects: [
        { defectCode: 'A', severity: 'major', source: 'mes', createdAt: '2026-05-01T00:00:00Z' },
        { defectCode: 'B', severity: 'minor', source: 'mes', createdAt: '2026-05-02T00:00:00Z' },
      ],
    });
    expect(snap.defectCount).toBe(2);
    expect(snap.reworkRate).toBe(0.5);
  });
});

describe('workshop2 release operations actualSash field', () => {
  it('uses explicit actualSash when status completed', () => {
    const summary = summarizeWorkshop2ReleaseOperationsPlanFact([
      { id: '1', name: 'A', sash: 10, costPerUnit: 1, status: 'completed', actualSash: 8.5 },
    ]);
    expect(summary.totalActualSash).toBe(8.5);
    expect(summary.rows[0]?.actualSash).toBe(8.5);
  });
});

describe('workshop2 production sparkline helpers', () => {
  it('builds 7-day series from daily snapshots', () => {
    const series = buildWorkshop2ProductionSparklineSeries({
      dailySnapshots: [
        {
          operationsProgressPct: 10,
          collectionId: 'c',
          articleId: 'a',
          period: { from: null, to: null },
          sampleLeadTimeDays: null,
          reworkRate: null,
          defectCount: 0,
          majorCriticalCount: 0,
          domainEventCount: 0,
          routingVariancePct: null,
          economicsPlanRub: null,
          economicsActualProxyRub: null,
          economicsVariancePct: null,
          hintRu: '',
          computedAt: '',
        },
        {
          operationsProgressPct: 40,
          collectionId: 'c',
          articleId: 'a',
          period: { from: null, to: null },
          sampleLeadTimeDays: null,
          reworkRate: null,
          defectCount: 0,
          majorCriticalCount: 0,
          domainEventCount: 0,
          routingVariancePct: null,
          economicsPlanRub: null,
          economicsActualProxyRub: null,
          economicsVariancePct: null,
          hintRu: '',
          computedAt: '',
        },
        {
          operationsProgressPct: 70,
          collectionId: 'c',
          articleId: 'a',
          period: { from: null, to: null },
          sampleLeadTimeDays: null,
          reworkRate: null,
          defectCount: 0,
          majorCriticalCount: 0,
          domainEventCount: 0,
          routingVariancePct: null,
          economicsPlanRub: null,
          economicsActualProxyRub: null,
          economicsVariancePct: null,
          hintRu: '',
          computedAt: '',
        },
      ],
      fallbackSnapshot: { operationsProgressPct: 0 },
    });
    expect(series).toEqual([70, 40, 10]);
  });
});

describe('workshop2 sample order single writer guard', () => {
  it('createWorkshop2SampleOrder импортируется только из API route и tests', () => {
    const fs = require('node:fs');
    const path = require('node:path');
    const root = path.join(__dirname, '../../../..');
    const allowed = new Set([
      path.join(root, 'src/lib/server/workshop2-sample-order-repository.ts'),
      path.join(
        root,
        'src/app/api/workshop2/articles/[collectionId]/[articleId]/sample-order/route.ts'
      ),
    ]);
    const violations: string[] = [];

    function walk(dir: string): void {
      for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
        const full = path.join(dir, entry.name);
        if (entry.isDirectory()) {
          if (entry.name === 'node_modules' || entry.name === '.next') continue;
          walk(full);
          continue;
        }
        if (!/\.(ts|tsx)$/.test(entry.name)) continue;
        if (full.includes('__tests__')) continue;
        if (allowed.has(full)) continue;
        const text = fs.readFileSync(full, 'utf8');
        if (/\bcreateWorkshop2SampleOrder\b(?!Api)/.test(text)) {
          violations.push(path.relative(root, full));
        }
      }
    }

    walk(path.join(root, 'src'));
    expect(violations).toEqual([]);
  });
});
