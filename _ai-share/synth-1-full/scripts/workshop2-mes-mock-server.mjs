#!/usr/bin/env node
/** MES mock — floor/sample-status endpoint for e2e */
import http from 'node:http';
const port = Number(process.env.WORKSHOP2_MES_MOCK_PORT || 3999);
http.createServer((req, res) => {
  if (req.url === '/floor/sample-status') {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ ok: true, status: 'queued' }));
    return;
  }
  res.writeHead(404); res.end();
}).listen(port, () => console.log('[mes-mock]', port));
