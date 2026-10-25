const fs = require('fs');
const path = require('path');

const downloads = 'C:\\Users\\GLC\\Downloads';
const projectRoot = 'C:\\mes proget\\viril';
const publicVideos = path.join(projectRoot, 'public', 'videos');

if (!fs.existsSync(publicVideos)) {
  fs.mkdirSync(publicVideos, { recursive: true });
}

// 1. Restore Portefeuille Viril video (both dark landscape and clean)
const downloadFiles = fs.readdirSync(downloads);

const darkWalletFile = downloadFiles.find(f => f.includes('Remplacer_fond_blanc'));
if (darkWalletFile) {
  const src = path.join(downloads, darkWalletFile);
  fs.copyFileSync(src, path.join(publicVideos, 'portefeuille.mp4'));
  fs.copyFileSync(src, path.join(projectRoot, 'Portefeuille Viril..mp4'));
  console.log('Restored dark wallet video:', (fs.statSync(src).size / 1024 / 1024).toFixed(2), 'MB');
}

const cleanWalletFile = downloadFiles.find(f => f === 'Portefeuille Viril.mp4');
if (cleanWalletFile) {
  const src = path.join(downloads, cleanWalletFile);
  fs.copyFileSync(src, path.join(publicVideos, 'portefeuille-clean.mp4'));
  console.log('Restored clean wallet video:', (fs.statSync(src).size / 1024 / 1024).toFixed(2), 'MB');
}

// 2. Restore viril.v..mp4
const virilVFile = downloadFiles.find(f => f.startsWith('viril.v'));
if (virilVFile) {
  const src = path.join(downloads, virilVFile);
  fs.copyFileSync(src, path.join(publicVideos, 'viril.v.mp4'));
  fs.copyFileSync(src, path.join(projectRoot, 'viril.v..mp4'));
  console.log('Restored viril.v..mp4:', (fs.statSync(src).size / 1024 / 1024).toFixed(2), 'MB');
}

// 3. Restore sac.mp4 to root if needed
const sacFile = downloadFiles.find(f => f === 'sac.mp4');
if (sacFile) {
  const src = path.join(downloads, sacFile);
  fs.copyFileSync(src, path.join(projectRoot, 'sac.mp4'));
  if (!fs.existsSync(path.join(publicVideos, 'sac.mp4'))) {
    fs.copyFileSync(src, path.join(publicVideos, 'sac.mp4'));
  }
  console.log('Restored sac.mp4 in root:', (fs.statSync(src).size / 1024 / 1024).toFixed(2), 'MB');
}

// 4. Restore 3D bag animation (6.2 MB version)
const bag3dFile = downloadFiles.find(f => f.startsWith('Create_3D_bag_animation_1080p_20261024215739') && !f.includes('(1)'));
if (bag3dFile) {
  const src = path.join(downloads, bag3dFile);
  fs.copyFileSync(src, path.join(publicVideos, 'sac-3d.mp4'));
  console.log('Restored sac-3d.mp4:', (fs.statSync(src).size / 1024 / 1024).toFixed(2), 'MB');
}

console.log('\n--- Current files in public/videos ---');
fs.readdirSync(publicVideos).forEach(f => {
  const stat = fs.statSync(path.join(publicVideos, f));
  console.log(' ', f, '=>', (stat.size / 1024 / 1024).toFixed(2), 'MB');
});
