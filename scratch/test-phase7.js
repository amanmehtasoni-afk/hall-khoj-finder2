/**
 * Hall Khoj Finder — Phase 7 Verification Test Suite
 * Business Listing System: 19 Event Categories, Standardized Schema, Multi-category Search & Bookings
 */

const http = require('http');

const API_HOST = 'localhost';
const API_PORT = 3000;

function request(path, options = {}) {
  return new Promise((resolve, reject) => {
    const headers = {
      'Content-Type': 'application/json',
      ...(options.headers || {})
    };

    let body = options.body;
    if (body && typeof body === 'object') {
      body = JSON.stringify(body);
    }

    const req = http.request({
      host: API_HOST,
      port: API_PORT,
      path: `/api${path}`,
      method: options.method || 'GET',
      headers
    }, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try {
          const json = JSON.parse(data);
          resolve({ status: res.statusCode, data: json });
        } catch (e) {
          resolve({ status: res.statusCode, raw: data });
        }
      });
    });

    req.on('error', reject);
    if (body) req.write(body);
    req.end();
  });
}

let passed = 0;
let failed = 0;

function assert(condition, message) {
  if (condition) {
    console.log(`  ✅ PASS: ${message}`);
    passed++;
  } else {
    console.error(`  ❌ FAIL: ${message}`);
    failed++;
  }
}

async function runTests() {
  console.log('\n🚀 ========================================================');
  console.log('   HALL KHOJ FINDER — PHASE 7 TEST SUITE (19 CATEGORIES)');
  console.log('========================================================\n');

  try {
    // 1. Categories List Endpoint (/api/categories)
    console.log('--- 1. 19 Event Categories Verification ---');
    const catRes = await request('/categories');
    assert(catRes.status === 200, 'GET /api/categories returns 200 OK');
    const categories = catRes.data?.data || [];
    assert(categories.length === 19, `Exact 19 event categories defined (got ${categories.length})`);

    const requiredSlugs = [
      'marriage-hall',
      'banquet-hall',
      'party-hall',
      'wedding-venue',
      'resort',
      'community-hall',
      'tent-house',
      'decoration',
      'catering',
      'photography',
      'videography',
      'dj',
      'sound-system',
      'lighting',
      'flower-decoration',
      'furniture',
      'event-staff',
      'wedding-car',
      'other-services'
    ];

    const foundSlugs = categories.map(c => c.slug);
    let allFound = true;
    for (const slug of requiredSlugs) {
      if (!foundSlugs.includes(slug)) {
        console.error(`  Missing category slug: ${slug}`);
        allFound = false;
      }
    }
    assert(allFound, 'All 19 required event categories present and verified');

    // Verify category schema
    const firstCat = categories[0];
    assert(firstCat.name && firstCat.hindiName && firstCat.icon && firstCat.priceType, 'Category contains bilingual names, icon, and price type');

    // 2. Category Detail by Slug (/api/categories/:slug)
    console.log('\n--- 2. Category Detail & Associated Listings ---');
    const cateringRes = await request('/categories/catering');
    assert(cateringRes.status === 200, 'GET /api/categories/catering returns 200 OK');
    assert(cateringRes.data?.data?.name === 'Catering', 'Category name is Catering');
    assert(Array.isArray(cateringRes.data?.data?.listings), 'Category contains listings array');
    assert(cateringRes.data?.data?.listings?.length > 0, 'Catering category has active listings');

    const photoRes = await request('/categories/photography');
    assert(photoRes.status === 200, 'GET /api/categories/photography returns 200 OK');
    assert(photoRes.data?.data?.name === 'Photography', 'Category name is Photography');
    assert(photoRes.data?.data?.listings?.length > 0, 'Photography category has active listings');

    const invalidCatRes = await request('/categories/non-existent-category');
    assert(invalidCatRes.status === 404, 'Invalid category slug correctly returns 404 Not Found');

    // 3. Multi-Category Search Queries
    console.log('\n--- 3. Multi-Category Marketplace Search ---');
    // Search DJ
    const djSearch = await request('/search?category=dj');
    assert(djSearch.status === 200, 'GET /api/search?category=dj returns 200 OK');
    const djResults = djSearch.data?.data?.results || djSearch.data?.data || [];
    assert(djResults.length > 0, 'DJ category search returns listings');
    assert(djResults[0]?.category === 'DJ', 'First search item is DJ service');

    // Search Wedding Car
    const carSearch = await request('/search?category=wedding-car');
    assert(carSearch.status === 200, 'GET /api/search?category=wedding-car returns 200 OK');
    const carResults = carSearch.data?.data?.results || carSearch.data?.data || [];
    assert(carResults.length > 0, 'Wedding Car search returns listings');

    // Search Lighting
    const lightSearch = await request('/search?category=lighting');
    assert(lightSearch.status === 200, 'GET /api/search?category=lighting returns 200 OK');
    const lightResults = lightSearch.data?.data?.results || lightSearch.data?.data || [];
    assert(lightResults.length > 0, 'Lighting search returns listings');

    // Search Flower Decoration
    const flowerSearch = await request('/search?category=flower-decoration');
    assert(flowerSearch.status === 200, 'GET /api/search?category=flower-decoration returns 200 OK');
    const flowerResults = flowerSearch.data?.data?.results || flowerSearch.data?.data || [];
    assert(flowerResults.length > 0, 'Flower Decoration search returns listings');

    // Search by city + keyword
    const lucknowSearch = await request('/search?city=Lucknow&q=Catering');
    assert(lucknowSearch.status === 200, 'GET /api/search?city=Lucknow&q=Catering returns 200 OK');
    const lucknowResults = lucknowSearch.data?.data?.results || lucknowSearch.data?.data || [];
    assert(lucknowResults.length > 0, 'Combined city + keyword search returns listings');

    // 4. Standardized Schema Verification
    console.log('\n--- 4. Standardized Listing Schema Verification ---');
    const sampleItem = cateringRes.data?.data?.listings?.[0];
    assert(sampleItem?.id !== undefined, 'Listing has unique ID');
    assert(sampleItem?.name !== undefined, 'Listing has name');
    assert(sampleItem?.city !== undefined, 'Listing has city location');
    assert(sampleItem?.startingPrice !== undefined, 'Listing has startingPrice');
    assert(sampleItem?.priceUnit !== undefined, 'Listing has priceUnit');
    assert(sampleItem?.verified === true, 'Listing has verified boolean');
    assert(sampleItem?.status === 'APPROVED', 'Listing has status APPROVED');

    // 5. Booking a Non-Venue Service (Catering)
    console.log('\n--- 5. Specialized Service Booking Flow ---');
    const bookingRes = await request('/bookings', {
      method: 'POST',
      body: {
        serviceId: 'srv-cat-401',
        eventDate: '2026-11-28',
        timeSlot: 'Evening',
        guestCount: 300,
        name: 'Vikas Malhotra',
        mobile: '9876500000',
        email: 'vikas@malhotra.com',
        requirements: 'Awadhi dinner buffet with live dessert jalebi counter'
      }
    });
    assert(bookingRes.status === 201, 'POST /api/bookings successfully books Catering service');
    assert(bookingRes.data?.data?.serviceName?.includes('Catering'), 'Booking record captures correct service name');
    assert(typeof bookingRes.data?.data?.pricing?.totalAmount === 'number', 'Booking includes server-calculated pricing');

  } catch (err) {
    console.error('Fatal Test Error:', err);
    failed++;
  }

  console.log('\n========================================================');
  console.log(`📊 PHASE 7 TEST RESULTS: ${passed} PASSED | ${failed} FAILED`);
  console.log('========================================================\n');

  if (failed > 0) {
    process.exit(1);
  }
}

runTests();
