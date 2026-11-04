const fs = require('fs');
const path = require('path');

const FOOTER_HTML = `  <!-- =========================================================================
       SECTION 16: COMPLETE 5-COLUMN 3D GLASS FOOTER (PHASE 6)
  ========================================================================= -->
  <footer class="site-footer">
    <div class="container">
      <div class="footer-5col-grid">
        <!-- COLUMN 1 — HALL KHOJ FINDER -->
        <div class="footer-col-card">
          <div class="brand-logo" style="margin-bottom:0.85rem;">
            <img src="/assets/logo.png" alt="Hall Khoj" class="brand-logo-img" loading="lazy" decoding="async">
            <span class="brand-title">HALL KHOJ</span>
          </div>
          <p style="font-size:0.86rem; color:var(--text-secondary); line-height:1.6; margin-bottom:0.75rem;">
            India's premier 3D Event Services Marketplace. Discover Marriage Halls, Cars, Tent Houses, DJs, and Decorators with transparent pricing and zero brokerage.
          </p>
          <div style="font-size:0.78rem; color:#fbbf24; font-weight:600; line-height:1.4;">
            "Apne Paas Ka Hall, Tent, Car Aur Event Services Ek Jagah Khojiye"
          </div>

          <!-- 3D Social Media Icons -->
          <div class="footer-social-row">
            <a href="https://twitter.com" target="_blank" rel="noopener" class="icon-3d-box icon-3d-sm icon-3d-blue" title="Twitter / X" aria-label="Twitter">𝕏</a>
            <a href="https://instagram.com" target="_blank" rel="noopener" class="icon-3d-box icon-3d-sm icon-3d-ruby" title="Instagram" aria-label="Instagram">📸</a>
            <a href="https://youtube.com" target="_blank" rel="noopener" class="icon-3d-box icon-3d-sm icon-3d-ruby" title="YouTube" aria-label="YouTube">▶️</a>
            <a href="https://facebook.com" target="_blank" rel="noopener" class="icon-3d-box icon-3d-sm icon-3d-blue" title="Facebook" aria-label="Facebook">f</a>
            <a href="https://wa.me/919773647612" target="_blank" rel="noopener" class="icon-3d-box icon-3d-sm icon-3d-emerald" title="WhatsApp Concierge" aria-label="WhatsApp">💬</a>
          </div>
        </div>

        <!-- COLUMN 2 — EVENT SERVICES -->
        <div class="footer-col-card">
          <h4><span>🏰</span> Event Services</h4>
          <ul class="footer-links-list">
            <li class="footer-link-item"><a href="/search.html?category=Marriage+Halls">Marriage &amp; Banquet Halls</a></li>
            <li class="footer-link-item"><a href="/search.html?category=Cars">Luxury Wedding Cars</a></li>
            <li class="footer-link-item"><a href="/search.html?category=Tent+Houses">Tent &amp; Shamiana Works</a></li>
            <li class="footer-link-item"><a href="/search.html?category=Catering">Royal Shahi Catering</a></li>
            <li class="footer-link-item"><a href="/search.html?category=Decoration">Stage &amp; Flower Decor</a></li>
            <li class="footer-link-item"><a href="/search.html?category=DJ">DJ &amp; Sound Services</a></li>
            <li class="footer-link-item"><a href="/3d-preview.html">3D Virtual Gallery</a></li>
          </ul>
        </div>

        <!-- COLUMN 3 — CUSTOMER & BUSINESS -->
        <div class="footer-col-card">
          <h4><span>🏢</span> Portals &amp; Roles</h4>
          <ul class="footer-links-list">
            <li class="footer-link-item"><a href="/dashboard.html">Customer Dashboard</a></li>
            <li class="footer-link-item"><a href="/owner/dashboard.html">Business Owner Portal</a></li>
            <li class="footer-link-item"><a href="/admin/dashboard.html">Admin Verification Panel</a></li>
            <li class="footer-link-item"><a href="/register.html?role=owner">List Your Hall / Service</a></li>
            <li class="footer-link-item"><a href="/compare.html">Compare Venues</a></li>
            <li class="footer-link-item"><a href="/login.html">Sign In to Your Account</a></li>
            <li class="footer-link-item"><a href="/register.html?role=owner">Register Business</a></li>
          </ul>
        </div>

        <!-- COLUMN 4 — SUPPORT & CONTACT -->
        <div class="footer-col-card">
          <h4><span>📞</span> Support &amp; Help</h4>
          <ul class="footer-links-list">
            <li class="footer-link-item"><a href="/support.html">Contact &amp; Support Desk</a></li>
            <li class="footer-link-item"><a href="/support.html?tab=bug-report">Report a Bug / Issue</a></li>
            <li class="footer-link-item"><a href="https://wa.me/919773647612" target="_blank" rel="noopener">WhatsApp Support</a></li>
            <li class="footer-link-item"><a href="tel:+919773647612">Direct Call: +91 97736 47612</a></li>
            <li class="footer-link-item"><a href="/help.html">Help Center &amp; Guides</a></li>
            <li class="footer-link-item"><a href="mailto:support@hallkhoj.in">Email: support@hallkhoj.in</a></li>
          </ul>
        </div>

        <!-- COLUMN 5 — LEGAL & COMPLIANCE -->
        <div class="footer-col-card">
          <h4><span>⚖️</span> Legal &amp; Policies</h4>
          <ul class="footer-links-list">
            <li class="footer-link-item"><a href="/privacy.html">Privacy Policy</a></li>
            <li class="footer-link-item"><a href="/terms.html">Terms &amp; Conditions</a></li>
            <li class="footer-link-item"><a href="/terms.html#cancellation">Cancellation &amp; Refund Policy</a></li>
            <li class="footer-link-item"><a href="/privacy.html#rights">Privacy &amp; Data Rights</a></li>
            <li class="footer-link-item"><a href="/sitemap.xml" target="_blank">Dynamic XML Sitemap</a></li>
            <li class="footer-link-item">
              <button type="button" class="cookie-settings-btn" data-action="open-cookie-settings" style="color:var(--text-champagne); font-weight:600;">
                🍪 Cookie Preferences
              </button>
            </li>
          </ul>
        </div>
      </div>

      <div class="site-footer-bottom">
        <div>
          &copy; 2026 Hall Khoj Finder. All Rights Reserved.
          <span id="footer-backend-info" style="color:#10b981; margin-left:0.5rem; font-weight:600;">API: Online (Dual Fallback)</span>
        </div>
        <div style="display:flex; flex-wrap:wrap; gap:1.25rem; align-items:center;">
          <a href="/privacy.html">Privacy Policy</a>
          <a href="/terms.html">Terms &amp; Conditions</a>
          <a href="/support.html">Support &amp; Help Desk</a>
          <a href="/sitemap.xml" target="_blank">Sitemap</a>
          <button type="button" class="cookie-settings-btn" data-action="open-cookie-settings">Cookie Preferences</button>
        </div>
      </div>
    </div>
  </footer>`;

const dir = 'frontend';
const files = fs.readdirSync(dir).filter(f => f.endsWith('.html') && f !== 'synopsis.html');

console.log(`Unifying footers and i18n across ${files.length} HTML files...`);

files.forEach(f => {
  const filePath = path.join(dir, f);
  let html = fs.readFileSync(filePath, 'utf8');

  // Skip index.html since we already updated it manually
  if (f !== 'index.html') {
    // 1. Replace existing footer or insert before closing body
    if (html.includes('<footer class="site-footer">')) {
      const start = html.indexOf('<footer class="site-footer">');
      const end = html.indexOf('</footer>', start) + 9;
      html = html.substring(0, start) + FOOTER_HTML + html.substring(end);
    } else if (f !== '3d-preview.html') {
      // Insert before </main> or before closing body
      if (html.includes('</main>')) {
        html = html.replace('</main>', '</main>\n' + FOOTER_HTML);
      } else if (html.includes('</body>')) {
        html = html.replace('</body>', FOOTER_HTML + '\n</body>');
      }
    }

    // 2. Add i18n script if missing and not 3d-preview
    if (!html.includes('i18n.js') && f !== '3d-preview.html') {
      if (html.includes('<script src="js/theme.js"></script>')) {
        html = html.replace('<script src="js/theme.js"></script>', '<script src="js/theme.js"></script>\n  <script src="/js/i18n.js"></script>');
      } else if (html.includes('<script src="/js/theme.js"></script>')) {
        html = html.replace('<script src="/js/theme.js"></script>', '<script src="/js/theme.js"></script>\n  <script src="/js/i18n.js"></script>');
      } else if (html.includes('</body>')) {
        html = html.replace('</body>', '  <script src="/js/i18n.js"></script>\n</body>');
      }
    }

    fs.writeFileSync(filePath, html, 'utf8');
    console.log(`Updated: ${f}`);
  }
});

console.log('Unification complete!');
