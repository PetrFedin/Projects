#!/usr/bin/env node
/**
 * Wave 57 — full workshop2 unit gate: core (139) + supplement TZ/BOM suites.
 * Runs sequentially (--runInBand) to avoid chdir pollution between wave probe tests.
 * Parses jest --json (not stdout regex) so large failure logs never yield 0/0 counts.
 */
import { spawnSync } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';

const root = process.cwd();
const manifestPath = path.join(root, 'scripts/workshop2-unit-manifest.json');
const manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf8'));
const MIN_PASSED = 1445;
const jestBin = path.join(root, 'node_modules/jest/bin/jest.js');

const defaultDbUrl =
  process.env.WORKSHOP2_DATABASE_URL?.trim() ||
  'postgresql://workshop2:workshop2_dev@127.0.0.1:5433/workshop2';

function runJest(label, files) {
  if (!files.length) return { ok: true, passed: 0, failed: 0, total: 0 };
  const jsonPath = path.join(root, `.jest-unit-green-${label}.json`);
  try {
    fs.unlinkSync(jsonPath);
  } catch {
    /* fresh output */
  }

  const r = spawnSync(
    process.execPath,
    [
      jestBin,
      '--runInBand',
      '--silent',
      '--noStackTrace',
      '--json',
      '--outputFile',
      jsonPath,
      ...files,
    ],
    {
      cwd: root,
      encoding: 'utf8',
      maxBuffer: 20 * 1024 * 1024,
      env: {
        ...process.env,
        WORKSHOP2_DATABASE_URL: defaultDbUrl,
        FORCE_COLOR: '0',
      },
    }
  );

  let passed = 0;
  let failed = 0;
  let total = 0;
  let parsed = false;

  try {
    const raw = fs.readFileSync(jsonPath, 'utf8');
    const json = JSON.parse(raw);
    passed = Number(json.numPassedTests ?? 0);
    failed = Number(json.numFailedTests ?? 0);
    total = Number(json.numTotalTests ?? passed + failed);
    parsed = total > 0 || json.success === true;
  } catch {
    /* fall through to stderr parse */
  }

  if (!parsed) {
    const out = `${r.stdout ?? ''}${r.stderr ?? ''}`.replace(/\u001b\[[0-9;]*m/g, '');
    const mFail = out.match(/Tests:\s+(\d+) failed,\s+(\d+) passed,\s+(\d+) total/);
    const mPass = out.match(/Tests:\s+(\d+) passed,\s+(\d+) total/);
    const m = mFail ?? (mPass ? [null, '0', mPass[1], mPass[2]] : null);
    if (m) {
      failed = Number(m[1]);
      passed = Number(m[2]);
      total = Number(m[3]);
      parsed = true;
    }
  }

  if (r.status !== 0) {
    console.error(`[workshop2-unit-green] FAIL ${label}`);
    if (!parsed) console.error((r.stderr ?? r.stdout ?? '').slice(-4000));
  }

  try {
    fs.unlinkSync(jsonPath);
  } catch {
    /* ignore */
  }

  return { ok: r.status === 0, passed, failed, total };
}

const core = runJest('core', manifest.core);
const supplement = runJest('supplement', manifest.supplement ?? []);
const passed = core.passed + supplement.passed;
const failed = core.failed + supplement.failed;
const total = core.passed + core.failed + supplement.passed + supplement.failed;

console.log(
  `Tests: ${failed} failed, ${passed} passed, ${total} total (core ${core.passed}+supplement ${supplement.passed})`
);

if (!core.ok || !supplement.ok || failed > 0) {
  process.exit(1);
}
if (passed < MIN_PASSED) {
  console.error(`[workshop2-unit-green] FAIL need >=${MIN_PASSED} passed, got ${passed}`);
  process.exit(1);
}
console.log(`[workshop2-unit-green] PASS >=${MIN_PASSED} (${passed} passed, 0 failed)`);
