/**
 * @jest-environment node
 */
import {
  COLLECTION_STEPS,
  getTransitiveDependsOnStepIds,
} from '@/lib/production/collection-steps-catalog';
import {
  PRODUCTION_WINDOW_CATALOG_STEP_ID,
  WORKSHOP2_CATALOG_STEP_ROUTING,
  getSeriesHandoffPrerequisiteStepIds,
  getWorkshop2PrimaryPaneForCatalogStep,
  workshop2ArticleHrefForCatalogStep,
} from '@/lib/production/workshop2-core1-stage-routing';

describe('workshop2-core1-stage-routing', () => {
  it('covers every catalog step exactly once', () => {
    expect(WORKSHOP2_CATALOG_STEP_ROUTING.length).toBe(COLLECTION_STEPS.length);
  });

  it('resolves deep link for tech-pack to tz pane', () => {
    const href = workshop2ArticleHrefForCatalogStep('DemoCol', 'line-1', 'tech-pack');
    expect(href).toContain('w2pane=tz');
  });

  it('returns null for collection-scoped brief step', () => {
    expect(workshop2ArticleHrefForCatalogStep('DemoCol', 'line-1', 'brief')).toBeNull();
    expect(getWorkshop2PrimaryPaneForCatalogStep('brief')).toBeNull();
  });

  it('production-window prerequisites include samples, costing, supply-path', () => {
    const pre = getSeriesHandoffPrerequisiteStepIds();
    expect(pre).toContain('samples');
    expect(pre).toContain('costing');
    expect(pre).toContain('supply-path');
  });

  it('matches transitive dependsOn from catalog', () => {
    const fromGraph = getTransitiveDependsOnStepIds(PRODUCTION_WINDOW_CATALOG_STEP_ID).sort();
    const fromExport = [...getSeriesHandoffPrerequisiteStepIds()].sort();
    expect(fromExport).toEqual(fromGraph);
  });
});
