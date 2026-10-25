const fs = require('fs');
const { execSync } = require('child_process');

const ffmpeg = '"C:\\Program Files\\Shutter Encoder\\Library\\ffmpeg.exe"';
const outDir = 'scratch/test_clip/approach1';
fs.mkdirSync(outDir, { recursive: true });

// Copy frames 35-43
for (let i = 35; i <= 43; i++) {
  const pad = String(i).padStart(4, '0');
  fs.copyFileSync(`scratch/frames/frame_${pad}.jpg`, `${outDir}/frame_${pad}.jpg`);
}

// Patch frames 44-53 using frame 54
for (let i = 44; i <= 53; i++) {
  const pad = String(i).padStart(4, '0');
  const cmd = `${ffmpeg} -y -i scratch/frames/frame_${pad}.jpg -i scratch/frames/frame_0054.jpg -filter_complex "[1:v]crop=600:400:660:0[patch];[0:v][patch]overlay=660:0" -frames:v 1 -update 1 ${outDir}/frame_${pad}.jpg`;
  execSync(cmd, { stdio: 'ignore' });
}

// Copy frames 54-65
for (let i = 54; i <= 65; i++) {
  const pad = String(i).padStart(4, '0');
  fs.copyFileSync(`scratch/frames/frame_${pad}.jpg`, `${outDir}/frame_${pad}.jpg`);
}

// Render video
const renderCmd = `${ffmpeg} -y -framerate 24 -start_number 35 -i ${outDir}/frame_%04d.jpg -c:v libx264 -pix_fmt yuv420p -crf 18 scratch/test_clip/approach1.mp4`;
execSync(renderCmd, { stdio: 'inherit' });
console.log('Approach 1 rendered successfully');
