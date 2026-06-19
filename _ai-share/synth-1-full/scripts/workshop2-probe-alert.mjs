#!/usr/bin/env node
/**
 * Wave 49–57: curl integration-probes, fail-closed exit 1 if wave57 < 10.
 * Usage: node scripts/workshop2-probe-alert.mjs [BASE_URL]
 */
import { spawnSync } from 'node:child_process';

const baseUrl = (process.argv[2] || process.env.WORKSHOP2_PROBE_BASE_URL || 'http://127.0.0.1:3123').replace(
  /\/$/,
  ''
);
const url = `${baseUrl}/api/workshop2/integration-probes`;

const res = spawnSync('curl', ['-sfS', url], { encoding: 'utf8', maxBuffer: 16 * 1024 * 1024 });
if (res.status !== 0) {
  console.error(`[probe-alert] curl failed (${res.status}): ${url}`);
  console.error(res.stderr || res.stdout);
  process.exit(1);
}

let json;
try {
  json = JSON.parse(res.stdout);
} catch {
  console.error('[probe-alert] invalid JSON from integration-probes');
  process.exit(1);
}

const wave52Score = json.wave52ProdLiveReady?.wave52ProdLiveReady ?? 0;
const wave54Score = json.wave54ProdHardeningReady?.wave54ProdHardeningReady ?? 0;
const wave55Score = json.wave55InvestorFreezeReady?.wave55InvestorFreezeReady ?? 0;
const wave56Score = json.wave56PostFreezeReady?.wave56PostFreezeReady ?? 0;
const wave57Score = json.wave57PostFreezeLive?.wave57PostFreezeLive ?? 0;
const wave57Ok = json.wave57PostFreezeLive?.ok === true;
const wave58Score = json.wave58InvestorShowReady?.wave58InvestorShowReady ?? 0;
const wave58Ok = json.wave58InvestorShowReady?.ok === true;

console.log(
  JSON.stringify(
    {
      ok: wave58Ok && wave58Score >= 12,
      baseUrl,
      wave52ProdLiveReady: wave52Score,
      wave54ProdHardeningReady: wave54Score,
      wave55InvestorFreezeReady: wave55Score,
      wave56PostFreezeReady: wave56Score,
      wave57PostFreezeLive: wave57Score,
      wave58InvestorShowReady: wave58Score,
    },
    null,
    2
  )
);

if (!wave58Ok || wave58Score < 12) {
  console.error(
    `[probe-alert] FAIL wave58InvestorShowReady=${wave58Score} (need >=12, ok=${wave58Ok}); wave57=${wave57Score}`
  );
  process.exit(1);
}

console.log('[probe-alert] PASS wave58InvestorShowReady >= 12');
