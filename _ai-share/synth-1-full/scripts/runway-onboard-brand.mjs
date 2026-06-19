#!/usr/bin/env node
/**
 * Онбординг первого бренда на runway (без S3 upload pipeline).
 *
 * Usage:
 *   node scripts/runway-onboard-brand.mjs <brandName> <heroSlug> [--apply]
 */
import { spawnSync } from 'node:child_process';
import { readFileSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const productsPath = join(root, 'public/data/products.json');
const scrollConfigPath = join(root, 'public/data/scroll-experience.json');

const brandName = process.argv[2]?.trim();
const heroSlug = process.argv[3]?.trim();
const apply = process.argv.includes('--apply');

if (!brandName || !heroSlug) {
  console.error('Usage: node scripts/runway-onboard-brand.mjs <brandName> <heroSlug> [--apply]');
  process.exit(1);
}

const products = JSON.parse(readFileSync(productsPath, 'utf8'));
const scrollConfig = JSON.parse(readFileSync(scrollConfigPath, 'utf8'));

const brandProducts = products.filter((p) => p.brand === brandName);
const heroProduct = products.find((p) => p.slug === heroSlug);

const errors = [];
if (brandProducts.length === 0) {
  errors.push(`Бренд не найден в каталоге: "${brandName}"`);
}
if (!heroProduct) {
  errors.push(`Hero SKU не найден: ${heroSlug}`);
} else if (heroProduct.brand !== brandName) {
  errors.push(`SKU ${heroSlug} принадлежит бренду "${heroProduct.brand}", не "${brandName}"`);
}

if (errors.length > 0) {
  console.error(JSON.stringify({ ok: false, errors }, null, 2));
  process.exit(1);
}

console.log(`\n=== Runway onboarding: ${brandName} / ${heroSlug} ===\n`);

if (apply) {
  const enable = spawnSync(
    'node',
    ['scripts/runway-enable-product.mjs', heroSlug, '--apply'],
    { cwd: root, encoding: 'utf8' }
  );
  if (enable.status !== 0) {
    console.error(enable.stderr || enable.stdout);
    process.exit(enable.status ?? 1);
  }
  console.log('[OK] runway-enable-product --apply');
} else {
  console.log('[DRY-RUN] Добавьте --apply для записи products.json + runway-product-patches');
}

const validate = spawnSync('node', ['scripts/validate-runway-content.mjs'], {
  cwd: root,
  encoding: 'utf8',
});
if (validate.status !== 0) {
  console.warn('[WARN] validate-runway-content:', validate.stderr || validate.stdout);
} else {
  console.log('[OK] validate-runway-content');
}

const baseUrl = process.env.RUNWAY_ONBOARD_BASE_URL?.trim() || 'http://127.0.0.1:3000';

const checklist = [
  { step: 1, title: 'Включить scroll-video для hero SKU', action: apply ? 'Выполнено (--apply)' : `node scripts/runway-enable-product.mjs ${heroSlug} --apply` },
  { step: 2, title: 'CDN video checklist', action: 'node scripts/runway-cdn-migrate.mjs --base https://media.YOUR_BRAND.com' },
  { step: 3, title: 'scroll-experience.json — videoCdnBaseUrl + brandRunwayEnabled', action: `brandRunwayEnabled["${brandName}"]: true, heroProductSlugs includes ${heroSlug}` },
  { step: 4, title: 'Preview PDP runway', url: `${baseUrl}/products/${heroSlug}?view=runway` },
  { step: 5, title: 'Health check', url: `${baseUrl}/api/runway/health` },
  { step: 6, title: 'Runway config API', url: `${baseUrl}/api/runway/config` },
  { step: 7, title: 'GA4 / PostHog (production)', action: 'NEXT_PUBLIC_GA4_MEASUREMENT_ID, NEXT_PUBLIC_POSTHOG_KEY в env' },
  { step: 8, title: 'A/B test (опционально, 2 недели)', action: 'RUNWAY_AB_TEST_ENABLED=1 (не abTestRunwayDefault в JSON)' },
  { step: 9, title: 'Postgres analytics (production)', action: 'RUNWAY_ANALYTICS_STORE=postgres, DATABASE_URL, psql -f docs/runway-analytics-migration.sql' },
  { step: 10, title: 'Brand admin analytics tab', url: `${baseUrl}/brand/profile?tab=runway-analytics` },
  { step: 11, title: 'Local pre-staging gate (перед remote staging)', action: 'npm run pre-deploy:runway:local' },
];

console.log('\n--- onboarding checklist ---\n');
for (const item of checklist) {
  console.log(`${item.step}. ${item.title}`);
  if (item.url) console.log(`   URL: ${item.url}`);
  if (item.action) console.log(`   → ${item.action}`);
  console.log('');
}

console.log('Дополнительно:');
console.log(`  node scripts/runway-doctor.mjs --skip-health`);
console.log(`  npm test -- --testPathPattern=runway`);
console.log(`  npm run pre-deploy:runway:local`);
console.log(`  STAGING_BASE_URL=https://staging.example.com npm run pre-deploy:runway`);
console.log(`  npm run smoke:runway-staging -- --base ${baseUrl}`);
console.log(`  Brand preview: ${baseUrl}/brand/profile?tab=runway-preview\n`);

console.log(
  JSON.stringify(
    {
      ok: validate.status === 0,
      brandName,
      heroSlug,
      apply,
      currentScrollMode: heroProduct.displayMode,
      brandRunwayEnabled: scrollConfig.brandRunwayEnabled?.[brandName] ?? null,
      checklist,
    },
    null,
    2
  )
);

process.exit(validate.status === 0 ? 0 : 1);
