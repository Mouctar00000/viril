const fs = require('fs');
const { execSync } = require('child_process');
const path = require('path');

const ffmpeg = '"C:\\Program Files\\Shutter Encoder\\Library\\ffmpeg.exe"';
const videoPath = 'public/videos/viril-hero.mp4';
const backupPath = 'public/videos/viril-hero-backup-head.mp4';
const framesDir = 'scratch/all_hero_frames';
const audioPath = 'scratch/hero_audio.aac';

console.log('--- Step 1: Backup original video ---');
if (!fs.existsSync(backupPath)) {
  fs.copyFileSync(videoPath, backupPath);
  console.log('Created backup at', backupPath);
} else {
  console.log('Backup already exists at', backupPath);
}

console.log('--- Step 2: Extract audio ---');
try {
  execSync(`${ffmpeg} -y -i "${videoPath}" -vn -c:a copy "${audioPath}"`, { stdio: 'inherit' });
  console.log('Audio extracted to', audioPath);
} catch (e) {
  console.log('Note: no separate audio or error extracting audio:', e.message);
}

console.log('--- Step 3: Extract all frames ---');
if (fs.existsSync(framesDir)) {
  fs.rmSync(framesDir, { recursive: true, force: true });
}
fs.mkdirSync(framesDir, { recursive: true });

execSync(`${ffmpeg} -y -i "${videoPath}" -q:v 1 "${framesDir}/frame_%04d.jpg"`, { stdio: 'inherit' });
const extractedCount = fs.readdirSync(framesDir).length;
console.log(`Extracted ${extractedCount} frames to ${framesDir}`);

console.log('--- Step 4: Patch frames 44 to 53 using clean frame 54 ---');
const refFrame = `${framesDir}/frame_0054.jpg`;
if (!fs.existsSync(refFrame)) {
  throw new Error(`Reference frame not found: ${refFrame}`);
}

for (let i = 44; i <= 53; i++) {
  const pad = String(i).padStart(4, '0');
  const targetFrame = `${framesDir}/frame_${pad}.jpg`;
  const tempFrame = `${framesDir}/frame_${pad}_patched.jpg`;

  const patchCmd = `${ffmpeg} -y -i "${targetFrame}" -i "${refFrame}" -filter_complex "[1:v]crop=600:400:660:0[patch];[0:v][patch]overlay=660:0" -q:v 1 -frames:v 1 -update 1 "${tempFrame}"`;
  execSync(patchCmd, { stdio: 'ignore' });

  fs.renameSync(tempFrame, targetFrame);
  console.log(`Patched frame ${pad}`);
}

console.log('--- Step 5: Re-encode patched video ---');
const tempOutput = 'scratch/viril-hero-fixed.mp4';

let encodeCmd = '';
if (fs.existsSync(audioPath) && fs.statSync(audioPath).size > 0) {
  encodeCmd = `${ffmpeg} -y -framerate 24 -i "${framesDir}/frame_%04d.jpg" -i "${audioPath}" -c:v libx264 -pix_fmt yuv420p -profile:v high -crf 18 -preset slow -g 12 -movflags +faststart -c:a copy "${tempOutput}"`;
} else {
  encodeCmd = `${ffmpeg} -y -framerate 24 -i "${framesDir}/frame_%04d.jpg" -c:v libx264 -pix_fmt yuv420p -profile:v high -crf 18 -preset slow -g 12 -movflags +faststart "${tempOutput}"`;
}

execSync(encodeCmd, { stdio: 'inherit' });
console.log('Re-encoded video to', tempOutput);

console.log('--- Step 6: Overwrite public/videos/viril-hero.mp4 ---');
fs.copyFileSync(tempOutput, videoPath);
console.log('Updated', videoPath, 'with patched video!');
console.log('All steps completed successfully.');
