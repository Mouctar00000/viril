const fs = require('fs');
const buf = fs.readFileSync('scratch/button_raw.bin');
const width = 450;
const height = 100;

function getRGB(x, y) {
  const idx = (y * width + x) * 3;
  return { r: buf[idx], g: buf[idx+1], b: buf[idx+2] };
}

function toHex(r, g, b) {
  return '#' + [r, g, b].map(v => Math.round(v).toString(16).padStart(2, '0')).join('').toUpperCase();
}

// Find bounding box of the button: where brightness > 60 and saturation > 0.1
let pixels = [];
for (let y = 20; y < 80; y++) {
  for (let x = 90; x < 420; x++) {
    const c = getRGB(x, y);
    // Ignore text (dark pixels where r+g+b < 200) and background (black pixels where r+g+b < 100)
    const brightness = (c.r + c.g + c.b) / 3;
    if (brightness > 120 && c.r > c.b) {
      pixels.push(c);
    }
  }
}

console.log('Total button surface pixels analyzed:', pixels.length);

let sumR = 0, sumG = 0, sumB = 0;
pixels.forEach(p => {
  sumR += p.r;
  sumG += p.g;
  sumB += p.b;
});

const avgR = sumR / pixels.length;
const avgG = sumG / pixels.length;
const avgB = sumB / pixels.length;

console.log(`Average Color: ${toHex(avgR, avgG, avgB)} -> rgb(${Math.round(avgR)}, ${Math.round(avgG)}, ${Math.round(avgB)})`);

// Sort by brightness to get percentiles
pixels.sort((a, b) => (a.r + a.g + a.b) - (b.r + b.g + b.b));
const p25 = pixels[Math.floor(pixels.length * 0.25)];
const p50 = pixels[Math.floor(pixels.length * 0.50)];
const p75 = pixels[Math.floor(pixels.length * 0.75)];

console.log(`25th percentile (deeper gold): ${toHex(p25.r, p25.g, p25.b)}`);
console.log(`Median color (core gold): ${toHex(p50.r, p50.g, p50.b)}`);
console.log(`75th percentile (lighter champagne): ${toHex(p75.r, p75.g, p75.b)}`);
