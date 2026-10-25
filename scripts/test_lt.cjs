const { spawn } = require('child_process');
const fs = require('fs');

console.log('Testing localtunnel...');
const lt = spawn('cmd.exe', ['/c', 'npx', '--yes', 'localtunnel', '--port', '5173', '--local-host', 'localhost']);

lt.stdout.on('data', data => {
  const str = data.toString();
  console.log('LT STDOUT:', str);
  fs.appendFileSync('scratch/tunnel.log', str);
});

lt.stderr.on('data', data => {
  const str = data.toString();
  console.log('LT STDERR:', str);
  fs.appendFileSync('scratch/tunnel_err.log', str);
});

lt.on('close', code => {
  console.log('LT closed with code', code);
});

setTimeout(() => {
  console.log('Test finished 12s');
  process.exit(0);
}, 12000);
