/**
 * Hall Khoj Finder — Phase 11 Test Suite
 * Comprehensive verification of Verified Review Engine (restricted strictly to COMPLETED bookings),
 * Duplicate Review Prevention, Rating Aggregation, Owner Replies, Review Moderation,
 * Staff Management CRUD, and Favorites System.
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

async function runPhase11Tests() {
  console.log('================================================================');
  console.log('⭐ RUNNING PHASE 11 VERIFICATION TEST SUITE (REVIEWS & STAFF)');
  console.log('================================================================\n');

  try {
    const testStamp = Date.now();

    // 0. User Setup (Customer 1, Customer 2, Owner, Admin)
    console.log('--- 0. Setup Test Users & Venue ---');
    const cust1Res = await request('/auth/register', {
      method: 'POST',
      body: {
        name: 'Kavita Verma Customer',
        email: `kavita_${testStamp}@example.com`,
        mobile: `98${Math.floor(10000000 + Math.random() * 90000000)}`,
        password: 'Pass@123Customer',
        role: 'customer',
        city: 'Lucknow'
      }
    });
    const cust1Token = cust1Res.data.data.token;
    const cust1Id = cust1Res.data.data.user.id;
    assert(cust1Token, 'Customer 1 registered with JWT');

    const cust2Res = await request('/auth/register', {
      method: 'POST',
      body: {
        name: 'Deepak Stranger',
        email: `deepak_${testStamp}@example.com`,
        mobile: `97${Math.floor(10000000 + Math.random() * 90000000)}`,
        password: 'Pass@123Customer',
        role: 'customer'
      }
    });
    const cust2Token = cust2Res.data.data.token;
    assert(cust2Token, 'Customer 2 registered with JWT');

    const ownerRes = await request('/auth/register', {
      method: 'POST',
      body: {
        name: 'Manoj Singh Partner',
        email: `manoj_${testStamp}@example.com`,
        mobile: `96${Math.floor(10000000 + Math.random() * 90000000)}`,
        password: 'OwnerPass@123',
        role: 'owner',
        businessName: 'Manoj Heritage Resort'
      }
    });
    const ownerToken = ownerRes.data.data.token;
    const ownerId = ownerRes.data.data.user.id;
    assert(ownerToken, 'Owner registered with JWT');

    const adminRes = await request('/auth/login', {
      method: 'POST',
      body: {
        email: 'admin@hallkhoj.com',
        password: 'AdminPass@123'
      }
    });
    const adminToken = adminRes.data.data.token;
    assert(adminToken, 'Admin logged in with JWT');

    // Create a Venue
    const hallRes = await request('/halls', {
      method: 'POST',
      headers: { Authorization: `Bearer ${ownerToken}` },
      body: {
        name: 'Manoj Royal Heritage Lawn',
        type: 'Marriage Hall',
        category: 'Marriage Hall',
        city: 'Lucknow',
        state: 'Uttar Pradesh',
        area: 'Indira Nagar',
        startingPrice: 70000,
        capacityMin: 200,
        capacityMax: 1000,
        latitude: 26.8800,
        longitude: 80.9900,
        facilities: ['Central AC', 'Grand Lawn', 'Valet Parking']
      }
    });
    const venue = hallRes.data.data;
    const venueId = venue.id;
    assert(venueId, 'Venue created for review testing');

    // 1. Verified Review Eligibility Restrictions
    console.log('\n--- 1. Review Eligibility Restrictions ---');
    // Create an uncompleted booking (status = REQUESTED)
    const bookRes = await request('/bookings', {
      method: 'POST',
      headers: { Authorization: `Bearer ${cust1Token}` },
      body: {
        serviceId: venueId,
        eventDate: '2026-12-28',
        timeSlot: 'Evening',
        guestCount: 500,
        name: 'Kavita Verma',
        mobile: '9876543210',
        email: `kavita_${testStamp}@example.com`
      }
    });
    const bookingId = bookRes.data.data.id;
    assert(bookingId, 'Booking created with status REQUESTED');

    // Attempt to review this uncompleted booking
    const prematureReviewRes = await request('/reviews', {
      method: 'POST',
      headers: { Authorization: `Bearer ${cust1Token}` },
      body: {
        bookingId: bookingId,
        serviceId: venueId,
        rating: 5,
        title: 'Premature Review',
        comment: 'We haven’t had the event yet.'
      }
    });
    assert(prematureReviewRes.status === 400, 'Review on non-completed booking rejected with 400 Bad Request');
    assert(prematureReviewRes.data.code === 'REVIEW_NOT_ELIGIBLE', 'Error code matches REVIEW_NOT_ELIGIBLE');

    // Customer 2 attempts to review Customer 1's booking
    const wrongCustReviewRes = await request('/reviews', {
      method: 'POST',
      headers: { Authorization: `Bearer ${cust2Token}` },
      body: {
        bookingId: bookingId,
        serviceId: venueId,
        rating: 5,
        title: 'Unauthorized Review'
      }
    });
    assert(wrongCustReviewRes.status === 403, 'Review by unauthorized user rejected with 403 Forbidden');

    // 2. Complete Booking Lifecycle and Submit Verified Review
    console.log('\n--- 2. Booking Completion & Verified Review Submission ---');
    // Owner moves booking: REQUESTED -> ACCEPTED -> CONFIRMED -> COMPLETED
    await request(`/bookings/${bookingId}/status`, {
      method: 'PATCH',
      headers: { Authorization: `Bearer ${ownerToken}` },
      body: { status: 'ACCEPTED' }
    });
    await request(`/bookings/${bookingId}/status`, {
      method: 'PATCH',
      headers: { Authorization: `Bearer ${ownerToken}` },
      body: { status: 'CONFIRMED' }
    });
    const completeRes = await request(`/bookings/${bookingId}/status`, {
      method: 'PATCH',
      headers: { Authorization: `Bearer ${ownerToken}` },
      body: { status: 'COMPLETED', note: 'Grand wedding reception successfully concluded.' }
    });
    assert(completeRes.status === 200, 'Booking moved to COMPLETED state');

    // Now Customer 1 submits verified review
    const reviewRes = await request('/reviews', {
      method: 'POST',
      headers: { Authorization: `Bearer ${cust1Token}` },
      body: {
        bookingId: bookingId,
        serviceId: venueId,
        rating: 5,
        title: 'Magical Royal Wedding Experience!',
        comment: 'Everything was pristine. The lawn was vast, AC was superb, and Manoj ji was very hospitable.',
        photos: ['https://images.unsplash.com/photo-1519167758481-83f550bb49b3?w=800']
      }
    });
    assert(reviewRes.status === 201, 'Verified review submitted with 201 Created');
    const review = reviewRes.data.data;
    const reviewId = review.id;
    assert(review.verifiedBooking === true, 'Review marked as verifiedBooking: true');
    assert(review.rating === 5, 'Review rating recorded as 5 stars');

    // Verify Owner received real notification for review
    const ownerNotifsRes = await request('/notifications', {
      headers: { Authorization: `Bearer ${ownerToken}` }
    });
    const revNotif = ownerNotifsRes.data.data.notifications.find(n => n.title && n.title.includes('Review Received'));
    assert(revNotif !== undefined, 'Venue owner received automated notification for new review');

    // 3. Duplicate Review Prevention
    console.log('\n--- 3. Duplicate Review Prevention ---');
    const duplicateReviewRes = await request('/reviews', {
      method: 'POST',
      headers: { Authorization: `Bearer ${cust1Token}` },
      body: {
        bookingId: bookingId,
        serviceId: venueId,
        rating: 4,
        title: 'Trying to review again'
      }
    });
    assert(duplicateReviewRes.status === 409, 'Duplicate review on same booking rejected with 409 Conflict');
    assert(duplicateReviewRes.data.code === 'DUPLICATE_REVIEW', 'Error code matches DUPLICATE_REVIEW');

    // 4. Public Listing Reviews & User Reviews
    console.log('\n--- 4. Reviews Retrieval ---');
    const listingReviewsRes = await request(`/reviews/listing/${venueId}`);
    assert(listingReviewsRes.status === 200, 'GET /api/reviews/listing/:serviceId returns 200 OK');
    assert(listingReviewsRes.data.data.total >= 1, `Listing has ${listingReviewsRes.data.data.total} verified review(s)`);
    assert(listingReviewsRes.data.data.averageRating >= 4.0, `Listing calculated averageRating is ${listingReviewsRes.data.data.averageRating}`);

    const userReviewsRes = await request('/reviews/user', {
      headers: { Authorization: `Bearer ${cust1Token}` }
    });
    assert(userReviewsRes.status === 200, 'GET /api/reviews/user returns 200 OK');
    assert(userReviewsRes.data.data.length >= 1, 'Customer can see their submitted reviews');

    // 5. Owner Reply to Review
    console.log('\n--- 5. Owner Reply Workflow ---');
    const replyRes = await request(`/reviews/${reviewId}/reply`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${ownerToken}` },
      body: {
        text: 'Dhanyawaad Kavita ji! It was our privilege hosting your family. Wishing the couple a lifetime of happiness!'
      }
    });
    assert(replyRes.status === 200, 'Owner posted reply with 200 OK');
    assert(replyRes.data.data.ownerReply && replyRes.data.data.ownerReply.text.includes('Dhanyawaad'), 'Owner reply recorded on review');

    // Customer received notification for owner's reply
    const custNotifsRes = await request('/notifications', {
      headers: { Authorization: `Bearer ${cust1Token}` }
    });
    const replyNotif = custNotifsRes.data.data.notifications.find(n => n.title && n.title.includes('Owner Replied'));
    assert(replyNotif !== undefined, 'Customer received notification about owner response');

    // Stranger cannot reply
    const strangerReplyRes = await request(`/reviews/${reviewId}/reply`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${cust2Token}` },
      body: { text: 'Unauthorized reply attempt' }
    });
    assert(strangerReplyRes.status === 403, 'Unauthorized stranger rejected from replying (403 Forbidden)');

    // 6. Admin Review Moderation
    console.log('\n--- 6. Admin Review Moderation ---');
    const modRes = await request(`/reviews/${reviewId}/status`, {
      method: 'PATCH',
      headers: { Authorization: `Bearer ${adminToken}` },
      body: { status: 'FLAGGED' }
    });
    assert(modRes.status === 200, 'Admin moderated review status to FLAGGED (200 OK)');
    assert(modRes.data.data.status === 'FLAGGED', 'Review status updated');

    // Non-admin rejected from moderation
    const nonAdminModRes = await request(`/reviews/${reviewId}/status`, {
      method: 'PATCH',
      headers: { Authorization: `Bearer ${cust1Token}` },
      body: { status: 'APPROVED' }
    });
    assert(nonAdminModRes.status === 403, 'Non-admin rejected from moderating review (403 Forbidden)');

    // 7. Staff Management CRUD
    console.log('\n--- 7. Staff Management System ---');
    const addStaffRes = await request('/staff', {
      method: 'POST',
      headers: { Authorization: `Bearer ${ownerToken}` },
      body: {
        name: 'Ramesh Kumar',
        mobile: '9876501122',
        role: 'Manager',
        experience: '5 years in hospitality',
        description: 'Lead floor banquet manager'
      }
    });
    assert(addStaffRes.status === 201, 'POST /api/staff added staff member (201 Created)');
    const staff = addStaffRes.data.data;
    const staffId = staff.id;

    // Update staff member
    const updateStaffRes = await request(`/staff/${staffId}`, {
      method: 'PATCH',
      headers: { Authorization: `Bearer ${ownerToken}` },
      body: {
        role: 'Event Coordinator',
        experience: '6 years in hospitality',
        status: 'ACTIVE'
      }
    });
    assert(updateStaffRes.status === 200, 'PATCH /api/staff/:id updated staff details (200 OK)');
    assert(updateStaffRes.data.data.role === 'Event Coordinator', 'Staff role updated to Event Coordinator');

    // List staff
    const listStaffRes = await request('/staff', {
      headers: { Authorization: `Bearer ${ownerToken}` }
    });
    assert(listStaffRes.status === 200, 'GET /api/staff returns 200 OK');
    assert(listStaffRes.data.data.some(s => s.id === staffId), 'Staff member found in active team list');

    // Delete staff
    const delStaffRes = await request(`/staff/${staffId}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${ownerToken}` }
    });
    assert(delStaffRes.status === 200, 'DELETE /api/staff/:id removed staff member (200 OK)');

    // 8. Favorites System
    console.log('\n--- 8. Customer Favorites System ---');
    const addFavRes = await request('/users/favorites/toggle', {
      method: 'POST',
      headers: { Authorization: `Bearer ${cust1Token}` },
      body: { venueId }
    });
    assert(addFavRes.status === 200, 'Toggle favorite added venue to favorites');

    const getFavsRes = await request('/users/favorites', {
      headers: { Authorization: `Bearer ${cust1Token}` }
    });
    assert(getFavsRes.status === 200, 'GET /api/users/favorites returns 200 OK');
    assert(getFavsRes.data.data.some(f => (f.id || f) === venueId), 'Favorites array contains venueId');

    const removeFavRes = await request('/users/favorites/toggle', {
      method: 'POST',
      headers: { Authorization: `Bearer ${cust1Token}` },
      body: { venueId }
    });
    assert(removeFavRes.status === 200, 'Toggle favorite removed venue from favorites');

  } catch (err) {
    console.error('Fatal error in Phase 11 tests:', err);
    failed++;
  }

  console.log('\n================================================================');
  console.log(`PHASE 11 RESULTS: ${passed} PASSED | ${failed} FAILED`);
  console.log('================================================================\n');

  if (failed > 0) {
    process.exit(1);
  }
}

runPhase11Tests();
