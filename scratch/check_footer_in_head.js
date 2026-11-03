const fs = require('fs');
const path = require('path');

const dir = path.join(__dirname, '..', 'frontend');
const files = fs.readdirSync(dir).filter(f => f.endsWith('.html'));

files.forEach(f => {
  const c = fs.readFileSync(path.join(dir, f), 'utf8');
  const headMatch = c.match(/<head[\s\S]*?<\/head>/i);
  if (headMatch && headMatch[0].includes('<footer')) {
    console.log(`FOUND FOOTER IN HEAD: ${f}`);
  }
});
