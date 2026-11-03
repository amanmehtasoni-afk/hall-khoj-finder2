const fs = require('fs');
const path = require('path');

const jsDir = path.join(__dirname, '..', 'frontend', 'js');
const jsFiles = fs.readdirSync(jsDir).filter(f => f.endsWith('.js'));

console.log('=== JS FILES INJECTING WHITE COLOR INLINE ===');
jsFiles.forEach(file => {
  const content = fs.readFileSync(path.join(jsDir, file), 'utf8');
  const lines = content.split('\n');
  lines.forEach((line, idx) => {
    if (/color:\s*(#fff|#ffffff|white)\b/i.test(line)) {
      console.log(`  ${file}:${idx + 1} -> ${line.trim().substring(0, 100)}`);
    }
  });
});
