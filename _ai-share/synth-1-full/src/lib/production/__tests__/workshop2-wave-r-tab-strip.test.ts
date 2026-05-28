/**
 * Wave R — tab strip SS27 panels без W2 console.error (static guard).
 */
import fs from 'fs';
import path from 'path';
import { workshop2MobileInspectorHref } from '@/lib/production/workshop2-mobile-inspector-checklist';
import { summarizeWorkshop2ArticleDevelopmentStateDisplay } from '@/lib/production/workshop2-article-development-state-display';
import { buildWorkshop2WorkspaceStatusChips } from '@/lib/production/workshop2-ux-phase1-helpers';
import { summarizeWorkshop2MainTabStripStatus } from '@/lib/production/workshop2-main-tab-strip-status';
import { W2_ARTICLE_MAIN_TAB_STRIP } from '@/lib/production/workshop-article-main-tab-labels';
import { summarizeWorkshop2WorkspaceHeaderPulseStatus } from '@/lib/production/workshop2-workspace-header-pulse-status';
import { buildWorkshop2FileStoreDemoDossier } from '@/lib/production/workshop2-file-store-demo-bootstrap';

const ROOT = path.join(process.cwd(), 'src/components/brand/production');

/** Вкладки tab strip: supply, fit, plan, release, qc, stock, vault (+ tz via workspace). */
const TAB_STRIP_PANEL_FILES = [
  'workshop2-article-workspace-supply-panel.tsx',
  'workshop2-article-workspace-fit-gold-panel.tsx',
  'workshop2-article-workspace-plan-po-panel.tsx',
  'workshop2-article-workspace-release-panel.tsx',
  'workshop2-article-workspace-qc-panel.tsx',
  'Workshop2SampleGoodsMovementPanel.tsx',
  'workshop2-qc-visual-inspection.tsx',
  'Workshop2ArticleWorkspaceTabPanels.tsx',
];

describe('workshop2 wave-r — tab strip hygiene', () => {
  it('operational tab panels avoid console.error (W2 runtime)', () => {
    for (const file of TAB_STRIP_PANEL_FILES) {
      const src = fs.readFileSync(path.join(ROOT, file), 'utf8');
      expect(src).not.toMatch(/console\.error\s*\(/);
    }
  });

  it('QC inspector deep link includes orderId in PWA path', () => {
    const href = workshop2MobileInspectorHref({
      collectionId: 'SS27',
      articleId: 'demo-ss27-01',
      orderId: 'order-r-deep-99',
    });
    expect(href).toContain('/inspector/order-r-deep-99');
    expect(href).toContain('c=SS27');
    expect(href).toContain('a=demo-ss27-01');
  });

  it('QC panel source wires inspector deep link testid', () => {
    const qc = fs.readFileSync(path.join(ROOT, 'workshop2-article-workspace-qc-panel.tsx'), 'utf8');
    expect(qc).toMatch(/data-testid="workshop2-qc-inspector-deep-link"/);
    expect(qc).toMatch(/workshop2MobileInspectorHref/);
  });

  it('workspace status chips include development-path when mirror present', () => {
    const dossier = buildWorkshop2FileStoreDemoDossier({
      collectionId: 'SS27',
      articleId: 'demo-ss27-01',
    })!;
    const dev = summarizeWorkshop2ArticleDevelopmentStateDisplay({ dossier });
    const chips = buildWorkshop2WorkspaceStatusChips({
      tabStrip: summarizeWorkshop2MainTabStripStatus({
        role: 'production:edit',
        visibleTabIds: W2_ARTICLE_MAIN_TAB_STRIP.map((t) => t.id),
      }),
      pulse: summarizeWorkshop2WorkspaceHeaderPulseStatus(null),
      handoff: null,
      development: dev,
    });
    expect(chips.some((c) => c.id === 'development-path')).toBe(true);
    expect(chips.find((c) => c.id === 'development-path')?.label).toBe(dev.labelRu);
  });

  it('hub flat hub renders development path chip testid', () => {
    const hub = fs.readFileSync(path.join(ROOT, 'Workshop2ArticleFlatHub.tsx'), 'utf8');
    expect(hub).toMatch(/workshop2-hub-development-path-chip/);
    expect(hub).toMatch(/summarizeWorkshop2ArticleDevelopmentStateDisplay/);
  });
});
