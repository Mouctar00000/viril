const fs = require('fs');

const files = [
  'src/components/About.jsx',
  'src/components/CartDrawer.jsx',
  'src/components/CheckoutModal.jsx',
  'src/components/Contact.jsx',
  'src/components/CustomerReviews.jsx',
  'src/components/EbookPreviewModal.jsx',
  'src/components/Ebooks.jsx',
  'src/components/Elegance.jsx'
];

const patterns = [/#00E5FF/i, /cyanAccent/i, /0,\s*229,\s*255/i, /#00B4CC/i, /#33EBFF/i];

files.forEach(file => {
  if (!fs.existsSync(file)) return;
  const content = fs.readFileSync(file, 'utf8');
  const lines = content.split('\n');
  const matches = [];
  lines.forEach((l, idx) => {
    if (patterns.some(p => p.test(l))) {
      matches.push({ line: idx + 1, text: l.trim() });
    }
  });
  if (matches.length > 0) {
    console.log(`=== ${file} (${matches.length} matches) ===`);
    matches.forEach(m => console.log(`  L${m.line}: ${m.text}`));
  }
});
