import { test, expect } from '@playwright/test';

/**
 * Wave 52: tech-debt closure registry + passport hub zone.
 * PLAYWRIGHT_SKIP_WEBSERVER=1 npm run test:e2e:core -- e2e/core-69-wave-e-tech-debt-passport.spec.ts
 */
test.describe('core-69: Wave E tech-debt + passport hub', () => {
  test('registry: closed tech-debt titles + passport hook', async () => {
    const fs = await import('node:fs');
    const path = await import('node:path');
    const root = path.join(process.cwd(), 'src');
    const planner = fs.readFileSync(path.join(root, 'lib/platform-core-planner.ts'), 'utf8');
    const panel = fs.readFileSync(
      path.join(root, 'components/brand/production/Workshop2Phase1DossierPanel.tsx'),
      'utf8'
    );
    const store = fs.readFileSync(path.join(root, 'lib/production-data/brand-tasks-store.ts'), 'utf8');

    expect(planner).toContain('Brand tasks Kanban — localStorage brand_tasks_kanban_v1 (закрыто: PG API)');
    expect(planner).toContain('Auxiliary stores без PG — JSON mirrors (закрыто: pg-primary-file-policy)');
    expect(planner).toContain('CROSS_ROLE_FLOWS §5.6 (закрыто: core-54)');
    expect(panel).toContain('useWorkshop2Phase1DossierPassportHubZone');
    expect(store).toContain('BRAND_TASKS_KANBAN_STORAGE_KEY');
  });
});
