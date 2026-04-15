/** Fail fast before Next when Node is outside the supported range (Next 15.3.x breaks on Node 24+ here). */
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
