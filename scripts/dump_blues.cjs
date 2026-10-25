const fs = require('fs');
const path = require('path');

function walk(dir) {
  let files = [];
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const entry of entries) {
    if (['node_modules', 'dist', 'scratch', '.git'].includes(entry.name)) continue;
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      files = files.concat(walk(full));
    } else if (['.js', '.jsx', '.css', '.html'].some(ext => entry.name.endsWith(ext))) {
      files.push(full);
    }
  }
  return files;
}

const allFiles = walk('src');
allFiles.push('tailwind.config.js');

const patterns = [
  /#00E5FF/i,
  /cyanAccent/i,
  /0,\s*229,\s*255/i,
  /#00B4CC/i,
  /#33EBFF/i,
  /bg-cyan/i,
  /text-cyan/i,
  /border-cyan/i,
  /shadow-cyan/i,
  /accent-cyan/i,
  /bg-blue/i,
  /text-blue/i,
  /border-blue/i,
];

let output = 'FILE SUMMARY:\n';
allFiles.forEach(file => {
  const content = fs.readFileSync(file, 'utf8');
  const lines = content.split('\n');
  const matches = [];
  lines.forEach((l, i) => {
    if (patterns.some(p => p.test(l))) {
      matches.push({ lineNum: i + 1, text: l.trim() });
    }
  });
  if (matches.length > 0) {
    output += `\nFile: ${file} (${matches.length} matches)\n`;
    matches.forEach(m => {
      output += `  [${m.lineNum}] ${m.text}\n`;
    });
  }
});

fs.writeFileSync('scratch/blues_list_utf8.txt', output, 'utf8');
console.log('Written to scratch/blues_list_utf8.txt');
