const fs = require('fs');
const { execSync } = require('child_process');

const ffmpeg = '"C:\\Program Files\\Shutter Encoder\\Library\\ffmpeg.exe"';

const cmd = `${ffmpeg} -y -i scratch/user_gold_button.png -filter_complex "\
color=c=#C5A880:s=90x60[c1];\
color=c=#C8A97E:s=90x60[c2];\
color=c=#C9A84C:s=90x60[c3];\
color=c=#D1BA91:s=90x60[c4];\
color=c=#D4AF7A:s=90x60[c5];\
[c1][c2][c3][c4][c5]hstack=inputs=5[swatches];\
[0:v][swatches]vstack=inputs=2[out]" -map "[out]" -frames:v 1 -update 1 scratch/swatch_compare.png`;

execSync(cmd, { stdio: 'inherit' });
console.log('Swatch comparison generated');
