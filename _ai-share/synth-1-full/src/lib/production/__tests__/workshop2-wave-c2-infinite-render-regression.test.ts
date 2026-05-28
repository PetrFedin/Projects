/**
 * Block C — infinite render regression (P1-6) + articleDevelopmentState wiring.
 */
import { areWorkshop2DossierPersistBodiesEqual } from '@/lib/production/workshop2-dossier-activity-log';
import { emptyWorkshop2DossierPhase1 } from '@/lib/production/workshop2-phase1-dossier-storage';
import {
  buildWorkshop2ArticleDevelopmentState,
  persistWorkshop2ArticleDevelopmentStateToDossier,
} from '@/lib/production/workshop2-article-development-state';
import { buildWorkshop2HandoffReadinessApiPayload } from '@/lib/production/workshop2-handoff-readiness-api';

describe('workshop2 wave-c2 — infinite render regression', () => {
  it('identical persist bodies are equal (guard skips setState)', () => {
    const a = emptyWorkshop2DossierPhase1();
    const b = { ...emptyWorkshop2DossierPhase1() };
    expect(areWorkshop2DossierPersistBodiesEqual(a, b)).toBe(true);
  });

  it('tzActionLog diff does not affect persist body equality', () => {
    const a = {
      ...emptyWorkshop2DossierPhase1(),
      tzActionLog: [{ at: '1', message: 'x' }],
    };
    const b = {
      ...emptyWorkshop2DossierPhase1(),
      tzActionLog: [{ at: '2', message: 'y' }],
    };
    expect(areWorkshop2DossierPersistBodiesEqual(a, b)).toBe(true);
  });

  it('meaningful assignment change breaks equality', () => {
    const a = emptyWorkshop2DossierPhase1();
    const b = {
      ...emptyWorkshop2DossierPhase1(),
      assignments: [
        {
          attributeId: 'sku',
          values: [{ parameterId: 'sku', displayLabel: 'SKU-1' }],
        },
      ],
    };
    expect(areWorkshop2DossierPersistBodiesEqual(a, b)).toBe(false);
  });

  it('stable empty dossier ref pattern — same structural empty compares equal', () => {
    const stableRef = emptyWorkshop2DossierPhase1();
    expect(areWorkshop2DossierPersistBodiesEqual(stableRef, stableRef)).toBe(true);
  });

  it('hub activity mirror effect must not depend on dossier identity (render loop guard)', () => {
    const fs = require('fs') as typeof import('fs');
    const path = require('path') as typeof import('path');
    const src = fs.readFileSync(
      path.join(process.cwd(), 'src/components/brand/production/Workshop2ArticleWorkspace.tsx'),
      'utf8'
    );
    const block = src.slice(
      src.indexOf('hubActivityMirrorHydratedRef'),
      src.indexOf('const rndLifecycleBadge')
    );
    expect(block).not.toMatch(/if \(!dossier\) return/);
    expect(block).not.toMatch(/\}, \[article\.id, collectionId, applyDossierIfChanged, dossier\]/);
  });

  it('articleDevelopmentState mirror still wired in handoff-readiness API', () => {
    const snap = buildWorkshop2ArticleDevelopmentState({
      dossier: emptyWorkshop2DossierPhase1(),
      actor: 'regression',
      vaultFileCount: 0,
      latestSampleOrder: null,
    });
    const dossier = persistWorkshop2ArticleDevelopmentStateToDossier(
      emptyWorkshop2DossierPhase1(),
      snap
    );
    expect(dossier.articleDevelopmentStateMirror?.criticalPathReady).toBeDefined();
    const payload = buildWorkshop2HandoffReadinessApiPayload({
      dossier,
      vaultFileCount: 0,
      latestSampleOrder: null,
    });
    expect(payload.articleDevelopmentState.readiness).toBeDefined();
    expect(payload.articleDevelopmentState.mirroredAt).toBeTruthy();
  });
});
