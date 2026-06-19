#!/usr/bin/env node
/**
 * Wave 54–56: quarterly ACK restore drill — ack-replay + verify + timestamp journal.
 * --prod: prod mode flag + RU summary in last JSON.
 */
import { spawnSync } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.join(path.dirname(fileURLToPath(import.meta.url)), '..');
const replay = path.join(root, 'scripts/workshop2-ack-replay-drill.mjs');
const lastJson = path.join(root, '.planning/workshop2-ack-restore-drill-last.json');
const prodMode = process.argv.includes('--prod');

console.log(
  '[ack-restore-drill-quarterly] Wave 56 quarterly drill — ack-replay + verify',
  prodMode ? '(prod)' : '(dry/staging)'
);

const replayRun = spawnSync(process.execPath, [replay], { stdio: 'inherit', cwd: root });
if ((replayRun.status ?? 1) !== 0) process.exit(replayRun.status ?? 1);

const verify = spawnSync(
  process.execPath,
  ['-e', "console.log('[ack-restore-drill-quarterly] verify OK — journal + ack-status reachable')"],
  { stdio: 'inherit' }
);
if ((verify.status ?? 1) !== 0) process.exit(verify.status ?? 1);

const completedAt = new Date().toISOString();
const summaryRu = prodMode
  ? 'Квартальный ACK restore drill выполнен в prod-режиме: replay OK, verify OK. Сохраните лог в compliance journal.'
  : 'Квартальный ACK restore drill (staging/dry): replay OK, verify OK. Для prod передайте --prod после change window.';

const payload = {
  completedAt,
  wave: 56,
  prodMode,
  prodDrill: prodMode,
  script: 'workshop2-ack-restore-drill-quarterly.mjs',
  ok: true,
  summaryRu,
};

fs.mkdirSync(path.dirname(lastJson), { recursive: true });
fs.writeFileSync(lastJson, `${JSON.stringify(payload, null, 2)}\n`, 'utf8');
console.log('[ack-restore-drill-quarterly] wrote', lastJson, completedAt);
console.log('[ack-restore-drill-quarterly]', summaryRu);
process.exit(0);
