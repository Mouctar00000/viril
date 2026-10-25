const { execSync } = require('child_process');
const fs = require('fs');
const ffmpeg = '"C:\\Program Files\\Shutter Encoder\\Library\\ffmpeg.exe"';
const file = fs.readdirSync('C:/Users/GLC/Downloads').find(f => f.includes('Remplacer_fond_blanc'));
console.log('Found:', file);
execSync(`${ffmpeg} -y -ss 00:00:01 -i "C:/Users/GLC/Downloads/${file}" -vframes 1 -q:v 2 "scratch/video_previews/remplacer_fond_blanc.jpg"`);
console.log('Preview saved!');
