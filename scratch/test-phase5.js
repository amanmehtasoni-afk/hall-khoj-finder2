/**
 * Hall Khoj Finder — Phase 5 Verification Test Suite
 * Owner System: Profiles, Listings CRUD, Availability Calendar, Analytics & RBAC
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
  console.log('   HALL KHOJ FINDER — PHASE 5 TEST SUITE (OWNER SYSTEM)');
  console.log('========================================================\n');

  const timestamp = Date.now();
  const ownerEmail = `owner_p5_${timestamp}@hallkhoj.com`;
  const customerEmail = `cust_p5_${timestamp}@hallkhoj.com`;
  let ownerToken = null;
  let customerToken = null;
  let ownerUserId = null;
  let customerUserId = null;
  let createdHallId = null;

  try {
    // 1. Register Owner Account
    console.log('--- 1. Owner & Customer Registration ---');
    const ownerRegRes = await request('/auth/register', {
      method: 'POST',
      body: {
        name: 'Rajesh Verma',
        email: ownerEmail,
        mobile: '9876543210',
        password: 'Password@123',
        role: 'owner',
        city: 'Lucknow',
        state: 'Uttar Pradesh',
        businessName: 'Royal Heritage Banquets',
        businessType: 'Marriage Hall'
      }
    });
    assert(ownerRegRes.status === 201, 'Owner registration returns 201 Created');
    assert(ownerRegRes.data?.data?.token, 'Owner registration returns JWT token');
    ownerToken = ownerRegRes.data?.data?.token;
    ownerUserId = ownerRegRes.data?.data?.user?.id;

    // Register Customer Account (for RBAC testing)
    const custRegRes = await request('/auth/register', {
      method: 'POST',
      body: {
        name: 'Sunita Customer',
        email: customerEmail,
        mobile: '9123456780',
        password: 'Password@123',
        role: 'user',
        city: 'Lucknow',
        state: 'Uttar Pradesh'
      }
    });
    assert(custRegRes.status === 201, 'Customer registration returns 201 Created');
    customerToken = custRegRes.data?.data?.token;
    customerUserId = custRegRes.data?.data?.user?.id;

    // 2. Owner Dashboard Stats
    console.log('\n--- 2. Owner Dashboard Stats ---');
    const statsRes = await request('/owners/stats', {
      headers: { Authorization: `Bearer ${ownerToken}` }
    });
    assert(statsRes.status === 200, 'GET /api/owners/stats returns 200 OK');
    assert(typeof statsRes.data?.data?.totalBookings === 'number', 'Stats includes totalBookings count');
    assert(typeof statsRes.data?.data?.totalRevenue === 'number', 'Stats includes totalRevenue number');
    assert(typeof statsRes.data?.data?.activeListings === 'number', 'Stats includes activeListings count');

    // 3. Owner Profile Management
    console.log('\n--- 3. Owner Profile Management ---');
    const profRes = await request('/owners/profile', {
      headers: { Authorization: `Bearer ${ownerToken}` }
    });
    assert(profRes.status === 200, 'GET /api/owners/profile returns 200 OK');
    assert(profRes.data?.data?.businessName, 'Owner profile has businessName');

    const updateProfRes = await request('/owners/profile', {
      method: 'PATCH',
      headers: { Authorization: `Bearer ${ownerToken}` },
      body: {
        businessName: 'The Royal Grand Heritage Palace & Resort',
        gstin: '09AAECV1234F1Z8',
        address: 'Plot 42, Gomti Nagar Bypass',
        pinCode: '226010',
        verificationStatus: 'APPROVED' // Attempt unauthorized self-approval
      }
    });
    assert(updateProfRes.status === 200, 'PATCH /api/owners/profile returns 200 OK');
    assert(updateProfRes.data?.data?.businessName === 'The Royal Grand Heritage Palace & Resort', 'Business name successfully updated');
    assert(updateProfRes.data?.data?.gstin === '09AAECV1234F1Z8', 'GSTIN recorded successfully');
    assert(updateProfRes.data?.data?.verificationStatus !== 'APPROVED', 'Security: Owner cannot self-approve KYC verificationStatus');

    // 4. Owner Listings & CRUD
    console.log('\n--- 4. Owner Listings CRUD ---');
    const getListingsRes = await request('/owners/listings', {
      headers: { Authorization: `Bearer ${ownerToken}` }
    });
    assert(getListingsRes.status === 200, 'GET /api/owners/listings returns 200 OK');
    assert(Array.isArray(getListingsRes.data?.data), 'Listings endpoint returns array');

    // Create New Venue Listing
    const createHallRes = await request('/halls', {
      method: 'POST',
      headers: { Authorization: `Bearer ${ownerToken}` },
      body: {
        name: 'Sanskriti Lawn & Grand Banquet',
        type: 'Marriage Hall',
        category: 'Marriage Halls',
        city: 'Lucknow',
        district: 'Lucknow',
        state: 'Uttar Pradesh',
        capacityMin: 200,
        capacityMax: 800,
        startingPrice: 75000,
        facilities: ['Central AC', '20,000 sq ft Lawn', 'Parking (100 Cars)', 'Generator Backup'],
        coverImg: 'https://images.unsplash.com/photo-1519167758481-83f550bb49b3?auto=format&fit=crop&w=800&q=80'
      }
    });
    assert(createHallRes.status === 201, 'POST /api/halls returns 201 Created');
    assert(createHallRes.data?.data?.id, 'Created hall received unique ID');
    assert(createHallRes.data?.data?.ownerId === ownerUserId, 'Created hall assigned to authenticated owner');
    createdHallId = createHallRes.data?.data?.id;

    // Update Venue Listing
    const updateHallRes = await request(`/halls/${createdHallId}`, {
      method: 'PUT',
      headers: { Authorization: `Bearer ${ownerToken}` },
      body: {
        startingPrice: 85000,
        capacityMax: 1000
      }
    });
    assert(updateHallRes.status === 200, 'PUT /api/halls/:id returns 200 OK');
    assert(updateHallRes.data?.data?.startingPrice === 85000, 'Starting price updated');
    assert(updateHallRes.data?.data?.capacityMax === 1000, 'Max capacity updated');

    // 5. Calendar & Availability Control (Block / Unblock)
    console.log('\n--- 5. Calendar & Availability Control ---');
    const blockRes = await request('/owners/block-date', {
      method: 'POST',
      headers: { Authorization: `Bearer ${ownerToken}` },
      body: {
        venueId: createdHallId,
        date: '2026-11-15'
      }
    });
    assert(blockRes.status === 200, 'POST /api/owners/block-date returns 200 OK');
    assert(blockRes.data?.data?.availability?.['2026-11-15'] === 'BLOCKED', 'Date 2026-11-15 is BLOCKED in venue availability');

    const unblockRes = await request('/owners/unblock-date', {
      method: 'POST',
      headers: { Authorization: `Bearer ${ownerToken}` },
      body: {
        venueId: createdHallId,
        date: '2026-11-15'
      }
    });
    assert(unblockRes.status === 200, 'POST /api/owners/unblock-date returns 200 OK');
    assert(unblockRes.data?.data?.availability?.['2026-11-15'] === undefined, 'Date 2026-11-15 is released from BLOCKED status');

    // 6. Revenue & Analytics
    console.log('\n--- 6. Revenue & Analytics ---');
    const analyticsRes = await request('/owners/analytics', {
      headers: { Authorization: `Bearer ${ownerToken}` }
    });
    assert(analyticsRes.status === 200, 'GET /api/owners/analytics returns 200 OK');
    assert(Array.isArray(analyticsRes.data?.data?.monthlyRevenue), 'Analytics contains monthlyRevenue array');
    assert(Array.isArray(analyticsRes.data?.data?.categoryDistribution), 'Analytics contains categoryDistribution');
    assert(typeof analyticsRes.data?.data?.customerSatisfaction === 'number', 'Analytics contains customerSatisfaction metric');

    // 7. Bookings Queue & Status Transitions
    console.log('\n--- 7. Bookings Queue & Status Transitions ---');
    // Customer creates a booking for the newly created venue
    const createBookingRes = await request('/bookings', {
      method: 'POST',
      headers: { Authorization: `Bearer ${customerToken}` },
      body: {
        venueId: createdHallId,
        eventDate: '2026-12-10',
        timeSlot: 'Evening (6 PM - 12 AM)',
        guestCount: 400,
        name: 'Sunita Customer',
        mobile: '9123456780',
        email: customerEmail,
        requirements: 'Need red floral stage setup and bridal lounge'
      }
    });
    assert(createBookingRes.status === 201, 'POST /api/bookings creates booking for owner venue');
    const bookingId = createBookingRes.data?.data?.id;

    // Owner checks their incoming bookings queue
    const ownerBookingsRes = await request('/bookings/owner', {
      headers: { Authorization: `Bearer ${ownerToken}` }
    });
    assert(ownerBookingsRes.status === 200, 'GET /api/bookings/owner returns 200 OK');
    const foundBooking = (ownerBookingsRes.data?.data || []).find(b => b.id === bookingId);
    assert(foundBooking !== undefined, 'Owner can see the newly submitted booking in queue');

    // Owner accepts the booking (Phase 9 state machine: REQUESTED -> ACCEPTED)
    const acceptBookingRes = await request(`/bookings/${bookingId}/status`, {
      method: 'PATCH',
      headers: { Authorization: `Bearer ${ownerToken}` },
      body: { status: 'ACCEPTED' }
    });
    assert(acceptBookingRes.status === 200, 'PATCH /api/bookings/:id/status updates booking to ACCEPTED');
    assert(acceptBookingRes.data?.data?.status === 'ACCEPTED', 'Booking record reflects ACCEPTED status');

    // 8. RBAC Security Testing
    console.log('\n--- 8. RBAC Security Tests ---');
    // Customer cannot create a hall
    const custCreateHallRes = await request('/halls', {
      method: 'POST',
      headers: { Authorization: `Bearer ${customerToken}` },
      body: { name: 'Unauthorized Hall' }
    });
    assert(custCreateHallRes.status === 403, 'Customer cannot create a hall (403 Forbidden)');

    // Customer cannot access owner incoming bookings queue
    const custOwnerBookingsRes = await request('/bookings/owner', {
      headers: { Authorization: `Bearer ${customerToken}` }
    });
    assert(custOwnerBookingsRes.status === 403, 'Customer cannot access /api/bookings/owner (403 Forbidden)');

    // Customer cannot delete owner venue
    const custDeleteHallRes = await request(`/halls/${createdHallId}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${customerToken}` }
    });
    assert(custDeleteHallRes.status === 403, 'Customer cannot delete venue (403 Forbidden)');

    // Owner can delete their own venue
    const ownerDeleteHallRes = await request(`/halls/${createdHallId}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${ownerToken}` }
    });
    assert(ownerDeleteHallRes.status === 200, 'Owner can delete their own venue (200 OK)');

  } catch (err) {
    console.error('Fatal Test Error:', err);
    failed++;
  }

  console.log('\n========================================================');
  console.log(`📊 PHASE 5 TEST RESULTS: ${passed} PASSED | ${failed} FAILED`);
  console.log('========================================================\n');

  if (failed > 0) {
    process.exit(1);
  }
}

runTests();
