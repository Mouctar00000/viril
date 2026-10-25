const fs = require('fs');
const path = require('path');

const targetDirs = ['src', '.'];
const extensions = ['.js', '.jsx', '.css', '.html', '.json'];

function walk(dir) {
  let files = [];
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const entry of entries) {
    if (entry.name === 'node_modules' || entry.name === 'dist' || entry.name === 'scratch' || entry.name === '.git') continue;
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      files = files.concat(walk(full));
    } else if (extensions.some(ext => entry.name.endsWith(ext))) {
      files.push(full);
    }
  }
  return files;
}

const allFiles = walk('.');
console.log('Total files scanned:', allFiles.length);

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

let occurrences = {};

allFiles.forEach(file => {
  const content = fs.readFileSync(file, 'utf8');
  const lines = content.split('\n');
  lines.forEach((line, idx) => {
    for (const pat of patterns) {
      if (pat.test(line)) {
        if (!occurrences[file]) occurrences[file] = [];
        occurrences[file].push({ lineNum: idx + 1, line: line.trim() });
        break;
      }
    }
  });
});

console.log('--- FOUND OCCURRENCES BY FILE ---');
for (const [file, matches] of Object.entries(occurrences)) {
  console.log(`\n=== ${file} (${matches.length} matches) ===`);
  matches.forEach(m => console.log(`  L${m.lineNum}: ${m.line}`));
}
