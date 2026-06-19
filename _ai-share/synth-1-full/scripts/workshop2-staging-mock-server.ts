import http from 'node:http';
http.createServer((req, res) => {
  switch (req.url) {
    case '/purchase-orders':
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ ok: true }));
      return;
    case '/webhook':
      res.writeHead(200); res.end('ok');
      return;
    default:
      res.writeHead(404); res.end();
  }
}).listen(3099, () => console.log('staging mock 3099'));
