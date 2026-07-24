const { spawn } = require('child_process');
const path = require('path');

const port = process.env.X_ZOHO_CATALYST_LISTEN_PORT || process.env.PORT || 3000;
console.log(`[NETRA FRONTEND] Starting Next.js server on 0.0.0.0:${port}...`);

let nextBin;
try {
  nextBin = require.resolve('next/dist/bin/next');
} catch (e) {
  nextBin = path.join(__dirname, 'node_modules', 'next', 'dist', 'bin', 'next');
}

const nextStart = spawn(process.execPath, [nextBin, 'start', '-H', '0.0.0.0', '-p', port.toString()], {
  stdio: 'inherit',
  cwd: __dirname
});

nextStart.on('exit', (code) => {
  process.exit(code || 0);
});
