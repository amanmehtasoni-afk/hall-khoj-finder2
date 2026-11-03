const fs = require('fs');
const path = require('path');

const dir = path.join(__dirname, '..', 'frontend');

// Read standard footer
const sampleContent = fs.readFileSync(path.join(dir, 'index.html'), 'utf8');
const footerMatch = sampleContent.match(/<footer class="site-footer"[\s\S]*?<\/footer>/);
if (!footerMatch) {
  console.error('Could not find standard footer in index.html');
  process.exit(1);
}
const standardFooter = footerMatch[0];

// 1. Fix 3d-preview.html
let p3d = fs.readFileSync(path.join(dir, '3d-preview.html'), 'utf8');
p3d = p3d.replace(/<footer class="site-footer"[\s\S]*?<\/footer>/, '');
// Add sleek floating bar in viewer
const viewerFooterBar = `
    <!-- Floating Bottom Legal / Support Bar -->
    <div style="position:absolute; bottom:1rem; right:1.5rem; z-index:30; background:rgba(7,20,38,0.85); backdrop-filter:blur(10px); border:1px solid rgba(255,255,255,0.12); padding:0.4rem 1rem; border-radius:var(--radius-full); display:flex; align-items:center; gap:1rem; font-size:0.75rem; color:var(--text-muted);">
      <a href="/support.html" style="color:var(--text-muted); text-decoration:none;">Support Desk</a>
      <span>•</span>
      <a href="tel:+919773647612" style="color:var(--color-electric); text-decoration:none;">+91 97736 47612</a>
      <span>•</span>
      <a href="/privacy.html" style="color:var(--text-muted); text-decoration:none;">Privacy</a>
      <span>•</span>
      <a href="/terms.html" style="color:var(--text-muted); text-decoration:none;">Terms</a>
      <span>•</span>
      <button type="button" class="cookie-settings-btn" data-action="open-cookie-settings" style="background:none; border:none; color:var(--color-champagne); font-size:0.75rem; cursor:pointer; padding:0; text-decoration:underline;">Cookies</button>
    </div>`;

if (!p3d.includes('Floating Bottom Legal')) {
  p3d = p3d.replace('</div>\n\n  <!-- Toast Notification Container -->', viewerFooterBar + '\n  </div>\n\n  <!-- Toast Notification Container -->');
}
fs.writeFileSync(path.join(dir, '3d-preview.html'), p3d, 'utf8');
console.log('Fixed: 3d-preview.html');

// 2. Fix dashboard.html
let dash = fs.readFileSync(path.join(dir, 'dashboard.html'), 'utf8');
dash = dash.replace(/<footer class="site-footer"[\s\S]*?<\/footer>/, '');
if (!dash.includes('name="description"')) {
  dash = dash.replace('</title>', '</title>\n  <meta name="description" content="Customer Dashboard — Manage your bookings, 3D layouts, favorites, messages and reviews on Hall Khoj Finder.">');
}
dash = dash.replace('</main>', '</main>\n\n' + standardFooter);
fs.writeFileSync(path.join(dir, 'dashboard.html'), dash, 'utf8');
console.log('Fixed: dashboard.html');

// 3. Fix hall-details.html
let hd = fs.readFileSync(path.join(dir, 'hall-details.html'), 'utf8');
hd = hd.replace(/<footer class="site-footer"[\s\S]*?<\/footer>/, '');
hd = hd.replace('</main>', '</main>\n\n' + standardFooter);
fs.writeFileSync(path.join(dir, 'hall-details.html'), hd, 'utf8');
console.log('Fixed: hall-details.html');

// 4. Fix synopsis.html
let syn = fs.readFileSync(path.join(dir, 'synopsis.html'), 'utf8');
syn = syn.replace(/<footer class="site-footer"[\s\S]*?<\/footer>/, '');
syn = syn.replace('</body>', standardFooter + '\n</body>');
fs.writeFileSync(path.join(dir, 'synopsis.html'), syn, 'utf8');
console.log('Fixed: synopsis.html');

console.log('Misplaced footers resolved successfully!');
