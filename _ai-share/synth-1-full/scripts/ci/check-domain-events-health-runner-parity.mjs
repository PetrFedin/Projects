#!/usr/bin/env node

import { readFileSync } from 'node:fs';

const TS_RUNNER = new URL('./check-domain-events-health-contract.ts', import.meta.url);
const MJS_RUNNER = new URL('./check-domain-events-health-contract.mjs', import.meta.url);
const REQUIRED_DETAILS_BY_CODE = {
  output_format_invalid: ['received', 'allowed'],
  http_error: ['status', 'statusText', 'url'],
  contract_validation_failed: ['errors', 'url'],
  contract_validation_ok: ['version', 'url', 'status'],
};

function extractCodes(source) {
  const matches = [...source.matchAll(/code:\s*'([^']+)'/g)];
  return new Set(matches.map((m) => m[1]));
}

function diff(a, b) {
  return [...a].filter((x) => !b.has(x));
}

function hasCode(source, code) {
  return source.includes(`code: '${code}'`);
}

function hasDetailKey(source, key) {
  const escaped = key.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const explicit = new RegExp(`\\b${escaped}\\s*:`);
  const shorthand = new RegExp(`\\b${escaped}\\b\\s*[,}]`);
  return explicit.test(source) || shorthand.test(source);
}

function main() {
  const tsSource = readFileSync(TS_RUNNER, 'utf8');
  const mjsSource = readFileSync(MJS_RUNNER, 'utf8');

  const tsCodes = extractCodes(tsSource);
  const mjsCodes = extractCodes(mjsSource);

  const onlyTs = diff(tsCodes, mjsCodes);
  const onlyMjs = diff(mjsCodes, tsCodes);
  const detailsMismatches = [];

  for (const [code, keys] of Object.entries(REQUIRED_DETAILS_BY_CODE)) {
    const missingInTs = [];
    const missingInMjs = [];
    if (!hasCode(tsSource, code)) {
      missingInTs.push('__code__');
    }
    if (!hasCode(mjsSource, code)) {
      missingInMjs.push('__code__');
    }
    for (const k of keys) {
      if (!hasDetailKey(tsSource, k)) missingInTs.push(k);
      if (!hasDetailKey(mjsSource, k)) missingInMjs.push(k);
    }
    if (missingInTs.length || missingInMjs.length) {
      detailsMismatches.push({ code, missingInTs, missingInMjs });
    }
  }

  if (onlyTs.length || onlyMjs.length || detailsMismatches.length) {
    console.error(
      JSON.stringify({
        scope: 'domain-events-health-contract',
        level: 'error',
        code: 'runner_parity_failed',
        message: 'Typed and fallback runners are out of parity',
        details: {
          onlyTs,
          onlyMjs,
          detailsMismatches,
        },
      })
    );
    process.exit(1);
  }

  console.log(
    JSON.stringify({
      scope: 'domain-events-health-contract',
      level: 'info',
      code: 'runner_parity_ok',
      message: 'Typed and fallback runners are in parity for codes and details',
      details: {
        codes: [...tsCodes].sort(),
        requiredDetailsByCode: REQUIRED_DETAILS_BY_CODE,
      },
    })
  );
}

main();
