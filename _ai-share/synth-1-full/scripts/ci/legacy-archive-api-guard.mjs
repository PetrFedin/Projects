#!/usr/bin/env node
/**
 * На PR: новый путь `src/app/api/b2b/archive/.../route.ts` требует правок в docs/adr/ или docs/ci/.
 */
import { execSync } from 'node:child_process';

const isPR = process.env.GITHUB_EVENT_NAME === 'pull_request';
if (!isPR) process.exit(0);

const baseSha = process.env.PR_BASE_SHA;
const headSha = process.env.PR_HEAD_SHA;
if (!baseSha || !headSha) {
  console.warn('[legacy-archive-api-guard] skip: PR_BASE_SHA / PR_HEAD_SHA unset');
  process.exit(0);
}

const added = execSync(`git diff --name-only --diff-filter=A ${baseSha}...${headSha}`, {
  encoding: 'utf8',
})
  .split('\n')
  .map((s) => s.trim())
  .filter(Boolean);

const archiveRoutes = added.filter(
  (f) => f.startsWith('src/app/api/b2b/archive/') && f.endsWith('/route.ts')
);
if (archiveRoutes.length === 0) process.exit(0);

if (process.env.ALLOW_NEW_B2B_ARCHIVE_API === '1') {
  console.warn('[legacy-archive-api-guard] ALLOW_NEW_B2B_ARCHIVE_API=1 — skip');
  process.exit(0);
}

const allChanged = execSync(`git diff --name-only ${baseSha}...${headSha}`, { encoding: 'utf8' });
const hasDoc = allChanged.split('\n').some((line) => {
  const f = line.trim();
  return f.startsWith('docs/adr/') || f.startsWith('docs/ci/');
});

if (!hasDoc) {
  console.error(
    '[legacy-archive-api-guard] Новые маршруты b2b/archive требуют docs/adr/ или docs/ci/:\n',
    archiveRoutes.join('\n')
  );
  process.exit(1);
}
process.exit(0);
