#!/usr/bin/env node
/**
 * Staging env validator — чеклист перед deploy:runway-check.
 * Читает .env.local / .env и process.env.
 * Без STAGING_BASE_URL — skip (exit 0), чтобы deploy:runway-check работал локально.
 *
 *   node scripts/runway-staging-env-check.mjs
 *   STAGING_BASE_URL=https://staging.example.com node scripts/runway-staging-env-check.mjs
 */
import { readFileSync, existsSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import dotenv from 'dotenv';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');

for (const file of ['.env', '.env.local']) {
  const p = join(root, file);
  if (existsSync(p)) {
    dotenv.config({ path: p, override: file === '.env.local' });
  }
}

const stagingBase = process.env.STAGING_BASE_URL?.trim();

if (!stagingBase) {
  console.log('[SKIP] runway-staging-env-check: STAGING_BASE_URL не задан — пропуск');
  process.exit(0);
}

console.log('\n=== Runway staging env check ===');
console.log(`STAGING_BASE_URL: ${stagingBase}\n`);

let failures = 0;
let warnings = 0;

function env(key) {
  return process.env[key]?.trim() ?? '';
}

function ok(label) {
  console.log(`[OK] ${label}`);
}

function fail(label, detail) {
  failures += 1;
  console.error(`[FAIL] ${label}${detail ? ` — ${detail}` : ''}`);
}

function warn(label, detail) {
  warnings += 1;
  console.warn(`[WARN] ${label}${detail ? ` — ${detail}` : ''}`);
}

function requireKey(key, label = key) {
  if (!env(key)) {
    fail(label, `переменная ${key} обязательна для staging deploy`);
    return false;
  }
  ok(label);
  return true;
}

requireKey('STAGING_BASE_URL');

if (env('RUNWAY_EMBED_REQUIRE_TOKEN') === '1') {
  requireKey('NEXT_PUBLIC_RUNWAY_EMBED_TOKEN', 'embed token (RUNWAY_EMBED_REQUIRE_TOKEN=1)');
}

const analyticsStore = env('RUNWAY_ANALYTICS_STORE').toLowerCase();
if (analyticsStore === 'postgres') {
  requireKey('DATABASE_URL', 'DATABASE_URL (RUNWAY_ANALYTICS_STORE=postgres)');
} else {
  ok('analytics store (file default)');
}

if (env('RUNWAY_AB_TEST_ENABLED') === '1') {
  ok('RUNWAY_AB_TEST_ENABLED=1');
  const scrollPath = join(root, 'public/data/scroll-experience.json');
  if (existsSync(scrollPath)) {
    try {
      const cfg = JSON.parse(readFileSync(scrollPath, 'utf8'));
      const flagship = Array.isArray(cfg.abTestFlagshipSlugs) ? cfg.abTestFlagshipSlugs : [];
      if (flagship.length === 0) {
        warn(
          'A/B flagship slugs',
          'RUNWAY_AB_TEST_ENABLED=1, но abTestFlagshipSlugs пуст в scroll-experience.json'
        );
      } else {
        ok(`abTestFlagshipSlugs: ${flagship.join(', ')}`);
      }
    } catch {
      warn('scroll-experience.json', 'не удалось прочитать для проверки A/B');
    }
  }
} else {
  ok('A/B test выключен (RUNWAY_AB_TEST_ENABLED не задан)');
}

const scrollPath = join(root, 'public/data/scroll-experience.json');
if (existsSync(scrollPath)) {
  try {
    const cfg = JSON.parse(readFileSync(scrollPath, 'utf8'));
    const cdn = cfg.videoCdnBaseUrl?.trim() || cfg.brandVideoCdnBaseUrl?.trim();
    if (!cdn || cdn.includes('YOUR_BRAND') || cdn.includes('example.com')) {
      warn('videoCdnBaseUrl', 'placeholder или не задан — hero видео могут грузиться с origin');
    } else {
      ok(`video CDN: ${cdn}`);
    }
  } catch {
    warn('scroll-experience.json', 'не удалось проверить CDN base');
  }
}

if (!env('NEXT_PUBLIC_GA4_MEASUREMENT_ID')) {
  warn('GA4', 'NEXT_PUBLIC_GA4_MEASUREMENT_ID не задан — GA4 mirror отключён');
} else {
  ok('GA4 measurement id');
}

if (!env('NEXT_PUBLIC_POSTHOG_KEY')) {
  warn('PostHog', 'NEXT_PUBLIC_POSTHOG_KEY не задан — PostHog mirror отключён');
} else {
  ok('PostHog key');
}

if (env('RUNWAY_UPLOAD_ENABLED') === '1') {
  const r2Keys = ['RUNWAY_R2_ACCOUNT_ID', 'RUNWAY_R2_ACCESS_KEY', 'RUNWAY_R2_SECRET_KEY', 'RUNWAY_R2_BUCKET'];
  const missingR2 = r2Keys.filter((k) => !env(k));
  if (missingR2.length) {
    fail('R2 upload', `RUNWAY_UPLOAD_ENABLED=1, не задано: ${missingR2.join(', ')}`);
  } else {
    ok('R2 upload credentials');
  }
}

console.log(`\n--- Итог: ${failures} ошибок, ${warnings} предупреждений ---\n`);

if (failures > 0) {
  console.error('Staging env check не пройден. Исправьте .env.local / CI secrets.');
  process.exit(1);
}

console.log('Staging env check пройден.');
process.exit(0);
