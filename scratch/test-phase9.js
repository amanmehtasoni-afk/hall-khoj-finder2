/**
 * Hall Khoj Finder — Phase 9 Test Suite
 * Comprehensive verification of Availability Checking, Double-Booking Conflict Prevention,
 * Transactional State Machine (REQUESTED -> PENDING -> ACCEPTED -> CONFIRMED -> COMPLETED),
 * Date Slot Locking / Releasing, Customer Cancellation, and RBAC Security.
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

async function runPhase9Tests() {
  console.log('================================================================');
  console.log('📅 RUNNING PHASE 9 VERIFICATION TEST SUITE (BOOKING ENGINE)');
  console.log('================================================================\n');

  try {
    const testStamp = Date.now();

    // 0. User Setup (Customer 1, Customer 2, Owner, Admin)
    console.log('--- 0. Setup Test Users & Listing ---');
    const cust1Res = await request('/auth/register', {
      method: 'POST',
      body: {
        name: 'Rahul Customer',
        email: `rahul_${testStamp}@example.com`,
        mobile: `98${Math.floor(10000000 + Math.random() * 90000000)}`,
        password: 'Pass@123Customer',
        role: 'customer'
      }
    });
    const cust1Token = cust1Res.data.data.token;
    const cust1Id = cust1Res.data.data.user.id;
    assert(cust1Token, 'Customer 1 registered with JWT');

    const cust2Res = await request('/auth/register', {
      method: 'POST',
      body: {
        name: 'Priya Customer',
        email: `priya_${testStamp}@example.com`,
        mobile: `97${Math.floor(10000000 + Math.random() * 90000000)}`,
        password: 'Pass@123Customer',
        role: 'customer'
      }
    });
    const cust2Token = cust2Res.data.data.token;
    assert(cust2Token, 'Customer 2 registered with JWT');

    // Register a dedicated Partner Owner
    const ownerRegRes = await request('/auth/register', {
      method: 'POST',
      body: {
        name: 'Vikram Rajput Partner',
        email: `vikram_partner_${testStamp}@example.com`,
        password: 'OwnerPass@123',
        mobile: `96${Math.floor(10000000 + Math.random() * 90000000)}`,
        role: 'owner',
        businessName: 'Rajput Heritage Venues'
      }
    });
    const ownerToken = ownerRegRes.data.data.token;
    const ownerId = ownerRegRes.data.data.user.id;
    assert(ownerToken, 'Partner Owner registered with JWT');

    // Owner creates a new venue for Phase 9 testing
    const newHallRes = await request('/halls', {
      method: 'POST',
      headers: { Authorization: `Bearer ${ownerToken}` },
      body: {
        name: 'Rajput Royal Palace & Garden',
        type: 'Marriage Hall',
        category: 'Marriage Hall',
        city: 'Lucknow',
        state: 'Uttar Pradesh',
        area: 'Gomti Nagar Extension',
        startingPrice: 75000,
        capacityMin: 200,
        capacityMax: 1000,
        latitude: 26.8400,
        longitude: 81.0100,
        facilities: ['Central AC', 'Grand Lawn', 'Valet Parking', 'Bridal Suites'],
        availability: {
          '2026-10-15': 'AVAILABLE',
          '2026-10-17': 'BOOKED'
        }
      }
    });
    assert(newHallRes.status === 201, 'Owner creates test venue (201 Created)');
    const testVenue = newHallRes.data.data;
    const venueId = testVenue.id;

    // 1. Availability Checking
    console.log('\n--- 1. Availability Checking API ---');
    const resAvail = await request(`/bookings/check-availability?serviceId=${venueId}&date=2026-10-15`);
    assert(resAvail.status === 200, 'GET /api/bookings/check-availability returns 200 OK');
    assert(resAvail.data.data.isAvailable === true, 'Date 2026-10-15 is reported AVAILABLE');
    assert(resAvail.data.data.status === 'AVAILABLE', 'Status matches AVAILABLE');

    const resBooked = await request(`/bookings/check-availability?serviceId=${venueId}&date=2026-10-17`);
    assert(resBooked.status === 200, 'Check booked date returns 200');
    assert(resBooked.data.data.isAvailable === false, 'Date 2026-10-17 is reported NOT AVAILABLE');
    assert(resBooked.data.data.status === 'BOOKED', 'Status matches BOOKED');

    const resMissingParam = await request(`/bookings/check-availability?serviceId=${venueId}`);
    assert(resMissingParam.status === 400, 'Missing date parameter returns 400 Bad Request');

    // 2. Double-Booking Conflict Prevention
    console.log('\n--- 2. Double-Booking Conflict Detection ---');
    const resConflict = await request('/bookings', {
      method: 'POST',
      headers: { Authorization: `Bearer ${cust1Token}` },
      body: {
        serviceId: venueId,
        eventDate: '2026-10-17', // Already booked!
        timeSlot: 'Evening',
        guestCount: 500,
        name: 'Rahul Customer',
        mobile: '9876543210',
        email: `rahul_${testStamp}@example.com`
      }
    });
    assert(resConflict.status === 409, 'Submitting booking on booked date returns 409 Conflict');
    assert(resConflict.data.code === 'DATE_ALREADY_BOOKED', 'Error code is DATE_ALREADY_BOOKED');

    // 3. Successful Booking Submission & ID Generation
    console.log('\n--- 3. Successful Booking Submission & Server Pricing ---');
    const targetDate1 = `2026-12-${Math.floor(10 + Math.random() * 15)}`;
    const createRes = await request('/bookings', {
      method: 'POST',
      headers: { Authorization: `Bearer ${cust1Token}` },
      body: {
        serviceId: venueId,
        eventDate: targetDate1,
        timeSlot: 'Evening',
        guestCount: 600,
        name: 'Rahul Customer',
        mobile: '9876543210',
        email: `rahul_${testStamp}@example.com`,
        requirements: 'Central AC on full blast, 2 bridal suites'
      }
    });

    assert(createRes.status === 201, 'POST /api/bookings returns 201 Created');
    const booking = createRes.data.data;
    const bookingId = booking.id;
    assert(/^HKF-\d{4}-\d{6}$/.test(bookingId), `Generated unique sequential tracking ID: ${bookingId}`);
    assert(booking.status === 'REQUESTED', 'Initial booking status is REQUESTED');
    assert(booking.pricing && booking.pricing.totalAmount > 0, `Server-side recalculated pricing total: ₹${booking.pricing.totalAmount}`);
    assert(booking.pricing.advanceRequired > 0, `Server-side advance calculated: ₹${booking.pricing.advanceRequired}`);
    assert(Array.isArray(booking.statusHistory) && booking.statusHistory.length === 1, 'Status history initialized with 1 entry');

    // Verify listing availability moved to PENDING
    const checkPending = await request(`/bookings/check-availability?serviceId=${venueId}&date=${targetDate1}`);
    assert(checkPending.data.data.status === 'PENDING', 'Listing calendar availability updated to PENDING');

    // 4. Booking Retrieval & RBAC Access Protection
    console.log('\n--- 4. Booking Retrieval & RBAC Verification ---');
    const getCust1Res = await request(`/bookings/${bookingId}`, {
      headers: { Authorization: `Bearer ${cust1Token}` }
    });
    assert(getCust1Res.status === 200, 'Customer 1 can fetch their own booking');
    assert(getCust1Res.data.data.id === bookingId, 'Retrieved matching booking ID');

    // Customer 2 attempt to view Customer 1's booking
    const getCust2Res = await request(`/bookings/${bookingId}`, {
      headers: { Authorization: `Bearer ${cust2Token}` }
    });
    assert(getCust2Res.status === 403, 'Customer 2 rejected from Customer 1 booking (403 Forbidden)');

    // Owner can view booking for their venue
    const getOwnerRes = await request(`/bookings/${bookingId}`, {
      headers: { Authorization: `Bearer ${ownerToken}` }
    });
    assert(getOwnerRes.status === 200, 'Venue owner can view incoming customer booking (200 OK)');

    // 5. State Machine Lifecycle & Date Slot Locking
    console.log('\n--- 5. Transactional State Machine & Date Slot Locking ---');
    // Step A: Owner marks booking PENDING (or ACCEPTED directly)
    const acceptRes = await request(`/bookings/${bookingId}/status`, {
      method: 'PATCH',
      headers: { Authorization: `Bearer ${ownerToken}` },
      body: { status: 'ACCEPTED', note: 'Deposit terms aligned, booking accepted.' }
    });
    assert(acceptRes.status === 200, 'Owner transitions status to ACCEPTED (200 OK)');
    assert(acceptRes.data.data.status === 'ACCEPTED', 'Booking status is now ACCEPTED');

    // Verify atomic date locking to BOOKED in listing calendar
    const checkLocked = await request(`/bookings/check-availability?serviceId=${venueId}&date=${targetDate1}`);
    assert(checkLocked.data.data.status === 'BOOKED', 'Calendar date has been LOCKED to BOOKED');
    assert(checkLocked.data.data.isAvailable === false, 'isAvailable is false now');

    // Step B: Owner confirms booking upon advance payment
    const confirmRes = await request(`/bookings/${bookingId}/status`, {
      method: 'PATCH',
      headers: { Authorization: `Bearer ${ownerToken}` },
      body: { status: 'CONFIRMED', note: '25% advance payment verified via bank transfer.' }
    });
    assert(confirmRes.status === 200, 'Owner transitions status to CONFIRMED (200 OK)');
    assert(confirmRes.data.data.status === 'CONFIRMED', 'Booking status is now CONFIRMED');

    // Step C: Invalid State Transition Validation
    const invalidTransRes = await request(`/bookings/${bookingId}/status`, {
      method: 'PATCH',
      headers: { Authorization: `Bearer ${ownerToken}` },
      body: { status: 'REQUESTED' } // Invalid backwards transition
    });
    assert(invalidTransRes.status === 400, 'Invalid transition (CONFIRMED -> REQUESTED) rejected with 400');
    assert(invalidTransRes.data.code === 'INVALID_STATE_TRANSITION', 'Error code is INVALID_STATE_TRANSITION');

    // Step D: Event concludes -> Mark COMPLETED
    const completeRes = await request(`/bookings/${bookingId}/status`, {
      method: 'PATCH',
      headers: { Authorization: `Bearer ${ownerToken}` },
      body: { status: 'COMPLETED', note: 'Wedding ceremony concluded successfully.' }
    });
    assert(completeRes.status === 200, 'Owner marks booking COMPLETED (200 OK)');
    assert(completeRes.data.data.status === 'COMPLETED', 'Booking status is now COMPLETED');

    // Step E: Terminal State Validation
    const cancelCompletedRes = await request(`/bookings/${bookingId}/cancel`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${cust1Token}` },
      body: { reason: 'Want refund' }
    });
    assert(cancelCompletedRes.status === 400, 'Cannot cancel a COMPLETED booking (400 Bad Request)');

    // 6. Customer Cancellation & Date Slot Releasing
    console.log('\n--- 6. Customer Cancellation & Date Slot Releasing ---');
    const targetDate2 = `2026-11-${Math.floor(20 + Math.random() * 5)}`;
    const createRes2 = await request('/bookings', {
      method: 'POST',
      headers: { Authorization: `Bearer ${cust1Token}` },
      body: {
        serviceId: venueId,
        eventDate: targetDate2,
        timeSlot: 'Morning',
        guestCount: 300,
        name: 'Rahul Customer',
        mobile: '9876543210',
        email: `rahul_${testStamp}@example.com`
      }
    });
    const booking2Id = createRes2.data.data.id;
    assert(createRes2.status === 201, `Second booking created for cancellation test: ${booking2Id}`);

    // Owner accepts booking 2 -> date locks
    await request(`/bookings/${booking2Id}/status`, {
      method: 'PATCH',
      headers: { Authorization: `Bearer ${ownerToken}` },
      body: { status: 'ACCEPTED' }
    });

    const checkLocked2 = await request(`/bookings/check-availability?serviceId=${venueId}&date=${targetDate2}`);
    assert(checkLocked2.data.data.status === 'BOOKED', 'Booking 2 date is locked');

    // Customer cancels their booking
    const cancelRes = await request(`/bookings/${booking2Id}/cancel`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${cust1Token}` },
      body: { reason: 'Family changed wedding venue location to Varanasi' }
    });
    assert(cancelRes.status === 200, 'Customer successfully cancelled booking (200 OK)');
    assert(cancelRes.data.data.status === 'CANCELLED', 'Booking status updated to CANCELLED');
    assert(cancelRes.data.data.cancellationReason === 'Family changed wedding venue location to Varanasi', 'Cancellation reason saved');

    // Verify date slot is RELEASED back to AVAILABLE
    const checkReleased = await request(`/bookings/check-availability?serviceId=${venueId}&date=${targetDate2}`);
    assert(checkReleased.data.data.status === 'AVAILABLE', 'Calendar date has been RELEASED back to AVAILABLE');
    assert(checkReleased.data.data.isAvailable === true, 'isAvailable is now true again');

    // 7. Security Checks: Customer cannot approve status
    console.log('\n--- 7. Security RBAC Tests ---');
    const custUnauthorizedStatusRes = await request(`/bookings/${booking2Id}/status`, {
      method: 'PATCH',
      headers: { Authorization: `Bearer ${cust1Token}` },
      body: { status: 'CONFIRMED' }
    });
    assert(custUnauthorizedStatusRes.status === 403, 'Customer cannot update status to CONFIRMED (403 Forbidden)');

    const cust2CancelOtherRes = await request(`/bookings/${booking2Id}/cancel`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${cust2Token}` },
      body: { reason: 'Unauthorized cancel attempt' }
    });
    assert(cust2CancelOtherRes.status === 403, 'Customer 2 cannot cancel Customer 1 booking (403 Forbidden)');

  } catch (err) {
    console.error('Fatal error in Phase 9 tests:', err);
    failed++;
  }

  console.log('\n================================================================');
  console.log(`PHASE 9 RESULTS: ${passed} PASSED | ${failed} FAILED`);
  console.log('================================================================\n');

  if (failed > 0) {
    process.exit(1);
  }
}

runPhase9Tests();
