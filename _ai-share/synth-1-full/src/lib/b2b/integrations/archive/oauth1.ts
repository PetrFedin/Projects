/**
 * OAuth 1.0a HMAC-SHA1 signature (RFC 5849).
 * Used by NuOrder API (GitHub: jacobsvante/nuorder). No external deps; Node crypto or Web Crypto.
 */

function rfc3986(s: string): string {
  return encodeURIComponent(s)
    .replace(/!/g, '%21')
    .replace(/'/g, '%27')
    .replace(/\(/g, '%28')
    .replace(/\)/g, '%29')
    .replace(/\*/g, '%2A')
    .replace(/~/g, '%7E');
}

function hmacSha1Base64(key: string, message: string): string {
  // Node: use built-in crypto (sync HMAC). In browser this file should not be used (NuOrder calls are server-only).
  try {
    if (typeof process !== 'undefined' && process.versions?.node) {
      const { createHmac } = require('crypto');
      return createHmac('sha1', key).update(message, 'utf8').digest('base64');
    }
  } catch {
    // ignore
  }
  return '';
}

export interface OAuth1Config {
  consumerKey: string;
  consumerSecret: string;
  token: string;
  tokenSecret: string;
}

/** Build Authorization header for OAuth 1.0a (HMAC-SHA1). */
export function buildOAuth1Header(
  method: string,
  url: string,
  config: OAuth1Config
): string {
  const oauth: Record<string, string> = {
    oauth_consumer_key: config.consumerKey,
    oauth_token: config.token,
    oauth_signature_method: 'HMAC-SHA1',
    oauth_timestamp: Math.floor(Date.now() / 1000).toString(),
    oauth_nonce: Math.random().toString(36).slice(2) + Date.now().toString(36),
    oauth_version: '1.0',
  };

  const u = new URL(url);
  const params: Record<string, string> = { ...oauth };
  u.searchParams.forEach((v, k) => {
    params[k] = v;
  });
  // OAuth 1.0a base string: method, url (no query in base URL), sorted params. Body not included.

  const sorted = Object.keys(params)
    .sort()
    .map((k) => `${rfc3986(k)}=${rfc3986(params[k])}`)
    .join('&');
  const baseString = [method, rfc3986(url.split('?')[0]), rfc3986(sorted)].join('&');
  const signingKey = `${rfc3986(config.consumerSecret)}&${rfc3986(config.tokenSecret)}`;
  const signature = hmacSha1Base64(signingKey, baseString);
  oauth.oauth_signature = signature;

  const header = Object.keys(oauth)
    .sort()
    .map((k) => `${rfc3986(k)}="${rfc3986(oauth[k])}"`)
    .join(', ');
  return `OAuth ${header}`;
}
