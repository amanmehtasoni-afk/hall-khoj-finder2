/**
 * Hall Khoj Finder — Phase 8 Test Suite
 * Comprehensive verification of Search Engine, Geolocation Haversine Distance,
 * Multi-Category Filters (19 categories), Date Availability, Sorting, Autocomplete & Popular Cities.
 */

const http = require('http');

const API_BASE = 'http://localhost:3000/api';

function request(path, options = {}) {
  return new Promise((resolve, reject) => {
    const url = new URL(`${API_BASE}${path}`);
    const reqOptions = {
      method: options.method || 'GET',
      hostname: url.hostname,
      port: url.port,
      path: url.pathname + url.search,
      headers: {
        'Content-Type': 'application/json',
        ...(options.headers || {})
      }
    };

    const req = http.request(reqOptions, (res) => {
      let body = '';
      res.on('data', chunk => body += chunk);
      res.on('end', () => {
        try {
          const parsed = JSON.parse(body);
          resolve({ status: res.statusCode, data: parsed });
        } catch (e) {
          resolve({ status: res.statusCode, data: body });
        }
      });
    });

    req.on('error', reject);
    if (options.body) {
      req.write(typeof options.body === 'string' ? options.body : JSON.stringify(options.body));
    }
    req.end();
  });
}

let passed = 0;
let failed = 0;

function assert(condition, message) {
  if (condition) {
    passed++;
    console.log(`  ✓ ${message}`);
  } else {
    failed++;
    console.error(`  ✗ FAIL: ${message}`);
  }
}

async function runPhase8Tests() {
  console.log('================================================================');
  console.log('🔍 RUNNING PHASE 8 VERIFICATION TEST SUITE');
  console.log('================================================================\n');

  try {
    // 1. Basic Search Retrieval
    console.log('--- 1. Basic Search & Pagination ---');
    const res1 = await request('/search');
    assert(res1.status === 200, 'GET /api/search returns 200 OK');
    assert(res1.data.success === true, 'Response has success: true');
    assert(Array.isArray(res1.data.data.results), 'results is an Array');
    assert(res1.data.data.total > 0, `Total listings count > 0 (${res1.data.data.total} listings found)`);
    assert(res1.data.data.page === 1, 'Default page is 1');
    assert(res1.data.data.limit === 20, 'Default limit is 20');

    // 2. Text Matching
    console.log('\n--- 2. Multi-Field Text Search ---');
    const res2 = await request('/search?q=Heritage');
    assert(res2.status === 200, 'GET /api/search?q=Heritage returns 200');
    assert(res2.data.data.results.length > 0, 'Found results for query "Heritage"');
    const matchedName = res2.data.data.results.some(r => r.name.toLowerCase().includes('heritage'));
    assert(matchedName, 'Matched listing contains "Heritage" in name');

    const res2b = await request('/search?q=Biryani');
    assert(res2b.data.data.results.length > 0, 'Found catering result for facility/description "Biryani"');

    // 3. Category Filtering across 19 categories
    console.log('\n--- 3. Category Filtering ---');
    const resCatHalls = await request('/search?category=Marriage+Hall');
    assert(resCatHalls.data.data.results.length > 0, 'Category Marriage Hall returns items');
    assert(resCatHalls.data.data.results.every(r => (r.category || r.type || '').toLowerCase().includes('hall')), 'All results are halls');

    const resCatCars = await request('/search?category=wedding-car');
    assert(resCatCars.data.data.results.length > 0, 'Category wedding-car returns cars');
    assert(resCatCars.data.data.results.some(r => r.brand || r.name.toLowerCase().includes('car')), 'Contains car brands/names');

    const resCatTents = await request('/search?category=Tent+House');
    assert(resCatTents.data.data.results.length > 0, 'Category Tent House returns tents');

    const resCatDJ = await request('/search?category=DJ');
    assert(resCatDJ.data.data.results.length > 0, 'Category DJ returns DJ listings');

    const resCatPhoto = await request('/search?category=Photography');
    assert(resCatPhoto.data.data.results.length > 0, 'Category Photography returns photo studios');

    // 4. City, Area and Location Filtering
    console.log('\n--- 4. Location Filters ---');
    const resLucknow = await request('/search?city=Lucknow');
    assert(resLucknow.data.data.results.length > 0, 'Found listings in Lucknow');
    assert(resLucknow.data.data.results.every(r => r.city.toLowerCase() === 'lucknow'), 'All filtered results have city: Lucknow');

    const resVaranasi = await request('/search?city=Varanasi');
    assert(resVaranasi.data.data.results.length > 0, 'Found listings in Varanasi');
    assert(resVaranasi.data.data.results.every(r => r.city.toLowerCase() === 'varanasi'), 'All filtered results have city: Varanasi');

    // 5. Price Range Filtering
    console.log('\n--- 5. Price Range Filtering ---');
    const resPrice = await request('/search?minPrice=20000&maxPrice=70000');
    assert(resPrice.data.data.results.length > 0, 'Found listings in price range ₹20,000–₹70,000');
    assert(resPrice.data.data.results.every(r => (r.startingPrice || 0) >= 20000 && (r.startingPrice || 0) <= 70000), 'All results strictly respect minPrice and maxPrice');

    // 6. Capacity Filtering
    console.log('\n--- 6. Capacity Filtering ---');
    const resCap = await request('/search?capacity=500');
    assert(resCap.data.data.results.length > 0, 'Found listings accommodating at least 500 guests');
    assert(resCap.data.data.results.every(r => !r.capacityMax || r.capacityMax >= 500), 'All venue results have capacityMax >= 500');

    // 7. Star Rating & Verified Filters
    console.log('\n--- 7. Star Rating & Verification Filters ---');
    const resRating = await request('/search?minRating=4.8');
    assert(resRating.data.data.results.every(r => (r.rating || 0) >= 4.8), 'All results have rating >= 4.8');

    const resVerified = await request('/search?verifiedOnly=true');
    assert(resVerified.data.data.results.every(r => r.verified === true || r.ownerVerified === true), 'All results are verified');

    // 8. Date Availability Check
    console.log('\n--- 8. Date Availability Filtering ---');
    // Venue h-101 has availability['2026-10-17'] === 'BOOKED'
    const resBookedDate = await request('/search?date=2026-10-17');
    const containsBookedVenue = resBookedDate.data.data.results.some(r => r.id === 'h-101');
    assert(!containsBookedVenue, 'Listing h-101 is excluded because it is BOOKED on 2026-10-17');

    // Venue h-101 is AVAILABLE on 2026-10-15
    const resAvailDate = await request('/search?date=2026-10-15');
    const containsAvailVenue = resAvailDate.data.data.results.some(r => r.id === 'h-101');
    assert(containsAvailVenue, 'Listing h-101 is included because it is AVAILABLE on 2026-10-15');

    // 9. Near Me Geolocation & Haversine Distance
    console.log('\n--- 9. Near Me Geolocation & Distance Engine ---');
    // Search near Gomti Nagar, Lucknow (Lat: 26.85, Lng: 80.99) with 6km radius
    const resNearMe = await request('/search?nearMe=true&lat=26.85&lng=80.99&radius=6');
    assert(resNearMe.status === 200, 'GET /api/search?nearMe=true returns 200');
    assert(resNearMe.data.data.results.length > 0, `Near Me returns ${resNearMe.data.data.results.length} listings within 6km radius`);
    
    // Check distance calculation
    const firstNear = resNearMe.data.data.results[0];
    assert(typeof firstNear.distanceKm === 'number', `distanceKm is a number (${firstNear.distanceKm} km)`);
    assert(typeof firstNear.distance === 'string' && firstNear.distance.includes('km away'), `distance string is formatted ("${firstNear.distance}")`);
    assert(resNearMe.data.data.results.every(r => r.distanceKm <= 6.0), 'Every returned listing has distanceKm <= 6.0 km');

    // 10. Sorting
    console.log('\n--- 10. Sorting Engine ---');
    // Nearest
    const resSortNearest = await request('/search?nearMe=true&lat=26.85&lng=80.99&radius=50&sortBy=nearest');
    let isDistSorted = true;
    for (let i = 1; i < resSortNearest.data.data.results.length; i++) {
      if (resSortNearest.data.data.results[i].distanceKm < resSortNearest.data.data.results[i - 1].distanceKm) {
        isDistSorted = false;
        break;
      }
    }
    assert(isDistSorted, 'sortBy=nearest correctly sorts in ascending order of distanceKm');

    // Price Ascending
    const resSortPriceAsc = await request('/search?sortBy=price-asc');
    let isPriceAsc = true;
    for (let i = 1; i < resSortPriceAsc.data.data.results.length; i++) {
      if ((resSortPriceAsc.data.data.results[i].startingPrice || 0) < (resSortPriceAsc.data.data.results[i - 1].startingPrice || 0)) {
        isPriceAsc = false;
        break;
      }
    }
    assert(isPriceAsc, 'sortBy=price-asc correctly sorts from lowest to highest price');

    // Price Descending
    const resSortPriceDesc = await request('/search?sortBy=price-desc');
    let isPriceDesc = true;
    for (let i = 1; i < resSortPriceDesc.data.data.results.length; i++) {
      if ((resSortPriceDesc.data.data.results[i].startingPrice || 0) > (resSortPriceDesc.data.data.results[i - 1].startingPrice || 0)) {
        isPriceDesc = false;
        break;
      }
    }
    assert(isPriceDesc, 'sortBy=price-desc correctly sorts from highest to lowest price');

    // Rating
    const resSortRating = await request('/search?sortBy=rating');
    let isRatingDesc = true;
    for (let i = 1; i < resSortRating.data.data.results.length; i++) {
      if ((resSortRating.data.data.results[i].rating || 0) > (resSortRating.data.data.results[i - 1].rating || 0)) {
        isRatingDesc = false;
        break;
      }
    }
    assert(isRatingDesc, 'sortBy=rating correctly sorts highest rated first');

    // 11. Autocomplete / Suggestions Endpoint
    console.log('\n--- 11. Autocomplete & Suggestions ---');
    const resSug = await request('/search/suggestions?q=Roy');
    assert(resSug.status === 200, 'GET /api/search/suggestions returns 200 OK');
    assert(Array.isArray(resSug.data.data), 'suggestions data is an Array');
    assert(resSug.data.data.length > 0, `Returned ${resSug.data.data.length} suggestions for query "Roy"`);
    assert(resSug.data.data.some(s => s.text.toLowerCase().includes('roy')), 'Contains suggestion with "roy"');

    const resSugCity = await request('/search/suggestions?q=Luc');
    assert(resSugCity.data.data.some(s => s.text.toLowerCase().includes('lucknow')), 'Contains city suggestion "Lucknow"');

    // 12. Popular Cities Endpoint
    console.log('\n--- 12. Popular Cities ---');
    const resCities = await request('/search/cities');
    assert(resCities.status === 200, 'GET /api/search/cities returns 200 OK');
    assert(Array.isArray(resCities.data.data), 'cities data is an Array');
    assert(resCities.data.data.length > 0, `Returned ${resCities.data.data.length} popular cities`);
    const lucknowCity = resCities.data.data.find(c => c.city.toLowerCase() === 'lucknow');
    assert(lucknowCity && lucknowCity.count > 0, `Lucknow found with count ${lucknowCity?.count}`);
    assert(lucknowCity && lucknowCity.coordinates && lucknowCity.coordinates.lat, 'City has fallback GPS coordinates');

    // 13. Map Coordinate Coverage
    console.log('\n--- 13. Map Coordinate Coverage ---');
    const allListingsRes = await request('/search?limit=100');
    const missingCoords = allListingsRes.data.data.results.filter(r => !r.latitude || !r.longitude);
    assert(missingCoords.length === 0, `All ${allListingsRes.data.data.results.length} listings have valid latitude and longitude coordinates`);

  } catch (err) {
    console.error('Fatal error in Phase 8 tests:', err);
    failed++;
  }

  console.log('\n================================================================');
  console.log(`PHASE 8 RESULTS: ${passed} PASSED | ${failed} FAILED`);
  console.log('================================================================\n');

  if (failed > 0) {
    process.exit(1);
  }
}

runPhase8Tests();
