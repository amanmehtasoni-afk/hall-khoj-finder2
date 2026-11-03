/**
 * Hall Khoj Finder — Payment Service Layer (Phase 15)
 * Secure Order Creation, HMAC-SHA256 Signature Verification,
 * 25% Advance Calculation, Immutable Transaction Ledger & Refunds.
 */

const crypto = require('crypto');
const firestore = require('./firestore.service');
const notificationService = require('./notification.service');

const PAYMENT_KEY_ID = process.env.RAZORPAY_KEY_ID || process.env.PAYMENT_KEY_ID || 'rzp_test_hkf_live2026';
const PAYMENT_SECRET = process.env.RAZORPAY_KEY_SECRET || process.env.PAYMENT_KEY_SECRET || 'hkf_secret_payment_signature_key_2026';

/**
 * Utility to generate a valid HMAC-SHA256 signature
 */
function generateSignature(orderId, paymentId) {
  return crypto
    .createHmac('sha256', PAYMENT_SECRET)
    .update(`${orderId}|${paymentId}`)
    .digest('hex');
}

/**
 * Verify HMAC-SHA256 signature
 */
function verifySignature(orderId, paymentId, signature) {
  if (!orderId || !paymentId || !signature || typeof signature !== 'string') {
    return false;
  }
  const expected = generateSignature(orderId, paymentId);
  const expectedBuf = Buffer.from(expected, 'utf8');
  const signatureBuf = Buffer.from(signature, 'utf8');
  if (expectedBuf.length !== signatureBuf.length) {
    return false;
  }
  return crypto.timingSafeEqual(expectedBuf, signatureBuf);
}


/**
 * PHASE 15: Create Payment Order
 * Calculates exactly 25% booking advance based on verified database price.
 */
async function createOrder({ bookingId, customerId }) {
  if (!bookingId) {
    throw new Error('Booking ID is required');
  }

  // 1. Fetch live booking from database
  const booking = await firestore.getDocument('bookings', bookingId);
  if (!booking) {
    const notFound = new Error('Booking not found');
    notFound.statusCode = 404;
    throw notFound;
  }

  // Verify authorization if customerId is passed
  if (customerId && booking.customerId !== customerId) {
    const unauth = new Error('Unauthorized to pay for this booking');
    unauth.statusCode = 403;
    throw unauth;
  }

  // Enforce Phase 9 & Phase 17 Critical Business Rule:
  // Advance token payment can ONLY be collected AFTER explicit owner approval.
  const isApproved = ['APPROVED', 'ACCEPTED'].includes(booking.status);
  if (!isApproved) {
    const approvalRequiredErr = new Error(`Payment cannot be initiated. This booking is currently in status '${booking.status}' and requires mandatory owner approval first.`);
    approvalRequiredErr.statusCode = 400;
    approvalRequiredErr.code = 'OWNER_APPROVAL_REQUIRED';
    throw approvalRequiredErr;
  }

  const totalPrice = Number(booking.totalPrice || booking.pricing?.totalAmount) || 0;
  if (totalPrice <= 0) {
    const err = new Error('Invalid booking total price');
    err.statusCode = 400;
    throw err;
  }

  // Calculate exact 25% advance deposit
  const advanceAmount = Math.round(totalPrice * 0.25);
  const amountInPaise = advanceAmount * 100;

  // Generate unique order ID
  const orderId = `order_hkf_${Date.now()}_${Math.random().toString(36).substr(2, 6)}`;

  // Record transaction in ledger with status CREATED
  const transactionData = {
    orderId,
    bookingId: booking.id,
    bookingCode: booking.bookingId || booking.id,
    customerId: booking.customerId,
    customerName: booking.customerName || 'Customer',
    ownerId: booking.ownerId,
    hallId: booking.hallId,
    hallName: booking.hallName || 'Event Venue',
    totalBookingAmount: totalPrice,
    amount: advanceAmount,
    amountPaise: amountInPaise,
    currency: 'INR',
    type: 'ADVANCE_DEPOSIT_25',
    status: 'CREATED',
    createdAt: new Date().toISOString()
  };

  const transaction = await firestore.createDocument('transactions', transactionData);

  return {
    orderId,
    transactionId: transaction.id,
    bookingId: booking.id,
    bookingCode: booking.bookingId || booking.id,
    hallName: booking.hallName,
    totalPrice,
    advanceAmount,
    amount: advanceAmount,
    amountInPaise,
    currency: 'INR',
    keyId: PAYMENT_KEY_ID,
    customer: {
      name: booking.customerName,
      phone: booking.customerPhone,
      email: booking.customerEmail
    },
    notes: {
      eventDate: booking.eventDate,
      eventType: booking.eventType
    }
  };
}

/**
 * PHASE 15: Verify Payment & Confirm Booking
 */
async function verifyPayment({ orderId, paymentId, signature, bookingId, paymentMethod = 'UPI' }) {
  if (!orderId || !paymentId || !signature) {
    const err = new Error('Order ID, Payment ID, and Signature are required');
    err.statusCode = 400;
    throw err;
  }

  // Verify signature
  let isValid = false;
  try {
    isValid = verifySignature(orderId, paymentId, signature);
  } catch {
    isValid = false;
  }

  // Development simulation token fallback (strictly non-production only)
  if (!isValid && process.env.NODE_ENV !== 'production' && (signature === 'SIMULATED_TEST_SIGNATURE' || signature === 'SIMULATED_GATEWAY_CALLBACK')) {
    isValid = true;
  }

  if (!isValid) {
    // Record failed attempt in ledger if order exists
    const allTx = await firestore.getCollection('transactions');
    const existingTx = allTx.find(t => t.orderId === orderId);
    if (existingTx) {
      await firestore.updateDocument('transactions', existingTx.id, {
        status: 'FAILED',
        failedReason: 'HMAC signature verification mismatch',
        paymentId,
        updatedAt: new Date().toISOString()
      });
    }
    const sigErr = new Error('Payment verification failed: Invalid HMAC-SHA256 signature');
    sigErr.statusCode = 400;
    sigErr.code = 'SIGNATURE_MISMATCH';
    throw sigErr;
  }

  // Find transaction
  const allTx = await firestore.getCollection('transactions');
  let tx = allTx.find(t => t.orderId === orderId);

  // If transaction not found by orderId, find by bookingId
  if (!tx && bookingId) {
    tx = allTx.find(t => t.bookingId === bookingId && t.status === 'CREATED');
  }

  const bId = bookingId || (tx ? tx.bookingId : null);
  if (!bId) {
    const err = new Error('Associated booking not found for order');
    err.statusCode = 404;
    throw err;
  }

  const booking = await firestore.getDocument('bookings', bId);
  if (!booking) {
    const err = new Error('Booking not found');
    err.statusCode = 404;
    throw err;
  }

  const advanceAmount = tx ? tx.amount : Math.round((booking.totalPrice || 0) * 0.25);
  const remainingAmount = Math.max(0, (booking.totalPrice || 0) - advanceAmount);

  // Update transaction status to SUCCESS
  if (tx) {
    await firestore.updateDocument('transactions', tx.id, {
      status: 'SUCCESS',
      paymentId,
      signature,
      paymentMethod,
      paidAt: new Date().toISOString()
    });
  } else {
    tx = await firestore.createDocument('transactions', {
      orderId,
      paymentId,
      signature,
      bookingId: booking.id,
      bookingCode: booking.bookingId,
      customerId: booking.customerId,
      ownerId: booking.ownerId,
      amount: advanceAmount,
      currency: 'INR',
      status: 'SUCCESS',
      paymentMethod,
      paidAt: new Date().toISOString()
    });
  }

  // Update Booking: Transition state machine to CONFIRMED
  await firestore.updateDocument('bookings', booking.id, {
    status: 'CONFIRMED',
    paymentStatus: 'ADVANCE_PAID',
    advancePaid: advanceAmount,
    remainingAmount,
    transactionId: tx.id,
    paymentId,
    orderId,
    paidAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  });

  // Trigger automated notifications
  try {
    // Notify customer
    await notificationService.createNotification({
      userId: booking.customerId,
      title: 'Advance Payment Successful! 🎉',
      message: `Your advance payment of ₹${advanceAmount.toLocaleString('en-IN')} for ${booking.hallName || 'your venue'} has been received. Booking #${booking.bookingId || booking.id} is now CONFIRMED!`,
      type: 'PAYMENT_SUCCESS',
      link: '/dashboard.html'
    });

    // Notify owner
    await notificationService.createNotification({
      userId: booking.ownerId,
      title: 'Advance Payment Received! 💰',
      message: `₹${advanceAmount.toLocaleString('en-IN')} advance paid for ${booking.hallName || 'your venue'} on ${booking.eventDate}. Booking #${booking.bookingId || booking.id} is now CONFIRMED.`,
      type: 'PAYMENT_RECEIVED',
      link: '/owner/dashboard.html'
    });
  } catch (notifErr) {
    console.error('Notification error on payment confirmation:', notifErr.message);
  }

  return {
    success: true,
    status: 'CONFIRMED',
    orderId,
    paymentId,
    transactionId: tx.id,
    advancePaid: advanceAmount,
    remainingAmount,
    message: 'Payment verified successfully and booking confirmed.'
  };
}

/**
 * PHASE 15: Process Refund
 */
async function processRefund({ bookingId, requesterId, reason }) {
  if (!bookingId) {
    throw new Error('Booking ID is required');
  }

  const booking = await firestore.getDocument('bookings', bookingId);
  if (!booking) {
    const err = new Error('Booking not found');
    err.statusCode = 404;
    throw err;
  }

  if (booking.paymentStatus !== 'ADVANCE_PAID' || !booking.advancePaid || booking.advancePaid <= 0) {
    const err = new Error('No advance payment found to refund for this booking');
    err.statusCode = 400;
    throw err;
  }

  // Calculate refund policy based on days until event
  const eventDate = new Date(booking.eventDate);
  const now = new Date();
  const diffDays = Math.ceil((eventDate - now) / (1000 * 60 * 60 * 24));

  let refundPercent = 0;
  if (diffDays >= 30) {
    refundPercent = 100; // Full refund
  } else if (diffDays >= 15) {
    refundPercent = 50; // 50% refund
  } else {
    refundPercent = 0; // Less than 15 days, no advance refund
  }

  const refundAmount = Math.round((booking.advancePaid * refundPercent) / 100);

  // Record refund transaction
  const refundTx = await firestore.createDocument('transactions', {
    bookingId: booking.id,
    bookingCode: booking.bookingId,
    customerId: booking.customerId,
    ownerId: booking.ownerId,
    originalAmount: booking.advancePaid,
    refundAmount,
    refundPercent,
    currency: 'INR',
    type: 'REFUND',
    status: 'REFUNDED',
    reason: reason || 'Booking cancellation',
    refundedAt: new Date().toISOString()
  });

  // Update booking status
  await firestore.updateDocument('bookings', booking.id, {
    status: 'CANCELLED',
    paymentStatus: refundAmount > 0 ? 'REFUNDED' : 'FORFEITED',
    refundAmount,
    refundTransactionId: refundTx.id,
    cancelledAt: new Date().toISOString(),
    cancelReason: reason || 'Cancelled with refund'
  });

  return {
    refundTransactionId: refundTx.id,
    bookingId: booking.id,
    originalAdvance: booking.advancePaid,
    refundPercent,
    refundAmount,
    diffDays,
    status: 'REFUNDED',
    message: refundAmount > 0
      ? `Refund of ₹${refundAmount.toLocaleString('en-IN')} (${refundPercent}%) processed according to cancellation policy (${diffDays} days notice).`
      : `Advance payment forfeited according to cancellation policy (less than 15 days notice before event).`
  };
}

/**
 * PHASE 15: Fetch Transaction History
 */
async function getTransactionHistory(userId, role = 'customer') {
  const allTx = await firestore.getCollection('transactions');
  let userTx = [];

  if (role === 'owner') {
    userTx = allTx.filter(t => t.ownerId === userId);
  } else if (role === 'admin') {
    userTx = allTx;
  } else {
    userTx = allTx.filter(t => t.customerId === userId);
  }

  // Sort latest first
  userTx.sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0));
  return userTx;
}

/**
 * PHASE 15: Get Payment for Booking
 */
async function getBookingPayments(bookingId) {
  const allTx = await firestore.getCollection('transactions');
  return allTx.filter(t => t.bookingId === bookingId);
}

module.exports = {
  createOrder,
  verifyPayment,
  processRefund,
  getTransactionHistory,
  getBookingPayments,
  generateSignature,
  verifySignature
};
