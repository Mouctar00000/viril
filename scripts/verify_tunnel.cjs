const https = require('https');

function check(pathName, label) {
  return new Promise(resolve => {
    const options = {
      hostname: 'viril-accessoires.loca.lt',
      path: pathName,
      method: 'GET',
      headers: {
        'bypass-tunnel-reminder': '1',
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)'
      }
    };

    const req = https.request(options, res => {
      console.log(`[${label}] Status: ${res.statusCode} | Content-Type: ${res.headers['content-type']} | Length: ${res.headers['content-length'] || 'stream'}`);
      res.destroy(); // Don't buffer the whole 8MB video
      resolve(res.statusCode);
    });

    req.on('error', err => {
      console.error(`[${label}] Error:`, err.message);
      resolve(500);
    });

    req.end();
  });
}

async function run() {
  console.log('Testing public tunnel: https://viril-accessoires.loca.lt');
  await check('/', 'HOMEPAGE HTML');
  await check('/videos/viril-hero.mp4', 'HERO ANIMATION VIDEO');
  await check('/videos/sac.mp4', 'ANIMATED BAG VIDEO');
  await check('/images/hero-frame0-master.png', 'HERO OPENING FRAME');
  await check('/images/logo-white.png', 'LOGO OFFICIAL');
  await check('/images/croco-bag.jpg', 'CROCO BAG IMAGE');
  await check('/src/main.jsx', 'VITE REACT APP SCRIPT');
  console.log('--- ALL PUBLIC TUNNEL CHECKS COMPLETED SUCCESSFULLY ---');
}

run();
