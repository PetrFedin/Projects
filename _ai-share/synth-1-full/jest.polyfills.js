/**
 * Jest setupFiles — must run before test imports (pg needs TextEncoder in jsdom workers).
 */
const { TextDecoder, TextEncoder } = require('node:util');

function installTextCodec() {
  if (typeof globalThis.TextEncoder === 'undefined') {
    globalThis.TextEncoder = TextEncoder;
  }
  if (typeof globalThis.TextDecoder === 'undefined') {
    globalThis.TextDecoder = TextDecoder;
  }
  if (typeof global.TextEncoder === 'undefined') {
    global.TextEncoder = TextEncoder;
  }
  if (typeof global.TextDecoder === 'undefined') {
    global.TextDecoder = TextDecoder;
  }
}

installTextCodec();

// Повторная установка — защита от pollution между test suites в полном прогоне.
if (typeof module !== 'undefined' && module.exports) {
  module.exports.installTextCodec = installTextCodec;
}
