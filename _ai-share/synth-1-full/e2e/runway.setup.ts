/**
 * HTTP-прогрев runway-маршрутов после webServer — триггерит SSR compile без браузера.
 */
import { test as setup, expect } from '@playwright/test';

const WARM_ROUTES = [
  '/api/runway/health',
  '/api/runway/config',
  '/api/runway/analytics',
  '/api/products/silk-midi-dress',
  '/api/products/cashmere-crewneck-sweater',
  '/api/products/tech-anorak-men',
  '/products/silk-midi-dress?view=runway',
  '/products/cashmere-crewneck-sweater?view=runway',
  '/products/tech-anorak-men?view=runway',
];

function isTransientRequestError(err: unknown): boolean {
  const msg = err instanceof Error ? err.message : String(err);
  return /ECONNREFUSED|ECONNRESET|ETIMEDOUT|socket hang up|connect/i.test(msg);
}

function isNextCompileResponse(status: number, body: string): boolean {
  return status >= 500 || (status === 404 && body.includes('<!DOCTYPE html>'));
}

async function sleep(ms: number) {
  await new Promise((r) => setTimeout(r, ms));
}

setup('runway health returns 200', async ({ request }) => {
  setup.setTimeout(180_000);
  let lastStatus = 0;
  let lastBody = '';

  for (let attempt = 0; attempt < 30; attempt++) {
    try {
      const res = await request.get('/api/runway/health', { timeout: 60_000 });
      lastStatus = res.status();
      lastBody = (await res.text()).slice(0, 400);

      if (lastStatus === 200 || lastStatus === 503) {
        try {
          const body = JSON.parse(lastBody);
          if (body.healthy === true) return;
          if (body.scrollVideoProductCount > 0 && body.analyticsStoreWritable === true) return;
        } catch {
          /* not JSON yet */
        }
      }

      if (isNextCompileResponse(lastStatus, lastBody)) {
        await sleep(4000);
        continue;
      }

      await sleep(2000);
    } catch (err) {
      if (isTransientRequestError(err)) {
        await sleep(3000);
        continue;
      }
      throw err;
    }
  }

  throw new Error(`runway health not ready: HTTP ${lastStatus} ${lastBody}`);
});

setup('warm runway routes via HTTP', async ({ request }) => {
  setup.setTimeout(300_000);
  for (const route of WARM_ROUTES) {
    for (let attempt = 0; attempt < 5; attempt++) {
      try {
        const res = await request.get(route, { timeout: 90_000 });
        const body = (await res.text()).slice(0, 400);
        if (!isNextCompileResponse(res.status(), body)) break;
        await sleep(3000);
      } catch (err) {
        if (isTransientRequestError(err)) {
          await sleep(3000);
          continue;
        }
        break;
      }
    }
    await sleep(500);
  }
});

setup('seed runway analytics dashboard', async ({ request }) => {
  setup.setTimeout(180_000);
  const payload = {
    events: [
      {
        event: 'scroll_experience_view',
        productSlug: 'silk-midi-dress',
        sectionIndex: 0,
        timestamp: Date.now(),
      },
    ],
  };

  let lastPostStatus = 0;
  let lastPostBody = '';
  for (let attempt = 0; attempt < 30; attempt++) {
    try {
      const post = await request.post('/api/runway/analytics', {
        timeout: 60_000,
        data: payload,
      });
      lastPostStatus = post.status();
      lastPostBody = (await post.text()).slice(0, 400);

      if (post.ok()) {
        const get = await request.get('/api/runway/analytics', { timeout: 60_000 });
        if (get.ok()) {
          const body = await get.json();
          if (body.metrics && body.funnel) return;
          throw new Error(`analytics seed GET missing dashboard: ${JSON.stringify(body)}`);
        }
        lastPostStatus = get.status();
        lastPostBody = (await get.text()).slice(0, 400);
      }

      if (
        lastPostStatus === 0 ||
        lastPostStatus === 404 ||
        lastPostStatus >= 500 ||
        isNextCompileResponse(lastPostStatus, lastPostBody)
      ) {
        await sleep(3000);
        continue;
      }

      throw new Error(`analytics seed unexpected status: POST ${lastPostStatus} ${lastPostBody}`);
    } catch (err) {
      if (isTransientRequestError(err)) {
        await sleep(3000);
        continue;
      }
      throw err;
    }
  }

  throw new Error(`analytics seed failed after retries: POST ${lastPostStatus} ${lastPostBody}`);
});

setup('warm silk runway PDP in browser', async ({ page }) => {
  if (process.env.RUNWAY_E2E_SKIP_BROWSER_WARM === '1') {
    setup.skip(true, 'RUNWAY_E2E_SKIP_BROWSER_WARM=1 — HTTP warm достаточно');
  }

  setup.setTimeout(420_000);
  await page.route(/fonts\.(googleapis|gstatic)\.com/, (route) => route.abort());
  await page.addInitScript(() => {
    localStorage.setItem('runway-onboarding-dismissed', '1');
    localStorage.setItem('runway-compare-hint-dismissed', '1');
  });

  const stage = page.locator('[data-runway-stage]').first();
  let lastErr: unknown;

  for (let attempt = 0; attempt < 3; attempt++) {
    try {
      if (attempt === 0) {
        await page.goto('/products/silk-midi-dress?view=runway', {
          waitUntil: 'domcontentloaded',
          timeout: 120_000,
        });
      } else {
        await page.reload({ waitUntil: 'domcontentloaded', timeout: 120_000 });
      }

      await page
        .waitForResponse((res) => res.url().includes('/api/runway/config') && res.ok(), {
          timeout: 90_000,
        })
        .catch(() => undefined);

      await stage.waitFor({ state: 'attached', timeout: 120_000 });
      await expect(stage).toHaveAttribute('data-runway-ready', 'true', { timeout: 90_000 });
      return;
    } catch (err) {
      lastErr = err;
      const bodyText = await page.locator('body').innerText().catch(() => '');
      if (/Application error|502|503|ECONNREFUSED/i.test(bodyText)) {
        throw new Error(
          `runway PDP warm: server unavailable (attempt ${attempt + 1}/3). Body: ${bodyText.slice(0, 200)}`
        );
      }
      if (attempt === 2) break;
      await sleep(3000);
    }
  }

  throw lastErr instanceof Error
    ? lastErr
    : new Error('runway PDP browser warm failed after 3 attempts');
});
