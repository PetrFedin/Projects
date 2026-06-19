import fs from 'fs';
import path from 'path';
import { WORKSHOP2_PHASE1_DOSSIER_PANEL_DECOMPOSITION_MANIFEST } from '@/components/brand/production/workshop2-phase1-dossier-panel-decomposition-manifest';

const ROOT = path.join(__dirname, '..');

describe('workshop2-phase1-dossier-panel decomposition manifest', () => {
  it('все файлы зон существуют', () => {
    const files = [
      WORKSHOP2_PHASE1_DOSSIER_PANEL_DECOMPOSITION_MANIFEST.orchestrator,
      ...Object.values(WORKSHOP2_PHASE1_DOSSIER_PANEL_DECOMPOSITION_MANIFEST)
        .flat()
        .filter((f) => f !== WORKSHOP2_PHASE1_DOSSIER_PANEL_DECOMPOSITION_MANIFEST.orchestrator),
    ];
    for (const file of files) {
      expect(fs.existsSync(path.join(ROOT, file))).toBe(true);
    }
  });

  it('lifecycle zone включает rollback banner', () => {
    expect(WORKSHOP2_PHASE1_DOSSIER_PANEL_DECOMPOSITION_MANIFEST.lifecycle).toContain(
      'Workshop2Phase1DossierPanelRollbackBanner.tsx'
    );
  });

  it('sectionBodies zone включает sketch + final TZ wizard hooks', () => {
    expect(WORKSHOP2_PHASE1_DOSSIER_PANEL_DECOMPOSITION_MANIFEST.sectionBodies).toEqual(
      expect.arrayContaining([
        'use-workshop2-phase1-dossier-attr-comments-controller.ts',
        'use-workshop2-phase1-dossier-sketch-workspace-state.ts',
        'use-workshop2-phase1-dossier-final-tz-wizard-controller.ts',
        'use-workshop2-phase1-dossier-tz-signoff-zone.ts',
        'use-workshop2-phase1-dossier-active-section-rows.ts',
        'use-workshop2-phase1-dossier-material-bom-zone.ts',
        'use-workshop2-phase1-dossier-handbook-control-zone.ts',
        'use-workshop2-phase1-dossier-section-rows-orchestration.ts',
        'use-workshop2-phase1-dossier-passport-hub-zone.ts',
        'use-workshop2-phase1-dossier-send-handoff-zone.ts',
      ])
    );
  });
});
