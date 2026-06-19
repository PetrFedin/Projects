#!/usr/bin/env node
/**
 * Verify Runway hero video URLs resolve via configured CDN base.
 *   npm run verify:runway-cdn
 *   node scripts/runway-cdn-verify.mjs --base https://staging.example.com
 */
import { readFileSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const base = (process.argv.find((a) => a.startsWith('--base='))?.split('=')[1]
  ?? process.env.STAGING_BASE_URL
  ?? process.env.RUNWAY_VERIFY_BASE
  ?? 'http://127.0.0.1:3000').replace(/\/$/, '');

const config = JSON.parse(
  readFileSync(join(root, 'public/data/scroll-experience.json'), 'utf8')
);
const products = JSON.parse(readFileSync(join(root, 'public/data/products.json'), 'utf8'));
const hero = new Set(config.heroProductSlugs ?? []);
const cdnBase = config.videoCdnBaseUrl?.trim();

let failures = 0;

async function headOk(url) {
  try {
    const res = await fetch(url, { method: 'HEAD', signal: AbortSignal.timeout(8000) });
    return res.ok || res.status === 405;
  } catch {
    return false;
  }
}

console.log(`\n=== Runway CDN verify ===\nBASE=${base}\n`);

if (!cdnBase) {
  console.warn('[WARN] videoCdnBaseUrl не задан — локальные /videos/* пути (dev OK)');
}

for (const p of products.filter((x) => hero.has(x.slug))) {
  const url = p.scrollVideoUrl?.startsWith('http')
    ? p.scrollVideoUrl
    : cdnBase
      ? `${cdnBase.replace(/\/$/, '')}${p.scrollVideoUrl}`
      : `${base}${p.scrollVideoUrl}`;
  const ok = await headOk(url);
  if (ok) console.log(`[OK] ${p.slug} → ${url}`);
  else {
    failures++;
    console.error(`[FAIL] ${p.slug} → ${url}`);
  }
}

if (failures) {
  console.error(`\nrunway-cdn-verify: ${failures} failure(s)\n`);
  process.exit(1);
}
console.log('\nrunway-cdn-verify: passed\n');
