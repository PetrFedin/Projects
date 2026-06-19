#!/usr/bin/env node
/**
 * Runway doctor — validate content + health + broken assets.
 * Exit 1 если есть проблемы.
 *
 * Usage:
 *   node scripts/runway-doctor.mjs [--json report.json] [--skip-health]
 */
import { spawnSync, execFileSync } from 'node:child_process';
import { readFileSync, writeFileSync, existsSync, statSync } from 'node:fs';
import { join, dirname, extname } from 'node:path';
import { fileURLToPath } from 'node:url';
import http from 'node:http';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const jsonOut = process.argv.includes('--json')
  ? process.argv[process.argv.indexOf('--json') + 1]
  : null;
const skipHealth = process.argv.includes('--skip-health');
const VIDEO_MAX_BYTES = 50 * 1024 * 1024;
const VIDEO_BUDGET_DOC = 'docs/runway-brand-video-specs.md';

const report = {
  generatedAt: new Date().toISOString(),
  ok: true,
  steps: [],
  brokenAssets: [],
};

function fail(step, message, extra = {}) {
  report.ok = false;
  report.steps.push({ step, status: 'fail', message, ...extra });
  console.error(`[FAIL] ${step}: ${message}`);
}

function pass(step, message, extra = {}) {
  report.steps.push({ step, status: 'ok', message, ...extra });
  console.log(`[OK] ${step}: ${message}`);
}

function checkFfprobeAvailable() {
  try {
    execFileSync('ffprobe', ['-version'], { encoding: 'utf8', stdio: ['ignore', 'pipe', 'ignore'] });
    pass('ffprobe', 'ffmpeg/ffprobe доступен');
  } catch {
    report.steps.push({
      step: 'ffprobe',
      status: 'warn',
      message: 'ffprobe не найден — только size/extension в video-lint',
    });
    console.warn(
      '[WARN] ffprobe: не найден — brew install ffmpeg (полная проверка: npm run deploy:runway-check → video-lint)'
    );
  }
}

function runValidate() {
  const r = spawnSync('node', ['scripts/validate-runway-content.mjs'], {
    cwd: root,
    encoding: 'utf8',
  });
  if (r.status !== 0) {
    fail('validate-runway-content', 'Content validation failed', { output: r.stderr || r.stdout });
    return;
  }
  pass('validate-runway-content', 'All scroll-video products valid');
}

function collectBrokenAssets() {
  const productsPath = join(root, 'public/data/products.json');
  const products = JSON.parse(readFileSync(productsPath, 'utf8'));
  const scroll = products.filter((p) => p.displayMode === 'scroll-video');

  for (const p of scroll) {
    for (const [i, s] of (p.scrollSwitcherSections ?? []).entries()) {
      for (const field of ['sectionImageUrl', 'thumbImageUrl', 'sectionVideoUrl']) {
        const url = s[field];
        if (!url?.startsWith('/')) continue;
        const disk = join(root, 'public', url);
        if (!existsSync(disk)) {
          report.brokenAssets.push({ slug: p.slug, sectionIndex: i, field, path: url });
        }
      }
    }
  }

  if (report.brokenAssets.length > 0) {
    fail('assets', `${report.brokenAssets.length} broken asset path(s)`, {
      brokenAssets: report.brokenAssets,
    });
  } else {
    pass('assets', 'No broken local asset paths');
  }
}

function fetchHealth() {
  return new Promise((resolve) => {
    const base = process.env.RUNWAY_HEALTH_URL?.trim() || 'http://127.0.0.1:3000';
    const url = new URL('/api/runway/health', base);

    const req = http.get(url, (res) => {
      let body = '';
      res.on('data', (c) => {
        body += c;
      });
      res.on('end', () => {
        resolve({ status: res.statusCode, body });
      });
    });
    req.on('error', (err) => resolve({ error: err.message }));
    req.setTimeout(10_000, () => {
      req.destroy(new Error('timeout'));
    });
  });
}

async function runHealth() {
  if (skipHealth) {
    pass('health', 'Skipped (--skip-health)');
    return;
  }

  const result = await fetchHealth();
  if (result.error) {
    fail('health', `API unreachable: ${result.error}. Запустите dev-сервер или используйте --skip-health`);
    return;
  }

  try {
    const json = JSON.parse(result.body);
    if (json.healthy === true) {
      pass('health', 'GET /api/runway/health → healthy', {
        scrollVideoProductCount: json.scrollVideoProductCount,
      });
    } else {
      fail('health', 'healthy !== true', { snapshot: json, httpStatus: result.status });
    }
  } catch {
    fail('health', 'Invalid JSON from health API');
  }
}

function checkAbTestConfig() {
  const abEnabled = process.env.RUNWAY_AB_TEST_ENABLED === '1';
  if (!abEnabled) {
    pass('ab-test', 'RUNWAY_AB_TEST_ENABLED не задан — A/B выключен');
    return;
  }

  const scrollPath = join(root, 'public/data/scroll-experience.json');
  if (!existsSync(scrollPath)) {
    fail('ab-test', 'scroll-experience.json не найден');
    return;
  }

  const raw = JSON.parse(readFileSync(scrollPath, 'utf8'));
  const flagship = Array.isArray(raw.abTestFlagshipSlugs) ? raw.abTestFlagshipSlugs : [];

  if (flagship.length === 0) {
    report.steps.push({
      step: 'ab-test',
      status: 'warn',
      message:
        'RUNWAY_AB_TEST_ENABLED=1, но abTestFlagshipSlugs пуст — рекомендуется ограничить A/B flagship SKU',
    });
    console.warn(
      '[WARN] ab-test: RUNWAY_AB_TEST_ENABLED=1 без abTestFlagshipSlugs — глобальный A/B на все scroll-video'
    );
    return;
  }

  pass('ab-test', `A/B env + flagship slugs: ${flagship.join(', ')}`);
}

function checkProductionAnalyticsEnv() {
  const isProd = process.env.NODE_ENV === 'production';
  if (!isProd) {
    pass('analytics-env', 'Skipped (NODE_ENV !== production)');
    return;
  }

  const ga4 = process.env.NEXT_PUBLIC_GA4_MEASUREMENT_ID?.trim();
  const posthog = process.env.NEXT_PUBLIC_POSTHOG_KEY?.trim();
  const warnings = [];

  if (!ga4) {
    warnings.push('NEXT_PUBLIC_GA4_MEASUREMENT_ID не задан — GA4 mirror отключён');
  }
  if (!posthog) {
    warnings.push('NEXT_PUBLIC_POSTHOG_KEY не задан — PostHog mirror отключён');
  }

  const store = process.env.RUNWAY_ANALYTICS_STORE?.trim().toLowerCase();
  if (store === 'postgres' && !process.env.DATABASE_URL?.trim()) {
    warnings.push('RUNWAY_ANALYTICS_STORE=postgres без DATABASE_URL');
  }

  if (warnings.length === 0) {
    pass('analytics-env', 'Production analytics env OK (GA4/PostHog/store)');
    return;
  }

  report.steps.push({
    step: 'analytics-env',
    status: 'warn',
    message: warnings.join('; '),
    warnings,
  });
  console.warn(`[WARN] analytics-env: ${warnings.join('; ')}`);
}

function checkLocalVideoPerformanceBudget() {
  const productsPath = join(root, 'public/data/products.json');
  if (!existsSync(productsPath)) {
    pass('video-budget', 'products.json не найден — skip');
    return;
  }

  const products = JSON.parse(readFileSync(productsPath, 'utf8'));
  const scroll = products.filter((p) => p.displayMode === 'scroll-video');
  const warnings = [];

  for (const p of scroll) {
    for (const [i, s] of (p.scrollSwitcherSections ?? []).entries()) {
      const videoUrl = s.sectionVideoUrl;
      if (!videoUrl?.startsWith('/')) continue;

      const disk = join(root, 'public', videoUrl);
      if (!existsSync(disk)) continue;

      const { size } = statSync(disk);
      if (size > VIDEO_MAX_BYTES) {
        const mb = (size / (1024 * 1024)).toFixed(1);
        warnings.push(`${p.slug} section ${i}: ${mb} MB > 50 MB (${videoUrl})`);
      }

      if (extname(videoUrl).toLowerCase() === '.mp4') {
        const webmPath = videoUrl.replace(/\.mp4$/i, '.webm');
        if (!existsSync(join(root, 'public', webmPath))) {
          warnings.push(`${p.slug} section ${i}: нет companion WebM ${webmPath}`);
        }
      }
    }
  }

  if (warnings.length === 0) {
    pass('video-budget', 'Локальные hero-видео в пределах budget (≤50 MB, webm companion)');
    return;
  }

  report.steps.push({
    step: 'video-budget',
    status: 'warn',
    message: `${warnings.length} video budget issue(s) — см. ${VIDEO_BUDGET_DOC}`,
    warnings,
  });
  for (const w of warnings) {
    console.warn(`[WARN] video-budget: ${w}`);
  }
}

function checkProductionEnvTemplate() {
  const templatePath = join(root, '.env.production.example');
  if (!existsSync(templatePath)) {
    fail('env-template', 'Файл .env.production.example не найден');
    return;
  }

  pass('env-template', '.env.production.example присутствует');

  const raw = readFileSync(templatePath, 'utf8');
  const keys = [...raw.matchAll(/^#?\s*([A-Z][A-Z0-9_]+)=/gm)]
    .map((m) => m[1])
    .filter((k) => !k.startsWith('NEXT_PUBLIC_DISABLE'));

  const missing = keys.filter((key) => !process.env[key]?.trim());
  const present = keys.filter((key) => Boolean(process.env[key]?.trim()));

  report.steps.push({
    step: 'env-vars',
    status: missing.length ? 'warn' : 'ok',
    message:
      missing.length === 0
        ? `Все ${keys.length} documented runway keys заданы в process.env`
        : `Не задано в process.env: ${missing.join(', ')}`,
    documentedKeys: keys,
    missingInProcessEnv: missing,
    presentInProcessEnv: present,
  });

  if (missing.length === 0) {
    console.log(`[OK] env-vars: все ${keys.length} ключей из шаблона заданы`);
  } else {
    console.warn(`[WARN] env-vars: не задано — ${missing.join(', ')}`);
  }
}

checkFfprobeAvailable();
runValidate();
collectBrokenAssets();
checkLocalVideoPerformanceBudget();
checkAbTestConfig();
checkProductionEnvTemplate();
checkProductionAnalyticsEnv();
await runHealth();

if (jsonOut) {
  writeFileSync(jsonOut, `${JSON.stringify(report, null, 2)}\n`, 'utf8');
  console.log(`\nJSON report → ${jsonOut}`);
}

if (!report.ok) {
  console.error('\nrunway-doctor: issues found');
  process.exit(1);
}

console.log('\nrunway-doctor: all checks passed');
process.exit(0);
