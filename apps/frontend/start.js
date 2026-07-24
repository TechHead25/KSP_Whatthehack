const path = require('path');
const fs = require('fs');
const { createServer } = require('http');

const port = parseInt(process.env.X_ZOHO_CATALYST_LISTEN_PORT || process.env.PORT || '8080', 10);
process.env.PORT = port.toString();
process.env.HOSTNAME = '0.0.0.0';

console.log(`[NETRA FRONTEND] Node process PID=${process.pid} on 0.0.0.0:${port}...`);

const standaloneServerPath = path.join(__dirname, '.next', 'standalone', 'apps', 'frontend', 'server.js');
const fallbackServerPath = path.join(__dirname, '.next', 'standalone', 'server.js');

let serverFile;
if (fs.existsSync(standaloneServerPath)) {
  serverFile = standaloneServerPath;
} else if (fs.existsSync(fallbackServerPath)) {
  serverFile = fallbackServerPath;
}

if (serverFile) {
  console.log(`[NETRA FRONTEND] Launching standalone server from: ${serverFile}`);
  require(serverFile);
} else {
  console.log(`[NETRA FRONTEND] Standalone file not found, initializing standard Next app...`);
  const parseUrl = require('url').parse;
  const next = require('next');
  const app = next({ dev: false, dir: __dirname });
  const handle = app.getRequestHandler();
  app.prepare().then(() => {
    createServer((req, res) => {
      handle(req, res, parseUrl(req.url, true));
    }).listen(port, '0.0.0.0', (err) => {
      if (err) throw err;
      console.log(`[NETRA FRONTEND] Listening on http://0.0.0.0:${port}`);
    });
  }).catch((err) => {
    console.error('[NETRA FRONTEND] Fatal start error:', err);
    process.exit(1);
  });
}
