const fs = require('fs');
const { execSync } = require('child_process');

const ffmpeg = '"C:\\Program Files\\Shutter Encoder\\Library\\ffmpeg.exe"';

// Test alpha blending of clean patch over frame 48
// In ffmpeg, we can adjust the alpha of the patch using format=rgba,colorchannelmixer=aa=0.5
const cmd = `${ffmpeg} -y -i scratch/frames/frame_0048.jpg -i scratch/frames/frame_0054.jpg -filter_complex "[1:v]crop=600:400:660:0,format=yuva420p,colorchannelmixer=aa=0.5[patch];[0:v][patch]overlay=660:0" -frames:v 1 -update 1 scratch/frames/test_fade_48.jpg`;

execSync(cmd, { stdio: 'inherit' });
console.log('test_fade_48 generated');
