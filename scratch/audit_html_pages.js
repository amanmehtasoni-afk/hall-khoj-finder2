const fs = require('fs');
const path = require('path');

const frontendDir = path.join(__dirname, '..', 'frontend');
const htmlFiles = fs.readdirSync(frontendDir).filter(f => f.endsWith('.html'));

console.log(`Auditing ${htmlFiles.length} HTML files...`);

const report = {};

htmlFiles.forEach(file => {
  const content = fs.readFileSync(path.join(frontendDir, file), 'utf8');
  report[file] = {
    hasCookieConsentCss: content.includes('cookie-consent.css'),
    hasCookieConsentJs: content.includes('cookie-consent.js'),
    hasAnalyticsJs: content.includes('analytics.js'),
    hasErrorMonitorJs: content.includes('error-monitor.js'),
    hasPrivacyLink: content.includes('privacy.html'),
    hasTermsLink: content.includes('terms.html'),
    hasSupportLink: content.includes('support.html'),
    hasSupportPhone: content.includes('97736 47612') || content.includes('9773647612'),
    hasFavicon: content.includes('rel="icon"') || content.includes("rel='icon'"),
    hasDescription: content.includes('name="description"'),
    imagesCount: (content.match(/<img\b[^>]*>/gi) || []).length,
    imagesWithoutLazy: (content.match(/<img\b(?![^>]*\bloading=)[^>]*>/gi) || []).length
  };
});

console.log(JSON.stringify(report, null, 2));
