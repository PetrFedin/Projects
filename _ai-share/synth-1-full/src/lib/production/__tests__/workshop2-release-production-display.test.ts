/** @jest-environment node */

import {
  buildWorkshop2ReleaseProductionStripModel,
  labelWorkshop2SampleOrderStatusRu,
  resolveWorkshop2ReleaseActiveSampleOrder,
} from '@/lib/production/workshop2-release-production-display';
import {
  parseWorkshop2ReleaseSubParam,
  WORKSHOP2_RELEASE_SUB_TABS_ORDER,
  WORKSHOP2_RELEASE_SUB_TABS_OVERFLOW,
  WORKSHOP2_RELEASE_SUB_TABS_PRIMARY,
  isWorkshop2ReleaseSubTabInOverflow,
} from '@/lib/production/workshop2-release-sub-param';
import { isWorkshop2FactorySampleQueueItemOverdue } from '@/lib/production/workshop2-factory-sample-queue';
import { resolveWorkshop2GateCheckAction } from '@/lib/production/workshop2-gate-check-actions';
import { isWorkshop2SampleOrderMemoryStoreAllowed } from '@/lib/server/workshop2-sample-order-repository';
import { buildWorkshop2SampleOrderDemoBadgeRu } from '@/lib/production/workshop2-sample-order-file-mode-honesty';
import { workshop2ArticleHref } from '@/lib/production/workshop2-url';
import { emptyWorkshop2DossierPhase1 } from '@/lib/production/workshop2-phase1-dossier-storage';

describe('workshop2-release-production-display', () => {
  it('parseWorkshop2ReleaseSubParam defaults to route', () => {
    expect(parseWorkshop2ReleaseSubParam(null)).toBe('route');
    expect(parseWorkshop2ReleaseSubParam('operations')).toBe('operations');
    expect(parseWorkshop2ReleaseSubParam('logistics')).toBe('logistics');
    expect(parseWorkshop2ReleaseSubParam('timeline')).toBe('timeline');
    expect(parseWorkshop2ReleaseSubParam('bogus')).toBe('route');
  });

  it('sub-nav order includes cut floor logistics timeline', () => {
    expect(WORKSHOP2_RELEASE_SUB_TABS_ORDER).toEqual([
      'route',
      'operations',
      'order',
      'floor',
      'cut',
      'logistics',
      'timeline',
    ]);
    expect(WORKSHOP2_RELEASE_SUB_TABS_PRIMARY).toEqual(['route', 'operations', 'order']);
    expect(WORKSHOP2_RELEASE_SUB_TABS_OVERFLOW).toEqual(['floor', 'cut', 'logistics', 'timeline']);
    expect(isWorkshop2ReleaseSubTabInOverflow('floor')).toBe(true);
    expect(isWorkshop2ReleaseSubTabInOverflow('route')).toBe(false);
  });

  it('resolveWorkshop2ReleaseActiveSampleOrder prefers dossier id', () => {
    const orders = [
      {
        id: 'a',
        status: 'draft' as const,
        collectionId: 'c',
        articleId: '1',
        sizes: {},
        quantity: 1,
        createdAt: '',
        updatedAt: '',
      },
      {
        id: 'b',
        status: 'sent' as const,
        collectionId: 'c',
        articleId: '1',
        sizes: {},
        quantity: 1,
        createdAt: '',
        updatedAt: '',
      },
    ];
    expect(resolveWorkshop2ReleaseActiveSampleOrder(orders, 'b')?.id).toBe('b');
    expect(resolveWorkshop2ReleaseActiveSampleOrder(orders, undefined)?.id).toBe('a');
  });

  it('buildWorkshop2ReleaseProductionStripModel maps dossier fields and chip links', () => {
    const dossier = {
      ...emptyWorkshop2DossierPhase1(),
      articleSkuSnapshot: 'SKU-99',
      dossierVersion: 3,
      categorySketchCompliance: { patternPackVersion: 'PP-2' },
      sampleWorkflow: { activeSampleOrderId: 'ord-1' },
    };
    const model = buildWorkshop2ReleaseProductionStripModel({
      dossier,
      activeOrder: {
        id: 'ord-1',
        status: 'in_progress',
        movementStatus: 'in_transit',
        collectionId: 'c',
        articleId: '1',
        sizes: { M: 1 },
        quantity: 1,
        createdAt: '',
        updatedAt: '',
      },
      routingStepCount: 5,
      operationsCount: 2,
      collectionId: 'SS27',
      articleUrlSegment: 'demo-01',
    });
    expect(model.skuLabel).toBe('SKU-99');
    expect(model.dossierVersionLabel).toBe('v3');
    expect(model.patternPackVersionLabel).toBe('PP-2');
    expect(model.routingStepCount).toBe(5);
    expect(model.sampleOrderStatusLabel).toBe(labelWorkshop2SampleOrderStatusRu('in_progress'));
    expect(model.movementStatusLabel).toMatch(/пути/i);
    expect(model.chipLinks.fit.href).toContain('w2pane=fit');
    expect(model.chipLinks.qc.href).toContain('w2pane=qc');
    expect(model.chipLinks.plan.href).toContain('w2pane=plan');
    expect(model.developmentPathLabelRu).toMatch(/Critical path/i);
  });

  it('workshop2ArticleHref encodes release sub-tab deep link', () => {
    const href = workshop2ArticleHref('SS27', 'demo-01', {
      w2pane: 'release',
      w2relsub: 'logistics',
      hash: 'w2article-section-release',
    });
    expect(href).toContain('w2pane=release');
    expect(href).toContain('w2relsub=logistics');
    expect(href).toContain('#w2article-section-release');
  });
});

describe('workshop2 factory queue overdue', () => {
  it('flags overdue when due_date before today and not terminal', () => {
    expect(
      isWorkshop2FactorySampleQueueItemOverdue({
        dueDate: '2020-01-01',
        status: 'in_progress',
        now: new Date('2026-05-26'),
      })
    ).toBe(true);
    expect(
      isWorkshop2FactorySampleQueueItemOverdue({
        dueDate: '2020-01-01',
        status: 'received',
        now: new Date('2026-05-26'),
      })
    ).toBe(false);
  });
});

describe('workshop2 sample-order pg-first', () => {
  it('allows memory store outside production', () => {
    expect(
      isWorkshop2SampleOrderMemoryStoreAllowed({ NODE_ENV: 'test' } as NodeJS.ProcessEnv)
    ).toBe(true);
    expect(
      isWorkshop2SampleOrderMemoryStoreAllowed({ NODE_ENV: 'production' } as NodeJS.ProcessEnv)
    ).toBe(false);
  });

  it('demo badge only in dev file-store', () => {
    expect(
      buildWorkshop2SampleOrderDemoBadgeRu({
        storeMode: 'server_file_persist',
        env: { NODE_ENV: 'development' } as NodeJS.ProcessEnv,
      })
    ).toMatch(/Демо/);
    expect(
      buildWorkshop2SampleOrderDemoBadgeRu({
        storeMode: 'server_file_persist',
        env: { NODE_ENV: 'production' } as NodeJS.ProcessEnv,
      })
    ).toBeUndefined();
  });
});

describe('workshop2 gate check actions', () => {
  it('resolves vault blocker to vault pane', () => {
    const action = resolveWorkshop2GateCheckAction(
      { id: 'vault.files.min', messageRu: 'Vault', severity: 'blocker' },
      { collectionId: 'SS27', articleSegment: 'demo-01' }
    );
    expect(action?.href).toContain('w2pane=vault');
  });
});
