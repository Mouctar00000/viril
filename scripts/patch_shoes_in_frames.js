import { execSync } from 'node:child_process';
import path from 'node:path';
import fs from 'node:fs';

const FFMPEG = 'C:\\Program Files\\Shutter Encoder\\Library\\ffmpeg.exe';
const FRAMES_DIR = path.resolve('all_video_frames');
const IMG_DIR = path.resolve('public/images');

const frame2Loafers = path.resolve(IMG_DIR, 'frame2_loafers_1080p.jpg');
const frame1Loafers = path.resolve(IMG_DIR, 'frame1_loafers_1080p.jpg');

console.log('Starting shoe frame patching...');
console.log('FFmpeg:', FFMPEG);
console.log('Frame 2 Loafers:', frame2Loafers);
console.log('Frame 1 Loafers:', frame1Loafers);

// Shot 1: Frames 1 to 36 (assembling suit) -> use frame2Loafers
let patchedShot1 = 0;
for (let i = 1; i <= 36; i++) {
  const frameName = `frame_${String(i).padStart(4, '0')}.jpg`;
  const framePath = path.resolve(FRAMES_DIR, frameName);
  const tempPath = path.resolve(FRAMES_DIR, `temp_${frameName}`);

  const cmd = `"${FFMPEG}" -y -i "${framePath}" -i "${frame2Loafers}" -filter_complex "[1:v]crop=400:180:760:860[shoe];[0:v][shoe]overlay=760:860" -q:v 2 "${tempPath}"`;
  execSync(cmd, { stdio: 'pipe' });
  fs.renameSync(tempPath, framePath);
  patchedShot1++;
}
console.log(`Successfully patched Shot 1: ${patchedShot1} frames (1 to 36)`);

// Shot 2: Frames 37 to 71 (standing model) -> use frame1Loafers
let patchedShot2 = 0;
for (let i = 37; i <= 71; i++) {
  const frameName = `frame_${String(i).padStart(4, '0')}.jpg`;
  const framePath = path.resolve(FRAMES_DIR, frameName);
  const tempPath = path.resolve(FRAMES_DIR, `temp_${frameName}`);

  const cmd = `"${FFMPEG}" -y -i "${framePath}" -i "${frame1Loafers}" -filter_complex "[1:v]crop=400:180:760:860[shoe];[0:v][shoe]overlay=760:860" -q:v 2 "${tempPath}"`;
  execSync(cmd, { stdio: 'pipe' });
  fs.renameSync(tempPath, framePath);
  patchedShot2++;
}
console.log(`Successfully patched Shot 2: ${patchedShot2} frames (37 to 71)`);

console.log('All 71 target frames successfully updated with Image 3 luxury loafers!');
