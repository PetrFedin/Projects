/** @jest-environment node */

/**
 * Wave AD — signoff script, curl-all-panes, Playwright pane-aware wait (no PG path).
 */
import fs from 'fs';
import path from 'path';

describe('workshop2-wave-ad-must-close', () => {
  it('signoff:workshop2 npm script chains preflight + check + playwright', () => {
    const pkg = JSON.parse(fs.readFileSync(path.join(process.cwd(), 'package.json'), 'utf8'));
    expect(pkg.scripts['signoff:workshop2']).toMatch(/workshop2-signoff\.sh/);

    const sh = fs.readFileSync(path.join(process.cwd(), 'scripts/workshop2-signoff.sh'), 'utf8');
    expect(sh).toMatch(/workshop2-pg-preflight\.sh/);
    expect(sh).toMatch(/check:workshop2/);
    expect(sh).toMatch(/E2E_CLEAR_CACHE=1/);
    expect(sh).toMatch(/grep-invert "PG live"/);
  });

  it('curl-all-panes script hits all w2pane values for demo-ss27-01', () => {
    const sh = fs.readFileSync(
      path.join(process.cwd(), 'scripts/workshop2-curl-all-panes.sh'),
      'utf8'
    );
    expect(sh).toMatch(/demo-ss27-01/);
    for (const pane of [
      'overview',
      'tz',
      'supply',
      'fit',
      'plan',
      'release',
      'qc',
      'stock',
      'vault',
      'documents',
      'sample',
      'nesting',
    ]) {
      expect(sh).toContain(`  ${pane}`);
    }
    expect(sh).toMatch(/\?w2pane=\$\{pane\}/);
    expect(sh).toMatch(/file-store-demo-ss27-01-sample-order/);
  });

  it('Playwright spec waits pane section ids — not only #w2-dossier-main on fit/qc', () => {
    const spec = fs.readFileSync(path.join(process.cwd(), 'e2e/workshop2-ss27.spec.ts'), 'utf8');
    expect(spec).toMatch(/W2_PANE_SECTION/);
    expect(spec).toMatch(/w2article-section-fit/);
    expect(spec).toMatch(/ERR_ABORTED/);
    expect(spec).toMatch(/waitUntil: 'commit'/);
  });
});
