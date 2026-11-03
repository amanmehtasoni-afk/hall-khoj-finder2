const fs = require('fs');
const path = require('path');

const frontendDir = path.join(__dirname, '../frontend');
const htmlFiles = fs.readdirSync(frontendDir).filter(f => f.endsWith('.html'));
const adminFiles = fs.existsSync(path.join(frontendDir, 'admin')) ? fs.readdirSync(path.join(frontendDir, 'admin')).filter(f => f.endsWith('.html')).map(f => 'admin/' + f) : [];
const ownerFiles = fs.existsSync(path.join(frontendDir, 'owner')) ? fs.readdirSync(path.join(frontendDir, 'owner')).filter(f => f.endsWith('.html')).map(f => 'owner/' + f) : [];

const allHtml = [...htmlFiles, ...adminFiles, ...ownerFiles];
console.log('Auditing', allHtml.length, 'HTML files...');

let issues = [];

allHtml.forEach(relPath => {
  const fullPath = path.join(frontendDir, relPath);
  const content = fs.readFileSync(fullPath, 'utf8');
  const baseDir = path.dirname(fullPath);

  // Check script tags
  const scriptRegex = /<script\s+[^>]*src=["']([^"']+)["'][^>]*>/gi;
  let match;
  while ((match = scriptRegex.exec(content)) !== null) {
    const src = match[1];
    if (src.startsWith('http://') || src.startsWith('https://')) continue;
    // Strip query string / hash if present
    const cleanSrc = src.split('?')[0].split('#')[0];
    const targetFile = cleanSrc.startsWith('/') 
      ? path.join(frontendDir, cleanSrc.slice(1)) 
      : path.resolve(baseDir, cleanSrc);
    if (!fs.existsSync(targetFile)) {
      issues.push(relPath + ' -> missing script: ' + src + ' (checked: ' + targetFile + ')');
    }
  }

  // Check link css tags
  const linkRegex = /<link\s+[^>]*href=["']([^"']+)["'][^>]*>/gi;
  while ((match = linkRegex.exec(content)) !== null) {
    const href = match[1];
    if (href.startsWith('http://') || href.startsWith('https://') || href.includes('fonts.')) continue;
    const cleanHref = href.split('?')[0].split('#')[0];
    const targetFile = cleanHref.startsWith('/')
      ? path.join(frontendDir, cleanHref.slice(1))
      : path.resolve(baseDir, cleanHref);
    if (!fs.existsSync(targetFile)) {
      issues.push(relPath + ' -> missing stylesheet: ' + href + ' (checked: ' + targetFile + ')');
    }
  }
});

if (issues.length === 0) {
  console.log('✓ All script and stylesheet tags in all ' + allHtml.length + ' HTML files point to existing files on disk!');
} else {
  console.log('Issues found:');
  issues.forEach(i => console.log(' - ' + i));
}
