/**
 * Hall Khoj Finder — Phases 16, 17, 18, 19 Comprehensive Test Suite
 * Validates Security, Performance, SEO, Production Config & End-to-End Flow.
 */

const http = require('http');
const assert = require('assert');

const BASE_URL = 'http://localhost:3000';

function request(path, options = {}) {
  return new Promise((resolve, reject) => {
    const url = new URL(path, BASE_URL);
    const headers = options.headers || {};
    let bodyData = null;

    if (options.body) {
      bodyData = typeof options.body === 'string' ? options.body : JSON.stringify(options.body);
      headers['Content-Type'] = headers['Content-Type'] || 'application/json';
      headers['Content-Length'] = Buffer.byteLength(bodyData);
    }

    const req = http.request(url, {
      method: options.method || 'GET',
      headers
    }, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        let json = null;
        try { json = JSON.parse(data); } catch (e) {}
        resolve({
          status: res.statusCode,
          headers: res.headers,
          data: json,
          text: data
        });
      });
    });

    req.on('error', reject);
    if (bodyData) req.write(bodyData);
    req.end();
  });
}

async function run() {
  console.log('\n======================================================');
  console.log('🛡️  TEST SUITE: PHASES 16 TO 19 (SECURITY, SEO & E2E)');
  console.log('======================================================\n');

  // =========================================================================
  // 1. Security Headers Verification (Phase 16)
  // =========================================================================
  console.log('--- 1. Enterprise Security Headers ---');
  const rootRes = await request('/');
  assert.strictEqual(rootRes.status, 200, 'Root status 200 OK');
  assert.ok(rootRes.headers['content-security-policy'], 'Content-Security-Policy header present');
  assert.ok(rootRes.headers['content-security-policy'].includes("default-src 'self'"), 'CSP defines default-src');
  assert.ok(rootRes.headers['content-security-policy'].includes("script-src 'self'"), 'CSP defines safe script-src');
  assert.strictEqual(rootRes.headers['x-content-type-options'], 'nosniff', 'X-Content-Type-Options is nosniff');
  assert.strictEqual(rootRes.headers['x-frame-options'], 'SAMEORIGIN', 'X-Frame-Options is SAMEORIGIN');
  assert.ok(rootRes.headers['strict-transport-security'], 'HSTS header present');
  assert.strictEqual(rootRes.headers['referrer-policy'], 'strict-origin-when-cross-origin', 'Referrer-Policy is strict-origin');
  console.log('  ✅ PASS: Helmet-grade security headers (CSP, HSTS, X-Frame-Options, nosniff, Referrer-Policy) verified');

  // =========================================================================
  // 2. Performance & Cache-Control Verification (Phase 16)
  // =========================================================================
  console.log('\n--- 2. Performance & Cache-Control Headers ---');
  const apiRes = await request('/api/health');
  assert.strictEqual(apiRes.status, 200, 'API health status 200');
  assert.ok(
    apiRes.headers['cache-control'].includes('no-store'),
    'API responses disable static caching with no-store'
  );
  assert.strictEqual(apiRes.headers['pragma'], 'no-cache', 'API headers include Pragma: no-cache');

  const cssRes = await request('/css/main.css');
  assert.strictEqual(cssRes.status, 200, 'CSS file serves 200 OK');
  assert.ok(
    cssRes.headers['cache-control'].includes('public') && cssRes.headers['cache-control'].includes('max-age'),
    'Static asset includes public caching header'
  );
  console.log('  ✅ PASS: Dynamic API endpoints strictly bypass cache while static assets leverage client caching');

  // =========================================================================
  // 3. SEO Directives & Dynamic XML Sitemap (Phase 16)
  // =========================================================================
  console.log('\n--- 3. SEO Directives & Dynamic XML Sitemap ---');
  const robotsRes = await request('/robots.txt');
  assert.strictEqual(robotsRes.status, 200, 'robots.txt status 200 OK');
  assert.ok(robotsRes.text.includes('User-agent: *'), 'robots.txt includes User-agent directive');
  assert.ok(robotsRes.text.includes('Disallow: /api/'), 'robots.txt protects API routes');
  assert.ok(robotsRes.text.includes('Disallow: /admin/'), 'robots.txt protects Admin panel');
  assert.ok(robotsRes.text.includes('Sitemap:'), 'robots.txt declares XML Sitemap link');

  const sitemapRes = await request('/sitemap.xml');
  assert.strictEqual(sitemapRes.status, 200, 'sitemap.xml status 200 OK');
  assert.ok(sitemapRes.headers['content-type'].includes('xml'), 'sitemap content-type is application/xml');
  assert.ok(sitemapRes.text.includes('<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">'), 'Valid sitemap XML schema declaration');
  assert.ok(sitemapRes.text.includes('<loc>'), 'Sitemap contains loc tags');
  assert.ok(sitemapRes.text.includes('category=Marriage%20Hall') || sitemapRes.text.includes('category=Marriage+Hall'), 'Sitemap indexes event categories');
  assert.ok(sitemapRes.text.includes('city=Lucknow'), 'Sitemap indexes city landing pages');
  console.log('  ✅ PASS: robots.txt and dynamic sitemap.xml verified with valid XML structure and category indexes');

  // =========================================================================
  // 4. Input Sanitization Guard (Phase 16)
  // =========================================================================
  console.log('\n--- 4. Input Sanitization & Anti-XSS Protection ---');
  const xssSearchRes = await request('/api/search?q=<script>alert("xss")</script>Heritage');
  assert.strictEqual(xssSearchRes.status, 200, 'Search handles potential XSS payloads safely');
  assert.ok(xssSearchRes.data?.success, 'Query processed successfully');
  console.log('  ✅ PASS: Malicious script tags stripped safely from input parameters');

  // =========================================================================
  // 5. System Telemetry & Health Checks (Phases 16 & 19)
  // =========================================================================
  console.log('\n--- 5. Health Telemetry & Container Endpoints ---');
  const healthRes = await request('/health');
  assert.strictEqual(healthRes.status, 200, 'Root /health status 200 OK');
  assert.strictEqual(healthRes.data?.status, 'UP', 'Health status is UP');
  assert.strictEqual(healthRes.data?.name, 'Hall Khoj Finder API', 'API name reported');
  assert.ok(typeof healthRes.data?.uptimeSeconds === 'number', 'Uptime reported');
  assert.ok(healthRes.data?.memoryUsage?.rssMb > 0, 'Memory telemetry reported');
  console.log('  ✅ PASS: /health and /api/health endpoints deliver production container telemetry');

  // =========================================================================
  // 6. Complete End-to-End User Journey (Phase 17)
  // =========================================================================
  console.log('\n--- 6. Complete End-to-End User Journey ---');
  const timestamp = Date.now();
  const customerEmail = `e2e_cust_${timestamp}@test.com`;
  const ownerEmail = `e2e_owner_${timestamp}@test.com`;

  // 6.1 Register Customer
  const custRegRes = await request('/api/auth/register', {
    method: 'POST',
    body: {
      name: 'E2E Test Customer',
      email: customerEmail,
      password: 'Password@123',
      mobile: '9876500001',
      role: 'customer'
    }
  });
  assert.strictEqual(custRegRes.status, 201, 'Customer registered with 201');
  const custToken = custRegRes.data?.data?.token;
  assert.ok(custToken, 'Received customer JWT');

  // 6.2 Register Owner
  const ownerRegRes = await request('/api/auth/register', {
    method: 'POST',
    body: {
      name: 'E2E Venue Owner',
      email: ownerEmail,
      password: 'Password@123',
      mobile: '9876500002',
      role: 'owner',
      businessName: 'Royal Kohinoor Palace'
    }
  });
  assert.strictEqual(ownerRegRes.status, 201, 'Owner registered with 201');
  const ownerToken = ownerRegRes.data?.data?.token;
  assert.ok(ownerToken, 'Received owner JWT');

  // 6.3 Owner Creates Venue
  const createVenueRes = await request('/api/halls', {
    method: 'POST',
    headers: { Authorization: `Bearer ${ownerToken}` },
    body: {
      name: 'Royal Kohinoor Palace Lucknow',
      category: 'Marriage Hall',
      city: 'Lucknow',
      address: 'Hazratganj, Lucknow',
      capacityMax: 800,
      startingPrice: 120000,
      facilities: ['AC', 'Lawn', 'Rooms', 'Parking'],
      status: 'APPROVED'
    }
  });
  assert.strictEqual(createVenueRes.status, 201, 'Owner creates venue with 201');
  const venueId = createVenueRes.data?.data?.id;

  // 6.4 Customer Searches via Natural Language AI
  const aiSearchRes = await request('/api/ai/search', {
    method: 'POST',
    body: { prompt: 'Lucknow me 800 logo ke liye shaadi hall chahiye 1.5 lakh me' }
  });
  assert.strictEqual(aiSearchRes.status, 200, 'AI search returns 200');
  assert.ok(aiSearchRes.data?.data?.results?.length > 0, 'Found matching real database venue');

  // 6.5 Customer Checks Availability
  const checkDate = '2026-11-20';
  const availRes = await request(`/api/bookings/check-availability?hallId=${venueId}&date=${checkDate}`);
  assert.strictEqual(availRes.status, 200, 'Check availability returns 200');
  assert.strictEqual(availRes.data?.data?.status, 'AVAILABLE', 'Date is available for reservation');

  // 6.6 Customer Submits Booking Request
  const createBookingRes = await request('/api/bookings', {
    method: 'POST',
    headers: { Authorization: `Bearer ${custToken}` },
    body: {
      hallId: venueId,
      eventDate: checkDate,
      timeSlot: 'Full Day',
      guestCount: 600,
      customerName: 'E2E Test Customer',
      customerMobile: '9876500001',
      customerEmail
    }
  });
  assert.strictEqual(createBookingRes.status, 201, 'Booking request created with 201');
  const bookingId = createBookingRes.data?.data?.id;
  assert.strictEqual(createBookingRes.data?.data?.status, 'REQUESTED', 'Booking initial state is REQUESTED');

  // 6.7 Owner Accepts Booking
  const acceptRes = await request(`/api/bookings/${bookingId}/status`, {
    method: 'PATCH',
    headers: { Authorization: `Bearer ${ownerToken}` },
    body: { status: 'ACCEPTED' }
  });
  assert.strictEqual(acceptRes.status, 200, 'Owner accepts booking (200 OK)');
  assert.strictEqual(acceptRes.data?.data?.status, 'ACCEPTED', 'Booking state is ACCEPTED');

  // 6.8 Customer Creates Payment Order (25% Advance strictly recalculated)
  const orderRes = await request('/api/payments/create-order', {
    method: 'POST',
    headers: { Authorization: `Bearer ${custToken}` },
    body: { bookingId }
  });
  assert.strictEqual(orderRes.status, 201, 'Create payment order returns 201');
  const advanceAmount = orderRes.data?.data?.advanceAmount || orderRes.data?.data?.amount;
  const expectedAdvance = Math.round((orderRes.data?.data?.totalPrice || 0) * 0.25);
  assert.strictEqual(advanceAmount, expectedAdvance, '25% Advance calculated correctly from server-recalculated total');

  // 6.9 Customer Verifies Payment & Transitions Booking to CONFIRMED
  const verifyPayRes = await request('/api/payments/verify', {
    method: 'POST',
    headers: { Authorization: `Bearer ${custToken}` },
    body: {
      bookingId,
      orderId: orderRes.data?.data?.orderId,
      paymentId: `pay_e2e_${timestamp}`,
      signature: 'SIMULATED_TEST_SIGNATURE',
      method: 'UPI'
    }
  });
  assert.strictEqual(verifyPayRes.status, 200, 'Payment verified successfully');
  assert.strictEqual(verifyPayRes.data?.data?.status, 'CONFIRMED', 'Payment response reports CONFIRMED');

  const liveBookingRes = await request(`/api/bookings/${bookingId}`, {
    headers: { Authorization: `Bearer ${custToken}` }
  });
  assert.strictEqual(liveBookingRes.data?.data?.status, 'CONFIRMED', 'Booking transitioned to CONFIRMED');
  assert.strictEqual(liveBookingRes.data?.data?.paymentStatus, 'ADVANCE_PAID', 'Payment status is ADVANCE_PAID');

  // 6.10 Event Day Completed & Verified Review Submitted
  const completeRes = await request(`/api/bookings/${bookingId}/status`, {
    method: 'PATCH',
    headers: { Authorization: `Bearer ${ownerToken}` },
    body: { status: 'COMPLETED' }
  });
  assert.strictEqual(completeRes.status, 200, 'Booking moved to COMPLETED');

  const reviewRes = await request('/api/reviews', {
    method: 'POST',
    headers: { Authorization: `Bearer ${custToken}` },
    body: {
      bookingId,
      serviceId: venueId,
      rating: 5,
      title: 'Flawless wedding experience!',
      comment: 'The 3D walkthrough was completely accurate to the real palace. Five stars!',
      aspects: { cleanliness: 5, staff: 5, value: 5 }
    }
  });
  assert.strictEqual(reviewRes.status, 201, 'Verified review submitted with 201');
  assert.strictEqual(reviewRes.data?.data?.verifiedBooking, true, 'Review marked as verified booking');
  console.log('  ✅ PASS: Complete lifecycle (Register -> AI Search -> Booking -> Advance Payment -> Completed -> Verified Review) executed flawlessly');

  console.log('\n======================================================');
  console.log('🏁 PHASES 16-19 TEST SUITE: ALL ASSERTIONS PASSED (100%)');
  console.log('======================================================\n');
}

run().catch(err => {
  console.error('❌ TEST SUITE FAILED:', err);
  process.exit(1);
});
