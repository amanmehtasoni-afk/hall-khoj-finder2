/**
 * Hall Khoj Finder — Phase 10 Test Suite
 * Comprehensive verification of Notifications (Creation, Unread Counting, Mark Read, Mark All Read),
 * Customer-Owner Protected Chat Threads, Participant Authorization, and Alert Triggers.
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

async function runPhase10Tests() {
  console.log('================================================================');
  console.log('🔔 RUNNING PHASE 10 VERIFICATION TEST SUITE (NOTIFICATIONS & CHAT)');
  console.log('================================================================\n');

  try {
    const testStamp = Date.now();

    // 0. User Setup (Customer, Owner, Third-Party User)
    console.log('--- 0. Setup Test Users & Venue ---');
    const custRes = await request('/auth/register', {
      method: 'POST',
      body: {
        name: 'Aman Customer',
        email: `aman_cust_${testStamp}@example.com`,
        mobile: `98${Math.floor(10000000 + Math.random() * 90000000)}`,
        password: 'Pass@123Customer',
        role: 'customer'
      }
    });
    const custToken = custRes.data.data.token;
    const custId = custRes.data.data.user.id;
    assert(custToken, 'Customer registered with JWT');

    const ownerRes = await request('/auth/register', {
      method: 'POST',
      body: {
        name: 'Sunil Owner Partner',
        email: `sunil_owner_${testStamp}@example.com`,
        mobile: `97${Math.floor(10000000 + Math.random() * 90000000)}`,
        password: 'OwnerPassword@123',
        role: 'owner',
        businessName: 'Sunil Banquets Lucknow'
      }
    });
    const ownerToken = ownerRes.data.data.token;
    const ownerId = ownerRes.data.data.user.id;
    assert(ownerToken, 'Owner registered with JWT');

    const thirdPartyRes = await request('/auth/register', {
      method: 'POST',
      body: {
        name: 'Stranger User',
        email: `stranger_${testStamp}@example.com`,
        mobile: `96${Math.floor(10000000 + Math.random() * 90000000)}`,
        password: 'Pass@123Customer',
        role: 'customer'
      }
    });
    const thirdPartyToken = thirdPartyRes.data.data.token;
    assert(thirdPartyToken, 'Third-party user registered');

    // Owner creates venue
    const hallRes = await request('/halls', {
      method: 'POST',
      headers: { Authorization: `Bearer ${ownerToken}` },
      body: {
        name: 'Sunil Grand Imperial Banquet',
        type: 'Banquet Hall',
        category: 'Banquet Hall',
        city: 'Lucknow',
        state: 'Uttar Pradesh',
        area: 'Aliganj',
        startingPrice: 60000,
        capacityMin: 150,
        capacityMax: 800,
        latitude: 26.8850,
        longitude: 80.9350,
        facilities: ['Central AC', 'In-house Decor', 'Valet Parking']
      }
    });
    const venue = hallRes.data.data;
    const venueId = venue.id;
    assert(venueId, 'Venue created for messaging and notification testing');

    // 1. Automated Booking Notification Trigger
    console.log('\n--- 1. Automated Booking Notification Trigger ---');
    const bookRes = await request('/bookings', {
      method: 'POST',
      headers: { Authorization: `Bearer ${custToken}` },
      body: {
        serviceId: venueId,
        eventDate: '2026-12-15',
        timeSlot: 'Evening',
        guestCount: 400,
        name: 'Aman Customer',
        mobile: '9876543210',
        email: `aman_cust_${testStamp}@example.com`
      }
    });
    assert(bookRes.status === 201, 'Booking created with 201');
    const booking = bookRes.data.data;
    const bookingId = booking.id;

    // Check owner's notification queue
    const ownerNotifsRes = await request('/notifications', {
      headers: { Authorization: `Bearer ${ownerToken}` }
    });
    assert(ownerNotifsRes.status === 200, 'GET /api/notifications returns 200 OK for owner');
    assert(ownerNotifsRes.data.data.unreadCount >= 1, `Owner has ${ownerNotifsRes.data.data.unreadCount} unread notification(s)`);
    const bookingNotif = ownerNotifsRes.data.data.notifications.find(n => n.type === 'BOOKING_REQUEST');
    assert(bookingNotif !== undefined, 'Found BOOKING_REQUEST notification in owner inbox');
    assert(bookingNotif.title.includes('New Booking Request'), 'Notification title is "New Booking Request"');
    assert(bookingNotif.read === false, 'Notification is marked read: false');

    // 2. Notification Management (Mark Read & Mark All Read)
    console.log('\n--- 2. Notification Read Management ---');
    const readSingleRes = await request(`/notifications/${bookingNotif.id}/read`, {
      method: 'PATCH',
      headers: { Authorization: `Bearer ${ownerToken}` }
    });
    assert(readSingleRes.status === 200, 'Single notification marked as read (200 OK)');
    assert(readSingleRes.data.data.read === true, 'Notification object now has read: true');

    const markAllRes = await request('/notifications/read-all', {
      method: 'PATCH',
      headers: { Authorization: `Bearer ${ownerToken}` }
    });
    assert(markAllRes.status === 200, 'PATCH /api/notifications/read-all returns 200 OK');

    const checkZeroUnread = await request('/notifications', {
      headers: { Authorization: `Bearer ${ownerToken}` }
    });
    assert(checkZeroUnread.data.data.unreadCount === 0, 'Owner unread notification count is now 0');

    // 3. Customer-Owner Protected Chat Flow
    console.log('\n--- 3. Customer-Owner Chat & Conversation Flow ---');
    // Customer sends message to owner regarding this booking
    const sendMsgRes = await request('/messages', {
      method: 'POST',
      headers: { Authorization: `Bearer ${custToken}` },
      body: {
        receiverId: ownerId,
        bookingId: bookingId,
        serviceId: venueId,
        content: 'Namaste Sunil ji, can we arrange a separate Jain food buffet section?'
      }
    });
    assert(sendMsgRes.status === 201, 'Customer sent message (201 Created)');
    const msg = sendMsgRes.data.data;
    const conversationId = msg.conversationId;
    assert(conversationId && conversationId.includes(bookingId), `Deterministic conversation ID generated: ${conversationId}`);
    assert(msg.senderRole === 'customer' || msg.senderRole === 'user', 'Message senderRole is customer');

    // Verify automated notification delivered to owner for message
    const ownerMsgNotifRes = await request('/notifications', {
      headers: { Authorization: `Bearer ${ownerToken}` }
    });
    const msgNotif = ownerMsgNotifRes.data.data.notifications.find(n => n.type === 'MESSAGE');
    assert(msgNotif !== undefined, 'Owner received real notification for incoming message');
    assert(msgNotif.message.includes('Jain food buffet'), 'Notification preview contains message snippet');

    // 4. Conversation Threads List
    console.log('\n--- 4. Active Conversation Threads ---');
    const ownerConvsRes = await request('/messages/conversations', {
      headers: { Authorization: `Bearer ${ownerToken}` }
    });
    assert(ownerConvsRes.status === 200, 'GET /api/messages/conversations returns 200 OK');
    assert(Array.isArray(ownerConvsRes.data.data), 'Conversations data is an Array');
    assert(ownerConvsRes.data.data.length >= 1, `Owner has ${ownerConvsRes.data.data.length} active conversation thread(s)`);
    const thread = ownerConvsRes.data.data.find(c => c.conversationId === conversationId);
    assert(thread !== undefined, 'Found matching conversation thread');
    assert(thread.unreadCount >= 1, `Thread indicates ${thread.unreadCount} unread message(s) for owner`);
    assert(thread.otherParticipant.name === 'Aman Customer', 'Other participant correctly identified as Aman Customer');

    // 5. Message Thread History & Owner Reply
    console.log('\n--- 5. Thread Message History & Owner Reply ---');
    const getThreadRes = await request(`/messages/${conversationId}`, {
      headers: { Authorization: `Bearer ${ownerToken}` }
    });
    assert(getThreadRes.status === 200, 'Owner retrieved message thread (200 OK)');
    assert(getThreadRes.data.data.length === 1, 'Thread has 1 initial message');

    // Owner replies back
    const ownerReplyMsgRes = await request('/messages', {
      method: 'POST',
      headers: { Authorization: `Bearer ${ownerToken}` },
      body: {
        receiverId: custId,
        bookingId: bookingId,
        serviceId: venueId,
        content: 'Haan Aman ji, bilkul! We have a dedicated separate vegetarian & Jain kitchen.'
      }
    });
    assert(ownerReplyMsgRes.status === 201, 'Owner sent reply message (201 Created)');

    // Verify Customer now sees 2 messages in the thread
    const custThreadRes = await request(`/messages/${conversationId}`, {
      headers: { Authorization: `Bearer ${custToken}` }
    });
    assert(custThreadRes.data.data.length === 2, 'Customer thread contains 2 messages');
    assert(custThreadRes.data.data[1].senderRole === 'owner', 'Second message is from owner');

    // 6. Mark Thread as Read
    console.log('\n--- 6. Mark Thread Read ---');
    const markThreadRes = await request(`/messages/${conversationId}/read`, {
      method: 'PATCH',
      headers: { Authorization: `Bearer ${ownerToken}` }
    });
    assert(markThreadRes.status === 200, 'Owner marked thread messages as read (200 OK)');

    // 7. Security & Participant Authorization Tests
    console.log('\n--- 7. Security & Authorization Protection ---');
    // Stranger tries to inspect Aman & Sunil's private conversation thread
    const strangerAccessRes = await request(`/messages/${conversationId}`, {
      headers: { Authorization: `Bearer ${thirdPartyToken}` }
    });
    assert(strangerAccessRes.status === 403, 'Unauthorized third party blocked from reading private thread (403 Forbidden)');

    // Self-message rejection
    const selfMsgRes = await request('/messages', {
      method: 'POST',
      headers: { Authorization: `Bearer ${custToken}` },
      body: {
        receiverId: custId, // Self!
        content: 'Talking to myself'
      }
    });
    assert(selfMsgRes.status === 400, 'Sending message to oneself is rejected with 400 Bad Request');
    assert(selfMsgRes.data.code === 'SELF_MESSAGE_NOT_ALLOWED', 'Error code is SELF_MESSAGE_NOT_ALLOWED');

  } catch (err) {
    console.error('Fatal error in Phase 10 tests:', err);
    failed++;
  }

  console.log('\n================================================================');
  console.log(`PHASE 10 RESULTS: ${passed} PASSED | ${failed} FAILED`);
  console.log('================================================================\n');

  if (failed > 0) {
    process.exit(1);
  }
}

runPhase10Tests();
