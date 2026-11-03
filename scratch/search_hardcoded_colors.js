const fs = require('fs');
const path = require('path');

const cssDir = path.join(__dirname, '..', 'frontend', 'css');
const cssFiles = fs.readdirSync(cssDir).filter(f => f.endsWith('.css'));

console.log('=== CSS HARDCODED WHITE COLOR REPORT ===');
cssFiles.forEach(file => {
  const content = fs.readFileSync(path.join(cssDir, file), 'utf8');
  const lines = content.split('\n');
  lines.forEach((line, idx) => {
    if (/color:\s*(#fff|#ffffff|white)\b/i.test(line) && !line.includes('--text-') && !line.includes('--color-')) {
      // Check if inside light mode block
      console.log(`${file}:${idx + 1} -> ${line.trim()}`);
    }
  });
});
