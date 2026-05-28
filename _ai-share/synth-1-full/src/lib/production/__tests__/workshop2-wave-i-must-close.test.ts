/**
 * Wave I — PG-only hub, inspector queue honesty, banner tokens, persist toast UX.
 */
import fs from 'fs';
import path from 'path';
import {
  WORKSHOP2_SURFACE_BANNER_TONE_CLASS,
  WORKSHOP2_SURFACE_BANNER_INLINE_WARN_CLASS,
} from '@/lib/production/workshop2-surface-banner-tokens';
import {
  formatWorkshop2PersistToastTitle,
  formatWorkshop2PersistToastDescription,
} from '@/lib/production/workshop2-persist-toast-messages';
import { evaluateWorkshop2HubOnboardingBrowserFinish } from '@/lib/production/workshop2-hub-onboarding-fail-closed';
import { evaluateWorkshop2HubInventoryMirrorPersistOutcome } from '@/lib/production/workshop2-hub-pg-only-policy';
import { resolveWorkshop2InspectorSaveOutcome } from '@/lib/production/workshop2-inspector-pg-fail-closed';
import { summarizeWorkshop2FloorMesChip } from '@/lib/production/workshop2-floor-mes';
import { buildWorkshop2FitPanelMeta } from '@/lib/production/workshop2-ux-phase1-helpers';
import { summarizeWorkshop2FitSessionsStatus } from '@/lib/production/workshop2-fit-sessions-status';

const ROOT = path.join(process.cwd(), 'src/components/brand/production');

describe('workshop2 wave-i — must close', () => {
  it('banner tone tokens cover amber/rose/emerald', () => {
    expect(WORKSHOP2_SURFACE_BANNER_TONE_CLASS.amber).toContain('amber');
    expect(WORKSHOP2_SURFACE_BANNER_INLINE_WARN_CLASS).toContain('amber-50');
  });

  it('persist toast titles hide → PG from user-visible title', () => {
    expect(formatWorkshop2PersistToastTitle({ scopeLabelRu: 'Снабжение', ok: true })).toBe(
      'Снабжение сохранено'
    );
    expect(formatWorkshop2PersistToastTitle({ scopeLabelRu: 'Досье', ok: true })).toBe(
      'Сохранено в досье'
    );
    expect(
      formatWorkshop2PersistToastTitle({ scopeLabelRu: 'Inventory', ok: false, failClosed: true })
    ).toBe('PG недоступен');
    expect(
      formatWorkshop2PersistToastDescription({
        mirrorField: 'supplyBundleMirror',
        ok: true,
      })
    ).toContain('supplyBundleMirror');
  });

  it('hub onboarding finish offline — warning, no silent PG success', () => {
    const out = evaluateWorkshop2HubOnboardingBrowserFinish({ backendStatus: 'offline' });
    expect(out.warningRu).toMatch(/offline|localStorage/i);
    expect(out.blocksSampleUntilPgMirror).toBe(true);
  });

  it('inventory mirror fail-closed — no silentLocalSuccess on server', () => {
    const out = evaluateWorkshop2HubInventoryMirrorPersistOutcome({
      backendStatus: 'server',
      apiOk: false,
      apiReason: 'postgres_disabled',
    });
    expect(out.silentLocalSuccess).toBe(false);
    expect(out.httpStatusHint).toBe(503);
  });

  it('inspector queued offline — saveState error, not saved', () => {
    const out = resolveWorkshop2InspectorSaveOutcome({
      saveOk: false,
      status: 503,
      online: true,
      pendingQueueDepth: 0,
    });
    expect(out.kind).toBe('queued_offline');
    expect(out.saveState).toBe('error');
    expect(out.cacheLocally).toBe(true);
  });

  it('inspector 409 — no cache, no fake saved', () => {
    const out = resolveWorkshop2InspectorSaveOutcome({
      saveOk: false,
      status: 409,
      online: true,
    });
    expect(out.kind).toBe('pg_failed');
    expect(out.saveState).toBe('error');
    expect(out.cacheLocally).toBe(false);
  });

  it('fit panel meta accepts floor chip from PG mirror', () => {
    const floor = summarizeWorkshop2FloorMesChip({
      configured: true,
      pollState: 'synced',
    });
    const meta = buildWorkshop2FitPanelMeta({
      fitSessions: summarizeWorkshop2FitSessionsStatus({ sessions: [] }),
      floorChipLabelRu: floor.labelRu,
    });
    expect(meta.readiness).toContain('Floor: synced');
  });

  it('Workshop2ArticleSamplePanel on fit pane with floor chip badge', () => {
    const fit = fs.readFileSync(
      path.join(ROOT, 'workshop2-article-workspace-fit-gold-panel.tsx'),
      'utf8'
    );
    expect(fit).toMatch(/Workshop2ArticleSamplePanel/);
    expect(fit).toMatch(/floorChipLabelRu|summarizeWorkshop2FloorMesChip/);
    const sample = fs.readFileSync(path.join(ROOT, 'Workshop2ArticleSamplePanel.tsx'), 'utf8');
    expect(sample).toMatch(/floorMesChip\.labelRu/);
  });

  it('SurfaceStatusBanner imports shared tone tokens', () => {
    const src = fs.readFileSync(path.join(ROOT, 'Workshop2SurfaceStatusBanner.tsx'), 'utf8');
    expect(src).toMatch(/workshop2-surface-banner-tokens/);
  });

  it('SS27 operational panels use persist toast helper (no → PG in title)', () => {
    for (const file of [
      'workshop2-article-workspace-supply-panel.tsx',
      'workshop2-article-workspace-fit-gold-panel.tsx',
      'workshop2-article-workspace-plan-po-panel.tsx',
      'workshop2-article-workspace-release-panel.tsx',
    ]) {
      const src = fs.readFileSync(path.join(ROOT, file), 'utf8');
      expect(src).toMatch(/formatWorkshop2PersistToastTitle/);
      expect(src).not.toMatch(/title: res\.ok \? '[^']*→ PG/);
    }
  });
});
