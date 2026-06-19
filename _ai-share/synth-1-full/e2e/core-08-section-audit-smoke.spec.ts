import { test, expect } from '@playwright/test';
import { buildSectionAuditE2ePaths } from '../src/lib/platform-core-section-audit-e2e-paths';

const SECTION_PATHS = buildSectionAuditE2ePaths();

test.describe('core-08: SECTION_AUDIT smoke (все resolveHref)', () => {
  test(`обход ${SECTION_PATHS.length} разделов матрицы — HTTP < 500`, async ({ request }) => {
    test.setTimeout(600_000);
    const failures: string[] = [];

    for (const entry of SECTION_PATHS) {
      const path = entry.href.startsWith('http')
        ? new URL(entry.href).pathname + new URL(entry.href).search + new URL(entry.href).hash
        : entry.href;
      const gotoPath = path.split('#')[0] || path;

      let status = 599;
      for (let attempt = 0; attempt < 3; attempt++) {
        const res = await request.get(gotoPath, { timeout: 60_000 });
        status = res.status();
        if (status < 500) break;
        await new Promise((r) => setTimeout(r, attempt === 0 ? 1_000 : 2_500));
      }
      if (status >= 500) {
        failures.push(`${entry.roleId}/${entry.pillarId}/${entry.sectionId} → ${status} ${gotoPath}`);
      }
    }

    expect(
      failures,
      failures.length ? `SECTION_AUDIT failures:\n${failures.join('\n')}` : undefined
    ).toHaveLength(0);
  });
});
