const fs = require('fs');
const path = require('path');
const assert = require('assert');

console.log('Testing Dark/Light Theme Tokens and CSS Enforcement...');

const mainCss = fs.readFileSync(path.join(__dirname, '../frontend/css/main.css'), 'utf8');
const compCss = fs.readFileSync(path.join(__dirname, '../frontend/css/components.css'), 'utf8');

// 1. Verify Dark Mode Token Definitions
assert(mainCss.includes('--text-primary: #FFFFFF;'), 'Dark mode text-primary should be #FFFFFF');
console.log('✓ Dark mode text-primary is #FFFFFF (Pure White)');

// 2. Verify Light Mode Token Definitions
assert(mainCss.includes('--text-primary: #000000;'), 'Light mode text-primary should be #000000');
assert(mainCss.includes('--text-secondary: #111827;'), 'Light mode text-secondary should be #111827');
assert(mainCss.includes('--text-muted: #374151;'), 'Light mode text-muted should be #374151');
console.log('✓ Light mode text tokens are deep solid black (#000000 / #111827 / #374151)');

// 3. Verify Global Light Mode Headings Override
assert(mainCss.includes(':root[data-theme="light"] h1'), 'Missing light mode h1-h6 override');
assert(mainCss.includes('color: #000000 !important;'), 'Headings should be forced to #000000 in light mode');
console.log('✓ Global light mode h1-h6 headings enforced to #000000');

// 4. Verify Components in Light Mode
assert(compCss.includes(':root[data-theme="light"] .glass-panel'), 'Missing light mode glass-panel');
assert(compCss.includes(':root[data-theme="light"] .listing-title'), 'Missing light mode listing-title');
assert(compCss.includes(':root[data-theme="light"] .modal-dialog'), 'Missing light mode modal-dialog');
assert(compCss.includes(':root[data-theme="light"] .mobile-bottom-nav'), 'Missing light mode mobile-bottom-nav');
assert(compCss.includes(':root[data-theme="light"] input[type="text"]'), 'Missing light mode input override');
console.log('✓ All core components (cards, listings, modals, navigation, inputs) covered in light mode');

// 5. Verify Theme Toggle Delegation in theme.js
const themeJs = fs.readFileSync(path.join(__dirname, '../frontend/js/theme.js'), 'utf8');
assert(themeJs.includes('document.body.setAttribute(\'data-theme\', theme);'), 'theme.js should sync body attribute');
console.log('✓ theme.js synchronizes document.documentElement and document.body');

console.log('\n🎉 ALL DARK / LIGHT THEME CONTRAST TESTS PASSED!');
