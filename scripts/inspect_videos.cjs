const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

const ffmpeg = '"C:\\Program Files\\Shutter Encoder\\Library\\ffmpeg.exe"';
const downloads = 'C:\\Users\\GLC\\Downloads';
const files = [
  'Remplacer_fond_blanc_animation_p._20261019061108.mp4',
  'Portefeuille Viril.mp4',
  'viril.v..mp4',
  'VIR.mp4',
  'Create_3D_bag_animation_1080p_20261024215739.mp4',
  'Cinematic_fashion_animation_imag._1080p_20261024142701.mp4',
  'Cinematic_fashion_animation_imag._1080p_20261024152225.mp4',
  'Cinematic_fashion_animation_sequ._1080p_20261024140659.mp4',
  'gemini_generated_video_17f65a86.mp4'
];

if (!fs.existsSync('scratch/video_previews')) {
  fs.mkdirSync('scratch/video_previews', { recursive: true });
}

files.forEach(f => {
  const full = path.join(downloads, f);
  if (fs.existsSync(full)) {
    const safeName = f.replace(/[^a-zA-Z0-9_-]/g, '_');
    const outImg = path.join('scratch/video_previews', safeName + '.jpg');
    try {
      execSync(`${ffmpeg} -y -ss 00:00:01 -i "${full}" -vframes 1 -q:v 2 "${outImg}"`, { stdio: 'pipe' });
      const stat = fs.statSync(full);
      console.log('SUCCESS:', f, '| Size:', (stat.size / 1024 / 1024).toFixed(2), 'MB');
    } catch(err) {
      console.log('ERROR on', f, err.message);
    }
  } else {
    console.log('Not found:', f);
  }
});
