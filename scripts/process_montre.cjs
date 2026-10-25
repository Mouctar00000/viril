const { execSync } = require('child_process');
const fs = require('fs');

const ffmpeg = '"C:\\Program Files\\Shutter Encoder\\Library\\ffmpeg.exe"';
const src = 'c:/mes proget/viril/montre.mp4';
const hevcDest = 'c:/mes proget/viril/public/videos/montre-hevc.mp4';
const h264Dest = 'c:/mes proget/viril/public/videos/montre.mp4';
const previewImg = 'scratch/video_previews/montre.jpg';
const publicImg = 'c:/mes proget/viril/public/images/montre.jpg';

console.log('1. Copying HEVC copy...');
fs.copyFileSync(src, hevcDest);

console.log('2. Extracting preview frame...');
execSync(`${ffmpeg} -y -ss 00:00:02 -i "${src}" -vframes 1 -q:v 2 "${previewImg}"`);
fs.copyFileSync(previewImg, publicImg);

console.log('3. Encoding H.264 with faststart...');
execSync(`${ffmpeg} -y -i "${src}" -c:v libx264 -preset slow -crf 18 -pix_fmt yuv420p -an -movflags +faststart "${h264Dest}"`);

if (fs.existsSync('c:/mes proget/viril/dist/videos')) {
  fs.copyFileSync(h264Dest, 'c:/mes proget/viril/dist/videos/montre.mp4');
}

console.log('Done! Montre processed successfully.');
