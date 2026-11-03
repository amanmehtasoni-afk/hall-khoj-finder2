const fs = require('fs');
const path = require('path');

const dir = path.join(__dirname, '..', 'frontend');
const files = fs.readdirSync(dir).filter(f => f.endsWith('.html'));

const standardFooter = `  <!-- Standard Production Footer -->
  <footer class="site-footer">
    <div class="container">
      <div class="footer-grid">
        <div>
          <div class="brand-logo" style="margin-bottom:1rem;">
            <img src="/assets/logo.png" alt="Hall Khoj" class="brand-logo-img" loading="lazy" decoding="async">
            <span class="brand-title">HALL KHOJ</span>
          </div>
          <p style="font-size:0.875rem; color:var(--text-muted); line-height:1.6;">
            India's premiere 3D Event Services Marketplace. Discover Marriage Halls, Cars, Tent Houses, DJs, and Decorators with transparent pricing.
          </p>
          <div style="margin-top:1rem; font-size:0.8rem; color:#fbbf24; font-weight:600;">
            "Apne Paas Ka Hall, Tent, Car Aur Event Services Ek Jagah Khojiye"
          </div>
        </div>

        <div>
          <h4>Event Services</h4>
          <ul>
            <li><a href="/search.html?category=Marriage+Halls">Marriage & Banquet Halls</a></li>
            <li><a href="/search.html?category=Cars">Luxury Wedding Cars</a></li>
            <li><a href="/search.html?category=Tent+Houses">Tent & Shamiana Works</a></li>
            <li><a href="/search.html?category=Catering">Royal Catering Services</a></li>
            <li><a href="/search.html?category=Decoration">Stage & Flower Decoration</a></li>
            <li><a href="/gallery.html">3D Virtual Gallery</a></li>
          </ul>
        </div>

        <div>
          <h4>Portals & Roles</h4>
          <ul>
            <li><a href="/dashboard.html">Customer Dashboard</a></li>
            <li><a href="/owner/dashboard.html">Business Owner Portal</a></li>
            <li><a href="/admin/dashboard.html">Admin Verification Panel</a></li>
            <li><a href="/register.html?role=owner">List Your Hall / Service</a></li>
            <li><a href="/login.html">Sign In to Your Account</a></li>
            <li><a href="/compare.html">Compare Venues</a></li>
          </ul>
        </div>

        <div>
          <h4>Direct Support & Contact</h4>
          <ul>
            <li><a href="/support.html">Contact &amp; Support Desk</a></li>
            <li><a href="/support.html?tab=bug-report">Report a Bug / Issue</a></li>
            <li><a href="tel:+919773647612">Direct Call: +91 97736 47612</a></li>
            <li><a href="https://wa.me/919773647612" target="_blank" rel="noopener">WhatsApp Concierge</a></li>
            <li><a href="/terms.html">Terms &amp; Cancellation Policy</a></li>
            <li><a href="/privacy.html">Privacy &amp; Data Rights</a></li>
          </ul>
        </div>
      </div>

      <div class="site-footer-bottom">
        <div>&copy; 2026 Hall Khoj Finder. All Rights Reserved.</div>
        <div style="display:flex; flex-wrap:wrap; gap:1.25rem; align-items:center;">
          <a href="/privacy.html">Privacy Policy</a>
          <a href="/terms.html">Terms &amp; Conditions</a>
          <a href="/support.html">Support &amp; Help</a>
          <a href="/sitemap.xml" target="_blank">Sitemap</a>
          <button type="button" class="cookie-settings-btn" data-action="open-cookie-settings">Cookie Preferences</button>
        </div>
      </div>
    </div>
  </footer>`;

const compactFooter = `  <!-- Compact Footer for Auth Pages -->
  <footer class="site-footer" style="padding: 1.5rem 0;">
    <div class="container site-footer-bottom">
      <div>&copy; 2026 Hall Khoj Finder. All Rights Reserved.</div>
      <div style="display:flex; flex-wrap:wrap; gap:1.25rem; align-items:center;">
        <a href="/privacy.html">Privacy Policy</a>
        <a href="/terms.html">Terms &amp; Conditions</a>
        <a href="/support.html">Support Desk</a>
        <a href="tel:+919773647612">+91 97736 47612</a>
        <button type="button" class="cookie-settings-btn" data-action="open-cookie-settings">Cookie Preferences</button>
      </div>
    </div>
  </footer>`;

let updatedCount = 0;

files.forEach(file => {
  let content = fs.readFileSync(path.join(dir, file), 'utf8');
  let original = content;

  // 1. Ensure favicon
  if (!content.includes('rel="icon"') && !content.includes("rel='icon'")) {
    content = content.replace('</head>', '  <link rel="icon" type="image/png" href="/assets/logo.png">\n</head>');
  }

  // 2. Ensure cookie-consent.css
  if (!content.includes('cookie-consent.css')) {
    content = content.replace('</head>', '  <link rel="stylesheet" href="/css/cookie-consent.css">\n</head>');
  }

  // 3. Lazy loading & decoding on <img> tags
  content = content.replace(/<img\b([^>]*)>/gi, (match, attrs) => {
    let updated = match;
    if (!/\bloading=/i.test(attrs)) {
      updated = updated.replace(/<img\b/i, '<img loading="lazy"');
    }
    if (!/\bdecoding=/i.test(attrs)) {
      updated = updated.replace(/<img\b/i, '<img decoding="async"');
    }
    return updated;
  });

  // 4. Update / Add Footer
  if (file === 'login.html' || file === 'register.html' || file === 'forgot-password.html') {
    if (content.includes('<footer')) {
      content = content.replace(/<footer[\s\S]*?<\/footer>/i, compactFooter);
    } else {
      // Insert before mobile nav or scripts
      if (content.includes('<nav class="mobile-bottom-nav"')) {
        content = content.replace('<nav class="mobile-bottom-nav"', compactFooter + '\n\n  <nav class="mobile-bottom-nav"');
      } else if (content.includes('<script')) {
        const firstScriptIdx = content.indexOf('<script');
        content = content.slice(0, firstScriptIdx) + compactFooter + '\n\n  ' + content.slice(firstScriptIdx);
      } else {
        content = content.replace('</body>', compactFooter + '\n</body>');
      }
    }
  } else if (file !== 'index.html' && file !== 'support.html' && file !== 'privacy.html' && file !== 'terms.html' && file !== '404.html') {
    if (content.includes('<footer')) {
      content = content.replace(/<footer[\s\S]*?<\/footer>/i, standardFooter);
    } else {
      if (content.includes('<nav class="mobile-bottom-nav"')) {
        content = content.replace('<nav class="mobile-bottom-nav"', standardFooter + '\n\n  <nav class="mobile-bottom-nav"');
      } else if (content.includes('<script')) {
        const firstScriptIdx = content.indexOf('<script');
        content = content.slice(0, firstScriptIdx) + standardFooter + '\n\n  ' + content.slice(firstScriptIdx);
      } else {
        content = content.replace('</body>', standardFooter + '\n</body>');
      }
    }
  }

  // 5. Ensure scripts before </body>
  const missingErrorMon = !content.includes('error-monitor.js');
  const missingCookieJs = !content.includes('cookie-consent.js');
  const missingAnalytics = !content.includes('analytics.js');

  if (missingErrorMon || missingCookieJs || missingAnalytics) {
    let scriptTags = '\n  <!-- Observability, Analytics & Privacy Consent (Phases 10, 11, 21) -->\n';
    if (missingErrorMon) scriptTags += '  <script src="/js/error-monitor.js"></script>\n';
    if (missingCookieJs) scriptTags += '  <script src="/js/cookie-consent.js"></script>\n';
    if (missingAnalytics) scriptTags += '  <script src="/js/analytics.js"></script>\n';
    content = content.replace('</body>', scriptTags + '</body>');
  }

  if (content !== original) {
    fs.writeFileSync(path.join(dir, file), content, 'utf8');
    updatedCount++;
    console.log(`Updated: ${file}`);
  } else {
    console.log(`Unchanged: ${file}`);
  }
});

console.log(`\nFinished standardizing. ${updatedCount} files updated.`);
