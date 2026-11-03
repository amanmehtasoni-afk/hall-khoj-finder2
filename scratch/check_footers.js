const fs = require('fs');
const path = require('path');

const dir = path.join(__dirname, '..', 'frontend');
const files = fs.readdirSync(dir).filter(f => f.endsWith('.html'));

files.forEach(f => {
  const c = fs.readFileSync(path.join(dir, f), 'utf8');
  const hasFooter = c.includes('<footer');
  const hasCookieCss = c.includes('cookie-consent.css');
  const hasCookieJs = c.includes('cookie-consent.js');
  const hasAnalytics = c.includes('analytics.js');
  const hasErrorMon = c.includes('error-monitor.js');
  console.log(`${f.padEnd(22)} | footer:${hasFooter ? 'Y' : 'N'} | cCss:${hasCookieCss ? 'Y' : 'N'} | cJs:${hasCookieJs ? 'Y' : 'N'} | aJs:${hasAnalytics ? 'Y' : 'N'} | err:${hasErrorMon ? 'Y' : 'N'}`);
});
