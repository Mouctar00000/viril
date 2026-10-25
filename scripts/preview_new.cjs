const { execSync } = require('child_process');
const ffmpeg = '"C:\\Program Files\\Shutter Encoder\\Library\\ffmpeg.exe"';

execSync(`${ffmpeg} -y -ss 00:00:01 -i "c:/mes proget/viril/public/videos/sacc.mp4" -vframes 1 -q:v 2 "scratch/video_previews/sacc.jpg"`);
execSync(`${ffmpeg} -y -ss 00:00:01 -i "c:/mes proget/viril/public/videos/chaussure.mp4" -vframes 1 -q:v 2 "scratch/video_previews/chaussure.jpg"`);
console.log('Saved sacc.jpg and chaussure.jpg');
