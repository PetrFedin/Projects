#!/usr/bin/env node
/**
 * Smoke: GET /api/runway/health → 200 (запускать когда dev/e2e сервер уже поднят).
 */
import http from 'node:http';

const base = process.env.RUNWAY_HEALTH_URL?.trim() || 'http://127.0.0.1:3123';
const url = new URL('/api/runway/health', base);

const req = http.get(url, (res) => {
  let body = '';
  res.on('data', (chunk) => {
    body += chunk;
  });
  res.on('end', () => {
    if (res.statusCode !== 200) {
      console.error(`runway health check failed: HTTP ${res.statusCode}\n${body}`);
      process.exit(1);
    }
    try {
      const json = JSON.parse(body);
      if (json.healthy !== true) {
        console.error('runway health check failed: healthy !== true', json);
        process.exit(1);
      }
    } catch {
      console.error('runway health check failed: invalid JSON');
      process.exit(1);
    }
    console.log('runway health check OK');
    process.exit(0);
  });
});

req.on('error', (err) => {
  console.error('runway health check failed:', err.message);
  process.exit(1);
});

req.setTimeout(30_000, () => {
  req.destroy(new Error('timeout'));
});
