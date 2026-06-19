#!/usr/bin/env node
/**
 * Wave 54–56: ACK archive S3 lifecycle — 7 year retention (2555 days).
 * Usage: node scripts/workshop2-ack-s3-lifecycle-apply.mjs [--apply]
 *
 * Retention steps (ops):
 * 1. Set WORKSHOP2_ACK_ARCHIVE_S3_BUCKET to prod compliance bucket.
 * 2. Dry-run: node scripts/workshop2-ack-s3-lifecycle-apply.mjs — review printed AWS CLI.
 * 3. Apply via approved pipeline: re-run with --apply, execute put-bucket-lifecycle-configuration.
 * 4. Verify: aws s3api get-bucket-lifecycle-configuration --bucket $BUCKET
 * 5. Quarterly: node scripts/workshop2-ack-restore-drill-quarterly.mjs --prod
 */
const bucket = String(process.env.WORKSHOP2_ACK_ARCHIVE_S3_BUCKET ?? '').trim();
const dryRun = !process.argv.includes('--apply');

const lifecycle = {
  Rules: [
    {
      ID: 'workshop2-ack-7y-retention',
      Status: 'Enabled',
      Filter: { Prefix: 'workshop2-ack/' },
      Expiration: { Days: 2555 },
    },
  ],
};

const stepsRu = [
  'Шаг 1: bucket WORKSHOP2_ACK_ARCHIVE_S3_BUCKET задан в prod vault.',
  'Шаг 2: dry-run скрипта — проверить prefix workshop2-ack/ и Expiration 2555 дней (≈7 лет).',
  'Шаг 3: put-bucket-lifecycle-configuration через approved ops pipeline (--apply).',
  'Шаг 4: get-bucket-lifecycle-configuration — rule workshop2-ack-7y-retention Enabled.',
  'Шаг 5: ежеквартальный ack-restore-drill --prod + journal .planning/workshop2-ack-restore-drill-last.json.',
];

const commands = [
  `# Bucket: ${bucket || '(set WORKSHOP2_ACK_ARCHIVE_S3_BUCKET)'}`,
  `aws s3api put-bucket-lifecycle-configuration --bucket ${bucket || 'YOUR_BUCKET'} --lifecycle-configuration '${JSON.stringify(lifecycle)}'`,
  '# Verify:',
  `aws s3api get-bucket-lifecycle-configuration --bucket ${bucket || 'YOUR_BUCKET'}`,
];

console.log('[ack-s3-lifecycle-apply] dry-run:', dryRun);
console.log('[ack-s3-lifecycle-apply] 7y retention steps RU:');
for (const s of stepsRu) console.log('  -', s);
for (const cmd of commands) console.log(cmd);
if (dryRun) {
  console.log('[ack-s3-lifecycle-apply] Re-run with --apply to print apply reminder (manual copy-paste recommended).');
} else {
  console.warn('[ack-s3-lifecycle-apply] --apply prints commands only — execute via approved ops pipeline.');
}
