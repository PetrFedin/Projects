import { test, expect } from '@playwright/test';

/**
 * Wave 63: journal commit zone + ProductScrollSwitcherSection type extensions.
 * PLAYWRIGHT_SKIP_WEBSERVER=1 npm run test:e2e:core -- e2e/core-80-wave-p-journal-types.spec.ts
 */
test.describe('core-80: Wave P journal zone + scroll section types', () => {
  test('journal commit hook wired; scroll section runway aliases in types', async () => {
    const fs = await import('node:fs');
    const path = await import('node:path');
    const root = path.join(process.cwd(), 'src');
    const panel = fs.readFileSync(
      path.join(root, 'components/brand/production/Workshop2Phase1DossierPanel.tsx'),
      'utf8'
    );
    const manifest = fs.readFileSync(
      path.join(root, 'components/brand/production/workshop2-phase1-dossier-panel-decomposition-manifest.ts'),
      'utf8'
    );
    const types = fs.readFileSync(path.join(root, 'lib/types.ts'), 'utf8');

    expect(panel).toContain('useWorkshop2Phase1DossierJournalCommitZone');
    expect(panel).not.toContain('commitDossierEditJournalViaBrowser');
    expect(manifest).toContain('use-workshop2-phase1-dossier-journal-commit-zone.ts');
    expect(types).toContain('heroUrl?: string');
    expect(types).toContain('sectionTitle?: string');
  });
});
