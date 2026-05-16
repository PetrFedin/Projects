/** Fail fast before Next: supported Node range + installed app deps (Next 15.3.x breaks on Node 24+ here). */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const major = Number(process.versions.node.split('.')[0]);
const minMajor = 20;
const maxExclusive = 24;

if (!Number.isFinite(major) || major < minMajor || major >= maxExclusive) {
  // eslint-disable-next-line no-console -- bootstrap script
  console.error(
    `[synth-1-full] Unsupported Node.js ${process.version}. Use Node ${minMajor}.x–${maxExclusive - 1}.x (see .nvmrc). Example: nvm use`
  );
  process.exit(1);
}

const pkgRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const nextPkg = path.join(pkgRoot, 'node_modules', 'next', 'package.json');
const skipDepsCheck = process.env.SYNTH_SKIP_DEPS_CHECK === '1';
if (!skipDepsCheck && !fs.existsSync(nextPkg)) {
  // eslint-disable-next-line no-console -- bootstrap script
  console.error(
    `[synth-1-full] Dependencies missing (no node_modules/next). Install from monorepo root:\n` +
      `  npm run synth-1:install\n` +
      `or reproducible:\n` +
      `  cd _ai-share/synth-1-full && npm ci\n` +
      `Full bootstrap: bash scripts/bootstrap-monorepo-dev.sh (from Projects root)`
  );
  process.exit(1);
}
