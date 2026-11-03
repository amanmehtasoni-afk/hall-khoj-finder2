/**
 * Automated Test Suite for Phase 12, Phase 13, and Phase 15
 * Verifies AI Natural Language Search, Grounded Matcher,
 * Owner AI Assistant with safe confirmation, and Payment Gateway with HMAC verification.
 */

const http = require('http');
const crypto = require('crypto');

const BASE_URL = 'http://localhost:3000/api';
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

function request(path, options = {}) {
  return new Promise((resolve, reject) => {
    const url = new URL(BASE_URL + path);
    const reqOptions = {
      method: options.method || 'GET',
      headers: {
        'Content-Type': 'application/json',
        ...(options.headers || {})
      }
    };

    const req = http.request(url, reqOptions, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try {
          const parsed = JSON.parse(data);
          resolve({ status: res.statusCode, body: parsed });
        } catch {
          resolve({ status: res.statusCode, body: data });
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

async function runTests() {
  console.log('\n======================================================');
  console.log('🧪 RUNNING TEST SUITE: PHASES 12, 13 & 15');
  console.log('======================================================\n');

  // 0. Setup test users and venue
  console.log('--- 0. Setup Fixtures ---');
  const rand = Math.floor(Math.random() * 10000);
  const ownerEmail = `owner_ai_${rand}@test.com`;
  const custEmail = `cust_ai_${rand}@test.com`;

  const ownerReg = await request('/auth/register', {
    method: 'POST',
    body: { name: 'Owner AI Test', email: ownerEmail, mobile: '9876543210', password: 'Password@123', role: 'owner' }
  });
  const ownerToken = ownerReg.body.data.token;
  const ownerId = ownerReg.body.data.user.id;

  const custReg = await request('/auth/register', {
    method: 'POST',
    body: { name: 'Customer AI Test', email: custEmail, mobile: '9876543211', password: 'Password@123', role: 'customer' }
  });
  const custToken = custReg.body.data.token;
  const custId = custReg.body.data.user.id;

  // Create test hall in Lucknow
  const hallRes = await request('/halls', {
    method: 'POST',
    headers: { Authorization: `Bearer ${ownerToken}` },
    body: {
      name: 'Royal Heritage Grand Palace',
      category: 'Marriage Halls',
      city: 'Lucknow',
      district: 'Lucknow',
      state: 'Uttar Pradesh',
      address: 'Hazratganj Road, Lucknow',
      startingPrice: 150000,
      capacityMin: 200,
      capacityMax: 800,
      facilities: ['AC', 'Parking', 'Lawn', 'Rooms', 'Power Backup'],
      isVerified: true
    }
  });
  const hallId = hallRes.body.data.id;
  assert(hallRes.status === 201, 'Test hall created for AI and payments');

  // ==========================================
  // PHASE 12: HALL KHOJ AI SEARCH
  // ==========================================
  console.log('\n--- 1. Phase 12: Natural Language Search & Grounded Matcher ---');

  // English NLP search
  const aiSearch1 = await request('/ai/search', {
    method: 'POST',
    body: { prompt: 'Looking for a Marriage Hall in Lucknow for 500 guests with AC and lawn under 2 lakh' }
  });
  assert(aiSearch1.status === 200, 'AI search returns 200 OK');
  assert(aiSearch1.body.data.interpretedQuery.city === 'Lucknow', 'Extracted city correctly as Lucknow');
  assert(aiSearch1.body.data.interpretedQuery.capacity === 500, 'Extracted capacity correctly as 500');
  assert(aiSearch1.body.data.interpretedQuery.maxPrice === 200000, 'Extracted max price as 200000');
  assert(aiSearch1.body.data.interpretedQuery.category === 'Marriage Halls', 'Extracted category as Marriage Halls');
  assert(aiSearch1.body.data.interpretedQuery.facilities.includes('AC'), 'Extracted AC facility');
  assert(aiSearch1.body.data.interpretedQuery.facilities.includes('Lawn'), 'Extracted Lawn facility');
  assert(Array.isArray(aiSearch1.body.data.results), 'Results is an array');
  assert(aiSearch1.body.data.results.length > 0, 'Found matching real database venue');
  const hasOurVenue = aiSearch1.body.data.results.some(h => h.name === 'Royal Heritage Grand Palace');
  assert(hasOurVenue, 'Our created venue is included in grounded search results');
  assert(typeof aiSearch1.body.data.summary === 'string' && aiSearch1.body.data.summary.includes('option'), 'Summary is grounded in real database listing');

  // Hindi / Hinglish NLP search
  const aiSearch2 = await request('/ai/search', {
    method: 'POST',
    body: { prompt: 'Lucknow me shaadi ke liye 400 logo ka hall chahiye budget 1.8 lakh' }
  });
  assert(aiSearch2.status === 200, 'Hinglish AI search returns 200 OK');
  assert(aiSearch2.body.data.interpretedQuery.city === 'Lucknow', 'Extracted city from Hinglish query');
  assert(aiSearch2.body.data.interpretedQuery.capacity === 400, 'Extracted capacity 400 from "400 logo"');
  assert(aiSearch2.body.data.interpretedQuery.maxPrice === 180000, 'Extracted max price from "1.8 lakh"');
  assert(aiSearch2.body.data.interpretedQuery.eventType === 'Wedding', 'Detected event type as Wedding');

  // Backward compatibility /api/ai/parse
  const parseRes = await request('/ai/parse', {
    method: 'POST',
    body: { prompt: 'AC hall for 300 people in Lucknow' }
  });
  assert(parseRes.status === 200, 'Backward compatible /api/ai/parse returns 200');
  assert(parseRes.body.data.interpretedFilters !== undefined, 'Contains interpretedFilters');
  assert(parseRes.body.data.groundedMatches !== undefined, 'Contains groundedMatches');

  // Contextual recommendations
  const recRes = await request('/ai/recommendations?city=Lucknow&category=' + encodeURIComponent('Marriage Halls'));
  assert(recRes.status === 200, 'Contextual recommendations returns 200');
  assert(Array.isArray(recRes.body.data.recommendations), 'Recommendations is an array');

  // ==========================================
  // PHASE 13: OWNER AI BUSINESS ASSISTANT
  // ==========================================
  console.log('\n--- 2. Phase 13: Owner AI Business Assistant ---');

  // Intent: INQUIRY_REPLY
  const inquiryRes = await request('/ai/owner/assistant', {
    method: 'POST',
    headers: { Authorization: `Bearer ${ownerToken}` },
    body: {
      intent: 'INQUIRY_REPLY',
      context: {
        customerName: 'Rahul Verma',
        eventDate: '2026-11-20',
        guestCount: 450,
        eventType: 'Wedding Reception',
        customerQuestion: 'Can we bring our own sweet caterer and is DJ allowed till 11 PM?',
        hallId
      }
    }
  });
  assert(inquiryRes.status === 200, 'Inquiry reply generation returns 200');
  assert(inquiryRes.body.data.intent === 'INQUIRY_REPLY', 'Intent matches INQUIRY_REPLY');
  assert(inquiryRes.body.data.draft.includes('Rahul Verma'), 'Draft addresses customer by name');
  assert(inquiryRes.body.data.draft.includes('Royal Heritage Grand Palace'), 'Draft mentions venue name');
  assert(inquiryRes.body.data.draft.includes('450 guests'), 'Draft incorporates guest count');

  // Intent: ANALYZE_PERFORMANCE
  const analyticsRes = await request('/ai/owner/assistant', {
    method: 'POST',
    headers: { Authorization: `Bearer ${ownerToken}` },
    body: { intent: 'ANALYZE_PERFORMANCE' }
  });
  assert(analyticsRes.status === 200, 'Performance analytics returns 200');
  assert(typeof analyticsRes.body.data.metrics.totalListings === 'number', 'Reports total listings');
  assert(typeof analyticsRes.body.data.metrics.occupancyRatePercent === 'number', 'Calculates occupancy rate');
  assert(Array.isArray(analyticsRes.body.data.insights), 'Generates strategic insights');

  // Intent: SUGGEST_PRICING
  const pricingRes = await request('/ai/owner/assistant', {
    method: 'POST',
    headers: { Authorization: `Bearer ${ownerToken}` },
    body: {
      intent: 'SUGGEST_PRICING',
      context: { hallId }
    }
  });
  assert(pricingRes.status === 200, 'Competitive pricing suggestion returns 200');
  assert(pricingRes.body.data.currentPrice === 150000, 'Reflects current starting price');
  assert(typeof pricingRes.body.data.marketAverage === 'number', 'Calculates market average');
  assert(typeof pricingRes.body.data.recommendation === 'string', 'Provides actionable recommendation text');

  // Intent: PROPOSE_ACTION (Safe action proposal - requires confirmation)
  const actionRes = await request('/ai/owner/assistant', {
    method: 'POST',
    headers: { Authorization: `Bearer ${ownerToken}` },
    body: {
      intent: 'PROPOSE_ACTION',
      context: {
        actionType: 'BLOCK_DATE',
        hallId,
        date: '2026-12-25',
        reason: 'Private offline booking'
      }
    }
  });
  assert(actionRes.status === 200, 'Propose action returns 200');
  assert(actionRes.body.data.action.status === 'NEEDS_CONFIRMATION', 'Status is NEEDS_CONFIRMATION');
  assert(actionRes.body.data.action.requiresUserApproval === true, 'Explicitly requiresUserApproval');

  // Try executing with confirmed: false (Cancelled)
  const cancelActionRes = await request('/ai/owner/execute-action', {
    method: 'POST',
    headers: { Authorization: `Bearer ${ownerToken}` },
    body: {
      actionPayload: actionRes.body.data.action,
      confirmed: false
    }
  });
  assert(cancelActionRes.status === 200, 'Cancellation processed smoothly');
  assert(cancelActionRes.body.data.status === 'CANCELLED', 'Action confirmed as CANCELLED');

  // Execute with confirmed: true (Safe execution)
  const confirmActionRes = await request('/ai/owner/execute-action', {
    method: 'POST',
    headers: { Authorization: `Bearer ${ownerToken}` },
    body: {
      actionPayload: actionRes.body.data.action,
      confirmed: true
    }
  });
  assert(confirmActionRes.status === 200, 'Execution returned 200');
  assert(confirmActionRes.body.data.status === 'EXECUTED', 'Action status is EXECUTED');
  assert(confirmActionRes.body.data.date === '2026-12-25', 'Blocked date recorded');

  // Verify hall was updated in database
  const checkHall = await request(`/halls/${hallId}`);
  assert(checkHall.body.data.bookedDates.includes('2026-12-25'), 'Hall bookedDates array now includes blocked date');

  // ==========================================
  // PHASE 15: PAYMENT GATEWAY ARCHITECTURE
  // ==========================================
  console.log('\n--- 3. Phase 15: Payment Gateway Architecture ---');

  // Create a booking first
  const bookRes = await request('/bookings', {
    method: 'POST',
    headers: { Authorization: `Bearer ${custToken}` },
    body: {
      serviceId: hallId,
      eventDate: '2026-11-25',
      eventType: 'Wedding Reception',
      timeSlot: 'Evening',
      guestCount: 400,
      name: 'Customer AI Test',
      email: custEmail,
      mobile: '9876543211'
    }
  });
  assert(bookRes.status === 201, 'Test booking created successfully');
  const bookingId = bookRes.body.data.id;
  const bookingTotal = bookRes.body.data.totalPrice; // e.g. 150000

  // 1. Order Creation (25% Advance Calculation)
  const orderRes = await request('/payments/create-order', {
    method: 'POST',
    headers: { Authorization: `Bearer ${custToken}` },
    body: { bookingId }
  });
  if (orderRes.status !== 201) {
    console.log('Order creation failed:', orderRes.status, orderRes.body);
  }
  assert(orderRes.status === 201, 'Create payment order returns 201 Created');
  const expectedAdvance = Math.round(bookingTotal * 0.25);
  assert(orderRes.body.data.advanceAmount === expectedAdvance, `Advance calculated at exact 25% (₹${expectedAdvance})`);
  assert(orderRes.body.data.amountInPaise === expectedAdvance * 100, `Amount in paise calculated accurately (${expectedAdvance * 100})`);
  assert(orderRes.body.data.currency === 'INR', 'Currency set to INR');
  assert(typeof orderRes.body.data.orderId === 'string' && orderRes.body.data.orderId.startsWith('order_hkf_'), 'Valid orderId generated');

  const orderId = orderRes.body.data.orderId;
  const paymentId = `pay_mock_${Date.now()}`;

  // 2. Signature verification test (tampered signature rejection)
  const fakeSigRes = await request('/payments/verify', {
    method: 'POST',
    headers: { Authorization: `Bearer ${custToken}` },
    body: {
      orderId,
      paymentId,
      signature: 'malicious_tampered_signature_12345',
      bookingId
    }
  });
  assert(fakeSigRes.status === 400, 'Tampered signature rejected with 400 Bad Request');
  assert(fakeSigRes.body.code === 'SIGNATURE_MISMATCH', 'Error code indicates SIGNATURE_MISMATCH');

  // 3. Generate genuine HMAC-SHA256 signature
  const PAYMENT_SECRET = process.env.RAZORPAY_KEY_SECRET || 'hkf_secret_payment_signature_key_2026';
  const validSignature = crypto
    .createHmac('sha256', PAYMENT_SECRET)
    .update(`${orderId}|${paymentId}`)
    .digest('hex');

  // 4. Verify Payment with authentic HMAC signature
  const verifyRes = await request('/payments/verify', {
    method: 'POST',
    headers: { Authorization: `Bearer ${custToken}` },
    body: {
      orderId,
      paymentId,
      signature: validSignature,
      bookingId,
      paymentMethod: 'UPI'
    }
  });
  assert(verifyRes.status === 200, 'Valid signature verified with 200 OK');
  assert(verifyRes.body.data.status === 'CONFIRMED', 'Booking transitioned to CONFIRMED status');
  assert(verifyRes.body.data.advancePaid === expectedAdvance, 'Advance paid recorded accurately');

  // Check booking in database
  const checkBooking = await request(`/bookings/${bookingId}`, {
    headers: { Authorization: `Bearer ${custToken}` }
  });
  assert(checkBooking.body.data.status === 'CONFIRMED', 'Live booking status is CONFIRMED');
  assert(checkBooking.body.data.paymentStatus === 'ADVANCE_PAID', 'Booking paymentStatus is ADVANCE_PAID');
  assert(checkBooking.body.data.remainingAmount === bookingTotal - expectedAdvance, 'Remaining amount matches total minus advance');

  // 5. Transaction Ledger History
  const ledgerRes = await request('/payments/history', {
    headers: { Authorization: `Bearer ${custToken}` }
  });
  assert(ledgerRes.status === 200, 'Transaction history returns 200 OK');
  assert(Array.isArray(ledgerRes.body.data.transactions), 'Ledger transactions is an array');
  const ourTx = ledgerRes.body.data.transactions.find(t => t.orderId === orderId);
  assert(ourTx !== undefined, 'Found transaction in ledger');
  assert(ourTx.status === 'SUCCESS', 'Transaction status is SUCCESS');

  // 6. Booking payments ledger
  const bTxRes = await request(`/payments/${bookingId}`, {
    headers: { Authorization: `Bearer ${custToken}` }
  });
  assert(bTxRes.status === 200, 'Booking payments ledger returns 200');
  assert(bTxRes.body.data.transactions.length > 0, 'Found transactions linked to booking');

  // 7. Cancellation & Refund
  const refundRes = await request('/payments/refund', {
    method: 'POST',
    headers: { Authorization: `Bearer ${custToken}` },
    body: {
      bookingId,
      reason: 'Customer rescheduled family event'
    }
  });
  assert(refundRes.status === 200, 'Refund processed returns 200');
  assert(refundRes.body.data.status === 'REFUNDED', 'Status updated to REFUNDED');
  assert(typeof refundRes.body.data.refundAmount === 'number', 'Calculated refund amount');

  console.log('\n======================================================');
  console.log(`🏁 TEST SUMMARY: ${passed} PASSED | ${failed} FAILED`);
  console.log('======================================================\n');

  if (failed > 0) process.exit(1);
}

runTests().catch(err => {
  console.error('Fatal error in tests:', err);
  process.exit(1);
});
