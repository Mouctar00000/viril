const fs = require('fs');
const { execSync } = require('child_process');

const ffmpeg = '"C:\\Program Files\\Shutter Encoder\\Library\\ffmpeg.exe"';

// Let's create an image where we put small squares of #D1BA91, #D1B992, #C8A97E, #D3BC94 inside the button itself
const cmd = `${ffmpeg} -y -i scratch/user_gold_button.png -filter_complex "\
color=c=#D1BA91:s=40x20[s1];\
color=c=#D1B992:s=40x20[s2];\
color=c=#D3BC94:s=40x20[s3];\
color=c=#C8A97E:s=40x20[s4];\
[0:v][s1]overlay=50:40[o1];\
[o1][s2]overlay=100:40[o2];\
[o2][s3]overlay=350:40[o3];\
[o3][s4]overlay=395:40[out]" -map "[out]" -frames:v 1 -update 1 scratch/button_inlay_test.png`;

execSync(cmd, { stdio: 'inherit' });
console.log('Inlay test created');
