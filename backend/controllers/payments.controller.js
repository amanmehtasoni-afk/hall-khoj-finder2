/**
 * Hall Khoj Finder — Payments Controller (Phase 15)
 * Handles order creation, HMAC signature verification, refund requests and ledger history.
 */

const paymentService = require('../services/payment.service');
const { successResponse, errorResponse } = require('../utils/response');

async function createOrder(req, res, next) {
  try {
    const { bookingId } = req.body;
    const customerId = req.user?.id || req.body.customerId;

    if (!bookingId) {
      return errorResponse(res, 'Booking ID is required to create a payment order', 'VALIDATION_ERROR', 400);
    }

    const order = await paymentService.createOrder({
      bookingId,
      customerId
    });

    return successResponse(res, order, 'Payment order created successfully', 201);
  } catch (err) {
    if (err.statusCode) {
      return errorResponse(res, err.message, err.code || 'PAYMENT_ORDER_ERROR', err.statusCode);
    }
    next(err);
  }
}

async function verify(req, res, next) {
  try {
    const { orderId, paymentId, signature, bookingId, paymentMethod } = req.body;

    if (!orderId || !paymentId || !signature) {
      return errorResponse(res, 'orderId, paymentId, and signature are required for verification', 'VALIDATION_ERROR', 400);
    }

    const verificationResult = await paymentService.verifyPayment({
      orderId,
      paymentId,
      signature,
      bookingId,
      paymentMethod: paymentMethod || req.body.method || 'UPI'
    });

    return successResponse(res, verificationResult, 'Payment verified and booking confirmed successfully');
  } catch (err) {
    if (err.statusCode) {
      return errorResponse(res, err.message, err.code || 'VERIFICATION_ERROR', err.statusCode);
    }
    next(err);
  }
}

async function refund(req, res, next) {
  try {
    const { bookingId, reason } = req.body;
    const requesterId = req.user?.id || req.body.requesterId;

    if (!bookingId) {
      return errorResponse(res, 'Booking ID is required for refund', 'VALIDATION_ERROR', 400);
    }

    const refundResult = await paymentService.processRefund({
      bookingId,
      requesterId,
      reason
    });

    return successResponse(res, refundResult, 'Refund request processed successfully');
  } catch (err) {
    if (err.statusCode) {
      return errorResponse(res, err.message, err.code || 'REFUND_ERROR', err.statusCode);
    }
    next(err);
  }
}

async function getHistory(req, res, next) {
  try {
    const userId = req.user?.id || req.query.userId;
    const role = req.user?.role || req.query.role || 'customer';

    if (!userId) {
      return errorResponse(res, 'User ID is required', 'AUTH_REQUIRED', 401);
    }

    const transactions = await paymentService.getTransactionHistory(userId, role);
    return successResponse(res, { transactions, count: transactions.length }, 'Transaction history fetched successfully');
  } catch (err) {
    next(err);
  }
}

async function getByBooking(req, res, next) {
  try {
    const { bookingId } = req.params;
    if (!bookingId) {
      return errorResponse(res, 'Booking ID is required', 'VALIDATION_ERROR', 400);
    }

    const transactions = await paymentService.getBookingPayments(bookingId);
    return successResponse(res, { transactions }, 'Booking payment ledger retrieved');
  } catch (err) {
    next(err);
  }
}

module.exports = {
  createOrder,
  verify,
  refund,
  getHistory,
  getByBooking
};
