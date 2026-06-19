#!/usr/bin/env node
/**
 * Стабильный локальный прогон Runway E2E на production build (без dev:compile OOM).
 *
 *   npm run test:e2e:runway:stable
 *   RUNWAY_E2E_CLEAN=1 npm run test:e2e:runway:stable   — alias (clean всегда включён)
 *
 * Цепочка: clean → validate → test:e2e:runway:prod
 * Playwright webServer собирает .next-e2e с E2E=true / NEXT_PUBLIC_E2E=true (client bundle).
 */
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { spawnSync } from 'node:child_process';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');

function run(cmd, args, env = {}) {
  const res = spawnSync(cmd, args, {
    cwd: root,
    stdio: 'inherit',
    env: { ...process.env, ...env },
    shell: process.platform === 'win32',
  });
  if (res.status !== 0) process.exit(res.status ?? 1);
}

console.log('[runway-e2e-stable] clean:runway-caches');
run('npm', ['run', 'clean:runway-caches']);

console.log('[runway-e2e-stable] kill stale :3123 and concurrent next build');
run('node', ['scripts/kill-e2e-port.cjs']);
spawnSync('pkill', ['-f', `${root}/node_modules/.bin/next build`], { stdio: 'ignore' });

console.log('[runway-e2e-stable] ensure hero scroll-video in products.json');
run('node', ['scripts/patch-runway-hero-products.mjs', '--apply']);
run('node', ['scripts/validate-runway-content.mjs']);

console.log('[runway-e2e-stable] test:e2e:runway:prod (webServer → .next-e2e prod build with E2E flags)');
run('npm', ['run', 'test:e2e:runway:prod'], {
  RUNWAY_E2E_STABLE: '1',
  RUNWAY_E2E_NODE_HEAP: process.env.RUNWAY_E2E_NODE_HEAP ?? '6144',
});
