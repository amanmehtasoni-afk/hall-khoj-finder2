/**
 * Hall Khoj Finder — Phase 4 Comprehensive Customer System Test Suite
 * Tests Phone OTP, Password Reset, Extended Profile, Favorites, Locations & Tabbed Bookings
 */

const http = require('http');

const BASE_URL = 'http://localhost:3000';

function request(path, options = {}) {
  return new Promise((resolve, reject) => {
    const url = new URL(path, BASE_URL);
    const reqOptions = {
      method: options.method || 'GET',
      headers: options.headers || {}
    };

    const req = http.request(url, reqOptions, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try {
          const parsed = JSON.parse(data);
          resolve({ status: res.statusCode, headers: res.headers, body: parsed });
        } catch (e) {
          resolve({ status: res.statusCode, headers: res.headers, body: data });
        }
      });
    });

    req.on('error', reject);

    if (options.body) {
      if (typeof options.body === 'string') {
        req.write(options.body);
      } else {
        req.write(JSON.stringify(options.body));
      }
    }
    req.end();
  });
}

let passed = 0;
let failed = 0;

function assert(condition, message) {
  if (condition) {
    console.log(`  ✓ PASS: ${message}`);
    passed++;
  } else {
    console.error(`  ✗ FAIL: ${message}`);
    failed++;
  }
}

async function runTests() {
  console.log('====================================================');
  console.log('🧪 RUNNING PHASE 4 CUSTOMER SYSTEM TEST SUITE');
  console.log('====================================================\n');

  try {
    const timestamp = Date.now();
    const testMobile = '9876' + Math.floor(100000 + Math.random() * 900000).toString();

    // 1. Phone OTP Dispatch
    console.log('TEST 1: Phone OTP Dispatch (/api/auth/send-otp)');
    const sendOtpRes = await request('/api/auth/send-otp', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: { mobile: testMobile }
    });
    assert(sendOtpRes.status === 200, `Send OTP status is 200 (got ${sendOtpRes.status})`);
    assert(sendOtpRes.body.data && sendOtpRes.body.data.expiresInSeconds === 300, 'OTP expires in 300 seconds');
    const debugOtp = sendOtpRes.body.data?.debugOtp;
    assert(!!debugOtp, `Received dev debug OTP: ${debugOtp}`);

    // Invalid mobile check
    const invalidMobileRes = await request('/api/auth/send-otp', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: { mobile: '123' }
    });
    assert(invalidMobileRes.status === 400, `Short mobile rejected with 400 (got ${invalidMobileRes.status})`);

    // 2. Phone OTP Verification
    console.log('\nTEST 2: Phone OTP Verification (/api/auth/verify-otp)');
    // Incorrect OTP
    const wrongOtpRes = await request('/api/auth/verify-otp', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: { mobile: testMobile, otp: '000000' }
    });
    assert(wrongOtpRes.status === 400, `Incorrect OTP rejected with 400 (got ${wrongOtpRes.status})`);
    assert(wrongOtpRes.body.code === 'INVALID_OTP', `Error code matches INVALID_OTP: ${wrongOtpRes.body.code}`);

    // Correct OTP
    const verifyOtpRes = await request('/api/auth/verify-otp', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: { mobile: testMobile, otp: debugOtp }
    });
    assert(verifyOtpRes.status === 200, `Correct OTP accepted with 200 (got ${verifyOtpRes.status})`);
    assert(verifyOtpRes.body.data?.token, 'Received valid JWT token from OTP login');
    const customerToken = verifyOtpRes.body.data?.token;
    const customerId = verifyOtpRes.body.data?.user?.id;
    assert(verifyOtpRes.body.data?.user?.role === 'customer', 'User role is customer');

    // 3. Customer Profile Operations
    console.log('\nTEST 3: Full Profile Retrieval (/api/users/profile)');
    const profRes = await request('/api/users/profile', {
      headers: { 'Authorization': `Bearer ${customerToken}` }
    });
    assert(profRes.status === 200, `Get profile returned 200 (got ${profRes.status})`);
    assert(profRes.body.data?.id === customerId, 'Profile ID matches authenticated customer');

    // 4. Update Profile with Extended Fields
    console.log('\nTEST 4: Extended Profile Update (/api/users/profile)');
    const updateRes = await request('/api/users/profile', {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${customerToken}`
      },
      body: {
        name: 'Rohan Verma',
        address: 'B-12, Gomti Nagar Bypass Road',
        state: 'Uttar Pradesh',
        district: 'Lucknow',
        city: 'Lucknow',
        village: 'Chinhat',
        pinCode: '226028',
        profilePhoto: '/assets/uploads/rohan_avatar.jpg',
        // Attempt malicious privilege escalation
        role: 'admin',
        isVerified: true
      }
    });
    assert(updateRes.status === 200, `Update profile returned 200 (got ${updateRes.status})`);
    assert(updateRes.body.data?.name === 'Rohan Verma', 'Name updated to Rohan Verma');
    assert(updateRes.body.data?.village === 'Chinhat', 'Village field updated to Chinhat');
    assert(updateRes.body.data?.district === 'Lucknow', 'District field updated to Lucknow');
    assert(updateRes.body.data?.pinCode === '226028', 'PIN code field updated to 226028');
    assert(updateRes.body.data?.role === 'customer', 'SECURITY GUARD: Client role update to admin ignored (remains customer)');

    // 5. Password Reset Flow
    console.log('\nTEST 5: Password Reset Flow (/api/auth/forgot-password & /reset-password)');
    const customerEmail = `user_${timestamp}@hallkhoj.com`;
    // Register email customer
    const regRes = await request('/api/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: {
        name: 'Kavita Singh',
        email: customerEmail,
        mobile: '9876000001',
        password: 'Password@123',
        role: 'customer'
      }
    });
    assert(regRes.status === 201, `Email customer registered with 201 (got ${regRes.status})`);

    const forgotRes = await request('/api/auth/forgot-password', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: { email: customerEmail }
    });
    assert(forgotRes.status === 200, `Forgot password returned 200 (got ${forgotRes.status})`);
    const resetToken = forgotRes.body.data?.resetToken;
    assert(!!resetToken, 'Received password reset JWT token');

    const resetRes = await request('/api/auth/reset-password', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: {
        token: resetToken,
        newPassword: 'NewPassword@2026!'
      }
    });
    assert(resetRes.status === 200, `Reset password returned 200 (got ${resetRes.status})`);

    // Verify login works with new password
    const newLoginRes = await request('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: {
        email: customerEmail,
        password: 'NewPassword@2026!'
      }
    });
    assert(newLoginRes.status === 200, 'Successfully logged in with new password');

    // 6. Favorites Management
    console.log('\nTEST 6: Favorites Management (/api/users/favorites)');
    const toggleAdd = await request('/api/users/favorites/toggle', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${customerToken}`
      },
      body: { venueId: 'h-101' }
    });
    assert(toggleAdd.status === 200, `Toggle favorite add returned 200 (got ${toggleAdd.status})`);
    assert(toggleAdd.body.data?.isFavorited === true, 'Venue marked as favorited');

    const favsList = await request('/api/users/favorites', {
      headers: { 'Authorization': `Bearer ${customerToken}` }
    });
    assert(favsList.status === 200, `Get favorites returned 200 (got ${favsList.status})`);
    assert(favsList.body.data?.some(f => f.id === 'h-101'), 'Favorites list contains h-101');

    const toggleRemove = await request('/api/users/favorites/toggle', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${customerToken}`
      },
      body: { venueId: 'h-101' }
    });
    assert(toggleRemove.body.data?.isFavorited === false, 'Venue removed from favorites');

    // 7. Saved Locations
    console.log('\nTEST 7: Saved Locations (/api/users/locations)');
    const addLoc = await request('/api/users/locations', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${customerToken}`
      },
      body: {
        label: 'Home Town',
        address: 'Civil Lines, Near Clock Tower',
        city: 'Lucknow',
        district: 'Lucknow',
        state: 'Uttar Pradesh',
        pinCode: '226001'
      }
    });
    assert(addLoc.status === 201, `Add saved location returned 201 (got ${addLoc.status})`);
    assert(addLoc.body.data?.label === 'Home Town', 'Location label is Home Town');

    const getLocs = await request('/api/users/locations', {
      headers: { 'Authorization': `Bearer ${customerToken}` }
    });
    assert(getLocs.status === 200, `Get locations returned 200 (got ${getLocs.status})`);
    assert(getLocs.body.data?.length > 0, 'Retrieved saved locations');

    // 8. Bookings Filtering by Tabs
    console.log('\nTEST 8: Customer Bookings Tab Filtering (/api/bookings/user?tab=...)');
    // Create a booking for this customer
    const createBk = await request('/api/bookings', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${customerToken}`
      },
      body: {
        serviceId: 'h-101',
        eventDate: '2026-11-20',
        timeSlot: 'Evening',
        guestCount: 350,
        name: 'Rohan Verma',
        mobile: testMobile,
        email: `${testMobile}@hallkhoj.phone`,
        specialRequests: 'AC hall preparation'
      }
    });
    assert(createBk.status === 201, `Booking created for customer with 201 (got ${createBk.status})`);

    const pendingBk = await request('/api/bookings/user?tab=pending', {
      headers: { 'Authorization': `Bearer ${customerToken}` }
    });
    assert(pendingBk.status === 200, `Query pending tab returned 200 (got ${pendingBk.status})`);
    assert(pendingBk.body.data?.length >= 1, `Found ${pendingBk.body.data?.length} pending bookings`);

    const cancelledBk = await request('/api/bookings/user?tab=cancelled', {
      headers: { 'Authorization': `Bearer ${customerToken}` }
    });
    assert(cancelledBk.status === 200, `Query cancelled tab returned 200 (got ${cancelledBk.status})`);

    console.log('\n====================================================');
    console.log(`PHASE 4 TEST RESULTS: ${passed} PASSED | ${failed} FAILED`);
    console.log('====================================================');

    process.exit(failed > 0 ? 1 : 0);
  } catch (err) {
    console.error('Test execution error:', err);
    process.exit(1);
  }
}

runTests();
