const fs = require('fs');
const path = require('path');

const dir = 'frontend';
const files = fs.readdirSync(dir).filter(f => f.endsWith('.html'));

console.log(`Inspecting all ${files.length} HTML files...`);

const report = [];

files.forEach(f => {
  const content = fs.readFileSync(path.join(dir, f), 'utf8');
  report.push({
    file: f,
    hasHeader: content.includes('site-header'),
    hasFooter: content.includes('site-footer'),
    hasTheme: content.includes('theme.js'),
    hasI18n: content.includes('i18n.js'),
    hasConsent: content.includes('cookie-consent.js'),
    hasViewport: content.includes('name="viewport"')
  });
});

console.table(report);

const missingFooter = report.filter(r => !r.hasFooter).map(r => r.file);
const missingI18n = report.filter(r => !r.hasI18n).map(r => r.file);
console.log('\nMissing Footer in:', missingFooter);
console.log('Missing i18n in:', missingI18n);
