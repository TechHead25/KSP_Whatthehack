const { createServer } = require('http');
const parseUrl = require('url').parse;
const next = require('next');

const port = parseInt(process.env.X_ZOHO_CATALYST_LISTEN_PORT || process.env.PORT || '3000', 10);
const dev = false;
const app = next({ dev, dir: __dirname });
const handle = app.getRequestHandler();

console.log(`[NETRA FRONTEND] Initializing Next.js production server on 0.0.0.0:${port}...`);

app.prepare().then(() => {
  createServer((req, res) => {
    const parsedUrl = parseUrl(req.url, true);
    handle(req, res, parsedUrl);
  }).listen(port, '0.0.0.0', (err) => {
    if (err) throw err;
    console.log(`[NETRA FRONTEND] Server listening on http://0.0.0.0:${port}`);
  });
}).catch((err) => {
  console.error('[NETRA FRONTEND] Fatal error starting server:', err);
  process.exit(1);
});
