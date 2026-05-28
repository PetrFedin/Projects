/** @jest-environment node */

/**
 * Wave AA — check:workshop2 gate, dev bypass production guard, sign-off artifacts.
 */
import fs from 'fs';
import path from 'path';
import { NextRequest } from 'next/server';
import {
  assertWorkshop2ApiAccess,
  workshop2DevBypassAuthEnabled,
} from '@/lib/server/workshop2-api-auth';
import { buildWorkshop2DevBypassRequestHeaders } from '@/lib/server/workshop2-dev-auth-bypass';

describe('workshop2-wave-aa-must-close', () => {
  const prevEnv = process.env;

  beforeEach(() => {
    process.env = { ...prevEnv };
  });

  afterAll(() => {
    process.env = prevEnv;
  });

  it('WORKSHOP2_DEV_BYPASS_AUTH cannot activate in production build', () => {
    process.env.NODE_ENV = 'production';
    process.env.WORKSHOP2_DEV_BYPASS_AUTH = 'true';

    expect(workshop2DevBypassAuthEnabled()).toBe(false);

    const req = new NextRequest('http://localhost/api/workshop2/health');
    expect(buildWorkshop2DevBypassRequestHeaders(req)).toBeNull();

    return assertWorkshop2ApiAccess(req).then((a) => {
      expect(a.ok).toBe(false);
      if (!a.ok) expect(a.status).toBe(401);
    });
  });

  it('WORKSHOP2_DEV_BYPASS_AUTH=1 also blocked in production', () => {
    process.env.NODE_ENV = 'production';
    process.env.WORKSHOP2_DEV_BYPASS_AUTH = '1';
    expect(workshop2DevBypassAuthEnabled()).toBe(false);
  });

  it('middleware uses buildWorkshop2DevBypassRequestHeaders with production guard', () => {
    const mw = fs.readFileSync(path.join(process.cwd(), 'src/middleware.ts'), 'utf8');
    expect(mw).toMatch(/buildWorkshop2DevBypassRequestHeaders/);
    const bypass = fs.readFileSync(
      path.join(process.cwd(), 'src/lib/server/workshop2-dev-auth-bypass.ts'),
      'utf8'
    );
    expect(bypass).toMatch(/NODE_ENV === 'production'/);
    const devEnv = fs.readFileSync(
      path.join(process.cwd(), 'src/lib/server/workshop2-dev-env.ts'),
      'utf8'
    );
    expect(devEnv).toMatch(/NODE_ENV === 'production'/);
  });

  it('check:workshop2 script exists with catalog + unit + smoke skip', () => {
    const pkg = JSON.parse(fs.readFileSync(path.join(process.cwd(), 'package.json'), 'utf8'));
    expect(pkg.scripts['check:workshop2']).toMatch(/check-workshop2\.mjs/);

    const gate = fs.readFileSync(path.join(process.cwd(), 'scripts/check-workshop2.mjs'), 'utf8');
    expect(gate).toMatch(/verify-workshop2-catalog-wire/);
    expect(gate).toMatch(/test:workshop2:unit/);
    expect(gate).toMatch(/smoke:workshop2/);
    expect(gate).toMatch(/skip.*3000|no dev server/i);
  });

  it('sign-off template documents PG + browser steps', () => {
    const tpl = fs.readFileSync(
      path.join(process.cwd(), '.planning/workshop2-signoff-template.md'),
      'utf8'
    );
    expect(tpl).toMatch(/workshop2-pg-bootstrap/i);
    expect(tpl).toMatch(/demo-ss27-01/i);
    expect(tpl).toMatch(/Human reviewer/i);
  });

  it('SS27 playwright spec covers demo-ss27-01 checklist path', () => {
    const spec = fs.readFileSync(path.join(process.cwd(), 'e2e/workshop2-ss27.spec.ts'), 'utf8');
    expect(spec).toMatch(/demo-ss27-01|W2_DEMO_ARTICLE_TZ_FULL_SLUG/);
    expect(spec).toMatch(/Floor:/);
    expect(spec).toMatch(/test\.skip/);
  });
});
