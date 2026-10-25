const { spawn } = require('child_process');
const fs = require('fs');

console.log('Testing Pinggy SSH tunnel...');
// ssh -p 443 -R0:localhost:5173 -o StrictHostKeyChecking=no -o ServerAliveInterval=30 a.pinggy.io b:localhost:5173
const p = spawn('ssh', [
  '-p', '443',
  '-R0:localhost:5173',
  '-o', 'StrictHostKeyChecking=no',
  '-o', 'ServerAliveInterval=30',
  'a.pinggy.io',
  'b:localhost:5173'
]);

p.stdout.on('data', data => {
  const str = data.toString();
  console.log('PINGGY STDOUT:', str);
  fs.appendFileSync('scratch/pinggy.log', str);
});

p.stderr.on('data', data => {
  const str = data.toString();
  console.log('PINGGY STDERR:', str);
  fs.appendFileSync('scratch/pinggy_err.log', str);
});

p.on('close', code => {
  console.log('Pinggy closed with code', code);
});

setTimeout(() => {
  console.log('Test finished 10s');
  p.kill();
  process.exit(0);
}, 10000);
