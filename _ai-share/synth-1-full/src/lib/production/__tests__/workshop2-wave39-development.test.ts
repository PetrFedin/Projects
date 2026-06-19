/**
 * Wave 39 — разработка: critical path snapshot, navigation hrefs, BOM resync prompt.
 */
import {
  buildWorkshop2ArticleDevelopmentState,
  evaluateWorkshop2ArticleDevelopmentPathGate,
  persistWorkshop2ArticleDevelopmentStateToDossier,
} from '@/lib/production/workshop2-article-development-state';
import { buildWorkshop2HandoffReadinessApiPayload } from '@/lib/production/workshop2-handoff-readiness-api';
import { evaluateWorkshop2BomResyncPrompt } from '@/lib/production/workshop2-bom-resync-prompt';
import { buildWorkshop2OperationalTzBridge } from '@/lib/production/workshop2-article-operational-tz-bridge';
import { buildWorkshop2RelatedSectionsBundle } from '@/lib/production/workshop2-related-sections';
import {
  parseWorkshop2ArticlePaneParam,
  workshop2ArticleHref,
  workshop2ArticleHrefQueryToSearchParams,
  WORKSHOP2_ARTICLE_PANE_PARAM,
} from '@/lib/production/workshop2-url';
import { emptyWorkshop2DossierPhase1 } from '@/lib/production/workshop2-phase1-dossier-storage';

const ALL_PANES = [
  'overview',
  'tz',
  'supply',
  'fit',
  'plan',
  'release',
  'qc',
  'stock',
  'vault',
] as const;

describe('workshop2 wave39 — development depth', () => {
  it('wave38 ceilings suite prerequisite: parse w2pane accepts all article tabs', () => {
    for (const pane of ALL_PANES) {
      expect(parseWorkshop2ArticlePaneParam(pane)).toBe(pane);
    }
    expect(parseWorkshop2ArticlePaneParam('invalid')).toBeNull();
    expect(parseWorkshop2ArticlePaneParam('documents')).toBe('vault');
    expect(parseWorkshop2ArticlePaneParam('assignment')).toBe('tz');
  });

  it('workshop2ArticleHref builds w2pane query for every tab', () => {
    for (const pane of ALL_PANES) {
      const href = workshop2ArticleHref('SS27', 'demo-ss27-01', { w2pane: pane });
      expect(href).toContain(`${WORKSHOP2_ARTICLE_PANE_PARAM}=${pane}`);
    }
    const sp = workshop2ArticleHrefQueryToSearchParams({ w2pane: 'fit', w2sec: 'construction' });
    expect(sp.get(WORKSHOP2_ARTICLE_PANE_PARAM)).toBe('fit');
  });

  it('related sections strip links use valid w2pane deep links', () => {
    const { links } = buildWorkshop2RelatedSectionsBundle({
      collectionId: 'SS27',
      articleUrlSegment: 'demo-ss27-01',
      activeTab: 'overview',
      dossier: emptyWorkshop2DossierPhase1(),
    });
    expect(links.length).toBeGreaterThan(5);
    for (const link of links) {
      if (link.href.includes('w2pane=')) {
        const pane = new URL(link.href, 'http://local').searchParams.get(
          WORKSHOP2_ARTICLE_PANE_PARAM
        );
        expect(parseWorkshop2ArticlePaneParam(pane)).not.toBeNull();
      }
    }
  });

  it('articleDevelopmentState: sample order without WMS reserve → warning gate', () => {
    process.env.WORKSHOP2_INTERNAL_WMS = 'true';
    const dossier = emptyWorkshop2DossierPhase1();
    const snap = buildWorkshop2ArticleDevelopmentState({
      dossier,
      actor: 'test',
      vaultFileCount: 2,
      latestSampleOrder: {
        id: 'so-1',
        status: 'active',
        movementStatus: 'created',
        movementLogLength: 1,
      },
    });
    expect(snap.sample.hasOrder).toBe(true);
    expect(snap.criticalPathReady).toBe(false);
    const withMirror = persistWorkshop2ArticleDevelopmentStateToDossier(dossier, snap);
    const gate = evaluateWorkshop2ArticleDevelopmentPathGate(withMirror);
    expect(gate?.id).toBe('devpath.wms.reserve_pending');
  });

  it('handoff-readiness API payload includes articleDevelopmentState', () => {
    const dossier = {
      ...emptyWorkshop2DossierPhase1(),
      sampleBasePerSizeDimensions: { M: { Длина: '100' } },
    };
    const payload = buildWorkshop2HandoffReadinessApiPayload({
      dossier,
      vaultFileCount: 2,
      latestSampleOrder: null,
    });
    expect(payload.articleDevelopmentState).toBeDefined();
    expect(payload.articleDevelopmentState.readiness.tzOverallPct).toBe(payload.tzOverallPct);
    expect(payload.gateScope).toBe('sample_order');
  });

  it('BOM resync prompt when BOM touched after supply sync', () => {
    const dossier = {
      ...emptyWorkshop2DossierPhase1(),
      updatedAt: '2026-05-20T12:00:00.000Z',
      supplyBundleMirror: {
        mirroredAt: '2026-05-19T10:00:00.000Z',
        lineCount: 3,
        linesWithQty: 2,
        unlinkedLineCount: 0,
        plannedPoQty: 1,
        bomMaterialLineCount: 3,
        state: 'partial',
        blockerSampleOrder: false,
        hintRu: '',
      },
    };
    const prompt = evaluateWorkshop2BomResyncPrompt(dossier, '2026-05-19T10:00:00.000Z');
    expect(prompt.shouldPrompt).toBe(true);
    expect(prompt.titleRu).toMatch(/BOM изменён/i);
  });

  it('operational TZ bridge uses readiness snapshot tzOverallPct', () => {
    const dossier = {
      ...emptyWorkshop2DossierPhase1(),
      assignments: [
        {
          attributeId: 'sku',
          values: [{ parameterId: 'sku', displayLabel: 'SKU-1' }],
        },
        {
          attributeId: 'name',
          values: [{ parameterId: 'name', displayLabel: 'Test' }],
        },
      ],
    };
    const bridge = buildWorkshop2OperationalTzBridge('supply', dossier, null);
    expect(bridge.overallLine).toMatch(/Готовность ТЗ \d+%/);
    expect(bridge.focusPctLabel).toMatch(/единый % ТЗ/);
  });
});
