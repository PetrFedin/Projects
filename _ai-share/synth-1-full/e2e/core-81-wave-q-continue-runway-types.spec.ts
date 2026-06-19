import { test, expect } from '@playwright/test';

/**
 * Wave 64: continue-step zone + runway/full tsc fixes (openCart, RunwayTheme, refs).
 * PLAYWRIGHT_SKIP_WEBSERVER=1 npm run test:e2e:core -- e2e/core-81-wave-q-continue-runway-types.spec.ts
 */
test.describe('core-81: Wave Q continue zone + runway type fixes', () => {
  test('continue step hook wired; openCart + RunwayTheme in types', async () => {
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
    const uiState = fs.readFileSync(path.join(root, 'providers/ui-state.tsx'), 'utf8');

    expect(panel).toContain('useWorkshop2Phase1DossierContinueStepZone');
    expect(panel).not.toContain('validatePhase2CanonicalRequiredFilled');
    expect(manifest).toContain('use-workshop2-phase1-dossier-continue-step-zone.ts');
    expect(types).toContain('export type RunwayTheme');
    expect(types).toContain('runwayTheme?: RunwayTheme');
    expect(uiState).toContain('openCart: () => void');
    expect(uiState).toContain('const openCart = () => setIsCartOpen(true)');
  });
});
