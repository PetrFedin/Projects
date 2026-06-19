#!/usr/bin/env node
/**
 * Staging smoke для Runway — HTTP-проверки перед/после деплоя.
 *
 *   node scripts/runway-staging-smoke.mjs
 *   node scripts/runway-staging-smoke.mjs --base https://staging.example.com
 *   npm run smoke:runway-staging -- --base http://127.0.0.1:3000
 */
import { parseArgs } from 'node:util';

const { values } = parseArgs({
  options: {
    base: {
      type: 'string',
      default:
        process.env.STAGING_BASE_URL?.trim() ||
        process.env.BASE_URL?.trim() ||
        'http://localhost:3000',
    },
    'skip-presign': { type: 'boolean', default: false },
  },
});

const base = values.base.replace(/\/$/, '');
let failures = 0;
let checks = 0;

function ok(label) {
  checks++;
  console.log(`[OK] ${label}`);
}

function fail(label, detail) {
  checks++;
  failures++;
  console.error(`[FAIL] ${label}${detail ? ` — ${detail}` : ''}`);
}

function warn(label, detail) {
  console.warn(`[WARN] ${label}${detail ? ` — ${detail}` : ''}`);
}

async function fetchJson(path, expectStatus = 200) {
  const url = `${base}${path}`;
  try {
    const res = await fetch(url, { headers: { Accept: 'application/json' } });
    if (res.status !== expectStatus) {
      fail(path, `${url} → HTTP ${res.status}, ожидали ${expectStatus}`);
      return null;
    }
    return res.json();
  } catch (err) {
    fail(path, err instanceof Error ? err.message : String(err));
    return null;
  }
}

console.log(`\n=== Runway staging smoke ===`);
console.log(`BASE_URL: ${base}\n`);

const health = await fetchJson('/api/runway/health', 200);
if (health) {
  ok('GET /api/runway/health');
  if (typeof health.healthy !== 'boolean') {
    fail('health.healthy', 'поле healthy отсутствует');
  }
}

const config = await fetchJson('/api/runway/config', 200);
if (config) {
  ok('GET /api/runway/config');
  const ae = config.analyticsEnabled;
  if (!ae || typeof ae.ga4 !== 'boolean' || typeof ae.posthog !== 'boolean') {
    fail('config.analyticsEnabled', 'ожидали { ga4: boolean, posthog: boolean }');
  } else {
    ok('config.analyticsEnabled shape');
  }
}

try {
  const analyticsPost = await fetch(`${base}/api/runway/analytics`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      events: [
        {
          event: 'scroll_experience_view',
          productSlug: 'silk-midi-dress',
          sectionIndex: 0,
          timestamp: Date.now(),
        },
      ],
    }),
  });
  if (!analyticsPost.ok) {
    fail('POST /api/runway/analytics', `HTTP ${analyticsPost.status}`);
  } else {
    ok('POST /api/runway/analytics');
  }
} catch (err) {
  fail('POST /api/runway/analytics', err instanceof Error ? err.message : String(err));
}

const analytics = await fetchJson('/api/runway/analytics', 200);
if (analytics) {
  ok('GET /api/runway/analytics');
  if (!analytics.metrics || !analytics.funnel) {
    fail('analytics dashboard', 'нет metrics/funnel');
  }
}

const heroPdpPaths = [
  '/products/silk-midi-dress?view=runway',
  '/products/cashmere-crewneck-sweater?view=runway',
  '/products/tech-anorak-men?view=runway',
];
for (const pdpPath of heroPdpPaths) {
  try {
    const pdpRes = await fetch(`${base}${pdpPath}`, { redirect: 'follow' });
    if (pdpRes.status === 200) {
      ok(`GET ${pdpPath}`);
    } else {
      fail(`GET ${pdpPath}`, `HTTP ${pdpRes.status}`);
    }
  } catch (err) {
    fail(`GET ${pdpPath}`, err instanceof Error ? err.message : String(err));
  }
}

if (!values['skip-presign']) {
  try {
    const presignRes = await fetch(`${base}/api/runway/upload/presign`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        brandSlug: 'nordic-wool',
        filename: 'smoke-test.mp4',
        contentType: 'video/mp4',
        contentLength: 1024,
      }),
    });

    if (process.env.RUNWAY_UPLOAD_ENABLED === '1') {
      if (presignRes.status === 200) {
        ok('POST /api/runway/upload/presign (RUNWAY_UPLOAD_ENABLED=1 → 200)');
      } else {
        fail('POST /api/runway/upload/presign', `RUNWAY_UPLOAD_ENABLED=1, HTTP ${presignRes.status}`);
      }
    } else if (presignRes.status === 503) {
      ok('POST /api/runway/upload/presign (отключён → 503, ожидаемо)');
    } else if (presignRes.status === 200) {
      warn('presign', 'RUNWAY_UPLOAD_ENABLED не задан, но endpoint вернул 200');
      ok('POST /api/runway/upload/presign (200)');
    } else {
      fail('POST /api/runway/upload/presign', `HTTP ${presignRes.status}`);
    }
  } catch (err) {
    fail('POST /api/runway/upload/presign', err instanceof Error ? err.message : String(err));
  }
}

console.log(`\n--- Итог: ${checks - failures}/${checks} проверок пройдено ---\n`);

if (failures > 0) {
  console.error(`Smoke не пройден: ${failures} ошибок. Запустите dev-сервер: npm run dev`);
  process.exit(1);
}

console.log('Staging smoke пройден успешно.');
process.exit(0);
