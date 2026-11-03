const fs = require('fs');
const path = require('path');

const dir = path.join(__dirname, '..', 'frontend');
const files = fs.readdirSync(dir).filter(f => f.endsWith('.html'));

files.forEach(f => {
  const c = fs.readFileSync(path.join(dir, f), 'utf8');
  const footerMatch = c.match(/<footer[\s\S]*?<\/footer>/i);
  if (footerMatch) {
    console.log(`\n=== ${f} === (footer length: ${footerMatch[0].length})`);
    console.log(footerMatch[0].substring(0, 150) + '...');
  } else {
    console.log(`\n=== ${f} === [NO FOOTER]`);
  }
});
