const fs = require('fs');
const path = require('path');

const frontendDir = path.join(__dirname, '..', 'frontend');
const htmlFiles = fs.readdirSync(frontendDir).filter(f => f.endsWith('.html'));

console.log('=== HTML FILES WITH HARDCODED INLINE WHITE COLORS ===');
let totalMatches = 0;
htmlFiles.forEach(file => {
  const content = fs.readFileSync(path.join(frontendDir, file), 'utf8');
  const lines = content.split('\n');
  let fileMatches = 0;
  lines.forEach((line, idx) => {
    // Look for style="...color:#fff..." or color:white or color:#ffffff
    if (/style=["'][^"']*color:\s*(#fff|#ffffff|white)\b/i.test(line)) {
      fileMatches++;
      totalMatches++;
      if (fileMatches <= 5) {
        console.log(`  ${file}:${idx + 1} -> ${line.trim().substring(0, 100)}...`);
      }
    }
  });
  if (fileMatches > 0) {
    console.log(`${file}: ${fileMatches} inline hardcoded white color instances.`);
  }
});
console.log(`Total inline white color occurrences: ${totalMatches}`);
