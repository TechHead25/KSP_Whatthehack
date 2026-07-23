const { spawn } = require('child_process')
const path = require('path')

const port = process.env.X_ZOHO_CATALYST_LISTEN_PORT || process.env.PORT || '3000'
console.log(`[NETRA FRONTEND] Starting Next.js server on port ${port}...`)

const nextBin = path.join(__dirname, 'node_modules', 'next', 'dist', 'bin', 'next')

const child = spawn(process.execPath, [nextBin, 'start', '-p', port], {
  cwd: __dirname,
  stdio: 'inherit',
  env: process.env,
})

child.on('exit', (code) => {
  process.exit(code || 0)
})
