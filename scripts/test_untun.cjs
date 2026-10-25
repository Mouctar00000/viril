const { spawn } = require('child_process');
const fs = require('fs');

console.log('Testing untun (Cloudflare Quick Tunnel)...');
const ut = spawn('cmd.exe', ['/c', 'npx', '--yes', 'untun', 'tunnel', 'http://localhost:5173']);

ut.stdout.on('data', data => {
  const str = data.toString();
  console.log('UNTUN STDOUT:', str);
  fs.appendFileSync('scratch/untun.log', str);
});

ut.stderr.on('data', data => {
  const str = data.toString();
  console.log('UNTUN STDERR:', str);
  fs.appendFileSync('scratch/untun_err.log', str);
});

ut.on('close', code => {
  console.log('Untun closed with code', code);
});

setTimeout(() => {
  console.log('Test finished 15s');
  process.exit(0);
}, 15000);
