

/** Wave 57: restore cwd after probe tests that chdir to tmp (runInBand pollution). */
const WORKSHOP2_JEST_ROOT = process.cwd();
afterEach(() => {
  try {
    process.chdir(WORKSHOP2_JEST_ROOT);
  } catch {
    /* ignore */
  }
});
