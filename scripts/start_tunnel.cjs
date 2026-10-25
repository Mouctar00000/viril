const { spawn } = require('child_process');
const fs = require('fs');
const https = require('https');

console.log('--- Starting VIRIL LocalTunnel Service ---');

const lt = spawn('cmd.exe', [
  '/c', 'npx', '--yes', 'localtunnel',
  '--port', '5173',
  '--local-host', 'localhost',
  '--subdomain', 'viril-accessoires'
]);

lt.stdout.on('data', data => {
  const text = data.toString();
  console.log('OUTPUT:', text);
  fs.writeFileSync('scratch/tunnel_active.txt', text, 'utf8');
});

lt.stderr.on('data', data => {
  console.error('ERROR:', data.toString());
});

lt.on('close', code => {
  console.log('LocalTunnel exited with code', code);
});

// Keep process alive indefinitely
setInterval(() => {}, 60000);
