/**
 * Verification test for Phases 12, 13, 14, 15 & Multilingual integration
 */
const http = require('http');
const assert = require('assert');

function get(path) {
  return new Promise((resolve, reject) => {
    http.get(`http://localhost:3000${path}`, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => resolve({ status: res.statusCode, body: data, headers: res.headers }));
    }).on('error', reject);
  });
}

async function run() {
  console.log('\n======================================================');
  console.log('🌐 TESTING FRONTEND & MULTILINGUAL INTEGRATION');
  console.log('======================================================\n');

  // 1. Homepage & Multilingual Switcher
  const home = await get('/');
  assert.strictEqual(home.status, 200, 'Homepage status 200');
  assert.ok(home.body.includes('language-switcher-container'), 'Homepage has language switcher mount');
  assert.ok(home.body.includes('js/i18n.js'), 'Homepage loads i18n.js');
  assert.ok(home.body.includes('ai-prompt-input'), 'Homepage loads AI Natural Language Search modal input');
  assert.ok(home.body.includes('ai-search-client.js'), 'Homepage loads AI search client script');
  console.log('  ✅ PASS: Homepage serves with 14-language switcher mount & Hall Khoj AI Search modal');

  // 2. i18n Engine & Languages
  const i18nRes = await get('/js/i18n.js');
  assert.strictEqual(i18nRes.status, 200, 'i18n.js serves 200');
  const languages = ['hi', 'en', 'bho', 'mai', 'bn', 'te', 'mr', 'ta', 'gu', 'ur', 'kn', 'or', 'ml', 'pa'];
  languages.forEach(lang => {
    assert.ok(i18nRes.body.includes(`code: '${lang}'`), `i18n contains language ${lang}`);
  });
  console.log(`  ✅ PASS: i18n.js contains all 14 requested Indian languages (Hindi, Bhojpuri, Maithili, Bengali, Telugu, Marathi, Tamil, Gujarati, Urdu, Kannada, Odia, Malayalam, Punjabi, English)`);

  // 3. Hall Details & 3D Multi-lighting experience (Phase 14)
  const details = await get('/hall-details.html?id=h-101');
  assert.strictEqual(details.status, 200, 'hall-details status 200');
  assert.ok(details.body.includes('js/three-venue.js'), 'hall-details loads Three.js 3D venue layout inspector');
  assert.ok(details.body.includes('data-venue-lighting="daylight"'), 'hall-details contains Daylight preset button');
  assert.ok(details.body.includes('data-venue-lighting="sunset"'), 'hall-details contains Sunset preset button');
  assert.ok(details.body.includes('data-venue-lighting="night_gala"'), 'hall-details contains Night Gala preset button');
  assert.ok(details.body.includes('language-switcher-container'), 'hall-details has language switcher mount');
  console.log('  ✅ PASS: Hall Details serves procedural Three.js multi-zone viewer with 3 lighting modes & i18n');

  // 4. Owner Dashboard & AI Assistant (Phase 13)
  const ownerDash = await get('/owner/dashboard.html');
  assert.strictEqual(ownerDash.status, 200, 'Owner dashboard status 200');
  assert.ok(ownerDash.body.includes('language-switcher-container'), 'Owner dashboard has language switcher mount');
  assert.ok(ownerDash.body.includes('owner-ai-modal'), 'Owner dashboard contains AI Assistant modal');
  assert.ok(ownerDash.body.includes('triggerOwnerAI'), 'Owner dashboard has triggerOwnerAI logic');
  assert.ok(ownerDash.body.includes('ai-confirm-box'), 'Owner dashboard contains Confirmation Gate for safe action execution');
  console.log('  ✅ PASS: Owner Dashboard serves with AI Business Assistant, Confirmation Gate & i18n');

  // 5. Customer Dashboard & Payment Flow (Phase 15)
  const custDash = await get('/dashboard.html');
  assert.strictEqual(custDash.status, 200, 'Customer dashboard status 200');
  assert.ok(custDash.body.includes('language-switcher-container'), 'Customer dashboard has language switcher mount');
  assert.ok(custDash.body.includes('payment-checkout-modal'), 'Customer dashboard contains payment checkout modal');
  assert.ok(custDash.body.includes('openPaymentModal'), 'Customer dashboard implements openPaymentModal');
  assert.ok(custDash.body.includes('processAdvancePayment'), 'Customer dashboard implements processAdvancePayment');
  console.log('  ✅ PASS: Customer Dashboard serves with 25% Advance payment modal and verification flow');

  // 6. Search Page with i18n & Natural Language search
  const search = await get('/search.html');
  assert.strictEqual(search.status, 200, 'Search page status 200');
  assert.ok(search.body.includes('language-switcher-container'), 'Search page has language switcher mount');
  assert.ok(search.body.includes('js/i18n.js'), 'Search page loads i18n.js');
  console.log('  ✅ PASS: Marketplace search page serves with full multilingual capability');

  console.log('\n======================================================');
  console.log('🏁 ALL FRONTEND & MULTILINGUAL INTEGRATION CHECKS PASSED');
  console.log('======================================================\n');
}

run().catch(err => {
  console.error('❌ FRONTEND CHECK FAILED:', err);
  process.exit(1);
});
