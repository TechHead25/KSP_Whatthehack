const { spawn } = require('child_process');
const path = require('path');

const port = process.env.PORT || 3000;
console.log(`[NETRA FRONTEND] Starting Next.js server on port ${port}...`);

const nextBin = path.join(__dirname, 'node_modules', 'next', 'dist', 'bin', 'next');

const nextStart = spawn(process.execPath, [nextBin, 'start', '-p', port.toString()], {
  stdio: 'inherit',
  cwd: __dirname
});

nextStart.on('exit', (code) => {
  process.exit(code || 0);
});

