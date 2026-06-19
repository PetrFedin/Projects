/**
 * Jest setup for component tests.
 * Enables @testing-library/jest-dom matchers (e.g. toBeInTheDocument).
 */
import '@testing-library/jest-dom';

import { TextDecoder, TextEncoder } from 'node:util';

if (typeof globalThis.TextEncoder === 'undefined') {
  globalThis.TextEncoder = TextEncoder as typeof globalThis.TextEncoder;
}
if (typeof globalThis.TextDecoder === 'undefined') {
  globalThis.TextDecoder = TextDecoder as typeof globalThis.TextDecoder;
}


/** Wave 57: restore cwd after probe tests that chdir to tmp (runInBand pollution). */
const WORKSHOP2_JEST_ROOT = process.cwd();
afterEach(() => {
  try {
    process.chdir(WORKSHOP2_JEST_ROOT);
  } catch {
    /* ignore */
  }
});

