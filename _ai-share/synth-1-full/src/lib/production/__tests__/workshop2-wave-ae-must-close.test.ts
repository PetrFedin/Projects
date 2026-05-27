/** @jest-environment node */

/**
 * Wave AE — PG sign-off script, hardened compose, Playwright QC inspector wait.
 */
import fs from 'fs';
import path from 'path';

describe('workshop2-wave-ae-must-close', () => {
  it('signoff:workshop2:pg requires WORKSHOP2_DATABASE_URL and runs PG live grep', () => {
    const pkg = JSON.parse(fs.readFileSync(path.join(process.cwd(), 'package.json'), 'utf8'));
    expect(pkg.scripts['signoff:workshop2:pg']).toMatch(/workshop2-signoff-pg\.sh/);

    const sh = fs.readFileSync(path.join(process.cwd(), 'scripts/workshop2-signoff-pg.sh'), 'utf8');
    expect(sh).toMatch(/WORKSHOP2_DATABASE_URL/);
    expect(sh).toMatch(/workshop2-pg-preflight\.sh/);
    expect(sh).toMatch(/grep "PG live"/);
  });

  it('docker-compose.workshop2.yml has hardened healthchecks', () => {
    const compose = fs.readFileSync(
      path.join(process.cwd(), 'docker-compose.workshop2.yml'),
      'utf8'
    );
    expect(compose).toMatch(/pg_isready -U workshop2 -d workshop2/);
    expect(compose).toMatch(/start_period/);
    expect(compose).toMatch(/minio\/health\/live/);
  });

  it('Playwright spec waits sample-order before QC inspector deep link', () => {
    const spec = fs.readFileSync(path.join(process.cwd(), 'e2e/workshop2-ss27.spec.ts'), 'utf8');
    expect(spec).toMatch(/waitForQcInspectorDeepLink/);
    expect(spec).toMatch(/sample-order/);
    expect(spec).toMatch(/workshop2-qc-inspector-deep-link/);
  });

  it('FINAL-HANDOFF doc exists with 5 close commands', () => {
    const doc = fs.readFileSync(
      path.join(process.cwd(), '.planning/workshop2-FINAL-HANDOFF.md'),
      'utf8'
    );
    expect(doc).toMatch(/85[0-9]|8[6-9]\d/);
    expect(doc).toMatch(/79/);
    expect(doc).toMatch(/signoff:workshop2/);
    expect(doc).toMatch(/signoff:workshop2:pg/);
    expect(doc).toMatch(/pg-bootstrap/);
  });
});
