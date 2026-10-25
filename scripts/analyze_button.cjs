const fs = require('fs');
const buf = fs.readFileSync('scratch/button_raw.bin');
const width = 450;
const height = 100;

function getRGB(x, y) {
  const idx = (y * width + x) * 3;
  return { r: buf[idx], g: buf[idx+1], b: buf[idx+2] };
}

function toHex(rgb) {
  return '#' + [rgb.r, rgb.g, rgb.b].map(v => v.toString(16).padStart(2, '0')).join('').toUpperCase();
}

console.log('--- Sampling Button Body ---');
const samplePoints = [
  { label: 'Left lobe interior', x: 120, y: 50 },
  { label: 'Left lobe upper', x: 120, y: 35 },
  { label: 'Left lobe lower', x: 120, y: 65 },
  { label: 'Center body between words', x: 235, y: 35 },
  { label: 'Center body lower', x: 235, y: 65 },
  { label: 'Right lobe interior', x: 380, y: 50 },
  { label: 'Right lobe upper', x: 380, y: 35 },
  { label: 'Right lobe lower', x: 380, y: 65 },
  { label: 'Center mid', x: 215, y: 32 },
  { label: 'Center mid lower', x: 215, y: 68 },
];

samplePoints.forEach(p => {
  const c = getRGB(p.x, p.y);
  console.log(`${p.label} (${p.x}, ${p.y}): ${toHex(c)} rgb(${c.r}, ${c.g}, ${c.b})`);
});

console.log('--- Sampling Text Color ---');
let minB = 255;
let textRgb = null;
let textPos = null;
for (let x = 120; x < 350; x++) {
  const c = getRGB(x, 50);
  const brightness = (c.r + c.g + c.b) / 3;
  if (brightness < minB) {
    minB = brightness;
    textRgb = c;
    textPos = { x, y: 50 };
  }
}
console.log(`Darkest Text pixel (${textPos.x}, ${textPos.y}): ${toHex(textRgb)} rgb(${textRgb.r}, ${textRgb.g}, ${textRgb.b})`);

console.log('--- Sampling Outer Glow / Border ---');
for (let y = 14; y <= 26; y += 2) {
  const c = getRGB(225, y);
  console.log(`Top edge y=${y}: ${toHex(c)} rgb(${c.r}, ${c.g}, ${c.b})`);
}
