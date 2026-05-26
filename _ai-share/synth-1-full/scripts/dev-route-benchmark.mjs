#!/usr/bin/env node
/**
 * Dev benchmark: GET latency по матрице smoke + cabinet hubs.
 * Требует запущенный next dev (рекомендуется dev:fast на :3000).
 *
 * Usage:
 *   npm run dev:bench:routes
 *   DEV_BENCH_BASE_URL=http://127.0.0.1:3000 npm run dev:bench:routes
 *   DEV_BENCH_WARMUP=1 DEV_BENCH_JSON=1 npm run dev:bench:routes
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '..');

const BASE = (process.env.DEV_BENCH_BASE_URL ?? 'http://127.0.0.1:3000').replace(/\/$/, '');
const WARMUP_ROUNDS = Number(process.env.DEV_BENCH_WARMUP ?? '1');
const SLOW_WARN_MS = Number(process.env.DEV_BENCH_SLOW_MS ?? '3000');
const TIMEOUT_MS = Number(process.env.DEV_BENCH_TIMEOUT_MS ?? '60000');
const PAUSE_MS = Number(process.env.DEV_BENCH_PAUSE_MS ?? '800');
const RETRY_ON_FAIL = process.env.DEV_BENCH_RETRY !== '0';
const MAX_FAIL_RETRIES = Number(process.env.DEV_BENCH_FAIL_RETRIES ?? '3');
const MAX_MS = process.env.DEV_BENCH_MAX_MS ? Number(process.env.DEV_BENCH_MAX_MS) : null;
const FAIL_ON_SLOW = process.env.DEV_BENCH_FAIL_ON_SLOW === '1';
const JSON_OUT = process.env.DEV_BENCH_JSON === '1';

/** Кабинетные хабы — приоритет для «нормы» скорости разделов. */
const CABINET_HUBS = [
  { path: '/', name: 'Главная' },
  { path: '/admin', name: 'Admin hub' },
  { path: '/shop', name: 'Shop hub' },
  { path: '/brand', name: 'Brand hub' },
  { path: '/client', name: 'Client hub' },
  { path: '/distributor', name: 'Distributor hub' },
  { path: '/factory/production', name: 'Factory production' },
  { path: '/factory/supplier', name: 'Factory supplier' },
  { path: '/vendor', name: 'Vendor hub' },
];

function extractSmokeRoutes() {
  const spec = fs.readFileSync(path.join(ROOT, 'e2e/smoke.spec.ts'), 'utf8');
  const routes = [];
  const rx = /\{\s*path:\s*'([^']+)',\s*name:\s*'([^']+)'\s*\}/g;
  for (const m of spec.matchAll(rx)) {
    routes.push({ path: m[1], name: m[2] });
  }
  return routes;
}

function mergeRoutes() {
  const seen = new Set();
  const out = [];
  const list = process.env.DEV_BENCH_ONLY_HUBS === '1' ? CABINET_HUBS : [...CABINET_HUBS, ...extractSmokeRoutes()];
  const onlyPaths = process.env.DEV_BENCH_PATHS?.split(',').map((p) => p.trim()).filter(Boolean);
  for (const r of list) {
    if (onlyPaths?.length && !onlyPaths.includes(r.path)) continue;
    if (seen.has(r.path)) continue;
    seen.add(r.path);
    out.push(r);
  }
  return out;
}

const HEALTH_TIMEOUT_MS = Number(process.env.DEV_BENCH_HEALTH_TIMEOUT_MS ?? '10000');

async function fetchRoute(routePath, timeoutMs = TIMEOUT_MS) {
  const url = `${BASE}${routePath}`;
  const ac = new AbortController();
  const timer = setTimeout(() => ac.abort(), timeoutMs);
  const start = performance.now();
  try {
    const res = await fetch(url, {
      signal: ac.signal,
      headers: { Accept: 'text/html' },
      redirect: 'follow',
    });
    const ms = Math.round(performance.now() - start);
    return { status: res.status, ms, ok: res.status < 500 };
  } catch (e) {
    const ms = Math.round(performance.now() - start);
    return { status: 0, ms, ok: false, error: e instanceof Error ? e.message : String(e) };
  } finally {
    clearTimeout(timer);
  }
}

async function benchRoute(route) {
  for (let i = 0; i < WARMUP_ROUNDS; i++) {
    await fetchRoute(route.path);
    if (i < WARMUP_ROUNDS - 1 || WARMUP_ROUNDS > 1) {
      await new Promise((r) => setTimeout(r, PAUSE_MS));
    }
  }
  let sample = await fetchRoute(route.path);
  if (RETRY_ON_FAIL && !sample.ok) {
    for (let attempt = 0; attempt < MAX_FAIL_RETRIES && !sample.ok; attempt++) {
      await new Promise((r) => setTimeout(r, 1500 * (attempt + 1)));
      sample = await fetchRoute(route.path);
    }
  }
  return { ...route, ...sample, slow: sample.ms >= SLOW_WARN_MS };
}

async function assertDevHealthy() {
  for (let attempt = 0; attempt < 4; attempt++) {
    const probe = await fetchRoute('/', HEALTH_TIMEOUT_MS);
    if (probe.ok) {
      await new Promise((r) => setTimeout(r, 2500));
      const confirm = await fetchRoute('/', HEALTH_TIMEOUT_MS);
      if (confirm.ok) return;
    }
    if (probe.status === 0 && attempt >= 1) {
      console.error('[dev-route-benchmark] Dev не отвечает (timeout / connection refused).');
      break;
    }
    const waitMs = 1500 * (attempt + 1);
    console.error(
      `[dev-route-benchmark] Dev нестабилен (GET / → ${probe.status || 'ERR'}), ждём ${waitMs}ms…`
    );
    await new Promise((r) => setTimeout(r, waitMs));
  }
  console.error(
    `[dev-route-benchmark] Dev на ${BASE} не готов.\n` +
      `  npm run stop:stale-dev && npm run dev:fast:clean\n` +
      `  Подождите Ready, затем npm run dev:bench:routes`
  );
  process.exit(1);
}

async function main() {
  if (process.env.DEV_BENCH_SKIP_PREFLIGHT !== '1') {
    const { spawnSync } = await import('node:child_process');
    const pre = spawnSync('node', ['scripts/check-shared-next-conflict.cjs', 'bench'], {
      cwd: ROOT,
      stdio: 'inherit',
    });
    if (pre.status !== 0) process.exit(pre.status ?? 1);
  }

  await assertDevHealthy();

  const routes = mergeRoutes();
  console.error(`[dev-route-benchmark] ${routes.length} routes → ${BASE} (warmup=${WARMUP_ROUNDS}, slow≥${SLOW_WARN_MS}ms)\n`);

  const results = [];
  for (const route of routes) {
    const row = await benchRoute(route);
    results.push(row);
    const flag = !row.ok ? ' FAIL' : row.slow ? ' SLOW' : '';
    console.error(
      `${row.ok ? '✓' : '✗'} ${String(row.ms).padStart(6)}ms ${row.status || 'ERR'} ${route.path}${flag}`
    );
    /** Пауза между маршрутами — не перегружать один next dev cold-compile. */
    await new Promise((r) => setTimeout(r, PAUSE_MS));
  }

  const failed = results.filter((r) => !r.ok);
  const slow = results.filter((r) => r.ok && r.slow);
  const overMax =
    MAX_MS != null && Number.isFinite(MAX_MS)
      ? results.filter((r) => r.ok && r.ms > MAX_MS)
      : [];

  if (JSON_OUT) {
    console.log(JSON.stringify({ base: BASE, results }, null, 2));
  } else {
    console.log('\n| Раздел | ms | HTTP |');
    console.log('|--------|-----|------|');
    for (const r of results) {
      const note = !r.ok ? ' ❌' : r.slow ? ' ⚠️' : '';
      console.log(`| ${r.name} \`${r.path}\` | ${r.ms} | ${r.status || 'ERR'}${note} |`);
    }
  }

  console.error(`\nИтого: ${results.length} маршрутов, ${failed.length} fail, ${slow.length} slow (≥${SLOW_WARN_MS}ms)`);
  if (overMax.length) {
    console.error(`Превышен DEV_BENCH_MAX_MS=${MAX_MS}: ${overMax.map((r) => r.path).join(', ')}`);
  }
  if (failed.length) process.exit(1);
  if (FAIL_ON_SLOW && slow.length) process.exit(1);
  if (overMax.length) process.exit(1);
}

main();
