/**
 * Phase 18 — build fix (workshop2-dev-env), file preferences, error telemetry,
 * embed token e2e, health gate, dead-end audit.
 */

import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { runwayAnalyticsPostBodySchema } from '@/lib/server/runway-api-schemas';
import { resolveRunwayPreferencesUserId } from '@/lib/server/runway-preferences-auth';
import {
  readRunwayUserPreferences,
  resetRunwayUserPreferencesStore,
  writeRunwayUserPreferences,
} from '@/lib/server/runway-user-preferences-store';
import { workshop2DevBypassAuthEnabled } from '@/lib/server/workshop2-dev-env';

describe('runway phase18 build fix workshop2-dev-env', () => {
  it('workshop2DevBypassAuthEnabled lives in edge-safe module without node:crypto import', () => {
    const src = fs.readFileSync(
      path.join(process.cwd(), 'src/lib/server/workshop2-dev-env.ts'),
      'utf8'
    );
    expect(src).not.toMatch(/from\s+['"]node:crypto['"]/);
    expect(src).toContain('workshop2DevBypassAuthEnabled');
  });

  it('middleware imports dev-env via dev-auth-bypass not api-auth', () => {
    const bypass = fs.readFileSync(
      path.join(process.cwd(), 'src/lib/server/workshop2-dev-auth-bypass.ts'),
      'utf8'
    );
    expect(bypass).toContain('workshop2-dev-env');
    expect(bypass).not.toContain('workshop2-api-auth');
  });

  it('workshop2-api-auth re-exports dev env helpers', () => {
    const src = fs.readFileSync(
      path.join(process.cwd(), 'src/lib/server/workshop2-api-auth.ts'),
      'utf8'
    );
    expect(src).toContain("from '@/lib/server/workshop2-dev-env'");
  });
});

describe('runway phase18 preferences file store', () => {
  const tmpFile = path.join(os.tmpdir(), `runway-prefs-${process.pid}.json`);

  beforeAll(() => {
    process.env.RUNWAY_USER_PREFERENCES_FILE = tmpFile;
  });

  afterAll(async () => {
    await resetRunwayUserPreferencesStore();
    delete process.env.RUNWAY_USER_PREFERENCES_FILE;
    try {
      fs.unlinkSync(tmpFile);
    } catch {
      /* ignore */
    }
  });

  it('writes and reads section favorites per user', async () => {
    await resetRunwayUserPreferencesStore();
    await writeRunwayUserPreferences('user-a', { 'silk-midi-dress': 1 });
    const prefs = await readRunwayUserPreferences('user-a');
    expect(prefs['silk-midi-dress']).toBe(1);
  });

  it('isolates users in file store', async () => {
    await writeRunwayUserPreferences('user-b', { 'runway-tee': 2 });
    const a = await readRunwayUserPreferences('user-a');
    const b = await readRunwayUserPreferences('user-b');
    expect(a['silk-midi-dress']).toBe(1);
    expect(b['runway-tee']).toBe(2);
  });

  it('preferences route uses file store module', () => {
    const src = fs.readFileSync(
      path.join(process.cwd(), 'src/app/api/runway/preferences/route.ts'),
      'utf8'
    );
    expect(src).toContain('runway-user-preferences-store');
    expect(src).not.toContain('new Map');
  });
});

describe('runway phase18 preferences auth resolver', () => {
  function mockRequest(url: string, headers: Record<string, string> = {}): Request {
    const normalized = Object.fromEntries(
      Object.entries(headers).map(([k, v]) => [k.toLowerCase(), v])
    );
    return {
      url,
      headers: {
        get: (name: string) => normalized[name.toLowerCase()] ?? null,
      },
    } as unknown as Request;
  }

  it('prefers X-Runway-User-Id header', () => {
    const req = mockRequest('http://localhost/api/runway/preferences?userId=query-id', {
      'X-Runway-User-Id': 'header-id',
    });
    expect(resolveRunwayPreferencesUserId(req)).toBe('header-id');
  });

  it('falls back to query userId', () => {
    const req = mockRequest('http://localhost/api/runway/preferences?userId=query-only');
    expect(resolveRunwayPreferencesUserId(req)).toBe('query-only');
  });

  it('favorites hook sends X-Runway-User-Id when syncing', () => {
    const hookSrc = fs.readFileSync(
      path.join(process.cwd(), 'src/hooks/useRunwaySectionFavorites.ts'),
      'utf8'
    );
    expect(hookSrc).toContain('buildRunwayPreferencesRequestHeaders');
    const clientSrc = fs.readFileSync(
      path.join(process.cwd(), 'src/lib/runway/runway-preferences-client.ts'),
      'utf8'
    );
    expect(clientSrc).toContain("'X-Runway-User-Id'");
  });
});

describe('runway phase18 error telemetry', () => {
  it('analytics schema accepts error events with message', () => {
    const parsed = runwayAnalyticsPostBodySchema.safeParse({
      events: [
        {
          event: 'error',
          productSlug: 'silk-midi-dress',
          message: 'ScrollSwitcherError',
          timestamp: Date.now(),
        },
      ],
    });
    expect(parsed.success).toBe(true);
  });

  it('error boundary reports to runway-error-telemetry', () => {
    const src = fs.readFileSync(
      path.join(
        process.cwd(),
        'src/components/product/scroll-switcher/ScrollSwitcherErrorBoundary.tsx'
      ),
      'utf8'
    );
    expect(src).toContain('reportRunwayScrollSwitcherError');
  });

  it('telemetry helper POSTs to analytics API', () => {
    const src = fs.readFileSync(
      path.join(process.cwd(), 'src/lib/runway/runway-error-telemetry.ts'),
      'utf8'
    );
    expect(src).toContain("event: 'error'");
    expect(src).toContain('/api/runway/analytics');
    expect(src).not.toContain('email');
  });
});

describe('runway phase18 CI health + embed security', () => {
  it('runway.setup asserts health 200 before warm routes', () => {
    const src = fs.readFileSync(path.join(process.cwd(), 'e2e/runway.setup.ts'), 'utf8');
    expect(src).toContain('/api/runway/health');
    expect(src).toContain('healthy');
  });

  it('runway-health-check.mjs script exists', () => {
    expect(fs.existsSync(path.join(process.cwd(), 'scripts/runway-health-check.mjs'))).toBe(true);
  });

  it('playwright runway config sets embed token for e2e', () => {
    const cfg = fs.readFileSync(path.join(process.cwd(), 'playwright.runway.config.ts'), 'utf8');
    expect(cfg).toContain('NEXT_PUBLIC_RUNWAY_EMBED_TOKEN=e2e-embed-token');
  });

  it('e2e spec tests embed token denial', () => {
    const spec = fs.readFileSync(path.join(process.cwd(), 'e2e/runway.spec.ts'), 'utf8');
    expect(spec).toContain('embed runway denies access without token');
    expect(spec).toContain('token=e2e-embed-token');
  });

  it('production runbook documents analyticsWebhookUrl example', () => {
    const doc = fs.readFileSync(
      path.join(process.cwd(), 'docs/runway-production-runbook.md'),
      'utf8'
    );
    expect(doc).toMatch(/analyticsWebhookUrl/i);
  });
});

describe('runway phase18 bundle lazy loading', () => {
  it('orchestrator lazy-loads kiosk compare guided tour', () => {
    const src = fs.readFileSync(
      path.join(
        process.cwd(),
        'src/components/product/scroll-switcher/RunwayExperienceOrchestrator.tsx'
      ),
      'utf8'
    );
    expect(src).toContain('const RunwayKioskShell = dynamic');
    expect(src).toContain('const RunwayCompareView = dynamic');
    expect(src).toContain('const RunwayGuidedTour = dynamic');
    expect(src).toContain('const RunwayDemoRibbon = dynamic');
    expect(src).toContain('const RunwayInvestorBanner = dynamic');
  });

  it('playlist lazy-loads ProductScrollSwitcher', () => {
    const src = fs.readFileSync(
      path.join(
        process.cwd(),
        'src/components/product/scroll-switcher/RunwayPlaylistExperience.tsx'
      ),
      'utf8'
    );
    expect(src).toContain('const ProductScrollSwitcher = dynamic');
  });
});

describe('runway phase18 dead-end audit', () => {
  it('preferences route has no in-memory Map stub', () => {
    const src = fs.readFileSync(
      path.join(process.cwd(), 'src/app/api/runway/preferences/route.ts'),
      'utf8'
    );
    expect(src).not.toMatch(/\bMap\s*<\s*string/);
  });

  it('no href="#" in scroll-switcher after phase18', () => {
    const dir = path.join(process.cwd(), 'src/components/product/scroll-switcher');
    const files = fs.readdirSync(dir).filter((f) => f.endsWith('.tsx'));
    for (const file of files) {
      const src = fs.readFileSync(path.join(dir, file), 'utf8');
      expect(src).not.toContain('href="#"');
    }
  });
});
