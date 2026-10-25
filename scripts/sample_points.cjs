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

// Sample points on the clear gold surface (avoiding black letters)
// Looking at regions between words or just above/below letters
const points = [
  { label: 'left edge of pill inside border', x: 70, y: 50 },
  { label: 'left inner padding', x: 85, y: 50 },
  { label: 'above DECOUVRIR', x: 150, y: 35 },
  { label: 'below DECOUVRIR', x: 150, y: 65 },
  { label: 'space between DECOUVRIR and LA', x: 200, y: 50 },
  { label: 'above COLLECTION', x: 280, y: 35 },
  { label: 'below COLLECTION', x: 280, y: 65 },
  { label: 'space between COLLECTION and arrow', x: 345, y: 50 },
  { label: 'right inner padding', x: 385, y: 50 },
  { label: 'center horizontal mid', x: 225, y: 35 },
  { label: 'bottom edge subtle glow border', x: 225, y: 74 },
  { label: 'top edge subtle highlight', x: 225, y: 26 },
];

points.forEach(pt => {
  const c = getRGB(pt.x, pt.y);
  console.log(`${pt.label.padEnd(38)} (${pt.x}, ${pt.y}): ${toHex(c.r, c.g, c.b)} rgb(${c.r}, ${c.g}, ${c.b})`);
});
